"use client";

import React, { useState, useEffect, useTransition } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { getApplicationDetailAction } from "@/actions/application.actions";
import {
  saveChecklistItemAction,
  submitVerificationDecisionAction,
  getAvailableOfficersAction,
  assignOfficerAction,
} from "@/actions/verification.actions";
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  FileCheck2,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  ArrowLeft,
  Building2,
  UserCheck,
  Package,
  FlaskConical,
  UserPlus,
  Loader2,
  History,
  Send,
} from "lucide-react";
import { toast } from "sonner";
import { formatDate, formatDateTime } from "@/lib/utils";

const STANDARD_CHECKLISTS = [
  { key: "NIB_LEGALITY", name: "Dokumen NIB 13 Digit & Legalitas Usaha" },
  { key: "SUPERVISOR_SK", name: "KTP & SK Penetapan Penyelia Halal (Muslim)" },
  { key: "BOM_COMPOSITION", name: "Formulasi Komposisi Bahan Baku (BOM)" },
  { key: "SUPPLIER_HALAL_CERT", name: "Sertifikat Halal Bahan Supplier (Bahan Kritis)" },
  { key: "SJPH_COMMITMENT", name: "Komitmen & Manual Sistem Jaminan Produk Halal" },
];

export default function AdminVerificationWorkbenchPage() {
  const params = useParams();
  const router = useRouter();
  const applicationId = params.id as string;

  const [application, setApplication] = useState<any>(null);
  const [officers, setOfficers] = useState<{ mentors: any[]; auditors: any[] }>({
    mentors: [],
    auditors: [],
  });
  const [isLoading, setIsLoading] = useState(true);

  // Decision State
  const [decisionNotes, setDecisionNotes] = useState("");
  const [isPendingDecision, startTransitionDecision] = useTransition();

  // Assign Officer Modal State
  const [isAssignDialogOpen, setIsAssignDialogOpen] = useState(false);
  const [selectedOfficerUserId, setSelectedOfficerUserId] = useState("");
  const [assignmentNotes, setAssignmentNotes] = useState("");
  const [isPendingAssign, startTransitionAssign] = useTransition();

  const loadData = async () => {
    setIsLoading(true);
    const res = await getApplicationDetailAction(applicationId);
    if (res.success && res.data) {
      setApplication(res.data);
    }
    const offRes = await getAvailableOfficersAction();
    if (offRes.success && offRes.data) {
      setOfficers(offRes.data);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    loadData();
  }, [applicationId]);

  const handleToggleChecklist = async (
    itemKey: string,
    itemName: string,
    currentValid: boolean
  ) => {
    const nextValid = !currentValid;
    const res = await saveChecklistItemAction({
      applicationId,
      itemKey,
      itemName,
      isValid: nextValid,
    });
    if (res.success) {
      toast.success(`Checklist "${itemName}" diperbarui.`);
      loadData();
    } else {
      toast.error("Gagal memperbarui checklist.");
    }
  };

  const handleDecision = (
    decisionType: "APPROVE_DOCUMENTS" | "REQUEST_CORRECTION" | "REJECT"
  ) => {
    if (!decisionNotes || decisionNotes.length < 5) {
      toast.error("Catatan keputusan verifikasi wajib diisi (minimal 5 karakter).");
      return;
    }

    startTransitionDecision(async () => {
      const res = await submitVerificationDecisionAction({
        applicationId,
        decision: decisionType,
        notes: decisionNotes,
      });

      if (res.success) {
        toast.success(res.message || "Keputusan verifikasi berhasil disimpan!");
        setDecisionNotes("");
        loadData();
      } else {
        toast.error(res.error || "Gagal memproses keputusan.");
      }
    });
  };

  const handleAssignOfficer = () => {
    if (!selectedOfficerUserId) {
      toast.error("Pilih petugas yang akan ditugaskan.");
      return;
    }

    const officerType =
      application.schemeType === "SELF_DECLARE" ? "MENTOR" : "AUDITOR";

    startTransitionAssign(async () => {
      const res = await assignOfficerAction({
        applicationId,
        officerUserId: selectedOfficerUserId,
        officerType,
        notes: assignmentNotes,
      });

      if (res.success) {
        toast.success(res.message || "Petugas berhasil ditugaskan!");
        setIsAssignDialogOpen(false);
        loadData();
      } else {
        toast.error(res.error || "Gagal menugaskan petugas.");
      }
    });
  };

  if (isLoading) {
    return (
      <div className="py-24 text-center text-slate-500 text-xs flex flex-col items-center gap-2">
        <Loader2 className="h-6 w-6 animate-spin text-primary-700" />
        Memuat data workbench verifikasi...
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

  const existingChecklists = application.checklists || [];
  const b = application.business;

  return (
    <div className="space-y-6 max-w-6xl">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link href="/admin/pengajuan">
            <Button variant="outline" size="sm" className="h-9 w-9 p-0">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-heading font-bold text-slate-900">
                Verifikasi Berkas: {application.applicationNumber}
              </h1>
              <Badge variant="accent">
                {application.schemeType === "SELF_DECLARE"
                  ? "Self-Declare UMKM"
                  : "Reguler LPH"}
              </Badge>
              <Badge variant="outline" className="font-semibold text-xs">
                Status: {application.status}
              </Badge>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Pemohon: <strong>{b?.name}</strong> • NIB: {b?.nib} • Tgl Masuk:{" "}
              {formatDate(application.submissionDate || application.createdAt)}
            </p>
          </div>
        </div>

        {/* Quick Assignment Trigger */}
        {(application.status === "DOCUMENT_VERIFICATION" ||
          application.status === "SUBMITTED") && (
          <Button
            onClick={() => {
              const defaultOfficer =
                application.schemeType === "SELF_DECLARE"
                  ? officers.mentors[0]?.userId
                  : officers.auditors[0]?.userId;
              setSelectedOfficerUserId(defaultOfficer || "");
              setIsAssignDialogOpen(true);
            }}
            className="bg-emerald-700 hover:bg-emerald-800 text-white font-medium text-xs h-9"
          >
            <UserPlus className="h-4 w-4 mr-1.5" />
            Tugaskan {application.schemeType === "SELF_DECLARE" ? "Pendamping PPH" : "Auditor Halal"}
          </Button>
        )}
      </div>

      {/* Grid: Applicant Details (Left) & Verification Workbench (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Data Usaha & Produk (7 Cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Business & Supervisor Card */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Building2 className="h-4 w-4 text-primary-700" />
                Data Legalitas & Penyelia Halal
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3 p-3 bg-slate-50 rounded-lg border border-slate-200">
                <div>
                  <span className="text-slate-500 block">Nama Badan Usaha:</span>
                  <strong className="text-slate-900">{b?.name}</strong>
                  <span className="text-slate-500 block mt-1">NIB (13 Digit):</span>
                  <span className="font-mono text-primary-800 font-bold">{b?.nib}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Merek Dagang:</span>
                  <strong className="text-slate-900">{b?.brandName}</strong>
                  <span className="text-slate-500 block mt-1">Skala Usaha:</span>
                  <Badge variant="secondary">{b?.businessScale}</Badge>
                </div>
              </div>

              {/* Supervisor */}
              <div className="p-3 bg-emerald-50/50 rounded-lg border border-emerald-200 space-y-1">
                <div className="flex items-center gap-1.5 font-semibold text-emerald-950">
                  <UserCheck className="h-4 w-4 text-emerald-700" />
                  <span>Penyelia Halal: {b?.supervisors?.[0]?.name || "Belum Ada"}</span>
                </div>
                <p className="text-slate-600 text-[11px]">
                  NIK: {b?.supervisors?.[0]?.idCardNumber} • No. SK:{" "}
                  {b?.supervisors?.[0]?.skNumber} • No. HP:{" "}
                  {b?.supervisors?.[0]?.phoneNumber}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Products & Recipes (BOM) */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Package className="h-4 w-4 text-primary-700" />
                Daftar Produk & Matriks Resep BOM ({application.products?.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="divide-y divide-slate-100 border border-slate-200 rounded-xl overflow-hidden text-xs">
                {application.products?.map((ap: any) => {
                  const p = ap.product;
                  return (
                    <div key={ap.id} className="p-4 space-y-2 bg-white">
                      <div className="flex items-start justify-between">
                        <div>
                          <h4 className="font-bold text-sm text-slate-900">
                            {p.name}
                          </h4>
                          <p className="text-slate-500">
                            Merek: {p.brandName} • Kategori: {p.category?.name}
                          </p>
                        </div>
                        <Badge variant="outline">{p.servingType || "KEMASAN"}</Badge>
                      </div>

                      {/* BOM Ingredients */}
                      <div className="pt-1">
                        <span className="font-semibold text-slate-700 block mb-1">
                          Komposisi Bahan Baku Terdaftar:
                        </span>
                        <div className="space-y-1 bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                          {p.productMaterials?.map((pm: any) => (
                            <div
                              key={pm.id}
                              className="flex items-center justify-between text-[11px]"
                            >
                              <span className="font-medium text-slate-800">
                                • {pm.material?.name} ({pm.material?.manufacturer})
                              </span>
                              <Badge
                                variant={
                                  pm.material?.isHalalCertified
                                    ? "success"
                                    : "secondary"
                                }
                                className="text-[10px]"
                              >
                                {pm.material?.isHalalCertified
                                  ? `Halal: ${pm.material?.halalCertNumber || "BPJPH"}`
                                  : "Non-Kritis"}
                              </Badge>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Process Flow */}
                      <div className="pt-1 text-[11px] text-slate-600">
                        <span className="font-semibold text-slate-700">
                          Alur Produksi:
                        </span>{" "}
                        {p.productionProcessDescription || "-"}
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Verification Checklist & Decision (5 Cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Interactive Checklist Card */}
          <Card className="border-primary-200 shadow-sm">
            <CardHeader className="pb-3 bg-primary-50/60 border-b border-primary-100">
              <CardTitle className="text-base flex items-center gap-2 text-primary-950">
                <FileCheck2 className="h-4 w-4 text-primary-700" />
                Checklist Verifikasi Dokumen
              </CardTitle>
              <CardDescription className="text-xs">
                Klik untuk menandai kelengkapan berkas administrasi.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-4 space-y-2">
              {STANDARD_CHECKLISTS.map((item) => {
                const found = existingChecklists.find(
                  (c: any) => c.itemKey === item.key
                );
                const isValid = found ? found.isValid : false;

                return (
                  <div
                    key={item.key}
                    onClick={() =>
                      handleToggleChecklist(item.key, item.name, isValid)
                    }
                    className={`p-3 rounded-lg border flex items-center justify-between cursor-pointer transition-all ${
                      isValid
                        ? "bg-emerald-50 border-emerald-300 text-emerald-950 font-medium"
                        : "bg-white border-slate-200 text-slate-700 hover:border-slate-300"
                    }`}
                  >
                    <div className="flex items-center gap-2.5 text-xs">
                      {isValid ? (
                        <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                      ) : (
                        <div className="h-4 w-4 rounded border-2 border-slate-300 shrink-0" />
                      )}
                      <span>{item.name}</span>
                    </div>

                    <Badge
                      variant={isValid ? "success" : "outline"}
                      className="text-[10px]"
                    >
                      {isValid ? "Lolos" : "Belum Dicek"}
                    </Badge>
                  </div>
                );
              })}
            </CardContent>
          </Card>

          {/* Decision Form Card */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-bold text-slate-900">
                Keputusan Verifikator
              </CardTitle>
              <CardDescription className="text-xs">
                Tentukan tindak lanjut pengajuan berdasarkan hasil verifikasi berkas di atas.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-1.5">
                <Label htmlFor="dNotes" className="text-xs font-semibold">
                  Catatan / Berita Acara Verifikasi (Wajib):
                </Label>
                <Textarea
                  id="dNotes"
                  rows={3}
                  placeholder="Contoh: Seluruh berkas NIB dan BOM bahan baku lengkap dan valid untuk skema Self-Declare."
                  value={decisionNotes}
                  onChange={(e) => setDecisionNotes(e.target.value)}
                  disabled={isPendingDecision}
                  className="text-xs"
                />
              </div>

              <div className="space-y-2 pt-2">
                <Button
                  onClick={() => handleDecision("APPROVE_DOCUMENTS")}
                  className="w-full bg-emerald-700 hover:bg-emerald-800 text-white text-xs h-10 font-semibold"
                  disabled={isPendingDecision}
                >
                  <CheckCircle2 className="h-4 w-4 mr-1.5" />
                  Loloskan Berkas Dokumen (Siap Ditugaskan)
                </Button>

                <Button
                  onClick={() => handleDecision("REQUEST_CORRECTION")}
                  className="w-full bg-amber-600 hover:bg-amber-700 text-white text-xs h-10 font-semibold"
                  disabled={isPendingDecision}
                >
                  <AlertTriangle className="h-4 w-4 mr-1.5" />
                  Minta Perbaikan (Need Correction)
                </Button>

                <Button
                  onClick={() => handleDecision("REJECT")}
                  variant="destructive"
                  className="w-full text-xs h-9"
                  disabled={isPendingDecision}
                >
                  <XCircle className="h-4 w-4 mr-1.5" />
                  Tolak Pengajuan (Permanen)
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Status Histories */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                <History className="h-3.5 w-3.5" />
                Log Mutasi Pengajuan
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="divide-y divide-slate-100 text-[11px] max-h-48 overflow-y-auto">
                {application.statusHistories?.map((h: any) => (
                  <div key={h.id} className="py-2 space-y-0.5">
                    <div className="flex items-center justify-between">
                      <strong className="text-slate-800">{h.newStatus}</strong>
                      <span className="text-[10px] text-slate-400">
                        {formatDateTime(h.createdAt)}
                      </span>
                    </div>
                    <p className="text-slate-600">{h.notes}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Assign Officer Dialog */}
      <Dialog open={isAssignDialogOpen} onOpenChange={setIsAssignDialogOpen}>
        <DialogContent className="sm:max-w-[450px]">
          <DialogHeader>
            <DialogTitle>
              Tugaskan {application.schemeType === "SELF_DECLARE" ? "Pendamping PPH" : "Auditor Halal"}
            </DialogTitle>
            <DialogDescription>
              Pilih petugas aktif yang akan melakukan audit lapangan atau
              pendampingan halal.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 pt-2 text-xs">
            <div className="space-y-2">
              <Label htmlFor="officerSelect">Daftar Petugas Tersedia</Label>
              <select
                id="officerSelect"
                value={selectedOfficerUserId}
                onChange={(e) => setSelectedOfficerUserId(e.target.value)}
                className="w-full h-10 px-3 rounded-md border border-input text-xs bg-background"
                disabled={isPendingAssign}
              >
                {application.schemeType === "SELF_DECLARE"
                  ? officers.mentors.map((m: any) => (
                      <option key={m.userId} value={m.userId}>
                        {m.user?.fullName} ({m.institutionName} • Reg:{" "}
                        {m.registrationNumber})
                      </option>
                    ))
                  : officers.auditors.map((a: any) => (
                      <option key={a.userId} value={a.userId}>
                        {a.user?.fullName} (LPH: {a.lphName} • Reg:{" "}
                        {a.auditorRegNumber})
                      </option>
                    ))}
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="assignNotes">Instruksi Khusus untuk Petugas</Label>
              <Textarea
                id="assignNotes"
                placeholder="Contoh: Mohon koordinasi dengan penyelia halal untuk jadwal audit on-site..."
                value={assignmentNotes}
                onChange={(e) => setAssignmentNotes(e.target.value)}
                disabled={isPendingAssign}
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsAssignDialogOpen(false)}
              disabled={isPendingAssign}
            >
              Batal
            </Button>
            <Button
              onClick={handleAssignOfficer}
              className="bg-primary-800 hover:bg-primary-900"
              disabled={isPendingAssign}
            >
              {isPendingAssign ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Menugaskan...
                </>
              ) : (
                "Konfirmasi Penugasan"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
