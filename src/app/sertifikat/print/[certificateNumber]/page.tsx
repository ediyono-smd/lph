"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { getPublicCertificateByNumberAction } from "@/actions/certificate.actions";
import { CertificateCard } from "@/components/certificate/certificate-card";
import { Button } from "@/components/ui/button";
import { Printer, ArrowLeft, Loader2 } from "lucide-react";
import Link from "next/link";

export default function PrintCertificatePage() {
  const params = useParams();
  const certificateNumber = params?.certificateNumber as string;
  const [cert, setCert] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function load() {
      if (!certificateNumber) return;
      setIsLoading(true);
      const res = await getPublicCertificateByNumberAction(decodeURIComponent(certificateNumber));
      if (res.success && res.data) {
        setCert(res.data);
      }
      setIsLoading(false);
    }
    load();
  }, [certificateNumber]);

  useEffect(() => {
    if (cert) {
      // Auto trigger print after render
      const timer = setTimeout(() => {
        window.print();
      }, 600);
      return () => clearTimeout(timer);
    }
  }, [cert]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#fcfaf6] space-y-3">
        <Loader2 className="h-8 w-8 animate-spin text-[#073b2d]" />
        <p className="text-xs font-bold text-slate-700">Menyiapkan dokumen cetak sertifikat...</p>
      </div>
    );
  }

  if (!cert) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#fcfaf6] p-6 text-center space-y-4">
        <p className="text-sm font-bold text-slate-800">Sertifikat tidak ditemukan atau nomor tidak valid.</p>
        <Link href="/admin/sertifikat">
          <Button variant="outline" size="sm" className="rounded-xl border-[#ebd7ba]">
            <ArrowLeft className="h-4 w-4 mr-1.5" />
            Kembali
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 py-6 px-4 print:p-0 print:m-0 print:bg-white">
      {/* Top Floating Control Bar (Hidden on Print) */}
      <div className="max-w-3xl mx-auto mb-4 flex items-center justify-between bg-white p-3 rounded-2xl border border-[#ebd7ba] shadow-sm print:hidden">
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => window.close()}
            className="h-8 px-3 rounded-xl border-[#ebd7ba] text-xs font-semibold"
          >
            <ArrowLeft className="h-3.5 w-3.5 mr-1" />
            Tutup Tab
          </Button>
          <span className="text-xs text-slate-600 font-medium">
            Dokumen Resmi Sertifikat Halal: <strong>{cert.certificateNumber}</strong>
          </span>
        </div>

        <Button
          size="sm"
          onClick={() => window.print()}
          className="h-8 px-4 rounded-xl bg-[#073b2d] hover:bg-[#05291f] text-white font-bold text-xs shadow-sm"
        >
          <Printer className="h-3.5 w-3.5 mr-1.5 text-[#e5a952]" />
          Cetak Sekarang / Simpan PDF
        </Button>
      </div>

      {/* Pure Printable Certificate Document */}
      <div className="flex justify-center items-center">
        <CertificateCard certificate={cert} />
      </div>
    </div>
  );
}
