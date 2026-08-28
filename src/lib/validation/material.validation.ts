import { z } from "zod";

export const materialSchema = z.object({
  categoryId: z.string({ required_error: "Kategori bahan wajib dipilih" }),
  name: z
    .string({ required_error: "Nama bahan wajib diisi" })
    .min(2, "Nama bahan minimal 2 karakter")
    .max(150, "Nama bahan maksimal 150 karakter"),
  tradeName: z.string().optional(),
  manufacturer: z
    .string({ required_error: "Nama produsen / pabrikan wajib diisi" })
    .min(2, "Nama produsen minimal 2 karakter"),
  supplier: z.string().optional(),
  isHalalCertified: z.boolean().default(true),
  halalCertNumber: z.string().optional(),
  certIssuer: z.string().optional(),
  certValidUntil: z.string().optional(), // ISO Date string e.g. "2028-12-31"
});

export type MaterialInput = z.infer<typeof materialSchema>;
