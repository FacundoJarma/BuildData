"use client";

import type { TaskItem } from "../data";
import { DPill } from "@/components/ui/DPill";
import { DAvatar } from "@/components/ui/DAvatar";
import { fmtDate, RUBRO_COLORS, TASK_STATE_MAP, weekDate } from "../data";

interface Props {
  tasks: TaskItem[];
  onPick: (taskId: string) => void;
}

const STATE_TONE: Record<string, "success" | "primary" | "critical" | "info"> = {
  done: "success",
  progress: "primary",
  late: "critical",
  planned: "info",
};

export function ListView({ tasks, onPick }: Props) {
  if (tasks.length === 0) {
    return (
      <div className="bg-white border border-slate-200 rounded-lg shadow-card p-8 text-center text-slate-500 text-[13px]">
        No hay tareas para mostrar
      </div>
    );
  }

  return (
    <div className="bg-white border border-slate-200 rounded-lg shadow-card overflow-hidden">
      <table className="w-full text-left">
        <thead>
          <tr className="border-b border-slate-200 bg-slate-50 text-[10px] font-bold tracking-[0.06em] uppercase text-slate-500">
            <th className="px-4 py-3 w-[40%]">Tarea</th>
            <th className="px-4 py-3 w-[15%]">Rubro</th>
            <th className="px-4 py-3 w-[13%]">Responsable</th>
            <th className="px-4 py-3 w-[11%]">Inicio</th>
            <th className="px-4 py-3 w-[11%]">Fin</th>
            <th className="px-4 py-3 w-[10%]">Estado</th>
          </tr>
        </thead>
        <tbody>
          {tasks.map((t) => {
            const sm = TASK_STATE_MAP[t.state] || TASK_STATE_MAP.planned;
            const startD = weekDate(t.start);
            const endD = weekDate(t.start + t.span, -1);
            return (
              <tr
                key={t.id}
                onClick={() => onPick(t.id)}
                className="border-b border-slate-100 hover:bg-slate-50 cursor-pointer transition-colors"
              >
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <span
                      className="w-2 h-2 rounded-full flex-none"
                      style={{ background: sm.dot }}
                    />
                    <span className="text-[13px] font-bold text-slate-950">{t.name}</span>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <span className="text-[12px] text-slate-600 flex items-center gap-1.5">
                    <span
                      className="w-1.5 h-1.5 rounded-full flex-none"
                      style={{ background: RUBRO_COLORS[t.rubro] || "#94A3B8" }}
                    />
                    {t.rubro}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <DAvatar initials={t.who.split(" ").map((w) => w[0]).join("").toUpperCase().slice(0, 2)} size={24} />
                    <span className="text-[12px] text-slate-700">{t.who}</span>
                  </div>
                </td>
                <td className="px-4 py-3 text-[12px] text-slate-600 tnum">{fmtDate(startD)}</td>
                <td className="px-4 py-3 text-[12px] text-slate-600 tnum">{fmtDate(endD)}</td>
                <td className="px-4 py-3">
                  <DPill tone={STATE_TONE[t.state] || "slate"}>{sm.label}</DPill>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
