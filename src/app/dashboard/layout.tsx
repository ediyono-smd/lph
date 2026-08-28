import React from "react";
import { BusinessSidebar } from "@/components/dashboard/business-sidebar";
import { BusinessHeader } from "@/components/dashboard/business-header";
import { requireAuth } from "@/lib/permissions/rbac";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireAuth();

  return (
    <div className="min-h-screen flex bg-[#fcfaf6]">
      <BusinessSidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <BusinessHeader />
        <main className="flex-1 px-3 sm:px-4 py-3.5 w-full">
          {children}
        </main>
      </div>
    </div>
  );
}
