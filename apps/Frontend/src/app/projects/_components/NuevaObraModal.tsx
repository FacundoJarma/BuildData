"use client";

import { useEffect, useState } from "react";
import { Xmark, ArrowRight } from "@gravity-ui/icons";
import { NewStep1Type } from "./NewStep1Type";
import { NewStep2Data } from "./NewStep2Data";
import { NewStep3Team } from "./NewStep3Team";
import { NewStep4WhatsApp } from "./NewStep4WhatsApp";
import { NewSuccessState } from "./NewSuccessState";
import Button from "@/components/ui/Button";

const totalSteps = 4;

const STEP_INFO = [
  { title: "Empecemos con lo básico",      sub: "Elegí el tipo y cómo querés arrancar." },
  { title: "Datos de la obra",             sub: "Información mínima para empezar. Podés ajustar todo después." },
  { title: "Sumá a tu equipo",             sub: "Capataces, compras, dirección. Podés agregar más después." },
  { title: "Conectá WhatsApp",             sub: "Tu equipo reporta por WhatsApp y BuildData lo organiza acá." },
];

const INITIAL_DATA = {
  tipo: "edificio",
  plantilla: "plantilla",
  nombre: "",
  codigo: "",
  direccion: "",
  inicio: "",
  fin: "",
  team: [{ name: "", phone: "", role: "capataz" }],
  waConnect: false,
};

export function NuevaObraModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [step, setStep] = useState(1);
  const [data, setData] = useState(INITIAL_DATA);

  useEffect(() => {
    if (open) { setStep(1); setData(INITIAL_DATA); }
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  useEffect(() => {
    if (open) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => { document.body.style.overflow = prev; };
    }
  }, [open]);

  if (!open) return null;

  const canNext = (() => {
    if (step === 1) return !!(data.tipo && data.plantilla);
    if (step === 2) return data.nombre.trim().length > 1;
    if (step === 3) return true;
    if (step === 4) return true;
    return false;
  })();

  const info = STEP_INFO[step - 1];

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-fade-in" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-big w-full max-w-[820px] max-h-[90vh] flex flex-col overflow-hidden animate-modal-in" onClick={(e) => e.stopPropagation()}>

        {/* Header */}
        <div className="px-7 pt-6 pb-4 border-b border-slate-200 flex items-start justify-between gap-4 flex-none">
          <div className="min-w-0">
            <div className="text-[10px] tracking-[0.08em] uppercase font-bold text-primary mb-1">
              {step <= totalSteps ? `Paso ${step} de ${totalSteps}` : "¡Listo!"}
            </div>
            <h2 className="text-[22px] font-extrabold display-tight text-slate-950 leading-tight">
              {step <= totalSteps ? info.title : "¡Obra creada!"}
            </h2>
            <p className="text-[13px] text-slate-500 mt-1">
              {step <= totalSteps ? info.sub : "Tu obra ya está lista. Llevátela al panel principal."}
            </p>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-md text-slate-500 hover:text-slate-950 hover:bg-slate-100 flex items-center justify-center flex-none">
            <Xmark width={16} height={16} />
          </button>
        </div>

        {/* Progress dots */}
        {step <= totalSteps && (
          <div className="px-7 py-3 bg-slate-50 border-b border-slate-200 flex items-center gap-2 flex-none">
            {[1, 2, 3, 4].map((s) => (
              <div key={s} className={`h-[4px] rounded-full flex-1 transition-colors ${s <= step ? "bg-primary" : "bg-slate-200"}`} />
            ))}
          </div>
        )}

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-7 py-6">
          {step === 1 && <NewStep1Type data={data} setData={setData} />}
          {step === 2 && <NewStep2Data data={data} setData={setData} />}
          {step === 3 && <NewStep3Team data={data} setData={setData} />}
          {step === 4 && <NewStep4WhatsApp data={data} setData={setData} />}
          {step === 5 && <NewSuccessState data={data} onClose={onClose} />}
        </div>

        {/* Footer / actions */}
        {step <= totalSteps && (
          <div className="px-7 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between gap-3 flex-none">
            <button onClick={onClose} className="text-[12px] font-bold text-slate-500 hover:text-slate-950 px-3 py-2">
              Cancelar
            </button>
            <div className="flex items-center gap-2">
              {step > 1 && (
                <Button variant="secondary" size="md" onClick={() => setStep(step - 1)}>
                  Atrás
                </Button>
              )}
              <button
                disabled={!canNext}
                onClick={() => setStep(step + 1)}
                className={`inline-flex items-center gap-2 font-bold rounded-md px-5 py-[10px] text-[13px] transition-colors ${canNext ? "bg-primary hover:bg-primary-700 text-white" : "bg-slate-300 text-white cursor-not-allowed"}`}>
                {step === totalSteps ? "Crear obra" : "Siguiente"} <ArrowRight width={13} height={13} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
