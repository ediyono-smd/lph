"use client";

import React, { useState, useTransition } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  forgotPasswordSchema,
  type ForgotPasswordInput,
} from "@/lib/validation/auth.validation";
import { forgotPasswordAction } from "@/actions/auth.actions";
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
import { Loader2, Key, CheckCircle2, ArrowLeft } from "lucide-react";
import { AuthWrapper } from "@/components/auth/auth-wrapper";

export default function ForgotPasswordPage() {
  const [isPending, startTransition] = useTransition();
  const [isSubmitted, setIsSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordInput>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = (data: ForgotPasswordInput) => {
    startTransition(async () => {
      await forgotPasswordAction(data);
      setIsSubmitted(true);
    });
  };

  return (
    <AuthWrapper>
      <Card className="border-slate-200/90 shadow-lg">
        <CardHeader className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-full bg-primary-100 flex items-center justify-center text-primary-800">
              <Key className="h-4 w-4" />
            </div>
            <CardTitle className="text-2xl font-heading font-bold text-slate-900">
              Lupa Kata Sandi
            </CardTitle>
          </div>
          <CardDescription className="text-slate-600">
            Masukkan email akun Anda untuk menerima tautan pemulihan kata sandi.
          </CardDescription>
        </CardHeader>

        {isSubmitted ? (
          <CardContent className="space-y-4">
            <Alert variant="success">
              <CheckCircle2 className="h-4 w-4" />
              <AlertDescription>
                Tautan pemulihan kata sandi telah dikirimkan ke email Anda jika
                alamat tersebut terdaftar pada sistem kami.
              </AlertDescription>
            </Alert>
            <div className="pt-2">
              <Link href="/login">
                <Button variant="outline" className="w-full">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Kembali ke Halaman Masuk
                </Button>
              </Link>
            </div>
          </CardContent>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email Akun Terdaftar</Label>
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
                    Mengirim Permintaan...
                  </>
                ) : (
                  "Kirim Tautan Pemulihan"
                )}
              </Button>

              <Link
                href="/login"
                className="inline-flex items-center justify-center text-xs text-slate-600 hover:text-primary-800"
              >
                <ArrowLeft className="mr-1.5 h-3.5 w-3.5" />
                Kembali ke Masuk
              </Link>
            </CardFooter>
          </form>
        )}
      </Card>
    </AuthWrapper>
  );
}
