import { z } from "zod";

export const businessProfileSchema = z.object({
  name: z
    .string({ required_error: "Nama Badan Usaha wajib diisi" })
    .min(3, "Nama usaha minimal 3 karakter")
    .max(200, "Nama usaha maksimal 200 karakter"),
  brandName: z
    .string({ required_error: "Nama Merek / Brand Dagang wajib diisi" })
    .min(2, "Merek minimal 2 karakter")
    .max(100, "Merek maksimal 100 karakter"),
  businessType: z.enum(
    [
      "PERSEORANGAN",
      "PT",
      "CV",
      "KOPERASI",
      "FIRMA",
      "YAYASAN",
      "LAINNYA",
    ],
    { required_error: "Bentuk badan usaha wajib dipilih" }
  ),
  businessScale: z.enum(
    ["MIKRO", "KECIL", "MENENGAH", "BESAR"],
    { required_error: "Skala usaha wajib dipilih" }
  ),
  nib: z
    .string({ required_error: "Nomor Induk Berusaha (NIB) wajib diisi" })
    .regex(/^[0-9]{13}$/, "NIB harus tepat 13 digit angka"),
  npwp: z.string().optional(),
  email: z
    .string({ required_error: "Email kontak usaha wajib diisi" })
    .email("Format email tidak valid"),
  phoneNumber: z
    .string({ required_error: "Nomor telepon usaha wajib diisi" })
    .min(10, "Nomor telepon minimal 10 digit"),
  website: z.string().optional(),
});

export type BusinessProfileInput = z.infer<typeof businessProfileSchema>;

export const businessAddressSchema = z.object({
  addressType: z.enum(["HEADQUARTERS", "FACTORY", "OUTLET"]).default("HEADQUARTERS"),
  addressLine: z
    .string({ required_error: "Alamat lengkap wajib diisi" })
    .min(10, "Alamat minimal 10 karakter"),
  villageId: z.string({ required_error: "Kelurahan/Desa wajib dipilih" }),
  postalCode: z.string().optional(),
  isPrimary: z.boolean().default(true),
});

export type BusinessAddressInput = z.infer<typeof businessAddressSchema>;

export const supervisorSchema = z.object({
  name: z
    .string({ required_error: "Nama Penyelia Halal wajib diisi" })
    .min(3, "Nama minimal 3 karakter"),
  idCardNumber: z
    .string({ required_error: "NIK Penyelia Halal wajib diisi" })
    .regex(/^[0-9]{16}$/, "NIK harus 16 digit angka"),
  phoneNumber: z
    .string({ required_error: "Nomor HP Penyelia Halal wajib diisi" })
    .min(10, "Nomor minimal 10 digit"),
  religion: z.literal("ISLAM", {
    required_error: "Penyelia Halal wajib beragama Islam (UU JPH)",
  }),
  skNumber: z
    .string({ required_error: "Nomor SK Penetapan Penyelia wajib diisi" })
    .min(3, "Nomor SK minimal 3 karakter"),
  certificateNumber: z.string().optional(),
});

export type SupervisorInput = z.infer<typeof supervisorSchema>;
