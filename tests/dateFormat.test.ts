import {
  formatFeedDate,
  formatFeedDayLabel,
  getFeedDateKey,
} from "@/lib/dateFormat";
import { describe, expect, it } from "vitest";

function offsetFromToday(days: number): string {
  const date = new Date(`${getFeedDateKey(new Date())}T00:00:00.000Z`);
  date.setUTCDate(date.getUTCDate() + days);
  return getFeedDateKey(date);
}

describe("date formatting", () => {
  it("formats feed dates consistently", () => {
    expect(formatFeedDate("2024-04-02")).toBe("Tue · 02 APR");
  });

  it("labels feed days relative to today", () => {
    expect(formatFeedDayLabel(offsetFromToday(0))).toBe("Today");
    expect(formatFeedDayLabel(offsetFromToday(-1))).toBe("Yesterday");
    expect(formatFeedDayLabel(offsetFromToday(-3))).toBe("3 days ago");
  });
});
