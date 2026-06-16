"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import {
  DashboardContent,
  EmptyDashboardContent,
} from "@/app/dashboard/_components";
import type { DashboardData } from "@/types/dashboard";
import { getDashboard } from "@/services/dashboardService";
import DashboardLoading from "./loading";

function DashboardInner() {
  const searchParams = useSearchParams();
  const obraId = searchParams.get("id");
  const [loading, setLoading] = useState(false);

  const [data, setData] = useState<DashboardData | null>(null);

  useEffect(() => {
    if (obraId) {
      setLoading(true);
      getDashboard(obraId).then((data) => {
        setData(data);
        setLoading(false);
      });
    }
  }, [obraId]);

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
