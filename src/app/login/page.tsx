"use client";

import React, { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, type LoginInput } from "@/lib/validation/auth.validation";
import { loginAction } from "@/actions/auth.actions";
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
import {
  Loader2,
  AlertCircle,
  KeyRound,
  UserCheck,
} from "lucide-react";
import { toast } from "sonner";
import { AuthWrapper } from "@/components/auth/auth-wrapper";

const DEMO_ACCOUNTS = [
  {
    role: "Pelaku Usaha",
    email: "pelakuusaha@demo.com",
    label: "Pelaku Usaha (UMKM)",
  },
  {
    role: "Verifikator",
    email: "verifier@halal.go.id",
    label: "Verifikator Dokumen",
  },
  {
    role: "Auditor",
    email: "auditor@halal.go.id",
    label: "Auditor Halal LPH",
  },
  {
    role: "Pendamping",
    email: "mentor@halal.go.id",
    label: "Pendamping PPH",
  },
  {
    role: "Admin",
    email: "admin@halal.go.id",
    label: "Admin Operasional",
  },
  {
    role: "Pimpinan",
    email: "leader@halal.go.id",
    label: "Pimpinan / Fatwa",
  },
  {
    role: "Super Admin",
    email: "superadmin@halal.go.id",
    label: "Super Admin",
  },
];

export default function LoginPage() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = (data: LoginInput) => {
    setErrorMessage(null);
    startTransition(async () => {
      const res = await loginAction(data);
      if (res.success) {
        toast.success(res.message || "Login berhasil!");
        router.push(res.data.redirectUrl);
        router.refresh();
      } else {
        setErrorMessage(res.error || "Gagal melakukan autentikasi.");
      }
    });
  };

  const fillDemoAccount = (email: string) => {
    setValue("email", email, { shouldValidate: true });
    setValue("password", "Admin123!", { shouldValidate: true });
  };

  return (
    <AuthWrapper>
      <Card className="border-slate-200/90 shadow-lg">
        <CardHeader className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-full bg-primary-100 flex items-center justify-center text-primary-800">
              <KeyRound className="h-4 w-4" />
            </div>
            <CardTitle className="text-2xl font-heading font-bold text-slate-900">
              Masuk ke Akun
            </CardTitle>
          </div>
          <CardDescription className="text-slate-600">
            Masukkan email dan kata sandi Anda untuk mengakses dashboard.
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
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="nama@domain.com"
                autoComplete="email"
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
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Kata Sandi</Label>
                <Link
                  href="/forgot-password"
                  className="text-xs text-primary-700 hover:text-primary-800 hover:underline"
                >
                  Lupa kata sandi?
                </Link>
              </div>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                autoComplete="current-password"
                disabled={isPending}
                {...register("password")}
              />
              {errors.password && (
                <p className="text-xs text-red-600 font-medium">
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Quick Demo Fill Selector */}
            <div className="rounded-lg bg-emerald-50/70 border border-emerald-200/80 p-3 space-y-2">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-900">
                <UserCheck className="h-3.5 w-3.5 text-emerald-700" />
                <span>Demo Quick Login:</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {DEMO_ACCOUNTS.map((acc) => (
                  <button
                    key={acc.email}
                    type="button"
                    onClick={() => fillDemoAccount(acc.email)}
                    className="text-[11px] bg-white border border-emerald-300 text-emerald-900 hover:bg-emerald-100 hover:border-emerald-500 rounded px-2 py-0.5 transition-colors font-medium"
                  >
                    {acc.role}
                  </button>
                ))}
              </div>
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
                  Memverifikasi...
                </>
              ) : (
                "Masuk Sekarang"
              )}
            </Button>

            <p className="text-center text-xs text-slate-600">
              Belum memiliki akun Pelaku Usaha?{" "}
              <Link
                href="/register"
                className="font-semibold text-primary-700 hover:text-primary-800 hover:underline"
              >
                Daftar Gratis
              </Link>
            </p>
          </CardFooter>
        </form>
      </Card>
    </AuthWrapper>
  );
}
