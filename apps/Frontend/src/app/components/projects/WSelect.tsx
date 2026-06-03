import type { ReactNode, SelectHTMLAttributes } from "react";

export function WSelect({ children, className, ...props }: SelectHTMLAttributes<HTMLSelectElement> & { children: ReactNode }) {
  return (
    <select {...props}
      className={`bg-white border border-slate-200 rounded-md px-3 py-[9px] text-[13px] text-slate-950 focus:border-primary focus:outline-none transition-colors ${className || ""}`}>
      {children}
    </select>
  );
}
