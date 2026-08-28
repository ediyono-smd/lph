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
