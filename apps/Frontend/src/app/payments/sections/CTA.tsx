import { ArrowRight } from "@gravity-ui/icons";

export default function CTA() {
  return (
    <section className="blueprint-bg relative overflow-hidden">
      <div className="max-w-[1100px] mx-auto px-6 py-20 text-center text-white relative z-10">
        <h2 className="text-[clamp(28px,4vw,44px)] leading-[1.1] font-extrabold display-tight mb-4 max-w-[760px] mx-auto">
          <span style={{ color: "#FFFFFF" }}>
            Probá BuildData en tu obra.
          </span>
          <br />
          <span className="text-accent">
            En 24 horas tu información va a estar ordenada.
          </span>
        </h2>
        <p className="text-[15px] text-white/70 max-w-[540px] mx-auto leading-relaxed mb-8">
          Sin tarjeta de crédito. Sin contratos largos. Sin instalaciones
          complicadas.
        </p>
        <div className="flex flex-wrap gap-3 justify-center">
          <a
            href="/login"
            className="inline-flex items-center gap-2 bg-accent hover:bg-accent-700 text-slate950 font-bold rounded-md px-6 py-[12px] text-[14px] transition-colors"
          >
            Empezar 14 días gratis <ArrowRight />
          </a>
          <a
            href="mailto:hola@buildata.app"
            className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white font-bold rounded-md px-6 py-[12px] text-[14px] transition-colors"
          >
            Agendar una demo
          </a>
        </div>
      </div>
    </section>
  );
}
