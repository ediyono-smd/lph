"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { getAllApplicationsAction } from "@/actions/verification.actions";
import { DataTable, type ColumnDef } from "@/components/tables/data-table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  FileCheck2,
  Eye,
  RotateCcw,
} from "lucide-react";
import { formatDate } from "@/lib/utils";

interface AppQueueItem {
  id: string;
  applicationNumber: string;
  schemeType: "SELF_DECLARE" | "REGULER";
  status: string;
  submissionDate: Date | null;
  createdAt: Date;
  business?: {
    name: string;
    brandName: string;
    nib: string;
  };
  products?: {
    product: {
      name: string;
    };
  }[];
}

const STATUS_FILTERS = [
  { value: "ALL", label: "Semua Status" },
  { value: "SUBMITTED", label: "Menunggu Verifikasi" },
  { value: "DOCUMENT_VERIFICATION", label: "Lolos Berkas" },
  { value: "NEED_CORRECTION", label: "Perlu Perbaikan" },
  { value: "INSPECTION", label: "Pemeriksaan Lapangan" },
  { value: "AUDITOR_ASSIGNED", label: "Auditor Ditugaskan" },
  { value: "MENTOR_ASSIGNED", label: "Pendamping Ditugaskan" },
  { value: "FINAL_REVIEW", label: "Review Akhir / Fatwa" },
  { value: "APPROVED", label: "Disetujui" },
  { value: "CERTIFICATE_ISSUED", label: "Sertifikat Terbit" },
];

