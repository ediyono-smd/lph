import React from "react";
import Link from "next/link";
import {
  QrCode,
  MapPin,
  Phone,
  Mail,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { HalalLogo } from "@/components/brand/halal-logo";

export function PublicNavbar() {
  return (
    <header className="sticky top-0 z-40 bg-[#fcfaf6]/95 backdrop-blur-md border-b border-[#ebd7ba]/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Official Halal Indonesia Brand Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <HalalLogo size={36} />
          <div>
            <span className="font-heading font-extrabold text-lg text-slate-900 tracking-tight block leading-tight">
              SIP-HALAL
            </span>
            <span className="block text-[9px] uppercase font-bold tracking-widest text-[#b87d28]">
              Halal Indonesia
            </span>
          </div>
        </Link>

        {/* Navigation Links */}
        <nav className="hidden md:flex items-center gap-7 text-xs font-semibold text-slate-700">
          <Link href="/" className="text-[#b87d28] font-bold hover:text-slate-900 transition-colors">
            Beranda
          </Link>
          <Link href="/layanan" className="hover:text-[#b87d28] transition-colors">
            Skema Layanan
          </Link>
          <Link href="/alur" className="hover:text-[#b87d28] transition-colors">
            Alur Sertifikasi
          </Link>
          <Link href="/faq" className="hover:text-[#b87d28] transition-colors">
            Panduan & FAQ
          </Link>
          <Link href="/tentang" className="hover:text-[#b87d28] transition-colors">
            Tentang Kami
          </Link>
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-2.5">
          <Link href="/verify">
            <Button
              variant="outline"
              size="sm"
              className="h-9 px-3.5 rounded-xl border-[#d8c5aa] bg-white hover:bg-[#f5ecdc] text-slate-900 text-xs font-semibold shadow-sm"
            >
              <QrCode className="h-3.5 w-3.5 mr-1.5 text-[#b87d28]" />
              Cek Sertifikat (QR)
            </Button>
          </Link>

          <Link href="/login">
            <Button
              size="sm"
              className="h-9 px-4 rounded-xl bg-[#e5a952] hover:bg-[#d8983e] text-slate-950 font-bold text-xs shadow-sm transition-all"
            >
              Ajukan Sertifikasi
            </Button>
          </Link>
        </div>
      </div>
    </header>
  );
}

export function PublicFooter() {
  return (
    <footer className="bg-[#05291f] text-white pt-14 pb-10 border-t border-[#0a4d3c] relative overflow-hidden">
      {/* Subtle Islamic Motif */}
      <div className="absolute right-0 bottom-0 opacity-[0.03] pointer-events-none translate-x-12 translate-y-12">
        <svg width="350" height="350" viewBox="0 0 100 100" fill="currentColor">
          <circle cx="50" cy="50" r="45" stroke="#e5a952" strokeWidth="2" fill="none" />
          <polygon points="50,5 61,38 95,38 68,58 79,91 50,71 21,91 32,58 5,38 39,38" fill="#e5a952" />
        </svg>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 text-xs">
          {/* Col 1: Brand & Profile (4 cols) */}
          <div className="md:col-span-4 space-y-4">
            <div className="flex items-center gap-3">
              <div className="bg-white/10 p-1.5 rounded-2xl backdrop-blur-sm border border-emerald-700/50 flex items-center justify-center">
                <HalalLogo size={36} />
              </div>
              <div>
                <span className="font-heading font-extrabold text-lg text-white block leading-tight">
                  SIP-HALAL INDONESIA
                </span>
                <span className="block text-[10px] uppercase font-bold tracking-widest text-[#e5a952]">
                  Badan Penyelenggara Jaminan Produk Halal
                </span>
              </div>
            </div>

            <p className="text-emerald-100/80 leading-relaxed max-w-sm font-normal">
              Sistem Informasi Terpadu Sertifikasi Halal resmi Republik Indonesia.
              Mendukung kepatuhan Undang-Undang Jaminan Produk Halal secara digital,
              akuntabel, dan transparan.
            </p>

            <div className="flex items-center gap-2.5 text-emerald-200">
              <span className="h-2 w-2 rounded-full bg-[#e5a952]" />
              <span className="text-[11px] font-medium">Layanan Digital Terpadu 24/7</span>
            </div>
          </div>

          {/* Col 2: Services (2 cols) */}
          <div className="md:col-span-2 space-y-3">
            <h4 className="font-bold text-[#e5a952] uppercase text-[11px] tracking-wider">
              Layanan
            </h4>
            <ul className="space-y-2 text-emerald-100/80 font-normal">
              <li><Link href="/layanan" className="hover:text-white transition-colors">Self-Declare (UMKM)</Link></li>
              <li><Link href="/layanan" className="hover:text-white transition-colors">Skema Reguler (LPH)</Link></li>
              <li><Link href="/verify" className="hover:text-white transition-colors">Verifikasi Sertifikat</Link></li>
              <li><Link href="/alur" className="hover:text-white transition-colors">Alur 6 Tahapan</Link></li>
            </ul>
          </div>

          {/* Col 3: Quick Links (2 cols) */}
          <div className="md:col-span-2 space-y-3">
            <h4 className="font-bold text-[#e5a952] uppercase text-[11px] tracking-wider">
              Panduan
            </h4>
            <ul className="space-y-2 text-emerald-100/80 font-normal">
              <li><Link href="/faq" className="hover:text-white transition-colors">Tanya Jawab (FAQ)</Link></li>
              <li><Link href="/alur" className="hover:text-white transition-colors">Manual SJPH</Link></li>
              <li><Link href="/tentang" className="hover:text-white transition-colors">Komite Fatwa</Link></li>
              <li><Link href="/tentang" className="hover:text-white transition-colors">Struktur Organisasi</Link></li>
            </ul>
          </div>

          {/* Col 4: Address & Contact (4 cols) */}
          <div className="md:col-span-4 space-y-3">
            <h4 className="font-bold text-[#e5a952] uppercase text-[11px] tracking-wider">
              Alamat Kantor & Kontak
            </h4>
            <div className="space-y-2.5 text-emerald-100/80 font-normal text-[11px]">
              <p className="flex items-start gap-2">
                <MapPin className="h-4 w-4 text-[#e5a952] shrink-0 mt-0.5" />
                <span>Gedung BPJPH, Jl. Raya Pondok Gede No.13, Jakarta Timur</span>
              </p>
              <p className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-[#e5a952] shrink-0" />
                <span>(021) 8063-0123 / 0812-8888-HALAL</span>
              </p>
              <p className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-[#e5a952] shrink-0" />
                <span>layanan@halal.go.id / info@halal.go.id</span>
              </p>
            </div>
          </div>
        </div>

        <div className="border-t border-emerald-900/60 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-emerald-300/70 font-normal">
          <p>&copy; 2026 SIP-HALAL Republik Indonesia. Seluruh Hak Cipta Dilindungi.</p>
          <div className="flex gap-4 mt-2 sm:mt-0 text-[11px]">
            <Link href="/tentang" className="hover:text-[#e5a952] transition-colors">Syarat & Ketentuan</Link>
            <span>•</span>
            <Link href="/tentang" className="hover:text-[#e5a952] transition-colors">Kebijakan Privasi</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
