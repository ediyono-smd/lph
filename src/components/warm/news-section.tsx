import React from "react";
import Link from "next/link";
import { StarDivider } from "./star-divider";
import { MessageSquare, Calendar, User, ArrowRight, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";

const NEWS = [
  {
    title: "Pemberlakuan Wajib Sertifikasi Halal Tahap 1 untuk Seluruh Produk Mamin",
    desc: "Kewajiban kepemilikan sertifikat halal resmi bagi seluruh produk makanan dan minuman yang beredar di wilayah Republik Indonesia.",
    date: "25 Agu 2026",
    comments: "18 Komentar",
    author: "Tim Regulasi BPJPH",
    badge: "Regulasi",
    bgPattern: "from-[#faeedb] to-[#f4deb8]",
  },
  {
    title: "Panduan Lengkap Penyusunan Manual SJPH Sederhana untuk Pelaku UMKM",
    desc: "Langkah mudah menyusun komitmen kebijakan halal, daftar bahan baku, dan prosedur pembersihan fasilitas bagi usaha skala rumahan.",
    date: "22 Agu 2026",
    comments: "34 Komentar",
    author: "Asesor Teknis",
    badge: "Panduan",
    bgPattern: "from-[#e4ede6] to-[#cbe0cf]",
  },
  {
    title: "Mengenal Titik Kritis Kehalalan pada Bahan Tambahan Pangan (BTP)",
    desc: "Memahami status kehalalan emulsifier, gelatin, perisa, dan enzim yang sering digunakan dalam industri pengolahan makanan modern.",
    date: "18 Agu 2026",
    comments: "12 Komentar",
    author: "Laboratorium LPH",
    badge: "Edukasi",
    bgPattern: "from-[#f9e9de] to-[#f3d3bd]",
  },
];

export function WarmNewsSection() {
  return (
    <section className="py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Star Header matching reference */}
        <StarDivider
          subtitle="Informasi & Edukasi"
          title="Publikasi & Regulasi Halal Terkini"
        />

        {/* 3 Blog Cards matching reference */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {NEWS.map((item, idx) => (
            <div
              key={idx}
              className="bg-white rounded-3xl border border-slate-200/90 overflow-hidden shadow-sm hover:shadow-md hover:border-[#e5a952] transition-all flex flex-col justify-between group"
            >
              {/* Photo / Graphic Thumbnail Header */}
              <div
                className={`h-48 bg-gradient-to-br ${item.bgPattern} p-6 flex flex-col justify-between border-b border-slate-100 relative overflow-hidden`}
              >
                <span className="px-3 py-1 rounded-full bg-white/90 text-[10px] font-bold text-slate-800 w-fit shadow-sm">
                  {item.badge}
                </span>

                <div className="flex items-center justify-between text-xs text-slate-700 font-medium">
                  <span className="flex items-center gap-1">
                    <Calendar className="h-3.5 w-3.5 text-[#b87d28]" />
                    {item.date}
                  </span>
                  <span className="flex items-center gap-1">
                    <MessageSquare className="h-3.5 w-3.5 text-[#b87d28]" />
                    {item.comments}
                  </span>
                </div>
              </div>

              {/* Content Body */}
              <div className="p-6 space-y-3 flex-1 flex flex-col justify-between">
                <div className="space-y-2">
                  <h3 className="font-heading font-bold text-base text-slate-900 leading-snug group-hover:text-[#b87d28] transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed font-normal">
                    {item.desc}
                  </p>
                </div>

                {/* Author Avatar & Read More Button matching reference */}
                <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="h-7 w-7 rounded-full bg-[#fbf5eb] border border-[#ebd7ba] flex items-center justify-center text-[#b87d28]">
                      <User className="h-4 w-4" />
                    </div>
                    <span className="text-xs font-semibold text-slate-700">
                      {item.author}
                    </span>
                  </div>

                  <Link href="/faq">
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-8 rounded-xl border-slate-200 hover:border-[#b87d28] hover:bg-[#faeedb] text-slate-900 text-xs font-bold"
                    >
                      Baca Artikel <ArrowRight className="h-3 w-3 ml-1" />
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
