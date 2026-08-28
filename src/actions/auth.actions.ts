"use server";

import { db } from "@/db";
import { users, roles, userRoles, auditLogs, businesses } from "@/db/schema";
import { eq } from "drizzle-orm";
import {
  loginSchema,
  registerSchema,
  forgotPasswordSchema,
  changePasswordSchema,
  type LoginInput,
  type RegisterInput,
  type ForgotPasswordInput,
  type ChangePasswordInput,
} from "@/lib/validation/auth.validation";
import { hashPassword, comparePassword } from "@/lib/auth/password";
import {
  setSessionCookie,
  destroySession,
  getSession,
  type UserRoleType,
} from "@/lib/auth/session";
import { getDefaultDashboardRoute } from "@/lib/permissions/rbac";

export type ActionResult<T = unknown> =
  | { success: true; data: T; message?: string }
  | { success: false; error: string; errors?: Record<string, string[]> };

export async function loginAction(
  input: LoginInput
): Promise<ActionResult<{ redirectUrl: string }>> {
  try {
    const validated = loginSchema.safeParse(input);
    if (!validated.success) {
      const fieldErrors: Record<string, string[]> = {};
      validated.error.errors.forEach((err) => {
        const path = err.path.join(".");
        fieldErrors[path] = fieldErrors[path] || [];
        fieldErrors[path].push(err.message);
      });
      return {
        success: false,
        error: "Validasi data login gagal.",
        errors: fieldErrors,
      };
    }

    const { email, password } = validated.data;

    // 1. Find user by email
    const user = await db.query.users.findFirst({
      where: eq(users.email, email.toLowerCase().trim()),
      with: {
        userRoles: {
          with: {
            role: true,
          },
        },
      },
    });

    if (!user) {
      return {
        success: false,
        error: "Email atau kata sandi yang Anda masukkan salah.",
      };
    }

    if (!user.isActive) {
      return {
        success: false,
        error: "Akun Anda dinonaktifkan. Silakan hubungi Administrator.",
      };
    }

    // 2. Verify password
    const isPasswordValid = await comparePassword(password, user.passwordHash);
    if (!isPasswordValid) {
      return {
        success: false,
        error: "Email atau kata sandi yang Anda masukkan salah.",
      };
    }

    // 3. Extract user roles
    const userRoleNames = (user.userRoles
      ?.map((ur) => ur.role?.name)
      .filter(Boolean) || ["BUSINESS_OWNER"]) as UserRoleType[];

    const activeRole = userRoleNames[0] || "BUSINESS_OWNER";

    // 4. Find linked business (if business owner)
    let businessId: string | undefined = undefined;
    if (userRoleNames.includes("BUSINESS_OWNER")) {
      const business = await db.query.businesses.findFirst({
        where: eq(businesses.userId, user.id),
      });
      if (business) {
        businessId = business.id;
      }
    }

    // 5. Create session cookie
    await setSessionCookie({
      userId: user.id,
      email: user.email,
      fullName: user.fullName,
      roles: userRoleNames,
      activeRole,
      businessId,
    });

    // 6. Record Audit Log
    try {
      await db.insert(auditLogs).values({
        userId: user.id,
        action: "USER_LOGIN",
        entityType: "users",
        entityId: user.id,
        newValues: { email: user.email, role: activeRole },
      });
    } catch (auditErr) {
      console.warn("Gagal mencatat audit log login:", auditErr);
    }

    const redirectUrl = getDefaultDashboardRoute(activeRole);
    return {
      success: true,
      data: { redirectUrl },
      message: `Selamat datang kembali, ${user.fullName}!`,
    };
  } catch (error: any) {
    console.error("Login Action Error:", error);
    return {
      success: false,
      error: "Terjadi kesalahan pada server saat proses login.",
    };
  }
}

