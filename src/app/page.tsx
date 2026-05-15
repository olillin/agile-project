"use client";

import { FeedScreen } from "@/components/feed/FeedScreen";
import { MealSheet } from "@/components/sheet/MealSheet";
import type { Day, Option, RatingPayload } from "@/lib/types";
import { addReview, getReviewedServingIds } from "@/services/reviewService";
import { useEffect, useState } from "react";

type Opened = { option: Option; day: Day };

export default function Home() {
  const [opened, setOpened] = useState<Opened | null>(null);
  const [ratedIds, setRatedIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    let ignore = false;

    getReviewedServingIds()
      .then(reviewedServingIds => {
        if (!ignore) setRatedIds(new Set(reviewedServingIds));
      })
      .catch(error => {
        console.log("Failed to fetch reviewed IDs: ", error);
      });

    return () => {
      ignore = true;
    };
  }, []);

  const handleSubmit = async (payload: RatingPayload) => {
    try {
      await addReview({
        rating: payload.rating,
        servingId: Number(payload.optionId),
        comment: payload.note,
        tags: payload.tags,
        userId: null,
      });

      setRatedIds(prev => {
        const next = new Set(prev);
        next.add(payload.optionId);
        return next;
      });
      setOpened(null);
    } catch (error) {
      console.error("Failed to submit rating", error);
    }
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
