"use client";

import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { ObrasHome } from "@/app/projects/_components/ObrasHome";

export default function ProjectsPage() {
  return (
    <ProtectedRoute>
      <ObrasHome />
    </ProtectedRoute>
  );
}
