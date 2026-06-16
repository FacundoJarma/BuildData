"use client";

import { useState, useEffect } from "react";
import { ChartBar, Check, Xmark } from "@gravity-ui/icons";

const CAT_COLORS = ["#0F4395", "#22C55E", "#3B82F6", "#F59E0B", "#94A3B8", "#8B5CF6", "#EF4444", "#14B8A6"];

export interface CategoryFormData {
  id: string;
  name: string;
  color: string;
  tradeNames: string[];
}

interface Props {
  open: boolean;
  initial: CategoryFormData | null;
  availableTrades: { name: string; pct: number; color: string }[];
  onClose: () => void;
  onSave: (cat: CategoryFormData) => void;
}

export function CategoryModal({ open, initial, availableTrades, onClose, onSave }: Props) {
  const [name, setName] = useState("");
  const [color, setColor] = useState(CAT_COLORS[0]);
  const [tradeNames, setTradeNames] = useState<string[]>([]);

  useEffect(() => {
    if (open) {
      setName(initial ? initial.name : "");
      setColor(initial ? initial.color : CAT_COLORS[0]);
      setTradeNames(initial ? [...initial.tradeNames] : []);
    }
  }, [open, initial]);

  useEffect(() => {
    if (!open) return;
    const k = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", k);
    return () => window.removeEventListener("keydown", k);
  }, [open, onClose]);

  if (!open) return null;

  const toggleTrade = (t: string) =>
    setTradeNames((p) => p.includes(t) ? p.filter((x) => x !== t) : [...p, t]);

  const preview = tradeNames.length
    ? Math.round(tradeNames.reduce((a, t) => {
        const found = availableTrades.find((at) => at.name === t);
        return a + (found ? found.pct : 0);
      }, 0) / tradeNames.length)
    : 0;

  const canSave = name.trim().length >= 2 && tradeNames.length > 0;

  const submit = () => {
    if (!canSave) return;
    onSave({
      id: initial ? initial.id : "cat-" + Date.now().toString(36),
      name: name.trim(),
      color,
      tradeNames,
    });
    onClose();
  };

  return (
    <div onClick={onClose} className="fixed inset-0 z-[80] flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-fade-task">
      <div onClick={(e) => e.stopPropagation()} className="bg-white w-full max-w-[560px] max-h-[calc(100vh-48px)] rounded-2xl shadow-big overflow-hidden flex flex-col animate-modal-pop">
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between flex-none">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-md flex items-center justify-center" style={{ background: color + "22", color }}>
              <ChartBar width={16} height={16} />
            </div>
            <div>
              <div className="text-[15px] font-extrabold display-tight">{initial ? "Editar categoría" : "Nueva categoría"}</div>
              <div className="text-[11px] text-slate-500">El progreso se calcula con los rubros que adjuntes</div>
            </div>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-md hover:bg-slate-100 text-slate-500 hover:text-slate-950 flex items-center justify-center">
            <Xmark width={16} height={16} />
          </button>
        </div>

        <div className="p-6 space-y-4 overflow-y-auto">
          <label className="flex flex-col gap-[6px]">
            <span className="text-[11px] font-bold text-slate-700">Nombre*</span>
            <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Ej: Terminaciones, Fachada, Pintura…"
              className="bg-white border border-slate-200 rounded-md px-3 py-[9px] text-[13px] focus:border-primary focus:outline-none" />
          </label>

          <div>
            <div className="text-[11px] font-bold text-slate-700 mb-2">Color</div>
            <div className="flex gap-2 flex-wrap">
              {CAT_COLORS.map((c) => (
                <button key={c} onClick={() => setColor(c)}
                  className={"w-7 h-7 rounded-full transition-transform " + (color === c ? "ring-2 ring-offset-2 ring-slate-400 scale-110" : "hover:scale-105")}
                  style={{ background: c }} />
              ))}
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-bold text-slate-700">Rubros incluidos</span>
              <span className="text-[11px] text-slate-500">{tradeNames.length} seleccionado{tradeNames.length === 1 ? "" : "s"}</span>
            </div>
            <div className="border border-slate-200 rounded-lg max-h-[240px] overflow-y-auto">
              {availableTrades.length === 0 && (
                <div className="text-center text-slate-500 text-[12px] py-8">
                  No hay rubros disponibles.
                </div>
              )}
              {availableTrades.map((t) => {
                const on = tradeNames.includes(t.name);
                return (
                  <button key={t.name} type="button" onClick={() => toggleTrade(t.name)}
                    className="w-full flex items-center gap-3 px-3 py-[9px] hover:bg-slate-50 text-left border-b border-slate-100 last:border-b-0">
                    <span className={"w-[18px] h-[18px] rounded-[5px] border-2 flex items-center justify-center flex-none " + (on ? "bg-primary border-primary text-white" : "border-slate-300 bg-white")}>
                      {on && <Check width={11} height={11} />}
                    </span>
                    <span className="flex-1 min-w-0">
                      <span className="text-[12px] font-semibold text-slate-900 block truncate">{t.name}</span>
                    </span>
                    <span className="flex items-center gap-1 flex-none">
                      <span className="w-[6px] h-[6px] rounded-full" style={{ background: t.color }} />
                      <span className="text-[11px] font-bold tnum text-slate-600 w-[34px] text-right">{t.pct}%</span>
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <div className="px-6 py-3 border-t border-slate-200 bg-slate-50 flex items-center justify-between flex-none">
          <div className="text-[12px] text-slate-600">
            Progreso calculado: <b className="text-slate-950 tnum">{preview}%</b>
          </div>
          <div className="flex gap-2">
            <button onClick={onClose} className="text-[12px] font-bold text-slate-600 hover:text-slate-950 px-3 py-[8px]">Cancelar</button>
            <button onClick={submit} disabled={!canSave}
              className={"inline-flex items-center gap-2 text-[13px] font-bold rounded-md px-4 py-[9px] transition-colors " + (canSave ? "bg-primary hover:bg-primary-700 text-white" : "bg-slate-200 text-slate-500 cursor-not-allowed")}>
              {initial ? "Guardar" : "Crear categoría"} <Check width={14} height={14} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
