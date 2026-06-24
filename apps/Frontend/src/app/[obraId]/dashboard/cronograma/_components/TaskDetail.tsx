"use client";

import { useEffect, useMemo } from "react";
import { Xmark, CircleCheck, ClockArrowRotateLeft } from "@gravity-ui/icons";
import { DPill } from "@/components/ui/DPill";
import { DAvatar } from "@/components/ui/DAvatar";
import Button from "@/components/ui/Button";
import type { TaskItem, TaskGroup } from "../data";
import {
  TASK_STATE_MAP,
  RUBRO_COLORS,
  fmtDateLong,
  weekDate,
} from "../data";

interface Props {
  taskId: string | null;
  groups: TaskGroup[];
  onClose: () => void;
  onComplete: (id: string) => void;
  onReopen: (id: string) => void;
}

const STATE_TONE: Record<string, "success" | "primary" | "critical" | "info"> = {
  done: "success",
  progress: "primary",
  late: "critical",
  planned: "info",
};

const TIMELINE: { label: string; time: string }[] = [
  { label: "Tarea creada", time: "hace 4 semanas" },
  { label: "Cambio de estado a En curso", time: "hace 3 semanas" },
  { label: "Avance reportado: 30%", time: "hace 2 semanas" },
  { label: "Avance reportado: 62%", time: "hace 5 días" },
];

