import { cn } from "@/lib/utils";

interface Props {
  value: number;
  label?: string;
  size?: number;
  tone?: "primary" | "warning" | "destructive" | "muted";
}

const toneColor: Record<NonNullable<Props["tone"]>, string> = {
  primary: "var(--primary)",
  warning: "var(--warning)",
  destructive: "var(--destructive)",
  muted: "var(--muted-foreground)",
};

export function ScoreRing({ value, label, size = 120, tone = "primary" }: Props) {
  const clamped = Math.max(0, Math.min(100, value));
  const stroke = 10;
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const offset = c - (clamped / 100) * c;
  return (
    <div className={cn("inline-flex flex-col items-center")}>
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="var(--border)"
          strokeWidth={stroke}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={toneColor[tone]}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={offset}
          style={{ transition: "stroke-dashoffset 800ms ease" }}
        />
      </svg>
      <div className="-mt-[calc(50%+8px)] text-center" style={{ width: size }}>
        <div className="text-3xl font-semibold tabular-nums">{clamped}</div>
        {label ? <div className="text-[10px] uppercase tracking-wider text-muted-foreground">{label}</div> : null}
      </div>
      <div style={{ height: size / 2 }} />
    </div>
  );
}