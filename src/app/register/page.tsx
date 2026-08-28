"use client";

import React, { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  registerSchema,
  type RegisterInput,
} from "@/lib/validation/auth.validation";
import { registerAction } from "@/actions/auth.actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, AlertCircle, UserPlus } from "lucide-react";
import { toast } from "sonner";
import { AuthWrapper } from "@/components/auth/auth-wrapper";

export default function RegisterPage() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      fullName: "",
      email: "",
      phoneNumber: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = (data: RegisterInput) => {
    setErrorMessage(null);
    startTransition(async () => {
      const res = await registerAction(data);
      if (res.success) {
        toast.success(res.message || "Pendaftaran berhasil!");
        router.push(res.data.redirectUrl);
        router.refresh();
      } else {
        setErrorMessage(res.error || "Gagal memproses pendaftaran.");
      }
    });
  };

  return (
    <AuthWrapper>
      <Card className="border-slate-200/90 shadow-lg">
        <CardHeader className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-full bg-primary-100 flex items-center justify-center text-primary-800">
              <UserPlus className="h-4 w-4" />
            </div>
            <CardTitle className="text-2xl font-heading font-bold text-slate-900">
              Daftar Akun Baru
            </CardTitle>
          </div>
          <CardDescription className="text-slate-600">
            Buat akun Pelaku Usaha untuk memulai pengajuan sertifikasi halal.
          </CardDescription>
        </CardHeader>

        <form onSubmit={handleSubmit(onSubmit)}>
          <CardContent className="space-y-4">
            {errorMessage && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{errorMessage}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Label htmlFor="fullName">Nama Penanggung Jawab Usaha</Label>
              <Input
                id="fullName"
                placeholder="Contoh: Siti Rahma"
                disabled={isPending}
                {...register("fullName")}
              />
              {errors.fullName && (
                <p className="text-xs text-red-600 font-medium">
                  {errors.fullName.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email Aktif</Label>
              <Input
                id="email"
                type="email"
                placeholder="nama@domain.com"
                disabled={isPending}
                {...register("email")}
              />
              {errors.email && (
                <p className="text-xs text-red-600 font-medium">
                  {errors.email.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="phoneNumber">Nomor WhatsApp / Telepon</Label>
              <Input
                id="phoneNumber"
                type="tel"
                placeholder="081234567890"
                disabled={isPending}
                {...register("phoneNumber")}
              />
              {errors.phoneNumber && (
                <p className="text-xs text-red-600 font-medium">
                  {errors.phoneNumber.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Kata Sandi</Label>
              <Input
                id="password"
                type="password"
                placeholder="Minimal 8 karakter (huruf besar & angka)"
                disabled={isPending}
                {...register("password")}
              />
              {errors.password && (
                <p className="text-xs text-red-600 font-medium">
                  {errors.password.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Konfirmasi Kata Sandi</Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="Ulangi kata sandi"
                disabled={isPending}
                {...register("confirmPassword")}
              />
              {errors.confirmPassword && (
                <p className="text-xs text-red-600 font-medium">
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>
          </CardContent>

          <CardFooter className="flex flex-col space-y-4">
            <Button
              type="submit"
              className="w-full bg-primary-800 hover:bg-primary-900 h-11 font-medium"
              disabled={isPending}
            >
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Mendaftarkan Akun...
                </>
              ) : (
                "Daftar Sebagai Pelaku Usaha"
              )}
            </Button>

            <p className="text-center text-xs text-slate-600">
              Sudah memiliki akun?{" "}
              <Link
                href="/login"
                className="font-semibold text-primary-700 hover:text-primary-800 hover:underline"
              >
                Masuk ke Portal
              </Link>
            </p>
          </CardFooter>
        </form>
      </Card>
    </AuthWrapper>
  );
}
