import React from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight, BookOpen, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const EVENTS = [
  {
    date: "28 Agu",
    day: "Jumat",
    title: "Sidang Fatwa Penetapan Kehalalan Produk Makanan & Minuman Batch VIII",
    location: "Gedung Pusat Komite Fatwa Halal Indonesia, Jakarta",
    href: "/alur",
  },
  {
    date: "02 Sep",
    day: "Senin",
    title: "Pelatihan Kompetensi & Sertifikasi Penyelia Halal UMKM Kuliner",
    location: "Pusat Diklat Terpadu & Pembelajaran Daring",
    href: "/alur",
  },
  {
    date: "05 Sep",
    day: "Kamis",
    title: "Sosialisasi Akselerasi 1 Juta Kuota Sertifikat Halal Gratis (SEHATI)",
    location: "Auditorium BPJPH & Live Streaming Resmi",
    href: "/layanan",
  },
];

export function WarmEventsSection() {
  return (
    <section className="py-14">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {/* Header with "Show All" matching reference */}
        <div className="flex items-center justify-between">
          <h2 className="font-heading font-extrabold text-2xl sm:text-3xl text-slate-900 tracking-tight">
            Agenda Sidang Fatwa & Pelatihan Halal
          </h2>
          <Link href="/faq">
            <span className="text-xs font-bold text-[#b87d28] hover:text-[#915e16] transition-colors inline-flex items-center gap-1">
              Lihat Semua Agenda <ArrowRight className="h-3.5 w-3.5" />
            </span>
          </Link>
        </div>

        {/* Split Grid matching reference */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: 3 Event Cards (8 Cols) */}
          <div className="lg:col-span-8 space-y-3.5">
            {EVENTS.map((item, idx) => (
              <div
                key={idx}
                className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-sm hover:border-[#e5a952] hover:shadow-md transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                {/* Date Column */}
                <div className="flex items-center gap-4">
                  <div className="text-left sm:text-center w-16 shrink-0 bg-[#fbf5eb] p-2.5 rounded-xl border border-[#ebd7ba]">
                    <span className="font-heading font-extrabold text-sm text-slate-900 block leading-tight">
                      {item.date}
                    </span>
                    <span className="text-[11px] font-semibold text-[#b87d28] block">
                      {item.day}
                    </span>
                  </div>

                  {/* Title & Location Column */}
                  <div className="space-y-1">
                    <h3 className="font-heading font-bold text-sm text-slate-900 hover:text-[#b87d28] transition-colors leading-tight">
                      {item.title}
                    </h3>
                    <p className="text-xs text-slate-500">{item.location}</p>
                  </div>
                </div>

                {/* View Details Warm Gold Button */}
                <Link href={item.href} className="shrink-0 self-end sm:self-center">
                  <Button
                    size="sm"
                    className="h-8 px-4 rounded-xl bg-[#e5a952] hover:bg-[#d8983e] text-slate-950 font-bold text-xs shadow-sm"
                  >
                    Lihat Rincian
                  </Button>
                </Link>
              </div>
            ))}
          </div>

          {/* Right Column: Featured Educational Card (4 Cols) */}
          <div className="lg:col-span-4 flex flex-col justify-between rounded-2xl bg-[#fbf6ec] border border-[#ecd9be] p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#b87d28] uppercase tracking-wider">
                Edukasi Pilihan
              </span>
              <div className="flex items-center gap-1.5 text-xs text-slate-600 font-semibold">
                <button className="h-6 w-6 rounded-full border border-slate-300 flex items-center justify-center hover:bg-white transition-colors">
                  <ChevronLeft className="h-3.5 w-3.5 text-slate-700" />
                </button>
                <span className="text-[11px] px-1 text-slate-800">4 / 1</span>
                <button className="h-6 w-6 rounded-full border border-slate-300 flex items-center justify-center hover:bg-white transition-colors">
                  <ChevronRight className="h-3.5 w-3.5 text-slate-700" />
                </button>
              </div>
            </div>

            {/* Visual Card */}
            <div className="space-y-3 flex-1">
              <div className="h-44 rounded-xl bg-gradient-to-br from-[#073b2d] to-[#0d5945] p-5 text-white flex flex-col justify-between shadow-inner relative overflow-hidden">
                <div className="inline-block px-2.5 py-1 rounded-full bg-[#e5a952] text-[10px] font-bold text-slate-950 w-fit">
                  Panduan SJPH 2026
                </div>
                <div className="space-y-1 relative z-10">
                  <h4 className="font-heading font-extrabold text-base text-white leading-tight">
                    10 Kesalahan Umum Pelaku UMKM dalam Mengisi Dokumen Halal
                  </h4>
                  <p className="text-[11px] text-emerald-100 line-clamp-2">
                    Hindari penolakan berkas dengan memahami cara melampirkan sertifikat bahan supplier.
                  </p>
                </div>
              </div>

              <p className="text-xs text-slate-700 leading-relaxed font-normal">
                Pastikan dokumen legalitas NIB dan daftar bahan baku Anda telah lengkap
                sebelum mengajukan permohonan ke verifikator.
              </p>
            </div>

            <Link href="/alur">
              <Button
                variant="outline"
                className="w-full h-9 rounded-xl border-[#b87d28] text-slate-900 hover:bg-[#faeedb] text-xs font-bold"
              >
                Baca Artikel Panduan <ArrowRight className="h-3.5 w-3.5 ml-1.5" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
