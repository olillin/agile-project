import { Pill } from "@/components/admin/Pill";
import { Card } from "@/components/ui/Card";
import { ratingColor } from "@/lib/admin/colors";
import { FOCUS_RING } from "@/lib/styles";
import { Suggestion } from "@/lib/types";
import Link from "next/link";

type Props = { suggestions: Suggestion[] };

const COLS = "4fr 1fr";

export function SuggestionsTable({ suggestions }: Props) {
  return (
    <Card padding={0}>
      <div
        className="text-ink-soft text-eyebrow border-ink/[0.06] grid border-b uppercase"
        style={{ gridTemplateColumns: COLS, padding: "10px 16px" }}
      >
        <div />
        <div>Title</div>
        <div>Left by</div>
        <div />
      </div>
      {
        // TODO: Show suggestions properly
        suggestions.map(suggestion => (
          <div>{suggestion.title}</div>
        ))
      }
    </Card>
  );
}
