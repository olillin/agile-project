import { Eyebrow } from "@/components/brand/Eyebrow";
import type { Day, Option } from "@/lib/types";
import { OptionCard } from "./OptionCard";

type Props = {
  day: Day;
  onOpen: (option: Option, day: Day) => void;
  ratedIds: Set<string>;
};

export function DaySection({ day, onOpen, ratedIds }: Props) {
  if (day.options.length === 0) return null;
  const [hero, ...rest] = day.options;
  const open = (option: Option) => onOpen(option, day);
  return (
    <section className="mb-7">
      <header className="flex items-baseline justify-between px-1 pb-2.5">
        <h2
          className={`font-serif ${day.isToday ? "italic text-amber" : "text-ink"}`}
          style={{ fontSize: 22, letterSpacing: -0.3 }}
        >
          {day.label}
        </h2>
        <Eyebrow size="sm">{day.date}</Eyebrow>
      </header>
      <div className="mb-2.5">
        <OptionCard option={hero} onOpen={open} rated={ratedIds.has(hero.id)} />
      </div>
      <div className="grid grid-cols-2 items-stretch gap-2.5">
        {rest.map((o) => (
          <OptionCard
            key={o.id}
            option={o}
            onOpen={open}
            rated={ratedIds.has(o.id)}
            compact
          />
        ))}
      </div>
    </section>
  );
}
