"use client";

import React, { useState, useEffect } from "react";
import { getUsersListAction } from "@/actions/admin.actions";
import { DataTable, type ColumnDef } from "@/components/tables/data-table";
import { Badge } from "@/components/ui/badge";
import {
  Users,
  Building2,
  Award,
  UserCheck,
  FileCheck2,
  UserCog,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import { formatDate } from "@/lib/utils";
import { cn } from "@/lib/utils";

const USER_TABS = [
  { id: "ALL", label: "Semua Akun", icon: Users },
  { id: "BUSINESS_OWNER", label: "Pelaku Usaha", icon: Building2 },
  { id: "AUDITOR", label: "Auditor Halal", icon: Award },
  { id: "MENTOR", label: "Pendamping PPH", icon: UserCheck },
  { id: "VERIFIER", label: "Verifikator", icon: FileCheck2 },
  { id: "ADMIN", label: "Administrator", icon: UserCog },
];

export default function AdminUsersPage() {
  const [activeTab, setActiveTab] = useState("ALL");
  const [usersList, setUsersList] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [counts, setCounts] = useState<Record<string, number>>({
    ALL: 0,
    BUSINESS_OWNER: 0,
    AUDITOR: 0,
    MENTOR: 0,
    VERIFIER: 0,
    ADMIN: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  const fetchData = async (pageNum = 1, searchQuery = "", role = "ALL", limit = 10) => {
    setIsLoading(true);
    const res = await getUsersListAction({
      page: pageNum,
      limit,
      search: searchQuery,
      role,
    });
    if (res.success && res.data) {
      setUsersList(res.data.items);
      setTotalPages(res.data.totalPages);
      setTotalCount(res.data.total);
      setCounts(res.data.counts as any);
      setPage(res.data.page);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchData(page, search, activeTab, pageSize);
  }, [page, search, activeTab, pageSize]);

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
    setPage(1);
  };

  const handlePageSizeChange = (newPageSize: number) => {
    setPageSize(newPageSize);
    setPage(1);
  };

  const columns: ColumnDef<any>[] = [
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
      header: "Nama Pengguna & Email",
      accessorKey: "fullName",
      cell: (item) => (
        <div className="flex items-center gap-2.5">
          <div className="h-8 w-8 rounded-xl bg-[#073b2d] flex items-center justify-center text-[#e5a952] font-bold text-xs shrink-0">
            {item.fullName?.charAt(0)?.toUpperCase() || "U"}
          </div>
          <div className="leading-snug">
            <p className="font-bold text-xs text-slate-900">{item.fullName}</p>
            <p className="text-[11px] text-slate-500 font-normal">{item.email}</p>
          </div>
        </div>
      ),
    },
    {
      header: "Kontak / No. HP",
      cell: (item) => (
        <span className="text-xs font-mono text-slate-700 font-medium whitespace-nowrap">
          {item.phoneNumber || "-"}
        </span>
      ),
    },
    {
      header: "Informasi Profil & Lembaga",
      cell: (item) => {
        if (item.business) {
          return (
            <div className="leading-snug">
              <p className="text-xs font-bold text-slate-900">
                {item.business.name}
              </p>
              <p className="text-[10px] text-slate-500">
                NIB: <span className="font-mono text-[#b87d28] font-bold">{item.business.nib}</span> • {item.business.businessScale}
              </p>
            </div>
          );
        }
        if (item.auditor) {
          return (
            <div className="leading-snug">
              <p className="text-xs font-bold text-slate-900">
                {item.auditor.lphName}
              </p>
              <p className="text-[10px] text-slate-500">
                No. Reg: <span className="font-mono text-[#b87d28] font-bold">{item.auditor.auditorRegNumber}</span>
              </p>
            </div>
          );
        }
        if (item.mentor) {
          return (
            <div className="leading-snug">
              <p className="text-xs font-bold text-slate-900">
                {item.mentor.institutionName}
              </p>
              <p className="text-[10px] text-slate-500">
                No. Reg: <span className="font-mono text-[#b87d28] font-bold">{item.mentor.registrationNumber}</span>
              </p>
            </div>
          );
        }
        return (
          <div className="flex flex-wrap gap-1">
            {item.userRoles?.map((ur: any) => (
              <Badge
                key={ur.id}
                className="bg-[#fbf5eb] text-[#b87d28] border border-[#ebd7ba] text-[9px] font-extrabold px-1.5 py-0"
              >
                {ur.role?.name?.replace("_", " ")}
              </Badge>
            ))}
          </div>
        );
      },
    },
    {
      header: "Status Akun",
      cell: (item) => (
        <Badge
          variant={item.isActive ? "success" : "destructive"}
          className="text-[9px] px-1.5 py-0.5 font-bold"
        >
          {item.isActive ? "Aktif" : "Non-Aktif"}
        </Badge>
      ),
    },
    {
      header: "Tgl Registrasi",
      cell: (item) => (
        <span className="text-[11px] text-slate-500 whitespace-nowrap font-medium">
          {formatDate(item.createdAt)}
        </span>
      ),
    },
  ];

  return (
    <div className="space-y-3">
      {/* Compact Title Bar */}
      <div className="flex items-center justify-between gap-2.5">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-[#073b2d] flex items-center justify-center text-[#e5a952] font-bold shadow-sm shrink-0">
            <Users className="h-4 w-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base font-heading font-extrabold text-slate-900 leading-tight">
                Manajemen Pengguna & Hak Akses
              </h1>
              <Badge className="bg-[#fbf5eb] text-[#b87d28] border border-[#ebd7ba] text-[9px] font-extrabold px-1.5 py-0 rounded-full">
                {counts.ALL || totalCount} Total Akun
              </Badge>
            </div>
            <p className="text-[10px] text-slate-500 font-normal">
              Direktori seluruh akun pengguna berdasarkan peran (RBAC) pada ekosistem SIP-HALAL.
            </p>
          </div>
        </div>
      </div>

      {/* Role Navigation Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 border-b border-[#ebd7ba]/70">
        {USER_TABS.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          const countVal = counts[tab.id] ?? 0;

          return (
            <button
              key={tab.id}
              onClick={() => handleTabChange(tab.id)}
              className={cn(
                "flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 outline-none",
                isActive
                  ? "bg-[#073b2d] text-white shadow-sm"
                  : "bg-white text-slate-700 hover:bg-[#fbf5eb] hover:text-[#073b2d] border border-[#ebd7ba]/80"
              )}
            >
              <Icon className={cn("h-3.5 w-3.5", isActive ? "text-[#e5a952]" : "text-[#b87d28]")} />
              <span>{tab.label}</span>
              <span
                className={cn(
                  "px-1.5 py-0.2 rounded-full text-[9px] font-extrabold",
                  isActive
                    ? "bg-[#e5a952] text-slate-950"
                    : "bg-[#fbf5eb] text-[#b87d28] border border-[#ebd7ba]"
                )}
              >
                {countVal}
              </span>
            </button>
          );
        })}
      </div>

      {/* DataTable with Search, Server-Side Pagination, and Page Size (10, 25, 50, 100) */}
      <DataTable
        columns={columns}
        data={usersList}
        searchPlaceholder={`Cari nama atau email di tab ${USER_TABS.find((t) => t.id === activeTab)?.label}...`}
        onSearch={(q) => {
          setSearch(q);
          setPage(1);
        }}
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
