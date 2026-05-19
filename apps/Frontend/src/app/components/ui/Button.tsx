import { type AnchorHTMLAttributes, type ButtonHTMLAttributes, type ReactNode } from "react";

type ButtonVariant = "primary" | "outline";

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    "inline-flex items-center justify-center gap-2 bg-primary hover:bg-primary-700 text-white font-bold rounded-md px-4 py-[11px] text-[13px] transition-colors",
  outline:
    "flex items-center justify-center gap-2 bg-white border border-slate-200 rounded-md px-3 py-[10px] text-[13px] font-semibold text-slate-800 hover:bg-slate-50 transition-colors",
};

interface ButtonAsButton extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  href?: never;
  children: ReactNode;
}

interface ButtonAsLink extends AnchorHTMLAttributes<HTMLAnchorElement> {
  variant?: ButtonVariant;
  href: string;
  children: ReactNode;
}

type ButtonProps = ButtonAsButton | ButtonAsLink;

export default function Button(props: ButtonProps) {
  const { variant = "primary", children, className = "", ...rest } = props;
  const base = variantStyles[variant];

  if ("href" in rest && rest.href !== undefined) {
    const { href, ...anchorRest } = rest as AnchorHTMLAttributes<HTMLAnchorElement>;
    return (
      <a href={href} className={`${base} ${className}`} {...anchorRest}>
        {children}
      </a>
    );
  }

  const { ...buttonRest } = rest as ButtonHTMLAttributes<HTMLButtonElement>;
  return (
    <button className={`${base} ${className}`} {...buttonRest}>
      {children}
    </button>
  );
}
