"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Building2,
  Package,
  FlaskConical,
  FileSpreadsheet,
  AlertTriangle,
  Award,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { HalalLogo } from "@/components/brand/halal-logo";

const BUSINESS_NAV_ITEMS = [
  {
    title: "Dashboard Usaha",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Profil Usaha (NIB)",
    href: "/dashboard/profil-usaha",
    icon: Building2,
  },
  {
    title: "Katalog Bahan Baku",
    href: "/dashboard/bahan",
    icon: FlaskConical,
  },
  {
    title: "Katalog Produk & BOM",
    href: "/dashboard/produk",
    icon: Package,
  },
  {
    title: "Pengajuan Sertifikasi",
    href: "/dashboard/pengajuan",
    icon: FileSpreadsheet,
  },
  {
    title: "Kotak Perbaikan",
    href: "/dashboard/perbaikan",
    icon: AlertTriangle,
  },
  {
    title: "Sertifikat Halal",
    href: "/dashboard/sertifikat",
    icon: Award,
  },
];

export function BusinessSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-white text-slate-900 flex flex-col justify-between shrink-0 border-r border-[#ebd7ba]/90 h-screen sticky top-0 z-30 shadow-sm overflow-y-auto">
      <div>
        {/* Fixed / Sticky Brand Header with Official Halal Logo */}
        <div className="h-16 flex items-center px-4 gap-2.5 border-b border-[#ebd7ba]/80 bg-white/95 backdrop-blur-md sticky top-0 z-20">
          <HalalLogo size={36} />
          <div>
            <span className="font-heading font-extrabold text-base tracking-tight text-slate-900 block leading-tight">
              SIP-HALAL
            </span>
            <span className="block text-[10px] uppercase font-bold tracking-widest text-[#b87d28]">
              Portal Pelaku Usaha
            </span>
          </div>
        </div>

        {/* Navigation Items */}
        <div className="p-3 space-y-1">
          <p className="px-3 text-[10px] font-bold uppercase tracking-wider text-[#b87d28] mb-1.5">
            Menu Usaha
          </p>
          {BUSINESS_NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all",
                  isActive
                    ? "bg-[#073b2d] text-white font-bold shadow-sm"
                    : "text-slate-700 hover:bg-[#fbf5eb] hover:text-[#073b2d]"
                )}
              >
                <Icon
                  className={cn(
                    "h-4 w-4 shrink-0",
                    isActive ? "text-[#e5a952]" : "text-[#b87d28]"
                  )}
                />
                <span>{item.title}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </aside>
  );
}
