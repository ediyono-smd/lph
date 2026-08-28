"use client";

import React, { useState, useEffect, useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createAndSubmitApplicationAction } from "@/actions/application.actions";
import { getProductsAction } from "@/actions/product.actions";
import { getMyBusinessAction } from "@/actions/business.actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  FileSpreadsheet,
  CheckCircle2,
  Package,
  ShieldCheck,
  ArrowRight,
  ArrowLeft,
  Loader2,
  AlertCircle,
  FlaskConical,
} from "lucide-react";
import { toast } from "sonner";

interface ProductItem {
  id: string;
  name: string;
  brandName: string;
  productMaterials?: { id: string }[];
  category?: { name: string };
}

export default function NewApplicationWizardPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [isPending, startTransition] = useTransition();

  // Business & Products Data
  const [business, setBusiness] = useState<any>(null);
  const [products, setProducts] = useState<ProductItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Form State
  const [schemeType, setSchemeType] = useState<"SELF_DECLARE" | "REGULER">("SELF_DECLARE");
  const [selectedProductIds, setSelectedProductIds] = useState<string[]>([]);
  const [notes, setNotes] = useState("");
  const [agreementChecked, setAgreementChecked] = useState(false);

  useEffect(() => {
    async function loadData() {
      setIsLoading(true);
      const bRes = await getMyBusinessAction();
      if (bRes.success) setBusiness(bRes.data);

      const pRes = await getProductsAction({ limit: 100 });
      if (pRes.success && pRes.data) setProducts(pRes.data.items as any);
      setIsLoading(false);
    }
    loadData();
  }, []);

  const toggleProduct = (id: string) => {
    setSelectedProductIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleNext = () => {
    if (step === 1) {
      setStep(2);
    } else if (step === 2) {
      if (selectedProductIds.length === 0) {
        toast.error("Pilih minimal 1 produk untuk diajukan.");
        return;
      }
      setStep(3);
    } else if (step === 3) {
      if (!agreementChecked) {
        toast.error("Anda wajib menyetujui pernyataan komitmen halal.");
        return;
      }
      setStep(4);
    }
  };

  const handleSubmit = () => {
    startTransition(async () => {
      const res = await createAndSubmitApplicationAction({
        schemeType,
        productIds: selectedProductIds,
        notes,
      });

      if (res.success) {
        toast.success(res.message || "Pengajuan berhasil dikirim!");
        router.push(`/dashboard/pengajuan/${res.data.id}`);
        router.refresh();
      } else {
        toast.error(res.error || "Gagal mengirim pengajuan.");
      }
    });
  };

  if (isLoading) {
    return (
      <div className="py-24 text-center text-slate-500 text-xs flex flex-col items-center gap-2">
        <Loader2 className="h-6 w-6 animate-spin text-primary-700" />
        Memuat data pengajuan...
      </div>
    );
  }

  // Pre-flight check
  if (!business || !business.nib || !business.supervisors || business.supervisors.length === 0) {
    return (
      <Card className="max-w-2xl mx-auto border-amber-300 bg-amber-50/50">
        <CardHeader>
          <div className="flex items-center gap-2 text-amber-900 font-bold">
            <AlertCircle className="h-5 w-5 text-amber-700" />
            Lengkapi Profil Usaha Terlebih Dahulu
          </div>
          <CardDescription className="text-amber-800">
            Sesuai aturan regulasi JPH, Anda wajib melengkapi data legalitas
            usaha (NIB 13 digit) dan data Penyelia Halal sebelum dapat mengajukan
            sertifikasi.
          </CardDescription>
        </CardHeader>
        <CardFooter>
          <Link href="/dashboard/profil-usaha">
            <Button className="bg-amber-700 hover:bg-amber-800 text-white">
              Buka Halaman Profil Usaha
            </Button>
          </Link>
        </CardFooter>
      </Card>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-heading font-bold text-slate-900 flex items-center gap-2">
          <FileSpreadsheet className="h-6 w-6 text-primary-700" />
          Formulir Pengajuan Sertifikasi Halal
        </h1>
        <p className="text-sm text-slate-600 mt-1">
          Langkah mudah pengajuan sertifikasi terintegrasi SIP-HALAL.
        </p>
      </div>

      {/* Step Indicator */}
      <div className="grid grid-cols-4 gap-2">
        {[
          { num: 1, label: "Skema" },
          { num: 2, label: "Pilih Produk" },
          { num: 3, label: "Komitmen SJPH" },
          { num: 4, label: "Kirim" },
        ].map((s) => (
          <div
            key={s.num}
            className={`p-3 rounded-lg border text-center transition-all ${
              step === s.num
                ? "bg-primary-800 text-white border-primary-900 shadow-sm font-semibold"
                : step > s.num
                ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                : "bg-white text-slate-400 border-slate-200"
            }`}
          >
            <div className="text-xs font-bold">Langkah {s.num}</div>
            <div className="text-[11px] truncate">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Step 1: Scheme Selection */}
      {step === 1 && (
        <Card>
          <CardHeader>
            <CardTitle>1. Pilih Skema Sertifikasi Halal</CardTitle>
            <CardDescription>
              Tentukan jenis pengajuan sesuai dengan skala bisnis dan karakteristik bahan baku Anda.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div
              onClick={() => setSchemeType("SELF_DECLARE")}
              className={`p-5 rounded-xl border-2 cursor-pointer transition-all ${
                schemeType === "SELF_DECLARE"
                  ? "border-primary-700 bg-primary-50/50 shadow-sm"
                  : "border-slate-200 hover:border-slate-300"
              }`}
            >
              <div className="flex items-start justify-between">
                <div>
                  <Badge className="bg-emerald-600 text-white mb-2">
                    Skema UMKM (Gratis / Subsidi)
                  </Badge>
                  <h4 className="font-heading font-semibold text-base text-slate-900">
                    Self-Declare (Pernyataan Mandiri Pelaku Usaha)
                  </h4>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                    Khusus bagi pelaku Usaha Mikro dan Kecil (UMK) dengan produk
                    berisiko rendah, proses produksi sederhana, dan menggunakan
                    bahan baku yang sudah dipastikan kehalalannya (didampingi
                    oleh Pendamping PPH).
                  </p>
                </div>
                <div
                  className={`h-5 w-5 rounded-full border-2 flex items-center justify-center ${
                    schemeType === "SELF_DECLARE"
                      ? "border-primary-700 bg-primary-700 text-white"
                      : "border-slate-300"
                  }`}
                >
                  {schemeType === "SELF_DECLARE" && <div className="h-2 w-2 rounded-full bg-white" />}
                </div>
              </div>
            </div>

            <div
              onClick={() => setSchemeType("REGULER")}
              className={`p-5 rounded-xl border-2 cursor-pointer transition-all ${
                schemeType === "REGULER"
                  ? "border-primary-700 bg-primary-50/50 shadow-sm"
                  : "border-slate-200 hover:border-slate-300"
              }`}
            >
              <div className="flex items-start justify-between">
                <div>
                  <Badge variant="outline" className="text-slate-700 mb-2">
                    Skema Reguler (Pemeriksaan LPH)
                  </Badge>
                  <h4 className="font-heading font-semibold text-base text-slate-900">
                    Sertifikasi Halal Reguler
                  </h4>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                    Untuk usaha skala Menengah dan Besar, atau produk dengan
                    bahan kritis/proses olahan kompleks yang memerlukan audit
                    lapangan dan pengujian laboratorium oleh Auditor Lembaga
                    Pemeriksa Halal (LPH).
                  </p>
                </div>
                <div
                  className={`h-5 w-5 rounded-full border-2 flex items-center justify-center ${
                    schemeType === "REGULER"
                      ? "border-primary-700 bg-primary-700 text-white"
                      : "border-slate-300"
                  }`}
                >
                  {schemeType === "REGULER" && <div className="h-2 w-2 rounded-full bg-white" />}
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-end">
            <Button onClick={handleNext} className="bg-primary-800 hover:bg-primary-900">
              Lanjut ke Pilih Produk <ArrowRight className="h-4 w-4 ml-1.5" />
            </Button>
          </CardFooter>
        </Card>
      )}

      {/* Step 2: Product Selection */}
      {step === 2 && (
        <Card>
          <CardHeader>
            <CardTitle>2. Pilih Produk yang Diajukan</CardTitle>
            <CardDescription>
              Centang produk dari katalog yang ingin dimasukkan dalam sertifikat halal ini.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {products.length === 0 ? (
              <div className="py-8 text-center text-xs text-slate-500">
                Belum ada produk yang terdaftar. Buka menu &apos;Katalog Produk&apos; terlebih dahulu.
              </div>
            ) : (
              <div className="divide-y divide-slate-100 border border-slate-200 rounded-xl overflow-hidden">
                {products.map((p) => {
                  const isSelected = selectedProductIds.includes(p.id);
                  const bomCount = p.productMaterials?.length || 0;
                  return (
                    <div
                      key={p.id}
                      onClick={() => toggleProduct(p.id)}
                      className={`p-4 flex items-center justify-between cursor-pointer transition-colors ${
                        isSelected ? "bg-emerald-50/70" : "hover:bg-slate-50"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => {}}
                          className="h-4 w-4 rounded border-slate-300 text-primary-800 focus:ring-primary-700"
                        />
                        <div>
                          <p className="font-semibold text-sm text-slate-900">
                            {p.name}
                          </p>
                          <p className="text-xs text-slate-500">
                            Merek: {p.brandName} • Kategori: {p.category?.name}
                          </p>
                        </div>
                      </div>

                      <Badge
                        variant={bomCount > 0 ? "secondary" : "destructive"}
                        className="text-[11px]"
                      >
                        {bomCount} Bahan Baku
                      </Badge>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" onClick={() => setStep(1)}>
              <ArrowLeft className="h-4 w-4 mr-1.5" /> Kembali
            </Button>
            <Button onClick={handleNext} className="bg-primary-800 hover:bg-primary-900">
              Lanjut ke Komitmen SJPH <ArrowRight className="h-4 w-4 ml-1.5" />
            </Button>
          </CardFooter>
        </Card>
      )}

      {/* Step 3: SJPH Commitment & Notes */}
      {step === 3 && (
        <Card>
          <CardHeader>
            <CardTitle>3. Komitmen Sistem Jaminan Produk Halal (SJPH)</CardTitle>
            <CardDescription>
              Pernyataan kepatuhan dan integritas proses produksi halal.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-700 space-y-2 leading-relaxed">
              <h5 className="font-semibold text-slate-900">
                Pernyataan Pelaku Usaha (SJPH Statement):
              </h5>
              <p>
                1. Menjamin bahwa seluruh bahan yang digunakan dalam pembuatan
                produk berasal dari sumber yang halal dan suci.
              </p>
              <p>
                2. Menjaga fasilitas produksi, peralatan, dan penyimpanan bebas
                dari kontaminasi najis atau bahan tidak halal.
              </p>
              <p>
                3. Bersedia memberikan akses kepada Pendamping PPH / Auditor Halal
                untuk melakukan verifikasi dan pemeriksaan lapangan.
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Catatan Tambahan untuk Verifikator (Opsional)</Label>
              <Textarea
                id="notes"
                placeholder="Tuliskan catatan khusus terkait lokasi produksi, waktu operasional, dsb."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </div>

            <div className="flex items-start space-x-2 pt-2">
              <input
                type="checkbox"
                id="agree"
                checked={agreementChecked}
                onChange={(e) => setAgreementChecked(e.target.checked)}
                className="mt-0.5 h-4 w-4 rounded border-gray-300 text-primary-800 focus:ring-primary-700"
              />
              <Label htmlFor="agree" className="cursor-pointer text-xs text-slate-700 leading-normal">
                Saya menyatakan dengan sebenarnya bahwa data yang diisikan adalah
                benar, sah, dan siap bertanggung jawab secara hukum atas
                kehalalan produk yang diajukan.
              </Label>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" onClick={() => setStep(2)}>
              <ArrowLeft className="h-4 w-4 mr-1.5" /> Kembali
            </Button>
            <Button onClick={handleNext} className="bg-primary-800 hover:bg-primary-900">
              Review Ringkasan <ArrowRight className="h-4 w-4 ml-1.5" />
            </Button>
          </CardFooter>
        </Card>
      )}

      {/* Step 4: Final Review & Submit */}
      {step === 4 && (
        <Card>
          <CardHeader>
            <CardTitle>4. Ringkasan & Konfirmasi Pengajuan</CardTitle>
            <CardDescription>
              Periksa kembali kelengkapan informasi sebelum dikirimkan ke tim verifikator.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 text-xs">
            <div className="grid grid-cols-2 gap-3 p-4 bg-slate-50 rounded-xl border border-slate-200">
              <div>
                <span className="text-slate-500">Badan Usaha:</span>
                <p className="font-semibold text-slate-900 text-sm">
                  {business.name}
                </p>
                <p className="text-slate-600">NIB: {business.nib}</p>
              </div>
              <div>
                <span className="text-slate-500">Penyelia Halal:</span>
                <p className="font-semibold text-slate-900 text-sm">
                  {business.supervisors[0]?.name}
                </p>
                <p className="text-slate-600">
                  SK: {business.supervisors[0]?.skNumber}
                </p>
              </div>
            </div>

            <div className="p-4 bg-white rounded-xl border border-slate-200 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-slate-900">
                  Skema Sertifikasi:
                </span>
                <Badge variant="accent">
                  {schemeType === "SELF_DECLARE" ? "Self-Declare UMKM" : "Reguler LPH"}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-semibold text-slate-900">
                  Jumlah Produk Diajukan:
                </span>
                <span className="font-bold text-primary-800">
                  {selectedProductIds.length} Produk
                </span>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" onClick={() => setStep(3)} disabled={isPending}>
              <ArrowLeft className="h-4 w-4 mr-1.5" /> Kembali
            </Button>
            <Button
              onClick={handleSubmit}
              className="bg-primary-800 hover:bg-primary-900 font-semibold"
              disabled={isPending}
            >
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Mengirimkan Pengajuan...
                </>
              ) : (
                "Kirim Pengajuan Sekarang"
              )}
            </Button>
          </CardFooter>
        </Card>
      )}
    </div>
  );
}
