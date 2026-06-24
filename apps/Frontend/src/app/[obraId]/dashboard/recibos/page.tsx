"use client";
import { Suspense } from "react";
import { ScreenRecibos } from "./_components";
import Loading from "./loading";

export default function RecibosPage() {
  return (
    <Suspense fallback={<Loading />}>
      <ScreenRecibos />
    </Suspense>
  );
}
