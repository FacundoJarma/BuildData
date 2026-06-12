import type { ReactNode } from "react";

export function WField({ label, hint, children, span = 1, error }: { label: string; hint?: string; children: ReactNode; span?: number; error?: string }) {
  return (
    <label className={`flex flex-col gap-[6px] col-span-${span}`}>
      <span className="text-[11px] font-bold text-slate-700">{label}</span>
      {children}
      {hint && <span className="text-[11px] text-slate-500 leading-snug">{hint}</span>}
      {error && (
        <span className="text-[11px] font-semibold text-[#B91C1C] flex items-center gap-1 mt-[2px]">
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="flex-none">
            <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
          {error}
        </span>
      )}
    </label>
  );
}
