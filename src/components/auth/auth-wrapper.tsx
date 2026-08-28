import React from "react";
import Link from "next/link";
import { HalalLogo } from "@/components/brand/halal-logo";

export function AuthWrapper({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-[#fcfaf6]">
      {/* Left Banner: Branding & Halal Identity */}
      <div className="hidden lg:flex flex-col justify-between bg-gradient-to-b from-[#05291f] via-[#073b2d] to-[#041e17] text-white p-12 relative overflow-hidden border-r border-emerald-900/50">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#e5a952_1px,transparent_1px)] [background-size:20px_20px]" />
        
        <div className="relative z-10">
          <Link href="/" className="flex items-center gap-3">
            <div className="bg-white/10 p-2 rounded-2xl backdrop-blur-sm border border-emerald-700/50 flex items-center justify-center">
              <HalalLogo size={42} />
            </div>
            <div>
              <span className="font-heading font-extrabold text-xl tracking-tight text-white block leading-tight">
                SIP-HALAL INDONESIA
              </span>
              <p className="text-xs text-[#e5a952] font-semibold">
                Sistem Informasi Terpadu Sertifikasi Halal
              </p>
            </div>
          </Link>
        </div>

        <div className="relative z-10 space-y-6 max-w-md">
          <div className="inline-flex items-center gap-2 rounded-full bg-emerald-950/80 border border-[#e5a952]/40 px-3.5 py-1.5 text-xs text-[#e5a952] font-bold shadow-inner">
            <span className="h-2 w-2 rounded-full bg-[#e5a952] animate-pulse" />
            Layanan Digital Sertifikasi Halal Resmi Republik Indonesia
          </div>
          <h1 className="font-heading text-3xl font-extrabold leading-tight text-white">
            Digitalisasi Sertifikasi Halal Terpercaya, Cepat, dan Akuntabel.
          </h1>
          <p className="text-sm text-emerald-100/80 leading-relaxed font-normal">
            Terhubung langsung dengan Auditor LPH, Pendamping PPH, dan Komite
            Fatwa untuk penerbitan sertifikat halal ber-QR Code resmi.
          </p>
        </div>

        <div className="relative z-10 text-xs text-emerald-300/60 font-medium">
          &copy; 2026 SIP-HALAL Indonesia. Seluruh Hak Cipta Dilindungi.
        </div>
      </div>

      {/* Right Column: Form Container */}
      <div className="flex items-center justify-center p-6 sm:p-12">
        <div className="w-full max-w-md space-y-6">
          {/* Mobile Header */}
          <div className="lg:hidden text-center space-y-2">
            <Link href="/" className="inline-flex items-center gap-2.5">
              <HalalLogo size={36} />
              <div className="text-left">
                <span className="font-heading font-extrabold text-lg text-slate-900 block leading-tight">
                  SIP-HALAL
                </span>
                <span className="block text-[9px] uppercase font-bold tracking-widest text-[#b87d28]">
                  Halal Indonesia
                </span>
              </div>
            </Link>
          </div>

          {children}
        </div>
      </div>
    </div>
  );
}
