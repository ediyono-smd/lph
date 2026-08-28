"use server";

import { db } from "@/db";
import { materials, materialDocuments, businesses, auditLogs } from "@/db/schema";
import { eq, and, or, ilike, count, isNull } from "drizzle-orm";
import { materialSchema, type MaterialInput } from "@/lib/validation/material.validation";
import { getSession } from "@/lib/auth/session";
import { revalidatePath } from "next/cache";

export type ActionResult<T = unknown> =
  | { success: true; data: T; message?: string }
  | { success: false; error: string; errors?: Record<string, string[]> };

async function getOwnerBusinessId() {
  const session = await getSession();
  if (!session) throw new Error("Unauthorized: Anda harus login.");

  const business = await db.query.businesses.findFirst({
    where: eq(businesses.userId, session.userId),
  });

  if (!business) {
    throw new Error("Lengkapi data profil usaha Anda terlebih dahulu.");
  }

  return { session, businessId: business.id };
}

export async function getMaterialsAction(params?: {
  search?: string;
  page?: number;
  limit?: number;
}) {
  try {
    const { businessId } = await getOwnerBusinessId();
    const page = Math.max(1, params?.page || 1);
    const limit = Math.max(1, params?.limit || 20);
    const offset = (page - 1) * limit;
    const search = params?.search?.trim();

    const searchCondition = search
      ? or(
          ilike(materials.name, `%${search}%`),
          ilike(materials.manufacturer, `%${search}%`),
          ilike(materials.halalCertNumber, `%${search}%`)
        )
      : undefined;

    const whereClause = searchCondition
      ? and(
          eq(materials.businessId, businessId),
          isNull(materials.deletedAt),
          searchCondition
        )
      : and(eq(materials.businessId, businessId), isNull(materials.deletedAt));

    const items = await db.query.materials.findMany({
      where: whereClause,
      with: {
        category: true,
        documents: true,
      },
      orderBy: (mat, { desc }) => [desc(mat.createdAt)],
      limit,
      offset,
    });

    const [totalRow] = await db
      .select({ total: count() })
      .from(materials)
      .where(whereClause);

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

export async function createMaterialAction(
  input: MaterialInput
): Promise<ActionResult<{ id: string }>> {
  try {
    const { session, businessId } = await getOwnerBusinessId();
    const validated = materialSchema.safeParse(input);
    if (!validated.success) {
      return { success: false, error: "Validasi data bahan baku gagal." };
    }

    const [created] = await db
      .insert(materials)
      .values({
        businessId,
        categoryId: validated.data.categoryId,
        name: validated.data.name.trim(),
        tradeName: validated.data.tradeName?.trim() || null,
        manufacturer: validated.data.manufacturer.trim(),
        supplier: validated.data.supplier?.trim() || null,
        isHalalCertified: validated.data.isHalalCertified,
        halalCertNumber: validated.data.halalCertNumber?.trim() || null,
        certIssuer: validated.data.certIssuer?.trim() || null,
        certValidUntil: validated.data.certValidUntil
          ? new Date(validated.data.certValidUntil)
          : null,
      })
      .returning();

    await db.insert(auditLogs).values({
      userId: session.userId,
      action: "CREATE_MATERIAL",
      entityType: "materials",
      entityId: created.id,
      newValues: validated.data,
    });

    revalidatePath("/dashboard/bahan");
    return {
      success: true,
      data: { id: created.id },
      message: "Bahan baku berhasil didaftarkan.",
    };
  } catch (error: any) {
    return { success: false, error: error.message || "Gagal menyimpan bahan." };
  }
}

export async function updateMaterialAction(
  id: string,
  input: MaterialInput
): Promise<ActionResult<void>> {
  try {
    const { session, businessId } = await getOwnerBusinessId();
    const validated = materialSchema.safeParse(input);
    if (!validated.success) {
      return { success: false, error: "Validasi data bahan baku gagal." };
    }

    await db
      .update(materials)
      .set({
        categoryId: validated.data.categoryId,
        name: validated.data.name.trim(),
        tradeName: validated.data.tradeName?.trim() || null,
        manufacturer: validated.data.manufacturer.trim(),
        supplier: validated.data.supplier?.trim() || null,
        isHalalCertified: validated.data.isHalalCertified,
        halalCertNumber: validated.data.halalCertNumber?.trim() || null,
        certIssuer: validated.data.certIssuer?.trim() || null,
        certValidUntil: validated.data.certValidUntil
          ? new Date(validated.data.certValidUntil)
          : null,
        updatedAt: new Date(),
      })
      .where(and(eq(materials.id, id), eq(materials.businessId, businessId)));

    await db.insert(auditLogs).values({
      userId: session.userId,
      action: "UPDATE_MATERIAL",
      entityType: "materials",
      entityId: id,
      newValues: validated.data,
    });

    revalidatePath("/dashboard/bahan");
    return { success: true, data: undefined, message: "Bahan baku berhasil diperbarui." };
  } catch (error: any) {
    return { success: false, error: error.message || "Gagal memperbarui bahan." };
  }
}

export async function deleteMaterialAction(id: string): Promise<ActionResult<void>> {
  try {
    const { session, businessId } = await getOwnerBusinessId();

    await db
      .update(materials)
      .set({ deletedAt: new Date() })
      .where(and(eq(materials.id, id), eq(materials.businessId, businessId)));

    await db.insert(auditLogs).values({
      userId: session.userId,
      action: "DELETE_MATERIAL",
      entityType: "materials",
      entityId: id,
    });

    revalidatePath("/dashboard/bahan");
    return { success: true, data: undefined, message: "Bahan baku berhasil dihapus." };
  } catch (error: any) {
    return { success: false, error: "Gagal menghapus bahan baku." };
  }
}
