"use client";

import { Plus, Xmark, CircleInfo } from "@gravity-ui/icons";
import { WField } from "./WField";
import { WInput } from "./WInput";
import { WSelect } from "./WSelect";

const ROLES = [
  { id: "director",   label: "Director" },
  { id: "capataz",    label: "Capataz" },
  { id: "compras",    label: "Compras" },
  { id: "arquitecto", label: "Arquitecto/a" },
  { id: "cliente",    label: "Cliente" },
];

export function NewStep3Team({ data, setData }: { data: any; setData: (upd: (d: any) => any) => void }) {
  const team = data.team || [];

  const addMember = () => {
    setData((d: any) => ({ ...d, team: [...d.team, { name: "", phone: "", role: "capataz" }] }));
  };

  const updMember = (i: number, k: string, v: string) => {
    setData((d: any) => {
      const next = [...d.team];
      next[i] = { ...next[i], [k]: v };
      return { ...d, team: next };
    });
  };

  const removeMember = (i: number) => {
    setData((d: any) => ({ ...d, team: d.team.filter((_: any, idx: number) => idx !== i) }));
  };

  return (
    <>
      <div className="bg-primary-50 border border-primary/15 rounded-lg p-4 mb-4 flex items-start gap-3">
        <div className="w-8 h-8 rounded-md bg-white text-primary flex items-center justify-center flex-none">
          <CircleInfo width={14} height={14} />
        </div>
        <div className="text-[12px] text-slate-700 leading-snug">
          <b className="text-slate-950">Vos ya estás incluido como administrador.</b> Sumá a quienes vayan a reportar por WhatsApp — pueden ser hasta 20 personas.
        </div>
      </div>

      <div className="text-[10px] tracking-[0.06em] uppercase font-bold text-slate-500 mb-3">Miembros del equipo</div>
      <div className="space-y-3">
        {team.map((m: any, i: number) => (
          <div key={i} className="grid grid-cols-[1fr_1fr_140px_36px] gap-2 items-end">
            <WField label={i === 0 ? "Nombre" : ""}>
              <WInput value={m.name} onChange={(e: any) => updMember(i, "name", e.target.value)} placeholder="C. Ríos" />
            </WField>
            <WField label={i === 0 ? "WhatsApp" : ""}>
              <WInput value={m.phone} onChange={(e: any) => updMember(i, "phone", e.target.value)} placeholder="+54 9 11 5432-1098" />
            </WField>
            <WField label={i === 0 ? "Rol" : ""}>
              <WSelect value={m.role} onChange={(e: any) => updMember(i, "role", e.target.value)}>
                {ROLES.map((r) => <option key={r.id} value={r.id}>{r.label}</option>)}
              </WSelect>
            </WField>
            <button onClick={() => removeMember(i)}
              className="w-9 h-9 rounded-md border border-slate-200 text-slate-500 hover:text-critical hover:border-critical flex items-center justify-center mb-[1px]">
              <Xmark width={14} height={14} />
            </button>
          </div>
        ))}
      </div>
      <button onClick={addMember}
        className="mt-4 inline-flex items-center gap-2 text-[12px] font-bold text-primary hover:underline">
        <Plus width={13} height={13} /> Agregar otra persona
      </button>

      <div className="mt-6 text-[11px] text-slate-500 leading-snug">
        Vas a poder copiar un link de invitación al finalizar — cada persona se suma confirmando su número en WhatsApp.
      </div>
    </>
  );
}
