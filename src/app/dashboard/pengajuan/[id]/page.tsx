"use client";

import React, { useState, useEffect, useTransition } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  getApplicationDetailAction,
  resubmitCorrectionAction,
} from "@/actions/application.actions";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  FileSpreadsheet,
  CheckCircle2,
  Clock,
  AlertTriangle,
  ArrowLeft,
  Building2,
  Package,
  FlaskConical,
  Loader2,
  History,
  Send,
} from "lucide-react";
import { toast } from "sonner";
import { formatDate, formatDateTime } from "@/lib/utils";

const STAGES = [
  { key: "SUBMITTED", label: "Pengajuan Terkirim" },
  { key: "DOCUMENT_VERIFICATION", label: "Verifikasi Dokumen" },
  { key: "AUDITOR_ASSIGNED", label: "Penugasan Petugas" },
  { key: "INSPECTION", label: "Pemeriksaan Lapangan" },
  { key: "APPROVED", label: "Persetujuan Fatwa" },
  { key: "CERTIFICATE_ISSUED", label: "Sertifikat Terbit" },
];

function getStageIndex(status: string): number {
  switch (status) {
    case "SUBMITTED":
      return 1;
    case "DOCUMENT_VERIFICATION":
    case "NEED_CORRECTION":
      return 2;
    case "AUDITOR_ASSIGNED":
    case "MENTOR_ASSIGNED":
      return 3;
    case "INSPECTION":
      return 4;
    case "FINAL_REVIEW":
    case "APPROVED":
      return 5;
    case "CERTIFICATE_ISSUED":
      return 6;
    default:
      return 1;
  }
}

