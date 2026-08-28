"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { getMyApplicationsAction } from "@/actions/application.actions";
import { DataTable, type ColumnDef } from "@/components/tables/data-table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, Eye, CheckCircle2 } from "lucide-react";
import { formatDate } from "@/lib/utils";

export default function PerbaikanPage() {
  const [corrections, setCorrections] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      setIsLoading(true);
      const res = await getMyApplicationsAction({ limit: 50 });
      if (res.success && res.data) {
        // Filter only NEED_CORRECTION
        const filtered = res.data.items.filter(
          (app: any) => app.status === "NEED_CORRECTION"
        );
        setCorrections(filtered);
      }
      setIsLoading(false);
    }
    loadData();
  }, []);

  const columns: ColumnDef<any>[] = [
    {
      header: "Nomor Pengajuan",
      accessorKey: "applicationNumber",
      cell: (item) => (
        <span className="font-mono text-xs font-bold text-amber-900 bg-amber-50 px-2.5 py-1 rounded-md border border-amber-200">
          {item.applicationNumber}
        </span>
      ),
    },
    {
      header: "Skema",
      cell: (item) => (
        <Badge variant="outline" className="text-[11px]">
          {item.schemeType === "SELF_DECLARE" ? "Self-Declare" : "Reguler"}
        </Badge>
      ),
    },
    {
      header: "Catatan Verifikator Terakhir",
      cell: (item) => (
        <p className="text-xs text-slate-700 max-w-md line-clamp-2">
          {item.statusHistories?.[0]?.notes || "Mohon periksa dan perbaiki kelengkapan dokumen."}
        </p>
      ),
    },
    {
      header: "Aksi Perbaikan",
      cell: (item) => (
        <Link href={`/dashboard/pengajuan/${item.id}`}>
          <Button
            size="sm"
            className="h-8 px-3 text-xs bg-amber-600 hover:bg-amber-700 text-white"
          >
            <AlertTriangle className="h-3.5 w-3.5 mr-1" />
            Buka & Perbaiki
          </Button>
        </Link>
      ),
      className: "text-right",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-heading font-bold text-slate-900 flex items-center gap-2">
          <AlertTriangle className="h-6 w-6 text-amber-600" />
          Kotak Masuk Perbaikan (Need Correction)
        </h1>
        <p className="text-sm text-slate-600 mt-1">
          Daftar pengajuan sertifikasi yang membutuhkan revisi dokumen atau data
          sebelum dapat diproses ke tahapan audit berikutnya.
        </p>
      </div>

      <DataTable
        columns={columns}
        data={corrections}
        searchPlaceholder="Cari pengajuan yang perlu diperbaiki..."
        isLoading={isLoading}
      />
    </div>
  );
}
