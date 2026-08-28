import React from "react";
import { AdminSidebar } from "@/components/dashboard/admin-sidebar";
import { AdminHeader } from "@/components/dashboard/admin-header";
import { requireRole } from "@/lib/permissions/rbac";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Server-side RBAC Guard: only SUPER_ADMIN, ADMIN, VERIFIER, LEADER can enter /admin
  await requireRole(["SUPER_ADMIN", "ADMIN", "VERIFIER", "LEADER"]);

  return (
    <div className="min-h-screen flex bg-[#fcfaf6]">
      <AdminSidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <AdminHeader />
        <main className="flex-1 px-3 sm:px-4 py-3.5 w-full">
          {children}
        </main>
      </div>
    </div>
  );
}
