type Item = {
  label: string;
  count: number;
  color?: string;
};

type Props = {
  items: Item[];
  defaultColor?: string;
};

export function TagBars({ items, defaultColor = "var(--color-tea)" }: Props) {
  const max = Math.max(...items.map(i => i.count), 1);
  return (
    <div className="flex flex-col" style={{ gap: 6 }}>
      {items.map(it => {
        const pct = (it.count / max) * 100;
        return (
          <div key={it.label} className="flex items-center" style={{ gap: 10 }}>
            <div
              className="text-ink text-meta font-medium"
              style={{ width: 110 }}
            >
              {it.label}
            </div>
            <div
              className="bg-ink/[0.04] flex-1 overflow-hidden rounded-[3px]"
              style={{ height: 18 }}
            >
              <div
                className="h-full rounded-[3px]"
                style={{
                  width: `${pct}%`,
                  background: it.color ?? defaultColor,
                }}
              />
            </div>
            <div
              className="text-ink-soft text-meta text-right tabular-nums"
              style={{ width: 40 }}
            >
              {it.count}
            </div>
          </div>
        );
      })}
    </div>
  );
}
