import { z } from "zod";

export const applicationDraftSchema = z.object({
  schemeType: z.enum(["SELF_DECLARE", "REGULER"], {
    required_error: "Pilih skema sertifikasi (Self-Declare / Reguler)",
  }),
  productIds: z
    .array(z.string())
    .min(1, "Pilih minimal 1 produk untuk diajukan dalam sertifikasi ini"),
  notes: z.string().optional(),
  sjphManualNotes: z.string().optional(), // Komitmen implementasi SJPH
});

export type ApplicationDraftInput = z.infer<typeof applicationDraftSchema>;

export const correctionResponseSchema = z.object({
  applicationId: z.string({ required_error: "ID Pengajuan wajib diisi" }),
  correctionNotes: z
    .string({ required_error: "Jelaskan perbaikan yang telah Anda lakukan" })
    .min(10, "Penjelasan perbaikan minimal 10 karakter"),
});

export type CorrectionResponseInput = z.infer<typeof correctionResponseSchema>;
