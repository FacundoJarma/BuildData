"use client";

import { Plus, FileArrowDown } from "@gravity-ui/icons";
import { LayoutHeaderCellsLarge } from "@gravity-ui/icons";

const TIPOS = [
  { id: "edificio",   name: "Edificio en altura",       sub: "Residencial multifamiliar",             duration: "12-24 meses", color: "#0F4395" },
  { id: "vivienda",   name: "Vivienda unifamiliar",     sub: "Casa o dúplex",                        duration: "6-12 meses",  color: "#22C55E" },
  { id: "refaccion",  name: "Refacción / remodelación", sub: "Reforma de obra existente",            duration: "2-6 meses",   color: "#F59E0B" },
  { id: "comercial",  name: "Comercial / industrial",   sub: "Oficinas, locales, depósito",          duration: "6-18 meses",  color: "#1A2238" },
];

const PLANTILLAS = [
  { id: "desde-cero", name: "Desde cero",     sub: "Yo voy cargando todo",                    icon: "plus" },
  { id: "plantilla",  name: "Usar plantilla",  sub: "Rubros y tareas típicas precargadas",    icon: "grid" },
  { id: "importar",   name: "Importar Excel",  sub: "Tengo un cronograma armado",             icon: "download" },
];

function BuildingSvg({ color }: { color: string }) {
  return (
    <svg width="18" height="14" viewBox="0 0 60 40">
      <rect x="6" y="22" width="9" height="14" rx="1.5" fill={color} opacity="0.6" />
      <rect x="20" y="14" width="9" height="22" rx="1.5" fill={color} opacity="0.85" />
      <rect x="34" y="4" width="9" height="32" rx="1.5" fill={color} />
    </svg>
  );
}

export function NewStep1Type({ data, setData }: { data: any; setData: (upd: (d: any) => any) => void }) {
  return (
    <>
      <div className="text-[10px] tracking-[0.06em] uppercase font-bold text-slate-500 mb-3">Tipo de obra</div>
      <div className="grid grid-cols-2 gap-3 mb-6">
        {TIPOS.map((t) => {
          const on = data.tipo === t.id;
          return (
            <button key={t.id} onClick={() => setData((d: any) => ({ ...d, tipo: t.id }))}
              className={`text-left rounded-lg border p-4 transition-all ${on ? "border-primary bg-primary-50 ring-2 ring-primary/20" : "border-slate-200 bg-white hover:border-slate-300"}`}>
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-md flex items-center justify-center flex-none" style={{ background: t.color + "20" }}>
                  <BuildingSvg color={t.color} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className={`text-[13.5px] font-bold ${on ? "text-primary" : "text-slate-950"}`}>{t.name}</div>
                  <div className="text-[11px] text-slate-500 mt-[2px]">{t.sub}</div>
                  <div className="text-[10px] tracking-[0.06em] uppercase font-bold text-slate-400 mt-2">Duración típica · {t.duration}</div>
                </div>
                <div className={`w-5 h-5 rounded-full border-2 flex-none flex items-center justify-center ${on ? "border-primary bg-primary" : "border-slate-300 bg-white"}`}>
                  {on && (
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  )}
                </div>
              </div>
            </button>
          );
        })}
      </div>

      <div className="text-[10px] tracking-[0.06em] uppercase font-bold text-slate-500 mb-3">¿Cómo querés arrancar?</div>
      <div className="grid grid-cols-3 gap-3">
        {PLANTILLAS.map((p) => {
          const on = data.plantilla === p.id;
          const icon = p.icon === "grid" ? <LayoutHeaderCellsLarge width={15} height={15} />
            : p.icon === "download" ? <FileArrowDown width={15} height={15} />
            : <Plus width={15} height={15} />;
          return (
            <button key={p.id} onClick={() => setData((d: any) => ({ ...d, plantilla: p.id }))}
              className={`rounded-lg border p-4 text-left transition-all ${on ? "border-primary bg-primary-50 ring-2 ring-primary/20" : "border-slate-200 bg-white hover:border-slate-300"}`}>
              <div className={`w-9 h-9 rounded-md flex items-center justify-center mb-3 ${on ? "bg-primary text-white" : "bg-slate-100 text-slate-600"}`}>
                {icon}
              </div>
              <div className={`text-[13px] font-bold ${on ? "text-primary" : "text-slate-950"}`}>{p.name}</div>
              <div className="text-[11px] text-slate-500 mt-[2px] leading-snug">{p.sub}</div>
            </button>
          );
        })}
      </div>
    </>
  );
}
