"use client";
import { Suspense } from "react";
import { ScreenPresupuesto } from "./_components";
import Loading from "./loading";

export default function PresupuestoPage() {
  return (
    <Suspense fallback={<Loading />}>
      <ScreenPresupuesto />
    </Suspense>
  );
}
