type Props = {
  children: React.ReactNode;
  size?: "sm" | "md";
  className?: string;
};

const SIZES = {
  sm: { padding: "4px 9px", bg: "bg-paper/90" },
  md: { padding: "5px 11px", bg: "bg-paper/95" },
} as const;

export function LinePill({ children, size = "sm", className }: Props) {
  const s = SIZES[size];
  return (
    <span
      className={`text-ink rounded-full font-semibold uppercase backdrop-blur-md ${s.bg} ${className ?? ""}`}
      style={{ fontSize: 10, letterSpacing: 0.8, padding: s.padding }}
    >
      {children}
    </span>
  );
}
