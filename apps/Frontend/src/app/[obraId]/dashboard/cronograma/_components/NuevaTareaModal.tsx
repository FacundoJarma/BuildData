"use client";

import { useState, useEffect, useMemo } from "react";
import { Xmark, Check, Calendar } from "@gravity-ui/icons";
import Button from "@/components/ui/Button";
import { parseDate, fmtDateLong } from "../data";
import { getRubrosDeObra, getMiembrosDeObra, type OptionItem } from "@/services/cronogramaService";
import { createTask } from "@/services/tareasService";

interface Props {
  open: boolean;
  obraId: string;
  onClose: () => void;
  // Se llama tras crear la tarea contra la API (el padre refresca la lista).
  onCreate: () => void;
}

const PRIORIDADES = [
  { value: "", label: "Sin prioridad" },
  { value: "baja", label: "Baja" },
  { value: "media", label: "Media" },
  { value: "alta", label: "Alta" },
  { value: "urgente", label: "Urgente" },
];

function todayISO(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

export function NuevaTareaModal({ open, obraId, onClose, onCreate }: Props) {
  const [name, setName] = useState("");
  const [costo, setCosto] = useState("");
  const [desc, setDesc] = useState("");
  // rubros === null mientras cargan las opciones
  const [rubros, setRubros] = useState<OptionItem[] | null>(null);
  const [rubroId, setRubroId] = useState("");
  const [miembros, setMiembros] = useState<OptionItem[]>([]);
  const [asignadoA, setAsignadoA] = useState("");
  const [prioridad, setPrioridad] = useState("");
  const [fechaInicio, setFechaInicio] = useState(todayISO());
  const [fechaLimite, setFechaLimite] = useState("");
  const [optsError, setOptsError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [successName, setSuccessName] = useState<string | null>(null);

  useEffect(() => {
    if (!open || !obraId) return;
    let cancelled = false;
    Promise.all([getRubrosDeObra(obraId), getMiembrosDeObra(obraId)])
      .then(([rs, ms]) => {
        if (cancelled) return;
        setRubros(rs);
        setRubroId((prev) => (rs.some((r) => r.id === prev) ? prev : rs[0]?.id || ""));
        setMiembros(ms);
        setAsignadoA("");
      })
      .catch((e) => {
        if (!cancelled) setOptsError(e instanceof Error ? e.message : "Error cargando opciones");
      });
    return () => {
      cancelled = true;
    };
  }, [open, obraId]);

  useEffect(() => {
    if (!open) return;
    const k = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !submitting) onClose();
    };
    window.addEventListener("keydown", k);
    return () => window.removeEventListener("keydown", k);
  }, [open, onClose, submitting]);

  const duracionSemanas = useMemo(() => {
    const s = parseDate(fechaInicio);
    const e = parseDate(fechaLimite);
    if (!s) return null;
    if (!e || e < s) return 1;
    return Math.max(1, Math.ceil((e.getTime() - s.getTime()) / (7 * 86_400_000)));
  }, [fechaInicio, fechaLimite]);

  const startDate = useMemo(() => parseDate(fechaInicio), [fechaInicio]);
  const endDate = useMemo(() => parseDate(fechaLimite), [fechaLimite]);

  const canSave =
    !submitting &&
    name.trim().length > 0 &&
    //rubroId.trim().length > 0 &&
    fechaInicio.trim().length > 0;

  const resetForm = () => {
    setName("");
    setPrioridad("");
    setFechaInicio(todayISO());
    setFechaLimite("");
    setCosto("");
    setDesc("");
    setSubmitError(null);
  };

  const handleCreate = async () => {
    if (!canSave || submitting) return;
    setSubmitting(true);
    setSubmitError(null);
    try {
      await createTask(obraId, {
        nombre: name.trim(),
        desc: desc.trim(),
        rubro_id: rubroId,
        asignado_a: asignadoA,
        prioridad,
        fecha_inicio: fechaInicio,
        fecha_limite: fechaLimite,
        costo_estimado: costo.trim(),
      });
      setSuccessName(name.trim());
    } catch (e) {
      setSubmitError(e instanceof Error ? e.message : "Error al crear la tarea");
    } finally {
      setSubmitting(false);
    }
  };

  const closeAfterSuccess = () => {
    onCreate();
    onClose();
  };
  if (!open) return null;
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
            <span className="text-[11px] font-bold text-slate-700">Rubro *</span>
            {rubros === null ? (
              <div className="text-[12px] text-slate-400 py-2">Cargando rubros…</div>
            ) : optsError ? (
              <div className="text-[12px] text-[#B91C1C] py-1">{optsError}</div>
            ) : rubros.length === 0 ? (
              <div className="text-[12px] text-slate-500 py-1">La obra no tiene rubros. Creá uno desde el dashboard.</div>
            ) : (
              <select
                value={rubroId}
                onChange={(e) => setRubroId(e.target.value)}
                className="bg-white border border-slate-200 rounded-md px-3 py-[9px] text-[13px] focus:border-primary focus:outline-none"
              >
                {rubros.map((r) => (
                  <option key={r.id} value={r.id}>{r.nombre}</option>
                ))}
              </select>
            )}
          </label>

          <label className="flex flex-col gap-[6px]">
            <span className="text-[11px] font-bold text-slate-700">Responsable</span>
            <select
              value={asignadoA}
              onChange={(e) => setAsignadoA(e.target.value)}
              className="bg-white border border-slate-200 rounded-md px-3 py-[9px] text-[13px] focus:border-primary focus:outline-none"
            >
              <option value="">Sin asignar</option>
              {miembros.map((m) => (
                <option key={m.id} value={m.id}>{m.nombre}</option>
              ))}
            </select>
          </label>

          <div className="grid grid-cols-2 gap-3">
            <label className="flex flex-col gap-[6px]">
              <span className="text-[11px] font-bold text-slate-700">Prioridad</span>
              <select
                value={prioridad}
                onChange={(e) => setPrioridad(e.target.value)}
                className="bg-white border border-slate-200 rounded-md px-3 py-[9px] text-[13px] focus:border-primary focus:outline-none"
              >
                {PRIORIDADES.map((p) => (
                  <option key={p.value} value={p.value}>{p.label}</option>
                ))}
              </select>
            </label>

            <label className="flex flex-col gap-[6px]">
              <span className="text-[11px] font-bold text-slate-700">Costo estimado (AR$)</span>
              <input
                value={costo}
                onChange={(e) => setCosto(e.target.value.replace(/[^0-9.,]/g, ""))}
                placeholder="Ej: 5200000"
                inputMode="decimal"
                className="bg-white border border-slate-200 rounded-md px-3 py-[9px] text-[13px] focus:border-primary focus:outline-none tnum"
              />
            </label>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <label className="flex flex-col gap-[6px]">
              <span className="text-[11px] font-bold text-slate-700">Fecha de inicio *</span>
              <input
                type="date"
                required
                value={fechaInicio}
                onChange={(e) => setFechaInicio(e.target.value)}
                className="bg-white border border-slate-200 rounded-md px-3 py-[9px] text-[13px] focus:border-primary focus:outline-none tnum"
              />
            </label>

            <label className="flex flex-col gap-[6px]">
              <span className="text-[11px] font-bold text-slate-700">Fecha límite</span>
              <input
                type="date"
                value={fechaLimite}
                min={fechaInicio}
                onChange={(e) => setFechaLimite(e.target.value)}
                className="bg-white border border-slate-200 rounded-md px-3 py-[9px] text-[13px] focus:border-primary focus:outline-none tnum"
              />
            </label>
          </div>

          {startDate && (
            <div className="bg-primary-50 border border-primary/20 rounded-lg p-3">
              <div className="text-[10px] tracking-[0.06em] uppercase font-bold text-primary mb-1">Vista previa</div>
              <div className="text-[13px] font-bold text-slate-950">
                {fmtDateLong(startDate)}{endDate ? ` → ${fmtDateLong(endDate)}` : ""}
              </div>
              <div className="text-[11px] text-slate-600 mt-1">
                {duracionSemanas} {duracionSemanas === 1 ? "semana" : "semanas"} de duración estimada
              </div>
            </div>
          )}

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

          {submitError && (
            <div className="bg-critical-50 border border-[#FECACA] rounded-lg px-3 py-2 text-[12px] font-semibold text-[#B91C1C]">
              {submitError}
            </div>
          )}
        </div>

        <div className="px-6 py-3 border-t border-slate-200 bg-slate-50 flex items-center justify-end gap-2 flex-none">
          <Button variant="ghost" size="sm" onClick={onClose}>
            Cancelar
          </Button>
          <Button
            variant="primary"
            size="sm"
            icon={<Check width={14} height={14} />}
            disabled={!canSave}
            onClick={handleCreate}
          >
            {submitting ? "Creando…" : "Crear tarea"}
          </Button>
        </div>
      </div>
    </div>
  );
}
