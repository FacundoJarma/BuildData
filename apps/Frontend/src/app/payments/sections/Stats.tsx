function StatItem({ value, label }: { value: string; label: string }) {
  return (
    <div>
      <div className="text-[32px] font-extrabold display-tight tnum text-slate950">
        {value}
      </div>
      <div className="text-[11px] tracking-[0.06em] uppercase font-bold text-slate500 mt-1">
        {label}
      </div>
    </div>
  );
}

export default function Stats() {
  return (
    <section className="bg-white border-y border-slate200">
      <div className="max-w-[1100px] mx-auto px-6 py-12 text-center">
        <div className="text-[10px] tracking-[0.18em] uppercase font-bold text-slate500 mb-6">
          Más de 120 constructoras ya usan BuildData
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-[860px] mx-auto">
          <StatItem value="120+" label="constructoras" />
          <StatItem value="14 K" label="reportes / mes" />
          <StatItem value="92 %" label="transcripciones correctas" />
          <StatItem value="4 h" label="ahorradas por día" />
        </div>
      </div>
    </section>
  );
}
