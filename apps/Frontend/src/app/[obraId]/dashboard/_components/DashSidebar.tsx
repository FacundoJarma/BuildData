"use client";

import type React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutHeaderCellsLarge,
  Calendar,
  CircleExclamation,
  Box,
  Receipt,
  ChartBar,
  Persons,
  Gear,
  CircleInfo,
  ChevronLeft,
} from "@gravity-ui/icons";
import { useDashboardData } from "./DashboardDataContext";

function buildNavItems(obraId: string): { id: string; label: string; href: string; icon: React.ReactNode; badge?: string | number }[] {
  const prefix = `/${obraId}/dashboard`;
  return [
    { id: "dashboard",  label: "Dashboard",   href: prefix, icon: <LayoutHeaderCellsLarge width={16} height={16} /> },
    { id: "cronograma", label: "Cronograma",  href: `${prefix}/cronograma`, icon: <Calendar width={16} height={16} /> },
    { id: "alertas",    label: "Alertas",     href: `${prefix}/alertas`,    icon: <CircleExclamation width={16} height={16} /> },
    { id: "pedidos",    label: "Pedidos",     href: `${prefix}/pedidos`,    icon: <Box width={16} height={16} /> },
    { id: "stock",      label: "Stock",       href: `${prefix}/stock`,      icon: <Box width={16} height={16} /> },
    { id: "recibos",    label: "Recibos",     href: `${prefix}/recibos`,    icon: <Receipt width={16} height={16} /> },
    { id: "presupuesto",label: "Presupuesto", href: `${prefix}/presupuesto`,icon: <ChartBar width={16} height={16} /> },
    { id: "actividad",  label: "Actividad",   href: `${prefix}/actividad`,  icon: <CircleInfo width={16} height={16} /> },
    { id: "reportes",   label: "Reportes",    href: `${prefix}/reportes`,   icon: <ChartBar width={16} height={16} /> },
    { id: "equipo",     label: "Equipo",      href: `${prefix}/equipo`,     icon: <Persons width={16} height={16} /> },
  ];
}

export function DashSidebar({
  projectLabel: explicitLabel,
  projectSub: explicitSub,
}: {
  projectLabel?: string;
  projectSub?: string;
}) {
  const pathname = usePathname();
  const { obraName, obraProgress, obraId } = useDashboardData();
  const projectLabel = explicitLabel ?? (obraName || "Edificio Belgrano");
  const projectSub = `0% completa`;
  const navItems = buildNavItems(obraId);

  return (
    <aside className="w-[220px] bg-ink-deep text-white flex flex-col flex-none">
      {/* Logo */}
      <div className="px-4 py-4 flex items-center gap-[10px]">
        <LogoMark />
        <div className="font-extrabold text-[16px] display-tight">BuildData</div>
      </div>

      {/* Project */}
      <div className="px-3 pb-3">
        <div className="bg-white/[0.06] rounded-lg px-3 py-[10px]">
          <div className="text-[9px] tracking-[0.06em] uppercase font-bold text-white/50">
            Obra activa
          </div>
          <div className="text-[13px] font-bold mt-[2px]">{projectLabel}</div>
          {projectSub && (
            <div className="text-[11px] text-white/60 mt-[1px]">{projectSub}</div>
          )}
        </div>
        <Link
          href="/projects"
          className="flex items-center rounded-md mt-4 font-semibold text-white/70"
        >
          <ChevronLeft width={10} height={10} className="text-white/55" />
          <span className="flex-1 text-[10px]">Volver a mis obras</span>
        </Link>
      </div>

      {/* Nav */}
      <nav className="px-3 flex-1 flex flex-col gap-1">
        {navItems.map((s) => {
          const on = pathname === s.href;
          return (
            <Link
              key={s.id}
              href={s.href}
              className={`relative flex items-center gap-[10px] px-3 py-[8px] rounded-md text-[12px] font-semibold text-left transition-colors
                ${on ? "bg-white/10 text-white" : "text-white/70 hover:bg-white/[0.06] hover:text-white"}`}
            >
              {on && (
                <span className="absolute -left-3 top-[8px] bottom-[8px] w-[3px] bg-accent rounded" />
              )}
              <span className={on ? "text-accent" : "text-white/55"}>
                {s.icon}
              </span>
              <span className="flex-1">{s.label}</span>
              {"badge" in s && s.badge ? (
                <span
                  className={`text-[9px] font-bold px-[6px] py-[1.5px] rounded-full
                    ${s.id === "alertas" ? "bg-critical text-white" : "bg-white/20 text-white"}`}
                >
                  {s.badge}
                </span>
              ) : null}
            </Link>
          );
        })}
      </nav>

      {/* Settings + Help */}
      <div className="px-3 pb-2 pt-1 flex flex-col gap-1">
        <Link
          href="/construction?section=Configuraci%C3%B3n"
          className="flex items-center gap-[10px] px-3 py-[8px] rounded-md text-[12px] font-semibold text-white/70 hover:bg-white/[0.06] hover:text-white transition-colors"
        >
          <span className="text-white/55"><Gear width={16} height={16} /></span>
          <span className="flex-1">Configuración</span>
        </Link>
        <Link
          href="/construction?section=Ayuda"
          className="flex items-center gap-[10px] px-3 py-[8px] rounded-md text-[12px] font-semibold text-white/70 hover:bg-white/[0.06] hover:text-white transition-colors"
        >
          <span className="text-white/55"><CircleInfo width={16} height={16} /></span>
          <span className="flex-1">Ayuda y soporte</span>
        </Link>
      </div>


    </aside>
  );
}

function LogoMark() {
  return (
    <svg width="28" height="28" viewBox="0 0 56 56" fill="none" className="flex-none">
      <rect width="56" height="56" rx="12" fill="#0F4395" />
      <rect x="11" y="30" width="9" height="18" rx="2" fill="white" fillOpacity="0.85" />
      <rect x="23" y="20" width="9" height="28" rx="2" fill="white" />
      <rect x="35" y="10" width="9" height="38" rx="2" fill="#F59E0B" />
    </svg>
  );
}
