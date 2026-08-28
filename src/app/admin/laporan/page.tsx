"use client";

import React, { useState, useEffect, useTransition } from "react";
import { getReportingAnalyticsAction } from "@/actions/report.actions";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  FileText,
  TrendingUp,
  Award,
  CheckCircle2,
  Building2,
  Users,
  Printer,
  Download,
  Filter,
  BarChart3,
  PieChart as PieChartIcon,
  RotateCcw,
  Calendar,
  Layers,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { formatDate } from "@/lib/utils";
import { HalalLogo } from "@/components/brand/halal-logo";

const SCHEME_OPTIONS = [
  { value: "ALL", label: "Semua Skema" },
  { value: "SELF_DECLARE", label: "Self-Declare (UMKM)" },
  { value: "REGULER", label: "Reguler (Pemeriksaan LPH)" },
];

const STATUS_OPTIONS = [
  { value: "ALL", label: "Semua Status" },
  { value: "SUBMITTED", label: "Menunggu Verifikasi" },
  { value: "DOCUMENT_VERIFICATION", label: "Lolos Berkas" },
  { value: "INSPECTION", label: "Pemeriksaan Lapangan" },
  { value: "FINAL_REVIEW", label: "Review Fatwa" },
  { value: "CERTIFICATE_ISSUED", label: "Sertifikat Terbit" },
  { value: "NEED_CORRECTION", label: "Perlu Perbaikan" },
];

