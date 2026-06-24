"use client";

import { useState, useEffect, useMemo } from "react";
import { FileArrowDown, ChartBar, Pencil, Sparkles, Box, Calendar } from "@gravity-ui/icons";
import { DPageHeader } from "../../_components/DPageHeader";
import { DStatTile } from "../../_components/DStatTile";
import { DCard } from "@/components/ui/DCard";
import { DPill } from "@/components/ui/DPill";
import Button from "@/components/ui/Button";
import { Donut } from "./Donut";
import { getPresupuesto, type PresupuestoData } from "@/services/mock/presupuestoService";
import { CURRENCIES, FORECAST_ITEMS } from "../data";
import type { BudgetLine } from "../data";

const RUBRO_COLORS = ["#0F4395", "#F59E0B", "#22C55E", "#EF4444", "#3B82F6"];
type CurrKey = "ARS" | "USD" | "EUR";

function useProjections(lines: BudgetLine[]) {
  return useMemo(() => {
    let totalProjected = 0;
    const riskRubros: { name: string; deviation: number }[] = [];
    const projected = lines.map((l) => {
      const pctUsed = l.spent / l.cap;
      const remaining = Math.max(0, l.cap - l.spent - l.comp);
      let factor = 1.0;
      if (pctUsed > 1) factor = 1.18;
      else if (pctUsed > 0.85) factor = 1.06;
      const proj = l.spent + l.comp + remaining * factor;
      const dev = proj - l.cap;
      totalProjected += proj;
      if (dev > 0) riskRubros.push({ name: l.name, deviation: dev });
      return { ...l, pctUsed, remaining, factor, projected: proj, deviation: dev };
    });
    return { projected, totalProjected, riskRubros };
  }, [lines]);
}

