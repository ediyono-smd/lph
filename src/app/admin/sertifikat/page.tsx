"use client";

import React, { useState, useEffect, useTransition } from "react";
import {
  getAllCertificatesAdminAction,
  approveAndIssueCertificateAction,
} from "@/actions/certificate.actions";
import { getAllApplicationsAction } from "@/actions/verification.actions";
import { CertificateCard } from "@/components/certificate/certificate-card";
import { DataTable, type ColumnDef } from "@/components/tables/data-table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Award, Plus, Eye, Printer, Loader2, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { formatDate } from "@/lib/utils";
import { printCertificateElement } from "@/lib/print";

export default function AdminCertificatesPage() {
  const [certs, setCerts] = useState<any[]>([]);
  const [readyApps, setReadyApps] = useState<any[]>([]);
  const [selectedCert, setSelectedCert] = useState<any>(null);
  const [isIssueModalOpen, setIsIssueModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Form State for Issue
  const [selectedAppId, setSelectedAppId] = useState("");
  const [decisionNumber, setDecisionNumber] = useState("");
  const [isPending, startTransition] = useTransition();

  const loadData = async () => {
    setIsLoading(true);
    const cRes = await getAllCertificatesAdminAction();
    if (cRes.success && cRes.data) setCerts(cRes.data);

    // Load applications ready for approval
    const aRes = await getAllApplicationsAction({ limit: 50 });
    if (aRes.success && aRes.data) {
      const filtered = aRes.data.items.filter(
        (app: any) =>
          app.status === "DOCUMENT_VERIFICATION" ||
          app.status === "FINAL_REVIEW" ||
          app.status === "INSPECTION"
      );
      setReadyApps(filtered);
      if (filtered.length > 0) setSelectedAppId(filtered[0].id);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleIssueCertificate = () => {
    if (!selectedAppId) {
      toast.error("Pilih pengajuan yang akan disetujui.");
      return;
    }
    if (!decisionNumber || decisionNumber.length < 3) {
      toast.error("Nomor Keputusan Fatwa/Pimpinan wajib diisi.");
      return;
    }

    startTransition(async () => {
      const res = await approveAndIssueCertificateAction({
        applicationId: selectedAppId,
        decisionNumber,
      });

      if (res.success) {
        toast.success(res.message || "Sertifikat berhasil diterbitkan!");
        setIsIssueModalOpen(false);
        setDecisionNumber("");
        loadData();
      } else {
        toast.error(res.error || "Gagal menerbitkan sertifikat.");
      }
    });
  };

  const columns: ColumnDef<any>[] = [
    {
      header: "Nomor Sertifikat",
      accessorKey: "certificateNumber",
      cell: (item) => (
        <span className="font-mono text-xs font-bold text-primary-950 bg-emerald-50 px-2.5 py-1 rounded border border-emerald-200">
          {item.certificateNumber}
        </span>
      ),
    },
    {
      header: "Pelaku Usaha",
      cell: (item) => (
        <div className="text-xs">
          <p className="font-semibold text-slate-900">{item.businessName}</p>
          <p className="text-slate-500">Merek: {item.brandName}</p>
        </div>
      ),
    },
    {
      header: "No. Ketetapan Fatwa",
      cell: (item) => (
        <span className="font-mono text-xs text-slate-700">
          {item.decisionNumber}
        </span>
      ),
    },
    {
      header: "Status",
      cell: (item) => (
        <Badge variant="success" className="text-xs">
          ✓ {item.status}
        </Badge>
      ),
    },
    {
      header: "Tgl Terbit",
      cell: (item) => (
        <span className="text-xs text-slate-600">
          {formatDate(item.issueDate)}
        </span>
      ),
    },
    {
      header: "Aksi",
      cell: (item) => (
        <Button
          size="sm"
          variant="outline"
          onClick={() => setSelectedCert(item)}
          className="h-8 px-2.5 text-xs text-primary-800 hover:bg-primary-50"
        >
          <Eye className="h-3.5 w-3.5 mr-1" />
          Lihat
        </Button>
      ),
      className: "text-right",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-heading font-bold text-slate-900 flex items-center gap-2">
            <Award className="h-6 w-6 text-accent-600" />
            Manajemen Sertifikat Halal Terbit
          </h1>
          <p className="text-sm text-slate-600 mt-1">
            Daftar seluruh sertifikat halal resmi dan penerbitan persetujuan
            sidang fatwa.
          </p>
        </div>

        {readyApps.length > 0 && (
          <Button
            onClick={() => {
              setDecisionNumber(`SK-FATWA-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`);
              setIsIssueModalOpen(true);
            }}
            className="bg-primary-800 hover:bg-primary-900 shadow-sm"
          >
            <Plus className="h-4 w-4 mr-2" />
            Persetujuan & Terbitkan Sertifikat ({readyApps.length})
          </Button>
        )}
      </div>

      <DataTable
        columns={columns}
        data={certs}
        searchPlaceholder="Cari sertifikat halal..."
        isLoading={isLoading}
      />

      {/* Preview Modal */}
      <Dialog
        open={!!selectedCert}
        onOpenChange={(open) => !open && setSelectedCert(null)}
      >
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto p-4 sm:p-6 print:p-0 print:border-none print:shadow-none print:max-h-none print:max-w-none">
          <DialogHeader className="flex flex-row items-center justify-between pb-2 border-b print:hidden">
            <DialogTitle className="text-lg">
              Pratinjau Sertifikat Halal Resmi
            </DialogTitle>
            <Button
              size="sm"
              variant="outline"
              onClick={() => printCertificateElement()}
              className="mr-6 text-xs print:hidden bg-[#073b2d] hover:bg-[#05291f] text-white font-bold rounded-xl shadow-sm"
            >
              <Printer className="h-3.5 w-3.5 mr-1.5 text-[#e5a952]" />
              Cetak Sertifikat
            </Button>
          </DialogHeader>

          {selectedCert && (
            <div className="pt-4 print:pt-0">
              <CertificateCard certificate={selectedCert} />
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Final Approval & Issue Modal */}
      <Dialog open={isIssueModalOpen} onOpenChange={setIsIssueModalOpen}>
        <DialogContent className="sm:max-w-[480px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-primary-950">
              <Award className="h-5 w-5 text-accent-500" />
              Persetujuan Sidang Fatwa & Penerbitan
            </DialogTitle>
            <DialogDescription>
              Menyetujui hasil audit dan menerbitkan Sertifikat Halal resmi
              lengkap dengan nomor unik dan QR Code verifikasi.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 pt-2 text-xs">
            <div className="space-y-2">
              <Label htmlFor="appSelect">Pilih Pengajuan Terverifikasi</Label>
              <select
                id="appSelect"
                value={selectedAppId}
                onChange={(e) => setSelectedAppId(e.target.value)}
                className="w-full h-10 px-3 rounded-md border border-input text-xs bg-background"
                disabled={isPending}
              >
                {readyApps.map((a: any) => (
                  <option key={a.id} value={a.id}>
                    {a.applicationNumber} - {a.business?.name} (
                    {a.products?.length || 0} Produk)
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="decNum">Nomor Keputusan Penetapan Halal (SK)</Label>
              <Input
                id="decNum"
                placeholder="Contoh: SK-FATWA-2026-1029"
                value={decisionNumber}
                onChange={(e) => setDecisionNumber(e.target.value)}
                disabled={isPending}
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsIssueModalOpen(false)}
              disabled={isPending}
            >
              Batal
            </Button>
            <Button
              onClick={handleIssueCertificate}
              className="bg-primary-800 hover:bg-primary-900"
              disabled={isPending}
            >
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Menerbitkan Sertifikat...
                </>
              ) : (
                "Setujui & Terbitkan Sertifikat"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
