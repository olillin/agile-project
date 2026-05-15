import { Eyebrow } from "@/components/brand/Eyebrow";
import { FOCUS_RING } from "@/lib/styles";
import type { Day, Option } from "@/lib/types";
import { getFeedDaysPage } from "@/services/lunchService";
import { ChevronDown } from "lucide-react";
import { useEffect, useState } from "react";
import { DaySection } from "./DaySection";
import { FeedHeader } from "./FeedHeader";

type Props = {
  onOpen: (option: Option, day: Day) => void;
  ratedIds: Set<string>;
};

export function FeedScreen({ onOpen, ratedIds }: Props) {
  const [days, setDays] = useState<Day[]>([]);
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const hasLunches = days.some(day => day.options.length > 0);

  useEffect(() => {
    let ignore = false;

    async function loadInitialDays() {
      try {
        setLoadError(null);
        const page = await getFeedDaysPage();
        if (ignore) return;

        setDays(page.days);
        setNextCursor(page.nextCursor);
      } catch (error) {
        console.error("Failed to load meals", error);
        if (!ignore) setLoadError("Could not load meals.");
      } finally {
        if (!ignore) setIsInitialLoading(false);
      }
    }

    loadInitialDays();

    return () => {
      ignore = true;
    };
  }, []);

  const handleLoadMore = async () => {
    if (!nextCursor || isLoadingMore) return;

    try {
      setIsLoadingMore(true);
      setLoadError(null);
      const page = await getFeedDaysPage({ beforeDate: nextCursor });

      setDays(prev => {
        const existingIds = new Set(prev.map(day => day.id));
        const newDays = page.days.filter(day => !existingIds.has(day.id));
        return [...prev, ...newDays];
      });
      setNextCursor(page.nextCursor);
    } catch (error) {
      console.error("Failed to load more meals", error);
      setLoadError("Could not load more meals.");
    } finally {
      setIsLoadingMore(false);
    }
  };

  return (
    <div className="bg-cream min-h-[100svh] pb-10">
      <FeedHeader />
      <div className="px-4 pt-6 pb-2">
        <Eyebrow>School</Eyebrow>
        <h1
          className="text-ink mt-1 font-serif leading-[1.05]"
          style={{ fontSize: 34, letterSpacing: -0.6 }}
        >
          <span className="text-amber italic">Chalmers</span>
          <span className="text-ink-muted"> kårrestaurangen</span>
        </h1>
      </div>
      <div className="px-4 pt-6">
        {days.map(day => (
          <DaySection
            key={day.id}
            day={day}
            onOpen={onOpen}
            ratedIds={ratedIds}
          />
        ))}
        {isInitialLoading && (
          <p className="text-ink-muted px-1 py-6 text-center text-sm">
            Loading meals...
          </p>
        )}
        {!isInitialLoading && !loadError && !hasLunches && !nextCursor && (
          <p className="text-ink-muted px-1 py-6 text-center text-sm">
            No lunches available
          </p>
        )}
        {loadError && (
          <p className="text-ink-muted px-1 py-3 text-center text-sm">
            {loadError}
          </p>
        )}
        {nextCursor && (
          <div className="pt-2">
            <button
              type="button"
              onClick={handleLoadMore}
              disabled={isLoadingMore}
              className={`border-ink/10 bg-paper text-ink flex w-full items-center justify-center gap-2 rounded-[14px] border px-4 py-3 text-sm font-semibold transition-colors disabled:cursor-wait disabled:opacity-60 ${FOCUS_RING.cream}`}
            >
              {isLoadingMore ? "Loading..." : "Load more"}
              <ChevronDown size={16} strokeWidth={2.4} aria-hidden />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
