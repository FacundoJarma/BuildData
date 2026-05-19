"use client";

import { motion as m } from "framer-motion";
import { CircleCheck, Sparkles } from "@gravity-ui/icons";
import LiveBot from "../../components/landing/LiveBot";

export default function ChatbotSection() {
  return (
    <section id="chatbot" className="py-[100px] bg-ink-deep text-white relative overflow-hidden">
      <div className="absolute inset-0 blueprint-bg opacity-90" />
      <div className="absolute top-[10%] right-[5%] w-[500px] h-[500px] rounded-full bg-accent/15 blur-3xl" />
      <div className="absolute bottom-[5%] left-[5%] w-[400px] h-[400px] rounded-full bg-primary/30 blur-3xl" />

      <div className="relative max-w-[1240px] mx-auto px-6">
        <div className="grid grid-cols-12 gap-8 mb-12">
          <div className="col-span-12 lg:col-span-7">
            <div className="flex items-center gap-3 mb-3">
              <div className="eyebrow text-accent">Chatbot IA</div>
              <span className="inline-flex items-center gap-1 bg-accent/15 text-accent text-[10px] font-bold tracking-wider uppercase px-2 py-[3px] rounded-full">
                <span className="w-1.5 h-1.5 rounded-full bg-accent live-dot" /> Probalo
              </span>
            </div>
            <h2 className="text-[clamp(32px,4vw,48px)] leading-[1.06] font-extrabold display-tight mb-4">
              Un asistente de obra que habla castellano,<br />
              <span className="text-accent">no jerga técnica.</span>
            </h2>
            <p className="text-[17px] leading-[26px] text-slate300 max-w-[640px]">
              Vive dentro del grupo de WhatsApp que tu equipo ya usa. Elegí un escenario, respondé al bot y mirá cómo se transforma en datos del otro lado.
            </p>
          </div>
          <div className="col-span-12 lg:col-span-5 flex lg:justify-end items-end">
            <div className="flex flex-wrap gap-x-5 gap-y-2 text-[12px] text-slate400">
              <div className="flex items-center gap-2"><CircleCheck width={14} height={14} className="text-success" /> Sin entrenamiento</div>
              <div className="flex items-center gap-2"><CircleCheck width={14} height={14} className="text-success" /> Sin app nueva</div>
              <div className="flex items-center gap-2"><CircleCheck width={14} height={14} className="text-success" /> Funciona offline</div>
            </div>
          </div>
        </div>

        <m.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7 }}>
          <LiveBot />
        </m.div>
      </div>
    </section>
  );
}
