"use client";

import { WField } from "./WField";
import { WInput } from "./WInput";

const TIPOS: Record<string, string> = {
  edificio: "Edificio en altura",
  vivienda: "Vivienda unifamiliar",
  refaccion: "Refacción / remodelación",
  comercial: "Comercial / industrial",
};

export function NewStep2Data({ data, setData }: { data: any; setData: (upd: (d: any) => any) => void }) {
  return (
    <div className="grid grid-cols-2 gap-4">
      <WField label="Nombre de la obra" span={2} hint="Es lo que tu equipo va a ver en WhatsApp.">
        <WInput autoFocus value={data.nombre} onChange={(e: any) => setData((d: any) => ({ ...d, nombre: e.target.value }))} placeholder="Ej. Edificio Belgrano" />
      </WField>
      <WField label="Código interno" hint="Opcional · para tus referencias.">
        <WInput value={data.codigo} onChange={(e: any) => setData((d: any) => ({ ...d, codigo: e.target.value }))} placeholder="OBR-2026-001" />
      </WField>
      <WField label="Tipo">
        <WInput value={TIPOS[data.tipo as string] || ""} disabled />
      </WField>
      <WField label="Dirección" span={2}>
        <WInput value={data.direccion} onChange={(e: any) => setData((d: any) => ({ ...d, direccion: e.target.value }))} placeholder="Av. Belgrano 1842, CABA" />
      </WField>
      <WField label="Inicio">
        <WInput type="date" value={data.inicio} onChange={(e: any) => setData((d: any) => ({ ...d, inicio: e.target.value }))} />
      </WField>
      <WField label="Fin estimado">
        <WInput type="date" value={data.fin} onChange={(e: any) => setData((d: any) => ({ ...d, fin: e.target.value }))} />
      </WField>
    </div>
  );
}
