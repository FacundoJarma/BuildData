"use client";

import type { ReactNode } from "react";
import { DashSidebar } from "@/app/components/dashboard/DashSidebar";
import { DashTopBar } from "@/app/components/dashboard/DashTopBar";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex h-screen bg-paper">
      <DashSidebar />
      <div className="flex-1 min-w-0 flex flex-col">
        <DashTopBar />
        <main className="flex-1 overflow-y-auto">
          <div className="p-6 max-w-[1100px] mx-auto">{children}</div>
        </main>
      </div>
    </div>
  );
}
