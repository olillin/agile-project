"use client";

import { PageShell } from "@/components/admin/PageShell";
import { SuggestionsBrowser } from "@/components/admin/sections/SuggestionsBrowser";
import { Suggestion } from "@/generated/prisma/browser";
import {
  getAllSuggestions,
  updateLastVisited,
} from "@/services/suggestionService";
import { getCurrentUser, getUser } from "@/services/userService";
import { useEffect, useState } from "react";

export interface SuggestionAndUser extends Suggestion {
  displayName: string | null;
}

export default function AdminMealsPage() {
  const [suggestions, setSuggestions] = useState<SuggestionAndUser[]>([]);
  const [lastViewed, setLastViewed] = useState<Date>(new Date());
  useEffect(() => {
    getCurrentUser().then(user => {
      if (user?.lastTimeReviewsViewed != null)
        setLastViewed(user.lastTimeReviewsViewed);
    });
    getAllSuggestions().then(result => {
      const suggestionsList: SuggestionAndUser[] = [];
      result.forEach(suggestion => {
        let displayName = null;
        if (suggestion.userId) {
          getUser(suggestion.userId).then(user => {
            displayName = user ? user.name : null;
          });
        }

        const object: SuggestionAndUser = {
          ...suggestion,
          displayName,
        };
        suggestionsList.push(object);
      });
      setSuggestions(suggestionsList);
      updateLastVisited();
    });
  }, []);
  return (
    <PageShell title="Suggestions" subtitle="Meal suggestions left by students">
      <SuggestionsBrowser suggestions={suggestions} lastViewed={lastViewed} />
    </PageShell>
  );
}
