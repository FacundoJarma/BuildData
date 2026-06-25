"use client";

import { use, Suspense } from "react";
import { ScreenActividad } from "./_components";
import Loading from "./loading";

export default function ActividadPage({
  params,
}: {
  params: Promise<{ obraId: string }>;
}) {
  const { obraId } = use(params);

  return (
    <Suspense fallback={<Loading />}>
      <ScreenActividad obraId={obraId} />
    </Suspense>
  );
}
