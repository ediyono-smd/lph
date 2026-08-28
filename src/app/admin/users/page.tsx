"use client";

import React, { useState, useEffect } from "react";
import {
  getUsersListAction,
  updateUserByAdminAction,
  createUserByAdminAction,
} from "@/actions/admin.actions";
import { DataTable, type ColumnDef } from "@/components/tables/data-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Users,
  Building2,
  CheckCircle2,
  Award,
  ShieldCheck,
  UserCheck,
  UserCog,
  Edit,
  Save,
  Loader2,
  KeyRound,
  Phone,
  User,
  UserPlus,
  Mail,
  Lock,
} from "lucide-react";
import { formatDate } from "@/lib/utils";
import { toast } from "sonner";

const USER_TABS = [
  { id: "ALL", label: "Semua Akun", icon: Users },
  { id: "BUSINESS_OWNER", label: "Pelaku Usaha", icon: Building2 },
  { id: "AUDITOR", label: "Auditor Halal", icon: Award },
  { id: "MENTOR", label: "Pendamping PPH", icon: UserCheck },
  { id: "VERIFIER", label: "Verifikator", icon: CheckCircle2 },
  { id: "ADMIN", label: "Administrator", icon: ShieldCheck },
];

const AVAILABLE_ROLES = [
  { value: "AUDITOR", label: "Auditor Halal (LPH)" },
  { value: "MENTOR", label: "Pendamping PPH (LP3H)" },
  { value: "VERIFIER", label: "Verifikator Dokumen" },
  { value: "BUSINESS_OWNER", label: "Pelaku Usaha (UMKM)" },
  { value: "ADMIN", label: "Administrator" },
  { value: "SUPER_ADMIN", label: "Super Administrator" },
  { value: "LEADER", label: "Pimpinan Fatwa" },
];