export default function AdminReportingPage() {
  const [data, setData] = useState<any>(null);
  const [schemeFilter, setSchemeFilter] = useState("ALL");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [activeTab, setActiveTab] = useState<"APPLICATIONS" | "CERTIFICATES" | "OFFICERS" | "BUSINESS">("APPLICATIONS");
  const [isLoading, setIsLoading] = useState(true);

  const fetchReportData = async (scheme = "ALL", status = "ALL") => {
    setIsLoading(true);
    const res = await getReportingAnalyticsAction({ scheme, status });
    if (res.success && res.data) {
      setData(res.data);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchReportData(schemeFilter, statusFilter);
  }, [schemeFilter, statusFilter]);

  const handleResetFilter = () => {
    setSchemeFilter("ALL");
    setStatusFilter("ALL");
  };

  // Export CSV Function
  const handleExportCSV = () => {
    if (!data) return;

    let csvContent = "data:text/csv;charset=utf-8,";
    if (activeTab === "APPLICATIONS") {
      csvContent += "No,Nomor Pengajuan,Nama Pelaku Usaha,NIB,Skema,Status,Tanggal Masuk\n";
      data.recentApplications.forEach((app: any, idx: number) => {
        csvContent += `"${idx + 1}","${app.applicationNumber}","${app.business?.name || '-'}","${app.business?.nib || '-'}","${app.schemeType}","${app.status}","${app.createdAt ? new Date(app.createdAt).toLocaleDateString('id-ID') : '-'}"\n`;
      });
    } else if (activeTab === "CERTIFICATES") {
      csvContent += "No,Nomor Sertifikat,Nama Pelaku Usaha,Merek,No Keputusan SK,Status,Tanggal Terbit\n";
      data.recentCertificates.forEach((cert: any, idx: number) => {
        csvContent += `"${idx + 1}","${cert.certificateNumber}","${cert.businessName}","${cert.brandName}","${cert.decisionNumber}","${cert.status}","${cert.issueDate ? new Date(cert.issueDate).toLocaleDateString('id-ID') : '-'}"\n`;
      });
    } else if (activeTab === "OFFICERS") {
      csvContent += "No,Nama Petugas,Peran,Lembaga / Instansi,No Registrasi,Total Tugas,Selesai,Pending\n";
      data.auditorPerformance.forEach((aud: any, idx: number) => {
        csvContent += `"${idx + 1}","${aud.name}","Auditor LPH","${aud.lphName}","${aud.regNumber}","${aud.totalAssigned}","${aud.completed}","${aud.pending}"\n`;
      });
      data.mentorPerformance.forEach((mnt: any, idx: number) => {
        csvContent += `"${idx + 1}","${mnt.name}","Pendamping PPH","${mnt.institution}","${mnt.regNumber}","${mnt.totalAssigned}","${mnt.completed}","${mnt.pending}"\n`;
      });
    }

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `laporan-sip-halal-${activeTab.toLowerCase()}-${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const isFilterActive = schemeFilter !== "ALL" || statusFilter !== "ALL";

  return (
    <div className="space-y-4">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-3.5 rounded-2xl border border-[#ebd7ba]/90 shadow-sm">
        <div className="flex items-center gap-2.5">
          <div className="h-9 w-9 rounded-xl bg-[#073b2d] flex items-center justify-center text-[#e5a952] font-bold shadow-sm shrink-0">
            <BarChart3 className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base font-heading font-extrabold text-slate-900 leading-tight">
                Pusat Pelaporan & Analitik Sertifikasi
              </h1>
              <Badge className="bg-[#fbf5eb] text-[#b87d28] border border-[#ebd7ba] text-[9px] font-extrabold px-1.5 py-0">
                Eksekutif & Audit
              </Badge>
            </div>
            <p className="text-[11px] text-slate-500 font-normal">
              Rekapitulasi berkas, efektivitas pemeriksaan, sertifikat terbit, dan performa petugas.
            </p>
          </div>
        </div>

        {/* Global Report Actions */}
        <div className="flex items-center gap-2 shrink-0">
          <Button
            size="sm"
            variant="outline"
            onClick={handleExportCSV}
            disabled={isLoading || !data}
            className="h-8 px-3 rounded-xl border-[#ebd7ba] bg-[#fcfaf6] hover:bg-[#fbf5eb] text-xs font-bold shadow-sm"
          >
            <Download className="h-3.5 w-3.5 mr-1.5 text-[#b87d28]" />
            Ekspor CSV
          </Button>

          <Button
            size="sm"
            onClick={() => window.print()}
            disabled={isLoading || !data}
            className="h-8 px-3.5 rounded-xl bg-[#073b2d] hover:bg-[#05291f] text-white font-bold text-xs shadow-sm"
          >
            <Printer className="h-3.5 w-3.5 mr-1.5 text-[#e5a952]" />
            Cetak Laporan PDF
          </Button>
        </div>
      </div>

      {/* Filter Control Bar */}
      <div className="flex flex-wrap items-center justify-between gap-2.5 bg-white p-2.5 rounded-2xl border border-[#ebd7ba]/90 shadow-sm print:hidden">
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1.5 text-xs text-slate-600 font-semibold pl-1">
            <Filter className="h-3.5 w-3.5 text-[#b87d28]" />
            <span>Filter Laporan:</span>
          </div>

          <select
            value={schemeFilter}
            onChange={(e) => setSchemeFilter(e.target.value)}
            className="h-8 px-2.5 rounded-xl border border-[#ebd7ba] bg-[#fcfaf6] text-xs font-bold text-slate-800 shadow-sm focus:outline-none focus:ring-1 focus:ring-[#e5a952]"
          >
            {SCHEME_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="h-8 px-2.5 rounded-xl border border-[#ebd7ba] bg-[#fcfaf6] text-xs font-bold text-slate-800 shadow-sm focus:outline-none focus:ring-1 focus:ring-[#e5a952]"
          >
            {STATUS_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>

          {isFilterActive && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleResetFilter}
              className="h-8 px-2 rounded-xl text-xs font-bold text-slate-600 hover:text-red-600 hover:bg-red-50"
            >
              <RotateCcw className="h-3 w-3 mr-1" />
              Reset
            </Button>
          )}
        </div>

        <span className="text-[11px] text-slate-500 font-medium pr-1">
          Data diperbarui: <strong>{new Date().toLocaleTimeString("id-ID")}</strong>
        </span>
      </div>

      {/* KPI Metric Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5">
        <Card className="rounded-2xl border-[#ebd7ba]/90 bg-white shadow-sm p-3 space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-600">Total Permohonan</span>
            <div className="h-7 w-7 rounded-lg bg-[#fbf5eb] flex items-center justify-center text-[#b87d28]">
              <FileText className="h-4 w-4" />
            </div>
          </div>
          <p className="text-xl font-heading font-extrabold text-slate-900">
            {data?.summary.totalApps ?? 0}
          </p>
          <p className="text-[10px] text-slate-500">
            Self-Declare: <strong className="text-slate-800">{data?.summary.totalSelfDeclare ?? 0}</strong> • Reguler: <strong className="text-slate-800">{data?.summary.totalReguler ?? 0}</strong>
          </p>
        </Card>

        <Card className="rounded-2xl border-[#ebd7ba]/90 bg-white shadow-sm p-3 space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-600">Sertifikat Terbit</span>
            <div className="h-7 w-7 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-700">
              <Award className="h-4 w-4" />
            </div>
          </div>
          <p className="text-xl font-heading font-extrabold text-emerald-800">
            {data?.summary.totalCertificates ?? 0}
          </p>
          <p className="text-[10px] text-emerald-700 font-medium">
            ✓ 100% Aktif & Ber-QR Code
          </p>
        </Card>

        <Card className="rounded-2xl border-[#ebd7ba]/90 bg-white shadow-sm p-3 space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-600">Tingkat Kelulusan</span>
            <div className="h-7 w-7 rounded-lg bg-blue-50 flex items-center justify-center text-blue-700">
              <TrendingUp className="h-4 w-4" />
            </div>
          </div>
          <p className="text-xl font-heading font-extrabold text-blue-900">
            {data?.summary.approvalRate ?? 0}%
          </p>
          <p className="text-[10px] text-slate-500 font-normal">
            Lolos Sidang Komite Fatwa
          </p>
        </Card>

        <Card className="rounded-2xl border-[#ebd7ba]/90 bg-white shadow-sm p-3 space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-600">Pelaku Usaha (NIB)</span>
            <div className="h-7 w-7 rounded-lg bg-[#fbf5eb] flex items-center justify-center text-[#b87d28]">
              <Building2 className="h-4 w-4" />
            </div>
          </div>
          <p className="text-xl font-heading font-extrabold text-slate-900">
            {data?.summary.totalBusinesses ?? 0}
          </p>
          <p className="text-[10px] text-slate-500">
            Terdaftar di Ekosistem Halal
          </p>
        </Card>

        <Card className="rounded-2xl border-[#ebd7ba]/90 bg-white shadow-sm p-3 space-y-1 col-span-2 sm:col-span-1">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-600">Total Petugas Teknis</span>
            <div className="h-7 w-7 rounded-lg bg-amber-50 flex items-center justify-center text-amber-700">
              <Users className="h-4 w-4" />
            </div>
          </div>
          <p className="text-xl font-heading font-extrabold text-slate-900">
            {(data?.summary.totalAuditors ?? 0) + (data?.summary.totalMentors ?? 0)}
          </p>
          <p className="text-[10px] text-slate-500">
            {data?.summary.totalAuditors ?? 0} Auditor • {data?.summary.totalMentors ?? 0} Pendamping
          </p>
        </Card>
      </div>

      {/* Visual Analytics Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3">
        {/* Trend Bar Chart (8 Cols) */}
        <Card className="lg:col-span-7 rounded-2xl border-[#ebd7ba]/90 bg-white shadow-sm p-3.5">
          <div className="flex items-center justify-between pb-2 border-b border-[#ebd7ba]/60 mb-2">
            <div>
              <h3 className="text-xs font-bold text-slate-900">
                Tren Pengajuan Permohonan & Sertifikat Terbit
              </h3>
              <p className="text-[10px] text-slate-500">Rekapitulasi 6 bulan terakhir</p>
            </div>
            <div className="flex items-center gap-3 text-[10px]">
              <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-[#073b2d]" /> Pengajuan</span>
              <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-[#e5a952]" /> Sertifikat</span>
            </div>
          </div>

          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data?.monthlyTrends || []} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1e5d4" />
                <XAxis dataKey="month" tick={{ fontSize: 10, fill: "#64748b" }} />
                <YAxis tick={{ fontSize: 10, fill: "#64748b" }} allowDecimals={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#ffffff",
                    borderRadius: "12px",
                    border: "1px solid #ebd7ba",
                    fontSize: "11px",
                  }}
                />
                <Bar dataKey="pengajuan" name="Pengajuan Masuk" fill="#073b2d" radius={[4, 4, 0, 0]} />
                <Bar dataKey="sertifikat" name="Sertifikat Terbit" fill="#e5a952" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Status Distribution Pie Chart (5 Cols) */}
        <Card className="lg:col-span-5 rounded-2xl border-[#ebd7ba]/90 bg-white shadow-sm p-3.5">
          <div className="flex items-center justify-between pb-2 border-b border-[#ebd7ba]/60 mb-2">
            <div>
              <h3 className="text-xs font-bold text-slate-900">
                Distribusi Status Alur Permohonan
              </h3>
              <p className="text-[10px] text-slate-500">Komposisi tahapan berkas saat ini</p>
            </div>
          </div>

          <div className="h-56 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data?.statusChartData || []}
                  cx="50%"
                  cy="50%"
                  innerRadius={45}
                  outerRadius={75}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {(data?.statusChartData || []).map((entry: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#ffffff",
                    borderRadius: "12px",
                    border: "1px solid #ebd7ba",
                    fontSize: "11px",
                  }}
                />
                <Legend
                  layout="horizontal"
                  verticalAlign="bottom"
                  align="center"
                  wrapperStyle={{ fontSize: "10px", paddingTop: "6px" }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {/* Tab Navigation for Detailed Tables */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 border-b border-[#ebd7ba]/70 print:hidden">
        <button
          onClick={() => setActiveTab("APPLICATIONS")}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 ${
            activeTab === "APPLICATIONS"
              ? "bg-[#073b2d] text-white shadow-sm"
              : "bg-white text-slate-700 hover:bg-[#fbf5eb] border border-[#ebd7ba]/80"
          }`}
        >
          <FileText className="h-3.5 w-3.5" />
          <span>Rekap Pengajuan ({data?.recentApplications?.length ?? 0})</span>
        </button>

        <button
          onClick={() => setActiveTab("CERTIFICATES")}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 ${
            activeTab === "CERTIFICATES"
              ? "bg-[#073b2d] text-white shadow-sm"
              : "bg-white text-slate-700 hover:bg-[#fbf5eb] border border-[#ebd7ba]/80"
          }`}
        >
          <Award className="h-3.5 w-3.5" />
          <span>Rekap Sertifikat Terbit ({data?.recentCertificates?.length ?? 0})</span>
        </button>

        <button
          onClick={() => setActiveTab("OFFICERS")}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 ${
            activeTab === "OFFICERS"
              ? "bg-[#073b2d] text-white shadow-sm"
              : "bg-white text-slate-700 hover:bg-[#fbf5eb] border border-[#ebd7ba]/80"
          }`}
        >
          <Users className="h-3.5 w-3.5" />
          <span>Kinerja Auditor & Pendamping ({(data?.auditorPerformance?.length ?? 0) + (data?.mentorPerformance?.length ?? 0)})</span>
        </button>

        <button
          onClick={() => setActiveTab("BUSINESS")}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 ${
            activeTab === "BUSINESS"
              ? "bg-[#073b2d] text-white shadow-sm"
              : "bg-white text-slate-700 hover:bg-[#fbf5eb] border border-[#ebd7ba]/80"
          }`}
        >
          <Building2 className="h-3.5 w-3.5" />
          <span>Sebaran Skala Usaha</span>
        </button>
      </div>

      {/* Tab 1: Rekap Pengajuan */}
      {activeTab === "APPLICATIONS" && (
        <div className="rounded-2xl border border-[#ebd7ba]/90 bg-white shadow-sm overflow-hidden">
          <div className="p-3 border-b border-[#ebd7ba]/80 bg-[#f7f2e8] flex items-center justify-between">
            <h3 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider">
              Laporan Rincian Berkas Permohonan Sertifikasi
            </h3>
            <span className="text-[10px] text-slate-500 font-semibold">
              Menampilkan {data?.recentApplications?.length ?? 0} data terbaru
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-[#fcfaf6] border-b border-[#ebd7ba] text-slate-800 text-[11px] font-bold uppercase">
                  <th className="py-2.5 px-3 w-10 text-center">No.</th>
                  <th className="py-2.5 px-3">No. Pengajuan</th>
                  <th className="py-2.5 px-3">Pelaku Usaha & NIB</th>
                  <th className="py-2.5 px-3">Skema</th>
                  <th className="py-2.5 px-3">Status Alur</th>
                  <th className="py-2.5 px-3 text-right">Tgl Masuk</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {data?.recentApplications?.map((app: any, idx: number) => (
                  <tr key={app.id} className={idx % 2 === 1 ? "bg-[#fbf9f3]" : "bg-white"}>
                    <td className="py-2 px-3 text-center font-mono font-bold text-slate-500">{idx + 1}</td>
                    <td className="py-2 px-3">
                      <span className="font-mono text-[11px] font-bold text-slate-900 bg-[#fbf5eb] px-2 py-0.5 rounded border border-[#ebd7ba]">
                        {app.applicationNumber}
                      </span>
                    </td>
                    <td className="py-2 px-3">
                      <p className="font-bold text-slate-900">{app.business?.name}</p>
                      <p className="text-[10px] text-slate-500">NIB: <span className="font-mono text-[#b87d28] font-bold">{app.business?.nib}</span></p>
                    </td>
                    <td className="py-2 px-3">
                      <Badge variant={app.schemeType === "SELF_DECLARE" ? "accent" : "outline"} className="text-[9px] font-bold">
                        {app.schemeType === "SELF_DECLARE" ? "Self-Declare" : "Reguler"}
                      </Badge>
                    </td>
                    <td className="py-2 px-3">
                      <Badge variant={app.status === "CERTIFICATE_ISSUED" ? "success" : app.status === "NEED_CORRECTION" ? "warning" : "secondary"} className="text-[9px] font-bold">
                        {app.status.replace("_", " ")}
                      </Badge>
                    </td>
                    <td className="py-2 px-3 text-right text-slate-600 font-medium text-[11px]">
                      {app.createdAt ? formatDate(app.createdAt) : "-"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 2: Rekap Sertifikat */}
      {activeTab === "CERTIFICATES" && (
        <div className="rounded-2xl border border-[#ebd7ba]/90 bg-white shadow-sm overflow-hidden">
          <div className="p-3 border-b border-[#ebd7ba]/80 bg-[#f7f2e8] flex items-center justify-between">
            <h3 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider">
              Laporan Rekapitulasi Sertifikat Halal Terbit
            </h3>
            <span className="text-[10px] text-slate-500 font-semibold">
              Total {data?.recentCertificates?.length ?? 0} Sertifikat
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-[#fcfaf6] border-b border-[#ebd7ba] text-slate-800 text-[11px] font-bold uppercase">
                  <th className="py-2.5 px-3 w-10 text-center">No.</th>
                  <th className="py-2.5 px-3">Nomor Sertifikat</th>
                  <th className="py-2.5 px-3">Pelaku Usaha & Merek</th>
                  <th className="py-2.5 px-3">No. Ketetapan SK</th>
                  <th className="py-2.5 px-3">Status</th>
                  <th className="py-2.5 px-3 text-right">Tgl Terbit</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {data?.recentCertificates?.map((cert: any, idx: number) => (
                  <tr key={cert.id} className={idx % 2 === 1 ? "bg-[#fbf9f3]" : "bg-white"}>
                    <td className="py-2 px-3 text-center font-mono font-bold text-slate-500">{idx + 1}</td>
                    <td className="py-2 px-3">
                      <span className="font-mono text-[11px] font-bold text-emerald-950 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                        {cert.certificateNumber}
                      </span>
                    </td>
                    <td className="py-2 px-3">
                      <p className="font-bold text-slate-900">{cert.businessName}</p>
                      <p className="text-[10px] text-slate-500">Merek: <strong className="text-slate-800">{cert.brandName}</strong></p>
                    </td>
                    <td className="py-2 px-3 font-mono text-[11px] text-slate-700">
                      {cert.decisionNumber}
                    </td>
                    <td className="py-2 px-3">
                      <Badge variant="success" className="text-[9px] font-bold">
                        ✓ {cert.status}
                      </Badge>
                    </td>
                    <td className="py-2 px-3 text-right text-slate-600 font-medium text-[11px]">
                      {cert.issueDate ? formatDate(cert.issueDate) : "-"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 3: Kinerja Petugas */}
      {activeTab === "OFFICERS" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
          {/* Auditor Performance */}
          <div className="rounded-2xl border border-[#ebd7ba]/90 bg-white shadow-sm overflow-hidden">
            <div className="p-2.5 border-b border-[#ebd7ba]/80 bg-[#f7f2e8]">
              <h3 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider">
                Kinerja Auditor Lembaga Pemeriksa Halal (LPH)
              </h3>
            </div>
            <div className="divide-y divide-slate-100 text-xs">
              {data?.auditorPerformance?.slice(0, 10).map((aud: any, idx: number) => (
                <div key={aud.id} className="p-2.5 flex items-center justify-between hover:bg-[#fbf9f3]">
                  <div>
                    <p className="font-bold text-slate-900">{idx + 1}. {aud.name}</p>
                    <p className="text-[10px] text-slate-500">{aud.lphName} • No. Reg: <span className="font-mono text-[#b87d28] font-bold">{aud.regNumber}</span></p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className="bg-emerald-50 text-emerald-800 border border-emerald-300 text-[9px] font-extrabold">
                      {aud.completed} Selesai
                    </Badge>
                    <Badge className="bg-amber-50 text-amber-800 border border-amber-300 text-[9px] font-extrabold">
                      {aud.pending} Proses
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Mentor Performance */}
          <div className="rounded-2xl border border-[#ebd7ba]/90 bg-white shadow-sm overflow-hidden">
            <div className="p-2.5 border-b border-[#ebd7ba]/80 bg-[#f7f2e8]">
              <h3 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider">
                Kinerja Pendamping Proses Produk Halal (LP3H)
              </h3>
            </div>
            <div className="divide-y divide-slate-100 text-xs">
              {data?.mentorPerformance?.slice(0, 10).map((mnt: any, idx: number) => (
                <div key={mnt.id} className="p-2.5 flex items-center justify-between hover:bg-[#fbf9f3]">
                  <div>
                    <p className="font-bold text-slate-900">{idx + 1}. {mnt.name}</p>
                    <p className="text-[10px] text-slate-500">{mnt.institution} • No. Reg: <span className="font-mono text-[#b87d28] font-bold">{mnt.regNumber}</span></p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className="bg-emerald-50 text-emerald-800 border border-emerald-300 text-[9px] font-extrabold">
                      {mnt.completed} Selesai
                    </Badge>
                    <Badge className="bg-amber-50 text-amber-800 border border-amber-300 text-[9px] font-extrabold">
                      {mnt.pending} Proses
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab 4: Sebaran Skala Usaha */}
      {activeTab === "BUSINESS" && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <Card className="rounded-2xl border-[#ebd7ba]/90 bg-white p-4 shadow-sm text-center space-y-1">
            <span className="text-[10px] uppercase font-bold text-[#b87d28]">Usaha Mikro</span>
            <p className="text-2xl font-heading font-extrabold text-[#073b2d]">{data?.businessScaleStats.MIKRO ?? 0}</p>
            <p className="text-[10px] text-slate-500">Skema Self-Declare Prioritas</p>
          </Card>
          <Card className="rounded-2xl border-[#ebd7ba]/90 bg-white p-4 shadow-sm text-center space-y-1">
            <span className="text-[10px] uppercase font-bold text-[#b87d28]">Usaha Kecil</span>
            <p className="text-2xl font-heading font-extrabold text-[#073b2d]">{data?.businessScaleStats.KECIL ?? 0}</p>
            <p className="text-[10px] text-slate-500">Self-Declare & Reguler</p>
          </Card>
          <Card className="rounded-2xl border-[#ebd7ba]/90 bg-white p-4 shadow-sm text-center space-y-1">
            <span className="text-[10px] uppercase font-bold text-[#b87d28]">Usaha Menengah</span>
            <p className="text-2xl font-heading font-extrabold text-[#073b2d]">{data?.businessScaleStats.MENENGAH ?? 0}</p>
            <p className="text-[10px] text-slate-500">Skema Pemeriksaan LPH</p>
          </Card>
          <Card className="rounded-2xl border-[#ebd7ba]/90 bg-white p-4 shadow-sm text-center space-y-1">
            <span className="text-[10px] uppercase font-bold text-[#b87d28]">Usaha Besar</span>
            <p className="text-2xl font-heading font-extrabold text-[#073b2d]">{data?.businessScaleStats.BESAR ?? 0}</p>
            <p className="text-[10px] text-slate-500">Industri & Korporasi</p>
          </Card>
        </div>
      )}
    </div>
  );
}
