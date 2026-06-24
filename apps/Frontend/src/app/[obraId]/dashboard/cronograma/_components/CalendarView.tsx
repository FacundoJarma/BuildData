"use client";

import { useMemo } from "react";
import type { TaskItem } from "../data";
import { TASK_STATE_MAP, weekDate } from "../data";

interface Props {
  tasks: TaskItem[];
  onPick: (taskId: string) => void;
}

const DAY_HEADERS = ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"];
const WEEKENDS = [5, 6];

interface DayInfo {
  date: Date;
  tasks: TaskItem[];
  isWeekend: boolean;
  isToday: boolean;
  monthLabel?: string;
}

function buildGrid(tasks: TaskItem[]): { monthLabel: string; days: DayInfo[] } {
  const start = weekDate(0);
  const dayOfWeek = start.getDay();
  const mondayOffset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
  const gridStart = new Date(start);
  gridStart.setDate(gridStart.getDate() + mondayOffset);

  const days: DayInfo[] = [];
  const totalDays = 35;

  for (let i = 0; i < totalDays; i++) {
    const d = new Date(gridStart);
    d.setDate(d.getDate() + i);

    const activeTasks = tasks.filter((t) => {
      const taskStart = weekDate(t.start);
      const taskEnd = weekDate(t.start + t.span, -1);
      return d >= taskStart && d <= taskEnd;
    });

    const monthLabel =
      i === 0
        ? d.toLocaleDateString("es-AR", { month: "long" })
        : days[i - 1]?.date.getMonth() !== d.getMonth()
          ? d.toLocaleDateString("es-AR", { month: "long" })
          : undefined;

    days.push({
      date: d,
      tasks: activeTasks,
      isWeekend: WEEKENDS.includes(d.getDay()),
      isToday: false,
      monthLabel,
    });
  }

  const monthLabel = days.find((d) => d.monthLabel)?.monthLabel || "Mayo 2025";
  return { monthLabel, days };
}

export function CalendarView({ tasks, onPick }: Props) {
  const { monthLabel, days } = useMemo(() => buildGrid(tasks), [tasks]);

  return (
    <div className="bg-white border border-slate-200 rounded-lg shadow-card overflow-hidden">
      <div className="px-4 py-3 border-b border-slate-200">
        <h3 className="text-[15px] font-extrabold text-slate-950 capitalize">{monthLabel} 2025</h3>
      </div>

      <div className="grid grid-cols-7">
        {DAY_HEADERS.map((h) => (
          <div
            key={h}
            className="text-[10px] font-bold tracking-[0.06em] uppercase text-slate-500 text-center py-2 border-b border-slate-100"
          >
            {h}
          </div>
        ))}

        {days.map((day, i) => {
          const dayNum = day.date.getDate();
          const visible = day.tasks.slice(0, 3);
          const overflow = day.tasks.length - 3;

          return (
            <div
              key={i}
              className={`min-h-[90px] border-b border-r border-slate-100 p-1.5 ${
                day.isWeekend ? "bg-slate-50" : "bg-white"
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span
                  className={`text-[11px] font-bold tnum ${
                    day.isWeekend ? "text-slate-400" : "text-slate-700"
                  }`}
                >
                  {dayNum}
                </span>
              </div>
              <div className="space-y-[2px]">
                {visible.map((t) => {
                  const sm = TASK_STATE_MAP[t.state] || TASK_STATE_MAP.planned;
                  return (
                    <button
                      key={t.id}
                      onClick={() => onPick(t.id)}
                      className="w-full text-left text-[10px] font-semibold text-white truncate rounded-sm px-1 py-[2px] hover:opacity-80 transition-opacity"
                      style={{ background: sm.bg }}
                    >
                      {t.name}
                    </button>
                  );
                })}
                {overflow > 0 && (
                  <div className="text-[10px] font-bold text-slate-500 text-center">
                    +{overflow} más
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
