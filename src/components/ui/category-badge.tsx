import { CATEGORY_COLORS, categoryLabel } from "@/lib/types";
import { cn } from "@/lib/utils";

export function CategoryBadge({
  category,
  className,
}: {
  category: string;
  className?: string;
}) {
  const color = CATEGORY_COLORS[category as keyof typeof CATEGORY_COLORS] ?? CATEGORY_COLORS.other;
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-md px-1.5 py-0.5 text-[11px] font-medium",
        className,
      )}
      style={{
        color: `color-mix(in srgb, ${color} 72%, var(--ink))`,
        background: `color-mix(in srgb, ${color} 8%, transparent)`,
      }}
    >
      <span className="h-1.5 w-1.5 rounded-full" style={{ background: color }} />
      {categoryLabel(category)}
    </span>
  );
}