"use client";

import { useState, useRef, useEffect } from "react";
import {
  Calendar,
  CircleExclamation,
  Box,
  ChartBar,
  Persons,
  Plus,
  ChevronDown,
} from "@gravity-ui/icons";

const QUICK_ADD_TYPES = [
  { kind: "tarea",   label: "Tarea",         sub: "Sumá una tarea al cronograma",         icon: Calendar,          tint: "bg-primary-50 text-primary" },
  { kind: "critico", label: "Crítico / alerta", sub: "Reportá un problema en obra",       icon: CircleExclamation, tint: "bg-critical-50 text-[#B91C1C]" },
  { kind: "pedido",  label: "Pedido",        sub: "Pedí material a un proveedor",          icon: Box,               tint: "bg-attention-50 text-[#A16207]" },
  { kind: "reporte", label: "Actividad",     sub: "Registrá un avance manual",            icon: ChartBar,          tint: "bg-info-50 text-[#1D4ED8]" },
  { kind: "persona", label: "Persona",       sub: "Invitá a alguien al equipo",           icon: Persons,           tint: "bg-success-50 text-[#15803D]" },
];

interface Props {
  onPick: (kind: string) => void;
}

export function QuickAddMenu({ onPick }: Props) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const h = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((o) => !o)}
        className="inline-flex items-center gap-[6px] font-bold rounded-md border transition-colors bg-primary hover:bg-primary-700 text-white border-primary text-[12px] px-3 py-[6px]"
      >
        <Plus width={13} height={13} />
        Nuevo
        <ChevronDown width={12} height={12} className={"transition-transform " + (open ? "rotate-180" : "")} />
      </button>
      {open && (
        <div className="absolute right-0 top-[42px] w-[268px] bg-white border border-slate-200 rounded-lg shadow-pop overflow-hidden z-50 animate-fade-task">
          <div className="px-4 py-2 text-[10px] tracking-[0.06em] uppercase font-bold text-slate-500 border-b border-slate-100">
            Agregar rápido
          </div>
          {QUICK_ADD_TYPES.map((t) => {
            const Icon = t.icon;
            return (
              <button
                key={t.kind}
                onClick={() => { setOpen(false); onPick(t.kind); }}
                className="w-full flex items-center gap-3 px-3 py-[10px] hover:bg-slate-50 text-left transition-colors"
              >
                <span className={"w-8 h-8 rounded-md flex items-center justify-center flex-none " + t.tint}>
                  <Icon width={15} height={15} />
                </span>
                <span className="min-w-0">
                  <span className="block text-[13px] font-bold text-slate-950">{t.label}</span>
                  <span className="block text-[11px] text-slate-500 truncate">{t.sub}</span>
                </span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
