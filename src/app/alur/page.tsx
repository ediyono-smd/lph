import React from "react";
import Link from "next/link";
import {
  FileSpreadsheet,
  CheckCircle2,
  Building2,
  FlaskConical,
  UserCheck,
  Award,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { PublicNavbar, PublicFooter } from "@/components/public/public-nav";
import { StarDivider } from "@/components/warm/star-divider";

export default function AlurPage() {
  const steps = [
    {
      num: "01",
      title: "Pendaftaran Akun & Profil Legalitas",
      desc: "Pelaku usaha membuat akun di portal SIP-HALAL, melengkapi profil badan usaha (NIB 13 digit) dan data penanggung jawab Penyelia Halal (Wajib Muslim & SK Penetapan).",
      icon: Building2,
    },
    {
      num: "02",
      title: "Input Katalog Bahan Baku & Resep BOM",
      desc: "Mendaftarkan seluruh bahan baku dan bahan penolong beserta nomor sertifikat halal supplier, kemudian memetakan komposisi resep (Bill of Materials) pada setiap produk.",
      icon: FlaskConical,
    },
    {
      num: "03",
      title: "Pengajuan Sertifikasi & Verifikasi Dokumen",
      desc: "Membuat permohonan sertifikasi (Self-Declare / Reguler), menyetujui komitmen manual SJPH, dan menunggu verifikasi kelengkapan berkas oleh tim Verifikator.",
      icon: FileSpreadsheet,
    },
    {
      num: "04",
      title: "Pemeriksaan Lapangan & Audit SJPH",
      desc: "Petugas Pendamping PPH (skema Self-Declare) atau Auditor Halal LPH (skema Reguler) melakukan verifikasi on-site terhadap fasilitas produksi dan higienitas.",
      icon: UserCheck,
    },
    {
      num: "05",
      title: "Sidang Fatwa Kehalalan Produk",
      desc: "Komite Fatwa Halal menelaah Laporan Hasil Pemeriksaan (LHP) untuk menetapkan kehalalan produk secara syariat.",
      icon: CheckCircle2,
    },
    {
      num: "06",
      title: "Penerbitan Sertifikat Halal Ber-QR Code",
      desc: "Sertifikat Halal resmi diterbitkan dengan nomor register unik dan QR Code digital yang dapat diunduh dan diverifikasi publik secara real-time.",
      icon: Award,
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[#fcfaf6] text-slate-900">
      <PublicNavbar />
      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-14 space-y-12">
        <StarDivider
          subtitle="Panduan Langkah demi Langkah"
          title="Alur & Tata Cara Sertifikasi Halal"
        />

        <div className="space-y-5">
          {steps.map((s) => {
            const Icon = s.icon;
            return (
              <div
                key={s.num}
                className="p-6 sm:p-7 bg-white rounded-3xl border border-[#ebd7ba] shadow-sm hover:shadow-md hover:border-[#e5a952] transition-all flex flex-col sm:flex-row items-start gap-6 relative"
              >
                <div className="h-14 w-14 rounded-2xl bg-[#073b2d] text-[#e5a952] font-extrabold text-xl flex items-center justify-center shrink-0 shadow-md">
                  {s.num}
                </div>

                <div className="space-y-2 flex-1">
                  <div className="flex items-center gap-2">
                    <Icon className="h-5 w-5 text-[#b87d28]" />
                    <h3 className="font-heading font-extrabold text-lg text-slate-900">
                      {s.title}
                    </h3>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
                    {s.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* CTA Box */}
        <div className="p-8 sm:p-12 bg-[#073b2d] rounded-3xl text-white text-center space-y-4 shadow-xl">
          <h3 className="font-heading text-2xl font-extrabold text-white">
            Sudah Memahami Alurnya? Siapkan Usaha Anda Sekarang
          </h3>
          <p className="text-xs sm:text-sm text-emerald-100/90 max-w-md mx-auto">
            Pendaftaran akun pelaku usaha hanya butuh waktu 2 menit secara online.
          </p>
          <Link href="/register" className="inline-block pt-2">
            <Button className="h-11 px-8 rounded-xl bg-[#e5a952] hover:bg-[#d8983e] text-slate-950 font-bold text-xs shadow-md">
              Daftar Akun Sekarang <ArrowRight className="h-4 w-4 ml-1.5" />
            </Button>
          </Link>
        </div>
      </main>
      <PublicFooter />
    </div>
  );
}
