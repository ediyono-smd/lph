"use client";

import React, { useState, useEffect } from "react";
import { getMyCertificatesAction } from "@/actions/certificate.actions";
import { CertificateCard } from "@/components/certificate/certificate-card";
import { DataTable, type ColumnDef } from "@/components/tables/data-table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Award, Eye, Printer, QrCode } from "lucide-react";
import { formatDate } from "@/lib/utils";
import { printCertificateElement } from "@/lib/print";

export default function BusinessCertificatesPage() {
  const [certs, setCerts] = useState<any[]>([]);
  const [selectedCert, setSelectedCert] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      setIsLoading(true);
      const res = await getMyCertificatesAction();
      if (res.success && res.data) {
        setCerts(res.data);
      }
      setIsLoading(false);
    }
    loadData();
  }, []);

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
      header: "Nama Usaha & Merek",
      cell: (item) => (
        <div className="text-xs">
          <p className="font-semibold text-slate-900">{item.businessName}</p>
          <p className="text-slate-500">Merek: {item.brandName}</p>
        </div>
      ),
    },
    {
      header: "Jumlah Produk",
      cell: (item) => (
        <Badge variant="secondary" className="text-xs">
          {item.products?.length || 0} Produk Terlampir
        </Badge>
      ),
    },
    {
      header: "Status",
      cell: (item) => (
        <Badge variant="success" className="text-xs font-medium">
          ✓ {item.status}
        </Badge>
      ),
    },
    {
      header: "Tanggal Terbit",
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
          onClick={() => setSelectedCert(item)}
          className="h-8 px-3 text-xs bg-primary-800 hover:bg-primary-900"
        >
          <Eye className="h-3.5 w-3.5 mr-1" />
          Lihat Sertifikat
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
          <Award className="h-6 w-6 text-accent-600" />
          Sertifikat Halal Terbit
        </h1>
        <p className="text-sm text-slate-600 mt-1">
          Daftar sertifikat halal resmi yang telah disetujui dan diterbitkan
          oleh Komite Fatwa.
        </p>
      </div>

      <DataTable
        columns={columns}
        data={certs}
        searchPlaceholder="Cari sertifikat..."
        isLoading={isLoading}
      />

      {/* Certificate Preview Modal */}
      <Dialog
        open={!!selectedCert}
        onOpenChange={(open) => !open && setSelectedCert(null)}
      >
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto p-4 sm:p-6 print:p-0 print:border-none print:shadow-none print:max-h-none print:max-w-none">
          <DialogHeader className="flex flex-row items-center justify-between pb-2 border-b print:hidden">
            <DialogTitle className="text-lg">
              Pratinjau Sertifikat Halal Digital
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
    </div>
  );
}
