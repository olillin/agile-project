export type Suggestion = {
  id: number;
  title: string;
  description: string;
  postedDate: Date;
  userDisplayName: string;
};

/**
 * Check if a suggestion was posted after the admin page was viewed last.
 * @param suggestion The suggestion to check.
 * @returns If the suggestion is new.
 */
export function isNewSuggestion(suggestion: Suggestion): boolean {
  // TODO: Fetch actual last viewed time
  const lastViewedTime = new Date("2026-05-11T17:00");
  return suggestion.postedDate > lastViewedTime;
}
