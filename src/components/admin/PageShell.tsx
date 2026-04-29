import type { ReactNode } from "react";

type Props = {
  title: ReactNode;
  subtitle?: ReactNode;
  actions?: ReactNode;
  children: ReactNode;
};

export function PageShell({ title, subtitle, actions, children }: Props) {
  return (
    <div
      className="bg-cream flex-1 overflow-auto"
      style={{ padding: "24px 28px" }}
    >
      <div
        className="flex items-baseline justify-between"
        style={{ marginBottom: 18, gap: 16 }}
      >
        <div className="min-w-0">
          <div
            className="text-ink text-display font-serif"
            style={{ lineHeight: 1.1 }}
          >
            {title}
          </div>
          {subtitle && (
            <div
              className="text-ink-muted text-body"
              style={{ marginTop: 4 }}
            >
              {subtitle}
            </div>
          )}
        </div>
        {actions && <div className="flex" style={{ gap: 8 }}>{actions}</div>}
      </div>
      {children}
    </div>
  );
}
