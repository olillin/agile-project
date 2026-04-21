import { Check } from "lucide-react";
import { LinePill } from "@/components/brand/LinePill";
import { MealPhoto } from "@/components/brand/MealPhoto";
import { FOCUS_RING } from "@/lib/styles";
import type { Option } from "@/lib/types";

type Props = {
  option: Option;
  onOpen: (option: Option) => void;
  rated: boolean;
  compact?: boolean;
};

export function OptionCard({ option, onOpen, rated, compact }: Props) {
  return (
    <button
      type="button"
      onClick={() => onOpen(option)}
      className={`group flex h-full w-full cursor-pointer flex-col overflow-hidden rounded-[18px] border border-ink/6 bg-paper text-left shadow-[0_1px_2px_rgba(0,0,0,0.02)] transition-transform select-none active:scale-[0.99] ${FOCUS_RING.cream}`}
      style={{ WebkitTapHighlightColor: "transparent" }}
    >
      <MealPhoto
        color={option.color}
        pattern={option.pattern}
        height={compact ? 110 : 130}
        className="shrink-0"
      >
        <LinePill className="absolute left-2.5 top-2.5" size="sm">
          {option.line}
        </LinePill>
        {rated && (
          <span
            className="absolute right-2.5 top-2.5 grid h-6 w-6 place-items-center rounded-full bg-tea text-paper animate-check-pop"
            aria-label="Rated"
          >
            <Check size={14} strokeWidth={3} aria-hidden />
          </span>
        )}
      </MealPhoto>
      <div className="flex flex-1 items-start px-3.5 pb-3.5 pt-3">
        <h3
          className="font-serif text-ink"
          style={{
            fontSize: compact ? 17 : 19,
            letterSpacing: -0.2,
            lineHeight: 1.15,
          }}
        >
          {option.name}
        </h3>
      </div>
    </button>
  );
}
