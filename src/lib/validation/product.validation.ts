import { z } from "zod";

export const productMaterialItemSchema = z.object({
  materialId: z.string({ required_error: "Bahan wajib dipilih" }),
  usageDescription: z.string().optional(), // e.g. "Bahan Utama (60%)", "Pengemulsi"
  isAlternativeMaterial: z.boolean().default(false),
});

export const productSchema = z.object({
  categoryId: z.string({ required_error: "Kategori produk wajib dipilih" }),
  productTypeId: z.string().optional(),
  name: z
    .string({ required_error: "Nama produk wajib diisi" })
    .min(3, "Nama produk minimal 3 karakter")
    .max(150, "Nama produk maksimal 150 karakter"),
  brandName: z
    .string({ required_error: "Merek dagang wajib diisi" })
    .min(2, "Merek minimal 2 karakter"),
  description: z.string().optional(),
  servingType: z.string().optional(), // DINGIN, PANAS, KEMASAN, SIAP SAJI
  shelfLife: z.string().optional(), // e.g. "6 Bulan"
  productionProcessDescription: z
    .string({ required_error: "Narasi alur proses produksi wajib diisi" })
    .min(20, "Jelaskan tahapan pembuatan produk minimal 20 karakter"),
  materials: z
    .array(productMaterialItemSchema)
    .min(1, "Produk wajib memiliki minimal 1 bahan baku terdaftar"),
});

export type ProductInput = z.infer<typeof productSchema>;
