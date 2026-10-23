import { TYPE_LABELS, typeColor, typeTextColor } from "@/lib/pokemon";

type TypeBadgeProps = {
  type: string;
  size?: "sm" | "md";
  compact?: boolean;
};

export function TypeBadge({ type, size = "sm", compact = false }: TypeBadgeProps) {
  const color = typeColor(type);
  const textColor = typeTextColor(type);
  const label = TYPE_LABELS[type] ?? type;

  return (
    <span
      className={`inline-flex items-center rounded-full font-semibold uppercase tracking-wide ${
        size === "md"
          ? "gap-1.5 px-3.5 py-1.5 text-xs"
          : compact
            ? "gap-1 px-2 py-1 text-[10px]"
            : "gap-1.5 px-2.5 py-1 text-[11px]"
      }`}
      style={{ backgroundColor: color, color: textColor }}
    >
      {compact ? null : (
        <span
          aria-hidden="true"
          className="h-1.5 w-1.5 rounded-full bg-current opacity-80"
        />
      )}
      {label}
    </span>
  );
}
