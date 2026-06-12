"use client";

import { useState, useEffect } from "react";
import {
  DashboardContent,
  EmptyDashboardContent,
} from "@/app/dashboard/_components";
import type { DashboardData } from "@/types/dashboard";
import { getDashboard } from "@/services/dashboardService";

export default function DashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);

  useEffect(() => {
    getDashboard("belgrano").then(setData);
  }, []);

  if (!data) return <EmptyDashboardContent />;

  return <DashboardContent data={data} />;
}
