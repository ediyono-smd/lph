"use server";

import { db } from "@/db";
import {
  certificates,
  certificateProducts,
  applications,
  applicationStatusHistories,
  businesses,
  auditLogs,
  notifications,
} from "@/db/schema";
import { eq, desc, and } from "drizzle-orm";
import { getSession } from "@/lib/auth/session";
import { generateQrCodeDataUrl } from "@/lib/qr";
import crypto from "crypto";
import { revalidatePath } from "next/cache";

export type ActionResult<T = unknown> =
  | { success: true; data: T; message?: string }
  | { success: false; error: string; errors?: Record<string, string[]> };

async function assertLeaderOrAdmin() {
  const session = await getSession();
  if (!session) throw new Error("Unauthorized: Anda harus login.");
  const allowed = ["SUPER_ADMIN", "ADMIN", "LEADER"].some((r) =>
    session.roles.includes(r as any)
  );
  if (!allowed) {
    throw new Error("Forbidden: Hanya Pimpinan/Komite Fatwa yang berhak menerbitkan sertifikat.");
  }
  return session;
}

function generateCertificateNumber(): string {
  const year = new Date().getFullYear();
  const randomSuffix = Math.floor(100000 + Math.random() * 900000);
  return `HALAL-${year}-${randomSuffix}`;
}

export async function approveAndIssueCertificateAction(params: {
  applicationId: string;
  decisionNumber: string;
  notes?: string;
}): Promise<ActionResult<{ certificateNumber: string; id: string }>> {
  try {
    const session = await assertLeaderOrAdmin();

    const app = await db.query.applications.findFirst({
      where: eq(applications.id, params.applicationId),
      with: {
        business: true,
        products: {
          with: {
            product: {
              with: {
                category: true,
              },
            },
          },
        },
      },
    });

    if (!app) {
      return { success: false, error: "Pengajuan tidak ditemukan." };
    }

    if (!app.business) {
      return { success: false, error: "Data usaha pada pengajuan ini tidak valid." };
    }

    // Check if certificate already exists
    const existingCert = await db.query.certificates.findFirst({
      where: eq(certificates.applicationId, app.id),
    });

    if (existingCert) {
      return {
        success: false,
        error: `Sertifikat sudah pernah diterbitkan (${existingCert.certificateNumber}).`,
      };
    }

    const certificateNumber = generateCertificateNumber();
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    const qrCodeVerificationUrl = `${appUrl}/verify/${certificateNumber}`;

    // Generate QR Code Data URL
    const qrDataUrl = await generateQrCodeDataUrl(qrCodeVerificationUrl);

    // Compute Digital Signature Checksum
    const signaturePayload = `${certificateNumber}|${app.business.name}|${app.business.nib}|${params.decisionNumber}|${new Date().toISOString()}`;
    const digitalSignatureHash = crypto
      .createHash("sha256")
      .update(signaturePayload)
      .digest("hex");

    // 1. Create Certificate Record
    const [newCert] = await db
      .insert(certificates)
      .values({
        applicationId: app.id,
        certificateNumber,
        businessName: app.business.name,
        brandName: app.business.brandName,
        businessAddress: "Sesuai Data Terdaftar",
        nib: app.business.nib,
        schemeType: app.schemeType,
        status: "ACTIVE",
        issueDate: new Date(),
        decisionNumber: params.decisionNumber,
        signedByLeaderId: session.userId,
        qrCodeUrl: qrDataUrl,
        pdfFileKey: `certificates/${certificateNumber}.pdf`,
        digitalSignatureHash,
      })
      .returning();

    // 2. Snapshot Certified Products
    if (app.products && app.products.length > 0) {
      await db.insert(certificateProducts).values(
        app.products.map((ap) => ({
          certificateId: newCert.id,
          productName: ap.product.name,
          brandName: ap.product.brandName,
          categoryName: ap.product.category?.name || "Makanan & Minuman",
          servingType: ap.product.servingType || "KEMASAN",
        }))
      );
    }

    // 3. Update Application Status to CERTIFICATE_ISSUED
    await db
      .update(applications)
      .set({
        status: "CERTIFICATE_ISSUED",
        completionDate: new Date(),
        updatedAt: new Date(),
      })
      .where(eq(applications.id, app.id));

    // 4. Record Status History
    await db.insert(applicationStatusHistories).values({
      applicationId: app.id,
      previousStatus: app.status,
      newStatus: "CERTIFICATE_ISSUED",
      changedById: session.userId,
      notes: `Sertifikat Halal resmi diterbitkan dengan nomor: ${certificateNumber} (SK: ${params.decisionNumber}).`,
    });

    // 5. System Audit Log
    await db.insert(auditLogs).values({
      userId: session.userId,
      action: "ISSUE_HALAL_CERTIFICATE",
      entityType: "certificates",
      entityId: newCert.id,
      newValues: {
        certificateNumber,
        decisionNumber: params.decisionNumber,
        applicationNumber: app.applicationNumber,
      },
    });

    // 6. Notify Business Owner
    await db.insert(notifications).values({
      userId: app.business.userId,
      title: "🎉 Selamat! Sertifikat Halal Telah Diterbitkan",
      message: `Sertifikat Halal nomor ${certificateNumber} untuk produk Anda telah resmi terbit dan aktif. Silakan unduh sertifikat digital Anda.`,
      type: "CERTIFICATE_ISSUED",
      actionUrl: "/dashboard/sertifikat",
    });

    revalidatePath("/admin/sertifikat");
    revalidatePath(`/admin/pengajuan/${app.id}`);
    revalidatePath("/dashboard/sertifikat");
    return {
      success: true,
      data: { certificateNumber, id: newCert.id },
      message: `Sertifikat Halal ${certificateNumber} berhasil diterbitkan!`,
    };
  } catch (error: any) {
    console.error("Approve Certificate Error:", error);
    return { success: false, error: error.message || "Gagal menerbitkan sertifikat." };
  }
}

