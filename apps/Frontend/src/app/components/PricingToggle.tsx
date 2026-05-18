"use client";

import { useState } from "react";

export default function PricingToggle() {
  const [active, setActive] = useState<"mensual" | "anual">("anual");

  return (
    <div className="inline-flex items-center gap-3 mt-9 bg-white border border-slate200 rounded-full p-[3px] shadow-card">
      <button
        onClick={() => setActive("mensual")}
        className={`text-[12px] font-bold px-5 py-[8px] rounded-full transition-colors ${
          active === "mensual"
            ? "bg-primary text-white"
            : "text-slate600 hover:text-slate950"
        }`}
      >
        Mensual
      </button>
      <button
        onClick={() => setActive("anual")}
        className={`text-[12px] font-bold px-5 py-[8px] rounded-full transition-colors flex items-center gap-2 ${
          active === "anual"
            ? "bg-primary text-white"
            : "text-slate600 hover:text-slate950"
        }`}
      >
        Anual
        <span className="text-[9px] font-bold px-[6px] py-[2px] rounded-full tracking-wider bg-accent text-slate950">
          −20%
        </span>
      </button>
    </div>
  );
}
