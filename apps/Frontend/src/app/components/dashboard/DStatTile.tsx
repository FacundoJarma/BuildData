import type { ReactNode } from "react";
import { DCard } from "@/app/components/ui/DCard";

const TONES: Record<string, { tint: string; fg: string }> = {
  primary:   { tint: "bg-primary-50",  fg: "text-primary" },
  critical:  { tint: "bg-critical-50",  fg: "text-[#B91C1C]" },
  attention: { tint: "bg-attention-50", fg: "text-[#A16207]" },
  success:   { tint: "bg-success-50",   fg: "text-[#15803D]" },
  info:      { tint: "bg-info-50",      fg: "text-[#1D4ED8]" },
};

const DELTA_COLORS: Record<string, string> = {
  success:  "text-[#15803D]",
  critical: "text-[#B91C1C]",
  slate:    "text-slate-500",
};

export function DStatTile({
  tone = "primary",
  label,
  value,
  suffix,
  icon,
  delta,
  deltaTone = "slate",
}: {
  tone?: string;
  label: string;
  value: string;
  suffix?: string;
  icon: ReactNode;
  delta?: string;
  deltaTone?: string;
}) {
  const t = TONES[tone] || TONES.primary;
  return (
    <DCard padding="p-4">
      <div
        className={`w-9 h-9 rounded-lg flex items-center justify-center mb-3 ${t.tint} ${t.fg}`}
      >
        {icon}
      </div>
      <div className="flex items-baseline gap-1">
        <div className="text-[26px] font-extrabold display-tight tnum text-slate-950 leading-none">
          {value}
        </div>
        {suffix && (
          <div className="text-base font-bold text-slate-500">{suffix}</div>
        )}
      </div>
      <div className="text-[10px] font-bold tracking-[0.06em] uppercase text-slate-600 mt-1">
        {label}
      </div>
      {delta && (
        <div
          className={`text-[11px] font-semibold mt-2 ${DELTA_COLORS[deltaTone] || DELTA_COLORS.slate}`}
        >
          {delta}
        </div>
      )}
    </DCard>
  );
}
