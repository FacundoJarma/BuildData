"use client";
import {useAuth} from "@/contexts/AuthContext";

function BuildingIcon() {
  return (
    <svg width="16" height="14" viewBox="0 0 60 40" fill="currentColor">
      <rect x="6" y="22" width="9" height="14" rx="1.5" opacity="0.6" />
      <rect x="20" y="14" width="9" height="22" rx="1.5" opacity="0.85" />
      <rect x="34" y="4" width="9" height="32" rx="1.5" />
    </svg>
  );
}

function AlertIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2L2 21h20L12 2z" />
      <line x1="12" y1="9" x2="12" y2="13" />
      <line x1="12" y1="17" x2="12.01" y2="17" />
    </svg>
  );
}

function TruckIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="1" y="3" width="15" height="13" />
      <polygon points="16 8 20 8 23 11 23 16 16 16 16 8" />
      <circle cx="5.5" cy="18.5" r="2.5" />
      <circle cx="18.5" cy="18.5" r="2.5" />
    </svg>
  );
}

export function WelcomeHero({
  greeting,
  dateLabel,
  totals,
}: {
  greeting: string;
  dateLabel: string;
  totals: { activas: number; alertas: number; pedidos: number };
}) {

  const { profile } = useAuth();
  const name = typeof profile?.nombre === "string" ? profile.nombre.split(" ")[0] : "";
  return (
    <div className="relative overflow-hidden rounded-2xl mb-7 text-white blueprint-bg">
      <div className="absolute rounded-full pointer-events-none w-[600px] h-[600px] bg-[radial-gradient(circle,rgba(245,158,11,0.15)_0%,transparent_60%)] -top-[200px] -right-[100px]" />
      <div className="absolute rounded-full pointer-events-none w-[500px] h-[500px] bg-[radial-gradient(circle,rgba(11,50,117,0.5)_0%,transparent_60%)] -bottom-[150px] -left-[100px]" />
      <div className="absolute inset-0 pointer-events-none bg-[repeating-linear-gradient(0deg,rgba(255,255,255,0.05)_0_1px,transparent_1px_32px),repeating-linear-gradient(90deg,rgba(255,255,255,0.05)_0_1px,transparent_1px_36px)]" />

      <svg className="absolute bottom-0 right-0 h-[120px] w-auto opacity-[0.13] pointer-events-none" viewBox="0 0 320 120" fill="none" preserveAspectRatio="xMaxYMax meet">
        <rect x="6"   y="64" width="30" height="56" fill="#fff" />
        <rect x="44"  y="40" width="34" height="80" fill="#fff" />
        <rect x="86"  y="78" width="26" height="42" fill="#fff" />
        <rect x="120" y="20" width="36" height="100" fill="#fff" />
        <rect x="120" y="20" width="36" height="14" fill="#F59E0B" />
        <rect x="164" y="56" width="30" height="64" fill="#fff" />
        <rect x="202" y="34" width="34" height="86" fill="#fff" />
        <rect x="244" y="70" width="26" height="50" fill="#fff" />
        <rect x="278" y="48" width="34" height="72" fill="#fff" />
        <path d="M150 20 L150 4 L210 4 M150 10 L168 4" stroke="#F59E0B" strokeWidth="2" />
      </svg>

      <div className="absolute bottom-0 left-0 right-0 h-[60%] pointer-events-none bg-gradient-to-t from-slate-950/80 to-transparent" />

      <div className="relative z-10 px-7 py-7 sm:px-9 sm:py-8">
        <div className="flex items-center gap-2 mb-3">
          <span className="inline-flex items-center gap-[6px] bg-white/10 backdrop-blur-sm text-white/80 text-[10px] font-bold tracking-[0.08em] uppercase px-[10px] py-[5px] rounded-full">
            <span className="w-[6px] h-[6px] rounded-full bg-success animate-pulse" />
            {dateLabel}
          </span>
        </div>

        <div className="flex items-start gap-3 mb-1">
          <div>
            <h1 className="text-[clamp(26px,3vw,36px)] font-extrabold display-tight leading-[1.05]">
              <span>{greeting}</span>, <span className="text-accent">{name}</span>
            </h1>
            <p className="text-[13px] sm:text-[14px] text-white/70 mt-1 leading-snug max-w-[520px]">
              Tenés un buen panorama hoy. Esto es lo que está pasando en tus obras.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mt-5">
          <div className="inline-flex items-center gap-[6px] bg-white/10 backdrop-blur-sm border border-white/10 px-[10px] py-[5px] rounded-full text-[13px] text-white/85">
            <span className="w-[26px] h-[26px] rounded-md flex items-center justify-center shrink-0" style={{ background: "rgba(34,197,94,0.18)", color: "#86EFAC" }}>
              <BuildingIcon />
            </span>
            <span><b className="tnum">{totals.activas}</b> obras en curso</span>
          </div>
          <div className="inline-flex items-center gap-[6px] bg-white/10 backdrop-blur-sm border border-white/10 px-[10px] py-[5px] rounded-full text-[13px] text-white/85">
            <span className="w-[26px] h-[26px] rounded-md flex items-center justify-center shrink-0" style={{ background: "rgba(239,68,68,0.2)", color: "#FCA5A5" }}>
              <AlertIcon />
            </span>
            <span><b className="tnum">{totals.alertas}</b> alertas activas</span>
          </div>
          <div className="inline-flex items-center gap-[6px] bg-white/10 backdrop-blur-sm border border-white/10 px-[10px] py-[5px] rounded-full text-[13px] text-white/85">
            <span className="w-[26px] h-[26px] rounded-md flex items-center justify-center shrink-0" style={{ background: "rgba(245,158,11,0.2)", color: "#FCD34D" }}>
              <TruckIcon />
            </span>
            <span><b className="tnum">{totals.pedidos}</b> pedidos pendientes</span>
          </div>
        </div>
      </div>
    </div>
  );
}
