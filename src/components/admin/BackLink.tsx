import { FOCUS_RING } from "@/lib/styles";
import Link from "next/link";
import type { MouseEvent, ReactNode } from "react";

type Props = {
  href: string;
  children: ReactNode;
  onClick?: (e: MouseEvent<HTMLAnchorElement>) => void;
};

export function BackLink({ href, children, onClick }: Props) {
  return (
    <div style={{ marginBottom: 4 }}>
      <Link
        href={href}
        onClick={onClick}
        className={`text-ink-soft hover:text-ink text-back inline-block rounded-sm transition-colors ${FOCUS_RING.cream}`}
      >
        {children}
      </Link>
    </div>
  );
}
