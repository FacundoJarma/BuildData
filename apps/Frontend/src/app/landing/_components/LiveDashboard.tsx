"use client";

import { useState, useEffect, useRef } from "react";
import {
  ChartBar, Calendar, CircleExclamation, Box, Magnifier, Bell,
  Check, FileArrowDown, Plus, TriangleExclamation, Ellipsis, Sparkles,
  ChevronRight, CircleCheck, Persons, Envelope, Clock, StarFill,
  CircleInfo, Paperclip,
} from "@gravity-ui/icons";

const DPill = ({ tone = "slate", children }: { tone?: string; children: React.ReactNode }) => {
  const map: Record<string, string> = {
    critical:       "bg-critical50 text-[#B91C1C]",
    attention:      "bg-attention50 text-[#A16207]",
    success:        "bg-success50 text-[#15803D]",
    info:           "bg-info50 text-[#1D4ED8]",
    primary:        "bg-primary-50 text-primary",
    slate:          "bg-slate100 text-slate700",
    inkSolid:       "bg-slate950 text-white",
    criticalSolid:  "bg-critical text-white",
    successSolid:   "bg-success text-white",
    attentionSolid: "bg-attention text-slate950",
  };
  return (
    <span className={`inline-flex items-center px-2 py-[3px] rounded text-[10px] font-bold tracking-[0.05em] uppercase whitespace-nowrap ${map[tone] || map.slate}`}>
      {children}
    </span>
  );
};

const DAvatar = ({ initials, size = 32 }: { initials: string; size?: number }) => {
  const palette: Record<string, string> = {
    JM: "from-primary to-info", CR: "from-info to-[#22C55E]",
    PS: "from-[#F59E0B] to-[#EF4444]", LB: "from-primary to-[#22C55E]",
    MO: "from-[#EF4444] to-[#F59E0B]", AG: "from-info to-primary",
    MR: "from-primary to-accent",
  };
  const grad = palette[initials] || "from-primary to-info";
  return (
    <div style={{ width: size, height: size, fontSize: Math.round(size * 0.36) }}
      className={`rounded-full bg-gradient-to-br ${grad} text-white font-bold flex items-center justify-center flex-none`}>
      {initials}
    </div>
  );
};

const DCard = ({ children, className = "", padding = "p-5" }: { children: React.ReactNode; className?: string; padding?: string }) => (
  <div className={`bg-white border border-slate200 rounded-lg shadow-card ${padding} ${className}`}>{children}</div>
);

const DButton = ({ variant = "primary", size = "md", icon, children, onClick, className = "" }: {
  variant?: string; size?: string; icon?: React.ReactNode; children?: React.ReactNode;
  onClick?: () => void; className?: string;
}) => {
  const variants: Record<string, string> = {
    primary:   "bg-primary hover:bg-primary-700 text-white border-primary",
    secondary: "bg-white hover:bg-slate50 text-slate700 border-slate300",
    ghost:     "bg-transparent hover:bg-slate100 text-primary border-transparent",
    danger:    "bg-critical hover:bg-[#B91C1C] text-white border-critical",
    accent:    "bg-accent hover:bg-accent-700 text-slate950 border-accent",
  };
  const sizes: Record<string, string> = { sm: "text-[12px] px-3 py-[6px]", md: "text-[13px] px-4 py-[8px]" };
  return (
    <button onClick={onClick}
      className={`inline-flex items-center gap-[6px] font-bold rounded-md border transition-colors ${variants[variant]} ${sizes[size]} ${className}`}>
      {icon}{children}
    </button>
  );
};

const DStatTile = ({ tone, label, value, suffix, icon, delta, deltaTone = "slate" }: {
  tone: string; label: string; value: string; suffix?: string; icon: string;
  delta?: string; deltaTone?: string;
}) => {
  const tones: Record<string, { tint: string; fg: string }> = {
    primary:   { tint: "bg-primary-50",  fg: "text-primary" },
    critical:  { tint: "bg-critical50",  fg: "text-[#B91C1C]" },
    attention: { tint: "bg-attention50", fg: "text-[#A16207]" },
    success:   { tint: "bg-success50",   fg: "text-[#15803D]" },
    info:      { tint: "bg-info50",      fg: "text-[#1D4ED8]" },
  };
  const t = tones[tone] || tones.primary;
  const dColor: Record<string, string> = { success: "text-[#15803D]", critical: "text-[#B91C1C]", slate: "text-slate500" };
  const iconMap: Record<string, React.ReactNode> = {
    chart: <ChartBar width={16} height={16} />, alert: <CircleExclamation width={16} height={16} />,
    package: <Box width={16} height={16} />, check: <Check width={16} height={16} />,
    truck: <Box width={16} height={16} />,
  };
  return (
    <DCard padding="p-4">
      <div className={`w-9 h-9 rounded-lg flex items-center justify-center mb-3 ${t.tint} ${t.fg}`}>
        {iconMap[icon]}
      </div>
      <div className="flex items-baseline gap-1">
        <div className="text-[26px] font-extrabold display-tight tnum text-slate950 leading-none">{value}</div>
        {suffix && <div className="text-base font-bold text-slate500">{suffix}</div>}
      </div>
      <div className="text-[10px] font-bold tracking-[0.06em] uppercase text-slate600 mt-1">{label}</div>
      {delta && <div className={`text-[11px] font-semibold mt-2 ${dColor[deltaTone] || dColor.slate}`}>{delta}</div>}
    </DCard>
  );
};

