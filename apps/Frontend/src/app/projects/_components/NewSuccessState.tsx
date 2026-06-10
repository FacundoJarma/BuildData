"use client";

import { ArrowRight } from "@gravity-ui/icons";
import Button from "@/components/ui/Button";

const TIPO_LABELS: Record<string, string> = {
  edificio: "edificio en altura",
  vivienda: "vivienda unifamiliar",
  refaccion: "refacción / remodelación",
  comercial: "comercial / industrial",
};

export function NewSuccessState({ data, onClose }: { data: any; onClose: () => void }) {
  const tipoLabel = TIPO_LABELS[data.tipo as string] || "obra";
  const peopleCount = (data.team || []).filter((m: any) => m.name.trim()).length + 1;

  return (
    <div className="text-center py-6">
      <div className="w-20 h-20 rounded-full bg-success-50 text-success flex items-center justify-center mx-auto mb-5">
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M22 11.1V12a10 10 0 1 1-5.93-9.14" />
          <path d="m9 11 3 3L22 4" />
        </svg>
      </div>
      <h3 className="text-[24px] font-extrabold display-tight">{data.nombre || "Tu nueva obra"} está lista</h3>
      <p className="text-[13.5px] text-slate-600 leading-relaxed max-w-[460px] mx-auto mt-3">
        Creamos la estructura inicial con los rubros típicos de <b>{tipoLabel}</b>.
        {data.waConnect ? " El bot de WhatsApp ya está conectado." : " Cuando quieras, conectás WhatsApp desde Configuración."}
      </p>
      <div className="grid grid-cols-3 gap-3 max-w-[460px] mx-auto mt-6 mb-7">
        <div className="bg-slate-50 border border-slate-200 rounded-lg p-3">
          <div className="text-[20px] font-extrabold tnum">{peopleCount}</div>
          <div className="text-[10px] tracking-[0.06em] uppercase font-bold text-slate-500 mt-1">Personas</div>
        </div>
        <div className="bg-slate-50 border border-slate-200 rounded-lg p-3">
          <div className="text-[20px] font-extrabold tnum">8</div>
          <div className="text-[10px] tracking-[0.06em] uppercase font-bold text-slate-500 mt-1">Rubros</div>
        </div>
        <div className="bg-slate-50 border border-slate-200 rounded-lg p-3">
          <div className="text-[20px] font-extrabold tnum">~120</div>
          <div className="text-[10px] tracking-[0.06em] uppercase font-bold text-slate-500 mt-1">Tareas</div>
        </div>
      </div>
      <div className="flex gap-2 justify-center">
        <Button variant="secondary" size="md" onClick={onClose}>Volver a Mis obras</Button>
        <a href="/dashboard" className="inline-flex items-center gap-2 bg-primary hover:bg-primary-700 text-white font-bold rounded-md px-5 py-[10px] text-[13px] transition-colors">
          Abrir dashboard <ArrowRight width={14} height={14} />
        </a>
      </div>
    </div>
  );
}
