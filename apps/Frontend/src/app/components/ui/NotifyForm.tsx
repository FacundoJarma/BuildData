"use client";

import { useState, type FormEvent } from "react";

export default function NotifyForm() {
  const [success, setSuccess] = useState(false);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setSuccess(true);
  };

  if (success) {
    return (
      <div className="max-w-[440px] mx-auto border border-green-300 bg-green-50 rounded-xl py-[14px] px-[14px] flex items-center gap-[6px] text-green-700 font-bold text-[13px]">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="m20 6-11 11-5-5" />
        </svg>
        Listo, te avisamos.
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-[440px] mx-auto border border-slate-200 bg-white rounded-xl p-[4px] flex items-stretch transition-colors focus-within:border-primary"
    >
      <input
        type="email"
        placeholder="Avisame cuando esté listo · tu@email.com"
        required
        className="flex-1 min-w-0 border-0 outline-none px-[14px] py-[10px] bg-transparent font-sans text-[13px] text-slate-950 placeholder:text-slate-500"
      />
      <button
        type="submit"
        className="bg-slate-950 text-white border-0 cursor-pointer px-4 rounded-lg font-bold text-[12px] font-sans hover:bg-ink transition-colors"
      >
        Avisarme
      </button>
    </form>
  );
}
