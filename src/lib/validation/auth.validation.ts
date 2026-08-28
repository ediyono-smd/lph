import { z } from "zod";

export const loginSchema = z.object({
  email: z
    .string({ required_error: "Email wajib diisi" })
    .email("Format email tidak valid")
    .min(1, "Email tidak boleh kosong"),
  password: z
    .string({ required_error: "Kata sandi wajib diisi" })
    .min(6, "Kata sandi minimal 6 karakter"),
});

export type LoginInput = z.infer<typeof loginSchema>;

export const registerSchema = z
  .object({
    fullName: z
      .string({ required_error: "Nama penanggung jawab wajib diisi" })
      .min(3, "Nama minimal 3 karakter")
      .max(100, "Nama maksimal 100 karakter"),
    email: z
      .string({ required_error: "Email wajib diisi" })
      .email("Format email tidak valid"),
    phoneNumber: z
      .string({ required_error: "Nomor WhatsApp/Telepon wajib diisi" })
      .min(10, "Nomor telepon minimal 10 digit")
      .max(15, "Nomor telepon maksimal 15 digit")
      .regex(/^08[0-9]+$/, "Nomor harus berformat Indonesia (contoh: 08123456789)"),
    password: z
      .string({ required_error: "Kata sandi wajib diisi" })
      .min(8, "Kata sandi minimal 8 karakter")
      .regex(/[A-Z]/, "Kata sandi harus mengandung minimal 1 huruf besar")
      .regex(/[0-9]/, "Kata sandi harus mengandung minimal 1 angka"),
    confirmPassword: z.string({
      required_error: "Konfirmasi kata sandi wajib diisi",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Konfirmasi kata sandi tidak cocok",
    path: ["confirmPassword"],
  });

export type RegisterInput = z.infer<typeof registerSchema>;

export const forgotPasswordSchema = z.object({
  email: z
    .string({ required_error: "Email wajib diisi" })
    .email("Format email tidak valid"),
});

export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;

export const resetPasswordSchema = z
  .object({
    token: z.string().min(1, "Token tidak valid"),
    password: z
      .string({ required_error: "Kata sandi baru wajib diisi" })
      .min(8, "Kata sandi minimal 8 karakter")
      .regex(/[A-Z]/, "Harus ada minimal 1 huruf besar")
      .regex(/[0-9]/, "Harus ada minimal 1 angka"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Konfirmasi kata sandi tidak cocok",
    path: ["confirmPassword"],
  });

export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;

export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, "Kata sandi saat ini wajib diisi"),
    newPassword: z
      .string()
      .min(8, "Kata sandi baru minimal 8 karakter")
      .regex(/[A-Z]/, "Harus mengandung huruf besar")
      .regex(/[0-9]/, "Harus mengandung angka"),
    confirmNewPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmNewPassword, {
    message: "Konfirmasi kata sandi baru tidak cocok",
    path: ["confirmNewPassword"],
  });

export type ChangePasswordInput = z.infer<typeof changePasswordSchema>;
