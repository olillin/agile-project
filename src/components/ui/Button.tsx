import { FOCUS_RING } from "@/lib/styles";
import type { ButtonHTMLAttributes, ReactNode } from "react";

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  primary?: boolean;
  children: ReactNode;
};

export function Button({ primary, children, className, ...rest }: Props) {
  const base =
    "inline-flex items-center gap-1.5 rounded-[9px] font-medium cursor-pointer transition-colors";
  const variant = primary
    ? "bg-ink text-paper border-0 hover:bg-ink/90"
    : "bg-transparent text-ink border-ink/[0.10] border hover:bg-ink/5";
  return (
    <button
      {...rest}
      className={`${base} ${variant} text-meta ${FOCUS_RING.cream} ${className ?? ""}`}
      style={{ padding: "8px 14px", ...rest.style }}
    >
      {children}
    </button>
  );
}
