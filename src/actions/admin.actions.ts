"use server";

import { db } from "@/db";
import {
  applications,
  certificates,
  users,
  roles,
  userRoles,
  businesses,
  auditors,
  mentors,
  auditLogs,
} from "@/db/schema";
import { eq, desc, count, and, or, ilike, inArray } from "drizzle-orm";
import { getSession } from "@/lib/auth/session";

async function assertAdmin() {
  const session = await getSession();
  if (!session) throw new Error("Unauthorized: Anda harus login.");
  const allowed = ["SUPER_ADMIN", "ADMIN", "LEADER"].some((r) =>
    session.roles.includes(r as any)
  );
  if (!allowed) throw new Error("Forbidden: Akses khusus Admin/Pimpinan.");
  return session;
}

export async function getAdminDashboardStatsAction() {
  try {
    await assertAdmin();

    const [appCount] = await db.select({ total: count() }).from(applications);
    const [certCount] = await db.select({ total: count() }).from(certificates);
    const [userCount] = await db.select({ total: count() }).from(users);
    const [bizCount] = await db.select({ total: count() }).from(businesses);

    // Recent applications
    const recentApps = await db.query.applications.findMany({
      with: { business: true },
      orderBy: [desc(applications.createdAt)],
      limit: 5,
    });

    // Recent audit logs
    const recentLogs = await db.query.auditLogs.findMany({
      with: { user: true },
      orderBy: [desc(auditLogs.createdAt)],
      limit: 6,
    });

    return {
      success: true as const,
      data: {
        totalApplications: appCount.total,
        totalCertificates: certCount.total,
        totalUsers: userCount.total,
        totalBusinesses: bizCount.total,
        recentApplications: recentApps,
        recentAuditLogs: recentLogs,
      },
    };
  } catch (error: any) {
    return { success: false as const, error: error.message };
  }
}

export async function getAuditLogsAction(params?: { page?: number; limit?: number }) {
  try {
    await assertAdmin();
    const page = Math.max(1, params?.page || 1);
    const limit = Math.max(1, params?.limit || 20);
    const offset = (page - 1) * limit;

    const items = await db.query.auditLogs.findMany({
      with: {
        user: true,
      },
      orderBy: [desc(auditLogs.createdAt)],
      limit,
      offset,
    });

    const [totalRow] = await db.select({ total: count() }).from(auditLogs);

    return {
      success: true as const,
      data: {
        items,
        total: totalRow.total,
        page,
        limit,
        totalPages: Math.ceil(totalRow.total / limit),
      },
    };
  } catch (error: any) {
    return { success: false as const, error: error.message };
  }
}