const DPageHeader = ({ title, subtitle, right }: {
  title: string; subtitle?: string; right?: React.ReactNode;
}) => (
  <div className="flex items-start justify-between gap-4 mb-5">
    <div>
      <h1 className="text-[22px] font-bold display-tight text-slate950 leading-tight">{title}</h1>
      {subtitle && <div className="text-[13px] text-slate500 mt-[2px]">{subtitle}</div>}
    </div>
    {right && <div className="flex items-center gap-2 flex-none">{right}</div>}
  </div>
);

const ScreenDashboard = () => (
  <>
    <DPageHeader
      title="Dashboard"
      subtitle="Edificio Belgrano · Sector C · actualizado hace 12 min"
      right={
        <>
          <DButton variant="secondary" size="sm" icon={<FileArrowDown width={13} height={13} />}>Exportar</DButton>
          <DButton variant="primary" size="sm" icon={<Plus width={13} height={13} />}>Nuevo reporte</DButton>
        </>
      }
    />
    <div className="grid grid-cols-4 gap-3 mb-4">
      <DStatTile tone="primary"   label="Avance total"     value="68" suffix="%" icon="chart"   delta="+4% esta semana" deltaTone="success" />
      <DStatTile tone="critical"  label="Alertas críticas" value="2"             icon="alert"   delta="+1 hoy" deltaTone="critical" />
      <DStatTile tone="attention" label="Pedidos"          value="7"             icon="package" delta="3 por aprobar" />
      <DStatTile tone="success"   label="Tareas hoy"       value="9/12"          icon="check"   delta="75% completadas" deltaTone="success" />
    </div>
    <div className="grid grid-cols-[2fr_1fr] gap-3 mb-4">
      <DCard padding="p-0">
        <div className="px-5 py-3 border-b border-slate200 flex items-center justify-between">
          <div>
            <div className="text-[14px] font-bold text-slate950">Avance por rubro</div>
            <div className="text-[11px] text-slate500 mt-[1px]">Comparado con presupuesto inicial</div>
          </div>
          <div className="flex bg-slate100 rounded-md p-[2px] gap-[2px]">
            {["Semana","Mes","Total"].map((s, i) => (
              <span key={s} className={`text-[11px] font-bold px-[10px] py-[5px] rounded ${i === 2 ? "bg-white text-slate950 shadow-card" : "text-slate600"}`}>{s}</span>
            ))}
          </div>
        </div>
        <div className="p-5 space-y-3">
          {[
            { name: "Mampostería",           pct: 88, tone: "#22C55E" },
            { name: "Hormigón armado",       pct: 62, tone: "#0F4395" },
            { name: "Instalaciones eléctricas", pct: 46, tone: "#3B82F6" },
            { name: "Instalaciones sanitarias", pct: 58, tone: "#3B82F6" },
            { name: "Terminaciones",         pct: 24, tone: "#F59E0B" },
            { name: "Carpintería",           pct: 12, tone: "#94A3B8" },
          ].map((r) => (
            <div key={r.name} className="grid grid-cols-[160px_1fr_44px] gap-3 items-center">
              <div className="text-[12px] font-semibold text-slate800">{r.name}</div>
              <div className="bg-slate100 h-[8px] rounded-full overflow-hidden">
                <div style={{ width: `${r.pct}%`, background: r.tone }} className="h-full rounded-full" />
              </div>
              <div className="text-[12px] font-bold text-right tnum">{r.pct}%</div>
            </div>
          ))}
        </div>
      </DCard>
      <DCard padding="p-0">
        <div className="px-5 py-3 border-b border-slate200 flex items-center justify-between">
          <div className="text-[14px] font-bold">Críticos activos</div>
          <DPill tone="criticalSolid">2</DPill>
        </div>
        <div className="divide-y divide-slate200">
          {[
            { title: "Falla en Grúa Torre 2", sub: "Sector C · J. Méndez", time: "12 min", tone: "critical" },
            { title: "Faltante: hierro 12 mm", sub: "Pedido sin aprobar", time: "2 h", tone: "critical" },
            { title: "Demora en hormigón",    sub: "Sector B · 3 días",  time: "ayer", tone: "attention" },
          ].map((a, i) => (
            <div key={i} className="px-4 py-3 flex items-start gap-3">
              <div className={`w-8 h-8 rounded-md flex items-center justify-center flex-none
                ${a.tone === "critical" ? "bg-critical50 text-[#B91C1C]" : "bg-attention50 text-[#A16207]"}`}>
                <CircleExclamation width={14} height={14} />
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-[12px] font-bold leading-tight">{a.title}</div>
                <div className="text-[10px] text-slate500 mt-[2px]">{a.sub} · hace {a.time}</div>
              </div>
            </div>
          ))}
        </div>
        <div className="p-3 border-t border-slate200">
          <DButton variant="secondary" size="sm" className="w-full justify-center">Ver todas las alertas</DButton>
        </div>
      </DCard>
    </div>
    <div className="grid grid-cols-2 gap-3">
      <div className="blueprint-bg rounded-lg p-5 text-white relative overflow-hidden">
        <div className="flex items-center gap-2 mb-3">
          <span className="inline-flex items-center gap-1 bg-accent/20 text-accent text-[9px] font-bold tracking-wider uppercase px-2 py-[3px] rounded">
            <Sparkles width={10} height={10} /> Análisis IA
          </span>
          <span className="text-[10px] text-white/60">hace 8 min</span>
        </div>
        <div className="text-[15px] font-bold leading-snug mb-2">El rubro hormigón armado se está retrasando 3 días respecto al cronograma.</div>
        <div className="text-[12px] text-white/70 leading-snug mb-4">
          Si no se acelera esta semana, las terminaciones de Sector B se mueven al 28 Oct. Hay 2 pedidos pendientes que pueden estar bloqueando.
        </div>
        <div className="flex gap-2">
          <DButton variant="accent" size="sm">Ver análisis completo</DButton>
          <DButton variant="ghost" size="sm" className="text-white hover:bg-white/10">Asignar a director</DButton>
        </div>
      </div>
      <DCard padding="p-0">
        <div className="px-5 py-3 border-b border-slate200">
          <div className="text-[14px] font-bold">Avances de hoy</div>
        </div>
        <div className="divide-y divide-slate200">
          {[
            { who: "JM", name: "J. Méndez", what: "Marcó completada Hormigonado losa +3", when: "08:42" },
            { who: "CR", name: "C. Ríos",   what: "Subió 4 fotos del Sector C",             when: "10:15" },
            { who: "LB", name: "L. Benítez", what: "Pedido de cemento aprobado",           when: "11:30" },
            { who: "PS", name: "P. Salas",  what: "Reportó falla en Grúa Torre 2",          when: "12:48" },
          ].map((a, i) => (
            <div key={i} className="px-4 py-[10px] flex items-center gap-3">
              <DAvatar initials={a.who} size={30} />
              <div className="flex-1 min-w-0 text-[12px] leading-snug">
                <b className="font-bold">{a.name}</b> {a.what}
              </div>
              <div className="text-[10px] text-slate500 tnum">{a.when}</div>
            </div>
          ))}
        </div>
      </DCard>
    </div>
  </>
);

