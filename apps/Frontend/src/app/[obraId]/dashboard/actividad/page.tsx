"use client";
import { Suspense } from "react";
import { ScreenActividad } from "./_components";
import Loading from "./loading";

export default function ActividadPage() {
  return (
    <Suspense fallback={<Loading />}>
      <ScreenActividad />
    </Suspense>
  );
}
