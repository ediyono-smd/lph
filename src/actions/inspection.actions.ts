"use server";

import { db } from "@/db";
import {
  applications,
  inspectionResults,
  inspectionFindings,
  mentorAssignments,
  auditorAssignments,
  applicationStatusHistories,
  auditLogs,
  notifications,
} from "@/db/schema";
import { eq, and, desc } from "drizzle-orm";
import { getSession } from "@/lib/auth/session";
import { revalidatePath } from "next/cache";

export type ActionResult<T = unknown> =
  | { success: true; data: T; message?: string }
  | { success: false; error: string; errors?: Record<string, string[]> };

async function assertOfficer() {
  const session = await getSession();
  if (!session) throw new Error("Unauthorized: Anda harus login.");
  const allowed = ["SUPER_ADMIN", "MENTOR", "AUDITOR"].some((r) =>
    session.roles.includes(r as any)
  );
  if (!allowed) throw new Error("Forbidden: Akses khusus Pendamping/Auditor.");
  return session;
}

export async function getAssignedInspectionsAction() {
  try {
    const session = await assertOfficer();

    // Fetch applications where assigned
    const apps = await db.query.applications.findMany({
      where: (app, { or, eq }) =>
        or(
          eq(app.status, "MENTOR_ASSIGNED"),
          eq(app.status, "AUDITOR_ASSIGNED"),
          eq(app.status, "INSPECTION"),
          eq(app.status, "FINAL_REVIEW")
        ),
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
                productMaterials: {
                  with: {
                    material: true,
                  },
                },
              },
            },
          },
        },
      },
      orderBy: [desc(applications.updatedAt)],
    });

    return { success: true as const, data: apps };
  } catch (error: any) {
    return { success: false as const, error: error.message };
  }
}

export async function submitInspectionReportAction(params: {
  applicationId: string;
  recommendation: "LAYAK" | "PERLU_PERBAIKAN" | "TIDAK_LAYAK";
  summaryNotes: string;
  sjphScore: number;
  findings?: {
    findingType: string;
    description: string;
    correctiveActionRequired: string;
  }[];
}): Promise<ActionResult<void>> {
  try {
    const session = await assertOfficer();

    const app = await db.query.applications.findFirst({
      where: eq(applications.id, params.applicationId),
      with: { business: true },
    });

    if (!app) return { success: false, error: "Pengajuan tidak ditemukan." };

    // 1. Insert Inspection Result (LHP)
    const [result] = await db
      .insert(inspectionResults)
      .values({
        applicationId: app.id,
        evaluatorUserId: session.userId,
        recommendation: params.recommendation,
        summaryNotes: params.summaryNotes,
        sjphScore: params.sjphScore,
      })
      .returning();

    // 2. Insert Findings if any
    if (params.findings && params.findings.length > 0) {
      await db.insert(inspectionFindings).values(
        params.findings.map((f) => ({
          inspectionResultId: result.id,
          findingType: f.findingType,
          description: f.description,
          correctiveActionRequired: f.correctiveActionRequired,
        }))
      );
    }

    // 3. Update Application Status
    const nextStatus =
      params.recommendation === "LAYAK"
        ? "FINAL_REVIEW"
        : params.recommendation === "PERLU_PERBAIKAN"
        ? "NEED_CORRECTION"
        : "REJECTED";

    await db
      .update(applications)
      .set({
        status: nextStatus,
        updatedAt: new Date(),
      })
      .where(eq(applications.id, app.id));

    // 4. Status History
    await db.insert(applicationStatusHistories).values({
      applicationId: app.id,
      previousStatus: app.status,
      newStatus: nextStatus,
      changedById: session.userId,
      notes: `Laporan Hasil Pemeriksaan (LHP) selesai. Rekomendasi: ${params.recommendation}. Skor SJPH: ${params.sjphScore}. Catatan: ${params.summaryNotes}`,
    });

    // 5. System Audit Log
    await db.insert(auditLogs).values({
      userId: session.userId,
      action: "SUBMIT_INSPECTION_LHP",
      entityType: "applications",
      entityId: app.id,
      newValues: { recommendation: params.recommendation, score: params.sjphScore },
    });

    // 6. Notify Business Owner
    if (app.business) {
      await db.insert(notifications).values({
        userId: app.business.userId,
        title: "Pemeriksaan Lapangan Selesai",
        message: `Pemeriksaan halal telah selesai dengan status rekomendasi: ${params.recommendation}.`,
        type: "APPLICATION_STATUS",
        actionUrl: `/dashboard/pengajuan/${app.id}`,
      });
    }

    revalidatePath("/mentor/penugasan");
    revalidatePath("/auditor/pemeriksaan");
    revalidatePath("/admin/pengajuan");
    return {
      success: true,
      data: undefined,
      message: "Laporan Hasil Pemeriksaan (LHP) berhasil dikirim!",
    };
  } catch (error: any) {
    return { success: false, error: error.message || "Gagal menyimpan hasil pemeriksaan." };
  }
}
