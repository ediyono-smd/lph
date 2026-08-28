"use client";

import React, { useState, useTransition } from "react";
import { getPublicCertificateByNumberAction } from "@/actions/certificate.actions";
import { CertificateCard } from "@/components/certificate/certificate-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  ShieldCheck,
  Search,
  CheckCircle2,
  AlertCircle,
  Loader2,
} from "lucide-react";
import { PublicNavbar, PublicFooter } from "@/components/public/public-nav";
import { StarDivider } from "@/components/warm/star-divider";

export default function PublicVerifyPage() {
  const [certNumber, setCertNumber] = useState("");
  const [result, setResult] = useState<any>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!certNumber.trim()) return;

    setErrorMessage(null);
    setResult(null);

    startTransition(async () => {
      const res = await getPublicCertificateByNumberAction(certNumber);
      if (res.success && res.data) {
        setResult(res.data);
      } else {
        setErrorMessage(
          res.error || "Nomor sertifikat tidak ditemukan dalam pangkalan data resmi."
        );
      }
    });
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#fcfaf6] text-slate-900">
      <PublicNavbar />
      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-14 space-y-10">
        <StarDivider
          subtitle="Pangkalan Data Sertifikat Resmi"
          title="Layanan Verifikasi Publik Sertifikat Halal"
        />

        {/* Search Box Card */}
        <Card className="max-w-xl mx-auto rounded-3xl border border-[#ebd7ba] shadow-sm bg-white">
          <form onSubmit={handleSearch}>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2 text-slate-900">
                <Search className="h-4 w-4 text-[#b87d28]" />
                Cari Berdasarkan Nomor Sertifikat
              </CardTitle>
              <CardDescription className="text-xs text-slate-500">
                Masukkan nomor sertifikat (Contoh: HALAL-2026-000001)
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Input
                  placeholder="HALAL-2026-XXXXXX"
                  value={certNumber}
                  onChange={(e) => setCertNumber(e.target.value)}
                  className="font-mono text-sm uppercase rounded-xl border-slate-300"
                  disabled={isPending}
                />
                <Button
                  type="submit"
                  className="rounded-xl bg-[#e5a952] hover:bg-[#d8983e] text-slate-950 shrink-0 font-bold text-xs shadow-sm"
                  disabled={isPending}
                >
                  {isPending ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    "Verifikasi"
                  )}
                </Button>
              </div>

              {errorMessage && (
                <Alert variant="destructive" className="rounded-xl">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription className="text-xs">{errorMessage}</AlertDescription>
                </Alert>
              )}
            </CardContent>
          </form>
        </Card>

        {/* Verification Result Card */}
        {result && (
          <div className="space-y-6 pt-4">
            <div className="p-4 bg-emerald-50 border border-emerald-300 rounded-2xl flex items-center gap-3 text-emerald-900 max-w-xl mx-auto shadow-sm">
              <CheckCircle2 className="h-6 w-6 text-emerald-600 shrink-0" />
              <div>
                <h4 className="font-bold text-sm">✓ SERTIFIKAT VALID & AKTIF</h4>
                <p className="text-xs text-emerald-800 font-normal">
                  Data sertifikat halal ini terdaftar secara resmi di pangkalan
                  data SIP-HALAL Indonesia.
                </p>
              </div>
            </div>

            <CertificateCard certificate={result} />
          </div>
        )}
      </main>
      <PublicFooter />
    </div>
  );
}