export async function getUsersListAction(params?: {
  role?: string;
  search?: string;
  page?: number;
  limit?: number;
}) {
  try {
    await assertAdmin();
    const page = Math.max(1, params?.page || 1);
    const limit = Math.max(1, params?.limit || 10);
    const offset = (page - 1) * limit;
    const search = params?.search?.trim();
    const roleFilter = params?.role || "ALL";

    // Target role names for filtering
    let targetRoles: string[] = [];
    if (roleFilter === "BUSINESS_OWNER") {
      targetRoles = ["BUSINESS_OWNER"];
    } else if (roleFilter === "AUDITOR") {
      targetRoles = ["AUDITOR"];
    } else if (roleFilter === "MENTOR") {
      targetRoles = ["MENTOR"];
    } else if (roleFilter === "VERIFIER") {
      targetRoles = ["VERIFIER"];
    } else if (roleFilter === "ADMIN") {
      targetRoles = ["ADMIN", "SUPER_ADMIN", "LEADER"];
    }

    // Role IDs matching the filter
    let matchingUserIds: string[] | null = null;
    if (targetRoles.length > 0) {
      const dbRoles = await db.query.roles.findMany({
        where: inArray(roles.name, targetRoles as any),
      });
      const roleIds = dbRoles.map((r) => r.id);
      if (roleIds.length > 0) {
        const uRoles = await db.query.userRoles.findMany({
          where: inArray(userRoles.roleId, roleIds),
        });
        matchingUserIds = uRoles.map((ur) => ur.userId);
      } else {
        matchingUserIds = [];
      }
    }

    // Conditions
    const conditions: any[] = [];
    if (matchingUserIds !== null) {
      if (matchingUserIds.length === 0) {
        // Return empty if no users match
        return {
          success: true as const,
          data: {
            items: [],
            total: 0,
            page,
            limit,
            totalPages: 1,
            counts: {
              ALL: 0,
              BUSINESS_OWNER: 0,
              AUDITOR: 0,
              MENTOR: 0,
              VERIFIER: 0,
              ADMIN: 0,
            },
          },
        };
      }
      conditions.push(inArray(users.id, matchingUserIds));
    }

    if (search) {
      conditions.push(
        or(
          ilike(users.fullName, `%${search}%`),
          ilike(users.email, `%${search}%`),
          ilike(users.phoneNumber, `%${search}%`)
        )
      );
    }

    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

    const rawUsers = await db.query.users.findMany({
      where: whereClause,
      with: {
        userRoles: {
          with: {
            role: true,
          },
        },
      },
      orderBy: [desc(users.createdAt)],
      limit,
      offset,
    });

    const [totalRow] = await db
      .select({ total: count() })
      .from(users)
      .where(whereClause);

    // Fetch supplementary profile data for displayed users
    const userIds = rawUsers.map((u) => u.id);
    const [bizList, audList, mntList] = await Promise.all([
      userIds.length > 0
        ? db.query.businesses.findMany({ where: inArray(businesses.userId, userIds) })
        : [],
      userIds.length > 0
        ? db.query.auditors.findMany({ where: inArray(auditors.userId, userIds) })
        : [],
      userIds.length > 0
        ? db.query.mentors.findMany({ where: inArray(mentors.userId, userIds) })
        : [],
    ]);

    const bizMap = new Map(bizList.map((b) => [b.userId, b]));
    const audMap = new Map(audList.map((a) => [a.userId, a]));
    const mntMap = new Map(mntList.map((m) => [m.userId, m]));

    const items = rawUsers.map((u) => ({
      ...u,
      business: bizMap.get(u.id) || null,
      auditor: audMap.get(u.id) || null,
      mentor: mntMap.get(u.id) || null,
    }));

    // Calculate tab statistics
    const allUserRoles = await db.query.userRoles.findMany({
      with: { role: true },
    });

    const counts = {
      ALL: await db.select({ total: count() }).from(users).then((r) => r[0].total),
      BUSINESS_OWNER: allUserRoles.filter((ur) => ur.role.name === "BUSINESS_OWNER").length,
      AUDITOR: allUserRoles.filter((ur) => ur.role.name === "AUDITOR").length,
      MENTOR: allUserRoles.filter((ur) => ur.role.name === "MENTOR").length,
      VERIFIER: allUserRoles.filter((ur) => ur.role.name === "VERIFIER").length,
      ADMIN: allUserRoles.filter((ur) =>
        ["ADMIN", "SUPER_ADMIN", "LEADER"].includes(ur.role.name)
      ).length,
    };

    return {
      success: true as const,
      data: {
        items,
        total: totalRow?.total || 0,
        page,
        limit,
        totalPages: Math.ceil((totalRow?.total || 0) / limit) || 1,
        counts,
      },
    };
  } catch (error: any) {
    return { success: false as const, error: error.message };
  }
}

export async function updateUserByAdminAction(params: {
  userId: string;
  fullName: string;
  phoneNumber?: string;
  isActive: boolean;
  roleName?: string;
  newPassword?: string;
  businessName?: string;
  nib?: string;
  lphName?: string;
  auditorRegNumber?: string;
  institutionName?: string;
  mentorRegNumber?: string;
}) {
  try {
    const session = await assertAdmin();

    const existingUser = await db.query.users.findFirst({
      where: eq(users.id, params.userId),
    });
    if (!existingUser) {
      throw new Error("Pengguna tidak ditemukan.");
    }

    // Update user base fields
    const updateData: any = {
      fullName: params.fullName,
      phoneNumber: params.phoneNumber || null,
      isActive: params.isActive,
      updatedAt: new Date(),
    };

    if (params.newPassword && params.newPassword.trim().length >= 6) {
      const { hashPassword } = await import("@/lib/auth/password");
      updateData.passwordHash = await hashPassword(params.newPassword.trim());
    }

    await db.update(users).set(updateData).where(eq(users.id, params.userId));

    // Update Role if provided
    if (params.roleName) {
      const targetRole = await db.query.roles.findFirst({
        where: eq(roles.name, params.roleName as any),
      });
      if (targetRole) {
        await db.delete(userRoles).where(eq(userRoles.userId, params.userId));
        await db.insert(userRoles).values({
          userId: params.userId,
          roleId: targetRole.id,
        });
      }
    }

    // Update related business info if exists
    if (params.businessName || params.nib) {
      const biz = await db.query.businesses.findFirst({
        where: eq(businesses.userId, params.userId),
      });
      if (biz) {
        await db.update(businesses).set({
          name: params.businessName || biz.name,
          nib: params.nib || biz.nib,
          updatedAt: new Date(),
        }).where(eq(businesses.id, biz.id));
      }
    }

    // Update related auditor info if exists
    if (params.lphName || params.auditorRegNumber) {
      const aud = await db.query.auditors.findFirst({
        where: eq(auditors.userId, params.userId),
      });
      if (aud) {
        await db.update(auditors).set({
          lphName: params.lphName || aud.lphName,
          auditorRegNumber: params.auditorRegNumber || aud.auditorRegNumber,
          updatedAt: new Date(),
        }).where(eq(auditors.id, aud.id));
      }
    }

    // Update related mentor info if exists
    if (params.institutionName || params.mentorRegNumber) {
      const mnt = await db.query.mentors.findFirst({
        where: eq(mentors.userId, params.userId),
      });
      if (mnt) {
        await db.update(mentors).set({
          institutionName: params.institutionName || mnt.institutionName,
          registrationNumber: params.mentorRegNumber || mnt.registrationNumber,
          updatedAt: new Date(),
        }).where(eq(mentors.id, mnt.id));
      }
    }

    // Audit log
    await db.insert(auditLogs).values({
      userId: session.userId,
      action: "USER_UPDATED",
      entityType: "user",
      entityId: params.userId,
      oldValues: { fullName: existingUser.fullName, isActive: existingUser.isActive },
      newValues: { fullName: params.fullName, isActive: params.isActive, role: params.roleName },
    });

    return { success: true as const, message: "Data pengguna berhasil diperbarui." };
  } catch (error: any) {
    return { success: false as const, error: error.message || "Gagal memperbarui data pengguna." };
  }
}

