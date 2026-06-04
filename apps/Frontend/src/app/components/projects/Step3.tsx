"use client";

import { Plus } from "@gravity-ui/icons";
import { PEOPLE } from "@/app/projects/data/wizard";
import { DAvatar } from "@/app/components/ui/DAvatar";
import { PickCard } from "./PickCard";

export function Step3({ data, setData }: { data: any; setData: (d: any) => void }) {
  const toggle = (id: string) => {
    const has = data.team.includes(id);
    setData({ ...data, team: has ? data.team.filter((x: string) => x !== id) : [...data.team, id] });
  };

  return (
    <div className="space-y-5">
      {/*
      <div>
        <div className="text-[10px] tracking-[0.06em] uppercase font-bold text-slate-500 mb-3">Tu rol en esta obra</div>
        <div className="grid grid-cols-2 gap-3">
          {ROLES.map((r) => (
            <PickCard key={r.id} on={data.myRole === r.id} onClick={() => setData({ ...data, myRole: r.id })}
              name={r.label} sub={r.sub} />
          ))}
        </div>
      </div>
      */}
      <div>
        <div className="flex items-end justify-between mb-3">
          <div>
            <div className="text-[10px] tracking-[0.06em] uppercase font-bold text-slate-500">Invitar al equipo</div>
            <div className="text-[11px] text-slate-500 mt-[1px]">Elegí de tu agenda o sumá nuevos por WhatsApp.</div>
          </div>
          <div className="text-[11px] text-slate-600 font-semibold">
            {data.team.length} seleccionado{data.team.length === 1 ? "" : "s"}
          </div>
        </div>
        <div className="bg-white border border-slate-200 rounded-lg divide-y divide-slate-100">
          {PEOPLE.map((p) => {
            const on = data.team.includes(p.id);
            return (
              <button key={p.id} type="button" onClick={() => toggle(p.id)}
                className="w-full flex items-center gap-3 px-4 py-[10px] hover:bg-slate-50 text-left">
                <DAvatar initials={p.id} size={32} />
                <div className="flex-1 min-w-0">
                  <div className="text-[13px] font-bold text-slate-950">{p.name}</div>
                  <div className="text-[11px] text-slate-500">{p.role}</div>
                </div>
                <span className={`w-5 h-5 rounded-md border-2 flex items-center justify-center flex-none ${on ? "bg-primary border-primary text-white" : "border-slate-300 bg-white"}`}>
                  {on && (
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  )}
                </span>
              </button>
            );
          })}
          <button type="button" className="w-full flex items-center gap-3 px-4 py-[10px] hover:bg-slate-50 text-left text-primary">
            <div className="w-8 h-8 rounded-full border-2 border-dashed border-primary text-primary flex items-center justify-center">
              <Plus width={13} height={13} />
            </div>
            <div className="text-[13px] font-bold">Invitar a alguien nuevo por WhatsApp</div>
          </button>
        </div>
      </div>
    </div>
  );
}
