import { CupRating } from "@/components/brand/CupRating";
import { Eyebrow } from "@/components/brand/Eyebrow";
import { FOCUS_RING } from "@/lib/styles";

const QUICK_TAGS = {
  positive: ["filling", "fresh", "balanced"],
  negative: ["bland", "dry", "overcooked", "small portion"],
} as const;

type Props = {
  rating: number;
  setRating: (v: number) => void;
  tags: Set<string>;
  toggleTag: (t: string) => void;
  note: string;
  setNote: (n: string) => void;
};

export function RatingBlock({
  rating,
  setRating,
  tags,
  toggleTag,
  note,
  setNote,
}: Props) {
  const suggested =
    rating >= 4 ? QUICK_TAGS.positive : rating > 0 ? QUICK_TAGS.negative : [];

  return (
    <div className="border-ink/6 bg-paper mt-3.5 rounded-[16px] border p-[18px]">
      <h3
        className="text-ink text-center font-serif"
        style={{ fontSize: 20, letterSpacing: -0.2 }}
      >
        How was it?
      </h3>
      <div className="mt-3.5 flex justify-center">
        <CupRating value={rating} size={46} interactive onChange={setRating} />
      </div>

      {rating > 0 && (
        <div className="animate-dst-fade mt-4">
          <Eyebrow size="sm" className="mb-2 block">
            {rating >= 4 ? "What made it good?" : "What was off?"}
            <span
              className="text-ink-muted ml-1.5 font-normal normal-case"
              style={{ letterSpacing: 0 }}
            >
              · optional
            </span>
          </Eyebrow>
          <div className="flex flex-wrap gap-1.5">
            {suggested.map(t => {
              const on = tags.has(t);
              return (
                <button
                  key={t}
                  type="button"
                  onClick={() => toggleTag(t)}
                  aria-pressed={on}
                  className={`rounded-full transition-colors ${FOCUS_RING.paper} ${
                    on
                      ? "bg-ink text-paper border-ink border font-semibold"
                      : "border-ink/15 text-ink border bg-transparent font-medium"
                  }`}
                  style={{ fontSize: 12, padding: "7px 12px" }}
                >
                  {t}
                </button>
              );
            })}
          </div>
          <textarea
            value={note}
            onChange={e => setNote(e.target.value)}
            placeholder="Add a note for the kitchen… (optional)"
            rows={2}
            className="border-ink/10 bg-cream text-ink mt-3 w-full resize-none rounded-[12px] border px-3 py-2.5 outline-none"
            style={{ fontSize: 16, lineHeight: 1.4 }}
          />
        </div>
      )}
    </div>
  );
}
