"use client";
import { Suspense } from "react";
import { ScreenEquipo } from "./_components";
import Loading from "./loading";

export default function EquipoPage() {
  return (
    <Suspense fallback={<Loading />}>
      <ScreenEquipo />
    </Suspense>
  );
}
