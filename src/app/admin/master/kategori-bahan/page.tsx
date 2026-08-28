"use client";

import React, { useState, useEffect, useTransition } from "react";
import {
  getMaterialCategoriesAction,
  createMaterialCategoryAction,
  updateMaterialCategoryAction,
  deleteMaterialCategoryAction,
} from "@/actions/master.actions";
import { DataTable, type ColumnDef } from "@/components/tables/data-table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Plus, Edit2, Trash2, Database, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  materialCategorySchema,
  type MaterialCategoryInput,
} from "@/lib/validation/master.validation";

interface MaterialCategoryItem {
  id: string;
  code: string;
  name: string;
  description: string | null;
  isCritical: boolean;
  isActive: boolean;
  createdAt: Date;
}

export default function MasterKategoriBahanPage() {
  const [materials, setMaterials] = useState<MaterialCategoryItem[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  // Dialog State
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<MaterialCategoryItem | null>(null);
  const [isPending, startTransition] = useTransition();

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<MaterialCategoryInput>({
    resolver: zodResolver(materialCategorySchema),
    defaultValues: {
      code: "",
      name: "",
      description: "",
      isCritical: false,
      isActive: true,
    },
  });

  const fetchData = async (pageNum = 1, searchQuery = "") => {
    setIsLoading(true);
    const res = await getMaterialCategoriesAction({
      page: pageNum,
      limit: 10,
      search: searchQuery,
    });
    if (res.success) {
      setMaterials(res.data.items as MaterialCategoryItem[]);
      setTotal(res.data.total);
      setTotalPages(res.data.totalPages);
      setPage(res.data.page);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchData(page, search);
  }, [page, search]);

  const handleOpenAdd = () => {
    setEditingItem(null);
    reset({
      code: "",
      name: "",
      description: "",
      isCritical: false,
      isActive: true,
    });
    setIsDialogOpen(true);
  };

  const handleOpenEdit = (item: MaterialCategoryItem) => {
    setEditingItem(item);
    setValue("code", item.code);
    setValue("name", item.name);
    setValue("description", item.description || "");
    setValue("isCritical", item.isCritical);
    setValue("isActive", item.isActive);
    setIsDialogOpen(true);
  };

  const handleDelete = (id: string, name: string) => {
    if (!confirm(`Apakah Anda yakin ingin menghapus kategori bahan "${name}"?`)) {
      return;
    }
    startTransition(async () => {
      const res = await deleteMaterialCategoryAction(id);
      if (res.success) {
        toast.success(res.message || "Kategori bahan berhasil dihapus.");
        fetchData(page, search);
      } else {
        toast.error(res.error || "Gagal menghapus kategori.");
      }
    });
  };

  const onSubmit = (data: MaterialCategoryInput) => {
    startTransition(async () => {
      if (editingItem) {
        const res = await updateMaterialCategoryAction(editingItem.id, data);
        if (res.success) {
          toast.success(res.message || "Kategori bahan berhasil diperbarui.");
          setIsDialogOpen(false);
          fetchData(page, search);
        } else {
          toast.error(res.error || "Gagal memperbarui kategori.");
        }
      } else {
        const res = await createMaterialCategoryAction(data);
        if (res.success) {
          toast.success(res.message || "Kategori bahan berhasil dibuat.");
          setIsDialogOpen(false);
          fetchData(1, search);
        } else {
          toast.error(res.error || "Gagal membuat kategori.");
        }
      }
    });
  };

  const columns: ColumnDef<MaterialCategoryItem>[] = [
    {
      header: "Kode Bahan",
      accessorKey: "code",
      cell: (item) => (
        <span className="font-mono text-xs font-semibold text-primary-800 bg-primary-50 px-2.5 py-1 rounded-md border border-primary-200">
          {item.code}
        </span>
      ),
    },
    {
      header: "Nama Kategori Bahan",
      accessorKey: "name",
      cell: (item) => (
        <div>
          <p className="font-semibold text-slate-900">{item.name}</p>
          <p className="text-xs text-slate-500 line-clamp-1">
            {item.description || "Tidak ada deskripsi"}
          </p>
        </div>
      ),
    },
    {
      header: "Tingkat Kritis",
      accessorKey: "isCritical",
      cell: (item) => (
        <Badge variant={item.isCritical ? "warning" : "success"}>
          {item.isCritical
            ? "⚠️ Bahan Kritis (Wajib Sertifikat)"
            : "✓ Non-Kritis (White-list)"}
        </Badge>
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
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-heading font-bold text-slate-900 flex items-center gap-2">
            <Database className="h-6 w-6 text-primary-700" />
            Master Kategori Bahan
          </h1>
          <p className="text-sm text-slate-600 mt-1">
            Kelola klasifikasi bahan baku halal dan penandaan bahan kritis/non-kritis.
          </p>
        </div>

        <Button
          onClick={handleOpenAdd}
          className="bg-primary-800 hover:bg-primary-900 shadow-sm"
        >
          <Plus className="h-4 w-4 mr-2" />
          Tambah Kategori Bahan
        </Button>
      </div>

      {/* Data Table */}
      <DataTable
        columns={columns}
        data={materials}
        searchPlaceholder="Cari kategori bahan..."
        onSearch={(query) => {
          setSearch(query);
          setPage(1);
        }}
        page={page}
        totalPages={totalPages}
        onPageChange={(newPage) => setPage(newPage)}
        isLoading={isLoading}
      />

      {/* Add/Edit Modal Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[480px]">
          <DialogHeader>
            <DialogTitle>
              {editingItem
                ? "Edit Kategori Bahan"
                : "Tambah Kategori Bahan Baru"}
            </DialogTitle>
            <DialogDescription>
              Tentukan kelompok bahan dan apakah bahan ini termasuk kategori
              kritis yang mewajibkan lampiran sertifikat halal supplier.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-2">
            <div className="space-y-2">
              <Label htmlFor="code">Kode Bahan (Huruf Besar & Unik)</Label>
              <Input
                id="code"
                placeholder="Contoh: NABATI / HEWANI"
                disabled={isPending || !!editingItem}
                {...register("code")}
              />
              {errors.code && (
                <p className="text-xs text-red-600 font-medium">
                  {errors.code.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="name">Nama Kategori Bahan</Label>
              <Input
                id="name"
                placeholder="Contoh: Bahan Hewani & Turunannya"
                disabled={isPending}
                {...register("name")}
              />
              {errors.name && (
                <p className="text-xs text-red-600 font-medium">
                  {errors.name.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Deskripsi</Label>
              <Textarea
                id="description"
                placeholder="Penjelasan cakupan bahan..."
                disabled={isPending}
                {...register("description")}
              />
            </div>

            <div className="flex items-center space-x-2 pt-2">
              <input
                type="checkbox"
                id="isCritical"
                className="h-4 w-4 rounded border-gray-300 text-primary-800 focus:ring-primary-700"
                disabled={isPending}
                {...register("isCritical")}
              />
              <Label htmlFor="isCritical" className="cursor-pointer text-xs">
                Tandai sebagai <strong>Bahan Kritis</strong> (Mewajibkan Sertifikat Halal Supplier)
              </Label>
            </div>

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
                  "Buat Kategori"
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
