import React from "react";
import { StarDivider } from "./star-divider";
import { ShieldCheck, UserCheck, Award, Microscope, Users } from "lucide-react";

const SCHOLARS = [
  {
    name: "Prof. Dr. KH. Hasanuddin, M.Ag",
    role: "Ketua Komite Fatwa Halal",
    desc: "Penetapan Hukum & Keabsahan Syariat",
    icon: ShieldCheck,
    avatarBg: "from-[#faeedb] to-[#f4deb8]",
  },
  {
    name: "Dr. Ir. H. Muhammad Arifin, M.Si",
    role: "Direktur Lembaga Pemeriksa (LPH)",
    desc: "Audit Teknis Fasilitas & Lab Produksi",
    icon: Award,
    avatarBg: "from-[#e4ede6] to-[#cbe0cf]",
  },
  {
    name: "Dr. Siti Aminah, S.Pt, M.Biotech",
    role: "Kepala Asesor & Bioteknologi",
    desc: "Uji DNA Porcine & Analisis Kimiawi",
    icon: Microscope,
    avatarBg: "from-[#f9e9de] to-[#f3d3bd]",
  },
  {
    name: "Ahmad Fauzi, S.E.I, M.E",
    role: "Koordinator Pendamping PPH",
    desc: "Pendampingan Self-Declare UMKM",
    icon: UserCheck,
    avatarBg: "from-[#fae6e6] to-[#f4cece]",
  },
];

export function WarmScholarsSection() {
  return (
    <section className="py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Star Header matching reference */}
        <StarDivider
          subtitle="Integritas & Keahlian"
          title="Dewan Pengarah & Komite Fatwa Halal"
        />

        {/* 4 Portrait Cards matching reference */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {SCHOLARS.map((person, idx) => {
            const Icon = person.icon;
            return (
              <div
                key={idx}
                className="bg-white rounded-3xl border border-slate-200/90 p-6 text-center space-y-4 shadow-sm hover:shadow-md hover:border-[#e5a952] transition-all flex flex-col items-center justify-between group"
              >
                {/* Photo Portrait Container with Rounded Top matching reference */}
                <div
                  className={`w-full h-44 rounded-2xl bg-gradient-to-b ${person.avatarBg} border border-slate-200/60 flex flex-col items-center justify-center p-4 relative overflow-hidden shadow-inner`}
                >
                  <div className="h-16 w-16 rounded-full bg-white/90 shadow-md flex items-center justify-center text-slate-800 mb-2">
                    <Icon className="h-8 w-8 text-[#b87d28]" />
                  </div>
                  <span className="text-[10px] font-bold text-slate-700 uppercase tracking-wider">
                    Sertifikasi Resmi BPJPH
                  </span>
                </div>

                {/* Social / Credibility Links */}
                <div className="flex items-center justify-center gap-3 text-[#0a4d3c] pt-1">
                  <span className="h-2 w-2 rounded-full bg-[#0a4d3c]" />
                  <span className="text-[11px] font-semibold text-slate-600">
                    Asesor Terverifikasi
                  </span>
                </div>

                {/* Name & Title */}
                <div className="space-y-1">
                  <h3 className="font-heading font-bold text-sm text-slate-900 leading-snug group-hover:text-[#b87d28] transition-colors">
                    {person.name}
                  </h3>
                  <p className="text-xs font-semibold text-[#b87d28]">
                    {person.role}
                  </p>
                  <p className="text-[11px] text-slate-500">{person.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
