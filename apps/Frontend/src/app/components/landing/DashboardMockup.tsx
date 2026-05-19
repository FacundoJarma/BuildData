"use client";

import {
  ChartBar,
  Calendar,
  CircleExclamation,
  Box,
  Envelope,
  Persons,
  Magnifier,
  Bell,
  Check,
  Plus,
  Sparkles,
  CircleCheck,
} from "@gravity-ui/icons";

function Pill({ tone = "success", children }: { tone?: string; children: React.ReactNode }) {
  const map: Record<string, { bg: string; fg: string }> = {
    success:   { bg: "#F0FDF4", fg: "#15803D" },
    critical:  { bg: "#FEF2F2", fg: "#B91C1C" },
    attention: { bg: "#FFFBEB", fg: "#A16207" },
    info:      { bg: "#EFF6FF", fg: "#1D4ED8" },
    primary:   { bg: "#EFF4FC", fg: "#0B3275" },
    neutral:   { bg: "#F1F5F9", fg: "#334155" },
  };
  const m = map[tone] || map.success;
  return (
    <span style={{ background: m.bg, color: m.fg }}
      className="inline-flex items-center px-2 py-[3px] rounded text-[10px] font-bold tracking-[0.06em] uppercase">
      {children}
    </span>
  );
}

function Avatar({ initials, size = 28, tone = "primary" }: { initials: string; size?: number; tone?: string }) {
  const tones: Record<string, string> = {
    primary: "#0F4395", accent: "#B45309", critical: "#B91C1C",
    success: "#15803D", info: "#1D4ED8", slate: "#334155",
  };
  return (
    <div style={{ width: size, height: size, background: "#EFF4FC", color: tones[tone], fontSize: size * 0.38 }}
      className="rounded-full flex items-center justify-center font-bold flex-none">
      {initials}
    </div>
  );
}

function StatTile({ tone, label, value, suffix, delta, icon }: {
  tone: string; label: string; value: string; suffix?: string; delta?: string; icon: string;
}) {
  const tones: Record<string, { tint: string; fg: string }> = {
    primary:   { tint: "#EFF4FC", fg: "#0F4395" },
    critical:  { tint: "#FEF2F2", fg: "#B91C1C" },
    attention: { tint: "#FFFBEB", fg: "#A16207" },
    success:   { tint: "#F0FDF4", fg: "#15803D" },
  };
  const t = tones[tone] || tones.primary;
  const iconMap: Record<string, React.ReactNode> = {
    chart: <ChartBar width={16} height={16} />,
    alert: <CircleExclamation width={16} height={16} />,
    package: <Box width={16} height={16} />,
    check: <Check width={16} height={16} />,
  };
  return (
    <div className="bg-white rounded-lg border border-slate200 p-4 shadow-card">
      <div className="flex items-center justify-between mb-3">
        <div style={{ background: t.tint, color: t.fg }} className="w-9 h-9 rounded-lg flex items-center justify-center">
          {iconMap[icon]}
        </div>
        {delta && <span className="text-[10px] font-bold text-slate500 tnum">{delta}</span>}
      </div>
      <div className="text-[11px] font-bold tracking-[0.06em] uppercase text-slate600 mb-1">{label}</div>
      <div className="flex items-baseline gap-1">
        <div className="text-[28px] font-extrabold display-tight tnum text-slate950 leading-none">{value}</div>
        {suffix && <div className="text-base font-bold text-slate500">{suffix}</div>}
      </div>
    </div>
  );
}

