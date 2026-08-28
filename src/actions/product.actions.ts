"use server";

import { db } from "@/db";
import {
  products,
  productMaterials,
  businesses,
  auditLogs,
} from "@/db/schema";
import { eq, and, or, ilike, count, isNull } from "drizzle-orm";
import { productSchema, type ProductInput } from "@/lib/validation/product.validation";
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

export async function getProductsAction(params?: {
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
          ilike(products.name, `%${search}%`),
          ilike(products.brandName, `%${search}%`)
        )
      : undefined;

    const whereClause = searchCondition
      ? and(
          eq(products.businessId, businessId),
          isNull(products.deletedAt),
          searchCondition
        )
      : and(eq(products.businessId, businessId), isNull(products.deletedAt));

    const items = await db.query.products.findMany({
      where: whereClause,
      with: {
        category: true,
        productMaterials: {
          with: {
            material: true,
          },
        },
      },
      orderBy: (prod, { desc }) => [desc(prod.createdAt)],
      limit,
      offset,
    });

    const [totalRow] = await db
      .select({ total: count() })
      .from(products)
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

export async function createProductAction(
  input: ProductInput
): Promise<ActionResult<{ id: string }>> {
  try {
    const { session, businessId } = await getOwnerBusinessId();
    const validated = productSchema.safeParse(input);
    if (!validated.success) {
      return { success: false, error: "Validasi data produk gagal." };
    }

    const { materials: selectedMaterials, ...productData } = validated.data;

    // 1. Create Product
    const [newProduct] = await db
      .insert(products)
      .values({
        businessId,
        categoryId: productData.categoryId,
        productTypeId: productData.productTypeId || null,
        name: productData.name.trim(),
        brandName: productData.brandName.trim(),
        description: productData.description?.trim() || null,
        servingType: productData.servingType?.trim() || null,
        shelfLife: productData.shelfLife?.trim() || null,
        productionProcessDescription: productData.productionProcessDescription.trim(),
      })
      .returning();

    // 2. Link Materials (BOM Pivot)
    if (selectedMaterials.length > 0) {
      await db.insert(productMaterials).values(
        selectedMaterials.map((mat) => ({
          productId: newProduct.id,
          materialId: mat.materialId,
          usageDescription: mat.usageDescription?.trim() || null,
          isAlternativeMaterial: mat.isAlternativeMaterial,
        }))
      );
    }

    await db.insert(auditLogs).values({
      userId: session.userId,
      action: "CREATE_PRODUCT",
      entityType: "products",
      entityId: newProduct.id,
      newValues: validated.data,
    });

    revalidatePath("/dashboard/produk");
    return {
      success: true,
      data: { id: newProduct.id },
      message: "Produk beserta formulasi bahan (BOM) berhasil disimpan.",
    };
  } catch (error: any) {
    console.error("Create Product Error:", error);
    return { success: false, error: error.message || "Gagal membuat produk." };
  }
}

export async function deleteProductAction(id: string): Promise<ActionResult<void>> {
  try {
    const { session, businessId } = await getOwnerBusinessId();

    await db
      .update(products)
      .set({ deletedAt: new Date() })
      .where(and(eq(products.id, id), eq(products.businessId, businessId)));

    await db.insert(auditLogs).values({
      userId: session.userId,
      action: "DELETE_PRODUCT",
      entityType: "products",
      entityId: id,
    });

    revalidatePath("/dashboard/produk");
    return { success: true, data: undefined, message: "Produk berhasil dihapus." };
  } catch (error: any) {
    return { success: false, error: "Gagal menghapus produk." };
  }
}
