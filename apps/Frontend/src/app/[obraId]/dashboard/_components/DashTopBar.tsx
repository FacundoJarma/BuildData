"use client";

import { usePathname } from "next/navigation";
import {
  Magnifier,
  Bell,
} from "@gravity-ui/icons";
import { QuickAddMenu } from "./QuickAddMenu";
import { AvatarMenu } from "@/components/ui/AvatarMenu";
import { useDashboardData } from "./DashboardDataContext";

const CRUMB_MAP: Record<string, string> = {
  dashboard: "Dashboard",
  cronograma: "Cronograma",
  alertas: "Alertas",
  pedidos: "Pedidos",
  stock: "Stock",
  recibos: "Recibos",
  presupuesto: "Presupuesto",
  actividad: "Actividad",
  reportes: "Reportes",
  equipo: "Equipo",
};

export function DashTopBar({
  onQuickAdd,
}: {
  onQuickAdd?: (kind: string) => void;
}) {
  const pathname = usePathname();
  const segment = pathname.split("/").filter(Boolean).pop() || "dashboard";
  const crumb = CRUMB_MAP[segment] || "Dashboard";
  const { obraName } = useDashboardData();

  return (
    <header className="h-[52px] px-5 border-b border-slate-200 bg-white/85 backdrop-blur flex items-center justify-between gap-3 flex-none">
      <div className="text-[12px] text-slate-500">
        {obraName || "Obra"}{" "}
        <span className="mx-2 text-slate-300">/</span>
        <b className="text-slate-950">{crumb}</b>
      </div>
      <div className="flex gap-2">
        <div className="hidden md:flex items-center gap-2 w-[260px] bg-slate-50 border border-slate-200 rounded-md px-3 py-[6px] text-[12px] text-slate-500">
          <Magnifier width={14} height={14} />
          <input type="text" placeholder="Buscar tareas, pedidos, personas… " className="w-full bg-transparent focus:outline-none" />
        </div>
        {onQuickAdd && <QuickAddMenu onPick={onQuickAdd} />}
        <button className="w-9 h-9 rounded-md border border-slate-200 bg-white text-slate-600 flex items-center justify-center relative">
          <Bell width={15} height={15} />
          <span className="absolute top-[6px] right-[6px] w-2 h-2 rounded-full bg-critical border-2 border-white" />
        </button>
        <AvatarMenu />
      </div>

    </header>
  );
}