export default function DashboardMockup({ width = 980, compact = false }: { width?: number; compact?: boolean }) {
  return (
    <div style={{ width }} className="bg-paper rounded-xl border border-slate200 shadow-card2 overflow-hidden">
      <div className="flex">
        <div className="w-[180px] bg-white border-r border-slate200 px-3 py-4 flex flex-col gap-1">
          <div className="flex items-center gap-2 px-2 mb-3">
            <svg width="22" height="22" viewBox="0 0 56 56" fill="none">
              <rect width="56" height="56" rx="12" fill="#0F4395" />
              <rect x="11" y="30" width="9" height="18" rx="2" fill="#FFFFFF" fillOpacity="0.85" />
              <rect x="23" y="20" width="9" height="28" rx="2" fill="#FFFFFF" />
              <rect x="35" y="10" width="9" height="38" rx="2" fill="#F59E0B" />
            </svg>
            <span className="font-extrabold text-[15px]">BuildData</span>
          </div>
          {[
            { i: "chart", l: "Dashboard", a: true },
            { i: "calendar", l: "Cronograma" },
            { i: "alert", l: "Alertas", badge: "2" },
            { i: "package", l: "Pedidos" },
            { i: "message", l: "Reportes" },
            { i: "users", l: "Equipo" },
          ].map((it) => {
            const iconMap: Record<string, React.ReactNode> = {
              chart: <ChartBar width={14} height={14} />,
              calendar: <Calendar width={14} height={14} />,
              alert: <CircleExclamation width={14} height={14} />,
              package: <Box width={14} height={14} />,
              message: <Envelope width={14} height={14} />,
              users: <Persons width={14} height={14} />,
            };
            return (
              <div key={it.l}
                className={`flex items-center gap-2 px-2 py-[7px] rounded-md text-[12px] font-semibold ${it.a ? "bg-primary-50 text-primary" : "text-slate700"}`}>
                {iconMap[it.i]}
                <span className="flex-1">{it.l}</span>
                {it.badge && <span className="bg-critical text-white text-[9px] px-[5px] py-[1px] rounded-full font-bold">{it.badge}</span>}
              </div>
            );
          })}
          <div className="mt-auto pt-3 border-t border-slate200">
            <div className="flex items-center gap-2 px-2">
              <Avatar initials="JM" size={26} />
              <div>
                <div className="text-[11px] font-bold leading-tight">J. Méndez</div>
                <div className="text-[10px] text-slate500 leading-tight">Director de obra</div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex-1 min-w-0">
          <div className="h-[44px] bg-white/80 border-b border-slate200 backdrop-blur flex items-center px-4 gap-3">
            <div className="flex-1 flex items-center gap-2 bg-slate50 rounded-md px-2 py-[6px] border border-slate200">
              <Magnifier width={14} height={14} className="text-slate400" />
              <span className="text-[11px] text-slate500">Buscar obra, sector, pedido…</span>
            </div>
            <Bell width={16} height={16} className="text-slate600" />
            <span className="w-2 h-2 rounded-full bg-success live-dot" />
          </div>

          <div className="px-5 pt-4 pb-3 flex items-end justify-between">
            <div>
              <div className="text-[18px] font-bold leading-none mb-1">Edificio Belgrano</div>
              <div className="text-[11px] text-slate500">Sector C · actualizado hace 12 min</div>
            </div>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1 text-[10px] font-bold tracking-wide uppercase bg-success50 text-[#15803D] px-2 py-1 rounded">
                <span className="w-1.5 h-1.5 bg-success rounded-full" /> En curso
              </span>
              <button className="bg-primary text-white text-[11px] font-bold px-3 py-[7px] rounded-md flex items-center gap-1">
                <Plus width={12} height={12} /> Nuevo reporte
              </button>
            </div>
          </div>

          <div className="grid grid-cols-4 gap-2 px-5 mb-3">
            <StatTile tone="primary"   label="Avance"     value="68" suffix="%" icon="chart"   delta="+4%" />
            <StatTile tone="critical"  label="Críticas"   value="2"             icon="alert"   delta="+1 hoy" />
            <StatTile tone="attention" label="Pedidos"    value="7"             icon="package" delta="3 a aprobar" />
            <StatTile tone="success"   label="Tareas"     value="9/12"          icon="check"   delta="75%" />
          </div>

          <div className="grid grid-cols-[1.7fr_1fr] gap-2 px-5 pb-3">
            <div className="bg-white rounded-lg border border-slate200 shadow-card overflow-hidden">
              <div className="px-4 py-3 border-b border-slate200 flex items-center justify-between">
                <div className="text-[13px] font-bold">Avance por rubro</div>
                <div className="flex bg-slate100 rounded-md p-[2px] gap-[2px]">
                  {["Sem", "Mes", "Total"].map((l, i) => (
                    <span key={l} className={`text-[10px] font-bold px-2 py-[3px] rounded ${i === 2 ? "bg-white text-slate950 shadow-card" : "text-slate500"}`}>{l}</span>
                  ))}
                </div>
              </div>
              <div className="p-4 space-y-[10px]">
                {[
                  { name: "Mampostería",   pct: 88, tone: "#22C55E" },
                  { name: "Hormigón armado", pct: 62, tone: "#0F4395" },
                  { name: "Inst. eléctricas", pct: 46, tone: "#3B82F6" },
                  { name: "Inst. sanitarias", pct: 58, tone: "#3B82F6" },
                  { name: "Terminaciones", pct: 24, tone: "#F59E0B" },
                ].map((r) => (
                  <div key={r.name} className="grid grid-cols-[120px_1fr_36px] gap-3 items-center">
                    <div className="text-[11px] font-semibold text-slate800">{r.name}</div>
                    <div className="bg-slate100 h-2 rounded-full overflow-hidden">
                      <div style={{ width: `${r.pct}%`, background: r.tone }} className="h-full rounded-full" />
                    </div>
                    <div className="text-[11px] font-bold text-right tnum">{r.pct}%</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-lg border border-slate200 shadow-card overflow-hidden">
              <div className="px-4 py-3 border-b border-slate200 flex items-center justify-between">
                <div className="text-[13px] font-bold">Críticos activos</div>
                <span className="bg-critical text-white text-[10px] font-bold px-2 py-[2px] rounded">2</span>
              </div>
              <div className="divide-y divide-slate200">
                {[
                  { t: "Falla en Grúa Torre 2", s: "Sector C · hace 12 min", tone: "critical" },
                  { t: "Faltante: hierro 12 mm", s: "Pedido sin aprobar · 2 h", tone: "critical" },
                  { t: "Demora en hormigón",   s: "Sector B · 3 días",         tone: "attention" },
                ].map((a, i) => (
                  <div key={i} className="px-3 py-[10px] flex items-start gap-2">
                    <div style={{ background: a.tone === "critical" ? "#FEF2F2" : "#FFFBEB", color: a.tone === "critical" ? "#B91C1C" : "#A16207" }}
                      className="w-7 h-7 rounded-md flex items-center justify-center flex-none">
                      <CircleExclamation width={13} height={13} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="text-[11px] font-bold leading-tight">{a.t}</div>
                      <div className="text-[10px] text-slate500 mt-[2px]">{a.s}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {!compact && (
            <div className="px-5 pb-5">
              <div className="blueprint-bg rounded-lg p-4 text-white relative overflow-hidden">
                <div className="flex items-center gap-2 mb-2">
                  <span className="inline-flex items-center gap-1 bg-accent/20 text-accent text-[9px] font-bold tracking-wider uppercase px-2 py-[3px] rounded">
                    <Sparkles width={10} height={10} /> Análisis IA
                  </span>
                  <span className="text-[10px] text-white/60">hace 8 min</span>
                </div>
                <div className="text-[14px] font-bold leading-snug mb-1">El rubro hormigón armado se está retrasando 3 días respecto al cronograma.</div>
                <div className="text-[11px] text-white/70 leading-snug">Si no se acelera esta semana, las terminaciones de Sector B se mueven al 28 Oct.</div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