export default function AdminUsersPage() {
  const [usersList, setUsersList] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState("ALL");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [counts, setCounts] = useState<Record<string, number>>({});
  const [isLoading, setIsLoading] = useState(true);

  // Create User Modal State
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [createForm, setCreateForm] = useState({
    fullName: "",
    email: "",
    password: "",
    phoneNumber: "",
    roleName: "AUDITOR",
    lphName: "LPH Utama Indonesia",
    auditorRegNumber: "",
    institutionName: "LP3H Binaan Nasional",
    mentorRegNumber: "",
    businessName: "",
    nib: "",
  });
  const [isCreating, setIsCreating] = useState(false);

  // Edit Modal State
  const [editingUser, setEditingUser] = useState<any | null>(null);
  const [editForm, setEditForm] = useState<{
    fullName: string;
    phoneNumber: string;
    isActive: boolean;
    roleName: string;
    newPassword: string;
    businessName: string;
    nib: string;
    lphName: string;
    auditorRegNumber: string;
    institutionName: string;
    mentorRegNumber: string;
  }>({
    fullName: "",
    phoneNumber: "",
    isActive: true,
    roleName: "BUSINESS_OWNER",
    newPassword: "",
    businessName: "",
    nib: "",
    lphName: "",
    auditorRegNumber: "",
    institutionName: "",
    mentorRegNumber: "",
  });
  const [isSaving, setIsSaving] = useState(false);

  const fetchData = async (
    targetPage = 1,
    searchQuery = "",
    role = "ALL",
    limit = 10
  ) => {
    setIsLoading(true);
    const res = await getUsersListAction({
      page: targetPage,
      limit,
      search: searchQuery,
      role,
    });
    if (res.success && res.data) {
      setUsersList(res.data.items);
      setTotalPages(res.data.totalPages);
      setTotalCount(res.data.total);
      setCounts(res.data.counts);
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

  const handleOpenCreate = () => {
    // Preset role based on active tab
    let defaultRole = "AUDITOR";
    if (activeTab === "MENTOR") defaultRole = "MENTOR";
    else if (activeTab === "VERIFIER") defaultRole = "VERIFIER";
    else if (activeTab === "BUSINESS_OWNER") defaultRole = "BUSINESS_OWNER";
    else if (activeTab === "ADMIN") defaultRole = "ADMIN";

    setCreateForm({
      fullName: "",
      email: "",
      password: "",
      phoneNumber: "",
      roleName: defaultRole,
      lphName: "LPH Utama Indonesia",
      auditorRegNumber: `AUD-${new Date().getFullYear()}-${Math.floor(10000 + Math.random() * 90000)}`,
      institutionName: "LP3H Binaan Nasional",
      mentorRegNumber: `PPH-${new Date().getFullYear()}-${Math.floor(10000 + Math.random() * 90000)}`,
      businessName: "",
      nib: "",
    });
    setIsCreateOpen(true);
  };

  const handleSaveCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsCreating(true);

    const res = await createUserByAdminAction({
      fullName: createForm.fullName,
      email: createForm.email,
      password: createForm.password,
      phoneNumber: createForm.phoneNumber,
      roleName: createForm.roleName,
      lphName: createForm.lphName,
      auditorRegNumber: createForm.auditorRegNumber,
      institutionName: createForm.institutionName,
      mentorRegNumber: createForm.mentorRegNumber,
      businessName: createForm.businessName,
      nib: createForm.nib,
    });

    if (res.success) {
      toast.success(res.message);
      setIsCreateOpen(false);
      fetchData(page, search, activeTab, pageSize);
    } else {
      toast.error(res.error || "Gagal membuat akun.");
    }
    setIsCreating(false);
  };

  const handleOpenEdit = (user: any) => {
    setEditingUser(user);
    const currentRole = user.userRoles?.[0]?.role?.name || "BUSINESS_OWNER";
    setEditForm({
      fullName: user.fullName || "",
      phoneNumber: user.phoneNumber || "",
      isActive: user.isActive ?? true,
      roleName: currentRole,
      newPassword: "",
      businessName: user.business?.name || "",
      nib: user.business?.nib || "",
      lphName: user.auditor?.lphName || "",
      auditorRegNumber: user.auditor?.auditorRegNumber || "",
      institutionName: user.mentor?.institutionName || "",
      mentorRegNumber: user.mentor?.registrationNumber || "",
    });
  };

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser) return;

    setIsSaving(true);
    const res = await updateUserByAdminAction({
      userId: editingUser.id,
      fullName: editForm.fullName,
      phoneNumber: editForm.phoneNumber,
      isActive: editForm.isActive,
      roleName: editForm.roleName,
      newPassword: editForm.newPassword || undefined,
      businessName: editForm.businessName || undefined,
      nib: editForm.nib || undefined,
      lphName: editForm.lphName || undefined,
      auditorRegNumber: editForm.auditorRegNumber || undefined,
      institutionName: editForm.institutionName || undefined,
      mentorRegNumber: editForm.mentorRegNumber || undefined,
    });

    if (res.success) {
      toast.success(res.message || "Data pengguna berhasil diperbarui!");
      setEditingUser(null);
      fetchData(page, search, activeTab, pageSize);
    } else {
      toast.error(res.error || "Gagal memperbarui data pengguna.");
    }
    setIsSaving(false);
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
    {
      header: "Aksi",
      cell: (item) => (
        <Button
          size="sm"
          variant="outline"
          onClick={() => handleOpenEdit(item)}
          className="h-7 px-2.5 rounded-xl border-[#ebd7ba] bg-[#fcfaf6] hover:bg-[#fbf5eb] text-[#073b2d] hover:text-[#073b2d] font-bold text-xs shadow-xs cursor-pointer"
        >
          <Edit className="h-3 w-3 mr-1 text-[#b87d28]" />
          Edit
        </Button>
      ),
      className: "w-20 text-center",
    },
  ];

  return (
    <div className="space-y-3">
      {/* Compact Title Bar with Add User Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 bg-white p-3 rounded-2xl border border-[#ebd7ba]/90 shadow-sm">
        <div className="flex items-center gap-2.5">
          <div className="h-9 w-9 rounded-xl bg-[#073b2d] flex items-center justify-center text-[#e5a952] font-bold shadow-sm shrink-0">
            <Users className="h-5 w-5" />
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
            <p className="text-[11px] text-slate-500 font-normal">
              Kelola akun Pelaku Usaha, Auditor LPH, Pendamping PPH, Verifikator, dan Administrator.
            </p>
          </div>
        </div>

        {/* Add User Button */}
        <Button
          size="sm"
          onClick={handleOpenCreate}
          className="h-8 px-3.5 rounded-xl bg-[#073b2d] hover:bg-[#05291f] text-white font-bold text-xs shadow-sm cursor-pointer shrink-0"
        >
          <UserPlus className="h-3.5 w-3.5 mr-1.5 text-[#e5a952]" />
          Tambah Akun Baru
        </Button>
      </div>

      {/* Role Navigation Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5 border-b border-[#ebd7ba]/70">
        {USER_TABS.map((tab) => {
          const Icon = tab.icon;
          const countVal = counts[tab.id] ?? 0;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => handleTabChange(tab.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
                isActive
                  ? "bg-[#073b2d] text-white shadow-sm"
                  : "bg-white text-slate-700 hover:bg-[#fbf5eb] border border-[#ebd7ba]/80"
              }`}
            >
              <Icon className={`h-3.5 w-3.5 ${isActive ? "text-[#e5a952]" : "text-slate-500"}`} />
              <span>{tab.label}</span>
              <span
                className={`text-[10px] font-extrabold px-1.5 py-0.2 rounded-full ${
                  isActive
                    ? "bg-[#e5a952] text-[#073b2d]"
                    : "bg-[#fbf5eb] text-[#b87d28] border border-[#ebd7ba]"
                }`}
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

      {/* 1. Modal Tambah Akun Baru */}
      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto p-5 rounded-2xl border-[#ebd7ba]">
          <DialogHeader className="border-b border-[#ebd7ba]/80 pb-3">
            <DialogTitle className="text-base font-bold flex items-center gap-2 text-slate-900">
              <UserPlus className="h-5 w-5 text-[#b87d28]" />
              Tambah Akun Pengguna / Petugas Baru
            </DialogTitle>
            <p className="text-xs text-slate-500">
              Daftarkan akun Auditor, Pendamping PPH, Verifikator, atau Pelaku Usaha ke dalam sistem.
            </p>
          </DialogHeader>

          <form onSubmit={handleSaveCreate} className="space-y-3 py-2">
            {/* Peran / Role */}
            <div className="space-y-1">
              <Label className="text-xs font-bold text-slate-700">Peran / Hak Akses Akun</Label>
              <select
                value={createForm.roleName}
                onChange={(e) => setCreateForm({ ...createForm, roleName: e.target.value })}
                className="w-full h-8 px-2.5 rounded-xl border border-[#ebd7ba] bg-[#fcfaf6] text-xs font-bold text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#e5a952]"
              >
                {AVAILABLE_ROLES.map((r) => (
                  <option key={r.value} value={r.value}>
                    {r.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Nama Lengkap */}
            <div className="space-y-1">
              <Label className="text-xs font-bold text-slate-700 flex items-center gap-1">
                <User className="h-3 w-3 text-[#b87d28]" /> Nama Lengkap & Gelar
              </Label>
              <Input
                required
                placeholder="Contoh: Dr. H. Ahmad Fauzi, M.Si"
                value={createForm.fullName}
                onChange={(e) => setCreateForm({ ...createForm, fullName: e.target.value })}
                className="h-8 text-xs rounded-xl border-[#ebd7ba] bg-[#fcfaf6]"
              />
            </div>

            {/* Email & Password */}
            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1">
                <Label className="text-xs font-bold text-slate-700 flex items-center gap-1">
                  <Mail className="h-3 w-3 text-[#b87d28]" /> Email Login
                </Label>
                <Input
                  required
                  type="email"
                  placeholder="user@halal.go.id"
                  value={createForm.email}
                  onChange={(e) => setCreateForm({ ...createForm, email: e.target.value })}
                  className="h-8 text-xs rounded-xl border-[#ebd7ba] bg-[#fcfaf6]"
                />
              </div>

              <div className="space-y-1">
                <Label className="text-xs font-bold text-slate-700 flex items-center gap-1">
                  <Lock className="h-3 w-3 text-[#b87d28]" /> Password Awal
                </Label>
                <Input
                  required
                  type="password"
                  placeholder="Min. 6 karakter"
                  value={createForm.password}
                  onChange={(e) => setCreateForm({ ...createForm, password: e.target.value })}
                  className="h-8 text-xs rounded-xl border-[#ebd7ba] bg-[#fcfaf6]"
                />
              </div>
            </div>

            {/* Nomor HP */}
            <div className="space-y-1">
              <Label className="text-xs font-bold text-slate-700 flex items-center gap-1">
                <Phone className="h-3 w-3 text-[#b87d28]" /> Nomor WhatsApp / HP
              </Label>
              <Input
                placeholder="08xxxxxxxxxx"
                value={createForm.phoneNumber}
                onChange={(e) => setCreateForm({ ...createForm, phoneNumber: e.target.value })}
                className="h-8 text-xs rounded-xl border-[#ebd7ba] bg-[#fcfaf6]"
              />
            </div>

            {/* Data Khusus Peran */}
            {createForm.roleName === "AUDITOR" && (
              <div className="p-2.5 bg-[#fcfaf6] rounded-xl border border-[#ebd7ba] space-y-2">
                <span className="text-[10px] uppercase font-bold text-[#b87d28] block">
                  Data Lembaga Pemeriksa Halal (LPH)
                </span>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <Label className="text-[10px] text-slate-600 font-semibold">Nama LPH</Label>
                    <Input
                      required
                      value={createForm.lphName}
                      onChange={(e) => setCreateForm({ ...createForm, lphName: e.target.value })}
                      placeholder="LPH Utama Indonesia"
                      className="h-7 text-xs rounded-lg border-[#ebd7ba] bg-white mt-0.5"
                    />
                  </div>
                  <div>
                    <Label className="text-[10px] text-slate-600 font-semibold">No. Registrasi Auditor</Label>
                    <Input
                      required
                      value={createForm.auditorRegNumber}
                      onChange={(e) => setCreateForm({ ...createForm, auditorRegNumber: e.target.value })}
                      placeholder="AUD-2026-XXXXX"
                      className="h-7 text-xs rounded-lg border-[#ebd7ba] bg-white mt-0.5 font-mono"
                    />
                  </div>
                </div>
              </div>
            )}

            {createForm.roleName === "MENTOR" && (
              <div className="p-2.5 bg-[#fcfaf6] rounded-xl border border-[#ebd7ba] space-y-2">
                <span className="text-[10px] uppercase font-bold text-[#b87d28] block">
                  Data Lembaga Pendamping PPH (LP3H)
                </span>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <Label className="text-[10px] text-slate-600 font-semibold">Nama Lembaga LP3H</Label>
                    <Input
                      required
                      value={createForm.institutionName}
                      onChange={(e) => setCreateForm({ ...createForm, institutionName: e.target.value })}
                      placeholder="LP3H Binaan Nasional"
                      className="h-7 text-xs rounded-lg border-[#ebd7ba] bg-white mt-0.5"
                    />
                  </div>
                  <div>
                    <Label className="text-[10px] text-slate-600 font-semibold">No. Registrasi Pendamping</Label>
                    <Input
                      required
                      value={createForm.mentorRegNumber}
                      onChange={(e) => setCreateForm({ ...createForm, mentorRegNumber: e.target.value })}
                      placeholder="PPH-2026-XXXXX"
                      className="h-7 text-xs rounded-lg border-[#ebd7ba] bg-white mt-0.5 font-mono"
                    />
                  </div>
                </div>
              </div>
            )}

            {createForm.roleName === "BUSINESS_OWNER" && (
              <div className="p-2.5 bg-[#fcfaf6] rounded-xl border border-[#ebd7ba] space-y-2">
                <span className="text-[10px] uppercase font-bold text-[#b87d28] block">
                  Data Pelaku Usaha (NIB)
                </span>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <Label className="text-[10px] text-slate-600 font-semibold">Nama Usaha / PT</Label>
                    <Input
                      required
                      value={createForm.businessName}
                      onChange={(e) => setCreateForm({ ...createForm, businessName: e.target.value })}
                      placeholder="Dapur Sambal Nusantara"
                      className="h-7 text-xs rounded-lg border-[#ebd7ba] bg-white mt-0.5"
                    />
                  </div>
                  <div>
                    <Label className="text-[10px] text-slate-600 font-semibold">NIB (13 Digit)</Label>
                    <Input
                      required
                      value={createForm.nib}
                      onChange={(e) => setCreateForm({ ...createForm, nib: e.target.value })}
                      placeholder="1234567890123"
                      className="h-7 text-xs rounded-lg border-[#ebd7ba] bg-white mt-0.5 font-mono"
                    />
                  </div>
                </div>
              </div>
            )}

            <DialogFooter className="pt-2 border-t border-[#ebd7ba]/60 flex items-center justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setIsCreateOpen(false)}
                className="h-8 rounded-xl border-[#ebd7ba] text-xs font-bold"
              >
                Batal
              </Button>
              <Button
                type="submit"
                size="sm"
                disabled={isCreating}
                className="h-8 rounded-xl bg-[#073b2d] hover:bg-[#05291f] text-white text-xs font-bold cursor-pointer"
              >
                {isCreating ? (
                  <>
                    <Loader2 className="h-3.5 w-3.5 mr-1.5 animate-spin" />
                    Menyimpan...
                  </>
                ) : (
                  <>
                    <Save className="h-3.5 w-3.5 mr-1.5 text-[#e5a952]" />
                    Simpan & Buat Akun
                  </>
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* 2. Modal Edit Data Pengguna */}
      <Dialog open={!!editingUser} onOpenChange={(open) => !open && setEditingUser(null)}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto p-5 rounded-2xl border-[#ebd7ba]">
          <DialogHeader className="border-b border-[#ebd7ba]/80 pb-3">
            <DialogTitle className="text-base font-bold flex items-center gap-2 text-slate-900">
              <UserCog className="h-5 w-5 text-[#b87d28]" />
              Edit Data Pengguna & Hak Akses
            </DialogTitle>
            <p className="text-xs text-slate-500">
              Akun: <strong className="text-slate-800">{editingUser?.email}</strong>
            </p>
          </DialogHeader>

          <form onSubmit={handleSaveEdit} className="space-y-3.5 py-2">
            {/* Nama Lengkap */}
            <div className="space-y-1">
              <Label className="text-xs font-bold text-slate-700 flex items-center gap-1">
                <User className="h-3 w-3 text-[#b87d28]" /> Nama Lengkap
              </Label>
              <Input
                required
                value={editForm.fullName}
                onChange={(e) => setEditForm({ ...editForm, fullName: e.target.value })}
                className="h-8 text-xs rounded-xl border-[#ebd7ba] bg-[#fcfaf6]"
              />
            </div>

            {/* Nomor HP */}
            <div className="space-y-1">
              <Label className="text-xs font-bold text-slate-700 flex items-center gap-1">
                <Phone className="h-3 w-3 text-[#b87d28]" /> Nomor Telepon / HP
              </Label>
              <Input
                value={editForm.phoneNumber}
                onChange={(e) => setEditForm({ ...editForm, phoneNumber: e.target.value })}
                placeholder="08xxxxxxxxxx"
                className="h-8 text-xs rounded-xl border-[#ebd7ba] bg-[#fcfaf6]"
              />
            </div>

            {/* Peran Akun (RBAC) & Status */}
            <div className="grid grid-cols-2 gap-2.5">
              <div className="space-y-1">
                <Label className="text-xs font-bold text-slate-700">Peran / Hak Akses</Label>
                <select
                  value={editForm.roleName}
                  onChange={(e) => setEditForm({ ...editForm, roleName: e.target.value })}
                  className="w-full h-8 px-2 rounded-xl border border-[#ebd7ba] bg-[#fcfaf6] text-xs font-bold text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#e5a952]"
                >
                  {AVAILABLE_ROLES.map((r) => (
                    <option key={r.value} value={r.value}>
                      {r.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <Label className="text-xs font-bold text-slate-700">Status Akun</Label>
                <select
                  value={editForm.isActive ? "true" : "false"}
                  onChange={(e) => setEditForm({ ...editForm, isActive: e.target.value === "true" })}
                  className="w-full h-8 px-2 rounded-xl border border-[#ebd7ba] bg-[#fcfaf6] text-xs font-bold text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#e5a952]"
                >
                  <option value="true">✓ Aktif</option>
                  <option value="false">✗ Non-Aktif (Diblokir)</option>
                </select>
              </div>
            </div>

            {/* Role-Specific Data Inputs */}
            {editForm.roleName === "BUSINESS_OWNER" && (
              <div className="p-2.5 bg-[#fcfaf6] rounded-xl border border-[#ebd7ba] space-y-2">
                <span className="text-[10px] uppercase font-bold text-[#b87d28] block">
                  Data Pelaku Usaha (NIB)
                </span>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <Label className="text-[10px] text-slate-600 font-semibold">Nama Usaha / PT</Label>
                    <Input
                      value={editForm.businessName}
                      onChange={(e) => setEditForm({ ...editForm, businessName: e.target.value })}
                      placeholder="Nama Usaha"
                      className="h-7 text-xs rounded-lg border-[#ebd7ba] bg-white mt-0.5"
                    />
                  </div>
                  <div>
                    <Label className="text-[10px] text-slate-600 font-semibold">NIB (13 Digit)</Label>
                    <Input
                      value={editForm.nib}
                      onChange={(e) => setEditForm({ ...editForm, nib: e.target.value })}
                      placeholder="NIB 13 Digit"
                      className="h-7 text-xs rounded-lg border-[#ebd7ba] bg-white mt-0.5 font-mono"
                    />
                  </div>
                </div>
              </div>
            )}

            {editForm.roleName === "AUDITOR" && (
              <div className="p-2.5 bg-[#fcfaf6] rounded-xl border border-[#ebd7ba] space-y-2">
                <span className="text-[10px] uppercase font-bold text-[#b87d28] block">
                  Data Lembaga Pemeriksa Halal (LPH)
                </span>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <Label className="text-[10px] text-slate-600 font-semibold">Nama LPH</Label>
                    <Input
                      value={editForm.lphName}
                      onChange={(e) => setEditForm({ ...editForm, lphName: e.target.value })}
                      placeholder="LPH Utama"
                      className="h-7 text-xs rounded-lg border-[#ebd7ba] bg-white mt-0.5"
                    />
                  </div>
                  <div>
                    <Label className="text-[10px] text-slate-600 font-semibold">No. Registrasi Auditor</Label>
                    <Input
                      value={editForm.auditorRegNumber}
                      onChange={(e) => setEditForm({ ...editForm, auditorRegNumber: e.target.value })}
                      placeholder="AUD-XXXXXX"
                      className="h-7 text-xs rounded-lg border-[#ebd7ba] bg-white mt-0.5 font-mono"
                    />
                  </div>
                </div>
              </div>
            )}

            {editForm.roleName === "MENTOR" && (
              <div className="p-2.5 bg-[#fcfaf6] rounded-xl border border-[#ebd7ba] space-y-2">
                <span className="text-[10px] uppercase font-bold text-[#b87d28] block">
                  Data Lembaga Pendamping (LP3H)
                </span>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <Label className="text-[10px] text-slate-600 font-semibold">Nama Lembaga LP3H</Label>
                    <Input
                      value={editForm.institutionName}
                      onChange={(e) => setEditForm({ ...editForm, institutionName: e.target.value })}
                      placeholder="LP3H"
                      className="h-7 text-xs rounded-lg border-[#ebd7ba] bg-white mt-0.5"
                    />
                  </div>
                  <div>
                    <Label className="text-[10px] text-slate-600 font-semibold">No. Registrasi Pendamping</Label>
                    <Input
                      value={editForm.mentorRegNumber}
                      onChange={(e) => setEditForm({ ...editForm, mentorRegNumber: e.target.value })}
                      placeholder="PPH-XXXXXX"
                      className="h-7 text-xs rounded-lg border-[#ebd7ba] bg-white mt-0.5 font-mono"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Reset Password Baru (Opsional) */}
            <div className="space-y-1 pt-1 border-t border-[#ebd7ba]/60">
              <Label className="text-xs font-bold text-slate-700 flex items-center gap-1">
                <KeyRound className="h-3 w-3 text-[#b87d28]" /> Reset Password Baru (Opsional)
              </Label>
              <Input
                type="password"
                placeholder="Kosongkan jika tidak ingin mengubah password..."
                value={editForm.newPassword}
                onChange={(e) => setEditForm({ ...editForm, newPassword: e.target.value })}
                className="h-8 text-xs rounded-xl border-[#ebd7ba] bg-[#fcfaf6]"
              />
              <p className="text-[10px] text-slate-400">Minimal 6 karakter jika diisi.</p>
            </div>

            <DialogFooter className="pt-2 border-t border-[#ebd7ba]/60 flex items-center justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setEditingUser(null)}
                className="h-8 rounded-xl border-[#ebd7ba] text-xs font-bold"
              >
                Batal
              </Button>
              <Button
                type="submit"
                size="sm"
                disabled={isSaving}
                className="h-8 rounded-xl bg-[#073b2d] hover:bg-[#05291f] text-white text-xs font-bold"
              >
                {isSaving ? (
                  <>
                    <Loader2 className="h-3.5 w-3.5 mr-1.5 animate-spin" />
                    Menyimpan...
                  </>
                ) : (
                  <>
                    <Save className="h-3.5 w-3.5 mr-1.5 text-[#e5a952]" />
                    Simpan Perubahan
                  </>
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
