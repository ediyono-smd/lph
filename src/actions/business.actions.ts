"use server";

import { db } from "@/db";
import {
  businesses,
  businessAddresses,
  businessSupervisors,
  businessDocuments,
  auditLogs,
} from "@/db/schema";
import { eq, and } from "drizzle-orm";
import {
  businessProfileSchema,
  businessAddressSchema,
  supervisorSchema,
  type BusinessProfileInput,
  type BusinessAddressInput,
  type SupervisorInput,
} from "@/lib/validation/business.validation";
import { getSession } from "@/lib/auth/session";
import { revalidatePath } from "next/cache";

export type ActionResult<T = unknown> =
  | { success: true; data: T; message?: string }
  | { success: false; error: string; errors?: Record<string, string[]> };

async function getAuthenticatedUser() {
  const session = await getSession();
  if (!session) throw new Error("Unauthorized: Anda harus login terlebih dahulu.");
  return session;
}

export async function getMyBusinessAction() {
  try {
    const session = await getAuthenticatedUser();
    const business = await db.query.businesses.findFirst({
      where: eq(businesses.userId, session.userId),
      with: {
        addresses: true,
        supervisors: true,
        documents: true,
      },
    });

    return { success: true as const, data: business || null };
  } catch (error: any) {
    return { success: false as const, error: error.message };
  }
}

export async function upsertBusinessProfileAction(
  input: BusinessProfileInput
): Promise<ActionResult<{ id: string }>> {
  try {
    const session = await getAuthenticatedUser();
    const validated = businessProfileSchema.safeParse(input);
    if (!validated.success) {
      return { success: false, error: "Validasi data profil usaha gagal." };
    }

    const existing = await db.query.businesses.findFirst({
      where: eq(businesses.userId, session.userId),
    });

    let businessId: string;

    if (existing) {
      await db
        .update(businesses)
        .set({
          ...validated.data,
          updatedAt: new Date(),
        })
        .where(eq(businesses.id, existing.id));
      businessId = existing.id;
    } else {
      const [created] = await db
        .insert(businesses)
        .values({
          userId: session.userId,
          ...validated.data,
        })
        .returning();
      businessId = created.id;
    }

    await db.insert(auditLogs).values({
      userId: session.userId,
      action: "UPSERT_BUSINESS_PROFILE",
      entityType: "businesses",
      entityId: businessId,
      newValues: validated.data,
    });

    revalidatePath("/dashboard/profil-usaha");
    return {
      success: true,
      data: { id: businessId },
      message: "Profil badan usaha berhasil disimpan.",
    };
  } catch (error: any) {
    return { success: false, error: error.message || "Gagal menyimpan data usaha." };
  }
}

export async function upsertSupervisorAction(
  businessId: string,
  input: SupervisorInput
): Promise<ActionResult<void>> {
  try {
    const session = await getAuthenticatedUser();
    const validated = supervisorSchema.safeParse(input);
    if (!validated.success) {
      return { success: false, error: "Validasi data penyelia halal gagal." };
    }

    // Verify ownership
    const business = await db.query.businesses.findFirst({
      where: and(eq(businesses.id, businessId), eq(businesses.userId, session.userId)),
    });
    if (!business) {
      return { success: false, error: "Badan usaha tidak ditemukan atau tidak memiliki hak akses." };
    }

    const existingSupervisor = await db.query.businessSupervisors.findFirst({
      where: eq(businessSupervisors.businessId, businessId),
    });

    if (existingSupervisor) {
      await db
        .update(businessSupervisors)
        .set({
          ...validated.data,
          updatedAt: new Date(),
        })
        .where(eq(businessSupervisors.id, existingSupervisor.id));
    } else {
      await db.insert(businessSupervisors).values({
        businessId,
        ...validated.data,
      });
    }

    revalidatePath("/dashboard/profil-usaha");
    return {
      success: true,
      data: undefined,
      message: "Data Penyelia Halal berhasil disimpan.",
    };
  } catch (error: any) {
    return { success: false, error: error.message || "Gagal menyimpan data penyelia." };
  }
}
