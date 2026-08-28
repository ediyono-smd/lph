import { z } from "zod";

export const productCategorySchema = z.object({
  code: z
    .string({ required_error: "Kode kategori wajib diisi" })
    .min(2, "Kode minimal 2 karakter")
    .max(50, "Kode maksimal 50 karakter")
    .toUpperCase(),
  name: z
    .string({ required_error: "Nama kategori wajib diisi" })
    .min(3, "Nama minimal 3 karakter")
    .max(150, "Nama maksimal 150 karakter"),
  description: z.string().optional(),
  isActive: z.boolean().default(true),
});

export type ProductCategoryInput = z.infer<typeof productCategorySchema>;

export const materialCategorySchema = z.object({
  code: z
    .string({ required_error: "Kode kategori bahan wajib diisi" })
    .min(2, "Kode minimal 2 karakter")
    .max(50, "Kode maksimal 50 karakter")
    .toUpperCase(),
  name: z
    .string({ required_error: "Nama kategori bahan wajib diisi" })
    .min(3, "Nama minimal 3 karakter")
    .max(150, "Nama maksimal 150 karakter"),
  description: z.string().optional(),
  isCritical: z.boolean().default(false),
  isActive: z.boolean().default(true),
});

export type MaterialCategoryInput = z.infer<typeof materialCategorySchema>;

export const provinceSchema = z.object({
  id: z
    .string({ required_error: "Kode Provinsi wajib diisi" })
    .min(2, "Kode provinsi minimal 2 digit")
    .max(10, "Kode provinsi maksimal 10 digit"),
  name: z
    .string({ required_error: "Nama Provinsi wajib diisi" })
    .min(3, "Nama provinsi minimal 3 karakter")
    .toUpperCase(),
});

export type ProvinceInput = z.infer<typeof provinceSchema>;

export const citySchema = z.object({
  id: z
    .string({ required_error: "Kode Kota/Kabupaten wajib diisi" })
    .min(4, "Kode minimal 4 digit")
    .max(10, "Kode maksimal 10 digit"),
  provinceId: z.string({ required_error: "Provinsi wajib dipilih" }),
  name: z
    .string({ required_error: "Nama Kota/Kabupaten wajib diisi" })
    .min(3, "Nama minimal 3 karakter")
    .toUpperCase(),
  type: z.enum(["KOTA", "KABUPATEN"], {
    required_error: "Tipe wilayah wajib dipilih",
  }),
});

export type CityInput = z.infer<typeof citySchema>;
