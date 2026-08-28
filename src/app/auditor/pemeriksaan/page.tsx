"use client";

import React, { useState, useEffect, useTransition } from "react";
import {
  getAssignedInspectionsAction,
  submitInspectionReportAction,
} from "@/actions/inspection.actions";
import { DataTable, type ColumnDef } from "@/components/tables/data-table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ClipboardCheck, Loader2 } from "lucide-react";
import { toast } from "sonner";

export default function AuditorPemeriksaanPage() {
  const [tasks, setTasks] = useState<any[]>([]);
  const [selectedTask, setSelectedTask] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Form State for LHP
  const [recommendation, setRecommendation] = useState<"LAYAK" | "PERLU_PERBAIKAN" | "TIDAK_LAYAK">("LAYAK");
  const [sjphScore, setSjphScore] = useState(95);
  const [summaryNotes, setSummaryNotes] = useState("");
  const [findingText, setFindingText] = useState("");
  const [isPending, startTransition] = useTransition();

  const loadData = async () => {
    setIsLoading(true);
    const res = await getAssignedInspectionsAction();
    if (res.success && res.data) {
      setTasks(res.data);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSubmitLhp = () => {
    if (!summaryNotes || summaryNotes.length < 5) {
      toast.error("Catatan hasil audit lapangan wajib diisi.");
      return;
    }

    startTransition(async () => {
      const findings = findingText
        ? [
            {
              findingType: "MINOR",
              description: findingText,
              correctiveActionRequired: "Perbaikan catatan log proses pembersihan fasilitas.",
            },
          ]
        : [];

      const res = await submitInspectionReportAction({
        applicationId: selectedTask.id,
        recommendation,
        sjphScore,
        summaryNotes,
        findings,
      });

      if (res.success) {
        toast.success(res.message || "Laporan Hasil Pemeriksaan (LHP) berhasil dikirim!");
        setSelectedTask(null);
        setSummaryNotes("");
        setFindingText("");
        loadData();
      } else {
        toast.error(res.error || "Gagal mengirim LHP.");
      }
    });
  };

  const columns: ColumnDef<any>[] = [
    {
      header: "No. Pengajuan",
      accessorKey: "applicationNumber",
      cell: (item) => (
        <span className="font-mono text-xs font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded">
          {item.applicationNumber}
        </span>
      ),
    },
    {
      header: "Nama Badan Usaha",
      cell: (item) => (
        <div className="text-xs">
          <p className="font-semibold text-slate-900">{item.business?.name}</p>
          <p className="text-slate-500">Merek: {item.business?.brandName}</p>
        </div>
      ),
    },
    {
      header: "Skema",
      cell: (item) => (
        <Badge variant={item.schemeType === "SELF_DECLARE" ? "accent" : "outline"} className="text-[10px]">
          {item.schemeType}
        </Badge>
      ),
    },
    {
      header: "Status",
      cell: (item) => (
        <Badge variant="info" className="text-[11px]">
          {item.status}
        </Badge>
      ),
    },
    {
      header: "Aksi",
      cell: (item) => (
        <Button
          size="sm"
          onClick={() => {
            setSelectedTask(item);
            setSummaryNotes(`Audit lapangan pada pabrik/dapur ${item.business?.name} telah dilaksanakan. Matriks bahan baku halal terverifikasi dan memenuhi seluruh kriteria Sistem Jaminan Produk Halal (SJPH).`);
          }}
          className="h-8 px-3 text-xs bg-primary-800 hover:bg-primary-900"
        >
          <ClipboardCheck className="h-3.5 w-3.5 mr-1" />
          Input LHP Audit Lapangan
        </Button>
      ),
      className: "text-right",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-heading font-bold text-slate-900 flex items-center gap-2">
          <ClipboardCheck className="h-6 w-6 text-primary-700" />
          Pemeriksaan Teknis & Audit Halal (LPH)
        </h1>
        <p className="text-sm text-slate-600 mt-1">
          Daftar pengajuan sertifikasi yang dialokasikan untuk audit teknis fasilitas produksi, bahan baku, dan penyusunan LHP.
        </p>
      </div>

      <DataTable
        columns={columns}
        data={tasks}
        searchPlaceholder="Cari nomor pengajuan..."
        isLoading={isLoading}
      />

      {/* LHP Modal */}
      <Dialog open={!!selectedTask} onOpenChange={(open) => !open && setSelectedTask(null)}>
        <DialogContent className="sm:max-w-[540px]">
          <DialogHeader>
            <DialogTitle>Laporan Hasil Pemeriksaan (LHP) Auditor LPH</DialogTitle>
            <DialogDescription>
              Usaha: <strong>{selectedTask?.business?.name}</strong> • Pengajuan {selectedTask?.applicationNumber}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 pt-2 text-xs">
            <div className="space-y-2">
              <Label htmlFor="recAuditor">Kesimpulan Rekomendasi Auditor</Label>
              <select
                id="recAuditor"
                value={recommendation}
                onChange={(e) => setRecommendation(e.target.value as any)}
                className="w-full h-10 px-3 rounded-md border border-input text-xs bg-background"
                disabled={isPending}
              >
                <option value="LAYAK">✓ LAYAK (Rekomendasikan Penetapan Fatwa)</option>
                <option value="PERLU_PERBAIKAN">⚠️ PERLU PERBAIKAN TEMUAN (Need Correction)</option>
                <option value="TIDAK_LAYAK">✗ TIDAK LAYAK</option>
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="scoreAuditor">Skor Pemenuhan Kriteria SJPH (0 - 100)</Label>
              <Input
                id="scoreAuditor"
                type="number"
                min={0}
                max={100}
                value={sjphScore}
                onChange={(e) => setSjphScore(Number(e.target.value))}
                disabled={isPending}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="auditorNotes">Ringkasan Laporan Hasil Audit</Label>
              <Textarea
                id="auditorNotes"
                rows={3}
                value={summaryNotes}
                onChange={(e) => setSummaryNotes(e.target.value)}
                disabled={isPending}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="findings">Catatan Temuan Ketidaksesuaian Lapangan (Jika Ada)</Label>
              <Textarea
                id="findings"
                rows={2}
                placeholder="Contoh: Log kebersihan ruangan penyimpanan bahan belum diperbarui teratur..."
                value={findingText}
                onChange={(e) => setFindingText(e.target.value)}
                disabled={isPending}
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setSelectedTask(null)}
              disabled={isPending}
            >
              Batal
            </Button>
            <Button
              onClick={handleSubmitLhp}
              className="bg-primary-800 hover:bg-primary-900"
              disabled={isPending}
            >
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Mengirimkan...
                </>
              ) : (
                "Kirim LHP ke Komite Fatwa"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
