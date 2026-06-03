"use client";

import { Calendar, ArrowRight, Persons } from "@gravity-ui/icons";

function MessageIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

const NEXT_STEPS = [
  { ico: <MessageIcon />, tint: "bg-success-50 text-[#15803D]", title: "Conectar el bot de WhatsApp", sub: "Escaneá el QR desde el celular del jefe de obra.", cta: "Conectar ahora" },
  { ico: <Persons width={14} height={14} />, tint: "bg-info-50 text-[#1D4ED8]", title: "Invitar al equipo", sub: "Los sumás por WhatsApp en 30 segundos.", cta: "Invitar" },
  { ico: <Calendar width={14} height={14} />, tint: "bg-primary-50 text-primary", title: "Cargar el cronograma", sub: "Importá tu Excel o usá la plantilla sugerida.", cta: "Cargar" },
];

export function SuccessState({ data, onClose }: { data: any; onClose: () => void }) {
  return (
    <div className="flex flex-col">
      <div className="blueprint-bg px-8 py-10 text-center text-white relative overflow-hidden">
        <div className="w-16 h-16 rounded-full bg-success text-white flex items-center justify-center mx-auto mb-4 ring-4 ring-success/30">
          <CheckIcon />
        </div>
        <h2 className="text-[26px] font-extrabold display-tight leading-tight">¡Tu obra está creada!</h2>
        <p className="text-[14px] text-white/70 mt-2 max-w-[480px] mx-auto leading-snug">
          <b className="text-white">{data.name}</b> ya está lista. Conectá ahora el bot de WhatsApp para que tu equipo empiece a reportar.
        </p>
      </div>

      <div className="p-8 space-y-3">
        <div className="text-[10px] tracking-[0.06em] uppercase font-bold text-slate-500 mb-2">Próximos pasos sugeridos</div>
        {NEXT_STEPS.map((s) => (
          <div key={s.title} className="flex items-center gap-3 border border-slate-200 rounded-lg p-3 hover:bg-slate-50">
            <div className={`w-9 h-9 rounded-md flex items-center justify-center flex-none ${s.tint}`}>
              {s.ico}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-[13px] font-bold text-slate-950">{s.title}</div>
              <div className="text-[11px] text-slate-500">{s.sub}</div>
            </div>
            <button className="text-[12px] font-bold text-primary hover:underline">{s.cta} →</button>
          </div>
        ))}
      </div>

      <div className="border-t border-slate-200 px-8 py-4 flex items-center justify-between bg-slate-50">
        <button onClick={onClose} className="text-[12px] font-bold text-slate-600 hover:text-slate-950">Más tarde</button>
        <a href="/dashboard" className="inline-flex items-center gap-2 text-[13px] font-bold bg-primary hover:bg-primary-700 text-white rounded-md px-4 py-[9px]">
          Ir al dashboard <ArrowRight width={14} height={14} />
        </a>
      </div>
    </div>
  );
}
