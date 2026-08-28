"use server";

import { db } from "@/db";
import {
  applications,
  certificates,
  businesses,
  auditors,
  mentors,
  auditorAssignments,
  mentorAssignments,
  products,
  productCategories,
} from "@/db/schema";
import { eq, desc, and, count, sql } from "drizzle-orm";
import { getSession } from "@/lib/auth/session";

async function assertAdmin() {
  const session = await getSession();
  if (!session) throw new Error("Unauthorized: Anda harus login.");
  const allowed = ["SUPER_ADMIN", "ADMIN", "VERIFIER", "LEADER"].some((r) =>
    session.roles.includes(r as any)
  );
  if (!allowed) throw new Error("Forbidden: Akses khusus Admin/Pimpinan.");
  return session;
}

export async function getReportingAnalyticsAction(params?: {
  scheme?: string;
  status?: string;
  period?: string;
}) {
  try {
    await assertAdmin();

    // 1. Fetch all applications with relations
    const allApps = await db.query.applications.findMany({
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
      orderBy: [desc(applications.createdAt)],
    });

    // 2. Fetch all certificates
    const allCerts = await db.query.certificates.findMany({
      with: {
        products: true,
      },
      orderBy: [desc(certificates.issueDate)],
    });

    // 3. Fetch officers & assignments
    const [allAuditors, allMentors, allAuditorAssigns, allMentorAssigns, allBusinesses, allCategories] =
      await Promise.all([
        db.query.auditors.findMany({ with: { user: true } }),
        db.query.mentors.findMany({ with: { user: true } }),
        db.query.auditorAssignments.findMany({ with: { auditor: { with: { user: true } } } }),
        db.query.mentorAssignments.findMany({ with: { mentor: { with: { user: true } } } }),
        db.query.businesses.findMany(),
        db.query.productCategories.findMany(),
      ]);

    // Apply Filter on in-memory dataset
    let filteredApps = allApps;
    if (params?.scheme && params.scheme !== "ALL") {
      filteredApps = filteredApps.filter((a) => a.schemeType === params.scheme);
    }
    if (params?.status && params.status !== "ALL") {
      filteredApps = filteredApps.filter((a) => a.status === params.status);
    }

    // 4. Compute High-Level Metrics
    const totalApps = filteredApps.length;
    const totalCertificates = allCerts.length;
    const totalApproved = filteredApps.filter(
      (a) => a.status === "CERTIFICATE_ISSUED" || a.status === "APPROVED"
    ).length;
    const approvalRate = totalApps > 0 ? Math.round((totalApproved / totalApps) * 100) : 0;
    const totalSelfDeclare = filteredApps.filter((a) => a.schemeType === "SELF_DECLARE").length;
    const totalReguler = filteredApps.filter((a) => a.schemeType === "REGULER").length;

    // 5. Status Breakdown
    const statusCounts: Record<string, number> = {
      SUBMITTED: 0,
      DOCUMENT_VERIFICATION: 0,
      INSPECTION: 0,
      AUDITOR_ASSIGNED: 0,
      MENTOR_ASSIGNED: 0,
      FINAL_REVIEW: 0,
      CERTIFICATE_ISSUED: 0,
      NEED_CORRECTION: 0,
      REJECTED: 0,
    };

    filteredApps.forEach((a) => {
      if (statusCounts[a.status] !== undefined) {
        statusCounts[a.status]++;
      } else {
        statusCounts[a.status] = 1;
      }
    });

    const statusChartData = [
      { name: "Menunggu Verifikasi", value: statusCounts.SUBMITTED || 0, color: "#3b82f6" },
      { name: "Lolos Berkas", value: statusCounts.DOCUMENT_VERIFICATION || 0, color: "#10b981" },
      { name: "Pemeriksaan Lapangan", value: (statusCounts.INSPECTION || 0) + (statusCounts.AUDITOR_ASSIGNED || 0) + (statusCounts.MENTOR_ASSIGNED || 0), color: "#f59e0b" },
      { name: "Sidang Fatwa", value: statusCounts.FINAL_REVIEW || 0, color: "#8b5cf6" },
      { name: "Sertifikat Terbit", value: statusCounts.CERTIFICATE_ISSUED || 0, color: "#073b2d" },
      { name: "Perlu Perbaikan", value: statusCounts.NEED_CORRECTION || 0, color: "#ef4444" },
    ].filter((item) => item.value > 0);

    // 6. Monthly Trend Analytics (Last 6 Months)
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"];
    const now = new Date();
    const monthlyTrends: { month: string; pengajuan: number; sertifikat: number }[] = [];

    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const mIdx = d.getMonth();
      const yr = d.getFullYear();
      const mLabel = `${monthNames[mIdx]} ${yr}`;

      const appCount = filteredApps.filter((a) => {
        const cDate = new Date(a.createdAt);
        return cDate.getMonth() === mIdx && cDate.getFullYear() === yr;
      }).length;

      const certCount = allCerts.filter((c) => {
        const iDate = new Date(c.issueDate);
        return iDate.getMonth() === mIdx && iDate.getFullYear() === yr;
      }).length;

      monthlyTrends.push({
        month: mLabel,
        pengajuan: appCount,
        sertifikat: certCount,
      });
    }

    // 7. Officer Performance Rankings
    const auditorPerformance = allAuditors.map((aud) => {
      const assigned = allAuditorAssigns.filter((asgn) => asgn.auditorId === aud.id);
      const completed = assigned.filter((asgn) => asgn.status === "COMPLETED").length;
      return {
        id: aud.id,
        name: aud.user?.fullName || "Auditor",
        email: aud.user?.email || "-",
        lphName: aud.lphName,
        regNumber: aud.auditorRegNumber,
        totalAssigned: assigned.length,
        completed,
        pending: assigned.length - completed,
      };
    }).sort((a, b) => b.totalAssigned - a.totalAssigned);

    const mentorPerformance = allMentors.map((mnt) => {
      const assigned = allMentorAssigns.filter((asgn) => asgn.mentorId === mnt.id);
      const completed = assigned.filter((asgn) => asgn.status === "COMPLETED").length;
      return {
        id: mnt.id,
        name: mnt.user?.fullName || "Pendamping",
        email: mnt.user?.email || "-",
        institution: mnt.institutionName,
        regNumber: mnt.registrationNumber,
        totalAssigned: assigned.length,
        completed,
        pending: assigned.length - completed,
      };
    }).sort((a, b) => b.totalAssigned - a.totalAssigned);

    // 8. Business Scale & Category Distribution
    const businessScaleStats = {
      MIKRO: allBusinesses.filter((b) => b.businessScale === "MIKRO").length,
      KECIL: allBusinesses.filter((b) => b.businessScale === "KECIL").length,
      MENENGAH: allBusinesses.filter((b) => b.businessScale === "MENENGAH").length,
      BESAR: allBusinesses.filter((b) => b.businessScale === "BESAR").length,
    };

    return {
      success: true as const,
      data: {
        summary: {
          totalApps,
          totalCertificates,
          totalApproved,
          approvalRate,
          totalSelfDeclare,
          totalReguler,
          totalBusinesses: allBusinesses.length,
          totalAuditors: allAuditors.length,
          totalMentors: allMentors.length,
        },
        monthlyTrends,
        statusChartData,
        businessScaleStats,
        auditorPerformance,
        mentorPerformance,
        recentApplications: filteredApps.slice(0, 20),
        recentCertificates: allCerts.slice(0, 20),
      },
    };
  } catch (error: any) {
    return { success: false as const, error: error.message || "Gagal memuat analitik laporan." };
  }
}
