"use client";

import { FeedScreen } from "@/components/feed/FeedScreen";
import { MealSheet } from "@/components/sheet/MealSheet";
import type { Day, Option, RatingPayload } from "@/lib/types";
import { addReview, getMyReviewSummaries } from "@/services/reviewService";
import { useEffect, useMemo, useState } from "react";

type Opened = { option: Option; day: Day };

export default function Home() {
  const [opened, setOpened] = useState<Opened | null>(null);
  const [myRatings, setMyRatings] = useState<Map<string, number>>(new Map());

  useEffect(() => {
    let ignore = false;

    getMyReviewSummaries()
      .then(rows => {
        if (!ignore) {
          setMyRatings(new Map(rows.map(r => [r.servingId, r.rating])));
        }
      })
      .catch(error => {
        console.log("Failed to fetch my reviews: ", error);
      });

    return () => {
      ignore = true;
    };
  }, []);

  const ratedIds = useMemo(() => new Set(myRatings.keys()), [myRatings]);

  const handleSubmit = async (payload: RatingPayload) => {
    try {
      await addReview({
        rating: payload.rating,
        servingId: Number(payload.optionId),
        comment: payload.note,
        tags: payload.tags,
        userId: null,
      });

      setMyRatings(prev => {
        const next = new Map(prev);
        next.set(payload.optionId, payload.rating);
        return next;
      });
      setOpened(null);
    } catch (error) {
      console.error("Failed to submit rating", error);
    }
  };

  const existingRating = opened
    ? (myRatings.get(opened.option.id) ?? null)
    : null;

  return (
    <main className="relative">
      <FeedScreen
        onOpen={(option, day) => setOpened({ option, day })}
        ratedIds={ratedIds}
      />
      <MealSheet
        option={opened?.option ?? null}
        day={opened?.day ?? null}
        existingRating={existingRating}
        onClose={() => setOpened(null)}
        onSubmit={handleSubmit}
      />
    </main>
  );
}
