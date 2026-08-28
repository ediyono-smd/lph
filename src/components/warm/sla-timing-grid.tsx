import React from "react";
import {
  FileText,
  Search,
  Building,
  Scale,
  Award,
  CheckCircle2,
} from "lucide-react";

const SLA_STEPS = [
  {
    name: "Registrasi Usaha",
    time: "Instan",
    subtext: "NIB 13 Digit & Penyelia",
    icon: FileText,
    accent: "#b87d28",
  },
  {
    name: "Verifikasi Berkas",
    time: "1-2 Hari",
    subtext: "Desk Audit Dokumen",
    icon: Search,
    accent: "#e5a952",
  },
  {
    name: "Audit Lapangan",
    time: "3 Hari",
    subtext: "Pemeriksaan Fisik LPH",
    icon: Building,
    accent: "#0a4d3c",
  },
  {
    name: "Sidang Fatwa",
    time: "3 Hari",
    subtext: "Penetapan Kehalalan",
    icon: Scale,
    accent: "#b87d28",
  },
  {
    name: "SK Penetapan",
    time: "2 Hari",
    subtext: "Penerbitan Keputusan",
    icon: Award,
    accent: "#e5a952",
  },
  {
    name: "Terbit Sertifikat",
    time: "1 Hari",
    subtext: "Digital QR Code Aktif",
    icon: CheckCircle2,
    accent: "#073b2d",
  },
];

export function SlaTimingGrid() {
  return (
    <section className="py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {/* Header matching reference */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200/80 pb-4">
          <div>
            <h2 className="font-heading font-bold text-2xl text-slate-900">
              Standar Waktu Layanan (SLA) Sertifikasi
            </h2>
            <p className="text-xs text-slate-500">
              Target penyelesaian transparan pada setiap tahapan permohonan sertifikat halal.
            </p>
          </div>

          <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#b87d28] bg-[#fbf3e6] px-3.5 py-1.5 rounded-full border border-[#edd7b6]">
            <span>Total SLA: 14 Hari Kerja</span>
          </div>
        </div>

        {/* 6 Square Timing Cards matching reference */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {SLA_STEPS.map((step, idx) => {
            const Icon = step.icon;
            return (
              <div
                key={idx}
                className="bg-white rounded-2xl border border-slate-200/90 p-5 text-center flex flex-col items-center justify-between space-y-3 shadow-sm hover:shadow-md hover:border-[#e5a952] transition-all group"
              >
                {/* Top Icon with soft yellow glow */}
                <div className="h-12 w-12 rounded-xl bg-[#fbf6ec] group-hover:bg-[#f5e6cc] flex items-center justify-center text-[#b87d28] transition-colors">
                  <Icon className="h-6 w-6" />
                </div>

                {/* Main Timing Info */}
                <div className="space-y-0.5">
                  <h3 className="font-heading font-bold text-xs text-slate-800 group-hover:text-[#b87d28] transition-colors">
                    {step.name}
                  </h3>
                  <div className="font-heading font-extrabold text-lg text-slate-900">
                    {step.time}
                  </div>
                  <p className="text-[10px] text-slate-500">{step.subtext}</p>
                </div>

                {/* Bottom Circular Indicator */}
                <div className="h-2 w-2 rounded-full border-2 border-[#e5a952] bg-white group-hover:bg-[#e5a952] transition-colors" />
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
