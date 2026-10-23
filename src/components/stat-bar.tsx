import { STAT_LABELS } from "@/lib/pokemon";

type StatBarProps = {
  name: string;
  value: number;
};

function barColor(value: number): string {
  if (value >= 130) {
    return "#059669";
  }
  if (value >= 90) {
    return "#16a34a";
  }
  if (value >= 60) {
    return "#eab308";
  }
  if (value >= 40) {
    return "#f97316";
  }
  return "#dc2626";
}

export function StatBar({ name, value }: StatBarProps) {
  const label = STAT_LABELS[name] ?? name;
  const width = Math.max(4, Math.min(100, (value / 255) * 100));
  const color = barColor(value);

  return (
    <div className="grid grid-cols-[6.5rem_2.5rem_1fr] items-center gap-3">
      <span className="truncate text-xs font-medium text-slate-500">{label}</span>
      <span className="text-right font-mono text-sm font-bold text-slate-900">
        {value}
      </span>
      <div
        role="progressbar"
        aria-label={`${label}: ${value} de 255`}
        aria-valuemin={0}
        aria-valuemax={255}
        aria-valuenow={value}
        className="h-2.5 overflow-hidden rounded-full bg-slate-100"
      >
        <div
          className="h-full rounded-full transition-[width] duration-500 motion-reduce:transition-none"
          style={{ width: `${width}%`, backgroundColor: color }}
        />
      </div>
    </div>
  );
}
