import React from "react";
import { getSession } from "@/lib/auth/session";
import { UserAccountNav } from "./user-account-nav";

export async function BusinessHeader() {
  const session = await getSession();

  return (
    <header className="h-16 border-b border-[#ebd7ba]/80 bg-white px-3 sm:px-4 flex items-center justify-between sticky top-0 z-20 shadow-sm">
      <div className="flex items-center gap-3">
        <h2 className="text-sm font-bold text-slate-900">
          Portal Mandiri Pelaku Usaha
        </h2>
      </div>

      <div className="flex items-center gap-4">
        {session && (
          <UserAccountNav
            user={{
              fullName: session.fullName,
              email: session.email,
              activeRole: session.activeRole,
            }}
          />
        )}
      </div>
    </header>
  );
}
