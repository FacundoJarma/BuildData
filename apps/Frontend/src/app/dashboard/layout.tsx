"use client";

import { Suspense, useState, type ReactNode } from "react";
import { useSearchParams } from "next/navigation";
import { DashSidebar } from "@/app/dashboard/_components/DashSidebar";
import { DashTopBar } from "@/app/dashboard/_components/DashTopBar";
import { DashboardDataProvider } from "@/app/dashboard/_components/DashboardDataContext";
import { QuickAddProvider } from "@/app/dashboard/_components/QuickAddContext";
import { QuickAddModal } from "@/app/dashboard/_components/QuickAddModal";
import { useToast, DashToast } from "@/app/dashboard/_components/useToast";
import ProtectedRoute from "@/components/auth/ProtectedRoute";

function LayoutInner({ children, quickAdd, setQuickAdd, flash, toastMsg }: {
  children: ReactNode;
  quickAdd: string | null;
  setQuickAdd: (v: string | null) => void;
  flash: (msg: string) => void;
  toastMsg: string;
}) {
  const searchParams = useSearchParams();
  const obraId = searchParams.get("id") || "";

  return (
    <>
      <div className="flex h-screen bg-paper">
        <DashSidebar />
        <div className="flex-1 min-w-0 flex flex-col">
          <DashTopBar onQuickAdd={setQuickAdd} />
          <main className="flex-1 overflow-y-auto">
            <div className="p-6 max-w-[1100px] mx-auto">{children}</div>
          </main>
        </div>
      </div>

      <QuickAddModal kind={quickAdd} obraId={obraId} onClose={() => setQuickAdd(null)} onDone={flash} />
      <DashToast msg={toastMsg} />
    </>
  );
}

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const [quickAdd, setQuickAdd] = useState<string | null>(null);
  const [toast, flash] = useToast();

  return (
    <ProtectedRoute>
      <DashboardDataProvider>
      <QuickAddProvider>
        <Suspense fallback={null}>
          <LayoutInner quickAdd={quickAdd} setQuickAdd={setQuickAdd} flash={flash} toastMsg={toast}>
            {children}
          </LayoutInner>
        </Suspense>
      </QuickAddProvider>
      </DashboardDataProvider>
    </ProtectedRoute>
  );
}
