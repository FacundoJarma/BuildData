import CompareTable from "../_components/CompareTable";
import { comparisonCategories } from "../data/plans";

export default function Comparison() {
  return (
    <section className="max-w-[1100px] mx-auto px-6 py-16">
      <div className="text-center mb-10">
        <div className="text-[10px] tracking-[0.18em] uppercase font-bold text-primary mb-2">
          Comparación detallada
        </div>
        <h2 className="text-[28px] font-extrabold display-tight">
          Todo lo que incluye cada plan
        </h2>
      </div>
      <CompareTable categories={comparisonCategories} />
      <div className="text-center mt-6 text-[12px] text-slate500">
        ¿No estás seguro cuál te conviene?{" "}
        <a
          href="mailto:hola@buildata.app"
          className="text-primary font-bold hover:underline"
        >
          Hablá con nosotros
        </a>{" "}
        y te ayudamos a elegir.
      </div>
    </section>
  );
}
