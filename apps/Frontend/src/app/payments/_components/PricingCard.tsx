"use client";

import { Check, Xmark, ArrowRight } from "@gravity-ui/icons";
import Button from "@/components/ui/Button";

interface Feature {
  text: string;
  included: boolean;
  bold?: boolean;
}

interface PricingCardProps {
  planLabel: string;
  labelColor: string;
  title: string;
  price: string;
  priceSub: string;
  idealFor: string;
  features: Feature[];
  isFeatured?: boolean;
  ctaText: string;
  ctaHref: string;
  badge?: string;
  facturation?: "mensual" | "anual";
}

export default function PricingCard({
  planLabel,
  labelColor,
  title,
  price,
  priceSub,
  idealFor,
  features,
  isFeatured = false,
  ctaText,
  ctaHref,
  badge,
}: PricingCardProps) {
  return (
    <div
      className={`relative rounded-2xl border p-7 flex flex-col ${
        isFeatured
          ? "blueprint-bg text-white border-transparent ring-2 ring-accent shadow-pop scale-[1.02]"
          : "bg-white text-slate950 border-slate200 shadow-card"
      }`}
    >
      {badge && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-10 bg-accent text-slate950 text-[10px] tracking-[0.12em] uppercase font-extrabold px-3 py-[5px] rounded-full shadow-card whitespace-nowrap">
          {badge}
        </div>
      )}

      <div
        className="text-[12px] font-bold tracking-[0.06em] uppercase mb-1"
        style={{ color: labelColor }}
      >
        {planLabel}
      </div>

      <h3 className="text-[20px] font-extrabold display-tight leading-tight">
        {title}
      </h3>

      <div className="mt-6 mb-2">
        <div className="flex items-baseline gap-2">
          <span
            className={`text-[44px] font-extrabold display-tight tnum ${isFeatured ? "text-white" : "text-slate950"}`}
          >
            {price}
          </span>
        </div>
        <div
          className={`text-[12px] ${isFeatured ? "text-white/65" : "text-slate500"}`}
        >
          {priceSub}
        </div>
      </div>

      <div
        className={`text-[12px] mt-2 leading-snug min-h-[36px] ${isFeatured ? "text-white/65" : "text-slate500"}`}
      >
        <b className={isFeatured ? "text-white" : "text-slate700"}>
          Ideal para:
        </b>{" "}
        {idealFor}
      </div>

      <Button
        variant={isFeatured ? "primary" : "outline"}
        href={ctaHref}
        className={`mt-5 inline-flex items-center justify-center gap-2 font-bold rounded-md px-4 py-[11px] text-[13px] w-full ${
          isFeatured
            ? "!bg-accent hover:!bg-accent-700 !text-slate950 !border-accent"
            : "!bg-white hover:!bg-slate50 !text-slate700 !border-slate300"
        }`}
      >
        {ctaText} <ArrowRight width={14} height={14} />
      </Button>

      <div
        className={`text-[10px] tracking-[0.06em] uppercase font-bold mt-7 mb-3 ${isFeatured ? "text-white/65" : "text-slate500"}`}
      >
        Incluye
      </div>

      <ul className="flex flex-col gap-2 flex-1">
        {features.map((feature, i) => (
          <li key={i} className="flex items-start gap-2">
            {feature.included ? (
              <span
                className={`w-[18px] h-[18px] rounded-full flex items-center justify-center flex-none mt-[1px] ${
                  isFeatured
                    ? "bg-accent text-slate950"
                    : "bg-success50 text-[#15803D]"
                }`}
              >
                <Check width={11} height={11} />
              </span>
            ) : (
              <span className="w-[18px] h-[18px] rounded-full flex items-center justify-center flex-none mt-[1px] bg-slate100 text-slate400">
                <Xmark width={11} height={11} />
              </span>
            )}
            <span
              className={`text-[12.5px] leading-snug ${
                isFeatured
                  ? feature.bold
                    ? "text-white font-bold"
                    : "text-white/85"
                  : feature.included
                    ? feature.bold
                      ? "text-slate950 font-bold"
                      : "text-slate700"
                    : "text-slate400 line-through"
              }`}
            >
              {feature.text}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
