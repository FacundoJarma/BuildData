"use client";

import { useState, useEffect, useCallback, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import {
  DashboardContent,
  EmptyDashboardContent,
} from "@/app/dashboard/_components";
import type { DashboardData } from "@/types/dashboard";
import { getDashboard } from "@/services/dashboardService";
import { useDashboardData } from "@/app/dashboard/_components/DashboardDataContext";
import DashboardLoading from "./loading";

function DashboardInner() {
  const searchParams = useSearchParams();
  const obraId = searchParams.get("id");
  const [loading, setLoading] = useState(false);

  const [data, setData] = useState<DashboardData | null>(null);
  const { setRefreshDashboardRef, setObraInfo } = useDashboardData();

  const refresh = useCallback(async () => {
    if (!obraId) return;
    setLoading(true);
    try {
      const fresh = await getDashboard(obraId);
      setData(fresh);
      setObraInfo(obraId, fresh.obra.name, fresh.stats.avanceTotal);
    } finally {
      setLoading(false);
    }
  }, [obraId, setObraInfo]);

  useEffect(() => {
    setRefreshDashboardRef(refresh);
    return () => setRefreshDashboardRef(async () => {});
  }, [refresh, setRefreshDashboardRef]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  if(loading) return <DashboardLoading />;
  
  if (!data) return <EmptyDashboardContent />;

  return <DashboardContent data={data} />;
}

export default function DashboardPage() {
  return (
    <Suspense fallback={<DashboardLoading />}>
      <DashboardInner />
    </Suspense>
  );
}
