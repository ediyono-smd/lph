import React from "react";
import Link from "next/link";
import { CheckCircle2, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PublicNavbar, PublicFooter } from "@/components/public/public-nav";
import { StarDivider } from "@/components/warm/star-divider";

export default function LayananPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#fcfaf6] text-slate-900">
      <PublicNavbar />
      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-14 space-y-12">
        <StarDivider
          subtitle="Pilihan Skema Sertifikasi"
          title="Layanan Sertifikasi Halal Resmi"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Self Declare */}
          <div className="bg-white rounded-3xl border-2 border-[#e5a952] p-8 sm:p-10 shadow-md space-y-6 flex flex-col justify-between">
            <div className="space-y-4">
              <span className="inline-block px-3 py-1 bg-[#073b2d] text-emerald-100 rounded-full text-xs font-bold shadow-sm">
                Khusus Usaha Mikro & Kecil (UMK)
              </span>
              <h2 className="font-heading text-2xl sm:text-3xl font-extrabold text-slate-900">
                Skema Self-Declare
              </h2>
              <p className="text-xs text-slate-600 leading-relaxed">
                Mekanisme pernyataan mandiri kehalalan produk bagi pelaku usaha mikro
                dan kecil berdasarkan standar jaminan produk halal dengan pendampingan
                oleh Pendamping PPH.
              </p>

              <div className="space-y-2 pt-2 text-xs">
                <h4 className="font-bold text-slate-900">Kriteria Pemenuhan:</h4>
                <ul className="space-y-1.5 text-slate-600">
                  <li>• Memiliki NIB (13 Digit) skala Mikro / Kecil.</li>
                  <li>• Produk tidak menggunakan bahan berbahaya/kritis non-halal.</li>
                  <li>• Bahan baku sudah bersertifikat halal atau tergolong *positive list*.</li>
                  <li>• Proses produksi sederhana dan higienis.</li>
                </ul>
              </div>
            </div>

            <Link href="/register">
              <Button className="w-full h-11 rounded-xl bg-[#e5a952] hover:bg-[#d8983e] text-slate-950 font-bold text-xs shadow-md">
                Pilih Skema Self-Declare <ArrowRight className="h-4 w-4 ml-1.5" />
              </Button>
            </Link>
          </div>

          {/* Reguler */}
          <div className="bg-white rounded-3xl border border-[#ebd7ba] p-8 sm:p-10 shadow-sm space-y-6 flex flex-col justify-between">
            <div className="space-y-4">
              <span className="inline-block px-3 py-1 bg-[#fbf5eb] border border-[#ebd7ba] text-[#b87d28] rounded-full text-xs font-bold">
                Usaha Menengah & Besar
              </span>
              <h2 className="font-heading text-2xl sm:text-3xl font-extrabold text-slate-900">
                Skema Reguler (Pemeriksaan LPH)
              </h2>
              <p className="text-xs text-slate-600 leading-relaxed">
                Proses pemeriksaan kehalalan komprehensif yang melibatkan audit teknis
                fasilitas pabrik dan pengujian laboratorium oleh Lembaga Pemeriksa
                Halal (LPH) terakreditasi.
              </p>

              <div className="space-y-2 pt-2 text-xs">
                <h4 className="font-bold text-slate-900">Kriteria Pemenuhan:</h4>
                <ul className="space-y-1.5 text-slate-600">
                  <li>• Skala Usaha Menengah, Besar, atau Luar Negeri.</li>
                  <li>• Menggunakan bahan olahan kompleks atau produk hewani.</li>
                  <li>• Memerlukan audit fasilitas produksi secara langsung oleh Auditor Halal.</li>
                  <li>• Memenuhi standar audit internasional dan ekspor.</li>
                </ul>
              </div>
            </div>

            <Link href="/register">
              <Button variant="outline" className="w-full h-11 rounded-xl border-slate-300 hover:border-[#b87d28] hover:bg-[#faeedb] text-slate-900 font-bold text-xs">
                Pilih Skema Reguler
              </Button>
            </Link>
          </div>
        </div>
      </main>
      <PublicFooter />
    </div>
  );
}
