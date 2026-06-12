import { forwardRef } from "react";

export const WTextarea = forwardRef<HTMLTextAreaElement, React.TextareaHTMLAttributes<HTMLTextAreaElement>>((props, ref) => (
  <textarea ref={ref} {...props}
    className={`bg-white border border-slate-200 rounded-md px-3 py-[9px] text-[13px] text-slate-950 min-h-[70px] focus:border-primary focus:outline-none transition-colors resize-y ${props.className || ""}`} />
));

WTextarea.displayName = "WTextarea";
