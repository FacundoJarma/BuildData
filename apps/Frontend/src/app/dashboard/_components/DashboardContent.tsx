"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
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
import { DPill } from "@/components/ui/DPill";
import { DCard } from "@/components/ui/DCard";
import { DAvatar } from "@/components/ui/DAvatar";
import Button from "@/components/ui/Button";
import ProgressByTradeCards from "./ProgressByTradeCards";
import CriticalAlertsCard from "./CriticalAlertsCard";
import { BudgetCard } from "./BudgetCard";
import { ActivityFeed } from "./ActivityFeed";
import { SideDrawer } from "./SideDrawer";
import { useToast, DashToast } from "./useToast";
import { CategoryModal, type CategoryFormData } from "./CategoryModal";
import type { DashboardData } from "@/types/dashboard";

function formatCurrency(n: number): string {
  if (n >= 1_000_000) return `AR$ ${Math.round(n / 1_000_000)} M`;
  if (n >= 1_000) return `AR$ ${Math.round(n / 1_000)} K`;
  return `AR$ ${n}`;
}

function catProgress(cat: CategoryFormData, tradeProgress: DashboardData["tradeProgress"]): number {
  if (!cat.tradeNames.length) return 0;
  const sum = cat.tradeNames.reduce((a, name) => {
    const t = tradeProgress.find((tp) => tp.name === name);
    return a + (t ? t.pct : 0);
  }, 0);
  return Math.round(sum / cat.tradeNames.length);
}

interface Props {
  data: DashboardData;
  onNavigate?: (section: string) => void;
}

