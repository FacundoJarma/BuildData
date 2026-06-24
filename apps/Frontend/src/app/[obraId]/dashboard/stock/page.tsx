"use client";
import { Suspense } from "react";
import { ScreenStock } from "./_components";
import Loading from "./loading";

export default function StockPage() {
  return (
    <Suspense fallback={<Loading />}>
      <ScreenStock />
    </Suspense>
  );
}
