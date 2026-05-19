import { ArrowRight, CircleCheck } from "@gravity-ui/icons";

export default function CTA() {
  return (
    <section id="cta" className="py-[100px] bg-primary text-white relative overflow-hidden">
      <div className="absolute inset-0 opacity-25"
        style={{ backgroundImage: "repeating-linear-gradient(0deg, rgba(255,255,255,.1) 0 1px, transparent 1px 48px), repeating-linear-gradient(90deg, rgba(255,255,255,.1) 0 1px, transparent 1px 48px)" }} />
      <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] rounded-full bg-accent/20 blur-3xl" />
      <div className="absolute bottom-[-30%] left-[-10%] w-[500px] h-[500px] rounded-full bg-white/5 blur-3xl" />

      <div className="relative max-w-[1240px] mx-auto px-6 text-center">
        <div className="eyebrow text-accent mb-4">Empezá hoy</div>
        <h2 className="text-[clamp(36px,5vw,64px)] leading-[1.06] font-extrabold display-tight mb-6 max-w-[860px] mx-auto">
          Ordená la información de tu obra<br />
          <span className="text-accent">en menos de 24 horas.</span>
        </h2>
        <p className="text-[18px] leading-[28px] text-white/80 max-w-[640px] mx-auto mb-10">
          Conectamos tus grupos de WhatsApp, configuramos tu dashboard y entrenamos al equipo. Vos solo recibís el primer reporte ordenado.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3 mb-8">
          <a href="/login" className="inline-flex items-center gap-2 bg-accent hover:bg-accent-700 text-slate950 font-extrabold text-[15px] px-6 py-[14px] rounded-md shadow-pop">
            Probar 14 días gratis <ArrowRight width={16} height={16} />
          </a>
          <a href="mailto:hola@buildata.app" className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold text-[15px] px-6 py-[14px] rounded-md backdrop-blur">
            Agendar una demo
          </a>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-[12px] text-white/70">
          <div className="flex items-center gap-2"><CircleCheck width={14} height={14} className="text-success" /> Sin tarjeta</div>
          <div className="flex items-center gap-2"><CircleCheck width={14} height={14} className="text-success" /> Cancelás cuando quieras</div>
          <div className="flex items-center gap-2"><CircleCheck width={14} height={14} className="text-success" /> Soporte en español</div>
        </div>
      </div>
    </section>
  );
}
