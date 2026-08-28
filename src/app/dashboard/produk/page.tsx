"use client";

import React, { useState, useEffect, useTransition } from "react";
import {
  getProductsAction,
  createProductAction,
  deleteProductAction,
} from "@/actions/product.actions";
import { getProductCategoriesAction } from "@/actions/master.actions";
import { getMaterialsAction } from "@/actions/material.actions";
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
  Package,
  Plus,
  Trash2,
  Loader2,
  FlaskConical,
  Eye,
  CheckCircle2,
  X,
} from "lucide-react";
import { toast } from "sonner";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  productSchema,
  type ProductInput,
} from "@/lib/validation/product.validation";

interface ProductItem {
  id: string;
  name: string;
  brandName: string;
  description: string | null;
  servingType: string | null;
  shelfLife: string | null;
  productionProcessDescription: string | null;
  categoryId: string;
  category?: {
    name: string;
  };
  productMaterials?: {
    id: string;
    usageDescription: string | null;
    material: {
      id: string;
      name: string;
      manufacturer: string;
      isHalalCertified: boolean;
    };
  }[];
}

export default function ProdukPage() {
  const [products, setProducts] = useState<ProductItem[]>([]);
  const [categories, setCategories] = useState<{ id: string; name: string }[]>([]);
  const [availableMaterials, setAvailableMaterials] = useState<
    { id: string; name: string; manufacturer: string }[]
  >([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  // Dialog State
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [previewProduct, setPreviewProduct] = useState<ProductItem | null>(null);
  const [isPending, startTransition] = useTransition();

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ProductInput>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      categoryId: "",
      name: "",
      brandName: "",
      description: "",
      servingType: "KEMASAN",
      shelfLife: "6 Bulan",
      productionProcessDescription: "",
      materials: [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "materials",
  });

  const loadInitialData = async () => {
    const catRes = await getProductCategoriesAction({ limit: 100 });
    if (catRes.success && catRes.data) setCategories(catRes.data.items);

    const matRes = await getMaterialsAction({ limit: 200 });
    if (matRes.success && matRes.data) {
      setAvailableMaterials(matRes.data.items as any);
    }
  };

  const fetchData = async (pageNum = 1, searchQuery = "") => {
    setIsLoading(true);
    const res = await getProductsAction({
      page: pageNum,
      limit: 10,
      search: searchQuery,
    });
    if (res.success && res.data) {
      setProducts(res.data.items as any);
      setTotal(res.data.total);
      setTotalPages(res.data.totalPages);
      setPage(res.data.page);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    loadInitialData();
  }, []);

  useEffect(() => {
    fetchData(page, search);
  }, [page, search]);

  const handleOpenAdd = () => {
    if (availableMaterials.length === 0) {
      toast.error(
        "Daftarkan minimal 1 bahan baku di menu 'Katalog Bahan' terlebih dahulu."
      );
      return;
    }

    reset({
      categoryId: categories[0]?.id || "",
      name: "",
      brandName: "",
      description: "",
      servingType: "KEMASAN",
      shelfLife: "6 Bulan",
      productionProcessDescription: "",
      materials: [
        {
          materialId: availableMaterials[0]?.id || "",
          usageDescription: "Bahan Utama",
          isAlternativeMaterial: false,
        },
      ],
    });
    setIsAddDialogOpen(true);
  };

  const handleDelete = (id: string, name: string) => {
    if (!confirm(`Hapus produk "${name}"?`)) return;
    startTransition(async () => {
      const res = await deleteProductAction(id);
      if (res.success) {
        toast.success(res.message || "Produk berhasil dihapus.");
        fetchData(page, search);
      } else {
        toast.error(res.error || "Gagal menghapus produk.");
      }
    });
  };

  const onSubmit = (data: ProductInput) => {
    startTransition(async () => {
      const res = await createProductAction(data);
      if (res.success) {
        toast.success(res.message || "Produk berhasil disimpan!");
        setIsAddDialogOpen(false);
        fetchData(1, search);
      } else {
        toast.error(res.error || "Gagal menyimpan produk.");
      }
    });
  };

  const columns: ColumnDef<ProductItem>[] = [
    {
      header: "Nama Produk & Merek",
      accessorKey: "name",
      cell: (item) => (
        <div>
          <p className="font-semibold text-slate-900">{item.name}</p>
          <p className="text-xs text-slate-500">
            Merek: <strong>{item.brandName}</strong> • Kategori:{" "}
            {item.category?.name || "-"}
          </p>
        </div>
      ),
    },
    {
      header: "Penyajian & Masa Simpan",
      cell: (item) => (
        <div className="text-xs text-slate-700 space-y-0.5">
          <Badge variant="outline" className="text-[10px]">
            {item.servingType || "KEMASAN"}
          </Badge>
          <p className="text-slate-500">{item.shelfLife || "-"}</p>
        </div>
      ),
    },
    {
      header: "Matriks Resep (BOM)",
      cell: (item) => (
        <Badge variant="secondary" className="text-xs">
          <FlaskConical className="h-3 w-3 mr-1 text-primary-700" />
          {item.productMaterials?.length || 0} Bahan Baku
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
            onClick={() => setPreviewProduct(item)}
            className="h-8 px-2.5 text-slate-600 hover:text-primary-700"
          >
            <Eye className="h-3.5 w-3.5 mr-1" />
            Detail BOM
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
            <Package className="h-6 w-6 text-primary-700" />
            Katalog Produk & Matriks Resep (BOM)
          </h1>
          <p className="text-sm text-slate-600 mt-1">
            Kelola data produk yang akan disertifikasi dan petakan komposisi
            bahan baku pada setiap produk.
          </p>
        </div>

        <Button
          onClick={handleOpenAdd}
          className="bg-primary-800 hover:bg-primary-900 shadow-sm"
        >
          <Plus className="h-4 w-4 mr-2" />
          Tambah Produk Baru
        </Button>
      </div>

      {/* Table */}
      <DataTable
        columns={columns}
        data={products}
        searchPlaceholder="Cari nama produk atau merek..."
        onSearch={(query) => {
          setSearch(query);
          setPage(1);
        }}
        page={page}
        totalPages={totalPages}
        onPageChange={(newPage) => setPage(newPage)}
        isLoading={isLoading}
      />

      {/* Add Product Modal (Multi-step / BOM matrix builder) */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-[650px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Tambah Produk & Formulasi Resep (BOM)</DialogTitle>
            <DialogDescription>
              Lengkapi identitas produk, pilih bahan baku terdaftar, dan jelaskan
              alur proses pembuatan produk.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 pt-2">
            {/* Step 1: Basic Info */}
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="pCat">Kategori Produk</Label>
                <select
                  id="pCat"
                  className="w-full h-10 px-3 rounded-md border border-input text-sm bg-background"
                  disabled={isPending}
                  {...register("categoryId")}
                >
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="pName">Nama Produk</Label>
                  <Input
                    id="pName"
                    placeholder="Contoh: Keripik Singkong Pedas Manis"
                    disabled={isPending}
                    {...register("name")}
                  />
                  {errors.name && (
                    <p className="text-xs text-red-600">{errors.name.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="pBrand">Merek / Brand</Label>
                  <Input
                    id="pBrand"
                    placeholder="Contoh: Berkah Snack"
                    disabled={isPending}
                    {...register("brandName")}
                  />
                  {errors.brandName && (
                    <p className="text-xs text-red-600">
                      {errors.brandName.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="servingType">Bentuk Penyajian</Label>
                  <Input
                    id="servingType"
                    placeholder="KEMASAN / SIAP SAJI / BEKU"
                    disabled={isPending}
                    {...register("servingType")}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="shelfLife">Masa Simpan (Kadaluwarsa)</Label>
                  <Input
                    id="shelfLife"
                    placeholder="Contoh: 6 Bulan / 1 Tahun"
                    disabled={isPending}
                    {...register("shelfLife")}
                  />
                </div>
              </div>
            </div>

            {/* Step 2: Recipe Bill of Materials (BOM) */}
            <div className="space-y-3 p-4 bg-slate-50 rounded-xl border border-slate-200">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-semibold text-slate-900 flex items-center gap-1.5">
                    <FlaskConical className="h-4 w-4 text-primary-700" />
                    Komposisi Bahan Baku (Resep / BOM)
                  </h4>
                  <p className="text-xs text-slate-500">
                    Pilih semua bahan yang digunakan untuk membuat produk ini.
                  </p>
                </div>

                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={() =>
                    append({
                      materialId: availableMaterials[0]?.id || "",
                      usageDescription: "Bahan Tambahan",
                      isAlternativeMaterial: false,
                    })
                  }
                  className="h-8 text-xs bg-white"
                >
                  <Plus className="h-3.5 w-3.5 mr-1" />
                  Tambah Bahan
                </Button>
              </div>

              {errors.materials && (
                <p className="text-xs text-red-600">{errors.materials.message}</p>
              )}

              <div className="space-y-2 pt-1">
                {fields.map((field, index) => (
                  <div
                    key={field.id}
                    className="flex items-center gap-2 p-2 rounded-lg bg-white border border-slate-200 shadow-sm"
                  >
                    <div className="flex-1">
                      <select
                        className="w-full h-9 px-2 rounded border border-input text-xs bg-background"
                        disabled={isPending}
                        {...register(`materials.${index}.materialId` as const)}
                      >
                        {availableMaterials.map((mat) => (
                          <option key={mat.id} value={mat.id}>
                            {mat.name} ({mat.manufacturer})
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="w-36">
                      <Input
                        placeholder="Kegunaan (60%)"
                        className="h-9 text-xs"
                        disabled={isPending}
                        {...register(`materials.${index}.usageDescription` as const)}
                      />
                    </div>

                    {fields.length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => remove(index)}
                        className="h-9 w-9 p-0 text-red-500 hover:bg-red-50"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Step 3: Production Process Flow */}
            <div className="space-y-2">
              <Label htmlFor="processFlow">
                Alur & Narasi Proses Produksi
              </Label>
              <Textarea
                id="processFlow"
                rows={3}
                placeholder="Jelaskan tahapan pembuatan produk: 1. Penerimaan & pencucian bahan, 2. Pengupasan dan pemotongan, 3. Penggorengan dengan minyak halal, 4. Penirisan dan pembumbuan, 5. Pengemasan higienis kedap udara..."
                disabled={isPending}
                {...register("productionProcessDescription")}
              />
              {errors.productionProcessDescription && (
                <p className="text-xs text-red-600">
                  {errors.productionProcessDescription.message}
                </p>
              )}
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsAddDialogOpen(false)}
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
                    Menyimpan Produk...
                  </>
                ) : (
                  "Simpan Produk & Resep"
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Preview BOM Modal */}
      <Dialog
        open={!!previewProduct}
        onOpenChange={(open) => !open && setPreviewProduct(null)}
      >
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>{previewProduct?.name}</DialogTitle>
            <DialogDescription>
              Merek: {previewProduct?.brandName} • Kategori:{" "}
              {previewProduct?.category?.name}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 pt-2 text-xs">
            <div className="space-y-2">
              <h5 className="font-semibold text-slate-900">
                Daftar Matriks Bahan (BOM):
              </h5>
              <div className="divide-y divide-slate-100 rounded-lg border border-slate-200 p-2 bg-slate-50">
                {previewProduct?.productMaterials?.map((pm, i) => (
                  <div
                    key={pm.id || i}
                    className="py-1.5 flex items-center justify-between"
                  >
                    <div>
                      <p className="font-medium text-slate-900">
                        {pm.material?.name}
                      </p>
                      <p className="text-[10px] text-slate-500">
                        Produsen: {pm.material?.manufacturer}
                      </p>
                    </div>
                    <Badge variant="outline" className="text-[10px]">
                      {pm.usageDescription || "Bahan"}
                    </Badge>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-1">
              <h5 className="font-semibold text-slate-900">Alur Produksi:</h5>
              <p className="text-slate-600 leading-relaxed bg-white p-3 rounded border border-slate-200">
                {previewProduct?.productionProcessDescription || "-"}
              </p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
