import { Eyebrow } from "@/components/brand/Eyebrow";
import { DAYS } from "@/lib/fixtures";
import type { Day, Option } from "@/lib/types";
import { DaySection } from "./DaySection";
import { FeedHeader } from "./FeedHeader";

type Props = {
  onOpen: (option: Option, day: Day) => void;
  ratedIds: Set<string>;
};

export function FeedScreen({ onOpen, ratedIds }: Props) {
  return (
    <div className="min-h-[100svh] bg-cream pb-10">
      <FeedHeader />
      <div className="px-4 pb-2 pt-6">
        <Eyebrow>School</Eyebrow>
        <h1
          className="mt-1 font-serif leading-[1.05] text-ink"
          style={{ fontSize: 34, letterSpacing: -0.6 }}
        >
          <span className="italic text-amber">Chalmers</span>
          <span className="text-ink-muted"> kårrestaurangen</span>
        </h1>
      </div>
      <div className="px-4 pt-6">
        {DAYS.map((day) => (
          <DaySection
            key={day.id}
            day={day}
            onOpen={onOpen}
            ratedIds={ratedIds}
          />
        ))}
      </div>
    </div>
  );
}
