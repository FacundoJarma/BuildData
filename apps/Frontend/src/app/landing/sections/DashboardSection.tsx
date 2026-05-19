"use client";

import { motion as m } from "framer-motion";
import { Sparkles, Magnifier } from "@gravity-ui/icons";
import LiveDashboard from "../../components/landing/LiveDashboard";
import { DASHBOARD_CALLOUTS } from "../data/landing";

const iconMap: Record<string, React.ReactNode> = {
  trending: <ChartTrendSvg />,
  shield: <ShieldSvg />,
  users: <UsersSvg />,
};

function ChartTrendSvg() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M22 6l-6 6-4-4-4 4-4-4" /><path d="M22 10V6h-4" />
    </svg>
  );
}

function ShieldSvg() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  );
}

function UsersSvg() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  );
}

export default function DashboardSection() {
  return (
    <section id="dashboard" className="py-[100px] bg-gradient-to-b from-paper to-primary-50/40 relative overflow-hidden">
      <div className="absolute inset-0 hero-mesh opacity-40 pointer-events-none" />
      <div className="relative max-w-[1320px] mx-auto px-6">
        <div className="max-w-[820px] mb-10">
          <div className="flex items-center gap-3 mb-3">
            <div className="eyebrow">Dashboard</div>
            <span className="inline-flex items-center gap-1 bg-success50 text-[#15803D] text-[10px] font-bold tracking-wider uppercase px-2 py-[3px] rounded-full">
              <span className="w-1.5 h-1.5 rounded-full bg-success live-dot" /> Demo en vivo
            </span>
          </div>
          <h2 className="text-[clamp(32px,4vw,48px)] leading-[1.08] font-extrabold display-tight text-slate950 mb-4">
            Una vista clara de cada obra.<br />
            <span className="text-primary">Tocá y exploralo.</span>
          </h2>
          <p className="text-[17px] leading-[26px] text-slate600 max-w-[640px]">
            Esto que ves abajo es el producto, funcionando. Navegá entre Dashboard, Cronograma, Alertas, Pedidos, Reportes y Equipo desde la barra lateral.
          </p>
        </div>

        <m.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7 }}
          className="relative">
          <div className="absolute inset-x-10 -inset-y-2 bg-primary/20 blur-3xl rounded-full -z-0" />
          <div className="relative bg-slate950 rounded-2xl p-3 shadow-big">
            <div className="flex items-center gap-3 px-3 py-2 mb-2">
              <div className="flex gap-[6px]">
                <span className="w-3 h-3 rounded-full bg-[#FF5F57]" />
                <span className="w-3 h-3 rounded-full bg-[#FEBC2E]" />
                <span className="w-3 h-3 rounded-full bg-[#28C840]" />
              </div>
              <div className="flex-1 max-w-[420px] mx-auto bg-slate800 text-slate400 text-[11px] rounded-md px-3 py-[5px] flex items-center gap-2 font-mono">
                <svg width="11" height="11" viewBox="0 0 24 24" fill="#22C55E"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                <span>app.buildata.com.ar / belgrano</span>
              </div>
              <div className="text-slate500 text-[11px] hidden md:flex items-center gap-3">
                <Magnifier width={12} height={12} />
                <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="5" r="2"/><circle cx="12" cy="12" r="2"/><circle cx="12" cy="19" r="2"/></svg>
              </div>
            </div>
            <LiveDashboard height={720} />
          </div>

          <div className="absolute -top-3 right-4 md:right-10 bg-white border border-slate200 shadow-pop rounded-full px-3 py-[6px] flex items-center gap-2 z-10">
            <Sparkles width={12} height={12} className="text-accent" />
            <span className="text-[11px] font-bold text-slate950">Hacé clic en el menú lateral</span>
          </div>
        </m.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-10">
          {DASHBOARD_CALLOUTS.map((c) => (
            <div key={c.t} className="bg-white border border-slate200 rounded-xl p-5 shadow-card">
              <div className="w-10 h-10 rounded-lg bg-primary-50 text-primary flex items-center justify-center mb-3">
                {iconMap[c.i]}
              </div>
              <div className="text-[15px] font-bold text-slate950 mb-1">{c.t}</div>
              <div className="text-[13px] text-slate600 leading-[20px]">{c.s}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
