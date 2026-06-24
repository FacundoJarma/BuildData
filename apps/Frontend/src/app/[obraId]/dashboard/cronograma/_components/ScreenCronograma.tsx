"use client";

import { useState, useEffect, useCallback } from "react";
import { ChartBar, ListUl, Calendar, Plus } from "@gravity-ui/icons";
import { DPageHeader } from "../../_components/DPageHeader";
import Button from "@/components/ui/Button";
import { getCronograma, type CronogramaData } from "@/services/mock/cronogramaService";
import { GanttView } from "./GanttView";
import { ListView } from "./ListView";
import { CalendarView } from "./CalendarView";
import { TaskDetail } from "./TaskDetail";
import { NuevaTareaModal } from "./NuevaTareaModal";
import type { TaskItem, TaskGroup } from "../data";
import { TASK_STATE_MAP } from "../data";

type ViewMode = "gantt" | "list" | "calendar";

const LEGENDS = [
  { state: "done", label: "Completado" },
  { state: "progress", label: "En curso" },
  { state: "late", label: "Retraso" },
  { state: "planned", label: "Programado" },
];

export function ScreenCronograma() {
  const [groups, setGroups] = useState<TaskGroup[]>([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<ViewMode>("gantt");
  const [pick, setPick] = useState<string | null>(null);
  const [newTaskOpen, setNewTaskOpen] = useState(false);

  useEffect(() => {
    let cancelled = false;
    getCronograma().then((data: CronogramaData) => {
      if (!cancelled) {
        setGroups(data.groups);
        setLoading(false);
      }
    });
    return () => { cancelled = true; };
  }, []);

  const allTasks = groups.flatMap((g) => g.items);
  const totalTasks = allTasks.length;
  const doneTasks = allTasks.filter((t) => t.state === "done").length;
  const lateTasks = allTasks.filter((t) => t.state === "late").length;

  const handlePick = useCallback((taskId: string) => {
    setPick(taskId);
  }, []);

  const handleComplete = useCallback((id: string) => {
    setGroups((prev) =>
      prev.map((g) => ({
        ...g,
        items: g.items.map((t) =>
          t.id === id ? { ...t, state: "done", pct: 100 } : t
        ),
      }))
    );
  }, []);

  const handleReopen = useCallback((id: string) => {
    setGroups((prev) =>
      prev.map((g) => ({
        ...g,
        items: g.items.map((t) =>
          t.id === id ? { ...t, state: "progress", pct: t.pct || 1 } : t
        ),
      }))
    );
  }, []);

  const handleCreate = useCallback((task: TaskItem) => {
    const rubroGroup = groups.find((g) => g.rubro === task.rubro);
    if (rubroGroup) {
      setGroups((prev) =>
        prev.map((g) =>
          g.rubro === task.rubro ? { ...g, items: [...g.items, task] } : g
        )
      );
    } else {
      setGroups((prev) => [...prev, { rubro: task.rubro, items: [task] }]);
    }
    setNewTaskOpen(false);
  }, [groups]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="flex items-center gap-3 text-slate-400">
          <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          <span className="text-[13px] font-semibold">Cargando cronograma…</span>
        </div>
      </div>
    );
  }

  const VIEW_ICONS: Record<ViewMode, typeof ChartBar> = {
    gantt: ChartBar,
    list: ListUl,
    calendar: Calendar,
  };

  return (
    <>
      <DPageHeader
        title="Cronograma de tareas"
        subtitle={`${totalTasks} tareas · ${doneTasks} completadas · ${lateTasks} retrasadas`}
        right={
          <Button
            variant="primary"
            size="sm"
            icon={<Plus width={13} height={13} />}
            onClick={() => setNewTaskOpen(true)}
          >
            Nueva tarea
          </Button>
        }
      />

      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          {LEGENDS.map((l) => {
            const sm = TASK_STATE_MAP[l.state] || TASK_STATE_MAP.planned;
            return (
              <div key={l.state} className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full" style={{ background: sm.dot }} />
                <span className="text-[11px] text-slate-600">{l.label}</span>
              </div>
            );
          })}
        </div>

        <div className="flex items-center gap-1 bg-slate-100 rounded-lg p-0.5">
          {(Object.keys(VIEW_ICONS) as ViewMode[]).map((v) => {
            const Icon = VIEW_ICONS[v];
            const labels: Record<ViewMode, string> = {
              gantt: "Gantt",
              list: "Lista",
              calendar: "Calendario",
            };
            return (
              <button
                key={v}
                onClick={() => setView(v)}
                className={`flex items-center gap-1.5 text-[11px] font-bold px-2.5 py-1.5 rounded-md transition-colors ${
                  view === v
                    ? "bg-white text-slate-950 shadow-sm"
                    : "text-slate-500 hover:text-slate-700"
                }`}
              >
                <Icon width={14} height={14} />
                {labels[v]}
              </button>
            );
          })}
        </div>
      </div>

      {view === "gantt" && <GanttView groups={groups} onPick={handlePick} />}
      {view === "list" && <ListView tasks={allTasks} onPick={handlePick} />}
      {view === "calendar" && <CalendarView tasks={allTasks} onPick={handlePick} />}

      <TaskDetail
        taskId={pick}
        groups={groups}
        onClose={() => setPick(null)}
        onComplete={handleComplete}
        onReopen={handleReopen}
      />

      <NuevaTareaModal
        open={newTaskOpen}
        onClose={() => setNewTaskOpen(false)}
        onCreate={handleCreate}
      />
    </>
  );
}
