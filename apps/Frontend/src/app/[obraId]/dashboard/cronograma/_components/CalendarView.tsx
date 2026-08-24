"use client";

import { useMemo } from "react";
import type { TaskItem } from "../data";
import { TASK_STATE_MAP, parseDate, fmtDateLong } from "../data";

interface Props {
  tasks: TaskItem[];
  onPick: (taskId: string) => void;
}

const DAY_HEADERS = ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"];
const WEEKENDS = [5, 6];
const GRID_WEEKS = 5; // 2 semanas atrás + semana actual + 2 adelante

interface DayInfo {
  date: Date;
  tasks: TaskItem[];
  isWeekend: boolean;
  isToday: boolean;
  monthLabel?: string;
}

function buildGrid(tasks: TaskItem[]): { monthLabel: string; days: DayInfo[] } {
  const now = new Date();
  now.setHours(0, 0, 0, 0);

  // Lunes de la semana actual, menos 2 semanas
  const monday = new Date(now);
  monday.setDate(monday.getDate() + (monday.getDay() === 0 ? -6 : 1 - monday.getDay()));
  const gridStart = new Date(monday);
  gridStart.setDate(gridStart.getDate() - 14);

  const todayMs = now.getTime();
  const days: DayInfo[] = [];

  for (let i = 0; i < GRID_WEEKS * 7; i++) {
    const d = new Date(gridStart);
    d.setDate(d.getDate() + i);
    const dMs = d.getTime();

    const activeTasks = tasks.filter((t) => {
      const s = parseDate(t.startDate)?.getTime();
      const e = parseDate(t.dueDate)?.getTime() ?? s;
      return s !== undefined && e !== undefined && dMs >= s && dMs <= e;
    });

    const monthLabel =
      i === 0
        ? d.toLocaleDateString("es-AR", { month: "long", year: "numeric" })
        : days[i - 1]?.date.getMonth() !== d.getMonth()
          ? d.toLocaleDateString("es-AR", { month: "long", year: "numeric" })
          : undefined;

    days.push({
      date: d,
      tasks: activeTasks,
      isWeekend: WEEKENDS.includes(d.getDay()),
      isToday: dMs === todayMs,
      monthLabel,
    });
  }

  const monthLabel =
    days.find((d) => d.monthLabel)?.monthLabel ||
    now.toLocaleDateString("es-AR", { month: "long", year: "numeric" });
  return { monthLabel, days };
}

export function CalendarView({ tasks, onPick }: Props) {
  const { monthLabel, days } = useMemo(() => buildGrid(tasks), [tasks]);

  if (tasks.length === 0) {
    return (
      <div className="bg-white border border-slate-200 rounded-lg shadow-card p-8 text-center text-slate-500 text-[13px]">
        No hay tareas para mostrar
      </div>
    );
  }

  return (
    <div className="bg-white border border-slate-200 rounded-lg shadow-card overflow-hidden">
      <div className="px-4 py-2 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
        <span className="text-[11px] font-bold text-slate-500 tracking-[0.06em] uppercase capitalize">
          {monthLabel}
        </span>
        <span className="text-[10px] text-slate-400">Semanas alrededor de hoy</span>
      </div>

      <div className="grid grid-cols-7 border-b border-slate-100">
        {DAY_HEADERS.map((h) => (
          <div
            key={h}
            className={`text-[10px] font-bold tracking-[0.06em] uppercase text-center py-1.5 border-r border-slate-100 last:border-r-0 ${
              h === "Sáb" || h === "Dom" ? "text-slate-400 bg-slate-50" : "text-slate-500"
            }`}
          >
            {h}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7">
        {days.map((day) => (
          <div
            key={day.date.getTime()}
            className={`min-h-[72px] border-b border-r border-slate-100 last:border-r-0 px-1.5 py-1 ${
              day.isWeekend ? "bg-slate-50/60" : ""
            }`}
          >
            <div className="flex items-center justify-between mb-1">
              <span
                className={`text-[10px] font-bold tnum ${
                  day.isToday
                    ? "bg-primary text-white rounded-full w-4 h-4 flex items-center justify-center"
                    : "text-slate-400"
                }`}
              >
                {day.date.getDate()}
              </span>
              {day.monthLabel && (
                <span className="text-[9px] font-bold uppercase tracking-wide text-slate-300 truncate ml-1">
                  {day.monthLabel.split(" ")[0]}
                </span>
              )}
            </div>
            <div className="space-y-[3px]">
              {day.tasks.slice(0, 3).map((t) => {
                const sm = TASK_STATE_MAP[t.state] || TASK_STATE_MAP.planned;
                return (
                  <button
                    key={t.id}
                    onClick={() => onPick(t.id)}
                    title={`${t.name} · ${fmtDateLong(day.date)}`}
                    className="w-full text-left text-[9px] font-bold px-1 py-[2px] rounded truncate block hover:opacity-80 transition-opacity"
                    style={{ background: `${sm.dot}1A`, color: sm.fg === "#fff" ? sm.bg : sm.fg }}
                  >
                    {t.name}
                  </button>
                );
              })}
              {day.tasks.length > 3 && (
                <div className="text-[9px] text-slate-400 font-bold pl-1">+{day.tasks.length - 3} más</div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
