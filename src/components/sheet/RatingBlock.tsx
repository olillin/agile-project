import { CupRating } from "@/components/brand/CupRating";
import { Eyebrow } from "@/components/brand/Eyebrow";
import { QUICK_TAGS } from "@/lib/fixtures";
import { FOCUS_RING } from "@/lib/styles";

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
    <div className="mt-3.5 rounded-[16px] border border-ink/6 bg-paper p-[18px]">
      <h3
        className="text-center font-serif text-ink"
        style={{ fontSize: 20, letterSpacing: -0.2 }}
      >
        How was it?
      </h3>
      <div className="mt-3.5 flex justify-center">
        <CupRating value={rating} size={46} interactive onChange={setRating} />
      </div>

      {rating > 0 && (
        <div className="mt-4 animate-dst-fade">
          <Eyebrow size="sm" className="mb-2 block">
            {rating >= 4 ? "What made it good?" : "What was off?"}
            <span
              className="ml-1.5 normal-case font-normal text-ink-muted"
              style={{ letterSpacing: 0 }}
            >
              · optional
            </span>
          </Eyebrow>
          <div className="flex flex-wrap gap-1.5">
            {suggested.map((t) => {
              const on = tags.has(t);
              return (
                <button
                  key={t}
                  type="button"
                  onClick={() => toggleTag(t)}
                  aria-pressed={on}
                  className={`rounded-full transition-colors ${FOCUS_RING.paper} ${
                    on
                      ? "bg-ink text-paper border border-ink font-semibold"
                      : "border border-ink/15 bg-transparent text-ink font-medium"
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
            onChange={(e) => setNote(e.target.value)}
            placeholder="Add a note for the kitchen… (optional)"
            rows={2}
            className="mt-3 w-full resize-none rounded-[12px] border border-ink/10 bg-cream px-3 py-2.5 text-ink outline-none"
            style={{ fontSize: 16, lineHeight: 1.4 }}
          />
        </div>
      )}
    </div>
  );
}
