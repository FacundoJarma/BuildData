import { StarFill } from "@gravity-ui/icons";
export default function Hero() {
  return (
    <section className="hero-grid relative">
      <div className="max-w-[1240px] mx-auto px-6 pt-16 pb-10 text-center">
        <div className="inline-flex items-center gap-2 bg-primary-50 text-primary border border-primary/15 rounded-full px-3 py-[5px] text-[10px] tracking-[0.12em] uppercase font-bold mb-5">
          <StarFill />
          Sin tarjeta · cancelás cuando quieras
        </div>
        <h1 className="text-[clamp(36px,5vw,56px)] leading-[1.05] font-extrabold display-tight max-w-[820px] mx-auto">
          Un plan para cada tipo de obra.
          <br />
          <span className="text-primary">
            Sin sorpresas, sin contratos largos.
          </span>
        </h1>
        <p className="text-[16px] text-slate600 leading-relaxed max-w-[640px] mx-auto mt-5">
          Probá gratis durante 14 días. Cuando estés convencido elegís el plan
          que más se ajuste a tu volumen de obra — y lo cambiás cuando
          crezcas.
        </p>
      </div>
    </section>
  );
}
