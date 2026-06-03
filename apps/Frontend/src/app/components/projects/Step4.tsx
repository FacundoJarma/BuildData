"use client";

import { TEMPLATES, TYPES } from "@/app/projects/data/wizard";
import { WField } from "./WField";
import { WInput } from "./WInput";
import { PickCard } from "./PickCard";

export function Step4({ data, setData }: { data: any; setData: (d: any) => void }) {
  return (
    <div className="space-y-5">
      <div>
        <div className="text-[10px] tracking-[0.06em] uppercase font-bold text-slate-500 mb-3">Punto de partida</div>
        <div className="space-y-2">
          {TEMPLATES.map((t) => (
            <PickCard key={t.id} on={data.template === t.id} onClick={() => setData({ ...data, template: t.id })}
              name={t.name} sub={t.sub} recommended={t.recommended} />
          ))}
        </div>
      </div>
      <div>
        <div className="text-[10px] tracking-[0.06em] uppercase font-bold text-slate-500 mb-3">Fechas estimadas</div>
        <div className="grid grid-cols-2 gap-4">
          <WField label="Inicio de obra">
            <WInput type="date" value={data.startDate} onChange={(e: any) => setData({ ...data, startDate: e.target.value })} />
          </WField>
          <WField label="Fin estimado" hint="Opcional · podés definirlo después.">
            <WInput type="date" value={data.endDate} onChange={(e: any) => setData({ ...data, endDate: e.target.value })} />
          </WField>
        </div>
      </div>

      <div className="bg-paper border border-slate-200 rounded-lg p-4">
        <div className="text-[10px] tracking-[0.06em] uppercase font-bold text-slate-500 mb-2">Resumen</div>
        <div className="grid grid-cols-2 gap-y-2 gap-x-4 text-[12px]">
          <div className="text-slate-500">Nombre</div><div className="font-bold text-slate-950">{data.name || "—"}</div>
          <div className="text-slate-500">Tipo</div><div className="font-bold text-slate-950">{TYPES.find((t: any) => t.id === data.type)?.name || "—"}</div>
          <div className="text-slate-500">Ubicación</div><div className="font-bold text-slate-950 truncate">{data.address ? `${data.address}, ${data.city}` : "—"}</div>
          <div className="text-slate-500">Equipo</div><div className="font-bold text-slate-950">{data.team.length} persona{data.team.length === 1 ? "" : "s"}</div>
          <div className="text-slate-500">Inicio</div><div className="font-bold text-slate-950">{data.startDate || "—"}</div>
        </div>
      </div>
    </div>
  );
}
