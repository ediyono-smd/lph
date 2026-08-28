import React from "react";
import { Button } from "@/components/ui/button";

export function WarmNewsletterCta() {
  return (
    <section className="bg-[#073b2d] text-white py-14 border-b border-[#0a4d3c] relative overflow-hidden">
      {/* Background Islamic Pattern */}
      <div className="absolute inset-0 opacity-5 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:16px_16px]" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6 relative z-10">
        {/* Star Motif */}
        <div className="inline-flex items-center justify-center">
          <svg
            width="28"
            height="28"
            viewBox="0 0 24 24"
            fill="none"
            className="text-[#e5a952]"
          >
            <path
              d="M12 2L14.5 7.5L20 8.5L16 13L17 19L12 16L7 19L8 13L4 8.5L9.5 7.5L12 2Z"
              fill="currentColor"
            />
            <circle cx="12" cy="12" r="3" fill="#ffffff" />
          </svg>
        </div>

        <div className="space-y-1.5">
          <h2 className="font-heading font-extrabold text-2xl sm:text-3xl text-white tracking-tight">
            Berlangganan Buletin Regulasi Halal Indonesia
          </h2>
          <p className="text-xs sm:text-sm text-emerald-200/90 font-normal max-w-lg mx-auto">
            Dapatkan informasi berkala seputar kuota sertifikasi gratis, jadwal
            sidang fatwa, dan pembaruan regulasi langsung ke email Anda.
          </p>
        </div>

        {/* Input Form matching reference */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-2 max-w-md mx-auto pt-2">
          <input
            type="email"
            placeholder="Masukkan alamat email aktif Anda..."
            className="w-full sm:flex-1 h-11 px-4 rounded-xl bg-white text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#e5a952] placeholder:text-slate-400"
          />
          <Button
            type="button"
            className="w-full sm:w-auto h-11 px-6 rounded-xl bg-[#e5a952] hover:bg-[#d8983e] text-slate-950 font-bold text-xs shadow-sm transition-all"
          >
            Berlangganan
          </Button>
        </div>
      </div>
    </section>
  );
}
