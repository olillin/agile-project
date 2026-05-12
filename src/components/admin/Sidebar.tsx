"use client";

import { Wordmark } from "@/components/brand/Wordmark";
import { LogoutButton } from "@/components/LogoutButton";
import { MANAGER, SUGGESTIONS_BADGE, WEEK_STAT } from "@/lib/admin/fixtures";
import { FOCUS_RING } from "@/lib/styles";
import Link from "next/link";
import { usePathname } from "next/navigation";

type NavItem = {
  key: string;
  label: string;
  href?: string;
  badge?: number;
  matchPrefix?: string;
};

const ITEMS: NavItem[] = [
  { key: "home", label: "Overview", href: "/admin", matchPrefix: "/admin" },
  {
    key: "meals",
    label: "Meals",
    href: "/admin/meals",
    matchPrefix: "/admin/meals",
  },
  {
    key: "suggestions",
    label: "Suggestions",
    href: "/admin/suggestions",
    matchPrefix: "/admin/suggestions",
    badge: SUGGESTIONS_BADGE,
  },
  { key: "calendar", label: "Calendar" },
];

function isActive(item: NavItem, pathname: string) {
  if (!item.matchPrefix) return false;
  return (
    pathname === item.matchPrefix || pathname.startsWith(`${item.matchPrefix}/`)
  );
}

function activeNavKey(pathname: string): string | null {
  const activeItem = ITEMS.filter(it => isActive(it, pathname)).sort(
    (a, b) => (b.matchPrefix?.length ?? 0) - (a.matchPrefix?.length ?? 0)
  )[0];
  return activeItem?.key ?? null;
}

export function Sidebar() {
  const pathname = usePathname() ?? "";
  const activeKey = activeNavKey(pathname);
  return (
    <aside
      className="bg-paper border-ink/[0.06] flex h-full flex-col border-r font-sans"
      style={{
        width: 220,
        padding: "22px 14px",
        flexShrink: 0,
      }}
    >
      <div style={{ padding: "0 8px 20px" }}>
        <Wordmark size={18} />
        <div className="text-ink-soft text-meta" style={{ marginTop: 4 }}>
          {MANAGER.school}
        </div>
      </div>

      <nav className="flex flex-col" style={{ gap: 2 }}>
        {ITEMS.map(it => {
          const active = activeKey === it.key;
          const stateClass = active
            ? "bg-tea text-paper font-medium"
            : it.href
              ? "text-ink hover:bg-ink/[0.04] transition-colors"
              : "text-ink";
          const inner = (
            <span
              className={`text-body flex items-center justify-between rounded-[9px] ${stateClass}`}
              style={{
                padding: "9px 12px",
                opacity: it.href ? 1 : 0.4,
                cursor: it.href ? "pointer" : "default",
              }}
            >
              <span>{it.label}</span>
              {it.badge != null && (
                <span
                  className={`text-paper text-tiny font-semibold ${
                    active ? "bg-paper/20" : "bg-amber"
                  }`}
                  style={{ padding: "2px 7px", borderRadius: 999 }}
                >
                  {it.badge}
                </span>
              )}
            </span>
          );
          return it.href ? (
            <Link
              key={it.key}
              href={it.href}
              aria-current={active ? "page" : undefined}
              className={`block rounded-[9px] ${FOCUS_RING.paper}`}
            >
              {inner}
            </Link>
          ) : (
            <span key={it.key} aria-disabled title="Coming soon">
              {inner}
            </span>
          );
        })}
      </nav>

      <div className="flex-1" />

      <div
        className="text-ink-muted text-meta"
        style={{
          background: "rgba(45,74,62,0.06)",
          borderRadius: 10,
          padding: 12,
          lineHeight: 1.45,
          marginBottom: 8,
        }}
      >
        <div className="text-tea font-semibold" style={{ marginBottom: 4 }}>
          {WEEK_STAT.week}
        </div>
        {WEEK_STAT.ratingsThisWeek} ratings this week
      </div>

      <div
        className="border-ink/[0.06] flex items-center border-t"
        style={{ padding: "10px 12px", borderRadius: 10, gap: 10 }}
      >
        <div
          className="bg-tea text-paper text-meta flex items-center justify-center font-semibold"
          style={{
            width: 28,
            height: 28,
            borderRadius: 999,
            letterSpacing: 0,
          }}
        >
          {MANAGER.initials}
        </div>
        <div className="min-w-0 flex-1">
          <div className="text-ink text-meta truncate font-medium">
            {MANAGER.name}
          </div>
          <div className="text-ink-soft text-tiny">{MANAGER.role}</div>
        </div>
        <LogoutButton
          title="Log out"
          aria-label="Log out"
          className={`text-rose hover:bg-rose/10 flex items-center justify-center rounded-md transition-colors ${FOCUS_RING.paper}`}
          style={{ width: 26, height: 26 }}
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden
          >
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
            <polyline points="16 17 21 12 16 7" />
            <line x1="21" y1="12" x2="9" y2="12" />
          </svg>
        </LogoutButton>
      </div>
    </aside>
  );
}
