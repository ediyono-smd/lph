import React from "react";
import Link from "next/link";
import { getPublicCertificateByNumberAction } from "@/actions/certificate.actions";
import { CertificateCard } from "@/components/certificate/certificate-card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ShieldCheck, CheckCircle2, ArrowLeft, Search } from "lucide-react";
import { PublicNavbar, PublicFooter } from "@/components/public/public-nav";

interface VerifyPageProps {
  params: Promise<{
    certificateNumber: string;
  }>;
}

export default async function VerifyCertificateDetailPage({
  params,
}: VerifyPageProps) {
  const { certificateNumber } = await params;
  const res = await getPublicCertificateByNumberAction(certificateNumber);

  return (
    <div className="min-h-screen flex flex-col bg-[#fcfaf6] text-slate-900">
      <PublicNavbar />
      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-14 space-y-6">
        {(!res.success || !res.data) ? (
          <div className="max-w-md w-full mx-auto text-center space-y-4 bg-white p-8 rounded-3xl border border-[#ebd7ba] shadow-sm my-8">
            <div className="h-16 w-16 bg-red-50 text-red-600 rounded-full flex items-center justify-center mx-auto">
              <ShieldCheck className="h-8 w-8" />
            </div>
            <h1 className="text-xl font-heading font-extrabold text-slate-900">
              Sertifikat Tidak Ditemukan
            </h1>
            <p className="text-xs text-slate-600 leading-relaxed font-normal">
              Nomor sertifikat <strong>{certificateNumber}</strong> tidak
              terdaftar dalam pangkalan data resmi SIP-HALAL. Mohon periksa kembali
              nomor yang dimasukkan atau hubungi pihak penerbit.
            </p>
            <Link href="/verify">
              <Button className="bg-[#e5a952] hover:bg-[#d8983e] text-slate-950 font-bold text-xs rounded-xl w-full mt-2">
                <Search className="h-4 w-4 mr-2" />
                Cari Nomor Lain
              </Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Top Navbar Back Action */}
            <div className="flex items-center justify-between">
              <Link href="/verify">
                <Button variant="outline" size="sm" className="h-9 rounded-xl border-[#ebd7ba] bg-white">
                  <ArrowLeft className="h-4 w-4 mr-1.5" />
                  Kembali ke Pencarian
                </Button>
              </Link>
              <div className="flex items-center gap-2">
                <Link href={`/sertifikat/print/${encodeURIComponent(certificateNumber)}`} target="_blank">
                  <Button size="sm" className="h-9 px-3 rounded-xl bg-[#073b2d] hover:bg-[#05291f] text-white font-bold text-xs">
                    Cetak Dokumen
                  </Button>
                </Link>
                <Badge className="bg-[#073b2d] text-[#e5a952] font-semibold border border-emerald-700">
                  ✓ Terverifikasi Otomatis via QR Code
                </Badge>
              </div>
            </div>

            {/* Success Banner */}
            <div className="p-4 bg-emerald-50 border border-emerald-300 rounded-2xl flex items-center gap-3 text-emerald-900 shadow-sm">
              <CheckCircle2 className="h-6 w-6 text-emerald-600 shrink-0" />
              <div>
                <h4 className="font-bold text-sm">✓ SERTIFIKAT HALAL RESMI & AKTIF</h4>
                <p className="text-xs text-emerald-800 font-normal">
                  Dokumen ini diverifikasi secara real-time langsung dari pangkalan
                  data sertifikasi halal Republik Indonesia.
                </p>
              </div>
            </div>

            {/* Visual Certificate Card */}
            <CertificateCard certificate={res.data} />
          </div>
        )}
      </main>
      <PublicFooter />
    </div>
  );
}
