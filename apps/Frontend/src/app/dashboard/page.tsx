"use client";

import { useState } from "react";
import { DashboardContent, EmptyDashboardContent, ChatBubble } from "@/app/components/dashboard";

export default function DashboardPage() {
  const [isEmpty] = useState(false);

  return (
    <>
      {isEmpty ? <EmptyDashboardContent /> : <DashboardContent />}
      {!isEmpty && <ChatBubble />}
    </>
  );
}
