"use server";

import { db } from "@/db";
import {
  applications,
  applicationChecklists,
  applicationStatusHistories,
  businesses,
  mentors,
  mentorAssignments,
  auditors,
  auditorAssignments,
  users,
  auditLogs,
  notifications,
} from "@/db/schema";
import { eq, and, desc, count, or, ilike } from "drizzle-orm";
import {
  checklistItemVerificationSchema,
  verificationDecisionSchema,
  assignOfficerSchema,
  type ChecklistItemVerificationInput,
  type VerificationDecisionInput,
  type AssignOfficerInput,
} from "@/lib/validation/verification.validation";
import { getSession } from "@/lib/auth/session";
import { revalidatePath } from "next/cache";

export type ActionResult<T = unknown> =
  | { success: true; data: T; message?: string }
  | { success: false; error: string; errors?: Record<string, string[]> };

async function assertVerifier() {
  const session = await getSession();
  if (!session) throw new Error("Unauthorized: Anda harus login.");
  const allowed = ["SUPER_ADMIN", "ADMIN", "VERIFIER", "LEADER"].some((r) =>
    session.roles.includes(r as any)
  );
  if (!allowed) {
    throw new Error("Forbidden: Anda tidak memiliki wewenang verifikasi.");
  }
  return session;
}

export async function getAllApplicationsAction(params?: {
  search?: string;
  status?: string;
  scheme?: string;
  page?: number;
  limit?: number;
}) {
  try {
    await assertVerifier();
    const page = Math.max(1, params?.page || 1);
    const limit = Math.max(1, params?.limit || 10);
    const offset = (page - 1) * limit;
    const search = params?.search?.trim();

    const conditions: any[] = [];
    if (params?.status && params.status !== "ALL") {
      conditions.push(eq(applications.status, params.status as any));
    }
    if (params?.scheme && params.scheme !== "ALL") {
      conditions.push(eq(applications.schemeType, params.scheme as any));
    }
    if (search) {
      conditions.push(
        or(
          ilike(applications.applicationNumber, `%${search}%`),
          ilike(applications.notes, `%${search}%`)
        )
      );
    }

    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

    const items = await db.query.applications.findMany({
      where: whereClause,
      with: {
        business: true,
        products: {
          with: {
            product: true,
          },
        },
        statusHistories: {
          orderBy: (h, { desc: descOrder }) => [descOrder(h.createdAt)],
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
      .where(whereClause);

    return {
      success: true as const,
      data: {
        items,
        total: totalRow?.total || 0,
        page,
        limit,
        totalPages: Math.ceil((totalRow?.total || 0) / limit) || 1,
      },
    };
  } catch (error: any) {
    return { success: false as const, error: error.message };
  }
}

export async function saveChecklistItemAction(
  input: ChecklistItemVerificationInput
): Promise<ActionResult<void>> {
  try {
    const session = await assertVerifier();
    const validated = checklistItemVerificationSchema.safeParse(input);
    if (!validated.success) return { success: false, error: "Validasi item gagal." };

    const existing = await db.query.applicationChecklists.findFirst({
      where: and(
        eq(applicationChecklists.applicationId, validated.data.applicationId),
        eq(applicationChecklists.itemKey, validated.data.itemKey)
      ),
    });

    if (existing) {
      await db
        .update(applicationChecklists)
        .set({
          isValid: validated.data.isValid,
          notes: validated.data.notes || null,
          verifiedById: session.userId,
          verifiedAt: new Date(),
        })
        .where(eq(applicationChecklists.id, existing.id));
    } else {
      await db.insert(applicationChecklists).values({
        applicationId: validated.data.applicationId,
        itemKey: validated.data.itemKey,
        itemName: validated.data.itemName,
        isValid: validated.data.isValid,
        notes: validated.data.notes || null,
        verifiedById: session.userId,
        verifiedAt: new Date(),
      });
    }

    revalidatePath(`/admin/pengajuan/${validated.data.applicationId}`);
    return { success: true, data: undefined };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function submitVerificationDecisionAction(
  input: VerificationDecisionInput
): Promise<ActionResult<{ nextStatus: string }>> {
  try {
    const session = await assertVerifier();
    const validated = verificationDecisionSchema.safeParse(input);
    if (!validated.success) {
      return { success: false, error: "Validasi keputusan verifikasi gagal." };
    }

    const app = await db.query.applications.findFirst({
      where: eq(applications.id, validated.data.applicationId),
      with: {
        business: true,
      },
    });

    if (!app) {
      return { success: false, error: "Pengajuan tidak ditemukan." };
    }

    let newStatus: (typeof applications.status.enumValues)[number];

    if (validated.data.decision === "APPROVE_DOCUMENTS") {
      newStatus = "DOCUMENT_VERIFICATION";
    } else if (validated.data.decision === "REQUEST_CORRECTION") {
      newStatus = "NEED_CORRECTION";
    } else {
      newStatus = "REJECTED";
    }

    // 1. Update Application Status
    await db
      .update(applications)
      .set({
        status: newStatus,
        updatedAt: new Date(),
        notes: validated.data.notes,
      })
      .where(eq(applications.id, app.id));

    // 2. Status History Log
    await db.insert(applicationStatusHistories).values({
      applicationId: app.id,
      previousStatus: app.status,
      newStatus,
      changedById: session.userId,
      notes: validated.data.notes,
    });

    // 3. System Audit Log
    await db.insert(auditLogs).values({
      userId: session.userId,
      action: `VERIFICATION_${validated.data.decision}`,
      entityType: "applications",
      entityId: app.id,
      newValues: { decision: validated.data.decision, notes: validated.data.notes },
    });

    // 4. In-App Notification to Business Owner
    if (app.business) {
      const notificationTitle =
        validated.data.decision === "APPROVE_DOCUMENTS"
          ? "Dokumen Lolos Verifikasi Administrasi"
          : validated.data.decision === "REQUEST_CORRECTION"
          ? "Perhatian: Pengajuan Memerlukan Perbaikan Berkas"
          : "Pengajuan Sertifikasi Ditolak";

      await db.insert(notifications).values({
        userId: app.business.userId,
        title: notificationTitle,
        message: `Catatan verifikator: ${validated.data.notes}`,
        type:
          validated.data.decision === "REQUEST_CORRECTION"
            ? "CORRECTION_REQUIRED"
            : "APPLICATION_STATUS",
        actionUrl: `/dashboard/pengajuan/${app.id}`,
      });
    }

    revalidatePath(`/admin/pengajuan/${app.id}`);
    revalidatePath("/admin/pengajuan");
    return {
      success: true,
      data: { nextStatus: newStatus },
      message: `Keputusan verifikasi (${newStatus}) berhasil disimpan!`,
    };
  } catch (error: any) {
    return { success: false, error: error.message || "Gagal memproses verifikasi." };
  }
}

export async function getAvailableOfficersAction() {
  try {
    await assertVerifier();

    const mentorList = await db.query.mentors.findMany({
      where: eq(mentors.isActive, true),
      with: {
        user: true,
      },
    });

    const auditorList = await db.query.auditors.findMany({
      where: eq(auditors.isActive, true),
      with: {
        user: true,
      },
    });

    return {
      success: true as const,
      data: {
        mentors: mentorList,
        auditors: auditorList,
      },
    };
  } catch (error: any) {
    return { success: false as const, error: error.message };
  }
}

export async function assignOfficerAction(
  input: AssignOfficerInput
): Promise<ActionResult<void>> {
  try {
    const session = await assertVerifier();
    const validated = assignOfficerSchema.safeParse(input);
    if (!validated.success) return { success: false, error: "Validasi penugasan gagal." };

    const app = await db.query.applications.findFirst({
      where: eq(applications.id, validated.data.applicationId),
      with: { business: true },
    });

    if (!app) return { success: false, error: "Pengajuan tidak ditemukan." };

    const targetStatus =
      validated.data.officerType === "MENTOR"
        ? "MENTOR_ASSIGNED"
        : "AUDITOR_ASSIGNED";

    if (validated.data.officerType === "MENTOR") {
      const mentorProfile = await db.query.mentors.findFirst({
        where: eq(mentors.userId, validated.data.officerUserId),
      });
      if (!mentorProfile) return { success: false, error: "Profil Pendamping tidak ditemukan." };

      await db.insert(mentorAssignments).values({
        applicationId: app.id,
        mentorId: mentorProfile.id,
        assignedById: session.userId,
        status: "ASSIGNED",
        notes: validated.data.notes || null,
      });
    } else {
      const auditorProfile = await db.query.auditors.findFirst({
        where: eq(auditors.userId, validated.data.officerUserId),
      });
      if (!auditorProfile) return { success: false, error: "Profil Auditor tidak ditemukan." };

      await db.insert(auditorAssignments).values({
        applicationId: app.id,
        auditorId: auditorProfile.id,
        assignedById: session.userId,
        isLeadAuditor: true,
        status: "ASSIGNED",
        notes: validated.data.notes || null,
      });
    }

    // Update Application Status
    await db
      .update(applications)
      .set({
        status: targetStatus,
        updatedAt: new Date(),
      })
      .where(eq(applications.id, app.id));

    // Status History
    await db.insert(applicationStatusHistories).values({
      applicationId: app.id,
      previousStatus: app.status,
      newStatus: targetStatus,
      changedById: session.userId,
      notes: `Petugas ${validated.data.officerType} berhasil ditugaskan untuk pemeriksaan teknis.`,
    });

    // Notify Assigned Officer
    await db.insert(notifications).values({
      userId: validated.data.officerUserId,
      title: "Penugasan Baru Sertifikasi Halal",
      message: `Anda ditugaskan memeriksa pengajuan nomor ${app.applicationNumber} (${app.business?.name}).`,
      type: "AUDIT_SCHEDULED",
      actionUrl:
        validated.data.officerType === "MENTOR"
          ? "/mentor/penugasan"
          : "/auditor/pemeriksaan",
    });

    revalidatePath(`/admin/pengajuan/${app.id}`);
    revalidatePath("/admin/penugasan");
    return {
      success: true,
      data: undefined,
      message: `Petugas ${validated.data.officerType} berhasil ditugaskan!`,
    };
  } catch (error: any) {
    return { success: false, error: error.message || "Gagal menugaskan petugas." };
  }
}
