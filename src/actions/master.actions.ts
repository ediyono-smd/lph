"use server";

import { db } from "@/db";
import {
  productCategories,
  materialCategories,
  provinces,
  cities,
  auditLogs,
} from "@/db/schema";
import { eq, ilike, or, and, desc, sql, count } from "drizzle-orm";
import {
  productCategorySchema,
  materialCategorySchema,
  provinceSchema,
  citySchema,
  type ProductCategoryInput,
  type MaterialCategoryInput,
  type ProvinceInput,
  type CityInput,
} from "@/lib/validation/master.validation";
import { getSession } from "@/lib/auth/session";
import { revalidatePath } from "next/cache";

export type ActionResult<T = unknown> =
  | { success: true; data: T; message?: string }
  | { success: false; error: string; errors?: Record<string, string[]> };

async function assertAdmin() {
  const session = await getSession();
  if (!session) throw new Error("Unauthorized: Anda harus login.");
  const isAuthorized =
    session.roles.includes("SUPER_ADMIN") || session.roles.includes("ADMIN");
  if (!isAuthorized) {
    throw new Error("Forbidden: Hanya Administrator yang berhak mengubah Master Data.");
  }
  return session;
}

// ==========================================
// 1. PRODUCT CATEGORIES
// ==========================================

export async function getProductCategoriesAction(params?: {
  search?: string;
  page?: number;
  limit?: number;
}) {
  try {
    const page = Math.max(1, params?.page || 1);
    const limit = Math.max(1, params?.limit || 20);
    const offset = (page - 1) * limit;
    const search = params?.search?.trim();

    const whereClause = search
      ? or(
          ilike(productCategories.name, `%${search}%`),
          ilike(productCategories.code, `%${search}%`)
        )
      : undefined;

    const data = await db
      .select()
      .from(productCategories)
      .where(whereClause)
      .orderBy(productCategories.name)
      .limit(limit)
      .offset(offset);

    const [totalRow] = await db
      .select({ total: count() })
      .from(productCategories)
      .where(whereClause);

    return {
      success: true as const,
      data: {
        items: data,
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

export async function createProductCategoryAction(
  input: ProductCategoryInput
): Promise<ActionResult<{ id: string }>> {
  try {
    const session = await assertAdmin();
    const validated = productCategorySchema.safeParse(input);
    if (!validated.success) {
      return { success: false, error: "Validasi data gagal." };
    }

    const [created] = await db
      .insert(productCategories)
      .values(validated.data)
      .returning();

    await db.insert(auditLogs).values({
      userId: session.userId,
      action: "CREATE_PRODUCT_CATEGORY",
      entityType: "product_categories",
      entityId: created.id,
      newValues: validated.data,
    });

    revalidatePath("/admin/master/kategori-produk");
    return {
      success: true,
      data: { id: created.id },
      message: "Kategori produk berhasil ditambahkan.",
    };
  } catch (error: any) {
    return { success: false, error: error.message || "Gagal membuat kategori produk." };
  }
}

export async function updateProductCategoryAction(
  id: string,
  input: ProductCategoryInput
): Promise<ActionResult<void>> {
  try {
    const session = await assertAdmin();
    const validated = productCategorySchema.safeParse(input);
    if (!validated.success) {
      return { success: false, error: "Validasi data gagal." };
    }

    await db
      .update(productCategories)
      .set({
        ...validated.data,
        updatedAt: new Date(),
      })
      .where(eq(productCategories.id, id));

    await db.insert(auditLogs).values({
      userId: session.userId,
      action: "UPDATE_PRODUCT_CATEGORY",
      entityType: "product_categories",
      entityId: id,
      newValues: validated.data,
    });

    revalidatePath("/admin/master/kategori-produk");
    return { success: true, data: undefined, message: "Kategori produk berhasil diperbarui." };
  } catch (error: any) {
    return { success: false, error: error.message || "Gagal memperbarui kategori produk." };
  }
}

export async function deleteProductCategoryAction(
  id: string
): Promise<ActionResult<void>> {
  try {
    const session = await assertAdmin();
    await db.delete(productCategories).where(eq(productCategories.id, id));

    await db.insert(auditLogs).values({
      userId: session.userId,
      action: "DELETE_PRODUCT_CATEGORY",
      entityType: "product_categories",
      entityId: id,
    });

    revalidatePath("/admin/master/kategori-produk");
    return { success: true, data: undefined, message: "Kategori produk berhasil dihapus." };
  } catch (error: any) {
    return { success: false, error: "Kategori ini sedang digunakan oleh produk aktif dan tidak dapat dihapus." };
  }
}

// ==========================================
// 2. MATERIAL CATEGORIES
// ==========================================

export async function getMaterialCategoriesAction(params?: {
  search?: string;
  page?: number;
  limit?: number;
}) {
  try {
    const page = Math.max(1, params?.page || 1);
    const limit = Math.max(1, params?.limit || 20);
    const offset = (page - 1) * limit;
    const search = params?.search?.trim();

    const whereClause = search
      ? or(
          ilike(materialCategories.name, `%${search}%`),
          ilike(materialCategories.code, `%${search}%`)
        )
      : undefined;

    const data = await db
      .select()
      .from(materialCategories)
      .where(whereClause)
      .orderBy(materialCategories.name)
      .limit(limit)
      .offset(offset);

    const [totalRow] = await db
      .select({ total: count() })
      .from(materialCategories)
      .where(whereClause);

    return {
      success: true as const,
      data: {
        items: data,
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

export async function createMaterialCategoryAction(
  input: MaterialCategoryInput
): Promise<ActionResult<{ id: string }>> {
  try {
    const session = await assertAdmin();
    const validated = materialCategorySchema.safeParse(input);
    if (!validated.success) {
      return { success: false, error: "Validasi data gagal." };
    }

    const [created] = await db
      .insert(materialCategories)
      .values(validated.data)
      .returning();

    await db.insert(auditLogs).values({
      userId: session.userId,
      action: "CREATE_MATERIAL_CATEGORY",
      entityType: "material_categories",
      entityId: created.id,
      newValues: validated.data,
    });

    revalidatePath("/admin/master/kategori-bahan");
    return {
      success: true,
      data: { id: created.id },
      message: "Kategori bahan berhasil ditambahkan.",
    };
  } catch (error: any) {
    return { success: false, error: error.message || "Gagal membuat kategori bahan." };
  }
}

export async function updateMaterialCategoryAction(
  id: string,
  input: MaterialCategoryInput
): Promise<ActionResult<void>> {
  try {
    const session = await assertAdmin();
    const validated = materialCategorySchema.safeParse(input);
    if (!validated.success) {
      return { success: false, error: "Validasi data gagal." };
    }

    await db
      .update(materialCategories)
      .set({
        ...validated.data,
        updatedAt: new Date(),
      })
      .where(eq(materialCategories.id, id));

    await db.insert(auditLogs).values({
      userId: session.userId,
      action: "UPDATE_MATERIAL_CATEGORY",
      entityType: "material_categories",
      entityId: id,
      newValues: validated.data,
    });

    revalidatePath("/admin/master/kategori-bahan");
    return { success: true, data: undefined, message: "Kategori bahan berhasil diperbarui." };
  } catch (error: any) {
    return { success: false, error: error.message || "Gagal memperbarui kategori bahan." };
  }
}

export async function deleteMaterialCategoryAction(
  id: string
): Promise<ActionResult<void>> {
  try {
    const session = await assertAdmin();
    await db.delete(materialCategories).where(eq(materialCategories.id, id));

    await db.insert(auditLogs).values({
      userId: session.userId,
      action: "DELETE_MATERIAL_CATEGORY",
      entityType: "material_categories",
      entityId: id,
    });

    revalidatePath("/admin/master/kategori-bahan");
    return { success: true, data: undefined, message: "Kategori bahan berhasil dihapus." };
  } catch (error: any) {
    return { success: false, error: "Kategori bahan ini sedang digunakan oleh bahan terdaftar." };
  }
}

// ==========================================
// 3. REGIONAL / WILAYAH (PROVINCES & CITIES)
// ==========================================

export async function getProvincesAction() {
  try {
    const items = await db.select().from(provinces).orderBy(provinces.name);
    return { success: true as const, data: items };
  } catch (error: any) {
    return { success: false as const, error: error.message };
  }
}

export async function getCitiesByProvinceAction(provinceId: string) {
  try {
    const items = await db
      .select()
      .from(cities)
      .where(eq(cities.provinceId, provinceId))
      .orderBy(cities.name);
    return { success: true as const, data: items };
  } catch (error: any) {
    return { success: false as const, error: error.message };
  }
}

export async function createProvinceAction(
  input: ProvinceInput
): Promise<ActionResult<void>> {
  try {
    const session = await assertAdmin();
    const validated = provinceSchema.safeParse(input);
    if (!validated.success) return { success: false, error: "Validasi gagal." };

    await db.insert(provinces).values(validated.data);
    await db.insert(auditLogs).values({
      userId: session.userId,
      action: "CREATE_PROVINCE",
      entityType: "provinces",
      entityId: validated.data.id,
      newValues: validated.data,
    });

    revalidatePath("/admin/master/wilayah");
    return { success: true, data: undefined, message: "Provinsi berhasil ditambahkan." };
  } catch (error: any) {
    return { success: false, error: "Gagal menambahkan provinsi (kemungkinan kode sudah ada)." };
  }
}

export async function createCityAction(
  input: CityInput
): Promise<ActionResult<void>> {
  try {
    const session = await assertAdmin();
    const validated = citySchema.safeParse(input);
    if (!validated.success) return { success: false, error: "Validasi gagal." };

    await db.insert(cities).values(validated.data);
    await db.insert(auditLogs).values({
      userId: session.userId,
      action: "CREATE_CITY",
      entityType: "cities",
      entityId: validated.data.id,
      newValues: validated.data,
    });

    revalidatePath("/admin/master/wilayah");
    return { success: true, data: undefined, message: "Kota/Kabupaten berhasil ditambahkan." };
  } catch (error: any) {
    return { success: false, error: "Gagal menambahkan kota/kabupaten." };
  }
}
