"use client";
import { Suspense } from "react";
import { ScreenPedidos } from "./_components";
import Loading from "./loading";

export default function PedidosPage() {
  return (
    <Suspense fallback={<Loading />}>
      <ScreenPedidos />
    </Suspense>
  );
}
