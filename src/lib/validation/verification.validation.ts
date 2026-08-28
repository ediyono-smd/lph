import { z } from "zod";

export const checklistItemVerificationSchema = z.object({
  applicationId: z.string({ required_error: "ID Pengajuan wajib diisi" }),
  itemKey: z.string({ required_error: "Kunci item checklist wajib diisi" }),
  itemName: z.string({ required_error: "Nama item checklist wajib diisi" }),
  isValid: z.boolean(),
  notes: z.string().optional(),
});

export type ChecklistItemVerificationInput = z.infer<
  typeof checklistItemVerificationSchema
>;

export const verificationDecisionSchema = z.object({
  applicationId: z.string({ required_error: "ID Pengajuan wajib diisi" }),
  decision: z.enum(["APPROVE_DOCUMENTS", "REQUEST_CORRECTION", "REJECT"], {
    required_error: "Pilih keputusan verifikasi",
  }),
  notes: z
    .string({ required_error: "Catatan verifikasi wajib diisi" })
    .min(5, "Catatan minimal 5 karakter"),
});

export type VerificationDecisionInput = z.infer<
  typeof verificationDecisionSchema
>;

export const assignOfficerSchema = z.object({
  applicationId: z.string({ required_error: "ID Pengajuan wajib diisi" }),
  officerUserId: z.string({ required_error: "Pilih petugas (Pendamping/Auditor)" }),
  officerType: z.enum(["MENTOR", "AUDITOR"], {
    required_error: "Tipe petugas wajib ditentukan",
  }),
  notes: z.string().optional(),
});

export type AssignOfficerInput = z.infer<typeof assignOfficerSchema>;
