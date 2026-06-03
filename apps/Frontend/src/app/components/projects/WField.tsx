import type { ReactNode } from "react";

export function WField({ label, hint, children, span = 1 }: { label: string; hint?: string; children: ReactNode; span?: number }) {
  return (
    <label className={`flex flex-col gap-[6px] col-span-${span}`}>
      <span className="text-[11px] font-bold text-slate-700">{label}</span>
      {children}
      {hint && <span className="text-[11px] text-slate-500 leading-snug">{hint}</span>}
    </label>
  );
}
