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
import { DCard } from "./DCard";
import { DPill } from "./DPill";
import { DAvatar } from "./DAvatar";
import Button from "@/app/components/ui/Button";
import ProgressByTradeCards from "./ProgressByTradeCards";
import CriticalAlertsCard from "./CriticalAlertsCard";

export function DashboardContent() {
  return (
    <>
      <DPageHeader
        title="Dashboard"
        subtitle="Edificio Belgrano · Sector C · actualizado hace 12 min"
        right={
          <>
            <Button
              variant="secondary"
              size="sm"
              icon={<FileArrowDown width={13} height={13} />}
            >
              Exportar
            </Button>
            <Button variant="primary" size="sm" icon={<Plus width={13} height={13} />}>
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
          value="68"
          suffix="%"
          icon={<ChartBar width={16} height={16} />}
          delta="+4% esta semana"
          deltaTone="success"
        />
        <DStatTile
          tone="critical"
          label="Alertas críticas"
          value="2"
          icon={<CircleExclamation width={16} height={16} />}
          delta="+1 hoy"
          deltaTone="critical"
        />
        <DStatTile
          tone="attention"
          label="Pedidos"
          value="7"
          icon={<Box width={16} height={16} />}
          delta="3 por aprobar"
        />
        <DStatTile
          tone="success"
          label="Tareas hoy"
          value="9/12"
          icon={<Check width={16} height={16} />}
          delta="75% completadas"
          deltaTone="success"
        />
      </div>

      {/* Progress + Criticals */}
      <div className="grid grid-cols-[2fr_1fr] gap-3 mb-4">
        {/* Progress by trade */}
        <ProgressByTradeCards />

        {/* Critical alerts */}
        <CriticalAlertsCard />
      </div>

      {/* Budget banner + Activity feed */}
      <div className="grid grid-cols-2 gap-3">
        {/* Budget */}
        <div className="blueprint-bg rounded-lg p-5 text-white relative overflow-hidden flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <span className="inline-flex items-center gap-1 bg-accent/20 text-accent text-[9px] font-bold tracking-wider uppercase px-2 py-[3px] rounded">
              <ChartBar width={10} height={10} /> Presupuesto
            </span>
            <span className="text-[10px] text-white/60">Actualizado hoy</span>
          </div>

          <div className="grid grid-cols-3 gap-3 mb-4">
            <div>
              <div className="text-[9px] tracking-[0.06em] uppercase font-bold text-white/55">
                Total
              </div>
              <div className="text-[18px] font-extrabold display-tight tnum text-white leading-tight">
                AR$ 124 M
              </div>
            </div>
            <div>
              <div className="text-[9px] tracking-[0.06em] uppercase font-bold text-white/55">
                Ejecutado
              </div>
              <div className="text-[18px] font-extrabold display-tight tnum text-white leading-tight">
                AR$ 81 M
              </div>
              <div className="text-[10px] font-semibold text-white/60">65 %</div>
            </div>
            <div>
              <div className="text-[9px] tracking-[0.06em] uppercase font-bold text-white/55">
                Disponible
              </div>
              <div className="text-[18px] font-extrabold display-tight tnum text-accent leading-tight">
                AR$ 43 M
              </div>
              <div className="text-[10px] font-semibold text-accent/80">35 %</div>
            </div>
          </div>

          <div className="mb-2">
            <div className="h-[10px] w-full rounded-full overflow-hidden flex bg-white/10">
              <div style={{ width: "65%" }} className="h-full bg-accent" />
              <div style={{ width: "12%" }} className="h-full bg-accent/55" />
            </div>
            <div className="flex items-center gap-4 mt-2 text-[10px] text-white/65">
              <span className="inline-flex items-center gap-[6px]">
                <span className="w-2 h-2 rounded-full bg-accent" /> Ejecutado 65 %
              </span>
              <span className="inline-flex items-center gap-[6px]">
                <span className="w-2 h-2 rounded-full bg-accent/55" /> Comprometido 12 %
              </span>
              <span className="inline-flex items-center gap-[6px]">
                <span className="w-2 h-2 rounded-full bg-white/15" /> Libre 23 %
              </span>
            </div>
          </div>

          <div className="border-t border-white/10 pt-3 space-y-[6px] mb-4">
            {[
              { name: "Hormigón armado",  spent: "38 M", cap: "52 M", over: false },
              { name: "Mampostería",      spent: "21 M", cap: "20 M", over: true },
              { name: "Terminaciones",    spent: "6 M",  cap: "28 M", over: false },
            ].map((r) => (
              <div key={r.name} className="grid grid-cols-[1fr_auto] items-center text-[11px]">
                <div className="text-white/85 truncate">{r.name}</div>
                <div className="tnum font-semibold">
                  <span className={r.over ? "text-critical" : "text-white"}>
                    AR$ {r.spent}
                  </span>
                  <span className="text-white/45"> / {r.cap}</span>
                  {r.over && (
                    <span className="ml-2 text-[9px] font-bold tracking-wider text-critical bg-critical/20 px-[5px] py-[1px] rounded">
                      +5 %
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
            <Button variant="ghost" size="sm" className="text-white hover:bg-white/10">
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
            {[
              { who: "JM", name: "J. Méndez", what: "Marcó completada Hormigonado losa +3", when: "08:42" },
              { who: "CR", name: "C. Ríos",   what: "Subió 4 fotos del Sector C",           when: "10:15" },
              { who: "LB", name: "L. Benítez", what: "Pedido de cemento aprobado",         when: "11:30" },
              { who: "PS", name: "P. Salas",  what: "Reportó falla en Grúa Torre 2",        when: "12:48" },
            ].map((a, i) => (
              <div key={i} className="px-4 py-[10px] flex items-center gap-3">
                <DAvatar initials={a.who} size={30} />
                <div className="flex-1 min-w-0 text-[12px] leading-snug">
                  <b className="font-bold">{a.name}</b> {a.what}
                </div>
                <div className="text-[10px] text-slate-500 tnum">{a.when}</div>
              </div>
            ))}
          </div>
        </DCard>
      </div>
    </>
  );
}
