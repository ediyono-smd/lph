"use server";

import { db } from "@/db";
import {
  applications,
  applicationProducts,
  applicationDocuments,
  applicationStatusHistories,
  businesses,
  products,
  productMaterials,
  auditLogs,
  notifications,
} from "@/db/schema";
import { eq, and, desc, count, inArray } from "drizzle-orm";
import {
  applicationDraftSchema,
  correctionResponseSchema,
  type ApplicationDraftInput,
  type CorrectionResponseInput,
} from "@/lib/validation/application.validation";
import { getSession } from "@/lib/auth/session";
import { revalidatePath } from "next/cache";

export type ActionResult<T = unknown> =
  | { success: true; data: T; message?: string }
  | { success: false; error: string; errors?: Record<string, string[]> };

async function getOwnerBusiness() {
  const session = await getSession();
  if (!session) throw new Error("Unauthorized: Anda harus login terlebih dahulu.");

  const business = await db.query.businesses.findFirst({
    where: eq(businesses.userId, session.userId),
    with: {
      supervisors: true,
      addresses: true,
    },
  });

  if (!business) {
    throw new Error("Lengkapi data Profil Badan Usaha sebelum membuat pengajuan.");
  }

  return { session, business };
}

function generateApplicationNumber(): string {
  const year = new Date().getFullYear();
  const randomSuffix = Math.floor(100000 + Math.random() * 900000);
  return `APP-${year}-${randomSuffix}`;
}

export async function createAndSubmitApplicationAction(
  input: ApplicationDraftInput
): Promise<ActionResult<{ id: string; applicationNumber: string }>> {
  try {
    const { session, business } = await getOwnerBusiness();

    // 1. Validate Input
    const validated = applicationDraftSchema.safeParse(input);
    if (!validated.success) {
      return { success: false, error: "Validasi pengajuan gagal." };
    }

    // 2. Pre-flight Validation (Profil Usaha & Penyelia Halal)
    if (!business.nib || business.nib.length !== 13) {
      return {
        success: false,
        error: "Nomor Induk Berusaha (NIB) 13 digit belum terdaftar di profil usaha.",
      };
    }

    if (!business.supervisors || business.supervisors.length === 0) {
      return {
        success: false,
        error: "Data Penyelia Halal wajib diisi di menu Profil Usaha sebelum mengajukan sertifikasi.",
      };
    }

    // 3. Verify Selected Products and their BOM
    const selectedProducts = await db.query.products.findMany({
      where: and(
        eq(products.businessId, business.id),
        inArray(products.id, validated.data.productIds)
      ),
      with: {
        productMaterials: true,
      },
    });

    if (selectedProducts.length !== validated.data.productIds.length) {
      return { success: false, error: "Beberapa produk yang dipilih tidak ditemukan." };
    }

    for (const p of selectedProducts) {
      if (!p.productMaterials || p.productMaterials.length === 0) {
        return {
          success: false,
          error: `Produk "${p.name}" belum memiliki komposisi bahan baku (BOM). Lengkapi bahan di katalog produk.`,
        };
      }
    }

    // 4. Create Application Record
    const applicationNumber = generateApplicationNumber();
    const [newApp] = await db
      .insert(applications)
      .values({
        businessId: business.id,
        applicationNumber,
        schemeType: validated.data.schemeType,
        status: "SUBMITTED", // Directly submitted on complete form
        submissionDate: new Date(),
        notes: validated.data.notes?.trim() || null,
        createdById: session.userId,
      })
      .returning();

    // 5. Link Products to Application
    await db.insert(applicationProducts).values(
      validated.data.productIds.map((pid) => ({
        applicationId: newApp.id,
        productId: pid,
      }))
    );

    // 6. Create Initial Status History
    await db.insert(applicationStatusHistories).values({
      applicationId: newApp.id,
      previousStatus: "DRAFT",
      newStatus: "SUBMITTED",
      changedById: session.userId,
      notes: "Pengajuan sertifikasi halal berhasil dikirim oleh Pelaku Usaha.",
    });

    // 7. Record Audit Log
    await db.insert(auditLogs).values({
      userId: session.userId,
      action: "SUBMIT_APPLICATION",
      entityType: "applications",
      entityId: newApp.id,
      newValues: {
        applicationNumber,
        schemeType: validated.data.schemeType,
        productCount: validated.data.productIds.length,
      },
    });

    // 8. Create In-App Notification
    await db.insert(notifications).values({
      userId: session.userId,
      title: "Pengajuan Sertifikasi Terkirim",
      message: `Pengajuan sertifikasi nomor ${applicationNumber} telah berhasil diajukan dan sedang menunggu verifikasi dokumen.`,
      type: "APPLICATION_STATUS",
      actionUrl: `/dashboard/pengajuan/${newApp.id}`,
    });

    revalidatePath("/dashboard/pengajuan");
    return {
      success: true,
      data: { id: newApp.id, applicationNumber },
      message: "Pengajuan sertifikasi halal Anda berhasil dikirim!",
    };
  } catch (error: any) {
    console.error("Create Application Error:", error);
    return { success: false, error: error.message || "Gagal membuat pengajuan." };
  }
}

