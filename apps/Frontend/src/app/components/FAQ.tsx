"use client";

import { useState } from "react";
import { ChevronDown } from "@gravity-ui/icons";

interface FAQItemData {
  question: string;
  answer: string;
}

interface FAQProps {
  items: FAQItemData[];
}

export default function FAQ({ items }: FAQProps) {
  const [openIndex, setOpenIndex] = useState<number>(0);

  return (
    <div className="bg-paper border border-slate200 rounded-xl overflow-hidden">
      {items.map((item, i) => (
        <div
          key={i}
          className={`border-b border-slate200 transition-colors ${
            i === openIndex ? "bg-white" : "hover:bg-white"
          }`}
        >
          <button
            onClick={() => setOpenIndex(i === openIndex ? -1 : i)}
            className="w-full flex items-center justify-between gap-4 text-left px-5 py-5"
          >
            <span className="text-[15px] font-bold text-slate950">
              {item.question}
            </span>
            <span
              className={`w-7 h-7 rounded-full flex items-center justify-center flex-none transition-transform ${
                i === openIndex
                  ? "bg-primary text-white"
                  : "bg-slate100 text-slate600"
              }`}
            >
              <ChevronDown width={14} height={14} />
            </span>
          </button>
          {i === openIndex && (
            <div className="px-5 pb-5 text-[13.5px] text-slate600 leading-relaxed max-w-[820px]">
              {item.answer}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
