"use client";

import { Pill } from "@/components/admin/Pill";
import { SectionHead } from "@/components/admin/SectionHead";
import { SelectFilter } from "@/components/admin/SelectFilter";
import { CupRating } from "@/components/brand/CupRating";
import { relativeDays } from "@/lib/admin/relative-time";
import type { MealComment } from "@/lib/admin/types";
import { FOCUS_RING } from "@/lib/styles";
import { useMemo, useState } from "react";

type Props = {
  comments: MealComment[];
  pageSize?: number;
};

type SortKey = "recent" | "highest" | "lowest";

function commentTime(comment: MealComment, nowMs: number): number {
  if (comment.postedAt) {
    const parsed = new Date(comment.postedAt);
    if (!Number.isNaN(parsed.getTime())) return parsed.getTime();
  }

  const days = relativeDays(comment.when);
  return days == null ? 0 : nowMs - days * 24 * 60 * 60 * 1000;
}

export function CommentList({ comments, pageSize = 5 }: Props) {
  const [sort, setSort] = useState<SortKey>("recent");
  const [page, setPage] = useState(1);
  const [nowMs] = useState(() => Date.now());

  const sorted = useMemo(() => {
    const next = [...comments];
    if (sort === "recent") {
      next.sort((a, b) => commentTime(b, nowMs) - commentTime(a, nowMs));
    }
    if (sort === "highest") next.sort((a, b) => b.rating - a.rating);
    if (sort === "lowest") next.sort((a, b) => a.rating - b.rating);
    return next;
  }, [comments, sort, nowMs]);

  const totalPages = Math.max(1, Math.ceil(sorted.length / pageSize));
  const safePage = Math.min(page, totalPages);
  const start = (safePage - 1) * pageSize;
  const visible = sorted.slice(start, start + pageSize);

  return (
    <>
      <SectionHead
        title="All comments"
        sub={`${comments.length} on this meal`}
        right={
          <div className="flex items-center" style={{ gap: 10 }}>
            <SelectFilter
              label="Sort"
              value={sort}
              size="sm"
              onChange={next => {
                setSort(next);
                setPage(1);
              }}
            >
              <option value="recent">Most recent</option>
              <option value="highest">Highest rating</option>
              <option value="lowest">Lowest rating</option>
            </SelectFilter>
            <div className="bg-ink/[0.10]" style={{ width: 1, height: 18 }} />
            <div className="flex items-center" style={{ gap: 4 }}>
              <PageBtn
                disabled={safePage === 1}
                onClick={() => setPage(p => Math.max(1, p - 1))}
                label="Previous page"
              >
                ‹
              </PageBtn>
              <span
                className="text-ink-soft text-meta tabular-nums"
                style={{ padding: "0 4px" }}
              >
                {safePage} / {totalPages}
              </span>
              <PageBtn
                disabled={safePage >= totalPages}
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                label="Next page"
              >
                ›
              </PageBtn>
            </div>
          </div>
        }
      />
      {visible.length === 0 ? (
        <div
          className="text-ink-soft text-meta text-center"
          style={{ padding: "24px 0" }}
        >
          No comments yet.
        </div>
      ) : (
        visible.map((c, i) => (
          <div
            key={c.id}
            style={{
              padding: "12px 0",
              borderTop: i === 0 ? "none" : "1px solid rgba(26,24,21,0.06)",
            }}
          >
            <div
              className="flex items-center"
              style={{ gap: 8, marginBottom: 5 }}
            >
              <CupRating value={c.rating} size={11} />
              <span className="text-ink-soft text-meta">{c.when}</span>
            </div>
            <div
              className="text-ink text-body italic"
              style={{ lineHeight: 1.5 }}
            >
              &ldquo;{c.text}&rdquo;
            </div>
            {c.tags.length > 0 && (
              <div className="flex flex-wrap" style={{ gap: 4, marginTop: 6 }}>
                {c.tags.map(t => (
                  <Pill key={t} tone="neutral">
                    {t}
                  </Pill>
                ))}
              </div>
            )}
          </div>
        ))
      )}
    </>
  );
}

function PageBtn({
  disabled,
  onClick,
  children,
  label,
}: {
  disabled?: boolean;
  onClick: () => void;
  children: React.ReactNode;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      className={`bg-paper border-ink/[0.10] text-ink text-body flex items-center justify-center border disabled:opacity-40 ${FOCUS_RING.paper}`}
      style={{
        width: 28,
        height: 28,
        borderRadius: 6,
        cursor: disabled ? "not-allowed" : "pointer",
      }}
    >
      {children}
    </button>
  );
}
