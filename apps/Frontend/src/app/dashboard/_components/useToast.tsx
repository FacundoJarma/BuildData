"use client";

import { useState, useRef, useCallback } from "react";
import { Check } from "@gravity-ui/icons";

export function useToast(): [string | null, (msg: string) => void] {
  const [msg, setMsg] = useState<string | null>(null);
  const ref = useRef<ReturnType<typeof setTimeout> | null>(null);

  const flash = useCallback((m: string) => {
    setMsg(m);
    if (ref.current) clearTimeout(ref.current);
    ref.current = setTimeout(() => setMsg(null), 2400);
  }, []);

  return [msg, flash];
}

export function DashToast({ msg }: { msg: string | null }) {
  if (!msg) return null;
  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[70] bg-slate-950 text-white text-[13px] font-semibold rounded-lg px-4 py-3 flex items-center gap-2 shadow-pop animate-toast-in">
      <Check width={14} height={14} className="text-success" />
      {msg}
    </div>
  );
}