export function TaskDetail({ taskId, groups, onClose, onComplete, onReopen }: Props) {
  const task = useMemo<TaskItem | null>(() => {
    if (!taskId) return null;
    for (const g of groups) {
      const found = g.items.find((t) => t.id === taskId);
      if (found) return found;
    }
    return null;
  }, [taskId, groups]);

  useEffect(() => {
    if (!taskId) return;
    const k = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", k);
    return () => window.removeEventListener("keydown", k);
  }, [taskId, onClose]);

  if (!taskId || !task) {
    return null;
  }

  const sm = TASK_STATE_MAP[task.state] || TASK_STATE_MAP.planned;
  const rubroColor = RUBRO_COLORS[task.rubro] || "#94A3B8";
  const startD = weekDate(task.start);
  const endD = weekDate(task.start + task.span, -1);
  const isLate = task.state === "late";
  const isDone = task.state === "done";

  const deps = task.deps
    .map((depId) => {
      for (const g of groups) {
        const found = g.items.find((t) => t.id === depId);
        if (found) return found;
      }
      return null;
    })
    .filter(Boolean) as TaskItem[];

  return (
    <>
      <div onClick={onClose} className="fixed inset-0 z-[55] bg-slate-950/40 backdrop-blur-[2px] animate-fade-task" />
      <aside className="fixed right-0 top-0 bottom-0 z-[60] w-[420px] max-w-[calc(100vw-32px)] bg-white border-l border-slate-200 shadow-big flex flex-col animate-slide-task overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-200 flex items-start justify-between gap-3 flex-none">
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 mb-1">
              <span className="w-2 h-2 rounded-full flex-none" style={{ background: rubroColor }} />
              <span className="text-[10px] tracking-[0.06em] uppercase font-bold text-slate-600 truncate">{task.rubro}</span>
            </div>
            <h3 className="text-[18px] font-extrabold display-tight text-slate-950 leading-tight">{task.name}</h3>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-md hover:bg-slate-100 text-slate-500 hover:text-slate-950 flex items-center justify-center flex-none"
          >
            <Xmark width={16} height={16} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-5">
          <div className="flex items-center justify-between">
            <DPill tone={STATE_TONE[task.state] || "slate"}>{sm.label}</DPill>
            <span className="text-[13px] font-bold tnum text-slate-700">{task.pct}%</span>
          </div>
          <div className="bg-slate-100 h-[8px] rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all"
              style={{ width: `${task.pct}%`, background: sm.bg }}
            />
          </div>

          {isLate && (
            <div className="bg-critical-50 border border-[#FECACA] rounded-lg p-3 flex items-start gap-2">
              <ClockArrowRotateLeft width={14} height={14} className="text-[#B91C1C] mt-[2px] flex-none" />
              <div>
                <div className="text-[12px] font-bold text-[#B91C1C]">Tarea retrasada</div>
                <div className="text-[11px] text-slate-600 mt-[2px]">Se esperaba completar antes del {fmtDateLong(endD)}.</div>
              </div>
            </div>
          )}

          {isDone && (
            <div className="bg-success-50 border border-[#BBF7D0] rounded-lg p-3 flex items-start gap-2">
              <CircleCheck width={14} height={14} className="text-[#15803D] mt-[2px] flex-none" />
              <div>
                <div className="text-[12px] font-bold text-[#15803D]">Tarea completada</div>
                {task.completedBy && (
                  <div className="text-[11px] text-slate-600 mt-[2px]">
                    Por {task.completedBy}{task.completedOn ? ` el ${task.completedOn}` : ""}
                  </div>
                )}
              </div>
            </div>
          )}

          <div>
            <div className="text-[10px] tracking-[0.06em] uppercase font-bold text-slate-500 mb-2">Descripción</div>
            <p className="text-[13px] text-slate-700 leading-relaxed">{task.desc}</p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="border border-slate-200 rounded-lg p-3">
              <div className="text-[10px] tracking-[0.06em] uppercase font-bold text-slate-500 mb-1">Inicio</div>
              <div className="text-[13px] font-bold text-slate-950">{fmtDateLong(startD)}</div>
            </div>
            <div className="border border-slate-200 rounded-lg p-3">
              <div className="text-[10px] tracking-[0.06em] uppercase font-bold text-slate-500 mb-1">Fin</div>
              <div className="text-[13px] font-bold text-slate-950">{fmtDateLong(endD)}</div>
            </div>
            <div className="border border-slate-200 rounded-lg p-3">
              <div className="text-[10px] tracking-[0.06em] uppercase font-bold text-slate-500 mb-1">Duración</div>
              <div className="text-[13px] font-bold text-slate-950">{task.span} semanas</div>
            </div>
            <div className="border border-slate-200 rounded-lg p-3">
              <div className="text-[10px] tracking-[0.06em] uppercase font-bold text-slate-500 mb-1">Costo</div>
              <div className="text-[13px] font-bold text-slate-950">{task.cost}</div>
            </div>
          </div>

          <div>
            <div className="text-[10px] tracking-[0.06em] uppercase font-bold text-slate-500 mb-2">Responsable</div>
            <div className="border border-slate-200 rounded-lg p-3 flex items-center gap-3">
              <DAvatar
                initials={task.who.split(" ").map((w) => w[0]).join("").toUpperCase().slice(0, 2)}
                size={36}
              />
              <div>
                <div className="text-[13px] font-bold text-slate-950">{task.who}</div>
                <div className="text-[11px] text-slate-500">{task.rubro}</div>
              </div>
            </div>
          </div>

          {deps.length > 0 && (
            <div>
              <div className="text-[10px] tracking-[0.06em] uppercase font-bold text-slate-500 mb-2">Dependencias</div>
              <div className="space-y-1.5">
                {deps.map((d) => {
                  const depSm = TASK_STATE_MAP[d.state] || TASK_STATE_MAP.planned;
                  return (
                    <div
                      key={d.id}
                      className="flex items-center gap-2 border border-slate-200 rounded-lg p-2.5"
                    >
                      <span className="w-1.5 h-1.5 rounded-full flex-none" style={{ background: depSm.dot }} />
                      <span className="text-[12px] font-semibold text-slate-800 flex-1 truncate">{d.name}</span>
                      <DPill tone={STATE_TONE[d.state] || "slate"}>{depSm.label}</DPill>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          <div>
            <div className="text-[10px] tracking-[0.06em] uppercase font-bold text-slate-500 mb-2">Actualizaciones recientes</div>
            <div className="space-y-2">
              {TIMELINE.map((u, i) => (
                <div key={i} className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-slate-300 mt-[6px] flex-none" />
                  <div className="flex-1 min-w-0">
                    <div className="text-[12px] text-slate-700">{u.label}</div>
                    <div className="text-[10px] text-slate-400">{u.time}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="border-t border-slate-200 p-3 flex items-center gap-2 flex-none">
          {isDone ? (
            <Button
              variant="secondary"
              size="sm"
              className="flex-1 justify-center"
              onClick={() => onReopen(task.id)}
            >
              Reabrir
            </Button>
          ) : (
            <Button
              variant="primary"
              size="sm"
              className="flex-1 justify-center"
              onClick={() => onComplete(task.id)}
            >
              Marcar completada
            </Button>
          )}
          <Button variant="ghost" size="sm" className="flex-1 justify-center">
            Editar
          </Button>
        </div>
      </aside>
    </>
  );
}
