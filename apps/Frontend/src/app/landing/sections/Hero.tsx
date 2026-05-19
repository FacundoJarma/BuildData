"use client";

import { ArrowRight, CircleCheck, StarFill } from "@gravity-ui/icons";
import PhoneMockup from "../../components/landing/PhoneMockup";
import DashboardMockup from "../../components/landing/DashboardMockup";
import { LOGOS } from "../data/landing";

export default function Hero() {
  return (
    <section className="relative pt-[120px] pb-[60px] hero-grid overflow-hidden">
      <div className="orb orb-1" />
      <div className="orb orb-2" />
      <div className="absolute inset-0 hero-mesh pointer-events-none" />

      <div className="relative max-w-[1240px] mx-auto px-6 grid grid-cols-12 gap-8 items-center">
        <div className="col-span-12 lg:col-span-6">
          <div className="inline-flex items-center gap-2 bg-white/70 backdrop-blur border border-slate200 rounded-full px-3 py-[6px] mb-6 shadow-card animate-fadein">
            <span className="w-1.5 h-1.5 rounded-full bg-success live-dot" />
            <span className="text-[11px] font-bold tracking-[0.06em] uppercase text-slate700">Para constructoras y estudios de arquitectura</span>
          </div>

          <h1 className="text-[clamp(40px,5vw,64px)] leading-[1.04] font-extrabold display-tight text-slate950 mb-5 animate-fadein-1">
            La información de tu obra,<br />
            <span className="relative">
              <span className="relative z-10">ordenada en un solo lugar.</span>
              <span className="absolute left-0 right-0 bottom-[6px] h-[10px] bg-accent/35 -z-0" />
            </span>
          </h1>

          <p className="text-[18px] leading-[28px] text-slate600 max-w-[540px] mb-7 animate-fadein-2">
            Convertí reportes de <b className="text-slate950">WhatsApp</b> en decisiones claras.
            BuildData escucha los audios, fotos y mensajes que ya manda tu equipo, y los transforma en un dashboard en tiempo real.
          </p>

          <div className="flex flex-wrap items-center gap-3 mb-8 animate-fadein-3">
            <a href="#cta" className="inline-flex items-center gap-2 bg-primary hover:bg-primary-700 text-white font-bold text-[14px] px-5 py-[12px] rounded-md shadow-pop">
              Probar 14 días gratis <ArrowRight width={14} height={14} />
            </a>
            <a href="#dashboard" className="inline-flex items-center gap-2 bg-white hover:bg-slate50 text-slate950 border border-slate200 font-bold text-[14px] px-5 py-[12px] rounded-md">
              Ver el producto
            </a>
          </div>

          <div className="flex items-center gap-5 text-[12px] text-slate500 animate-fadein-4">
            <div className="flex items-center gap-2">
              <CircleCheck width={14} height={14} className="text-success" /> Sin migrar nada
            </div>
            <div className="flex items-center gap-2">
              <CircleCheck width={14} height={14} className="text-success" /> Sin app nueva para los capataces
            </div>
            <div className="flex items-center gap-2">
              <CircleCheck width={14} height={14} className="text-success" /> Setup en 1 día
            </div>
          </div>
        </div>

        <div className="col-span-12 lg:col-span-6 relative h-[560px]">
          <HeroComposite />
        </div>
      </div>

      <div className="relative max-w-[1240px] mx-auto px-6 mt-16">
        <div className="text-center eyebrow text-slate500 mb-5">Usado por equipos de obra que ya no quieren perseguir información</div>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-x-8 gap-y-4 items-center justify-items-center opacity-60">
          {LOGOS.map((l) => (
            <div key={l} className="text-[13px] font-extrabold tracking-[0.08em] text-slate600 whitespace-nowrap">{l}</div>
          ))}
        </div>
      </div>
    </section>
  );
}

function HeroComposite() {
  return (
    <div className="absolute inset-0">
      <div
        style={{ transformOrigin: "left center", transform: "perspective(1500px) rotateY(-6deg) rotateX(2deg)" }}
        className="absolute top-2 right-0 w-[720px] origin-left animate-fadein">
        <div style={{ transform: "scale(0.82)", transformOrigin: "top right" }}>
          <DashboardMockup width={860} compact />
        </div>
      </div>

      <div className="absolute -bottom-6 left-0 z-10 animate-fadein-3">
        <PhoneMockup width={260} mode="confirm" />
      </div>

      <svg className="absolute top-[150px] left-[210px] z-0 pointer-events-none" width="340" height="80" viewBox="0 0 340 80" fill="none">
        <path d="M 0 60 C 80 60 100 10 200 10 L 320 10" stroke="#0F4395" strokeWidth="1.5" strokeDasharray="4 4" opacity="0.45" />
        <circle cx="320" cy="10" r="3" fill="#0F4395" />
      </svg>

      <div className="absolute top-2 left-[40%] bg-white rounded-lg border border-slate200 shadow-pop px-3 py-2 z-20 animate-fadein-4">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-md bg-accent/15 text-accent flex items-center justify-center"><SparkleIcon /></div>
          <div>
            <div className="text-[10px] tracking-[0.08em] uppercase font-bold text-accent-700">Insight IA</div>
            <div className="text-[11px] font-bold text-slate950">Hormigón con 3 días de demora</div>
          </div>
        </div>
      </div>

      <div className="absolute bottom-[30px] right-2 bg-white rounded-lg border border-slate200 shadow-pop px-3 py-2 z-20 animate-fadein-4">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-md bg-success50 text-[#15803D] flex items-center justify-center"><CircleCheck width={14} height={14} /></div>
          <div>
            <div className="text-[10px] tracking-[0.08em] uppercase font-bold text-[#15803D]">Pedido guardado</div>
            <div className="text-[11px] font-bold text-slate950">#PED-0142 · Sector A</div>
          </div>
        </div>
      </div>
    </div>
  );
}

function SparkleIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M12 2l2.4 7.2L22 12l-7.6 2.8L12 22l-2.4-7.2L2 12l7.6-2.8z" />
    </svg>
  );
}