export default function AdminPengajuanQueuePage() {
  const [items, setItems] = useState<AppQueueItem[]>([]);
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [schemeFilter, setSchemeFilter] = useState("ALL");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  const fetchData = async (
    pageNum = 1,
    searchQuery = "",
    status = "ALL",
    scheme = "ALL",
    limit = 10
  ) => {
    setIsLoading(true);
    const res = await getAllApplicationsAction({
      page: pageNum,
      limit,
      search: searchQuery,
      status,
      scheme,
    });
    if (res.success && res.data) {
      setItems(res.data.items as any);
      setTotalPages(res.data.totalPages);
      setTotalCount(res.data.total);
      setPage(res.data.page);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchData(page, search, statusFilter, schemeFilter, pageSize);
  }, [page, search, statusFilter, schemeFilter, pageSize]);

  const handleResetFilters = () => {
    setStatusFilter("ALL");
    setSchemeFilter("ALL");
    setSearch("");
    setPage(1);
  };

  const handlePageSizeChange = (newPageSize: number) => {
    setPageSize(newPageSize);
    setPage(1);
  };

  const isFilterActive = statusFilter !== "ALL" || schemeFilter !== "ALL" || search !== "";

  const columns: ColumnDef<AppQueueItem>[] = [
    {
      header: "No.",
      cell: (_, index) => (
        <span className="font-mono text-xs font-bold text-slate-500">
          {(page - 1) * pageSize + index + 1}
        </span>
      ),
      className: "w-10 text-center",
    },
    {
      header: "No. Pengajuan & Skema",
      accessorKey: "applicationNumber",
      cell: (item) => (
        <div className="space-y-0.5">
          <span className="font-mono text-[11px] font-bold text-slate-900 bg-[#fbf5eb] px-1.5 py-0.5 rounded border border-[#ebd7ba] inline-block">
            {item.applicationNumber}
          </span>
          <div>
            <Badge
              variant={item.schemeType === "SELF_DECLARE" ? "accent" : "outline"}
              className="text-[9px] px-1.5 py-0 font-bold"
            >
              {item.schemeType === "SELF_DECLARE" ? "Self-Declare" : "Reguler"}
            </Badge>
          </div>
        </div>
      ),
    },
    {
      header: "Pelaku Usaha & NIB",
      cell: (item) => (
        <div className="leading-snug">
          <p className="font-bold text-xs text-slate-900">
            {item.business?.name || "Nama Usaha"}
          </p>
          <p className="text-[10px] text-slate-500 font-normal">
            NIB: <span className="font-mono text-slate-700">{item.business?.nib}</span> • Merek: <strong className="text-slate-800">{item.business?.brandName}</strong>
          </p>
        </div>
      ),
    },
    {
      header: "Produk Diajukan",
      cell: (item) => (
        <div className="text-xs text-slate-700 leading-snug">
          <p className="font-semibold text-slate-900 text-xs">
            {item.products?.[0]?.product?.name || "Produk"}
          </p>
          {(item.products?.length || 0) > 1 && (
            <span className="text-[10px] text-[#b87d28] font-bold">
              +{item.products!.length - 1} produk lainnya
            </span>
          )}
        </div>
      ),
    },
    {
      header: "Status Alur",
      cell: (item) => {
        const isCorrection = item.status === "NEED_CORRECTION";
        const isSubmitted = item.status === "SUBMITTED";
        const isApproved = item.status === "APPROVED" || item.status === "CERTIFICATE_ISSUED";
        const isInspection = item.status === "INSPECTION";

        return (
          <Badge
            variant={
              isCorrection
                ? "warning"
                : isSubmitted
                ? "info"
                : isApproved
                ? "success"
                : isInspection
                ? "accent"
                : "secondary"
            }
            className="text-[9px] px-1.5 py-0.5 font-bold tracking-wider"
          >
            {item.status.replace("_", " ")}
          </Badge>
        );
      },
    },
    {
      header: "Tgl Masuk",
      cell: (item) => (
        <span className="text-[11px] text-slate-600 font-medium whitespace-nowrap">
          {item.submissionDate ? formatDate(item.submissionDate) : "-"}
        </span>
      ),
    },
    {
      header: "Aksi",
      cell: (item) => (
        <Link href={`/admin/pengajuan/${item.id}`}>
          <Button
            size="sm"
            className="h-7 px-2.5 text-[11px] bg-[#073b2d] hover:bg-[#05291f] text-white font-bold rounded-lg shadow-sm transition-transform active:scale-95"
          >
            <Eye className="h-3 w-3 mr-1 text-[#e5a952]" />
            Verifikasi
          </Button>
        </Link>
      ),
      className: "text-right w-24",
    },
  ];

  return (
    <div className="space-y-2.5">
      {/* Compact Title Bar */}
      <div className="flex items-center justify-between gap-2.5">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-[#073b2d] flex items-center justify-center text-[#e5a952] font-bold shadow-sm shrink-0">
            <FileCheck2 className="h-4 w-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base font-heading font-extrabold text-slate-900 leading-tight">
                Antrean Pengajuan Halal
              </h1>
              <Badge className="bg-[#fbf5eb] text-[#b87d28] border border-[#ebd7ba] text-[9px] font-extrabold px-1.5 py-0 rounded-full">
                {totalCount} Permohonan
              </Badge>
            </div>
            <p className="text-[10px] text-slate-500 font-normal">
              Kelola, verifikasi berkas, dan pantau seluruh status alur sertifikasi halal.
            </p>
          </div>
        </div>
      </div>

      {/* DataTable with Compact Table Cells, Page Size (10, 25, 50, 100), and Integrated Controls */}
      <DataTable
        columns={columns}
        data={items}
        searchPlaceholder="Cari nomor pengajuan atau nama usaha..."
        onSearch={(q) => {
          setSearch(q);
          setPage(1);
        }}
        customFilter={
          <>
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setPage(1);
              }}
              className="h-8 px-2.5 rounded-xl border border-[#ebd7ba] bg-[#fcfaf6] text-xs font-semibold text-slate-800 shadow-sm focus:outline-none focus:ring-1 focus:ring-[#e5a952]"
            >
              {STATUS_FILTERS.map((f) => (
                <option key={f.value} value={f.value}>
                  {f.label}
                </option>
              ))}
            </select>

            <select
              value={schemeFilter}
              onChange={(e) => {
                setSchemeFilter(e.target.value);
                setPage(1);
              }}
              className="h-8 px-2.5 rounded-xl border border-[#ebd7ba] bg-[#fcfaf6] text-xs font-semibold text-slate-800 shadow-sm focus:outline-none focus:ring-1 focus:ring-[#e5a952]"
            >
              <option value="ALL">Semua Skema</option>
              <option value="SELF_DECLARE">Self-Declare</option>
              <option value="REGULER">Reguler</option>
            </select>

            {isFilterActive && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleResetFilters}
                className="h-8 px-2 rounded-xl text-xs font-bold text-slate-600 hover:text-red-600 hover:bg-red-50"
              >
                <RotateCcw className="h-3 w-3 mr-1" />
                Reset
              </Button>
            )}
          </>
        }
        page={page}
        totalPages={totalPages}
        pageSize={pageSize}
        pageSizeOptions={[10, 25, 50, 100]}
        totalItems={totalCount}
        onPageChange={(newPage) => setPage(newPage)}
        onPageSizeChange={handlePageSizeChange}
        isLoading={isLoading}
      />
    </div>
  );
}
