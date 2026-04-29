"use client";

import { Card } from "@/components/admin/Card";
import { MealCard } from "@/components/admin/sections/MealCard";
import { MealsTable } from "@/components/admin/sections/MealsTable";
import { SelectFilter } from "@/components/admin/SelectFilter";
import { MEAL_LINES } from "@/lib/admin/colors";
import { NEW_TAG } from "@/lib/admin/types";
import type { MealStat } from "@/lib/admin/types";
import { FOCUS_RING } from "@/lib/styles";
import type { MealLine } from "@/lib/types";
import { useMemo, useState } from "react";

type Props = { meals: MealStat[] };

type LineKey = "all" | MealLine;
type DietKey =
  | "all"
  | "vegetarian"
  | "vegan"
  | "fish"
  | "meat"
  | typeof NEW_TAG;
type SortKey = "rating" | "rating-asc" | "votes" | "name" | "co2";
type ViewKey = "grid" | "table";

const LINE_OPTIONS: { k: LineKey; label: string }[] = [
  { k: "all", label: "All" },
  ...MEAL_LINES.map(l => ({ k: l, label: l })),
];

const DIET_OPTIONS: { k: DietKey; label: string }[] = [
  { k: "all", label: "Any" },
  { k: "vegetarian", label: "Vegetarian" },
  { k: "vegan", label: "Vegan" },
  { k: "fish", label: "Contains fish" },
  { k: "meat", label: "Contains meat" },
  { k: NEW_TAG, label: "New" },
];

const SORT_COMPARE: Record<SortKey, (a: MealStat, b: MealStat) => number> = {
  rating: (a, b) => (b.rating ?? -1) - (a.rating ?? -1),
  "rating-asc": (a, b) => (a.rating ?? Infinity) - (b.rating ?? Infinity),
  votes: (a, b) => b.votes - a.votes,
  name: (a, b) => a.name.localeCompare(b.name),
  co2: (a, b) => a.co2 - b.co2,
};

