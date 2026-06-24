"use client";

import { useState, useEffect, useMemo } from "react";
import { Xmark, Check, Plus, Calendar } from "@gravity-ui/icons";
import type { TaskItem } from "../data";
import {
  PEOPLE,
  RUBRO_COLORS,
  WEEK_START_IDX,
  WEEK_COUNT,
  TODAY_WEEK,
  weekDate,
  fmtDateLong,
} from "../data";

interface Props {
  open: boolean;
  onClose: () => void;
  onCreate: (task: TaskItem) => void;
  defaultRubro?: string;
}

const RUBRO_NAMES = Object.keys(RUBRO_COLORS);

export function NuevaTareaModal({ open, onClose, onCreate, defaultRubro }: Props) {
  const [name, setName] = useState("");
  const [rubro, setRubro] = useState(defaultRubro || RUBRO_NAMES[0] || "");
  const [who, setWho] = useState(PEOPLE[0] || "");
  const [taskState, setTaskState] = useState("planned");
  const [startWeek, setStartWeek] = useState(TODAY_WEEK);
  const [duration, setDuration] = useState(3);
  const [cost, setCost] = useState("");
  const [desc, setDesc] = useState("");
  const [adding, setAdding] = useState(false);
  const [addVal, setAddVal] = useState("");
  const [extraRubros, setExtraRubros] = useState<string[]>([]);
  const [success, setSuccess] = useState(false);

  const allRubros = [...RUBRO_NAMES, ...extraRubros];

  useEffect(() => {
    if (!open) return;
    const k = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !adding) onClose();
    };
    window.addEventListener("keydown", k);
    return () => window.removeEventListener("keydown", k);
  }, [open, onClose, adding]);

  const startDate = useMemo(() => weekDate(startWeek), [startWeek]);
  const endDate = useMemo(() => weekDate(startWeek + duration, -1), [startWeek, duration]);

  const canSave = name.trim().length > 0 && rubro.trim().length > 0 && who.trim().length > 0;

  const handleCreate = () => {
    if (!canSave) return;
    const task: TaskItem = {
      id: `task-${Date.now()}`,
      name: name.trim(),
      who: who.trim(),
      start: startWeek,
      span: duration,
      state: taskState,
      pct: taskState === "done" ? 100 : taskState === "progress" ? 1 : 0,
      desc: desc.trim(),
      cost: cost.trim() || "—",
      deps: [],
      rubro: rubro.trim(),
    };
    onCreate(task);
    setSuccess(true);
  };

  const commitAdd = () => {
    const v = addVal.trim();
    if (v && !allRubros.includes(v)) {
      setExtraRubros((p) => [...p, v]);
      setRubro(v);
    }
    setAdding(false);
    setAddVal("");
  };

  if (!open) return null;

  if (success) {
    return (
      <div onClick={onClose} className="fixed inset-0 z-[80] flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-fade-task">
        <div onClick={(e) => e.stopPropagation()} className="bg-white w-full max-w-[440px] rounded-2xl shadow-big p-8 flex flex-col items-center gap-5 animate-modal-pop">
          <div className="w-14 h-14 rounded-full bg-success-50 flex items-center justify-center">
            <Check width={24} height={24} className="text-[#15803D]" />
          </div>
          <div className="text-center">
            <div className="text-[16px] font-extrabold text-slate-950">Tarea creada</div>
            <div className="text-[13px] text-slate-500 mt-1">{name} fue agregada al cronograma.</div>
          </div>
          <div className="flex gap-2 w-full">
            <button
              onClick={() => setSuccess(false)}
              className="flex-1 text-[12px] font-bold rounded-md px-4 py-[9px] bg-primary hover:bg-primary-700 text-white transition-colors"
            >
              Crear otra
            </button>
            <button
              onClick={onClose}
              className="flex-1 text-[12px] font-bold rounded-md px-4 py-[9px] border border-slate-200 text-slate-600 hover:text-slate-950 transition-colors"
            >
              Cerrar
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div onClick={onClose} className="fixed inset-0 z-[80] flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-fade-task">
      <div onClick={(e) => e.stopPropagation()} className="bg-white w-full max-w-[560px] max-h-[calc(100vh-48px)] rounded-2xl shadow-big overflow-hidden flex flex-col animate-modal-pop">
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between flex-none">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-md flex items-center justify-center bg-primary-50 text-primary">
              <Calendar width={16} height={16} />
            </div>
            <div className="text-[15px] font-extrabold display-tight">Nueva tarea</div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-md hover:bg-slate-100 text-slate-500 hover:text-slate-950 flex items-center justify-center"
          >
            <Xmark width={16} height={16} />
          </button>
        </div>

        <div className="p-6 space-y-4 overflow-y-auto">
          <label className="flex flex-col gap-[6px]">
            <span className="text-[11px] font-bold text-slate-700">Nombre de la tarea *</span>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ej: Hormigonado losa +4"
              className="bg-white border border-slate-200 rounded-md px-3 py-[9px] text-[13px] focus:border-primary focus:outline-none"
            />
          </label>

          <label className="flex flex-col gap-[6px]">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-slate-700">Rubro *</span>
              {!adding && (
                <button
                  type="button"
                  onClick={() => { setAdding(true); setAddVal(""); }}
                  className="text-[10px] font-bold text-primary hover:underline flex items-center gap-[3px]"
                >
                  <Plus width={10} height={10} /> Nuevo
                </button>
              )}
            </div>
            {adding ? (
              <div className="flex gap-1">
                <input
                  autoFocus
                  value={addVal}
                  onChange={(e) => setAddVal(e.target.value)}
                  onKeyDown={(e) => { if (e.key === "Enter") commitAdd(); else if (e.key === "Escape") setAdding(false); }}
                  placeholder="Nuevo rubro"
                  className="flex-1 min-w-0 bg-white border border-primary rounded-md px-3 py-[9px] text-[13px] focus:outline-none"
                />
                <button type="button" onClick={commitAdd} className="px-3 rounded-md bg-primary text-white flex items-center justify-center">
                  <Check width={14} height={14} />
                </button>
                <button type="button" onClick={() => setAdding(false)} className="px-2 rounded-md border border-slate-200 text-slate-500 flex items-center justify-center">
                  <Xmark width={14} height={14} />
                </button>
              </div>
            ) : (
              <select
                value={rubro}
                onChange={(e) => setRubro(e.target.value)}
                className="bg-white border border-slate-200 rounded-md px-3 py-[9px] text-[13px] focus:border-primary focus:outline-none"
              >
                {allRubros.map((r) => (
                  <option key={r} value={r}>{r}</option>
                ))}
              </select>
            )}
          </label>

          <div className="grid grid-cols-2 gap-3">
            <label className="flex flex-col gap-[6px]">
              <span className="text-[11px] font-bold text-slate-700">Responsable *</span>
              <select
                value={who}
                onChange={(e) => setWho(e.target.value)}
                className="bg-white border border-slate-200 rounded-md px-3 py-[9px] text-[13px] focus:border-primary focus:outline-none"
              >
                {PEOPLE.map((p) => (
                  <option key={p} value={p}>{p}</option>
                ))}
              </select>
            </label>

            <label className="flex flex-col gap-[6px]">
              <span className="text-[11px] font-bold text-slate-700">Estado</span>
              <select
                value={taskState}
                onChange={(e) => setTaskState(e.target.value)}
                className="bg-white border border-slate-200 rounded-md px-3 py-[9px] text-[13px] focus:border-primary focus:outline-none"
              >
                <option value="planned">Programado</option>
                <option value="progress">En curso</option>
                <option value="late">Retraso</option>
                <option value="done">Completado</option>
              </select>
            </label>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <label className="flex flex-col gap-[6px]">
              <span className="text-[11px] font-bold text-slate-700">Semana de inicio</span>
              <input
                type="number"
                min={WEEK_START_IDX}
                max={WEEK_START_IDX + WEEK_COUNT}
                value={startWeek}
                onChange={(e) => setStartWeek(Number(e.target.value))}
                className="bg-white border border-slate-200 rounded-md px-3 py-[9px] text-[13px] focus:border-primary focus:outline-none"
              />
            </label>

            <label className="flex flex-col gap-[6px]">
              <span className="text-[11px] font-bold text-slate-700">Duración (semanas)</span>
              <input
                type="number"
                min={1}
                max={20}
                value={duration}
                onChange={(e) => setDuration(Number(e.target.value))}
                className="bg-white border border-slate-200 rounded-md px-3 py-[9px] text-[13px] focus:border-primary focus:outline-none"
              />
            </label>
          </div>

          <div className="bg-primary-50 border border-primary/20 rounded-lg p-3">
            <div className="text-[10px] tracking-[0.06em] uppercase font-bold text-primary mb-1">Vista previa</div>
            <div className="text-[13px] font-bold text-slate-950">
              {fmtDateLong(startDate)} → {fmtDateLong(endDate)}
            </div>
            <div className="text-[11px] text-slate-600 mt-1">
              Semana {startWeek} → Semana {startWeek + duration - 1} ({duration} semanas)
            </div>
          </div>

          <label className="flex flex-col gap-[6px]">
            <span className="text-[11px] font-bold text-slate-700">Costo estimado</span>
            <input
              value={cost}
              onChange={(e) => setCost(e.target.value)}
              placeholder="Ej: AR$ 5,2 M"
              className="bg-white border border-slate-200 rounded-md px-3 py-[9px] text-[13px] focus:border-primary focus:outline-none"
            />
          </label>

          <label className="flex flex-col gap-[6px]">
            <span className="text-[11px] font-bold text-slate-700">Descripción</span>
            <textarea
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
              placeholder="Qué hay que hacer, cantidades, observaciones…"
              rows={3}
              className="bg-white border border-slate-200 rounded-md px-3 py-[9px] text-[13px] focus:border-primary focus:outline-none resize-y min-h-[72px]"
            />
          </label>
        </div>

        <div className="px-6 py-3 border-t border-slate-200 bg-slate-50 flex items-center justify-end gap-2 flex-none">
          <button
            onClick={onClose}
            className="text-[12px] font-bold text-slate-600 hover:text-slate-950 px-3 py-[8px]"
          >
            Cancelar
          </button>
          <button
            onClick={handleCreate}
            disabled={!canSave}
            className={`inline-flex items-center gap-2 text-[13px] font-bold rounded-md px-4 py-[9px] transition-colors ${
              canSave
                ? "bg-primary hover:bg-primary-700 text-white"
                : "bg-slate-200 text-slate-500 cursor-not-allowed"
            }`}
          >
            Crear tarea <Check width={14} height={14} />
          </button>
        </div>
      </div>
    </div>
  );
}
