"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import {
  DashboardContent,
  EmptyDashboardContent,
} from "@/app/dashboard/_components";
import type { DashboardData } from "@/types/dashboard";
import { getDashboard } from "@/services/dashboardService";

function DashboardInner() {
  const searchParams = useSearchParams();
  const obraId = searchParams.get("id");

  const [data, setData] = useState<DashboardData | null>(null);

  useEffect(() => {
    if (obraId) getDashboard(obraId).then(setData);
  }, [obraId]);

  if (!data) return <EmptyDashboardContent />;

  return <DashboardContent data={data} />;
}

export default function DashboardPage() {
  return (
    <Suspense fallback={<EmptyDashboardContent />}>
      <DashboardInner />
    </Suspense>
  );
}
