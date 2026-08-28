"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  FileCheck2,
  UserCog,
  Award,
  Database,
  Users,
  ScrollText,
  Layers,
  MapPin,
  BarChart3,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { HalalLogo } from "@/components/brand/halal-logo";

const ADMIN_NAV_ITEMS = [
  {
    title: "Executive Dashboard",
    href: "/admin",
    icon: LayoutDashboard,
  },
  {
    title: "Antrean Pengajuan",
    href: "/admin/pengajuan",
    icon: FileCheck2,
  },
  {
    title: "Alokasi Penugasan",
    href: "/admin/penugasan",
    icon: UserCog,
  },
  {
    title: "Sertifikat Halal",
    href: "/admin/sertifikat",
    icon: Award,
  },
  {
    title: "Laporan & Statistik",
    href: "/admin/laporan",
    icon: BarChart3,
  },
];

const MASTER_DATA_ITEMS = [
  {
    title: "Kategori Produk",
    href: "/admin/master/kategori-produk",
    icon: Layers,
  },
  {
    title: "Kategori Bahan",
    href: "/admin/master/kategori-bahan",
    icon: Database,
  },
  {
    title: "Master Wilayah",
    href: "/admin/master/wilayah",
    icon: MapPin,
  },
];

const SYSTEM_NAV_ITEMS = [
  {
    title: "Manajemen Pengguna",
    href: "/admin/users",
    icon: Users,
  },
  {
    title: "Audit Trail Log",
    href: "/admin/audit-log",
    icon: ScrollText,
  },
];

export function AdminSidebar() {
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
              Admin & Verifikator
            </span>
          </div>
        </div>

        {/* Navigation Items */}
        <div className="p-3 space-y-4">
          {/* Main Navigation */}
          <div className="space-y-0.5">
            <p className="px-3 text-[10px] font-bold uppercase tracking-wider text-[#b87d28] mb-1.5">
              Menu Utama
            </p>
            {ADMIN_NAV_ITEMS.map((item) => {
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

          {/* Master Data */}
          <div className="space-y-0.5">
            <p className="px-3 text-[10px] font-bold uppercase tracking-wider text-[#b87d28] mb-1.5">
              Master Data
            </p>
            {MASTER_DATA_ITEMS.map((item) => {
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

          {/* System & Security */}
          <div className="space-y-0.5">
            <p className="px-3 text-[10px] font-bold uppercase tracking-wider text-[#b87d28] mb-1.5">
              Sistem & Keamanan
            </p>
            {SYSTEM_NAV_ITEMS.map((item) => {
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
      </div>
    </aside>
  );
}
