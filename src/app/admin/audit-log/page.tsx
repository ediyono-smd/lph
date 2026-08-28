"use client";

import React, { useState, useEffect } from "react";
import { getAuditLogsAction } from "@/actions/admin.actions";
import { DataTable, type ColumnDef } from "@/components/tables/data-table";
import { Badge } from "@/components/ui/badge";
import { History } from "lucide-react";
import { formatDateTime } from "@/lib/utils";

export default function AdminAuditLogsPage() {
  const [logs, setLogs] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(true);

  const fetchData = async (pageNum = 1) => {
    setIsLoading(true);
    const res = await getAuditLogsAction({ page: pageNum, limit: 15 });
    if (res.success && res.data) {
      setLogs(res.data.items);
      setTotalPages(res.data.totalPages);
      setPage(res.data.page);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchData(page);
  }, [page]);

  const columns: ColumnDef<any>[] = [
    {
      header: "Waktu Kejadian",
      cell: (item) => (
        <span className="text-xs text-slate-500 font-mono">
          {formatDateTime(item.createdAt)}
        </span>
      ),
    },
    {
      header: "Aksi Keamanan",
      accessorKey: "action",
      cell: (item) => (
        <Badge variant="outline" className="font-mono text-[10px] font-bold">
          {item.action}
        </Badge>
      ),
    },
    {
      header: "Pengguna / Eksekutor",
      cell: (item) => (
        <div className="text-xs">
          <p className="font-semibold text-slate-900">{item.user?.fullName || "System Service"}</p>
          <p className="text-[10px] text-slate-500">{item.user?.email}</p>
        </div>
      ),
    },
    {
      header: "Entitas Terkait",
      cell: (item) => (
        <div className="text-xs text-slate-700">
          <span className="font-mono bg-slate-100 px-1.5 py-0.5 rounded text-[10px]">
            {item.entityType}
          </span>
          <p className="text-[10px] text-slate-400 truncate max-w-xs mt-0.5">
            ID: {item.entityId}
          </p>
        </div>
      ),
    },
    {
      header: "Payload Nilai Baru",
      cell: (item) => (
        <pre className="text-[10px] bg-slate-50 p-1.5 rounded border border-slate-200 max-w-xs overflow-x-auto text-slate-600 font-mono">
          {JSON.stringify(item.newValues)}
        </pre>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-heading font-bold text-slate-900 flex items-center gap-2">
          <History className="h-6 w-6 text-primary-700" />
          Audit Trail & Log Keamanan Sistem
        </h1>
        <p className="text-sm text-slate-600 mt-1">
          Catatan tidak dapat diubah (immutable log) dari seluruh tindakan autentikasi, mutasi status sertifikasi, dan aktivitas administratif.
        </p>
      </div>

      <DataTable
        columns={columns}
        data={logs}
        page={page}
        totalPages={totalPages}
        onPageChange={(p) => setPage(p)}
        isLoading={isLoading}
      />
    </div>
  );
}
