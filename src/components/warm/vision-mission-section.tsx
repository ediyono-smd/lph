import React from "react";
import Link from "next/link";
import { StarDivider } from "./star-divider";
import {
  ShieldCheck,
  Award,
  Users,
  FlaskConical,
  Building2,
  RefreshCw,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export function VisionMissionSection() {
  const pillars = [
    {
      title: "Komitmen Manajemen & SDM",
      desc: "Penetapan kebijakan halal, pembentukan tim manajemen halal, dan penunjukan Penyelia Halal bersertifikat.",
      icon: Users,
      bgGradient: "from-[#faeedb] to-[#f4deb8]",
      borderColor: "border-[#e8ce9e]",
      href: "/alur",
    },
    {
      title: "Bahan Baku Bebas Najis",
      desc: "Memastikan seluruh bahan utama, bahan tambahan, dan bahan penolong memiliki sertifikat halal yang valid.",
      icon: FlaskConical,
      bgGradient: "from-[#e4ede6] to-[#cbe0cf]",
      borderColor: "border-[#b5d3bb]",
      href: "/dashboard/bahan",
    },
    {
      title: "Fasilitas Produksi Terpisah",
      desc: "Pabrik, dapur, wadah, dan jalur distribusi bebas dari kontaminasi silang dengan bahan haram atau najis.",
      icon: Building2,
      bgGradient: "from-[#f9e9de] to-[#f3d3bd]",
      borderColor: "border-[#e5be9f]",
      href: "/alur",
    },
    {
      title: "Audit Internal & Pemantauan",
      desc: "Evaluasi berkala minimal 6 bulan sekali untuk menjamin konsistensi penerapan SJPH secara berkelanjutan.",
      icon: RefreshCw,
      bgGradient: "from-[#fae6e6] to-[#f4cece]",
      borderColor: "border-[#e5b2b2]",
      href: "/alur",
    },
  ];

  return (
    <section className="py-16 bg-[#f7f2e7] border-y border-[#ede0ca] relative overflow-hidden">
      {/* Repeating Islamic Arabesque / Geometric Pattern Watermark */}
      <div className="absolute inset-0 opacity-[0.04] pointer-events-none bg-[radial-gradient(#b87d28_2px,transparent_2px)] [background-size:24px_24px]" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 relative z-10">
        {/* Top Islamic Star Header matching reference */}
        <StarDivider
          subtitle="Standar Kepatuhan Syariat"
          title="Prinsip Pokok Sistem Jaminan Produk Halal (SJPH)"
        />

        {/* Middle Split: Narrative Intro (Left) + Vision/Mission (Right) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column (6 Cols) */}
          <div className="lg:col-span-6 space-y-4 text-slate-700 leading-relaxed text-sm">
            <p>
              Sistem Informasi Terpadu Sertifikasi Halal (SIP-HALAL) dirancang
              bukan sekadar sebagai gerbang administrasi dokumen, melainkan wadah
              pembinaan ekosistem industri halal Indonesia yang komprehensif,
              akuntabel, dan transparan.
            </p>
            <p className="text-slate-600 text-xs leading-relaxed">
              Mulai dari pelaku usaha mikro dan kecil (UMK) yang memanfaatkan
              fasilitasi subsidi negara hingga industri manufaktur berskala
              ekspor, seluruh proses diawasi secara digital dengan jaminan
              ketertelusuran (*traceability*) bahan dan fasilitas produksi.
            </p>
            <div className="pt-2">
              <Link href="/alur">
                <Button
                  variant="outline"
                  size="sm"
                  className="rounded-xl border-slate-400 text-slate-800 hover:bg-[#ebdcc4] text-xs font-bold"
                >
                  Pelajari Selengkapnya <ArrowRight className="h-3.5 w-3.5 ml-1.5" />
                </Button>
              </Link>
            </div>
          </div>

          {/* Right Column: Vision & Mission (6 Cols) */}
          <div className="lg:col-span-6 space-y-4">
            {/* Vision */}
            <div className="flex gap-4 items-start p-4 rounded-2xl bg-white/70 border border-[#e8d7be] shadow-sm">
              <div className="h-12 w-12 rounded-xl bg-[#faeedb] border border-[#e8ce9e] flex items-center justify-center text-[#b87d28] shrink-0 font-extrabold text-lg">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <div className="space-y-1">
                <h3 className="font-heading font-bold text-base text-slate-900">
                  Visi Jaminan Halal Nasional
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Mewujudkan Indonesia sebagai pusat produsen produk halal terkemuka
                  di dunia dengan perlindungan konsumen yang paripurna.
                </p>
              </div>
            </div>

            {/* Mission */}
            <div className="flex gap-4 items-start p-4 rounded-2xl bg-white/70 border border-[#e8d7be] shadow-sm">
              <div className="h-12 w-12 rounded-xl bg-[#e4ede6] border border-[#b5d3bb] flex items-center justify-center text-[#0a4d3c] shrink-0 font-extrabold text-lg">
                <Award className="h-6 w-6" />
              </div>
              <div className="space-y-1">
                <h3 className="font-heading font-bold text-base text-slate-900">
                  Misi Pelayanan Terpadu
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Menyediakan layanan sertifikasi halal yang cepat, mudah,
                  profesional, serta menjamin integritas fatwa dan kepatuhan hukum.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom: 4 Pastel Gradient Cards matching reference */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 pt-4">
          {pillars.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className={`p-6 rounded-2xl bg-gradient-to-b ${item.bgGradient} border ${item.borderColor} space-y-3 shadow-sm hover:shadow-md transition-all flex flex-col justify-between`}
              >
                <div className="space-y-2">
                  <div className="h-11 w-11 rounded-xl bg-white/80 flex items-center justify-center text-slate-800 shadow-sm">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h4 className="font-heading font-bold text-sm text-slate-900 leading-snug">
                    {item.title}
                  </h4>
                  <p className="text-xs text-slate-700 leading-relaxed">
                    {item.desc}
                  </p>
                </div>

                <Link
                  href={item.href}
                  className="text-xs font-bold text-slate-800 hover:text-slate-950 inline-flex items-center pt-2 group"
                >
                  <span>Baca Selengkapnya</span>
                  <ArrowRight className="h-3.5 w-3.5 ml-1 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
