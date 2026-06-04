import type { Obra } from "@/types/projects";

function BlueprintVariant({ obra, height }: { obra: Obra; height: number }) {
  return (
    <div className="relative w-full overflow-hidden rounded-t-lg" style={{ height, background: obra.color }}>
      <svg viewBox="0 0 220 100" preserveAspectRatio="xMidYMid slice" className="absolute inset-0 w-full h-full opacity-30">
        {[...Array(8)].map((_, i) => (
          <line key={"h" + i} x1="0" x2="220" y1={i * 14} y2={i * 14} stroke="#ffffff" strokeWidth="0.6" />
        ))}
        {[...Array(16)].map((_, i) => (
          <line key={"v" + i} x1={i * 14} x2={i * 14} y1="0" y2="100" stroke="#ffffff" strokeWidth="0.6" />
        ))}
      </svg>
      <svg viewBox="0 0 60 40" className="absolute inset-0 m-auto w-[60px] h-[40px] opacity-95">
        <rect x="6" y="22" width="9" height="14" rx="1.5" fill="#FFFFFF" fillOpacity="0.85" />
        <rect x="20" y="14" width="9" height="22" rx="1.5" fill="#FFFFFF" />
        <rect x="34" y="4" width="9" height="32" rx="1.5" fill="#F59E0B" />
        {obra.id === "casa-tigre" && <circle cx="50" cy="8" r="5" fill="#22C55E" />}
      </svg>
      {obra.starred && (
        <div className="absolute top-2 right-2 w-7 h-7 rounded-full bg-white/15 backdrop-blur flex items-center justify-center">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="#F59E0B">
            <path d="M12 17.27 18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
          </svg>
        </div>
      )}
      <div className="absolute bottom-0 left-0 right-0 px-3 py-2 bg-gradient-to-t from-black/40 to-transparent flex items-center gap-2">
        <div className="flex-1 h-[3px] bg-white/20 rounded-full overflow-hidden">
          <div className="h-full bg-white rounded-full" style={{ width: `${obra.progress}%` }} />
        </div>
        <div className="text-[10px] font-bold text-white tnum">{obra.progress}%</div>
      </div>
    </div>
  );
}

function MinimalVariant({ obra, height }: { obra: Obra; height: number }) {
  return (
    <div className="relative w-full overflow-hidden rounded-t-lg flex items-center justify-center" style={{ height, background: obra.color }}>
      <div className="text-white font-extrabold display-tight leading-none" style={{ fontSize: height * 0.62, letterSpacing: "-0.04em" }}>
        {obra.name[0]}
      </div>
      <div className="absolute top-3 left-3 text-[9px] tracking-[0.12em] uppercase font-bold text-white/60">{obra.code}</div>
      {obra.starred && (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="#F59E0B" className="absolute top-3 right-3">
          <path d="M12 17.27 18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
        </svg>
      )}
      <div className="absolute bottom-0 left-0 right-0 px-3 py-2 bg-gradient-to-t from-black/35 to-transparent flex items-center gap-2">
        <div className="flex-1 h-[3px] bg-white/20 rounded-full overflow-hidden">
          <div className="h-full bg-white rounded-full" style={{ width: `${obra.progress}%` }} />
        </div>
        <div className="text-[10px] font-bold text-white tnum">{obra.progress}%</div>
      </div>
    </div>
  );
}

function SwatchVariant({ obra, height }: { obra: Obra; height: number }) {
  return (
    <div className="relative w-full overflow-hidden rounded-t-lg flex items-stretch" style={{ height, background: "#FCF8FA" }}>
      <div className="absolute inset-0" style={{ background: obra.color, clipPath: "polygon(0 0, 65% 0, 50% 100%, 0 100%)" }} />
      <div className="absolute inset-y-0 right-0 w-[45%] flex flex-col items-end justify-center pr-4 text-right">
        <div className="text-[10px] tracking-[0.12em] uppercase font-bold text-slate-500">Avance</div>
        <div className="text-slate-950 font-extrabold display-tight tnum leading-none" style={{ fontSize: height * 0.46, letterSpacing: "-0.04em" }}>
          {obra.progress}<span className="text-[40%] text-slate-500"> %</span>
        </div>
      </div>
      <div className="absolute top-3 left-3 text-[9px] tracking-[0.12em] uppercase font-bold text-white/85">{obra.code}</div>
      {obra.starred && (
        <svg width="12" height="12" viewBox="0 0 24 24" fill="#F59E0B" className="absolute bottom-3 left-3">
          <path d="M12 17.27 18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
        </svg>
      )}
    </div>
  );
}

export function ObraThumb({ obra, height = 100, variant = "blueprint" }: { obra: Obra; height?: number; variant?: "blueprint" | "minimal" | "swatch" }) {
  if (variant === "minimal") return <MinimalVariant obra={obra} height={height} />;
  if (variant === "swatch") return <SwatchVariant obra={obra} height={height} />;
  return <BlueprintVariant obra={obra} height={height} />;
}