export function ScreenPresupuesto() {
  const [data, setData] = useState<PresupuestoData | null>(null);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [cur, setCur] = useState<CurrKey>("ARS");
  const [localLines, setLocalLines] = useState<BudgetLine[]>([]);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    getPresupuesto().then((d) => {
      if (!cancelled) {
        setData(d);
        setLocalLines(JSON.parse(JSON.stringify(d.lines)));
        setLoading(false);
      }
    });
    return () => { cancelled = true; };
  }, []);

  const lines = data?.lines ?? [];
  const displayLines = editMode ? localLines : lines;
  const totalCap = useMemo(() => displayLines.reduce((s, l) => s + l.cap, 0), [displayLines]);
  const totalSpent = useMemo(() => displayLines.reduce((s, l) => s + l.spent, 0), [displayLines]);
  const totalComp = useMemo(() => displayLines.reduce((s, l) => s + l.comp, 0), [displayLines]);
  const disponible = totalCap - totalSpent;
  const ejecPct = totalCap > 0 ? Math.round((totalSpent / totalCap) * 100) : 0;

  const { projected, totalProjected, riskRubros } = useProjections(displayLines);
  const predPct = totalCap > 0 ? Math.min(100, Math.round((totalProjected / totalCap) * 100)) : 0;

  const c = CURRENCIES[cur];

  const fmt = (val: number): string => {
    const v = val * c.rate;
    if (v >= 1) return `${c.sym} ${v.toFixed(c.dec)} M`;
    if (v <= -1) return `${c.sym} ${v.toFixed(c.dec)} M`;
    return `${c.sym} ${(v * 1000).toFixed(c.dec)} K`;
  };

  const handleCapChange = (idx: number, val: number) => {
    setLocalLines((prev) => {
      const next = [...prev];
      next[idx] = { ...next[idx], cap: val };
      return next;
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="flex items-center gap-3 text-slate-400">
          <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          <span className="text-[13px] font-semibold">Cargando presupuesto…</span>
        </div>
      </div>
    );
  }

  if (!data) return null;

  return (
    <>
      <DPageHeader
        title="Presupuesto"
        right={
          <div className="flex items-center gap-2">
            <div className="flex bg-slate-100 rounded-md p-[2px] gap-[2px]">
              {(["ARS", "USD", "EUR"] as CurrKey[]).map((k) => (
                <button
                  key={k}
                  onClick={() => setCur(k)}
                  className={`text-[11px] font-bold px-[10px] py-[5px] rounded transition-colors ${
                    cur === k ? "bg-white text-slate-950 shadow-card" : "text-slate-600 hover:text-slate-800"
                  }`}
                >
                  {CURRENCIES[k].sym}
                </button>
              ))}
            </div>
            <Button
              variant="secondary"
              size="sm"
              icon={<Pencil width={13} height={13} />}
              onClick={() => setEditMode((p) => !p)}
            >
              {editMode ? "Guardar montos" : "Editar montos"}
            </Button>
            <Button variant="primary" size="sm" icon={<FileArrowDown width={13} height={13} />}>
              Exportar
            </Button>
          </div>
        }
      />

      <div className="flex items-start gap-4 mb-4">
        <Donut
          value={ejecPct}
          size={140}
          stroke={14}
          label={`${ejecPct}%`}
          sub="Ejecutado"
        />
        <DStatTile
          tone="primary"
          label="Presupuesto total"
          value={fmt(totalCap)}
          icon={<ChartBar width={16} height={16} />}
        />
        <DStatTile
          tone="info"
          label="Ejecutado"
          value={fmt(totalSpent)}
          suffix={`${ejecPct}%`}
          icon={<Box width={16} height={16} />}
        />
        <DStatTile
          tone="attention"
          label="Comprometido"
          value={fmt(totalComp)}
          icon={<Calendar width={16} height={16} />}
        />
        <DStatTile
          tone={disponible >= 0 ? "success" : "critical"}
          label="Disponible"
          value={fmt(Math.max(0, disponible))}
          suffix={disponible < 0 ? "Excedido" : ""}
          icon={<ChartBar width={16} height={16} />}
        />
      </div>

      <DCard padding="p-5" className="blueprint-bg text-white mb-4">
        <div className="flex items-start gap-5">
          <Donut
            value={predPct}
            size={80}
            stroke={8}
            color="#F59E0B"
            track="rgba(255,255,255,0.12)"
            label={`${predPct}%`}
            sub="Proyección"
          />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <Sparkles width={14} height={14} className="text-accent" />
              <span className="text-[10px] tracking-[0.06em] uppercase font-bold text-accent">
                Predicción IA
              </span>
            </div>
            <div className="text-[13px] leading-relaxed">
              {totalProjected > totalCap
                ? `Se proyecta un excedente de ${fmt(totalProjected - totalCap)} sobre el presupuesto total.`
                : `Se proyecta cerrar dentro del presupuesto con ${fmt(totalCap - totalProjected)} de margen.`}
            </div>
            {riskRubros.length > 0 && (
              <div className="flex items-center gap-1.5 mt-2 flex-wrap">
                <span className="text-[10px] text-white/50 mr-1">Riesgo:</span>
                {riskRubros.map((r) => (
                  <DPill key={r.name} tone="attentionSolid">
                    {r.name} +{fmt(Math.abs(r.deviation))}
                  </DPill>
                ))}
              </div>
            )}
          </div>
        </div>
      </DCard>

      <div className="grid grid-cols-[1.6fr_1fr] gap-4">
        <DCard padding="p-0">
          <div className="px-5 py-3.5 border-b border-slate-100">
            <div className="text-[10px] tracking-[0.06em] uppercase font-bold text-slate-500">
              Detalle por rubro
            </div>
          </div>
          <div className="divide-y divide-slate-100">
            {projected.map((l, i) => {
              const over = l.spent > l.cap;
              const usedPct = totalCap > 0 ? Math.round((l.spent / l.cap) * 100) : 0;
              const compPct = totalCap > 0 ? Math.round((l.comp / l.cap) * 100) : 0;
              const color = RUBRO_COLORS[i % RUBRO_COLORS.length];
              return (
                <div key={l.name} className="px-5 py-3.5">
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full" style={{ backgroundColor: color }} />
                      <span className="text-[13px] font-bold text-slate-950">{l.name}</span>
                    </div>
                    {over && <DPill tone="criticalSolid">Excedido</DPill>}
                  </div>
                  <div className="flex items-center gap-3 mb-1.5">
                    {editMode ? (
                      <input
                        type="number"
                        value={l.cap}
                        onChange={(e) => handleCapChange(i, Number(e.target.value))}
                        className="w-20 border border-slate-200 rounded px-2 py-1 text-[12px] font-bold tnum text-slate-950 text-right focus:outline-none focus:border-primary"
                      />
                    ) : (
                      <span className="text-[12px] font-bold tnum text-slate-950">{fmt(l.spent)}</span>
                    )}
                    <span className="text-[11px] text-slate-400">/ {fmt(l.cap)}</span>
                    <span className="text-[11px] font-bold text-slate-500 ml-auto">{usedPct}%</span>
                  </div>
                  <div className="h-[6px] w-full rounded-full bg-slate-100 overflow-hidden flex">
                    <div
                      className="h-full rounded-full transition-all"
                      style={{ width: `${Math.min(usedPct, 100)}%`, backgroundColor: color }}
                    />
                    <div
                      className="h-full rounded-full transition-all"
                      style={{
                        width: `${Math.min(compPct, Math.max(0, 100 - usedPct))}%`,
                        backgroundColor: color,
                        opacity: 0.4,
                      }}
                    />
                  </div>
                  <div className="text-[10px] text-slate-400 mt-1">
                    Proyección: {fmt(l.projected)}
                    {l.deviation > 0 && (
                      <span className="text-critical ml-1">(+{fmt(l.deviation)})</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </DCard>

        <div className="space-y-4">
          <DCard padding="p-4">
            <div className="flex items-center gap-2 mb-3">
              <Calendar width={14} height={14} className="text-slate-500" />
              <span className="text-[10px] tracking-[0.06em] uppercase font-bold text-slate-500">
                Proyección temporal
              </span>
            </div>
            <div className="space-y-0">
              {FORECAST_ITEMS.map((f, i) => (
                <div key={i} className="flex gap-3 pb-3 border-l-2 border-slate-200 pl-3 ml-1 relative">
                  <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-white border-2 border-slate-300 flex items-center justify-center">
                    <div className="w-1.5 h-1.5 rounded-full bg-slate-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-bold text-slate-800">{f.month}</span>
                      <span className="text-[10px] text-slate-500">{f.label}</span>
                    </div>
                    <div className="text-[11px] text-slate-600 mt-0.5">{f.items.join(", ")}</div>
                    <div className="text-[11px] font-bold tnum text-primary mt-1">{fmt(f.amount)}</div>
                  </div>
                </div>
              ))}
            </div>
          </DCard>

          <DCard padding="p-4">
            <div className="flex items-center gap-2 mb-3">
              <ChartBar width={14} height={14} className="text-slate-500" />
              <span className="text-[10px] tracking-[0.06em] uppercase font-bold text-slate-500">
                Composición
              </span>
            </div>
            <div className="space-y-2.5">
              {projected.map((l, i) => {
                const pct = totalCap > 0 ? Math.round((l.cap / totalCap) * 100) : 0;
                const color = RUBRO_COLORS[i % RUBRO_COLORS.length];
                return (
                  <div key={l.name}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[11px] text-slate-700 truncate flex-1">{l.name}</span>
                      <span className="text-[10px] font-bold tnum text-slate-500 ml-2">{pct}%</span>
                    </div>
                    <div className="h-[6px] w-full rounded-full bg-slate-100 overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all"
                        style={{ width: `${pct}%`, backgroundColor: color }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </DCard>
        </div>
      </div>
    </>
  );
}
