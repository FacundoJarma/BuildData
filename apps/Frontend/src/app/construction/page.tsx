"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import UnderConstructionPage from "@/components/ui/UnderConstructionPage";

function ConstructionContent() {
  const searchParams = useSearchParams();
  const section = searchParams.get("section") || undefined;
  const desc = searchParams.get("desc") || undefined;

  return (
    <ProtectedRoute>
      <UnderConstructionPage section={section} desc={desc} />
    </ProtectedRoute>
  );
}

export default function ConstructionPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center min-h-screen bg-paper">
          <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
        </div>
      }
    >
      <ConstructionContent />
    </Suspense>
  );
}
