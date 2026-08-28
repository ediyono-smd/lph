"use client";

import React, { useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Settings,
  Shield,
  LogOut,
  ChevronDown,
  Building2,
  Loader2,
} from "lucide-react";
import { logoutAction } from "@/actions/auth.actions";
import { toast } from "sonner";

interface UserAccountNavProps {
  user: {
    fullName: string;
    email: string;
    activeRole: string;
  };
}

export function UserAccountNav({ user }: UserAccountNavProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleLogout = () => {
    startTransition(async () => {
      await logoutAction();
      toast.success("Berhasil keluar sesi.");
      router.push("/login");
      router.refresh();
    });
  };

  const isBusinessOwner = user.activeRole === "BUSINESS_OWNER";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          className="flex items-center gap-2.5 pl-2.5 pr-2 py-1 rounded-2xl hover:bg-[#fbf5eb] border border-transparent hover:border-[#ebd7ba] transition-all outline-none group"
          disabled={isPending}
        >
          {/* Avatar Icon */}
          <div className="h-9 w-9 rounded-xl bg-[#073b2d] flex items-center justify-center text-[#e5a952] font-extrabold text-xs shadow-sm group-hover:scale-105 transition-transform shrink-0">
            {user.fullName?.charAt(0)?.toUpperCase() || "U"}
          </div>

          {/* User Info Label */}
          <div className="text-left hidden sm:block">
            <p className="text-xs font-bold text-slate-900 leading-tight">
              {user.fullName || "Pengguna"}
            </p>
            <span className="text-[10px] text-[#b87d28] font-bold tracking-wider uppercase">
              {user.activeRole?.replace("_", " ")}
            </span>
          </div>

          <ChevronDown className="h-3.5 w-3.5 text-slate-400 group-hover:text-slate-700 transition-colors ml-0.5" />
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-64 p-2 shadow-xl border-[#ebd7ba]">
        {/* User Card Header in Dropdown */}
        <div className="p-3 bg-[#fbf8f2] rounded-xl border border-[#ebd7ba]/80 space-y-1 mb-1">
          <p className="font-heading font-extrabold text-xs text-slate-900 leading-tight">
            {user.fullName}
          </p>
          <p className="text-[11px] text-slate-500 truncate font-normal">
            {user.email}
          </p>
          <div className="pt-1">
            <span className="inline-block px-2 py-0.5 rounded-full bg-[#073b2d] text-[#e5a952] text-[9px] font-extrabold uppercase tracking-wider">
              {user.activeRole?.replace("_", " ")}
            </span>
          </div>
        </div>

        <DropdownMenuSeparator />

        {/* Profile Settings */}
        {isBusinessOwner ? (
          <DropdownMenuItem asChild>
            <Link
              href="/dashboard/profil-usaha"
              className="flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-slate-700 hover:text-slate-950"
            >
              <Building2 className="h-4 w-4 text-[#b87d28]" />
              <span>Pengaturan Profil Usaha</span>
            </Link>
          </DropdownMenuItem>
        ) : (
          <DropdownMenuItem asChild>
            <Link
              href="/admin/users"
              className="flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-slate-700 hover:text-slate-950"
            >
              <Settings className="h-4 w-4 text-[#b87d28]" />
              <span>Pengaturan Akun & Petugas</span>
            </Link>
          </DropdownMenuItem>
        )}

        <DropdownMenuItem asChild>
          <Link
            href="/alur"
            className="flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-slate-700 hover:text-slate-950"
          >
            <Shield className="h-4 w-4 text-[#b87d28]" />
            <span>Panduan & Standar SJPH</span>
          </Link>
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        {/* Logout Option */}
        <DropdownMenuItem
          onClick={handleLogout}
          className="flex items-center gap-2.5 px-3 py-2 text-xs font-bold text-red-600 hover:bg-red-50 hover:text-red-700 focus:bg-red-50 focus:text-red-700 cursor-pointer"
        >
          {isPending ? (
            <Loader2 className="h-4 w-4 animate-spin text-red-600" />
          ) : (
            <LogOut className="h-4 w-4 text-red-600" />
          )}
          <span>Keluar Sesi</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
