import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Sparkles, ArrowRight } from "lucide-react";

export function WarmSubsidyGoalBanner() {
  const currentCount = 142500;
  const targetCount = 200000;
  const percentage = Math.round((currentCount / targetCount) * 100);

  return (
    <section className="py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="w-full bg-[#073b2d] text-white rounded-[32px] p-8 sm:p-14 text-center space-y-8 shadow-xl relative overflow-hidden">
          {/* Top Star Motif */}
          <div className="inline-flex items-center justify-center">
            <svg
              width="32"
              height="32"
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

          <div className="max-w-2xl mx-auto space-y-3">
            <h2 className="font-heading font-extrabold text-2xl sm:text-4xl text-white tracking-tight uppercase leading-tight">
              Program Sertifikasi Halal Gratis (SEHATI) 2026
            </h2>
            <p className="text-xs sm:text-sm text-emerald-100/90 leading-relaxed font-normal">
              Fasilitasi subsidi biaya sertifikasi halal 100% oleh Pemerintah RI
              bagi pelaku Usaha Mikro dan Kecil (UMK) yang memenuhi kriteria
              Self-Declare.
            </p>
          </div>

          {/* Progress Goal Bar matching reference */}
          <div className="max-w-xl mx-auto space-y-2">
            <div className="w-full bg-emerald-950/80 rounded-full h-3.5 p-0.5 border border-emerald-700/60 overflow-hidden">
              <div
                className="bg-gradient-to-r from-[#e5a952] to-[#f3cf8c] h-full rounded-full transition-all duration-500 shadow-sm"
                style={{ width: `${percentage}%` }}
              />
            </div>
            <div className="flex items-center justify-between text-xs font-semibold text-emerald-200 px-1">
              <span>Terserap: 142.500 Kuota</span>
              <span className="text-[#e5a952] font-bold">{percentage}% Kuota</span>
              <span>Target: 200.000 Kuota</span>
            </div>
          </div>

          {/* Action Button */}
          <div className="pt-2">
            <Link href="/register">
              <Button
                size="lg"
                className="h-12 px-8 rounded-xl bg-[#e5a952] hover:bg-[#d8983e] text-slate-950 font-bold text-sm shadow-lg transition-all"
              >
                Klaim Kuota Subsidi Usaha Anda <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