export function MealsBrowser({ meals }: Props) {
  const [view, setView] = useState<ViewKey>("grid");
  const [line, setLine] = useState<LineKey>("all");
  const [diet, setDiet] = useState<DietKey>("all");
  const [q, setQ] = useState("");
  const [sort, setSort] = useState<SortKey>("rating");

  const filtered = useMemo(() => {
    const lower = q.trim().toLowerCase();
    return meals
      .filter(m => {
        if (line !== "all" && m.line !== line) return false;
        if (diet !== "all" && !m.tags.includes(diet)) return false;
        if (lower) {
          const matches =
            m.name.toLowerCase().includes(lower) ||
            m.tags.some(t => t.toLowerCase().includes(lower));
          if (!matches) return false;
        }
        return true;
      })
      .sort(SORT_COMPARE[sort]);
  }, [meals, line, diet, q, sort]);

  const lineCounts = useMemo(() => {
    const counts: Record<MealLine, number> = {
      Nordic: 0,
      Vegetarian: 0,
      "Street food": 0,
    };
    meals.forEach(m => {
      counts[m.line] += 1;
    });
    return counts;
  }, [meals]);

  return (
    <>
      <Card padding={14} style={{ marginBottom: 12 }}>
        <div className="flex items-center" style={{ gap: 10 }}>
          <div
            className="bg-cream border-ink/[0.10] flex flex-1 items-center border"
            style={{ padding: "8px 12px", borderRadius: 9, gap: 8 }}
          >
            <SearchIcon />
            <input
              value={q}
              onChange={e => setQ(e.target.value)}
              placeholder="Search meals, ingredients, tags…"
              className={`text-ink text-body flex-1 rounded-sm bg-transparent outline-none ${FOCUS_RING.cream}`}
              style={{ fontFamily: "inherit" }}
            />
            {q && (
              <button
                type="button"
                onClick={() => setQ("")}
                aria-label="Clear search"
                className={`text-ink-soft text-meta cursor-pointer rounded-sm ${FOCUS_RING.cream}`}
              >
                ✕
              </button>
            )}
          </div>

          <SelectFilter label="Sort" value={sort} onChange={setSort}>
            <option value="rating">Highest rated</option>
            <option value="rating-asc">Lowest rated</option>
            <option value="votes">Most votes</option>
            <option value="name">Name (A→Z)</option>
            <option value="co2">Lowest CO₂e</option>
          </SelectFilter>

          <div
            className="border-ink/[0.10] flex overflow-hidden border"
            style={{ borderRadius: 7 }}
          >
            {(["grid", "table"] as ViewKey[]).map(v => {
              const active = view === v;
              return (
                <button
                  key={v}
                  type="button"
                  onClick={() => setView(v)}
                  className={`text-meta font-medium ${
                    active ? "bg-ink text-paper" : "bg-paper text-ink"
                  } ${FOCUS_RING.paper}`}
                  style={{ padding: "7px 12px", cursor: "pointer" }}
                  aria-pressed={active}
                >
                  {v === "grid" ? "▦ Grid" : "☰ Table"}
                </button>
              );
            })}
          </div>
        </div>

        <FilterRow label="Line">
          {LINE_OPTIONS.map(o => (
            <Chip
              key={o.k}
              active={line === o.k}
              onClick={() => setLine(o.k)}
              count={o.k === "all" ? meals.length : lineCounts[o.k as MealLine]}
            >
              {o.label}
            </Chip>
          ))}
        </FilterRow>

        <FilterRow label="Diet">
          {DIET_OPTIONS.map(o => (
            <Chip key={o.k} active={diet === o.k} onClick={() => setDiet(o.k)}>
              {o.label}
            </Chip>
          ))}
        </FilterRow>
      </Card>

      <div
        className="text-meta flex items-center justify-between"
        style={{ marginBottom: 12 }}
      >
        <div className="text-ink-muted">
          Showing <strong className="text-ink">{filtered.length}</strong> of{" "}
          {meals.length} meals
        </div>
        <div className="text-ink-muted">
          Click any meal for full rating history & comments
        </div>
      </div>

      {filtered.length === 0 ? (
        <Card style={{ textAlign: "center", padding: 40 }}>
          <div className="text-ink text-feature font-serif">
            No meals match those filters.
          </div>
          <div className="text-ink-muted text-meta" style={{ marginTop: 6 }}>
            Try clearing the collection or widening your search.
          </div>
        </Card>
      ) : view === "grid" ? (
        <div
          className="grid"
          style={{
            gap: 14,
            gridTemplateColumns: "repeat(auto-fill, minmax(190px, 1fr))",
          }}
        >
          {filtered.map(m => (
            <MealCard key={m.id} meal={m} />
          ))}
        </div>
      ) : (
        <MealsTable meals={filtered} />
      )}
    </>
  );
}

function FilterRow({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className="flex flex-wrap items-center"
      style={{ gap: 14, marginTop: 12 }}
    >
      <div
        className="text-ink-soft text-eyebrow uppercase"
        style={{ width: 48 }}
      >
        {label}
      </div>
      <div className="flex flex-wrap" style={{ gap: 6 }}>
        {children}
      </div>
    </div>
  );
}

function Chip({
  active,
  onClick,
  count,
  children,
}: {
  active: boolean;
  onClick: () => void;
  count?: number;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`text-meta flex items-center font-medium ${
        active
          ? "bg-ink text-paper"
          : "bg-paper text-ink border-ink/[0.10] border"
      } ${FOCUS_RING.paper}`}
      style={{
        padding: "4px 10px",
        borderRadius: 999,
        cursor: "pointer",
        gap: 5,
      }}
      aria-pressed={active}
    >
      {children}
      {count != null && (
        <span
          className={`text-tiny tabular-nums ${
            active ? "text-paper/70" : "text-ink-soft"
          }`}
        >
          {count}
        </span>
      )}
    </button>
  );
}

function SearchIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="text-ink-soft"
      aria-hidden
    >
      <circle cx="11" cy="11" r="7" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  );
}
