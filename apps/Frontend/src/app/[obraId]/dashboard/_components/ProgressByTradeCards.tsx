"use client";

import { DCard } from "@/components/ui/DCard";
import { Plus, ChevronRight } from "@gravity-ui/icons";
import type { TradeProgress } from "@/types/dashboard";
import Button from "@/components/ui/Button";

interface Props {
  data: TradeProgress[];
  onItemClick?: (name: string) => void;
  onNewCategory?: () => void;
  onViewAll?: () => void;
}

function ProgressByTradeCards({ data, onItemClick, onNewCategory, onViewAll }: Props) {
  return (
    <DCard padding="p-0">
      <div className="px-5 py-3 border-b border-slate-200 flex items-center justify-between">
        <div>
          <div className="text-[14px] font-bold text-slate-950">
            Avance por rubro
          </div>
          <div className="text-[11px] text-slate-500 mt-[1px]">
            Comparado con el presupuesto inicial
          </div>
        </div>
        <Button
          icon={<Plus width={16} height={16} />}
          variant="secondary"
          size="sm"
          className="justify-center"
          onClick={onNewCategory}
        >
          Nuevo Rubro
        </Button>
      </div>
      <div className="p-3 space-y-1">
        {data.map((r) => (
          <button
            key={r.name}
            onClick={() => onItemClick?.(r.name)}
            className="w-full grid grid-cols-[170px_1fr_44px] gap-3 items-center px-2 py-2 rounded-md hover:bg-slate-50 transition-colors text-left group"
          >
            <div className="flex items-center gap-2 min-w-0">
              <span className="w-2 h-2 rounded-full flex-none" style={{ background: r.color }} />
              <span className="text-[12px] font-semibold text-slate-800 truncate group-hover:text-primary transition-colors">{r.name}</span>
            </div>
            <div className="bg-slate-100 h-[8px] rounded-full overflow-hidden">
              <div
                style={{ width: `${r.pct}%`, background: r.color }}
                className="h-full rounded-full"
              />
            </div>
            <div className="flex items-center gap-1 justify-end">
              <span className="text-[12px] font-bold tnum">{r.pct}%</span>
              {onItemClick && <ChevronRight width={12} height={12} className="text-slate-300 group-hover:text-slate-500 transition-colors flex-none" />}
            </div>
          </button>
        ))}
      </div>
      {onViewAll && (
        <div className="px-3 pb-3">
          <Button variant="secondary" size="sm" className="w-full justify-center" onClick={onViewAll}>
            Ver todos los avances
          </Button>
        </div>
      )}
    </DCard>
  );
}

export default ProgressByTradeCards;
