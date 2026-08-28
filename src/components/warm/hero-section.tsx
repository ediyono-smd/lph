import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { MapPin, ArrowRight, QrCode } from "lucide-react";
import { HalalLogo } from "@/components/brand/halal-logo";

export function WarmHeroSection() {
  return (
    <section className="relative pt-10 pb-16 sm:pb-24 overflow-hidden">
      {/* Background Soft Glow */}
      <div className="absolute right-0 top-0 w-[500px] h-[500px] bg-[#f5dfb8]/30 rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Text & CTAs (7 Cols) */}
          <div className="lg:col-span-7 space-y-6">
            {/* Top Location Pill Badge matching reference */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#f3ece0] border border-[#e8dac5] text-xs text-slate-800 font-medium shadow-sm">
              <MapPin className="h-3.5 w-3.5 text-[#b87d28]" />
              <span>Badan Penyelenggara Jaminan Produk Halal (BPJPH) RI</span>
            </div>

            {/* Subheading with script feel */}
            <div className="space-y-1">
              <p className="text-sm font-semibold tracking-widest text-[#b87d28] uppercase">
                Kepastian • Syariat • Berkah Usaha
              </p>
              <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.12]">
                Sertifikasi Halal Terpadu di{" "}
                <span className="text-[#b87d28] block sm:inline">SIP-HALAL</span>
              </h1>
            </div>

            {/* Description */}
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-xl font-normal">
              Platform resmi layanan pendaftaran mandiri (Self-Declare), audit
              pemeriksaan reguler LPH, sidang fatwa, hingga penerbitan Sertifikat
              Halal digital ber-QR Code untuk seluruh pelaku usaha Indonesia.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-3.5 pt-2">
              <Link href="/register">
                <Button
                  size="lg"
                  className="h-12 px-8 rounded-xl bg-[#e5a952] hover:bg-[#d8983e] text-slate-950 font-bold text-sm shadow-md transition-all"
                >
                  Ajukan Sertifikasi Sekarang <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </Link>
              <Link href="/verify">
                <Button
                  variant="outline"
                  size="lg"
                  className="h-12 px-6 rounded-xl border-slate-300 hover:border-[#b87d28] hover:bg-[#f7efe1] text-slate-800 font-semibold text-sm transition-all"
                >
                  <QrCode className="h-4 w-4 mr-2 text-[#b87d28]" />
                  Cek Sertifikat (QR)
                </Button>
              </Link>
            </div>
          </div>

          {/* Right Column: Mosque Architecture Graphic with Official Halal Logo (5 Cols) */}
          <div className="lg:col-span-5 flex justify-center lg:justify-end">
            <div className="relative w-full max-w-md">
              {/* Decorative Arch Container */}
              <div className="relative h-[380px] sm:h-[420px] rounded-t-[180px] rounded-b-3xl bg-gradient-to-b from-[#f3e3ca] via-[#f7ecd9] to-[#fbf8f2] p-4 border-2 border-[#e8d5b8] shadow-lg flex flex-col items-center justify-center text-center overflow-hidden">
                {/* Islamic Geometric Silhouette */}
                <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#b87d28_1px,transparent_1px)] [background-size:16px_16px]" />

                {/* Central Emblem */}
                <div className="relative z-10 space-y-4">
                  <div className="h-32 w-32 rounded-3xl bg-white/90 backdrop-blur-md border border-[#e5a952]/50 flex items-center justify-center mx-auto shadow-lg p-3">
                    <HalalLogo size={84} />
                  </div>
                  <div className="space-y-1">
                    <h3 className="font-heading font-extrabold text-xl text-slate-900 tracking-tight">
                      HALAL INDONESIA
                    </h3>
                    <p className="text-xs text-slate-600 font-medium max-w-[220px] mx-auto">
                      Standar Kepatuhan Resmi BPJPH & Komite Fatwa Halal
                    </p>
                  </div>

                  <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#073b2d] text-[#e5a952] text-[11px] font-extrabold shadow">
                    <span>✓ Terintegrasi 100% Digital</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
