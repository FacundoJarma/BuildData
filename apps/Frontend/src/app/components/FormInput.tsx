"use client";

import { type InputHTMLAttributes, type ReactNode } from "react";

interface FormInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  icon?: ReactNode;
  rightLabel?: ReactNode;
  rightElement?: ReactNode;
  hint?: string;
}

export default function FormInput({
  label,
  icon,
  rightLabel,
  rightElement,
  hint,
  className = "",
  placeholder,
  ...inputProps
}: FormInputProps) {
  const hasIcon = !!icon;
  const hasRight = !!rightElement;

  return (
    <label className="flex flex-col gap-[6px]">
      <div className="flex items-center justify-between">
        <span className="text-[11px] font-bold text-slate-700">{label}</span>
        {rightLabel}
      </div>
      <div className="relative">
        {icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
            {icon}
          </div>
        )}
        <input
          placeholder={placeholder}
          className={`w-full bg-white border border-slate-200 rounded-md py-[10px] text-[13px] focus:border-primary focus:outline-none transition-colors ${
            hasIcon ? "pl-10" : "pl-3"
          } ${hasRight ? "pr-10" : "pr-3"} ${className}`}
          {...inputProps}
        />
        {rightElement && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-700 text-[11px] font-bold">
            {rightElement}
          </div>
        )}
      </div>
      {hint && <div className="text-[11px] text-slate-500 mt-1 leading-snug">{hint}</div>}
    </label>
  );
}
