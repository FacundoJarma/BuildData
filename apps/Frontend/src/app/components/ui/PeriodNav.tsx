"use client";

interface PeriodNavProps {
  options: string[];
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

export default function PeriodNav({ options, value, onChange, className = "" }: PeriodNavProps) {
  return (
    <div className={`flex bg-slate-100 rounded-md p-[2px] gap-[2px] ${className}`}>
      {options.map((opt) => (
        <button
          key={opt}
          onClick={() => onChange(opt)}
          className={`text-[11px] font-bold px-[10px] py-[5px] rounded transition-colors ${
            opt === value ? "bg-white text-slate-950 shadow-card" : "text-slate-600 hover:text-slate-800"
          }`}
        >
          {opt}
        </button>
      ))}
    </div>
  );
}
