"use client";

import {
  ChartBar,
  CircleExclamation,
  Box,
  Check,
  FileArrowDown,
  Plus,
} from "@gravity-ui/icons";
import { DPageHeader } from "./DPageHeader";
import { DStatTile } from "./DStatTile";
import { DCard } from "@/components/ui/DCard";
import { DAvatar } from "@/components/ui/DAvatar";
import Button from "@/components/ui/Button";
import ProgressByTradeCards from "./ProgressByTradeCards";
import CriticalAlertsCard from "./CriticalAlertsCard";
import type { DashboardData } from "@/types/dashboard";

function formatCurrency(n: number): string {
  if (n >= 1_000_000) return `AR$ ${Math.round(n / 1_000_000)} M`;
  if (n >= 1_000) return `AR$ ${Math.round(n / 1_000)} K`;
  return `AR$ ${n}`;
}

interface Props {
  data: DashboardData;
}

export function DashboardContent({ data }: Props) {
  const {
    obra,
    stats,
    budget,
    budgetBreakdown,
    tradeProgress,
    activityFeed,
    alerts,
  } = data;

  return (
    <>
      <DPageHeader
        title="Dashboard"
        subtitle={`s${obra.name} · ${obra.sector} · actualizado ${obra.lastUpdate}`}
        right={
          <>
            <Button
              variant="secondary"
              size="sm"
              icon={<FileArrowDown width={13} height={13} />}
            >
              Exportar
            </Button>
            <Button
              variant="primary"
              size="sm"
              icon={<Plus width={13} height={13} />}
            >
              Nuevo reporte
            </Button>
          </>
        }
      />

      {/* Stat tiles */}
      <div className="grid grid-cols-4 gap-3 mb-4">
        <DStatTile
          tone="primary"
          label="Avance total"
          value={`${stats.avanceTotal}`}
          suffix="%"
          icon={<ChartBar width={16} height={16} />}
          delta={stats.avanceDelta}
          deltaTone="success"
        />
        <DStatTile
          tone="critical"
          label="Alertas críticas"
          value={`${stats.alertasCriticas}`}
          icon={<CircleExclamation width={16} height={16} />}
          delta={stats.alertasDelta}
          deltaTone="critical"
        />
        <DStatTile
          tone="attention"
          label="Pedidos"
          value={`${stats.pedidos}`}
          icon={<Box width={16} height={16} />}
          delta={`${stats.pedidosPendientes} por aprobar`}
        />
        <DStatTile
          tone="success"
          label="Tareas hoy"
          value={`${stats.tareasCompletadas}/${stats.tareasTotal}`}
          icon={<Check width={16} height={16} />}
          delta={`${Math.round((stats.tareasCompletadas / stats.tareasTotal) * 100)}% completadas`}
          deltaTone="success"
        />
      </div>

      {/* Progress + Criticals */}
      <div className="grid grid-cols-[2fr_1fr] gap-3 mb-4">
        <ProgressByTradeCards data={tradeProgress} />
        <CriticalAlertsCard alerts={alerts} />
      </div>

      {/* Budget banner + Activity feed */}
      <div className="grid grid-cols-2 gap-3">
        {/* Budget */}
        <div className="blueprint-bg rounded-lg p-5 text-white relative overflow-hidden flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <span className="inline-flex items-center gap-1 bg-accent/20 text-accent text-[9px] font-bold tracking-wider uppercase px-2 py-[3px] rounded">
              <ChartBar width={10} height={10} /> Presupuesto
            </span>
            <span className="text-[10px] text-white/60">
              Actualizado {budget.updatedAt}
            </span>
          </div>

          <div className="grid grid-cols-3 gap-3 mb-4">
            <div>
              <div className="text-[9px] tracking-[0.06em] uppercase font-bold text-white/55">
                Total
              </div>
              <div className="text-[18px] font-extrabold display-tight tnum text-white leading-tight">
                {formatCurrency(budget.total)}
              </div>
            </div>
            <div>
              <div className="text-[9px] tracking-[0.06em] uppercase font-bold text-white/55">
                Ejecutado
              </div>
              <div className="text-[18px] font-extrabold display-tight tnum text-white leading-tight">
                {formatCurrency(budget.ejecutado)}
              </div>
              <div className="text-[10px] font-semibold text-white/60">
                {budget.ejecutadoPct} %
              </div>
            </div>
            <div>
              <div className="text-[9px] tracking-[0.06em] uppercase font-bold text-white/55">
                Disponible
              </div>
              <div className="text-[18px] font-extrabold display-tight tnum text-accent leading-tight">
                {formatCurrency(budget.disponible)}
              </div>
              <div className="text-[10px] font-semibold text-accent/80">
                {budget.librePct} %
              </div>
            </div>
          </div>

          <div className="mb-2">
            <div className="h-[10px] w-full rounded-full overflow-hidden flex bg-white/10">
              <div
                style={{ width: `${budget.ejecutadoPct}%` }}
                className="h-full bg-accent"
              />
              <div
                style={{ width: `${budget.comprometidoPct}%` }}
                className="h-full bg-accent/55"
              />
            </div>
            <div className="flex items-center gap-4 mt-2 text-[10px] text-white/65">
              <span className="inline-flex items-center gap-[6px]">
                <span className="w-2 h-2 rounded-full bg-accent" /> Ejecutado{" "}
                {budget.ejecutadoPct} %
              </span>
              <span className="inline-flex items-center gap-[6px]">
                <span className="w-2 h-2 rounded-full bg-accent/55" />{" "}
                Comprometido {budget.comprometidoPct} %
              </span>
              <span className="inline-flex items-center gap-[6px]">
                <span className="w-2 h-2 rounded-full bg-white/15" /> Libre{" "}
                {budget.librePct} %
              </span>
            </div>
          </div>

          <div className="border-t border-white/10 pt-3 space-y-[6px] mb-4">
            {budgetBreakdown.map((r) => (
              <div
                key={r.name}
                className="grid grid-cols-[1fr_auto] items-center text-[11px]"
              >
                <div className="text-white/85 truncate">{r.name}</div>
                <div className="tnum font-semibold">
                  <span className={r.over ? "text-critical" : "text-white"}>
                    {formatCurrency(r.spent)}
                  </span>
                  <span className="text-white/45">
                    {" "}
                    / {formatCurrency(r.cap)}
                  </span>
                  {r.over && (
                    <span className="ml-2 text-[9px] font-bold tracking-wider text-critical bg-critical/20 px-[5px] py-[1px] rounded">
                      +{r.overPct} %
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="flex gap-2 mt-auto">
            <Button variant="accent" size="sm">
              Ver desglose
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="text-white hover:bg-white/10"
            >
              Exportar
            </Button>
          </div>
        </div>

        {/* Activity feed */}
        <DCard padding="p-0">
          <div className="px-5 py-3 border-b border-slate-200">
            <div className="text-[14px] font-bold">Avances de hoy</div>
          </div>
          <div className="divide-y divide-slate-200">
            {activityFeed.map((a, i) => (
              <div key={i} className="px-4 py-[10px] flex items-center gap-3">
                <DAvatar initials={a.initials} size={30} />
                <div className="flex-1 min-w-0 text-[12px] leading-snug">
                  <b className="font-bold">{a.name}</b> {a.action}
                </div>
                <div className="text-[10px] text-slate-500 tnum">{a.time}</div>
              </div>
            ))}
          </div>
        </DCard>
      </div>
    </>
  );
}
