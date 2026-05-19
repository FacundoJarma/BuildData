"use client";

import { motion as m } from "framer-motion";
import {
  Envelope, Clock, Box, Camera, TriangleExclamation,
} from "@gravity-ui/icons";
import { PROBLEMA_ITEMS, PROBLEMA_STATS } from "../data/landing";

const iconMap: Record<string, React.ReactNode> = {
  message: <Envelope width={18} height={18} />,
  clock: <Clock width={18} height={18} />,
  package: <Box width={18} height={18} />,
  photo: <CameraSvg width={18} height={18} />,
};

function CameraSvg({ width = 18, height = 18 }: { width?: number; height?: number }) {
  return (
    <svg width={width} height={height} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
      <circle cx="12" cy="13" r="4" />
    </svg>
  );
}

export default function Problema() {
  return (
    <section id="problema" className="relative py-[120px] bg-slate950 text-[#0F172A] overflow-hidden">
      <div className="absolute inset-0 opacity-50"
        style={{ backgroundImage: "repeating-linear-gradient(0deg, rgba(255,255,255,.04) 0 1px, transparent 1px 40px), repeating-linear-gradient(90deg, rgba(255,255,255,.04) 0 1px, transparent 1px 40px)" }} />
      <div className="absolute top-[20%] left-[10%] w-[400px] h-[400px] rounded-full bg-critical/10 blur-3xl" />

      <div className="relative max-w-[1240px] mx-auto px-6">
        <div className="max-w-[760px] mb-16">
          <div className="eyebrow text-accent mb-3">El problema</div>
          <h2 className="text-[clamp(32px,4vw,52px)] leading-[1.08] font-extrabold display-tight mb-5">
            En la obra todo pasa.<br />
            En la oficina, <span className="text-slate400">nadie se entera a tiempo.</span>
          </h2>
          <p className="text-[17px] leading-[26px] text-slate300 max-w-[640px]">
            El equipo de obra ya reporta — pero lo hace en audios, fotos y mensajes que se pierden en chats. El director necesita decidir con datos, y termina pidiéndolos uno por uno.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {PROBLEMA_ITEMS.map((it) => (
            <m.div key={it.t}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.5 }}
              className="bg-white/5 border border-white/10 rounded-xl p-5 hover:bg-white/10 transition-colors">
              <div className="w-10 h-10 rounded-lg bg-critical/15 text-[#FCA5A5] flex items-center justify-center mb-3">
                {iconMap[it.icon]}
              </div>
              <div className="text-[16px] font-bold mb-1">{it.t}</div>
              <div className="text-[13px] leading-[20px] text-slate400">{it.s}</div>
            </m.div>
          ))}
        </div>

        <div className="mt-14 grid grid-cols-3 gap-6 border-t border-white/10 pt-10">
          {PROBLEMA_STATS.map((s) => (
            <div key={s.l}>
              <div className="text-[44px] font-extrabold display-tight text-accent tnum leading-none mb-2">{s.n}</div>
              <div className="text-[13px] text-slate400 leading-[18px] max-w-[260px]">{s.l}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
