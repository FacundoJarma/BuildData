"use client";

import { useRef, useState, useEffect, useCallback, useMemo } from "react";
import { ChevronRight } from "@gravity-ui/icons";
import type { TaskGroup, Timeline } from "../data";
import {
  TASK_STATE_MAP,
  RUBRO_COLORS,
  FALLBACK_RUBRO_COLOR,
  weekDate,
  todayColumn,
  fmtDate,
} from "../data";

interface Props {
  groups: TaskGroup[];
  timeline: Timeline;
  onPick: (taskId: string) => void;
}

const ZOOMS = [
  { label: "Compacto", w: 56 },
  { label: "Normal", w: 72 },
  { label: "Cómodo", w: 96 },
] as const;

export function GanttView({ groups, timeline, onPick }: Props) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [weekWidth, setWeekWidth] = useState(72);
  const [scrollToToday, setScrollToToday] = useState(false);

  const { ganttStart, weekCount } = timeline;
  const totalW = weekCount * weekWidth + 260;

  const months = useMemo(() => {
    const arr: { label: string; start: number; span: number }[] = [];
    for (let i = 0; i < weekCount; i++) {
      const d = weekDate(timeline, i);
      const m = d.getMonth();
      const last = arr[arr.length - 1];
      if (last && weekDate(timeline, last.start).getMonth() === m) {
        last.span++;
      } else {
        arr.push({
          label: d.toLocaleDateString("es-AR", { month: "long" }),
          start: i,
          span: 1,
        });
      }
    }
    return arr;
  }, [timeline, weekCount]);

  const todayCol = todayColumn(timeline);

  useEffect(() => {
    if (scrollToToday && scrollRef.current) {
      const left = 260 + todayCol * weekWidth - scrollRef.current.clientWidth / 2;
      scrollRef.current.scrollLeft = Math.max(0, left);
      setScrollToToday(false);
    }
  }, [scrollToToday, weekWidth, todayCol]);

  const doScrollToday = useCallback(() => setScrollToToday(true), []);

  return (
    <div className="bg-white border border-slate-200 rounded-lg shadow-card overflow-hidden">
      <div className="flex items-center justify-between px-4 py-2 border-b border-slate-200 bg-slate-50">
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-bold text-slate-500 tracking-[0.06em] uppercase">Zoom</span>
          {ZOOMS.map((z) => (
            <button
              key={z.label}
              onClick={() => setWeekWidth(z.w)}
              className={`text-[11px] font-bold px-2.5 py-1 rounded-md transition-colors ${
                weekWidth === z.w
                  ? "bg-primary text-white"
                  : "text-slate-600 hover:bg-slate-200"
              }`}
            >
              {z.label}
            </button>
          ))}
        </div>
        <button
          onClick={doScrollToday}
          className="text-[11px] font-bold text-primary hover:text-primary-700 flex items-center gap-1"
        >
          <ChevronRight width={14} height={14} className="rotate-90" />
          Hoy
        </button>
      </div>

      <div ref={scrollRef} className="overflow-x-auto overflow-y-visible" style={{ maxHeight: "calc(100vh - 260px)" }}>
        <div style={{ width: totalW, minWidth: totalW }}>
          <div className="flex" style={{ paddingLeft: 260 }}>
            {months.map((m) => (
              <div
                key={`${m.start}-${m.label}`}
                className="text-[10px] font-bold text-slate-400 tracking-[0.06em] uppercase px-2 py-1.5 border-b border-slate-100"
                style={{ width: m.span * weekWidth, minWidth: m.span * weekWidth }}
              >
                {m.label}
              </div>
            ))}
          </div>

          <div className="flex border-b border-slate-200 bg-slate-50" style={{ paddingLeft: 260 }}>
            {Array.from({ length: weekCount }, (_, i) => (
              <div
                key={i}
                className="text-[10px] font-bold text-slate-500 text-center py-1 border-r border-slate-100 last:border-r-0 tnum"
                style={{ width: weekWidth, minWidth: weekWidth }}
                title={ganttStart.toLocaleDateString("es-AR", { day: "numeric", month: "long", year: "numeric" })}
              >
                {fmtDate(weekDate(timeline, i))}
              </div>
            ))}
          </div>

          <div className="relative">
            {groups.map((g) => (
              <div key={g.rubro}>
                <div className="flex border-b border-slate-100">
                  <div
                    className="sticky left-0 z-10 bg-white flex items-center gap-2 px-3 py-2 border-r border-slate-100"
                    style={{ width: 260, minWidth: 260 }}
                  >
                    <span
                      className="w-2 h-2 rounded-full flex-none"
                      style={{ background: RUBRO_COLORS[g.rubro] || FALLBACK_RUBRO_COLOR }}
                    />
                    <span className="text-[12px] font-bold text-slate-700 truncate">{g.rubro}</span>
                  </div>
                  <div className="flex-1 relative h-8">
                    {g.items.map((task) => {
                      const sm = TASK_STATE_MAP[task.state] || TASK_STATE_MAP.planned;
                      const left = task.start * weekWidth;
                      const w = task.span * weekWidth;
                      const barH = 20;
                      return (
                        <button
                          key={task.id}
                          onClick={() => onPick(task.id)}
                          className="absolute top-1/2 -translate-y-1/2 rounded-full overflow-hidden group cursor-pointer hover:opacity-80 transition-opacity"
                          style={{
                            left,
                            width: Math.max(w - 4, 8),
                            height: barH,
                            background: sm.bg,
                          }}
                        >
                          <div className="relative w-full h-full">
                            <div
                              className="absolute inset-y-0 left-0 bg-white/25"
                              style={{ width: `${task.pct}%` }}
                            />
                            <div className="absolute inset-0 flex items-center px-2">
                              <span className="text-[10px] font-bold text-white truncate drop-shadow-sm">
                                {task.name}
                              </span>
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            ))}

            <div
              className="absolute top-0 bottom-0 w-[2px] bg-critical pointer-events-none z-20"
              style={{ left: 260 + todayCol * weekWidth }}
            >
              <div className="w-2 h-2 rounded-full bg-critical -ml-[3px] -mt-[3px]" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
