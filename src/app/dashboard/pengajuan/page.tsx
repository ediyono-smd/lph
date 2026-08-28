"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { getMyApplicationsAction } from "@/actions/application.actions";
import { DataTable, type ColumnDef } from "@/components/tables/data-table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  FileSpreadsheet,
  Plus,
  Eye,
  Calendar,
  Layers,
  ArrowRight,
} from "lucide-react";
import { formatDate } from "@/lib/utils";

interface ApplicationItem {
  id: string;
  applicationNumber: string;
  schemeType: "SELF_DECLARE" | "REGULER";
  status: string;
  submissionDate: Date | null;
  createdAt: Date;
  products?: {
    product: {
      name: string;
    };
  }[];
}

const STATUS_LABELS: Record<string, { label: string; variant: "default" | "secondary" | "success" | "warning" | "destructive" | "info" }> = {
  DRAFT: { label: "Draf", variant: "secondary" },
  SUBMITTED: { label: "Telah Diajukan", variant: "info" },
  DOCUMENT_VERIFICATION: { label: "Verifikasi Dokumen", variant: "info" },
  NEED_CORRECTION: { label: "⚠️ Perlu Perbaikan", variant: "warning" },
  AUDITOR_ASSIGNED: { label: "Auditor Ditugaskan", variant: "info" },
  MENTOR_ASSIGNED: { label: "Pendamping Ditugaskan", variant: "info" },
  INSPECTION: { label: "Proses Pemeriksaan/Audit", variant: "info" },
  FINAL_REVIEW: { label: "Sidang Fatwa / Review", variant: "warning" },
  APPROVED: { label: "Disetujui", variant: "success" },
  REJECTED: { label: "Ditolak", variant: "destructive" },
  CERTIFICATE_ISSUED: { label: "Sertifikat Terbit", variant: "success" },
};

export default function PengajuanListPage() {
  const [applications, setApplications] = useState<ApplicationItem[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(true);

  const fetchData = async (pageNum = 1) => {
    setIsLoading(true);
    const res = await getMyApplicationsAction({ page: pageNum, limit: 10 });
    if (res.success && res.data) {
      setApplications(res.data.items as any);
      setTotalPages(res.data.totalPages);
      setPage(res.data.page);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchData(page);
  }, [page]);

  const columns: ColumnDef<ApplicationItem>[] = [
    {
      header: "Nomor Pengajuan",
      accessorKey: "applicationNumber",
      cell: (item) => (
        <span className="font-mono text-xs font-bold text-primary-900 bg-primary-50 px-2.5 py-1 rounded-md border border-primary-200">
          {item.applicationNumber}
        </span>
      ),
    },
    {
      header: "Skema Sertifikasi",
      cell: (item) => (
        <Badge
          variant={item.schemeType === "SELF_DECLARE" ? "accent" : "outline"}
          className="text-[11px]"
        >
          {item.schemeType === "SELF_DECLARE" ? "Self-Declare (UMKM)" : "Reguler (LPH)"}
        </Badge>
      ),
    },
    {
      header: "Produk Terkait",
      cell: (item) => (
        <div className="text-xs text-slate-700">
          <p className="font-medium">
            {item.products?.[0]?.product?.name || "Produk"}
          </p>
          {(item.products?.length || 0) > 1 && (
            <span className="text-[11px] text-slate-500">
              +{item.products!.length - 1} produk lainnya
            </span>
          )}
        </div>
      ),
    },
    {
      header: "Status Pengajuan",
      cell: (item) => {
        const conf = STATUS_LABELS[item.status] || {
          label: item.status,
          variant: "secondary",
        };
        return (
          <Badge variant={conf.variant} className="text-xs font-medium">
            {conf.label}
          </Badge>
        );
      },
    },
    {
      header: "Tanggal Diajukan",
      cell: (item) => (
        <span className="text-xs text-slate-600">
          {item.submissionDate ? formatDate(item.submissionDate) : "-"}
        </span>
      ),
    },
    {
      header: "Aksi",
      cell: (item) => (
        <Link href={`/dashboard/pengajuan/${item.id}`}>
          <Button
            variant="outline"
            size="sm"
            className="h-8 px-3 text-xs text-primary-700 hover:text-primary-800 hover:bg-primary-50 border-primary-200"
          >
            <Eye className="h-3.5 w-3.5 mr-1" />
            Tracking Detail
          </Button>
        </Link>
      ),
      className: "text-right",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-heading font-bold text-slate-900 flex items-center gap-2">
            <FileSpreadsheet className="h-6 w-6 text-primary-700" />
            Pengajuan Sertifikasi Halal
          </h1>
          <p className="text-sm text-slate-600 mt-1">
            Pantau status verifikasi dokumen, penugasan auditor, dan jadwal
            pemeriksaan secara transparan.
          </p>
        </div>

        <Link href="/dashboard/pengajuan/new">
          <Button className="bg-primary-800 hover:bg-primary-900 shadow-sm">
            <Plus className="h-4 w-4 mr-2" />
            Buat Pengajuan Baru
          </Button>
        </Link>
      </div>

      {/* Table */}
      <DataTable
        columns={columns}
        data={applications}
        page={page}
        totalPages={totalPages}
        onPageChange={(newPage) => setPage(newPage)}
        isLoading={isLoading}
      />
    </div>
  );
}