export function DashboardContent({ data, onNavigate }: Props) {
  const router = useRouter();
  const [toast, flash] = useToast();
  const [drawer, setDrawer] = useState<{ kind: string; catId?: string } | null>(null);
  const [catModal, setCatModal] = useState<{ initial: CategoryFormData | null } | null>(null);
  const [categories, setCategories] = useState<CategoryFormData[]>([]);

  const {
    obra,
    stats,
    budget,
    budgetBreakdown,
    tradeProgress,
    activityFeed,
    alerts,
  } = data;

  useEffect(() => {
    if (categories.length === 0 && tradeProgress.length > 0) {
      setCategories(
        tradeProgress.map((tp) => ({
          id: "cat-" + tp.name.toLowerCase().replace(/\s+/g, "-"),
          name: tp.name,
          color: tp.color,
          tradeNames: [tp.name],
        })),
      );
    }
  }, [tradeProgress, categories.length]);

  const pedidosMock = {
    porAprobar: stats.pedidosPendientes,
    enTransito: 4,
    demorados: 1,
    mesEnCurso: 14,
  };

  const totalAvance = categories.length
    ? Math.round(categories.reduce((a, c) => a + catProgress(c, tradeProgress), 0) / categories.length)
    : stats.avanceTotal;

  const handleNav = (section: string) => {
    if (onNavigate) {
      onNavigate(section);
    } else {
      router.push(`/construction?section=${section}`);
    }
  };

  const saveCategory = (cat: CategoryFormData) => {
    setCategories((prev) =>
      prev.find((c) => c.id === cat.id)
        ? prev.map((c) => (c.id === cat.id ? cat : c))
        : [...prev, cat],
    );
    flash(catModal?.initial ? "Categoría actualizada" : "Categoría creada");
  };

  const removeCategory = (id: string) => {
    setCategories((prev) => prev.filter((c) => c.id !== id));
    setDrawer(null);
    flash("Categoría eliminada");
  };

  const drawerCat = drawer && drawer.kind === "rubro"
    ? categories.find((c) => c.id === drawer.catId)
    : null;

  return (
    <>
      <DPageHeader
        title="Dashboard"
        subtitle={`${obra.name} · actualizado ${obra.lastUpdate}`}
        right={
          <>
            <Button
              variant="secondary"
              size="sm"
              icon={<FileArrowDown width={13} height={13} />}
              onClick={() => flash("Exportando dashboard a PDF…")}
            >
              Exportar
            </Button>
            <Button
              variant="primary"
              size="sm"
              icon={<Plus width={13} height={13} />}
              onClick={() => handleNav("Reportes")}
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
          value={`${totalAvance}`}
          suffix="%"
          icon={<ChartBar width={16} height={16} />}
          delta={stats.avanceDelta}
          deltaTone="success"
          onClick={() => setDrawer({ kind: "avance" })}
        />
        <DStatTile
          tone="critical"
          label="Alertas críticas"
          value={`${stats.alertasCriticas}`}
          icon={<CircleExclamation width={16} height={16} />}
          delta={stats.alertasDelta}
          deltaTone="critical"
          onClick={() => setDrawer({ kind: "alerts" })}
        />
        <DStatTile
          tone="attention"
          label="Pedidos"
          value={`${stats.pedidos}`}
          icon={<Box width={16} height={16} />}
          delta={`${stats.pedidosPendientes} por aprobar`}
          onClick={() => setDrawer({ kind: "pedidos" })}
        />
        <DStatTile
          tone="success"
          label="Tareas hoy"
          value={`${stats.tareasCompletadas}/${stats.tareasTotal}`}
          icon={<Check width={16} height={16} />}
          delta={`${Math.round((stats.tareasCompletadas / stats.tareasTotal) * 100)}% completadas`}
          deltaTone="success"
          onClick={() => setDrawer({ kind: "tareas" })}
        />
      </div>

      {/* Progress + Criticals */}
      <div className="grid grid-cols-[2fr_1fr] gap-3 mb-4">
        <ProgressByTradeCards
          data={tradeProgress}
          onItemClick={(name) => {
            const cat = categories.find((c) => c.tradeNames.includes(name));
            if (cat) setDrawer({ kind: "rubro", catId: cat.id });
          }}
          onNewCategory={() => setCatModal({ initial: null })}
          onViewAll={() => setDrawer({ kind: "avance" })}
        />
        <CriticalAlertsCard
          alerts={alerts}
          onItemClick={() => handleNav("Alertas")}
          onViewAll={() => handleNav("Alertas")}
        />
      </div>

      {/* Budget banner + Activity feed */}
      <div className="grid grid-cols-2 gap-3">
        <BudgetCard
          budget={budget}
          budgetBreakdown={budgetBreakdown}
          onViewBreakdown={() => setDrawer({ kind: "budget" })}
          onExport={() => flash("Exportando presupuesto a XLSX…")}
        />
        <ActivityFeed
          items={activityFeed}
          onItemClick={() => handleNav("Actividad")}
        />
      </div>

      {/* ── Detail drawers ─────────────────────────────────────── */}
      <SideDrawer
        open={drawer?.kind === "avance"}
        title="Avance total de la obra"
        subtitle="Resumen por categoría"
        onClose={() => setDrawer(null)}
        footer={
          <Button variant="primary" size="sm" className="flex-1 justify-center" onClick={() => { setDrawer(null); handleNav("Cronograma"); }}>
            Ver cronograma
          </Button>
        }
      >
        <div className="flex items-baseline gap-2 mb-4">
          <div className="text-[40px] font-extrabold display-tight tnum text-slate-950 leading-none">{totalAvance}%</div>
          <div className="text-[12px] text-slate-500">promedio de {categories.length} categorías</div>
        </div>
        <div className="space-y-3">
          {categories.map((c) => {
            const pct = catProgress(c, tradeProgress);
            return (
              <div key={c.id}>
                <div className="flex items-center justify-between text-[12px] mb-1">
                  <span className="font-semibold text-slate-800 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full" style={{ background: c.color }} />{c.name}
                  </span>
                  <span className="font-bold tnum">{pct}%</span>
                </div>
                <div className="bg-slate-100 h-[7px] rounded-full overflow-hidden">
                  <div style={{ width: pct + "%", background: c.color }} className="h-full rounded-full" />
                </div>
                <div className="text-[10px] text-slate-500 mt-1">{c.tradeNames.length} rubro{c.tradeNames.length === 1 ? "" : "s"} incluido{c.tradeNames.length === 1 ? "" : "s"}</div>
              </div>
            );
          })}
        </div>
      </SideDrawer>

      <SideDrawer
        open={drawer?.kind === "alerts"}
        title="Alertas críticas"
        subtitle={`${alerts.filter((a) => a.tone === "critical").length} sin resolver`}
        onClose={() => setDrawer(null)}
        footer={
          <Button variant="primary" size="sm" className="flex-1 justify-center" onClick={() => { setDrawer(null); handleNav("Alertas"); }}>
            Ir a Alertas
          </Button>
        }
      >
        <div className="space-y-3">
          {alerts.map((a, i) => (
            <div
              key={i}
              className={`border rounded-lg p-3 ${a.tone === "critical" ? "bg-critical-50 border-[#FECACA]" : "bg-attention-50 border-[#FDE68A]"}`}
            >
              <div className="flex items-center gap-2 mb-1">
                <CircleExclamation width={13} height={13} className={a.tone === "critical" ? "text-[#B91C1C]" : "text-[#A16207]"} />
                <span className="text-[13px] font-bold text-slate-950">{a.title}</span>
              </div>
              <div className="text-[11px] text-slate-600">{a.subtitle} · hace {a.time}</div>
            </div>
          ))}
        </div>
      </SideDrawer>

      <SideDrawer
        open={drawer?.kind === "pedidos"}
        title="Pedidos de materiales"
        subtitle={`${stats.pedidos} pendientes`}
        onClose={() => setDrawer(null)}
        footer={
          <Button variant="primary" size="sm" className="flex-1 justify-center" onClick={() => { setDrawer(null); handleNav("Pedidos"); }}>
            Ir a Pedidos
          </Button>
        }
      >
        <div className="grid grid-cols-2 gap-3 mb-4">
          {[
            { l: "Por aprobar", v: `${pedidosMock.porAprobar}`, t: "text-[#A16207]" },
            { l: "En tránsito", v: `${pedidosMock.enTransito}`, t: "text-[#1D4ED8]" },
            { l: "Demorados", v: `${pedidosMock.demorados}`, t: "text-[#B91C1C]" },
            { l: "Mes en curso", v: `${pedidosMock.mesEnCurso}`, t: "text-[#15803D]" },
          ].map((m) => (
            <div key={m.l} className="border border-slate-200 rounded-lg p-3">
              <div className={"text-[22px] font-extrabold tnum " + m.t}>{m.v}</div>
              <div className="text-[10px] tracking-[0.06em] uppercase font-bold text-slate-500 mt-1">{m.l}</div>
            </div>
          ))}
        </div>
        <div className="text-[12px] text-slate-600 leading-snug">
          Hay <b className="text-slate-950">{pedidosMock.porAprobar} pedidos</b> esperando tu aprobación.
        </div>
      </SideDrawer>

      <SideDrawer
        open={drawer?.kind === "tareas"}
        title="Tareas de hoy"
        subtitle={`${stats.tareasCompletadas} de ${stats.tareasTotal} completadas`}
        onClose={() => setDrawer(null)}
        footer={
          <Button variant="primary" size="sm" className="flex-1 justify-center" onClick={() => { setDrawer(null); handleNav("Cronograma"); }}>
            Ver cronograma
          </Button>
        }
      >
        <div className="mb-4">
          <div className="bg-slate-100 h-[8px] rounded-full overflow-hidden">
            <div style={{ width: `${Math.round((stats.tareasCompletadas / stats.tareasTotal) * 100)}%` }} className="h-full bg-success rounded-full" />
          </div>
          <div className="text-[11px] text-slate-500 mt-1">
            {Math.round((stats.tareasCompletadas / stats.tareasTotal) * 100)}% de las tareas de hoy completadas
          </div>
        </div>
        <div className="space-y-2">
          {activityFeed.map((a, i) => (
            <div key={i} className="flex items-center gap-3 border border-slate-200 rounded-lg p-3">
              <DAvatar initials={a.initials} size={28} />
              <div className="flex-1 min-w-0 text-[12px] leading-snug"><b>{a.name}</b> {a.action}</div>
              <div className="text-[10px] text-slate-500 tnum">{a.time}</div>
            </div>
          ))}
        </div>
      </SideDrawer>

      {/* Budget breakdown */}
      <SideDrawer
        open={drawer?.kind === "budget"}
        title="Desglose de presupuesto"
        subtitle={obra.name}
        onClose={() => setDrawer(null)}
        footer={
          <Button variant="primary" size="sm" className="flex-1 justify-center" icon={<FileArrowDown width={13} height={13} />} onClick={() => flash("Exportando presupuesto a XLSX…")}>
            Exportar XLSX
          </Button>
        }
      >
        <div className="grid grid-cols-3 gap-2 mb-5">
          {[
            { l: "Total", v: budget.total },
            { l: "Ejecutado", v: budget.ejecutado },
            { l: "Disponible", v: budget.disponible },
          ].map((m) => (
            <div key={m.l} className="border border-slate-200 rounded-lg p-3">
              <div className="text-[18px] font-extrabold tnum text-slate-950 leading-tight">{formatCurrency(m.v)}</div>
              <div className="text-[10px] tracking-[0.06em] uppercase font-bold text-slate-500 mt-1">{m.l}</div>
            </div>
          ))}
        </div>
        <div className="text-[10px] tracking-[0.06em] uppercase font-bold text-slate-500 mb-2">Por rubro</div>
        <div className="space-y-3">
          {budgetBreakdown.map((r) => {
            const over = r.spent > r.cap;
            const used = Math.min(100, Math.round((r.spent / r.cap) * 100));
            const compPct = Math.min(100 - used, Math.round((r.cap ? (r.cap - r.spent) / r.cap : 0) * 100));
            return (
              <div key={r.name} className="border border-slate-200 rounded-lg p-3">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[13px] font-bold text-slate-950">{r.name}</span>
                  {over
                    ? <DPill tone="criticalSolid">+{r.overPct}%</DPill>
                    : <span className="text-[11px] font-bold text-slate-500 tnum">{used}%</span>}
                </div>
                <div className="h-[8px] rounded-full overflow-hidden flex bg-slate-100">
                  <div style={{ width: used + "%" }} className={over ? "h-full bg-critical" : "h-full bg-primary"} />
                  <div style={{ width: compPct + "%" }} className="h-full bg-primary/40" />
                </div>
                <div className="flex items-center justify-between mt-2 text-[11px] text-slate-600 tnum">
                  <span>Ejecutado <b className={over ? "text-[#B91C1C]" : "text-slate-950"}>{formatCurrency(r.spent)}</b></span>
                  <span className="text-slate-400">Presupuesto {formatCurrency(r.cap)}</span>
                </div>
              </div>
            );
          })}
        </div>
      </SideDrawer>

      {/* Category detail */}
      <SideDrawer
        open={!!drawerCat}
        title={drawerCat ? drawerCat.name : ""}
        subtitle="Categoría de avance"
        accent={drawerCat ? drawerCat.color : undefined}
        onClose={() => setDrawer(null)}
        footer={drawerCat && (
          <>
            <Button variant="secondary" size="sm" onClick={() => { setCatModal({ initial: drawerCat }); }}>
              Editar
            </Button>
            <Button variant="secondary" size="sm" className="text-[#B91C1C]" onClick={() => removeCategory(drawerCat.id)}>
              Quitar
            </Button>
            <Button variant="primary" size="sm" className="flex-1 justify-center" onClick={() => { setDrawer(null); handleNav("Cronograma"); }}>
              Cronograma
            </Button>
          </>
        )}
      >
        {drawerCat && (
          <>
            <div className="flex items-baseline gap-2 mb-4">
              <div className="text-[40px] font-extrabold display-tight tnum text-slate-950 leading-none">{catProgress(drawerCat, tradeProgress)}%</div>
              <div className="text-[12px] text-slate-500">promedio de {drawerCat.tradeNames.length} rubro{drawerCat.tradeNames.length === 1 ? "" : "s"}</div>
            </div>
            <div className="bg-slate-100 h-[8px] rounded-full overflow-hidden mb-5">
              <div style={{ width: catProgress(drawerCat, tradeProgress) + "%", background: drawerCat.color }} className="h-full rounded-full" />
            </div>
            <div className="text-[10px] tracking-[0.06em] uppercase font-bold text-slate-500 mb-2">Rubros incluidos</div>
            <div className="space-y-2">
              {drawerCat.tradeNames.map((name) => {
                const t = tradeProgress.find((tp) => tp.name === name);
                if (!t) return null;
                return (
                  <div key={name} className="border border-slate-200 rounded-lg p-3">
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <span className="text-[12px] font-bold text-slate-950 truncate">{t.name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 bg-slate-100 h-[6px] rounded-full overflow-hidden">
                        <div style={{ width: t.pct + "%", background: t.color }} className="h-full rounded-full" />
                      </div>
                      <span className="text-[11px] font-bold tnum w-[34px] text-right">{t.pct}%</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </SideDrawer>

      <CategoryModal
        open={!!catModal}
        initial={catModal ? catModal.initial : null}
        availableTrades={tradeProgress}
        onClose={() => setCatModal(null)}
        onSave={saveCategory}
      />

      <DashToast msg={toast} />
    </>
  );
}
