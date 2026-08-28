"use client";

import React, { useState, useEffect, useTransition } from "react";
import {
  getMaterialsAction,
  createMaterialAction,
  updateMaterialAction,
  deleteMaterialAction,
} from "@/actions/material.actions";
import { getMaterialCategoriesAction } from "@/actions/master.actions";
import { DataTable, type ColumnDef } from "@/components/tables/data-table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  FlaskConical,
  Plus,
  Edit2,
  Trash2,
  Loader2,
  Calendar,
  AlertTriangle,
  CheckCircle,
} from "lucide-react";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  materialSchema,
  type MaterialInput,
} from "@/lib/validation/material.validation";
import { formatDate } from "@/lib/utils";

interface MaterialItem {
  id: string;
  name: string;
  tradeName: string | null;
  manufacturer: string;
  supplier: string | null;
  isHalalCertified: boolean;
  halalCertNumber: string | null;
  certIssuer: string | null;
  certValidUntil: Date | null;
  categoryId: string;
  category?: {
    id: string;
    name: string;
    isCritical: boolean;
  };
}

export default function BahanPage() {
  const [materials, setMaterials] = useState<MaterialItem[]>([]);
  const [categories, setCategories] = useState<{ id: string; name: string; isCritical: boolean }[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  // Dialog State
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<MaterialItem | null>(null);
  const [isPending, startTransition] = useTransition();

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<MaterialInput>({
    resolver: zodResolver(materialSchema),
    defaultValues: {
      categoryId: "",
      name: "",
      tradeName: "",
      manufacturer: "",
      supplier: "",
      isHalalCertified: true,
      halalCertNumber: "",
      certIssuer: "",
      certValidUntil: "",
    },
  });

  const isCertified = watch("isHalalCertified");

  const loadCategories = async () => {
    const res = await getMaterialCategoriesAction({ limit: 100 });
    if (res.success && res.data) {
      setCategories(res.data.items);
    }
  };

  const fetchData = async (pageNum = 1, searchQuery = "") => {
    setIsLoading(true);
    const res = await getMaterialsAction({
      page: pageNum,
      limit: 10,
      search: searchQuery,
    });
    if (res.success && res.data) {
      setMaterials(res.data.items as any);
      setTotal(res.data.total);
      setTotalPages(res.data.totalPages);
      setPage(res.data.page);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    loadCategories();
  }, []);

  useEffect(() => {
    fetchData(page, search);
  }, [page, search]);

  const handleOpenAdd = () => {
    setEditingItem(null);
    reset({
      categoryId: categories[0]?.id || "",
      name: "",
      tradeName: "",
      manufacturer: "",
      supplier: "",
      isHalalCertified: true,
      halalCertNumber: "",
      certIssuer: "",
      certValidUntil: "",
    });
    setIsDialogOpen(true);
  };

  const handleOpenEdit = (item: MaterialItem) => {
    setEditingItem(item);
    setValue("categoryId", item.categoryId);
    setValue("name", item.name);
    setValue("tradeName", item.tradeName || "");
    setValue("manufacturer", item.manufacturer);
    setValue("supplier", item.supplier || "");
    setValue("isHalalCertified", item.isHalalCertified);
    setValue("halalCertNumber", item.halalCertNumber || "");
    setValue("certIssuer", item.certIssuer || "");
    setValue(
      "certValidUntil",
      item.certValidUntil ? new Date(item.certValidUntil).toISOString().split("T")[0] : ""
    );
    setIsDialogOpen(true);
  };

  const handleDelete = (id: string, name: string) => {
    if (!confirm(`Hapus bahan "${name}" dari katalog?`)) return;
    startTransition(async () => {
      const res = await deleteMaterialAction(id);
      if (res.success) {
        toast.success(res.message || "Bahan berhasil dihapus.");
        fetchData(page, search);
      } else {
        toast.error(res.error || "Gagal menghapus bahan.");
      }
    });
  };

  const onSubmit = (data: MaterialInput) => {
    startTransition(async () => {
      if (editingItem) {
        const res = await updateMaterialAction(editingItem.id, data);
        if (res.success) {
          toast.success(res.message || "Bahan berhasil diperbarui.");
          setIsDialogOpen(false);
          fetchData(page, search);
        } else {
          toast.error(res.error || "Gagal memperbarui bahan.");
        }
      } else {
        const res = await createMaterialAction(data);
        if (res.success) {
          toast.success(res.message || "Bahan berhasil ditambahkan!");
          setIsDialogOpen(false);
          fetchData(1, search);
        } else {
          toast.error(res.error || "Gagal menambahkan bahan.");
        }
      }
    });
  };

  const columns: ColumnDef<MaterialItem>[] = [
    {
      header: "Nama Bahan & Produsen",
      accessorKey: "name",
      cell: (item) => (
        <div>
          <p className="font-semibold text-slate-900">{item.name}</p>
          <p className="text-xs text-slate-500">
            Produsen: <strong>{item.manufacturer}</strong>
            {item.supplier && ` • Supplier: ${item.supplier}`}
          </p>
        </div>
      ),
    },
    {
      header: "Kategori",
      cell: (item) => (
        <span className="text-xs text-slate-700 font-medium">
          {item.category?.name || "Bahan"}
        </span>
      ),
    },
    {
      header: "Status Sertifikat Halal",
      cell: (item) => {
        if (!item.isHalalCertified) {
          return (
            <Badge variant="secondary" className="text-[11px]">
              Non-Sertifikasi (Bahan Alami)
            </Badge>
          );
        }

        const isExpired =
          item.certValidUntil && new Date(item.certValidUntil) < new Date();

        return (
          <div className="space-y-1">
            <Badge variant={isExpired ? "destructive" : "success"} className="text-[11px]">
              {isExpired ? "Sertifikat Kedaluwarsa" : "Bersertifikat Halal"}
            </Badge>
            {item.halalCertNumber && (
              <p className="text-[11px] font-mono text-slate-600">
                {item.halalCertNumber} ({item.certIssuer || "BPJPH/MUI"})
              </p>
            )}
          </div>
        );
      },
    },
    {
      header: "Masa Berlaku",
      cell: (item) => (
        <span className="text-xs text-slate-600">
          {item.certValidUntil ? formatDate(item.certValidUntil) : "Seumur Hidup"}
        </span>
      ),
    },
    {
      header: "Aksi",
      cell: (item) => (
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleOpenEdit(item)}
            className="h-8 px-2 text-slate-600 hover:text-primary-700"
          >
            <Edit2 className="h-3.5 w-3.5 mr-1" />
            Edit
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleDelete(item.id, item.name)}
            className="h-8 px-2 text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </Button>
        </div>
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
            <FlaskConical className="h-6 w-6 text-primary-700" />
            Katalog Bahan Baku & Penolong
          </h1>
          <p className="text-sm text-slate-600 mt-1">
            Daftarkan semua bahan yang digunakan dalam proses produksi beserta
            dokumen sertifikat halal supplier.
          </p>
        </div>

        <Button
          onClick={handleOpenAdd}
          className="bg-primary-800 hover:bg-primary-900 shadow-sm"
        >
          <Plus className="h-4 w-4 mr-2" />
          Tambah Bahan Baku
        </Button>
      </div>

      {/* Table */}
      <DataTable
        columns={columns}
        data={materials}
        searchPlaceholder="Cari bahan baku, produsen, atau no. sertifikat..."
        onSearch={(query) => {
          setSearch(query);
          setPage(1);
        }}
        page={page}
        totalPages={totalPages}
        onPageChange={(newPage) => setPage(newPage)}
        isLoading={isLoading}
      />

      {/* Add / Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[540px]">
          <DialogHeader>
            <DialogTitle>
              {editingItem ? "Edit Bahan Baku" : "Tambah Bahan Baku Baru"}
            </DialogTitle>
            <DialogDescription>
              Isi data bahan baku dengan akurat sesuai label kemasan atau
              sertifikat halal supplier.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-2">
            <div className="space-y-2">
              <Label htmlFor="categoryId">Kategori Bahan</Label>
              <select
                id="categoryId"
                className="w-full h-10 px-3 rounded-md border border-input text-sm bg-background"
                disabled={isPending}
                {...register("categoryId")}
              >
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name} {c.isCritical ? "(⚠️ Bahan Kritis)" : ""}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="bName">Nama Bahan</Label>
                <Input
                  id="bName"
                  placeholder="Contoh: Tepung Terigu Cakra"
                  disabled={isPending}
                  {...register("name")}
                />
                {errors.name && (
                  <p className="text-xs text-red-600">{errors.name.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="tradeName">Nama Dagang / Merek Bahan</Label>
                <Input
                  id="tradeName"
                  placeholder="Contoh: Bogasari Cakra Kembar"
                  disabled={isPending}
                  {...register("tradeName")}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="manufacturer">Nama Produsen / Pabrikan</Label>
                <Input
                  id="manufacturer"
                  placeholder="Contoh: PT Indofood Sukses Makmur"
                  disabled={isPending}
                  {...register("manufacturer")}
                />
                {errors.manufacturer && (
                  <p className="text-xs text-red-600">
                    {errors.manufacturer.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="supplier">Supplier / Distributor (Opsional)</Label>
                <Input
                  id="supplier"
                  placeholder="Contoh: Toko Bahan Kue Maju"
                  disabled={isPending}
                  {...register("supplier")}
                />
              </div>
            </div>

            <div className="flex items-center space-x-2 pt-1 border-t border-slate-100">
              <input
                type="checkbox"
                id="isHalal"
                className="h-4 w-4 rounded border-gray-300 text-primary-800 focus:ring-primary-700"
                disabled={isPending}
                {...register("isHalalCertified")}
              />
              <Label htmlFor="isHalal" className="cursor-pointer text-xs font-semibold">
                Bahan ini memiliki Sertifikat Halal Supplier
              </Label>
            </div>

            {isCertified && (
              <div className="space-y-3 p-3.5 bg-emerald-50/60 rounded-lg border border-emerald-200">
                <div className="space-y-2">
                  <Label htmlFor="certNum">Nomor Sertifikat Halal Supplier</Label>
                  <Input
                    id="certNum"
                    placeholder="Contoh: ID0011000012345"
                    disabled={isPending}
                    {...register("halalCertNumber")}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label htmlFor="issuer">Lembaga Penerbit</Label>
                    <Input
                      id="issuer"
                      placeholder="BPJPH / LPPOM MUI"
                      disabled={isPending}
                      {...register("certIssuer")}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="validUntil">Masa Berlaku Sertifikat</Label>
                    <Input
                      id="validUntil"
                      type="date"
                      disabled={isPending}
                      {...register("certValidUntil")}
                    />
                  </div>
                </div>
              </div>
            )}

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsDialogOpen(false)}
                disabled={isPending}
              >
                Batal
              </Button>
              <Button
                type="submit"
                className="bg-primary-800 hover:bg-primary-900"
                disabled={isPending}
              >
                {isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Menyimpan...
                  </>
                ) : editingItem ? (
                  "Simpan Perubahan"
                ) : (
                  "Tambah Bahan"
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
