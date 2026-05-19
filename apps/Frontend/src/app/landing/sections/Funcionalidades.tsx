"use client";

import { motion as m } from "framer-motion";
import {
  Microphone, CircleExclamation, Box, ChartBar, Calendar, Persons,
} from "@gravity-ui/icons";
import { FEATURES, TONE_MAP } from "../data/landing";

const featureIconMap: Record<string, React.ReactNode> = {
  mic: <Microphone width={20} height={20} />,
  photo: <CameraSvg width={20} height={20} />,
  alert: <CircleExclamation width={20} height={20} />,
  package: <Box width={20} height={20} />,
  chart: <ChartBar width={20} height={20} />,
  calendar: <Calendar width={20} height={20} />,
  users: <Persons width={20} height={20} />,
  download: (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M10 2.5a.625.625 0 0 1 .625.625v7.933l2.567-2.567a.625.625 0 0 1 .884.884l-3.75 3.75a.625.625 0 0 1-.884 0l-3.75-3.75a.625.625 0 1 1 .884-.884L9.375 11.06V3.126A.625.625 0 0 1 10 2.5zM3.125 16.25a.625.625 0 0 1 .625-.625h12.5a.625.625 0 1 1 0 1.25H3.75a.625.625 0 0 1-.625-.625z" fill="currentColor"/>
    </svg>
  ),
};

function CameraSvg({ width = 18, height = 18 }: { width?: number; height?: number }) {
  return (
    <svg width={width} height={height} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
      <circle cx="12" cy="13" r="4" />
    </svg>
  );
}

export default function Funcionalidades() {
  return (
    <section id="funcionalidades" className="py-[120px] bg-paper">
      <div className="max-w-[1240px] mx-auto px-6">
        <div className="max-w-[720px] mb-14">
          <div className="eyebrow mb-3">Funcionalidades</div>
          <h2 className="text-[clamp(32px,4vw,48px)] leading-[1.08] font-extrabold display-tight mb-4 text-slate950">
            Todo lo que pasa en la obra, <span className="text-primary">organizado solo.</span>
          </h2>
          <p className="text-[17px] leading-[26px] text-slate600 max-w-[600px]">
            Ocho módulos hechos para constructoras: del audio del capataz al reporte para el cliente, sin que nadie copie y pegue.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {FEATURES.map((f) => {
            const t = TONE_MAP[f.tone as keyof typeof TONE_MAP];
            return (
              <m.div key={f.t}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.4 }}
                className="bg-white border border-slate200 rounded-xl p-5 hover:shadow-pop hover:border-slate300 transition-all group">
                <div className={`w-11 h-11 rounded-lg ${t.tint} ${t.fg} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  {featureIconMap[f.i]}
                </div>
                <div className="text-[16px] font-bold mb-1 text-slate950">{f.t}</div>
                <div className="text-[13px] leading-[19px] text-slate600">{f.s}</div>
              </m.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
