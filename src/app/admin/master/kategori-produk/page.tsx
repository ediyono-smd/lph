"use client";

import React, { useState, useEffect, useTransition } from "react";
import {
  getProductCategoriesAction,
  createProductCategoryAction,
  updateProductCategoryAction,
  deleteProductCategoryAction,
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
import {
  Plus,
  Edit2,
  Trash2,
  Layers,
  Loader2,
  CheckCircle2,
} from "lucide-react";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  productCategorySchema,
  type ProductCategoryInput,
} from "@/lib/validation/master.validation";

interface CategoryItem {
  id: string;
  code: string;
  name: string;
  description: string | null;
  isActive: boolean;
  createdAt: Date;
}

export default function MasterKategoriProdukPage() {
  const [categories, setCategories] = useState<CategoryItem[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  // Dialog State
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<CategoryItem | null>(null);
  const [isPending, startTransition] = useTransition();

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<ProductCategoryInput>({
    resolver: zodResolver(productCategorySchema),
    defaultValues: {
      code: "",
      name: "",
      description: "",
      isActive: true,
    },
  });

  const fetchData = async (pageNum = 1, searchQuery = "") => {
    setIsLoading(true);
    const res = await getProductCategoriesAction({
      page: pageNum,
      limit: 10,
      search: searchQuery,
    });
    if (res.success) {
      setCategories(res.data.items as CategoryItem[]);
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
    setEditingCategory(null);
    reset({
      code: "",
      name: "",
      description: "",
      isActive: true,
    });
    setIsDialogOpen(true);
  };

  const handleOpenEdit = (item: CategoryItem) => {
    setEditingCategory(item);
    setValue("code", item.code);
    setValue("name", item.name);
    setValue("description", item.description || "");
    setValue("isActive", item.isActive);
    setIsDialogOpen(true);
  };

  const handleDelete = (id: string, name: string) => {
    if (!confirm(`Apakah Anda yakin ingin menghapus kategori "${name}"?`)) {
      return;
    }
    startTransition(async () => {
      const res = await deleteProductCategoryAction(id);
      if (res.success) {
        toast.success(res.message || "Kategori berhasil dihapus.");
        fetchData(page, search);
      } else {
        toast.error(res.error || "Gagal menghapus kategori.");
      }
    });
  };

  const onSubmit = (data: ProductCategoryInput) => {
    startTransition(async () => {
      if (editingCategory) {
        const res = await updateProductCategoryAction(editingCategory.id, data);
        if (res.success) {
          toast.success(res.message || "Kategori berhasil diperbarui.");
          setIsDialogOpen(false);
          fetchData(page, search);
        } else {
          toast.error(res.error || "Gagal memperbarui kategori.");
        }
      } else {
        const res = await createProductCategoryAction(data);
        if (res.success) {
          toast.success(res.message || "Kategori berhasil dibuat.");
          setIsDialogOpen(false);
          fetchData(1, search);
        } else {
          toast.error(res.error || "Gagal membuat kategori.");
        }
      }
    });
  };

  const columns: ColumnDef<CategoryItem>[] = [
    {
      header: "Kode Kategori",
      accessorKey: "code",
      cell: (item) => (
        <span className="font-mono text-xs font-semibold text-primary-800 bg-primary-50 px-2.5 py-1 rounded-md border border-primary-200">
          {item.code}
        </span>
      ),
    },
    {
      header: "Nama Kategori",
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
      header: "Status",
      accessorKey: "isActive",
      cell: (item) => (
        <Badge variant={item.isActive ? "success" : "secondary"}>
          {item.isActive ? "Aktif" : "Non-Aktif"}
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
            <Layers className="h-6 w-6 text-primary-700" />
            Master Kategori Produk
          </h1>
          <p className="text-sm text-slate-600 mt-1">
            Kelola klasifikasi kategori dan kelompok produk sertifikasi halal.
          </p>
        </div>

        <Button
          onClick={handleOpenAdd}
          className="bg-primary-800 hover:bg-primary-900 shadow-sm"
        >
          <Plus className="h-4 w-4 mr-2" />
          Tambah Kategori
        </Button>
      </div>

      {/* Data Table */}
      <DataTable
        columns={columns}
        data={categories}
        searchPlaceholder="Cari kategori produk..."
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
              {editingCategory
                ? "Edit Kategori Produk"
                : "Tambah Kategori Produk Baru"}
            </DialogTitle>
            <DialogDescription>
              Pastikan kode dan nama kategori sesuai dengan standar klasifikasi
              pangan halal.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-2">
            <div className="space-y-2">
              <Label htmlFor="code">Kode Kategori (Huruf Besar & Unik)</Label>
              <Input
                id="code"
                placeholder="Contoh: MAKANAN_OLAHAN"
                disabled={isPending || !!editingCategory}
                {...register("code")}
              />
              {errors.code && (
                <p className="text-xs text-red-600 font-medium">
                  {errors.code.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="name">Nama Kategori</Label>
              <Input
                id="name"
                placeholder="Contoh: Makanan Olahan & Kudapan"
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
              <Label htmlFor="description">Deskripsi / Cakupan</Label>
              <Textarea
                id="description"
                placeholder="Penjelasan produk yang masuk dalam kategori ini..."
                disabled={isPending}
                {...register("description")}
              />
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
                ) : editingCategory ? (
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