export async function createUserByAdminAction(params: {
  fullName: string;
  email: string;
  password: string;
  phoneNumber?: string;
  roleName: string;
  lphName?: string;
  auditorRegNumber?: string;
  institutionName?: string;
  mentorRegNumber?: string;
  businessName?: string;
  nib?: string;
}) {
  try {
    const session = await assertAdmin();

    const cleanEmail = params.email.trim().toLowerCase();
    if (!cleanEmail || !params.fullName || !params.password) {
      throw new Error("Nama lengkap, email, dan password wajib diisi.");
    }
    if (params.password.length < 6) {
      throw new Error("Password minimal 6 karakter.");
    }

    // Check existing email
    const existing = await db.query.users.findFirst({
      where: eq(users.email, cleanEmail),
    });
    if (existing) {
      throw new Error(`Email ${cleanEmail} sudah terdaftar di sistem.`);
    }

    const { hashPassword } = await import("@/lib/auth/password");
    const passwordHash = await hashPassword(params.password);

    // 1. Insert User
    const [newUser] = await db
      .insert(users)
      .values({
        fullName: params.fullName.trim(),
        email: cleanEmail,
        passwordHash,
        phoneNumber: params.phoneNumber?.trim() || null,
        isActive: true,
      })
      .returning();

    // 2. Assign Role
    const targetRole = await db.query.roles.findFirst({
      where: eq(roles.name, params.roleName as any),
    });

    if (targetRole) {
      await db.insert(userRoles).values({
        userId: newUser.id,
        roleId: targetRole.id,
      });
    }

    // 3. Create Role-Specific Profiles
    if (params.roleName === "AUDITOR") {
      const regNo =
        params.auditorRegNumber?.trim() ||
        `AUD-${new Date().getFullYear()}-${Math.floor(10000 + Math.random() * 90000)}`;
      await db.insert(auditors).values({
        userId: newUser.id,
        lphName: params.lphName?.trim() || "LPH Utama Indonesia",
        auditorRegNumber: regNo,
        competencyField: "Pangan, Minuman & Bahan Olahan",
        isActive: true,
      });
    } else if (params.roleName === "MENTOR") {
      const regNo =
        params.mentorRegNumber?.trim() ||
        `PPH-${new Date().getFullYear()}-${Math.floor(10000 + Math.random() * 90000)}`;
      await db.insert(mentors).values({
        userId: newUser.id,
        institutionName: params.institutionName?.trim() || "LP3H Binaan Nasional",
        registrationNumber: regNo,
        isActive: true,
      });
    } else if (params.roleName === "BUSINESS_OWNER") {
      const randomNib = Math.floor(1000000000000 + Math.random() * 9000000000000).toString();
      const bName = params.businessName?.trim() || params.fullName;
      await db.insert(businesses).values({
        userId: newUser.id,
        name: bName,
        brandName: bName,
        businessType: "PERSEORANGAN",
        businessScale: "MIKRO",
        nib: params.nib?.trim() || randomNib,
        email: cleanEmail,
        phoneNumber: params.phoneNumber?.trim() || "081234567890",
        isActive: true,
      });
    }

    // 4. Audit Log
    await db.insert(auditLogs).values({
      userId: session.userId,
      action: "USER_CREATED",
      entityType: "user",
      entityId: newUser.id,
      newValues: {
        fullName: params.fullName,
        email: cleanEmail,
        role: params.roleName,
      },
    });

    return {
      success: true as const,
      message: `Akun ${params.fullName} (${params.roleName}) berhasil dibuat.`,
      data: newUser,
    };
  } catch (error: any) {
    return { success: false as const, error: error.message || "Gagal membuat akun pengguna." };
  }
}
