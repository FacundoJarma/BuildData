"use client";
import { Suspense } from "react";
import { ScreenAlertas } from "./_components";
import Loading from "./loading";

export default function AlertasPage() {
  return (
    <Suspense fallback={<Loading />}>
      <ScreenAlertas />
    </Suspense>
  );
}