const ScreenGantt = () => {
  const weeks = ["S15","S16","S17","S18","S19","S20","S21","S22","S23","S24","S25","S26"];
  const groups = [
    { rubro: "Movimiento de suelos", items: [
      { name: "Excavación general",     who: "C. Ríos",    start: 0, span: 2, state: "done" },
      { name: "Cimentación pilotes",    who: "C. Ríos",    start: 1, span: 3, state: "done" },
    ]},
    { rubro: "Hormigón armado", items: [
      { name: "Hormigonado losa +1",    who: "L. Benítez", start: 2, span: 3, state: "done" },
      { name: "Hormigonado losa +2",    who: "L. Benítez", start: 3, span: 3, state: "done" },
      { name: "Hormigonado losa +3",    who: "L. Benítez", start: 4, span: 4, state: "progress", pct: 62 },
      { name: "Columnas eje 4-6",       who: "L. Benítez", start: 5, span: 3, state: "late", pct: 30 },
    ]},
    { rubro: "Mampostería", items: [
      { name: "Tabiquería interior",    who: "P. Salas",   start: 6, span: 4, state: "planned" },
      { name: "Cierres exteriores",     who: "P. Salas",   start: 7, span: 4, state: "planned" },
    ]},
    { rubro: "Instalaciones", items: [
      { name: "Tendido eléctrico",      who: "M. Ortiz",   start: 7, span: 5, state: "planned" },
      { name: "Sanitarios",             who: "M. Ortiz",   start: 8, span: 4, state: "planned" },
    ]},
  ];
  const stateMap: Record<string, { bg: string; fg: string; label: string; border?: string }> = {
    done:     { bg: "#22C55E", fg: "#fff", label: "Completado" },
    progress: { bg: "#0F4395", fg: "#fff", label: "En curso" },
    late:     { bg: "#EF4444", fg: "#fff", label: "Retraso" },
    planned:  { bg: "#EFF6FF", fg: "#1D4ED8", label: "Programado", border: "#3B82F6" },
  };
  const cols = `260px repeat(${weeks.length}, 1fr)`;

  return (
    <>
      <DPageHeader
        title="Cronograma de tareas"
        subtitle="Vista general · 12 semanas · 4 rubros"
        right={
          <>
            <DButton variant="secondary" size="sm" icon={<FileArrowDown width={13} height={13} />}>Exportar</DButton>
            <DButton variant="primary" size="sm" icon={<Plus width={13} height={13} />}>Nueva tarea</DButton>
          </>
        }
      />
      <div className="flex justify-between items-center mb-3 flex-wrap gap-3">
        <div className="flex gap-4 flex-wrap">
          {Object.entries(stateMap).map(([k, v]) => (
            <div key={k} className="flex items-center gap-[6px] text-[11px] font-semibold text-slate600">
              <span style={{ background: v.bg, border: v.border ? `1px solid ${v.border}` : 0 }} className="w-3 h-3 rounded-sm inline-block" />
              {v.label}
            </div>
          ))}
        </div>
        <div className="flex bg-slate100 rounded-md p-[2px] gap-[2px]">
          {["Semana","Mes","Trimestre"].map((s, i) => (
            <span key={s} className={`text-[11px] font-bold px-3 py-[5px] rounded ${i === 0 ? "bg-white text-slate950 shadow-card" : "text-slate600"}`}>{s}</span>
          ))}
        </div>
      </div>

      <DCard padding="p-0" className="overflow-hidden">
        <div style={{ gridTemplateColumns: cols }} className="grid bg-slate50 border-b border-slate200">
          <div className="px-4 py-[10px] text-[10px] tracking-[0.06em] uppercase font-bold text-slate500">Tarea</div>
          {weeks.map((w) => (
            <div key={w} className="px-1 py-[10px] text-[10px] font-bold text-slate500 text-center border-l border-slate200">{w}</div>
          ))}
        </div>
        {groups.map((g) => (
          <div key={g.rubro}>
            <div className="px-4 py-[6px] bg-slate100/70 border-b border-slate200 text-[10px] tracking-[0.06em] uppercase font-bold text-slate700">{g.rubro}</div>
            {g.items.map((t) => {
              const s = stateMap[t.state];
              return (
                <div key={t.name} style={{ gridTemplateColumns: cols }} className="grid items-center border-b border-slate200 last:border-b-0 min-h-[44px]">
                  <div className="px-4 py-2">
                    <div className="text-[12px] font-semibold text-slate950 leading-tight">{t.name}</div>
                    <div className="text-[10px] text-slate500 mt-[1px]">{t.who}</div>
                  </div>
                  <div className="relative h-full border-l border-slate200" style={{ gridColumn: `2 / span ${weeks.length}` }}>
                    <div style={{ gridTemplateColumns: `repeat(${weeks.length}, 1fr)` }} className="grid absolute inset-0">
                      {weeks.map((_, i) => i > 0 && <div key={i} className="border-l border-dashed border-slate100" />)}
                    </div>
                    <div style={{
                      left: `calc(${t.start} * (100% / ${weeks.length}))`,
                      width: `calc(${t.span} * (100% / ${weeks.length}) - 6px)`,
                      background: s.bg, color: s.fg, border: s.border ? `1px solid ${s.border}` : 0,
                    }} className="absolute top-1/2 -translate-y-1/2 ml-[3px] h-[22px] rounded px-2 flex items-center text-[10px] font-bold gap-[6px] overflow-hidden whitespace-nowrap shadow-card">
                      {t.pct != null && t.state === "progress" && (
                        <div className="absolute inset-0 bg-white/20" style={{ clipPath: `inset(0 0 0 ${t.pct}%)` }} />
                      )}
                      <span className="relative z-10">{s.label}{t.pct != null && t.state !== "done" ? ` · ${t.pct}%` : ""}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ))}
      </DCard>
    </>
  );
};

const ScreenAlerts = () => {
  const [tab, setTab] = useState("todas");
  const alerts = [
    { id: 1, lvl: "critical",  title: "Falla en Grúa Torre 2",                       sector: "Sector C", who: "J. Méndez",  time: "hace 12 min", desc: "Motor principal no responde. Cuadrilla detenida hasta revisión técnica.", actions: ["Asignar técnico","Detener tareas"] },
    { id: 2, lvl: "critical",  title: "Faltante de hierro 12 mm para columnas",     sector: "Sector B", who: "L. Benítez", time: "hace 2 h",    desc: "No hay material para continuar armado de columnas eje 4–6. Pedido sin aprobar.", actions: ["Aprobar pedido","Ver alternativas"] },
    { id: 3, lvl: "attention", title: "Demora en entrega de hormigón",               sector: "Sector B", who: "C. Ríos",    time: "hace 5 h",    desc: "Proveedor confirmó retraso de 24 h en próxima entrega.", actions: ["Reprogramar tarea"] },
    { id: 4, lvl: "attention", title: "Cuadrilla incompleta",                        sector: "Sector A", who: "P. Salas",   time: "ayer",        desc: "2 ausentes sin aviso. Tarea de mampostería pausada.", actions: ["Reasignar"] },
    { id: 5, lvl: "moderate",  title: "Sin reporte diario",                          sector: "Sector D", who: "M. Ortiz",   time: "ayer",        desc: "Capataz no envió cierre de jornada. Bot envió recordatorio.", actions: ["Recordar"] },
    { id: 6, lvl: "resolved",  title: "Cemento entregado",                           sector: "Sector A", who: "L. Benítez", time: "hoy 09:14",   desc: "12 bolsas descargadas y registradas en stock.", actions: [] },
  ];
  const tones: Record<string, { tag: string; box: string; ico: string; pillTone: string }> = {
    critical:  { tag: "CRÍTICO",    box: "bg-critical50 border-[#FECACA]",  ico: "bg-[#FECACA] text-[#B91C1C]", pillTone: "criticalSolid" },
    attention: { tag: "IMPORTANTE", box: "bg-attention50 border-[#FDE68A]", ico: "bg-[#FDE68A] text-[#A16207]", pillTone: "attentionSolid" },
    moderate:  { tag: "MODERADO",   box: "bg-white border-slate200",         ico: "bg-slate100 text-slate700",   pillTone: "slate" },
    resolved:  { tag: "RESUELTO",   box: "bg-success50 border-[#BBF7D0]",    ico: "bg-[#BBF7D0] text-[#15803D]", pillTone: "successSolid" },
  };
  const tabs = [
    { id: "todas",       label: "Todas",       count: 6, match: () => true },
    { id: "criticos",    label: "Críticos",    count: 2, match: (a: any) => a.lvl === "critical" },
    { id: "importantes", label: "Importantes", count: 2, match: (a: any) => a.lvl === "attention" },
    { id: "moderados",   label: "Moderados",   count: 1, match: (a: any) => a.lvl === "moderate" },
    { id: "resueltos",   label: "Resueltos",   count: 1, match: (a: any) => a.lvl === "resolved" },
  ];
  const active = tabs.find((t) => t.id === tab) || tabs[0];
  const list = alerts.filter(active.match);

  return (
    <>
      <DPageHeader
        title="Problemas y alertas"
        subtitle="Hay 2 alertas críticas pendientes."
        right={<DButton variant="primary" size="sm" icon={<Plus width={13} height={13} />}>Reportar problema</DButton>}
      />
      <div className="flex gap-1 border-b border-slate200 mb-4">
        {tabs.map((t) => {
          const on = tab === t.id;
          return (
            <button key={t.id} onClick={() => setTab(t.id)}
              className={`flex items-center gap-2 text-[12px] font-bold px-[14px] py-3 -mb-[1px] border-b-2 transition-colors
                ${on ? "text-primary border-primary" : "text-slate500 border-transparent hover:text-slate700"}`}>
              {t.label}
              <span className={`text-[10px] font-bold px-[6px] py-[2px] rounded-full ${on ? "bg-primary-50 text-primary" : "bg-slate100 text-slate700"}`}>{t.count}</span>
            </button>
          );
        })}
      </div>
      <div className="flex flex-col gap-3">
        {list.map((a: any) => {
          const t = tones[a.lvl];
          return (
            <div key={a.id} className={`border rounded-lg p-4 grid grid-cols-[40px_1fr_24px] gap-3 ${t.box}`}>
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${t.ico}`}>
                {a.lvl === "resolved" ? <Check width={16} height={16} /> : <CircleExclamation width={16} height={16} />}
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <div className="text-[14px] font-bold text-slate950">{a.title}</div>
                  <DPill tone={t.pillTone}>{t.tag}</DPill>
                </div>
                <div className="text-[11px] text-slate500 mb-2">{a.sector} · reportado por {a.who} · {a.time}</div>
                <div className="text-[12px] text-slate700 leading-snug">{a.desc}</div>
                {a.actions.length > 0 && (
                  <div className="flex gap-2 mt-3 flex-wrap">
                    {a.actions.map((act: string, i: number) => (
                      <DButton key={act} variant={i === 0 ? "primary" : "secondary"} size="sm">{act}</DButton>
                    ))}
                  </div>
                )}
              </div>
              <button className="text-slate500 self-start"><Ellipsis width={16} height={16} /></button>
            </div>
          );
        })}
        {list.length === 0 && (
          <div className="text-center text-slate500 py-12 text-[13px]">No hay alertas en esta categoría.</div>
        )}
      </div>
    </>
  );
};

const ScreenMaterials = () => {
  const [filter, setFilter] = useState("Todos");
  const orders = [
    { id: "PED-0142", mat: "Cemento Portland · 50 kg",  qty: "120 bolsas", prov: "Cementos del Plata", date: "15 Oct", state: "delivered",  total: "AR$ 480.000" },
    { id: "PED-0141", mat: "Hierro 12 mm · 12 m",       qty: "2,5 t",     prov: "Aceros Norte",        date: "18 Oct", state: "transit",    total: "AR$ 1.250.000" },
    { id: "PED-0140", mat: "Ladrillo cerámico 18×18",   qty: "8 000 u",   prov: "Cerámica San Pedro",  date: "22 Oct", state: "pending",    total: "AR$ 920.000", urgent: true },
    { id: "PED-0139", mat: "Arena fina",                 qty: "15 m³",    prov: "Áridos Río",           date: "—",      state: "late",       total: "AR$ 320.000" },
    { id: "PED-0138", mat: "Pintura látex blanco",      qty: "40 L",     prov: "Pinturas Capital",     date: "02 Nov", state: "approved",   total: "AR$ 145.000" },
    { id: "PED-0137", mat: "Cable subterráneo 3×6 mm",  qty: "200 m",    prov: "Eléctrica Plaza",      date: "08 Nov", state: "draft",      total: "AR$ 380.000" },
  ];
  const stateMap: Record<string, { tone: string; label: string }> = {
    delivered: { tone: "success",       label: "ENTREGADO" },
    transit:   { tone: "info",          label: "EN CAMINO" },
    pending:   { tone: "attentionSolid", label: "POR APROBAR" },
    late:      { tone: "criticalSolid",  label: "DEMORADO" },
    approved:  { tone: "primary",       label: "APROBADO" },
    draft:     { tone: "slate",         label: "BORRADOR" },
  };
  const filters = ["Todos","Pendientes","En camino","Demorados"];
  const filterFn: Record<string, (o: any) => boolean> = {
    "Todos": () => true,
    "Pendientes": (o) => o.state === "pending" || o.state === "approved" || o.state === "draft",
    "En camino": (o) => o.state === "transit",
    "Demorados": (o) => o.state === "late",
  };
  const list = orders.filter(filterFn[filter]);

  return (
    <>
      <DPageHeader
        title="Pedidos de materiales"
        subtitle="7 pedidos pendientes · 3 esperan tu aprobación."
        right={
          <>
            <DButton variant="secondary" size="sm">Filtros</DButton>
            <DButton variant="primary" size="sm" icon={<Plus width={13} height={13} />}>Nuevo pedido</DButton>
          </>
        }
      />
      <div className="grid grid-cols-4 gap-3 mb-4">
        <DStatTile tone="attention" label="Por aprobar"    value="3"  icon="package" />
        <DStatTile tone="info"      label="En tránsito"    value="4"  icon="truck" />
        <DStatTile tone="critical"  label="Demorados"      value="1"  icon="alert" />
        <DStatTile tone="success"   label="Mes en curso"   value="14" icon="check" delta="AR$ 4,8 M" />
      </div>
      <DCard padding="p-0" className="overflow-hidden">
        <div className="px-5 py-3 border-b border-slate200 flex items-center justify-between gap-3 flex-wrap">
          <div className="text-[14px] font-bold">Listado de pedidos</div>
          <div className="flex gap-1">
            {filters.map((t) => {
              const on = filter === t;
              return (
                <button key={t} onClick={() => setFilter(t)}
                  className={`text-[11px] font-bold px-3 py-[6px] rounded-full border transition-colors
                    ${on ? "bg-primary-50 text-primary border-primary" : "bg-white text-slate600 border-slate200 hover:border-slate300"}`}>
                  {t}
                </button>
              );
            })}
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-[12px]">
            <thead>
              <tr className="bg-slate50">
                {["Pedido","Material","Proveedor","Cantidad","Llegada","Total","Estado",""].map((h) => (
                  <th key={h} className="text-[9px] tracking-[0.06em] uppercase text-slate500 text-left font-bold px-4 py-[10px] border-b border-slate200">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {list.map((o: any, i: number) => {
                const s = stateMap[o.state];
                return (
                  <tr key={o.id} className={i < list.length - 1 ? "border-b border-slate200" : ""}>
                    <td className="px-4 py-3 font-bold text-[11px] text-slate500 tnum">{o.id}</td>
                    <td className="px-4 py-3">
                      <div className="font-bold text-slate950">{o.mat}</div>
                      {o.urgent && <DPill tone="criticalSolid">URGENTE</DPill>}
                    </td>
                    <td className="px-4 py-3 text-slate600">{o.prov}</td>
                    <td className="px-4 py-3 font-semibold tnum">{o.qty}</td>
                    <td className="px-4 py-3">{o.date}</td>
                    <td className="px-4 py-3 font-bold tnum">{o.total}</td>
                    <td className="px-4 py-3"><DPill tone={s.tone}>{s.label}</DPill></td>
                    <td className="px-4 py-3 text-right">
                      {o.state === "pending"
                        ? <DButton variant="primary" size="sm">Aprobar</DButton>
                        : <button className="text-slate500"><Ellipsis width={14} height={14} /></button>}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </DCard>
    </>
  );
};

const ScreenReports = () => {
  const groups = [
    { d: "Hoy", items: [
      { who: "JM", name: "J. Méndez",  role: "Director", time: "08:42", kind: "avance",   text: "Hormigonado losa +3 completado. Volumen final 28 m³.", tags: ["Sector A","Hormigón"] },
      { who: "CR", name: "C. Ríos",    role: "Capataz",  time: "10:15", kind: "foto",     text: "Subió 4 fotos del Sector C — armado de columnas.",     tags: ["Sector C","Foto"] },
      { who: "PS", name: "P. Salas",   role: "Capataz",  time: "12:48", kind: "problema", text: "Falla en Grúa Torre 2. Motor no responde.",           tags: ["Sector C","Crítico"], severity: "critical" },
    ]},
    { d: "Ayer", items: [
      { who: "LB", name: "L. Benítez", role: "Compras", time: "17:30", kind: "pedido",   text: "Pedido de cemento aprobado y enviado al proveedor.", tags: ["PED-0142","Compras"] },
      { who: "MO", name: "M. Ortiz",   role: "Capataz", time: "18:05", kind: "cierre",   text: "Cierre de jornada Sector D — 6 personas, 0 incidentes.", tags: ["Sector D"] },
    ]},
  ];
  const kindIcon: Record<string, { ico: React.ReactNode; tint: string }> = {
    avance:   { ico: <Check width={11} height={11} />,    tint: "bg-success50 text-[#15803D]" },
    foto:     { ico: <Camera width={11} height={11} />,    tint: "bg-info50 text-[#1D4ED8]" },
    problema: { ico: <CircleExclamation width={11} height={11} />,    tint: "bg-critical50 text-[#B91C1C]" },
    pedido:   { ico: <Box width={11} height={11} />,   tint: "bg-attention50 text-[#A16207]" },
    cierre:   { ico: <Calendar width={11} height={11} />, tint: "bg-primary-50 text-primary" },
  };
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState<string | null>(null);
  const suggested = [
    "¿Cuántas horas se trabajaron en Sector C esta semana?",
    "¿Qué pedidos vencen en los próximos 7 días?",
    "Resumen de problemas críticos del mes",
  ];
  const answersDB: Record<string, string> = {
    "¿Cuántas horas se trabajaron en Sector C esta semana?": "En Sector C se trabajaron **184 hs** esta semana, 12% menos que la anterior. Caída atribuible a la falla de Grúa Torre 2 (jueves).",
    "¿Qué pedidos vencen en los próximos 7 días?": "Vencen 4 pedidos: **PED-0140** (Ladrillo, 22 Oct), **PED-0141** (Hierro 12 mm, 18 Oct), **PED-0143** (Arena, 21 Oct) y **PED-0144** (Pintura, 23 Oct). 1 está sin aprobar.",
    "Resumen de problemas críticos del mes": "Este mes hubo **6 alertas críticas**: 3 por faltantes de material, 2 por fallas técnicas y 1 por accidente leve. Tiempo promedio de resolución: 14 hs.",
  };
  const ask = (q: string) => { setQuestion(q); setAnswer(answersDB[q] || "Analizando reportes…"); };

  return (
    <>
      <DPageHeader
        title="Reportes de obra"
        subtitle="Todo lo que el bot capturó desde WhatsApp, en un solo lugar."
        right={
          <>
            <DButton variant="secondary" size="sm" icon={<FileArrowDown width={13} height={13} />}>Exportar PDF</DButton>
            <DButton variant="primary" size="sm" icon={<Plus width={13} height={13} />}>Nuevo reporte</DButton>
          </>
        }
      />
      <div className="grid grid-cols-[2fr_1fr] gap-4">
        <div className="flex flex-col gap-4">
          {groups.map((g) => (
            <div key={g.d}>
              <div className="text-[11px] tracking-[0.06em] uppercase font-bold text-slate500 mb-2">{g.d}</div>
              <DCard padding="p-0">
                {g.items.map((r: any, i: number) => {
                  const k = kindIcon[r.kind];
                  return (
                    <div key={i} className={`grid grid-cols-[40px_1fr_24px] gap-3 p-4 items-start ${i < g.items.length - 1 ? "border-b border-slate200" : ""}`}>
                      <DAvatar initials={r.who} size={36} />
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          <b className="text-[13px] text-slate950">{r.name}</b>
                          <span className="text-[10px] text-slate500">{r.role} · {r.time}</span>
                          <span className={`w-5 h-5 rounded inline-flex items-center justify-center ${k.tint}`}>
                            {k.ico}
                          </span>
                        </div>
                        <div className="text-[12px] text-slate700 leading-snug mb-2">{r.text}</div>
                        <div className="flex gap-[6px] flex-wrap">
                          {r.tags.map((t: string) => (
                            <DPill key={t} tone={r.severity === "critical" && t === "Crítico" ? "criticalSolid" : "slate"}>{t}</DPill>
                          ))}
                        </div>
                      </div>
                      <button className="text-slate500"><Ellipsis width={14} height={14} /></button>
                    </div>
                  );
                })}
              </DCard>
            </div>
          ))}
        </div>
        <DCard padding="p-0" className="self-start">
          <div className="px-4 py-3 border-b border-slate200 flex items-center gap-2">
            <span className="w-7 h-7 rounded-md bg-ink-deep text-accent flex items-center justify-center">
              <Sparkles width={13} height={13} />
            </span>
            <div className="text-[13px] font-bold">Preguntale a tus reportes</div>
          </div>
          <div className="p-4">
            <div className="text-[10px] tracking-[0.06em] uppercase font-bold text-slate500 mb-2">Sugeridas</div>
            <div className="flex flex-col gap-2">
              {suggested.map((q) => (
                <button key={q} onClick={() => ask(q)}
                  className="text-left text-[12px] text-slate700 bg-slate50 hover:bg-primary-50 hover:text-primary border border-slate200 rounded-lg p-3 leading-snug transition-colors">
                  {q}
                </button>
              ))}
            </div>
            {answer && (
              <div className="mt-3 bg-ink-deep text-white rounded-lg p-3 relative overflow-hidden">
                <div className="text-[10px] tracking-[0.06em] uppercase font-bold text-accent mb-1">Respuesta IA</div>
                <div className="text-[12px] leading-snug"
                  dangerouslySetInnerHTML={{ __html: answer.replace(/\*\*(.+?)\*\*/g, "<b>$1</b>") }} />
              </div>
            )}
          </div>
          <div className="p-3 border-t border-slate200 flex gap-2 items-center">
            <input value={question} onChange={(e) => setQuestion(e.target.value)}
              placeholder="Escribí tu pregunta..."
              className="flex-1 text-[12px] bg-white border border-slate300 rounded-md px-3 py-[7px] outline-none focus:border-primary" />
            <DButton variant="primary" size="sm" icon={<ArrowRightIcon />} onClick={() => ask(question)} />
          </div>
        </DCard>
      </div>
    </>
  );
};

// Need Camera icon — use inline SVG
function Camera({ width = 12, height = 12 }: { width?: number; height?: number }) {
  return (
    <svg width={width} height={height} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
      <circle cx="12" cy="13" r="4" />
    </svg>
  );
}

function ArrowRightIcon({ width = 13, height = 13 }: { width?: number; height?: number }) {
  return (
    <svg width={width} height={height} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M5 12h14M12 5l7 7-7 7" />
    </svg>
  );
}

const ScreenTeam = () => {
  const people = [
    { who: "JM", name: "J. Méndez",  role: "Director de obra", sector: "Toda la obra", tasks: 14, reports: 38 },
    { who: "CR", name: "C. Ríos",    role: "Capataz",          sector: "Sector A",     tasks: 7,  reports: 22 },
    { who: "PS", name: "P. Salas",   role: "Capataz",          sector: "Sector C",     tasks: 9,  reports: 31 },
    { who: "LB", name: "L. Benítez", role: "Compras",          sector: "Toda la obra", tasks: 4,  reports: 18 },
    { who: "MO", name: "M. Ortiz",   role: "Capataz",          sector: "Sector D",     tasks: 6,  reports: 12 },
    { who: "AG", name: "A. Gómez",   role: "Arquitecta",       sector: "Toda la obra", tasks: 3,  reports: 9 },
  ];
  return (
    <>
      <DPageHeader title="Equipo de trabajo" subtitle="6 personas activas en Edificio Belgrano." />
      <div className="grid grid-cols-3 gap-3">
        {people.map((p) => (
          <DCard key={p.who}>
            <div className="flex items-center gap-3 mb-3">
              <DAvatar initials={p.who} size={44} />
              <div>
                <div className="text-[14px] font-bold leading-tight">{p.name}</div>
                <div className="text-[11px] text-slate500 mt-[2px]">{p.role} · {p.sector}</div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3 pt-3 border-t border-slate200">
              <div>
                <div className="text-[10px] tracking-[0.06em] uppercase font-bold text-slate500">Tareas</div>
                <div className="text-[18px] font-extrabold tnum mt-1">{p.tasks}</div>
              </div>
              <div>
                <div className="text-[10px] tracking-[0.06em] uppercase font-bold text-slate500">Reportes</div>
                <div className="text-[18px] font-extrabold tnum mt-1">{p.reports}</div>
              </div>
            </div>
          </DCard>
        ))}
      </div>
    </>
  );
};

const SCREENS = [
  { id: "dashboard", label: "Dashboard",  icon: "grid",     crumb: "Dashboard",  Comp: ScreenDashboard },
  { id: "gantt",     label: "Cronograma", icon: "calendar", crumb: "Cronograma", Comp: ScreenGantt },
  { id: "alerts",    label: "Alertas",    icon: "alert",    crumb: "Alertas",    Comp: ScreenAlerts, badge: 2 },
  { id: "materials", label: "Pedidos",    icon: "package",  crumb: "Pedidos",    Comp: ScreenMaterials, badge: 7 },
  { id: "reports",   label: "Reportes",   icon: "chart",    crumb: "Reportes",   Comp: ScreenReports },
  { id: "team",      label: "Equipo",     icon: "users",    crumb: "Equipo",     Comp: ScreenTeam },
];

function DashSidebar({ current, onNav, items = SCREENS, projectLabel = "Edificio Belgrano", projectSub = "Sector C · 68% completa", userInitials = "JM", userName = "J. Méndez", userRole = "Director de obra" }: {
  current: string; onNav: (id: string) => void; items?: typeof SCREENS;
  projectLabel?: string; projectSub?: string; userInitials?: string; userName?: string; userRole?: string;
}) {
  const iconMap: Record<string, React.ReactNode> = {
    grid: <ChartBar width={16} height={16} />,
    calendar: <Calendar width={16} height={16} />,
    alert: <CircleExclamation width={16} height={16} />,
    package: <Box width={16} height={16} />,
    chart: <ChartBar width={16} height={16} />,
    users: <Persons width={16} height={16} />,
  };

  return (
    <aside className="w-[220px] bg-ink-deep text-white flex flex-col flex-none">
      <div className="px-4 py-4 flex items-center gap-[10px]">
        <svg width="28" height="28" viewBox="0 0 56 56" fill="none">
          <rect width="56" height="56" rx="12" fill="#0F4395" />
          <rect x="11" y="30" width="9" height="18" rx="2" fill="#FFFFFF" fillOpacity="0.85" />
          <rect x="23" y="20" width="9" height="28" rx="2" fill="#FFFFFF" />
          <rect x="35" y="10" width="9" height="38" rx="2" fill="#F59E0B" />
        </svg>
        <div className="font-extrabold text-[16px] display-tight">BuildData</div>
      </div>
      <div className="px-3 pb-3">
        <div className="bg-white/[0.06] rounded-lg px-3 py-[10px]">
          <div className="text-[9px] tracking-[0.06em] uppercase font-bold text-white/50">Obra activa</div>
          <div className="text-[13px] font-bold mt-[2px]">{projectLabel}</div>
          {projectSub && <div className="text-[11px] text-white/60 mt-[1px]">{projectSub}</div>}
        </div>
      </div>
      <nav className="px-3 flex-1 flex flex-col gap-1">
        {items.map((s) => {
          const on = current === s.id;
          return (
            <button key={s.id} onClick={() => onNav(s.id)}
              className={`relative flex items-center gap-[10px] px-3 py-[8px] rounded-md text-[12px] font-semibold text-left transition-colors
                ${on ? "bg-white/10 text-white" : "text-white/70 hover:bg-white/[0.06] hover:text-white"}`}>
              {on && <span className="absolute -left-3 top-[8px] bottom-[8px] w-[3px] bg-accent rounded" />}
              <span className={on ? "text-accent" : "text-white/55"}>
                {iconMap[s.icon]}
              </span>
              <span className="flex-1">{s.label}</span>
              {(s as any).badge && (
                <span className={`text-[9px] font-bold px-[6px] py-[1.5px] rounded-full
                  ${s.id === "alerts" ? "bg-critical text-white" : "bg-white/20 text-white"}`}>{(s as any).badge}</span>
              )}
            </button>
          );
        })}
      </nav>
      <div className="border-t border-white/10 p-3 flex items-center gap-[10px]">
        <DAvatar initials={userInitials} size={30} />
        <div className="flex-1 min-w-0">
          <div className="text-[12px] font-bold">{userName}</div>
          <div className="text-[10px] text-white/55">{userRole}</div>
        </div>
      </div>
    </aside>
  );
}

function DashTopBar({ crumb }: { crumb: string }) {
  return (
    <header className="h-[52px] px-5 border-b border-slate200 bg-white/85 backdrop-blur flex items-center gap-3 flex-none">
      <div className="text-[12px] text-slate500">
        Obra Belgrano <span className="mx-2 text-slate300">/</span>
        <b className="text-slate950">{crumb}</b>
      </div>
      <div className="flex-1" />
      <div className="hidden md:flex items-center gap-2 w-[260px] bg-slate50 border border-slate200 rounded-md px-3 py-[6px] text-[12px] text-slate500">
        <Magnifier width={14} height={14} />
        <span>Buscar tareas, pedidos, personas…</span>
        <span className="ml-auto bg-white border border-slate200 text-[10px] font-bold px-[5px] py-[1px] rounded">⌘K</span>
      </div>
      <DButton variant="primary" size="sm" icon={<Plus width={13} height={13} />}>Nuevo</DButton>
      <button className="w-9 h-9 rounded-md border border-slate200 bg-white text-slate600 flex items-center justify-center relative">
        <Bell width={15} height={15} />
        <span className="absolute top-[6px] right-[6px] w-2 h-2 rounded-full bg-critical border-2 border-white" />
      </button>
      <DAvatar initials="JM" size={32} />
    </header>
  );
}

export default function LiveDashboard({ height = 720, initial = "dashboard" }: { height?: number; initial?: string }) {
  const [route, setRoute] = useState(initial);
  const s = SCREENS.find((x) => x.id === route) || SCREENS[0];
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (contentRef.current) contentRef.current.scrollTop = 0;
  }, [route]);

  return (
    <div style={{ height }} className="flex bg-paper rounded-lg overflow-hidden border border-slate200 shadow-big">
      <DashSidebar current={route} onNav={setRoute} items={SCREENS} />
      <div className="flex-1 min-w-0 flex flex-col">
        <DashTopBar crumb={s.crumb} />
        <main ref={contentRef} className="flex-1 overflow-y-auto bg-paper">
          <div className="p-6 max-w-[1100px] mx-auto">
            <s.Comp />
          </div>
        </main>
      </div>
    </div>
  );
}
