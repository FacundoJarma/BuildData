"use client";

import { useEffect, useState } from "react";
import { CircleInfo, ArrowRight, Plus, Xmark } from "@gravity-ui/icons";
import { STEPS } from "@/app/projects/data/wizard";
import { Step1 } from "./Step1";
import { Step2 } from "./Step2";
import { Step3 } from "./Step3";
import { Step4 } from "./Step4";
import { SuccessState } from "./SuccessState";

function CheckIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

const INITIAL_DATA = {
  name: "", code: "", status: "planificacion", type: "",
  address: "", city: "", province: "", zip: "", country: "ar",
  myRole: "director", team: ["JM"],
  template: "plantilla", startDate: "", endDate: "",
};

export function NuevaObraModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [step, setStep] = useState(1);
  const [created, setCreated] = useState(false);
  const [data, setData] = useState(INITIAL_DATA);

  useEffect(() => {
    if (open) { setStep(1); setCreated(false); setData(INITIAL_DATA); }
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  const canNext = (() => {
    if (step === 1) return !!(data.name.trim() && data.type);
    if (step === 2) return !!data.address.trim();
    if (step === 3) return true;
    if (step === 4) return !!data.template;
    return false;
  })();

  const next = () => {
    if (step < 4) setStep(step + 1);
    else setCreated(true);
  };

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-modal-in">
      <div className="bg-white w-full max-w-[900px] max-h-[calc(100vh-32px)] rounded-2xl shadow-big overflow-hidden flex flex-col">

        {created ? (
          <SuccessState data={data} onClose={onClose} />
        ) : (
          <>
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 flex-none">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-md bg-primary-50 text-primary flex items-center justify-center">
                  <Plus width={16} height={16} />
                </div>
                <div>
                  <div className="text-[15px] font-extrabold display-tight">Crear nueva obra</div>
                  <div className="text-[11px] text-slate-500">Paso {step} de {STEPS.length} · {STEPS[step - 1].label}</div>
                </div>
              </div>
              <button onClick={onClose}
                className="w-8 h-8 rounded-md hover:bg-slate-100 text-slate-500 hover:text-slate-950 flex items-center justify-center">
                <Xmark width={16} height={16} />
              </button>
            </div>

            <div className="flex flex-1 min-h-0 overflow-hidden">
              <div className="w-[220px] bg-slate-50 border-r border-slate-200 p-4 flex flex-col gap-1 flex-none">
                {STEPS.map((s) => {
                  const isDone = s.id < step;
                  const isCurrent = s.id === step;
                  return (
                    <button key={s.id} type="button" onClick={() => isDone && setStep(s.id)}
                      className={`flex items-start gap-3 px-3 py-[10px] rounded-md text-left transition-colors ${isCurrent ? "bg-white shadow-card border border-slate-200" : "border border-transparent"} ${isDone ? "hover:bg-white cursor-pointer" : !isCurrent ? "opacity-60 cursor-default" : ""}`}>
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold flex-none ${isDone ? "bg-success text-white" : isCurrent ? "bg-primary text-white" : "bg-slate-200 text-slate-600"}`}>
                        {isDone ? <CheckIcon /> : s.id}
                      </div>
                      <div className="min-w-0">
                        <div className={`text-[12px] font-bold leading-tight ${isCurrent ? "text-slate-950" : "text-slate-700"}`}>{s.label}</div>
                        <div className="text-[10px] text-slate-500 leading-snug mt-[1px]">{s.sub}</div>
                      </div>
                    </button>
                  );
                })}

                <div className="mt-auto pt-3">
                  <div className="bg-white border border-slate-200 rounded-md p-3 text-[11px] text-slate-600 leading-snug">
                    <div className="flex items-center gap-1 font-bold text-slate-950 mb-1">
                      <CircleInfo width={12} height={12} className="text-primary" /> Podés editar todo después.
                    </div>
                    Ningún paso es definitivo. Cambiás equipo, fechas o cronograma cuando quieras.
                  </div>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-6">
                {step === 1 && <Step1 data={data} setData={setData} />}
                {step === 2 && <Step2 data={data} setData={setData} />}
                {step === 3 && <Step3 data={data} setData={setData} />}
                {step === 4 && <Step4 data={data} setData={setData} />}
              </div>
            </div>

            <div className="border-t border-slate-200 px-6 py-3 flex items-center justify-between bg-slate-50 flex-none">
              <button onClick={onClose}
                className="text-[12px] font-bold text-slate-600 hover:text-slate-950 px-3 py-[8px]">
                Cancelar
              </button>
              <div className="flex items-center gap-2">
                {step > 1 && (
                  <button onClick={() => setStep(step - 1)}
                    className="text-[13px] font-bold bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 rounded-md px-4 py-[9px]">
                    Atrás
                  </button>
                )}
                <button onClick={next} disabled={!canNext}
                  className={`inline-flex items-center gap-2 text-[13px] font-bold rounded-md px-4 py-[9px] transition-colors ${canNext ? "bg-primary hover:bg-primary-700 text-white" : "bg-slate-200 text-slate-500 cursor-not-allowed"}`}>
                  {step === 4 ? <>Crear obra <CheckIcon /></> : <>Siguiente <ArrowRight width={14} height={14} /></>}
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
