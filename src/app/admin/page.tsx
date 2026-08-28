import React from "react";
import Link from "next/link";
import { getAdminDashboardStatsAction } from "@/actions/admin.actions";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  FileSpreadsheet,
  Award,
  Building2,
  Users,
  Eye,
  ArrowRight,
  ShieldCheck,
  History,
} from "lucide-react";
import { formatDate, formatDateTime } from "@/lib/utils";

export default async function AdminDashboardPage() {
  const res = await getAdminDashboardStatsAction();
  if (!res.success || !res.data) {
    return (
      <div className="py-12 text-center text-slate-500">
        Gagal memuat data statistik admin.
      </div>
    );
  }

  const {
    totalApplications,
    totalCertificates,
    totalUsers,
    totalBusinesses,
    recentApplications,
    recentAuditLogs,
  } = res.data;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-heading font-bold text-slate-900 flex items-center gap-2">
            <ShieldCheck className="h-6 w-6 text-primary-700" />
            Executive Halal Analytics & Overview
          </h1>
          <p className="text-sm text-slate-600 mt-1">
            Ringkasan pemantauan sertifikasi halal, efektivitas verifikasi, dan
            audit trail sistem.
          </p>
        </div>

        <Link href="/admin/pengajuan">
          <Button className="bg-primary-800 hover:bg-primary-900">
            Antrean Pengajuan <ArrowRight className="h-4 w-4 ml-1.5" />
          </Button>
        </Link>
      </div>

      {/* KPI Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-medium text-slate-500 uppercase">
              Total Pengajuan
            </CardTitle>
            <FileSpreadsheet className="h-4 w-4 text-primary-700" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold font-heading text-slate-900">
              {totalApplications}
            </div>
            <p className="text-[11px] text-slate-500 mt-1">
              Seluruh permohonan masuk
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-medium text-slate-500 uppercase">
              Sertifikat Terbit
            </CardTitle>
            <Award className="h-4 w-4 text-emerald-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold font-heading text-slate-900">
              {totalCertificates}
            </div>
            <p className="text-[11px] text-emerald-700 font-medium mt-1">
              Sertifikat Halal Aktif
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-medium text-slate-500 uppercase">
              Pelaku Usaha (NIB)
            </CardTitle>
            <Building2 className="h-4 w-4 text-amber-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold font-heading text-slate-900">
              {totalBusinesses}
            </div>
            <p className="text-[11px] text-slate-500 mt-1">
              Badan usaha terdaftar
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-medium text-slate-500 uppercase">
              Pengguna Sistem
            </CardTitle>
            <Users className="h-4 w-4 text-accent-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold font-heading text-slate-900">
              {totalUsers}
            </div>
            <p className="text-[11px] text-slate-500 mt-1">
              Admin, Auditor, Pendamping, PU
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Grid: Inbound Queue (Left) & Audit Feed (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Recent Applications (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <Card>
            <CardHeader className="pb-3 flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-base font-bold text-slate-900">
                  Pengajuan Terbaru Masuk
                </CardTitle>
                <CardDescription className="text-xs">
                  Permohonan yang memerlukan tindakan dari tim verifikasi.
                </CardDescription>
              </div>
              <Link href="/admin/pengajuan">
                <Button variant="link" size="sm" className="text-xs text-primary-700 p-0">
                  Lihat Semua
                </Button>
              </Link>
            </CardHeader>
            <CardContent>
              <div className="divide-y divide-slate-100 border border-slate-200 rounded-xl overflow-hidden text-xs">
                {recentApplications.map((app) => (
                  <div
                    key={app.id}
                    className="p-3.5 flex items-center justify-between bg-white hover:bg-slate-50 transition-colors"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-slate-900">
                          {app.applicationNumber}
                        </span>
                        <Badge variant="outline" className="text-[10px]">
                          {app.schemeType}
                        </Badge>
                      </div>
                      <p className="text-slate-500 text-[11px] mt-0.5">
                        {app.business?.name} • NIB: {app.business?.nib}
                      </p>
                    </div>

                    <div className="flex items-center gap-3">
                      <Badge variant="info" className="text-[10px]">
                        {app.status}
                      </Badge>
                      <Link href={`/admin/pengajuan/${app.id}`}>
                        <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                          <Eye className="h-3.5 w-3.5 text-slate-600" />
                        </Button>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Real-time Audit Trail Feed (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <Card>
            <CardHeader className="pb-3 flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <History className="h-4 w-4 text-primary-700" />
                  Aktivitas Sistem Terkini
                </CardTitle>
                <CardDescription className="text-xs">
                  Audit log immutable keamanan platform.
                </CardDescription>
              </div>
              <Link href="/admin/audit-log">
                <Button variant="link" size="sm" className="text-xs text-primary-700 p-0">
                  Semua Log
                </Button>
              </Link>
            </CardHeader>
            <CardContent>
              <div className="divide-y divide-slate-100 text-xs">
                {recentAuditLogs.map((log) => (
                  <div key={log.id} className="py-2.5 space-y-1">
                    <div className="flex items-center justify-between">
                      <Badge variant="outline" className="text-[9px] font-mono">
                        {log.action}
                      </Badge>
                      <span className="text-[10px] text-slate-400">
                        {formatDateTime(log.createdAt)}
                      </span>
                    </div>
                    <p className="text-slate-600 text-[11px]">
                      Oleh: <strong>{log.user?.fullName || "System"}</strong> pada{" "}
                      {log.entityType}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
