import type { ReactNode } from "react";

export function DCard({
  children,
  className = "",
  padding = "p-5",
}: {
  children: ReactNode;
  className?: string;
  padding?: string;
}) {
  return (
    <div className={`bg-white border border-slate-200 rounded-lg shadow-card ${padding} ${className}`}>
      {children}
    </div>
  );
}
