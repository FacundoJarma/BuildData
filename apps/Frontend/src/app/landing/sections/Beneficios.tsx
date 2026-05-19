"use client";

import { motion as m } from "framer-motion";
import { Clock, Wrench, Shield } from "@gravity-ui/icons";
import { BENEFICIOS_STATS, BENEFICIOS_ITEMS } from "../data/landing";

const benefitIconMap: Record<string, React.ReactNode> = {
  clock: <Clock width={20} height={20} />,
  wrench: <Wrench width={20} height={20} />,
  shield: <Shield width={20} height={20} />,
};

function QuoteIcon() {
  return <span className="text-accent text-[60px] leading-none mb-2 font-serif">&ldquo;</span>;
}

function Avatar({ initials, size = 44 }: { initials: string; size?: number }) {
  return (
    <div
      style={{ width: size, height: size, fontSize: size * 0.38 }}
      className="rounded-full bg-gradient-to-br from-primary to-accent text-white font-bold flex items-center justify-center flex-none"
    >
      {initials}
    </div>
  );
}

export default function Beneficios() {
  return (
    <section className="py-[120px] bg-paper relative">
      <div className="max-w-[1240px] mx-auto px-6">
        <div className="max-w-[720px] mb-14">
          <div className="eyebrow mb-3">Beneficios</div>
          <h2 className="text-[clamp(32px,4vw,48px)] leading-[1.08] font-extrabold display-tight text-slate950 mb-4">
            Menos planillas. Menos llamadas.<br />
            <span className="text-primary">Más obras a tiempo.</span>
          </h2>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-14">
          {BENEFICIOS_STATS.map((s) => (
            <m.div key={s.l}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5 }}
              className="bg-white border border-slate200 rounded-xl p-6 shadow-card">
              <div className="text-[48px] font-extrabold display-tight text-primary tnum leading-none mb-2">{s.n}</div>
              <div className="text-[13px] text-slate600 leading-[18px]">{s.l}</div>
            </m.div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-12">
          {BENEFICIOS_ITEMS.map((b) => (
            <div key={b.t} className="bg-white border border-slate200 rounded-xl p-7 shadow-card flex flex-col">
              <div className="w-12 h-12 rounded-xl bg-primary text-white flex items-center justify-center mb-5 shadow-pop">
                {benefitIconMap[b.i]}
              </div>
              <div className="text-[20px] font-bold text-slate950 mb-2 display-tight">{b.t}</div>
              <div className="text-[14px] text-slate600 leading-[22px]">{b.s}</div>
            </div>
          ))}
        </div>

        <div className="bg-white border border-slate200 rounded-2xl p-10 shadow-card2 max-w-[900px] mx-auto">
          <QuoteIcon />
          <blockquote className="text-[22px] leading-[32px] text-slate800 font-semibold display-tight mb-6">
            Antes pasaba dos horas por la mañana llamando a los jefes de obra para armar el parte. Hoy abro BuildData y ya está. Y lo más raro: a los capataces no les cambió nada.
          </blockquote>
          <div className="flex items-center gap-3">
            <Avatar initials="MR" size={44} />
            <div>
              <div className="text-[13px] font-bold text-slate950">Martín Rivera</div>
              <div className="text-[12px] text-slate500">Director de obra · Constructora Larío</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
