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
import { UserCheck, Eye, ClipboardCheck, Loader2, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { formatDate } from "@/lib/utils";

export default function MentorPenugasanPage() {
  const [tasks, setTasks] = useState<any[]>([]);
  const [selectedTask, setSelectedTask] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Form State for LHP
  const [recommendation, setRecommendation] = useState<"LAYAK" | "PERLU_PERBAIKAN" | "TIDAK_LAYAK">("LAYAK");
  const [sjphScore, setSjphScore] = useState(90);
  const [summaryNotes, setSummaryNotes] = useState("");
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
      toast.error("Catatan hasil pemeriksaan wajib diisi minimal 5 karakter.");
      return;
    }

    startTransition(async () => {
      const res = await submitInspectionReportAction({
        applicationId: selectedTask.id,
        recommendation,
        sjphScore,
        summaryNotes,
      });

      if (res.success) {
        toast.success(res.message || "Laporan hasil pendampingan berhasil dikirim!");
        setSelectedTask(null);
        setSummaryNotes("");
        loadData();
      } else {
        toast.error(res.error || "Gagal mengirim laporan.");
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
      header: "Nama Usaha & Merek",
      cell: (item) => (
        <div className="text-xs">
          <p className="font-semibold text-slate-900">{item.business?.name}</p>
          <p className="text-slate-500">Merek: {item.business?.brandName} • NIB: {item.business?.nib}</p>
        </div>
      ),
    },
    {
      header: "Produk Diajukan",
      cell: (item) => (
        <Badge variant="secondary" className="text-xs">
          {item.products?.length || 0} Produk
        </Badge>
      ),
    },
    {
      header: "Status Alur",
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
            setSummaryNotes(`Pendampingan PPH telah dilakukan pada fasilitas produksi ${item.business?.name}. Bahan baku dan proses pembuatan memenuhi ketentuan kehalalan.`);
          }}
          className="h-8 px-3 text-xs bg-primary-800 hover:bg-primary-900"
        >
          <ClipboardCheck className="h-3.5 w-3.5 mr-1" />
          Isi LHP & Rekomendasi
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
          <UserCheck className="h-6 w-6 text-primary-700" />
          Penugasan Pendampingan Proses Produk Halal (PPH)
        </h1>
        <p className="text-sm text-slate-600 mt-1">
          Daftar pelaku usaha UMKM (Self-Declare) yang ditugaskan kepada Anda untuk pendampingan dan verifikasi kehalalan produk.
        </p>
      </div>

      <DataTable
        columns={columns}
        data={tasks}
        searchPlaceholder="Cari nomor pengajuan atau nama usaha..."
        isLoading={isLoading}
      />

      {/* LHP Modal */}
      <Dialog open={!!selectedTask} onOpenChange={(open) => !open && setSelectedTask(null)}>
        <DialogContent className="sm:max-w-[520px]">
          <DialogHeader>
            <DialogTitle>Laporan Hasil Pemeriksaan (LHP) Pendamping</DialogTitle>
            <DialogDescription>
              Usaha: <strong>{selectedTask?.business?.name}</strong> • No. {selectedTask?.applicationNumber}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 pt-2 text-xs">
            <div className="space-y-2">
              <Label htmlFor="rec">Rekomendasi Kelayakan Halal</Label>
              <select
                id="rec"
                value={recommendation}
                onChange={(e) => setRecommendation(e.target.value as any)}
                className="w-full h-10 px-3 rounded-md border border-input text-xs bg-background"
                disabled={isPending}
              >
                <option value="LAYAK">✓ LAYAK (Rekomendasikan Sidang Fatwa)</option>
                <option value="PERLU_PERBAIKAN">⚠️ PERLU PERBAIKAN (Need Correction)</option>
                <option value="TIDAK_LAYAK">✗ TIDAK LAYAK</option>
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="score">Skor Pemenuhan Kriteria SJPH (0 - 100)</Label>
              <Input
                id="score"
                type="number"
                min={0}
                max={100}
                value={sjphScore}
                onChange={(e) => setSjphScore(Number(e.target.value))}
                disabled={isPending}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="sNotes">Kesimpulan Catatan Pendampingan</Label>
              <Textarea
                id="sNotes"
                rows={4}
                value={summaryNotes}
                onChange={(e) => setSummaryNotes(e.target.value)}
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
                "Kirim Laporan & Rekomendasi"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