export async function registerAction(
  input: RegisterInput
): Promise<ActionResult<{ redirectUrl: string }>> {
  try {
    const validated = registerSchema.safeParse(input);
    if (!validated.success) {
      const fieldErrors: Record<string, string[]> = {};
      validated.error.errors.forEach((err) => {
        const path = err.path.join(".");
        fieldErrors[path] = fieldErrors[path] || [];
        fieldErrors[path].push(err.message);
      });
      return {
        success: false,
        error: "Validasi pendaftaran gagal. Mohon periksa isian formulir.",
        errors: fieldErrors,
      };
    }

    const { fullName, email, phoneNumber, password } = validated.data;
    const normalizedEmail = email.toLowerCase().trim();

    // 1. Check existing user
    const existing = await db.query.users.findFirst({
      where: eq(users.email, normalizedEmail),
    });

    if (existing) {
      return {
        success: false,
        error: "Email sudah terdaftar. Silakan masuk menggunakan akun Anda.",
      };
    }

    // 2. Hash password
    const hashedPassword = await hashPassword(password);

    // 3. Create user
    const [newUser] = await db
      .insert(users)
      .values({
        email: normalizedEmail,
        fullName: fullName.trim(),
        phoneNumber: phoneNumber.trim(),
        passwordHash: hashedPassword,
        isActive: true,
        emailVerifiedAt: new Date(),
      })
      .returning();

    // 4. Assign BUSINESS_OWNER role
    const businessOwnerRole = await db.query.roles.findFirst({
      where: eq(roles.name, "BUSINESS_OWNER"),
    });

    if (businessOwnerRole) {
      await db.insert(userRoles).values({
        userId: newUser.id,
        roleId: businessOwnerRole.id,
      });
    }

    // 5. Create Session
    await setSessionCookie({
      userId: newUser.id,
      email: newUser.email,
      fullName: newUser.fullName,
      roles: ["BUSINESS_OWNER"],
      activeRole: "BUSINESS_OWNER",
    });

    // 6. Record Audit Log
    try {
      await db.insert(auditLogs).values({
        userId: newUser.id,
        action: "USER_REGISTER",
        entityType: "users",
        entityId: newUser.id,
        newValues: { email: newUser.email, fullName: newUser.fullName },
      });
    } catch (auditErr) {
      console.warn("Gagal mencatat audit log register:", auditErr);
    }

    return {
      success: true,
      data: { redirectUrl: "/dashboard" },
      message: "Pendaftaran akun Pelaku Usaha berhasil!",
    };
  } catch (error: any) {
    console.error("Register Action Error:", error);
    return {
      success: false,
      error: "Gagal memproses pendaftaran akun. Silakan coba beberapa saat lagi.",
    };
  }
}

export async function logoutAction(): Promise<ActionResult<void>> {
  try {
    const session = await getSession();
    if (session) {
      try {
        await db.insert(auditLogs).values({
          userId: session.userId,
          action: "USER_LOGOUT",
          entityType: "users",
          entityId: session.userId,
        });
      } catch (e) {
        // ignore
      }
    }
    await destroySession();
    return { success: true, data: undefined, message: "Berhasil keluar." };
  } catch (error) {
    await destroySession();
    return { success: true, data: undefined };
  }
}

export async function forgotPasswordAction(
  input: ForgotPasswordInput
): Promise<ActionResult<void>> {
  try {
    const validated = forgotPasswordSchema.safeParse(input);
    if (!validated.success) {
      return { success: false, error: "Format email tidak valid." };
    }

    const user = await db.query.users.findFirst({
      where: eq(users.email, validated.data.email.toLowerCase().trim()),
    });

    // We return success even if user not found to prevent user enumeration
    return {
      success: true,
      data: undefined,
      message:
        "Jika email Anda terdaftar, instruksi pemulihan kata sandi telah dikirimkan.",
    };
  } catch (error) {
    return {
      success: false,
      error: "Gagal memproses permohonan reset password.",
    };
  }
}

export async function changePasswordAction(
  input: ChangePasswordInput
): Promise<ActionResult<void>> {
  try {
    const session = await getSession();
    if (!session) {
      return { success: false, error: "Sesi telah berakhir. Silakan login kembali." };
    }

    const validated = changePasswordSchema.safeParse(input);
    if (!validated.success) {
      return {
        success: false,
        error: "Data kata sandi baru tidak memenuhi syarat.",
      };
    }

    const user = await db.query.users.findFirst({
      where: eq(users.id, session.userId),
    });

    if (!user) {
      return { success: false, error: "Pengguna tidak ditemukan." };
    }

    const isOldValid = await comparePassword(
      validated.data.currentPassword,
      user.passwordHash
    );

    if (!isOldValid) {
      return { success: false, error: "Kata sandi saat ini salah." };
    }

    const newHash = await hashPassword(validated.data.newPassword);

    await db
      .update(users)
      .set({ passwordHash: newHash, updatedAt: new Date() })
      .where(eq(users.id, user.id));

    await db.insert(auditLogs).values({
      userId: user.id,
      action: "USER_CHANGE_PASSWORD",
      entityType: "users",
      entityId: user.id,
    });

    return {
      success: true,
      data: undefined,
      message: "Kata sandi berhasil diperbarui.",
    };
  } catch (error) {
    return {
      success: false,
      error: "Gagal memperbarui kata sandi.",
    };
  }
}
