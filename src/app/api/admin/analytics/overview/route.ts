import { verifySession } from "@/lib/session";
import {
  getAdminOverviewTrend,
  type TrendRange,
} from "@/services/statisticsService";

const RANGE_KEYS = new Set<TrendRange>(["7d", "30d", "1y"]);

function parseRange(value: string | null): TrendRange {
  return RANGE_KEYS.has(value as TrendRange) ? (value as TrendRange) : "30d";
}

export async function GET(request: Request) {
  await verifySession();

  const url = new URL(request.url);
  const range = parseRange(url.searchParams.get("range"));
  const trend = await getAdminOverviewTrend(range);

  return Response.json(trend);
}
