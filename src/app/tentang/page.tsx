import React from "react";
import { ShieldCheck, Target, Award } from "lucide-react";
import { PublicNavbar, PublicFooter } from "@/components/public/public-nav";
import { StarDivider } from "@/components/warm/star-divider";

export default function TentangPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#fcfaf6] text-slate-900">
      <PublicNavbar />
      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-14 space-y-12">
        <StarDivider
          subtitle="Profil Lembaga"
          title="Tentang Platform SIP-HALAL"
        />

        <div className="p-8 sm:p-10 bg-white rounded-3xl border border-[#ebd7ba] shadow-sm space-y-4 text-xs sm:text-sm text-slate-700 leading-relaxed font-normal">
          <h3 className="font-heading font-extrabold text-lg text-slate-900">
            Visi & Misi Transformasi Digital Halal Indonesia
          </h3>
          <p>
            SIP-HALAL dibangun untuk mengintegrasikan seluruh pemangku kepentingan
            dalam ekosistem halal Indonesia: mulai dari Pelaku Usaha UMKM,
            Pendamping PPH, Auditor Lembaga Pemeriksa Halal (LPH), Verifikator
            Administrasi, hingga Komite Fatwa Halal.
          </p>
          <p>
            Melalui sistem otomasi workflow, pencatatan resep bahan baku (BOM),
            pemeriksaan digital, dan penerbitan sertifikat halal ber-QR Code dengan
            tanda tangan digital, proses sertifikasi menjadi lebih cepat, akurat,
            dan dapat dipertanggungjawabkan.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="p-6 bg-white rounded-3xl border border-[#ebd7ba] text-center space-y-2.5 shadow-sm hover:border-[#e5a952] transition-all">
            <div className="h-12 w-12 bg-[#faeedb] text-[#b87d28] rounded-2xl flex items-center justify-center mx-auto">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <h4 className="font-heading font-extrabold text-base text-slate-900">
              Integritas Syariat
            </h4>
            <p className="text-xs text-slate-600 font-normal">
              Menjaga kehalalan produk sesuai standar fatwa dan kaidah syariat Islam.
            </p>
          </div>

          <div className="p-6 bg-white rounded-3xl border border-[#ebd7ba] text-center space-y-2.5 shadow-sm hover:border-[#e5a952] transition-all">
            <div className="h-12 w-12 bg-[#e4ede6] text-[#0a4d3c] rounded-2xl flex items-center justify-center mx-auto">
              <Target className="h-6 w-6" />
            </div>
            <h4 className="font-heading font-extrabold text-base text-slate-900">
              Transparansi Data
            </h4>
            <p className="text-xs text-slate-600 font-normal">
              Setiap perpindahan status tercatat otomatis dalam audit trail digital.
            </p>
          </div>

          <div className="p-6 bg-white rounded-3xl border border-[#ebd7ba] text-center space-y-2.5 shadow-sm hover:border-[#e5a952] transition-all">
            <div className="h-12 w-12 bg-[#faeedb] text-[#b87d28] rounded-2xl flex items-center justify-center mx-auto">
              <Award className="h-6 w-6" />
            </div>
            <h4 className="font-heading font-extrabold text-base text-slate-900">
              Kecepatan Layanan
            </h4>
            <p className="text-xs text-slate-600 font-normal">
              Memangkas birokrasi manual menuju target SLA penerbitan 14 hari kerja.
            </p>
          </div>
        </div>
      </main>
      <PublicFooter />
    </div>
  );
}
