"use client";
import { Suspense } from "react";
import { ScreenReportes } from "./_components";
import Loading from "./loading";

export default function ReportesPage() {
  return (
    <Suspense fallback={<Loading />}>
      <ScreenReportes />
    </Suspense>
  );
}
