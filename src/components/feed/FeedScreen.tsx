import { Eyebrow } from "@/components/brand/Eyebrow";
import { getDays, getLunchesByDate } from "@/services/lunchService";
import type { Day, Option } from "@/lib/types";
import { DaySection } from "./DaySection";
import { FeedHeader } from "./FeedHeader";

import { useEffect, useState } from "react";
import { getAll } from "@/services/lunchService";

type Props = {
  onOpen: (option: Option, day: Day) => void;
  ratedIds: Set<string>;
};

export function FeedScreen({ onOpen, ratedIds }: Props) {
  const [days, setDays] = useState<Day[]>([]);
  useEffect(() => {
      async function f() {
          setDays(await getDays());
      }
      f();
  }, []);

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
      </div>
    </div>
  );
}
