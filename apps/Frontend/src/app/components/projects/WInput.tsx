import { forwardRef } from "react";

export const WInput = forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>((props, ref) => (
  <input ref={ref} {...props}
    className={`bg-white border border-slate-200 rounded-md px-3 py-[9px] text-[13px] text-slate-950 focus:border-primary focus:outline-none transition-colors ${props.className || ""}`} />
));

WInput.displayName = "WInput";
