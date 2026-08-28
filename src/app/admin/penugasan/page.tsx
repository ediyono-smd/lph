"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { getAllApplicationsAction } from "@/actions/verification.actions";
import { DataTable, type ColumnDef } from "@/components/tables/data-table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { UserCog, Eye, Building2, UserCheck } from "lucide-react";
import { formatDate } from "@/lib/utils";

export default function PenugasanPage() {
  const [items, setItems] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      setIsLoading(true);
      const res = await getAllApplicationsAction({ limit: 50 });
      if (res.success && res.data) {
        // Filter apps that are verified or assigned
        const filtered = res.data.items.filter(
          (app: any) =>
            app.status === "DOCUMENT_VERIFICATION" ||
            app.status === "MENTOR_ASSIGNED" ||
            app.status === "AUDITOR_ASSIGNED" ||
            app.status === "INSPECTION"
        );
        setItems(filtered);
      }
      setIsLoading(false);
    }
    loadData();
  }, []);

  const columns: ColumnDef<any>[] = [
    {
      header: "No. Pengajuan",
      accessorKey: "applicationNumber",
      cell: (item) => (
        <span className="font-mono text-xs font-bold text-slate-900">
          {item.applicationNumber}
        </span>
      ),
    },
    {
      header: "Pelaku Usaha",
      cell: (item) => (
        <div className="text-xs">
          <p className="font-semibold text-slate-900">{item.business?.name}</p>
          <p className="text-slate-500">Merek: {item.business?.brandName}</p>
        </div>
      ),
    },
    {
      header: "Skema",
      cell: (item) => (
        <Badge variant={item.schemeType === "SELF_DECLARE" ? "accent" : "outline"} className="text-[10px]">
          {item.schemeType === "SELF_DECLARE" ? "Self-Declare" : "Reguler"}
        </Badge>
      ),
    },
    {
      header: "Status Penugasan",
      cell: (item) => {
        const isAssigned =
          item.status === "MENTOR_ASSIGNED" || item.status === "AUDITOR_ASSIGNED";
        return (
          <Badge variant={isAssigned ? "success" : "warning"} className="text-[11px]">
            {isAssigned ? "Petugas Ditugaskan" : "Menunggu Alokasi Petugas"}
          </Badge>
        );
      },
    },
    {
      header: "Aksi",
      cell: (item) => (
        <Link href={`/admin/pengajuan/${item.id}`}>
          <Button
            size="sm"
            className="h-8 px-3 text-xs bg-primary-800 hover:bg-primary-900"
          >
            <UserCheck className="h-3.5 w-3.5 mr-1" />
            Kelola Penugasan
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
          <UserCog className="h-6 w-6 text-primary-700" />
          Manajemen Penugasan Petugas (Pendamping & Auditor)
        </h1>
        <p className="text-sm text-slate-600 mt-1">
          Alokasi petugas Pendamping PPH dan Auditor Lembaga Pemeriksa Halal (LPH)
          untuk pengajuan yang telah lolos verifikasi administrasi dokumen.
        </p>
      </div>

      <DataTable
        columns={columns}
        data={items}
        searchPlaceholder="Cari nomor pengajuan atau nama usaha..."
        isLoading={isLoading}
      />
    </div>
  );
}
