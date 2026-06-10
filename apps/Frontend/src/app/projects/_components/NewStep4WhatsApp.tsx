"use client";

import { CircleCheck, Clock } from "@gravity-ui/icons";
import { DPill } from "@/components/ui/DPill";

export function NewStep4WhatsApp({ data, setData }: { data: any; setData: (upd: (d: any) => any) => void }) {
  return (
    <>
      <div className="bg-[#075E54] text-white rounded-xl p-5 mb-5 flex items-center gap-4">
        <div className="w-14 h-14 rounded-full bg-white/10 flex items-center justify-center flex-none">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="#25D366">
            <path d="M.057 24l1.687-6.163a11.867 11.867 0 0 1-1.587-5.946C.16 5.335 5.495 0 12.05 0a11.817 11.817 0 0 1 8.413 3.488 11.824 11.824 0 0 1 3.48 8.414c-.003 6.557-5.338 11.892-11.893 11.892a11.9 11.9 0 0 1-5.688-1.448L.057 24zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981z"/>
          </svg>
        </div>
        <div className="flex-1">
          <div className="text-[14px] font-extrabold">El núcleo de BuildData</div>
          <div className="text-[12px] text-white/70 mt-[2px] leading-snug">Tu equipo reporta como siempre. Nosotros transcribimos, clasificamos y guardamos todo acá.</div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <button onClick={() => setData((d: any) => ({ ...d, waConnect: true }))}
          className={`text-left rounded-lg border p-4 transition-all ${data.waConnect ? "border-primary bg-primary-50 ring-2 ring-primary/20" : "border-slate-200 bg-white hover:border-slate-300"}`}>
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-md bg-success-50 text-[#15803D] flex items-center justify-center">
              <CircleCheck width={15} height={15} />
            </div>
            <div className="text-[13.5px] font-bold text-slate-950">Conectar ahora</div>
            <DPill tone="successSolid">Recomendado</DPill>
          </div>
          <div className="text-[12px] text-slate-600 leading-snug">Escaneás un QR desde el celular del jefe de obra. Tarda ~2 min.</div>
        </button>

        <button onClick={() => setData((d: any) => ({ ...d, waConnect: false }))}
          className={`text-left rounded-lg border p-4 transition-all ${!data.waConnect ? "border-primary bg-primary-50 ring-2 ring-primary/20" : "border-slate-200 bg-white hover:border-slate-300"}`}>
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-md bg-slate-100 text-slate-600 flex items-center justify-center">
              <Clock width={15} height={15} />
            </div>
            <div className="text-[13.5px] font-bold text-slate-950">Después</div>
          </div>
          <div className="text-[12px] text-slate-600 leading-snug">Configurás el bot más tarde desde el panel. La obra se crea igual.</div>
        </button>
      </div>

      {data.waConnect && (
        <div className="mt-5 bg-slate-50 border border-slate-200 rounded-lg p-5 flex items-center gap-5">
          <div className="w-[140px] h-[140px] bg-white border border-slate-200 rounded-lg p-2 flex-none relative">
            <svg viewBox="0 0 100 100" className="w-full h-full">
              {[...Array(15)].map((_, r) => [...Array(15)].map((_, c) => (
                ((r * 37 + c * 53) % 7) < 3 && <rect key={r + "-" + c} x={c * 6 + 5} y={r * 6 + 5} width="5" height="5" fill="#0F172A" />
              )))}
              {[[5, 5], [75, 5], [5, 75]].map(([x, y]) => (
                <g key={x + "-" + y}>
                  <rect x={x} y={y} width="20" height="20" fill="none" stroke="#0F172A" strokeWidth="3" />
                  <rect x={x + 7} y={y + 7} width="6" height="6" fill="#0F172A" />
                </g>
              ))}
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-8 h-8 rounded-md bg-white flex items-center justify-center shadow-card">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="#25D366">
                  <path d="M.057 24l1.687-6.163a11.867 11.867 0 0 1-1.587-5.946C.16 5.335 5.495 0 12.05 0a11.817 11.817 0 0 1 8.413 3.488 11.824 11.824 0 0 1 3.48 8.414c-.003 6.557-5.338 11.892-11.893 11.892a11.9 11.9 0 0 1-5.688-1.448L.057 24z"/>
                </svg>
              </div>
            </div>
          </div>
          <div className="flex-1">
            <div className="text-[13px] font-bold text-slate-950 mb-2">Escaneá este código desde WhatsApp</div>
            <ol className="text-[12px] text-slate-600 leading-relaxed space-y-1 list-decimal pl-4">
              <li>Abrí WhatsApp en el celular del jefe de obra.</li>
              <li>Andá a <b>Configuración → Dispositivos vinculados</b>.</li>
              <li>Tocá <b>Vincular un dispositivo</b> y escaneá el QR.</li>
            </ol>
            <div className="text-[10px] text-slate-400 mt-3">El QR se renueva cada 60 segundos.</div>
          </div>
        </div>
      )}
    </>
  );
}
