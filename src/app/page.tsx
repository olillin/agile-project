"use client";

import { FeedScreen } from "@/components/feed/FeedScreen";
import { MealSheet } from "@/components/sheet/MealSheet";
import type { Day, Option, RatingPayload } from "@/lib/types";
import { getAll } from "@/services/lunchService";
import { addReview } from "@/services/reviewService";
import { useState } from "react";

type Opened = { option: Option; day: Day };

export default function Home() {
  const [opened, setOpened] = useState<Opened | null>(null);
  const [ratedIds, setRatedIds] = useState<Set<string>>(new Set());

  const handleSubmit = (payload: RatingPayload) => {
    addReview(payload.rating, Number(payload.optionId), null, payload.note);
    console.log("rating submitted", payload);

    setRatedIds(prev => {
      const next = new Set(prev);
      next.add(payload.optionId);
      return next;
    });
    setOpened(null);
  };

  return (
    <main className="relative">
      <FeedScreen
        onOpen={(option, day) => setOpened({ option, day })}
        ratedIds={ratedIds}
      />
      <MealSheet
        option={opened?.option ?? null}
        day={opened?.day ?? null}
        onClose={() => setOpened(null)}
        onSubmit={handleSubmit}
      />
    </main>
  );
}
