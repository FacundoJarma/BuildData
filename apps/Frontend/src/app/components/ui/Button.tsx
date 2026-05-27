import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from "react";

type BtnVariant = "primary" | "secondary" | "ghost" | "danger" | "accent" | "outline";
type BtnSize = "sm" | "md";

const VARIANT_STYLES: Record<BtnVariant, string> = {
  primary:   "bg-primary hover:bg-primary-700 text-white border-primary",
  secondary: "bg-white hover:bg-slate-50 text-slate-700 border-slate-300",
  ghost:     "bg-transparent hover:bg-slate-100 text-primary border-transparent",
  danger:    "bg-critical hover:bg-[#B91C1C] text-white border-critical",
  accent:    "bg-accent hover:bg-accent-700 text-slate-950 border-accent",
  outline:   "bg-white border border-slate-200 text-slate-800 hover:bg-slate-50",
};

const SIZE_STYLES: Record<BtnSize, string> = {
  sm: "text-[12px] px-3 py-[6px]",
  md: "text-[13px] px-4 py-[8px]",
};

interface ButtonBase {
  variant?: BtnVariant;
  size?: BtnSize;
  icon?: ReactNode;
  children?: ReactNode;
  className?: string;
}

interface ButtonAsButton extends ButtonBase, ButtonHTMLAttributes<HTMLButtonElement> {
  href?: never;
}

interface ButtonAsLink extends ButtonBase, AnchorHTMLAttributes<HTMLAnchorElement> {
  href: string;
}

type ButtonProps = ButtonAsButton | ButtonAsLink;

export default function Button(props: ButtonProps) {
  const { variant = "primary", size = "md", icon, children, className = "", ...rest } = props;
  const base = `inline-flex items-center gap-[6px] font-bold rounded-md border transition-colors ${VARIANT_STYLES[variant]} ${SIZE_STYLES[size]} ${className}`;

  if ("href" in rest && rest.href !== undefined) {
    const { href, ...anchorRest } = rest as AnchorHTMLAttributes<HTMLAnchorElement>;
    return (
      <a href={href} className={base} {...anchorRest}>
        {icon}{children}
      </a>
    );
  }

  const buttonRest = rest as ButtonHTMLAttributes<HTMLButtonElement>;
  return (
    <button className={base} {...buttonRest}>
      {icon}{children}
    </button>
  );
}