export async function getPublicCertificateByNumberAction(
  certificateNumber: string
) {
  try {
    const cert = await db.query.certificates.findFirst({
      where: eq(certificates.certificateNumber, certificateNumber.trim().toUpperCase()),
      with: {
        products: true,
        signedBy: true,
      },
    });

    if (!cert) {
      return { success: false as const, error: "Nomor sertifikat tidak ditemukan dalam pangkalan data resmi." };
    }

    // Sanitized Public Data
    return {
      success: true as const,
      data: {
        certificateNumber: cert.certificateNumber,
        businessName: cert.businessName,
        brandName: cert.brandName,
        schemeType: cert.schemeType,
        status: cert.status,
        issueDate: cert.issueDate,
        validUntil: cert.validUntil,
        decisionNumber: cert.decisionNumber,
        qrCodeUrl: cert.qrCodeUrl,
        digitalSignatureHash: cert.digitalSignatureHash,
        products: cert.products,
      },
    };
  } catch (error: any) {
    return { success: false as const, error: error.message };
  }
}

export async function getMyCertificatesAction() {
  try {
    const session = await getSession();
    if (!session) throw new Error("Unauthorized");

    const business = await db.query.businesses.findFirst({
      where: eq(businesses.userId, session.userId),
    });

    if (!business) {
      return { success: true as const, data: [] };
    }

    // Find all certificates belonging to this business via applications
    const certs = await db.query.certificates.findMany({
      where: (cert, { eq: eqCert }) => eqCert(cert.nib, business.nib),
      with: {
        products: true,
      },
      orderBy: (c, { desc }) => [desc(c.issueDate)],
    });

    return { success: true as const, data: certs };
  } catch (error: any) {
    return { success: false as const, error: error.message };
  }
}

export async function getAllCertificatesAdminAction(params?: {
  search?: string;
  page?: number;
  limit?: number;
}) {
  try {
    const session = await getSession();
    if (!session) throw new Error("Unauthorized");

    const certs = await db.query.certificates.findMany({
      with: {
        products: true,
      },
      orderBy: (c, { desc }) => [desc(c.issueDate)],
      limit: 50,
    });

    return { success: true as const, data: certs };
  } catch (error: any) {
    return { success: false as const, error: error.message };
  }
}