export async function getMyApplicationsAction(params?: {
  page?: number;
  limit?: number;
}) {
  try {
    const { business } = await getOwnerBusiness();
    const page = Math.max(1, params?.page || 1);
    const limit = Math.max(1, params?.limit || 20);
    const offset = (page - 1) * limit;

    const items = await db.query.applications.findMany({
      where: eq(applications.businessId, business.id),
      with: {
        products: {
          with: {
            product: true,
          },
        },
        statusHistories: {
          orderBy: (h, { desc }) => [desc(h.createdAt)],
          limit: 1,
        },
      },
      orderBy: [desc(applications.createdAt)],
      limit,
      offset,
    });

    const [totalRow] = await db
      .select({ total: count() })
      .from(applications)
      .where(eq(applications.businessId, business.id));

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

export async function getApplicationDetailAction(applicationId: string) {
  try {
    const session = await getSession();
    if (!session) throw new Error("Unauthorized");

    const app = await db.query.applications.findFirst({
      where: eq(applications.id, applicationId),
      with: {
        business: {
          with: {
            supervisors: true,
            addresses: true,
          },
        },
        products: {
          with: {
            product: {
              with: {
                category: true,
                productMaterials: {
                  with: {
                    material: true,
                  },
                },
              },
            },
          },
        },
        documents: true,
        checklists: {
          with: {
            verifiedBy: true,
          },
        },
        statusHistories: {
          with: {
            changedBy: true,
          },
          orderBy: (h, { asc }) => [asc(h.createdAt)],
        },
      },
    });

    if (!app) {
      return { success: false as const, error: "Pengajuan tidak ditemukan." };
    }

    return { success: true as const, data: app };
  } catch (error: any) {
    return { success: false as const, error: error.message };
  }
}

export async function resubmitCorrectionAction(
  input: CorrectionResponseInput
): Promise<ActionResult<void>> {
  try {
    const { session, business } = await getOwnerBusiness();
    const validated = correctionResponseSchema.safeParse(input);
    if (!validated.success) {
      return { success: false, error: "Validasi keterangan perbaikan gagal." };
    }

    const app = await db.query.applications.findFirst({
      where: and(
        eq(applications.id, validated.data.applicationId),
        eq(applications.businessId, business.id)
      ),
    });

    if (!app) {
      return { success: false, error: "Pengajuan tidak ditemukan." };
    }

    if (app.status !== "NEED_CORRECTION") {
      return {
        success: false,
        error: "Pengajuan ini tidak sedang dalam status Perlu Perbaikan (Need Correction).",
      };
    }

    // Update status back to SUBMITTED
    await db
      .update(applications)
      .set({
        status: "SUBMITTED",
        updatedAt: new Date(),
      })
      .where(eq(applications.id, app.id));

    // Record Status History
    await db.insert(applicationStatusHistories).values({
      applicationId: app.id,
      previousStatus: "NEED_CORRECTION",
      newStatus: "SUBMITTED",
      changedById: session.userId,
      notes: `Perbaikan dikirim ulang oleh Pelaku Usaha: ${validated.data.correctionNotes}`,
    });

    // Record Audit Log
    await db.insert(auditLogs).values({
      userId: session.userId,
      action: "RESUBMIT_CORRECTION",
      entityType: "applications",
      entityId: app.id,
      newValues: { notes: validated.data.correctionNotes },
    });

    revalidatePath(`/dashboard/pengajuan/${app.id}`);
    revalidatePath("/dashboard/perbaikan");
    return {
      success: true,
      data: undefined,
      message: "Perbaikan dokumen berhasil dikirim ulang ke tim verifikator!",
    };
  } catch (error: any) {
    return { success: false, error: error.message || "Gagal mengirimkan perbaikan." };
  }
}
