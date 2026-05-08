import { FOCUS_RING } from "@/lib/styles";
import type { ButtonHTMLAttributes, ReactNode } from "react";

const BASE =
  "inline-flex items-center gap-1.5 px-3.5 py-2 rounded-[9px] text-meta font-medium cursor-pointer transition-colors";
const PRIMARY = "bg-ink text-paper border-0 hover:bg-ink/90";
const DEFAULT =
  "bg-transparent text-ink border-ink/[0.10] border hover:bg-ink/5";

export function buttonClassName(primary?: boolean, extra?: string): string {
  return [BASE, primary ? PRIMARY : DEFAULT, FOCUS_RING.cream, extra]
    .filter(Boolean)
    .join(" ");
}

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  primary?: boolean;
  children: ReactNode;
};

export function Button({ primary, children, className, ...rest }: Props) {
  return (
    <button {...rest} className={buttonClassName(primary, className)}>
      {children}
    </button>
  );
}
