"use client";

import { useState } from "react";
import { DCard } from "@/components/ui/DCard";
import PeriodNav from "@/components/ui/PeriodNav";
import type { TradeProgress } from "@/types/dashboard";

interface Props {
  data: TradeProgress[];
}

function ProgressByTradeCards({ data }: Props) {
  const [period, setPeriod] = useState("Total");

    return (
        <DCard padding="p-0">
          <div className="px-5 py-3 border-b border-slate-200 flex items-center justify-between">
            <div>
              <div className="text-[14px] font-bold text-slate-950">Avance por rubro</div>
              <div className="text-[11px] text-slate-500 mt-[1px]">
                Porcentaje completado de cada tarea
              </div>
            </div>
            <PeriodNav options={["Semana", "Mes", "Total"]} value={period} onChange={setPeriod} />
          </div>
          <div className="p-5 space-y-3">
            {data.map((r) => (
              <div
                key={r.name}
                className="grid grid-cols-[160px_1fr_44px] gap-3 items-center"
              >
                <div className="text-[12px] font-semibold text-slate-800">
                  {r.name}
                </div>
                <div className="bg-slate-100 h-[8px] rounded-full overflow-hidden">
                  <div
                    style={{ width: `${r.pct}%`, background: r.color }}
                    className="h-full rounded-full"
                  />
                </div>
                <div className="text-[12px] font-bold text-right tnum">{r.pct}%</div>
              </div>
            ))}
          </div>
        </DCard>
    )
}

export default ProgressByTradeCards;