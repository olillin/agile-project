type Props = {
  size?: number;
};

export function Wordmark({ size = 22 }: Props) {
  return (
    <span
      className="font-serif italic inline-flex items-baseline text-ink"
      style={{
        fontSize: size,
        lineHeight: 1,
        letterSpacing: -0.3,
        gap: size * 0.18,
      }}
    >
      <span>Don&apos;t Spill</span>
      <span className="text-amber">the Tea</span>
    </span>
  );
}
