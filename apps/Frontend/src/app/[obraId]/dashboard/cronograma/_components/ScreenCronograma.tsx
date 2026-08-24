"use client";

import { useState, useEffect, useCallback } from "react";
import { ChartBar, ListUl, Calendar, Plus } from "@gravity-ui/icons";
import { DPageHeader } from "../../_components/DPageHeader";
import Button from "@/components/ui/Button";
import {
  getCronograma,
  completeCronogramaTask,
  reopenCronogramaTask,
  type CronogramaData,
} from "@/services/cronogramaService";
import { useDashboardData } from "../../_components/DashboardDataContext";
import { GanttView } from "./GanttView";
import { ListView } from "./ListView";
import { CalendarView } from "./CalendarView";
import { TaskDetail } from "./TaskDetail";
import { NuevaTareaModal } from "./NuevaTareaModal";
import type { TaskGroup, Timeline } from "../data";
import { TASK_STATE_MAP } from "../data";

type ViewMode = "gantt" | "list" | "calendar";

const LEGENDS = [
  { state: "done", label: "Completado" },
  { state: "progress", label: "En curso" },
  { state: "late", label: "Retraso" },
  { state: "planned", label: "Programado" },
];

export function ScreenCronograma() {
  const { obraId } = useDashboardData();
  const [groups, setGroups] = useState<TaskGroup[]>([]);
  const [timeline, setTimeline] = useState<Timeline | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [view, setView] = useState<ViewMode>("gantt");
  const [pick, setPick] = useState<string | null>(null);
  const [newTaskOpen, setNewTaskOpen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  // El estado se actualiza dentro de los callbacks del fetch (no sincrónico
  // en el cuerpo del efecto). Para recargar, los handlers incrementan refreshKey.
  useEffect(() => {
    if (!obraId) return;
    let cancelled = false;
    getCronograma(obraId)
      .then((data: CronogramaData) => {
        if (cancelled) return;
        setGroups(data.groups);
        setTimeline(data.timeline);
        setError(null);
        setLoading(false);
      })
      .catch((e) => {
        if (cancelled) return;
        setError(e instanceof Error ? e.message : "Error cargando cronograma");
        setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [obraId, refreshKey]);

  const refresh = useCallback(() => {
    setLoading(true);
    setRefreshKey((k) => k + 1);
  }, []);

  const allTasks = groups.flatMap((g) => g.items);
  const totalTasks = allTasks.length;
  const doneTasks = allTasks.filter((t) => t.state === "done").length;
  const lateTasks = allTasks.filter((t) => t.state === "late").length;

  const handlePick = useCallback((taskId: string) => {
    setPick(taskId);
  }, []);

  const handleComplete = useCallback(async (id: string) => {
    try {
      await completeCronogramaTask(id);
      refresh();
    } catch (e) {
      console.error("Error completando tarea:", e);
    }
  }, [refresh]);

  const handleReopen = useCallback(async (id: string) => {
    try {
      await reopenCronogramaTask(id);
      refresh();
    } catch (e) {
      console.error("Error reabriendo tarea:", e);
    }
  }, [refresh]);

  // La creación la maneja el modal contra POST /tareas; acá solo refrescamos.
  const handleCreate = useCallback(() => {
    setNewTaskOpen(false);
    refresh();
  }, [refresh]);

  if ((loading && !timeline) || !obraId) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="flex items-center gap-3 text-slate-400">
          <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          <span className="text-[13px] font-semibold">Cargando cronograma…</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white border border-critical/20 rounded-lg p-8 text-center">
        <div className="text-[13px] font-bold text-[#B91C1C] mb-1">No se pudo cargar el cronograma</div>
        <div className="text-[12px] text-slate-500 mb-4">{error}</div>
        <Button variant="secondary" size="sm" onClick={refresh}>
          Reintentar
        </Button>
      </div>
    );
  }

  if (!timeline) return null;

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

      {totalTasks === 0 ? (
        <div className="bg-white border border-slate-200 rounded-lg shadow-card p-10 text-center">
          <div className="text-[14px] font-extrabold text-slate-950 mb-1">Todavía no hay tareas</div>
          <div className="text-[12px] text-slate-500">Creá la primera tarea para armar el cronograma de la obra.</div>
        </div>
      ) : (
        <>
          {view === "gantt" && <GanttView groups={groups} timeline={timeline} onPick={handlePick} />}
          {view === "list" && <ListView tasks={allTasks} onPick={handlePick} />}
          {view === "calendar" && <CalendarView tasks={allTasks} onPick={handlePick} />}
        </>
      )}

      <TaskDetail
        taskId={pick}
        groups={groups}
        onClose={() => setPick(null)}
        onComplete={handleComplete}
        onReopen={handleReopen}
      />

      <NuevaTareaModal
        open={newTaskOpen}
        obraId={obraId}
        onClose={() => setNewTaskOpen(false)}
        onCreate={handleCreate}
      />
    </>
  );
}
