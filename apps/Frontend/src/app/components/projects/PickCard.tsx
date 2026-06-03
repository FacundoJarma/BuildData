import type { ReactNode } from "react";

export function PickCard({
  on,
  onClick,
  icon,
  name,
  sub,
  recommended,
  children,
}: {
  on: boolean;
  onClick: () => void;
  icon?: ReactNode;
  name: string;
  sub?: string;
  recommended?: boolean;
  children?: ReactNode;
}) {
  return (
    <button type="button" onClick={onClick}
      className={`text-left bg-white rounded-lg border-2 p-4 transition-all relative ${on ? "border-primary shadow-card2" : "border-slate-200 hover:border-slate-300"}`}>
      {recommended && (
        <span className="absolute -top-2 left-3 bg-accent text-slate-950 text-[9px] tracking-wider uppercase font-extrabold px-2 py-[2px] rounded">
          Recomendado
        </span>
      )}
      {icon && (
        <div className={`w-9 h-9 rounded-md flex items-center justify-center mb-3 ${on ? "bg-primary-50 text-primary" : "bg-slate-100 text-slate-600"}`}>
          {icon}
        </div>
      )}
      <div className="text-[13px] font-bold text-slate-950">{name}</div>
      {sub && <div className="text-[11px] text-slate-500 leading-snug mt-[2px]">{sub}</div>}
      {children}
      {on && (
        <div className="absolute top-3 right-3 w-5 h-5 rounded-full bg-primary text-white flex items-center justify-center">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </div>
      )}
    </button>
  );
}
