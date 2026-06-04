"use client";

import { Magnifier, CircleInfo, Bell } from "@gravity-ui/icons";
import { DAvatar } from "@/components/ui/DAvatar";

export function WorkspaceTopbar({ query, onQuery }: { query: string; onQuery: (v: string) => void }) {
  return (
    <header className="h-[58px] px-6 border-b border-slate-200 bg-white flex items-center gap-3 flex-none">
      <div className="flex-1 max-w-[480px] flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-md px-3 py-[8px] text-[13px] text-slate-500 focus-within:border-primary transition-colors">
        <Magnifier width={15} height={15} />
        <input value={query} onChange={(e) => onQuery(e.target.value)} placeholder="Buscar obras, archivos, personas…"
          className="flex-1 bg-transparent border-0 outline-none text-slate-950 placeholder:text-slate-500" />
        <span className="bg-white border border-slate-200 text-[10px] font-bold px-[5px] py-[1px] rounded text-slate-500">⌘K</span>
      </div>
      <div className="flex-1" />
      <button className="w-9 h-9 rounded-md border border-slate-200 bg-white text-slate-600 flex items-center justify-center hover:bg-slate-50">
        <CircleInfo width={15} height={15} />
      </button>
      <button className="w-9 h-9 rounded-md border border-slate-200 bg-white text-slate-600 flex items-center justify-center relative hover:bg-slate-50">
        <Bell width={15} height={15} />
        <span className="absolute top-[6px] right-[6px] w-2 h-2 rounded-full bg-critical border-2 border-white" />
      </button>
      <DAvatar initials="JM" size={32} />
    </header>
  );
}
