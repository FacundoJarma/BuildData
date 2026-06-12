"use client";

import { TEMPLATES, TYPES } from "@/app/projects/data/wizard";
import { WField } from "./WField";
import { WInput } from "./WInput";
import { PickCard } from "./PickCard";

export function Step4({ data, setData, errors = {} }: { data: any; setData: (d: any) => void; errors?: Record<string, string> }) {
  return (
    <div className="space-y-5">

      <div>
        <div className="text-[10px] tracking-[0.06em] uppercase font-bold text-slate-500 mb-3">Fechas estimadas</div>
        <div className="grid grid-cols-2 gap-4">
          <WField label="Inicio de obra">
            <WInput type="date" value={data.startDate} onChange={(e: any) => setData({ ...data, startDate: e.target.value })} />
          </WField>
          <WField label="Fin estimado" hint="Opcional · podés definirlo después." error={errors.endDate}>
            <WInput type="date" value={data.endDate} onChange={(e: any) => setData({ ...data, endDate: e.target.value })} />
          </WField>
        </div>
      </div>
    </div>
  );
}
