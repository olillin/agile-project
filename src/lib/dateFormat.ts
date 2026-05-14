const DATE_KEY_PATTERN = /^\d{4}-\d{2}-\d{2}$/;
const DAY_IN_MS = 24 * 60 * 60 * 1000;

function parseFeedDate(date: Date | string): Date | null {
  if (date instanceof Date) {
    return Number.isNaN(date.getTime()) ? null : date;
  }

  const parsed = new Date(
    DATE_KEY_PATTERN.test(date) ? `${date}T00:00:00.000Z` : date
  );
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

export function getFeedDateKey(date: Date | string): string {
  const parsed = parseFeedDate(date);
  return parsed ? parsed.toISOString().slice(0, 10) : date.toString();
}

export function formatFeedDate(date: Date | string): string {
  const parsed = parseFeedDate(date);
  if (!parsed) return date.toString();

  const parts = new Intl.DateTimeFormat("en-US", {
    weekday: "short",
    day: "2-digit",
    month: "short",
    timeZone: "UTC",
  }).formatToParts(parsed);

  const weekday = parts.find(p => p.type === "weekday")?.value;
  const day = parts.find(p => p.type === "day")?.value;
  const month = parts.find(p => p.type === "month")?.value.toUpperCase();

  if (!weekday || !day || !month) return getFeedDateKey(parsed);
  return `${weekday} · ${day} ${month}`;
}

export function formatFeedDayLabel(date: Date | string): string {
  const parsed = parseFeedDate(date);
  if (!parsed) return date.toString();

  const dateKey = getFeedDateKey(parsed);
  const todayKey = getFeedDateKey(new Date());
  const dayStart = new Date(`${dateKey}T00:00:00.000Z`);
  const todayStart = new Date(`${todayKey}T00:00:00.000Z`);
  const daysFromToday = Math.round(
    (dayStart.getTime() - todayStart.getTime()) / DAY_IN_MS
  );

  if (daysFromToday === 0) return "Today";
  if (daysFromToday === -1) return "Yesterday";
  if (daysFromToday < -1) return `${Math.abs(daysFromToday)} days ago`;

  if (daysFromToday === 1) return "Tomorrow";
  return `In ${daysFromToday} days`;
}

export function isFeedDateToday(date: Date | string): boolean {
  return getFeedDateKey(date) === getFeedDateKey(new Date());
}
