'use client'

import { useState } from "react";
import { CheckDouble } from "@gravity-ui/icons";
import PricingCard from "../../components/pricing/PricingCard";
import { pricingCardsMonthly, pricingCardsYearly } from "../data/plans";
import PricingToggle from "../../components/pricing/PricingToggle";

export default function Pricing() {

  const [facturation, setFacturation] = useState<"mensual" | "anual">("anual")
  const pricingCards = facturation === "mensual" ? pricingCardsMonthly : pricingCardsYearly
  return (
    <section className="max-w-[1240px] mx-auto px-6 pb-16">
      <PricingToggle setActive={setFacturation} active={facturation} />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 items-stretch">
        {pricingCards.map((card) => (
          <PricingCard key={card.planLabel} {...card} facturation={facturation} />
        ))}
      </div>

      <div className="flex items-center justify-center gap-6 mt-8 text-[12px] text-slate500 flex-wrap">
        <span className="inline-flex items-center gap-1">
          <CheckDouble className="text-success" /> Sin tarjeta para empezar
        </span>
        <span className="inline-flex items-center gap-1">
          <CheckDouble className="text-success" /> Cancelás cuando quieras
        </span>
        <span className="inline-flex items-center gap-1">
          <CheckDouble className="text-success" /> Migración asistida sin costo
        </span>
      </div>
    </section>
  );
}
