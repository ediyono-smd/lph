import React from "react";
import Link from "next/link";
import { getSession } from "@/lib/auth/session";
import { requireRole } from "@/lib/permissions/rbac";
import { UserCheck } from "lucide-react";
import { UserAccountNav } from "@/components/dashboard/user-account-nav";
import { HalalLogo } from "@/components/brand/halal-logo";

export default async function MentorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await requireRole(["SUPER_ADMIN", "MENTOR"]);

  return (
    <div className="min-h-screen flex bg-[#fcfaf6]">
      {/* Sticky Fixed Sidebar */}
      <aside className="w-64 bg-white text-slate-900 flex flex-col justify-between shrink-0 border-r border-[#ebd7ba]/90 h-screen sticky top-0 z-30 shadow-sm overflow-y-auto">
        <div>
          <div className="h-16 flex items-center px-4 gap-2.5 border-b border-[#ebd7ba]/80 bg-white/95 backdrop-blur-md sticky top-0 z-20">
            <HalalLogo size={36} />
            <div>
              <span className="font-heading font-extrabold text-base tracking-tight text-slate-900 block leading-tight">
                SIP-HALAL
              </span>
              <span className="block text-[10px] uppercase font-bold tracking-widest text-[#b87d28]">
                Pendamping PPH
              </span>
            </div>
          </div>

          <div className="p-3.5 space-y-1">
            <p className="px-3 text-[10px] font-bold uppercase tracking-wider text-[#b87d28] mb-1.5">
              Menu Pendamping
            </p>
            <Link
              href="/mentor/penugasan"
              className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold bg-[#073b2d] text-white shadow-sm"
            >
              <UserCheck className="h-4 w-4 text-[#e5a952] shrink-0" />
              <span>Daftar Penugasan UMKM</span>
            </Link>
          </div>
        </div>
      </aside>

      {/* Main Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-16 border-b border-[#ebd7ba]/80 bg-white px-3 sm:px-4 flex items-center justify-between sticky top-0 z-20 shadow-sm">
          <h2 className="text-sm font-bold text-slate-900">
            Panel Pendamping Proses Produk Halal (PPH)
          </h2>
          <div className="flex items-center gap-4">
            <UserAccountNav
              user={{
                fullName: session.fullName,
                email: session.email,
                activeRole: session.activeRole,
              }}
            />
          </div>
        </header>
        <main className="flex-1 px-3 sm:px-4 py-3.5 w-full">
          {children}
        </main>
      </div>
    </div>
  );
}
