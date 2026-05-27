import type { ReactNode } from "react";

export function DPageHeader({
  title,
  subtitle,
  right,
}: {
  title: string;
  subtitle?: string;
  right?: ReactNode;
}) {
  return (
    <div className="flex items-start justify-between gap-4 mb-5">
      <div>
        <h1 className="text-[22px] font-bold display-tight text-slate-950 leading-tight">
          {title}
        </h1>
        {subtitle && (
          <div className="text-[13px] text-slate-500 mt-[2px]">{subtitle}</div>
        )}
      </div>
      {right && <div className="flex items-center gap-2 flex-none">{right}</div>}
    </div>
  );
}
