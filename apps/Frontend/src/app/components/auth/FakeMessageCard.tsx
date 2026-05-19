import type { ReactNode } from "react";

interface FakeMessageCardProps {
  initials: string;
  name: string;
  role: string;
  children: ReactNode;
  tag: string;
  tagVariant: "critical" | "accent";
  avatarGradient: string;
}

const tagStyles: Record<string, string> = {
  critical: "text-critical bg-critical/20",
  accent: "text-accent bg-accent/20",
};

export default function FakeMessageCard({
  initials,
  name,
  role,
  children,
  tag,
  tagVariant,
  avatarGradient,
}: FakeMessageCardProps) {
  return (
    <div className="bg-white/[0.08] rounded-lg p-3 flex items-start gap-3">
      <div
        className={`w-8 h-8 rounded-full bg-gradient-to-br ${avatarGradient} text-white text-[11px] font-bold flex items-center justify-center flex-none`}
      >
        {initials}
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-[12px] font-bold">
          {name} <span className="font-normal text-white/50">· {role}</span>
        </div>
        <div className="text-[11px] text-white/70 mt-[2px] italic">{children}</div>
      </div>
      <span
        className={`text-[9px] font-bold tracking-wider px-2 py-[2px] rounded ${tagStyles[tagVariant]}`}
      >
        {tag}
      </span>
    </div>
  );
}