export default function ApplicationDetailPage() {
  const params = useParams();
  const router = useRouter();
  const applicationId = params.id as string;

  const [application, setApplication] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [correctionText, setCorrectionText] = useState("");
  const [isPending, startTransition] = useTransition();

  const loadData = async () => {
    setIsLoading(true);
    const res = await getApplicationDetailAction(applicationId);
    if (res.success && res.data) {
      setApplication(res.data);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    loadData();
  }, [applicationId]);

  const handleResubmitCorrection = () => {
    if (!correctionText || correctionText.length < 10) {
      toast.error("Tuliskan penjelasan perbaikan minimal 10 karakter.");
      return;
    }

    startTransition(async () => {
      const res = await resubmitCorrectionAction({
        applicationId,
        correctionNotes: correctionText,
      });

      if (res.success) {
        toast.success(res.message || "Perbaikan berhasil dikirim ulang!");
        setCorrectionText("");
        loadData();
      } else {
        toast.error(res.error || "Gagal mengirim perbaikan.");
      }
    });
  };

  if (isLoading) {
    return (
      <div className="py-24 text-center text-slate-500 text-xs flex flex-col items-center gap-2">
        <Loader2 className="h-6 w-6 animate-spin text-primary-700" />
        Memuat rincian pengajuan...
      </div>
    );
  }

  if (!application) {
    return (
      <div className="py-12 text-center text-slate-500 text-sm">
        Pengajuan tidak ditemukan.
      </div>
    );
  }

  const currentStageNum = getStageIndex(application.status);
  const isCorrectionNeeded = application.status === "NEED_CORRECTION";

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Back Button & Title Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link href="/dashboard/pengajuan">
            <Button variant="outline" size="sm" className="h-9 w-9 p-0">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-heading font-bold text-slate-900">
                {application.applicationNumber}
              </h1>
              <Badge variant="accent">
                {application.schemeType === "SELF_DECLARE"
                  ? "Self-Declare UMKM"
                  : "Reguler LPH"}
              </Badge>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Diajukan pada: {formatDate(application.submissionDate || application.createdAt)}
            </p>
          </div>
        </div>
      </div>

      {/* Correction Banner (if NEED_CORRECTION) */}
      {isCorrectionNeeded && (
        <Alert variant="warning" className="border-amber-300 bg-amber-50">
          <AlertTriangle className="h-5 w-5 text-amber-700" />
          <div className="ml-2 w-full space-y-3">
            <AlertTitle className="font-semibold text-amber-900">
              Pengajuan Memerlukan Perbaikan (Need Correction)
            </AlertTitle>
            <AlertDescription className="text-xs text-amber-800 leading-relaxed">
              Tim verifikator atau auditor meminta perbaikan data/dokumen. Silakan
              baca catatan verifikasi di bawah, lakukan perbaikan, dan kirimkan
              penjelasan revisi Anda.
            </AlertDescription>

            <div className="pt-2 space-y-2">
              <Label htmlFor="cNotes" className="text-xs font-semibold text-amber-900">
                Penjelasan Perbaikan yang Anda Lakukan:
              </Label>
              <Textarea
                id="cNotes"
                placeholder="Contoh: Dokumen NIB telah diperbarui dengan file resolusi tinggi yang jelas terbaca..."
                value={correctionText}
                onChange={(e) => setCorrectionText(e.target.value)}
                className="bg-white border-amber-300"
              />
              <Button
                onClick={handleResubmitCorrection}
                className="bg-amber-700 hover:bg-amber-800 text-white text-xs h-9"
                disabled={isPending}
              >
                {isPending ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-1.5" />
                ) : (
                  <Send className="h-3.5 w-3.5 mr-1.5" />
                )}
                Kirim Ulang Hasil Perbaikan
              </Button>
            </div>
          </div>
        </Alert>
      )}

      {/* Visual Timeline Tracker Card */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Clock className="h-4 w-4 text-primary-700" />
            Tracking Status & Alur Sertifikasi
          </CardTitle>
          <CardDescription>
            Pantau progres tahapan audit secara transparan.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-6 gap-3 pt-2">
            {STAGES.map((st, idx) => {
              const stageNum = idx + 1;
              const isPast = currentStageNum > stageNum;
              const isCurrent = currentStageNum === stageNum;
              return (
                <div
                  key={st.key}
                  className={`p-3 rounded-lg border text-center space-y-1.5 transition-all ${
                    isCurrent
                      ? "border-primary-700 bg-primary-50/70 shadow-sm"
                      : isPast
                      ? "border-emerald-200 bg-emerald-50/40 text-emerald-800"
                      : "border-slate-200 bg-slate-50 text-slate-400"
                  }`}
                >
                  <div className="flex items-center justify-center">
                    {isPast ? (
                      <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                    ) : isCurrent ? (
                      <div className="h-2.5 w-2.5 rounded-full bg-primary-700 animate-ping" />
                    ) : (
                      <span className="text-[11px] font-bold text-slate-400">
                        0{stageNum}
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] font-semibold leading-tight">
                    {st.label}
                  </p>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* 2-Columns Details: Products Scope (Left) & Verification Notes & Logs (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Products in this Application */}
        <div className="lg:col-span-2 space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Package className="h-4 w-4 text-primary-700" />
                Daftar Produk yang Diajukan ({application.products?.length || 0})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="divide-y divide-slate-100 border border-slate-200 rounded-xl overflow-hidden">
                {application.products?.map((ap: any) => {
                  const p = ap.product;
                  return (
                    <div key={ap.id} className="p-4 space-y-2 bg-white">
                      <div className="flex items-start justify-between">
                        <div>
                          <h4 className="font-semibold text-sm text-slate-900">
                            {p.name}
                          </h4>
                          <p className="text-xs text-slate-500">
                            Merek: <strong>{p.brandName}</strong> • Kategori:{" "}
                            {p.category?.name}
                          </p>
                        </div>
                        <Badge variant="outline" className="text-[10px]">
                          {p.servingType || "KEMASAN"}
                        </Badge>
                      </div>

                      {/* Linked BOM */}
                      <div className="pt-1">
                        <span className="text-[11px] font-semibold text-slate-700">
                          Bahan Baku Terdaftar:
                        </span>
                        <div className="flex flex-wrap gap-1.5 mt-1">
                          {p.productMaterials?.map((pm: any) => (
                            <span
                              key={pm.id}
                              className="text-[11px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded border border-slate-200"
                            >
                              {pm.material?.name}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Status History & Audit Log */}
        <div className="space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <History className="h-4 w-4 text-primary-700" />
                Riwayat Aktivitas
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="divide-y divide-slate-100 text-xs">
                {application.statusHistories?.map((h: any) => (
                  <div key={h.id} className="py-2.5 space-y-1">
                    <div className="flex items-center justify-between">
                      <Badge variant="outline" className="text-[10px] font-semibold">
                        {h.newStatus}
                      </Badge>
                      <span className="text-[10px] text-slate-400">
                        {formatDateTime(h.createdAt)}
                      </span>
                    </div>
                    <p className="text-slate-600 text-[11px] leading-relaxed">
                      {h.notes || "Status pengajuan diperbarui."}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
