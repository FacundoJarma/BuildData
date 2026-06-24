"use client";
import { Suspense } from "react";
import { ScreenCronograma } from "./_components";
import Loading from "./loading";

export default function CronogramaPage() {
  return (
    <Suspense fallback={<Loading />}>
      <ScreenCronograma />
    </Suspense>
  );
}
