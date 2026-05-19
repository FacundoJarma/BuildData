import { Check } from "@gravity-ui/icons";

type CellValue = string | boolean;

interface CompareCategory {
  name: string;
  features: {
    name: string;
    values: CellValue[];
  }[];
}

interface CompareTableProps {
  categories: CompareCategory[];
}

function renderCell(value: CellValue) {
  if (typeof value === "boolean") {
    return value ? (
      <span className="inline-flex w-6 h-6 rounded-full bg-success50 text-[#15803D] items-center justify-center">
        <Check width={12} height={12} />
      </span>
    ) : (
      <span className="text-slate300 text-[15px]">—</span>
    );
  }
  return <span className="text-slate950">{value}</span>;
}

export default function CompareTable({ categories }: CompareTableProps) {
  return (
    <div className="bg-white border border-slate200 rounded-xl overflow-hidden shadow-card">
      <div className="grid grid-cols-[1.6fr_1fr_1fr_1fr] bg-slate50 border-b border-slate200">
        <div className="px-5 py-4 text-[10px] tracking-[0.06em] uppercase font-bold text-slate500">
          Funcionalidades
        </div>
        <div className="px-5 py-4 text-center">
          <div className="text-[14px] font-extrabold text-slate950">Inicio</div>
          <div className="text-[11px] mt-[2px] text-slate500">Gratis · 14 días</div>
        </div>
        <div className="px-5 py-4 text-center bg-primary text-white">
          <div className="text-[14px] font-extrabold text-white">Profesional</div>
          <div className="text-[11px] mt-[2px] text-white/70">AR$ 89.000 / mes</div>
        </div>
        <div className="px-5 py-4 text-center">
          <div className="text-[14px] font-extrabold text-slate950">Empresa</div>
          <div className="text-[11px] mt-[2px] text-slate500">AR$ 189.000 / mes</div>
        </div>
      </div>

      {categories.map((cat, ci) => (
        <div key={ci}>
          <div className="grid grid-cols-[1.6fr_1fr_1fr_1fr] bg-slate100/60 border-b border-slate200">
            <div className="px-5 py-2 text-[10px] tracking-[0.06em] uppercase font-bold text-slate700">
              {cat.name}
            </div>
            <div />
            <div />
            <div />
          </div>
          {cat.features.map((feat, fi) => (
            <div
              key={fi}
              className={`grid grid-cols-[1.6fr_1fr_1fr_1fr] items-center ${
                fi < cat.features.length - 1 ? "border-b border-slate100" : ""
              }`}
            >
              <div className="px-5 py-3 text-[13px] text-slate700">
                {feat.name}
              </div>
              <div className="px-5 py-3 text-center text-[13px] font-semibold">
                {renderCell(feat.values[0])}
              </div>
              <div className="px-5 py-3 text-center text-[13px] font-semibold bg-primary/[0.03]">
                {renderCell(feat.values[1])}
              </div>
              <div className="px-5 py-3 text-center text-[13px] font-semibold">
                {renderCell(feat.values[2])}
              </div>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
