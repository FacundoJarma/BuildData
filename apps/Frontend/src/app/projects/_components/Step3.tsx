"use client";

import { useState } from "react";
import { Plus, ChevronUp } from "@gravity-ui/icons";
import { PEOPLE, MORE_PEOPLE, TEAM_ROLES_LIST } from "@/app/projects/data/wizard";
import { DAvatar } from "@/components/ui/DAvatar";

export function Step3({ data, setData, errors = {} }: { data: any; setData: (d: any) => void; errors?: Record<string, string> }) {
  const [showMore, setShowMore] = useState(false);

  const toggle = (p: { id: string; role: string }) => {
    const has = data.team.includes(p.id);
    if (has) {
      const roles = { ...(data.teamRoles || {}) };
      delete roles[p.id];
      setData({ ...data, team: data.team.filter((x: string) => x !== p.id), teamRoles: roles });
    } else {
      setData({ ...data, team: [...data.team, p.id], teamRoles: { ...(data.teamRoles || {}), [p.id]: p.role } });
    }
  };

  const setRole = (id: string, role: string) =>
    setData({ ...data, teamRoles: { ...(data.teamRoles || {}), [id]: role } });

  const Row = (p: { id: string; name: string; role: string }) => {
    const on = data.team.includes(p.id);
    const role = (data.teamRoles || {})[p.id] || p.role;
    return (
      <div key={p.id} className={on ? "bg-primary-50/30" : ""}>
        <button type="button" onClick={() => toggle(p)}
          className="w-full flex items-center gap-3 px-4 py-[10px] hover:bg-slate-50 text-left">
          <DAvatar initials={p.id} size={32} />
          <div className="flex-1 min-w-0">
            <div className="text-[13px] font-bold text-slate-950">{p.name}</div>
            <div className="text-[11px] text-slate-500">{on ? role : p.role}</div>
          </div>
          <span className={`w-5 h-5 rounded-md border-2 flex items-center justify-center flex-none
            ${on ? "bg-primary border-primary text-white" : "border-slate-300 bg-white"}`}>
            {on && (
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            )}
          </span>
        </button>
        {on && (
          <div className="px-4 pb-3 pl-[60px] flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
            <span className="text-[11px] font-bold text-slate-500">Rol en esta obra:</span>
            <select value={role} onChange={(e) => setRole(p.id, e.target.value)}
              className="flex-1 bg-white border border-slate-200 rounded-md px-2 py-[6px] text-[12px] font-semibold focus:border-primary focus:outline-none">
              {TEAM_ROLES_LIST.map((r) => <option key={r} value={r}>{r}</option>)}
            </select>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-5">
      <div>
        <div className="flex items-end justify-between mb-3">
          <div>
            <div className="text-[10px] tracking-[0.06em] uppercase font-bold text-slate-500">Invitar al equipo</div>
            <div className="text-[11px] text-slate-500 mt-[1px]">Elegí personas y asignales un rol en esta obra.</div>
          </div>
          <div className="text-[11px] text-slate-600 font-semibold">
            {data.team.length} seleccionado{data.team.length === 1 ? "" : "s"}
          </div>
        </div>
        <div className="bg-white border border-slate-200 rounded-lg divide-y divide-slate-100">
          {PEOPLE.map(Row)}

          {showMore && (
            <>
              <div className="px-4 py-2 bg-slate-50 text-[10px] tracking-[0.06em] uppercase font-bold text-slate-500">
                Otros contactos en BuildData
              </div>
              {MORE_PEOPLE.map(Row)}
            </>
          )}

          <button type="button" onClick={() => setShowMore((v) => !v)}
            className="w-full flex items-center gap-3 px-4 py-[10px] hover:bg-slate-50 text-left text-primary">
            <div className="w-8 h-8 rounded-full border-2 border-dashed border-primary text-primary flex items-center justify-center">
              {showMore ? <ChevronUp width={13} height={13} /> : <Plus width={13} height={13} />}
            </div>
            <div className="text-[13px] font-bold">
              {showMore ? "Ocultar otros contactos" : `Ver más contactos de BuildData (${MORE_PEOPLE.length})`}
            </div>
          </button>
        </div>
        {errors.team && (
          <span className="text-[11px] font-semibold text-[#B91C1C] flex items-center gap-1 mt-3">
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="flex-none">
              <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
            {errors.team}
          </span>
        )}
      </div>
    </div>
  );
}
