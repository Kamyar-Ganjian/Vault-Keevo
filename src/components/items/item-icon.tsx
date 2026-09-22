import { getIconDef } from "@/lib/icons";
import { accentTileInk } from "@/lib/colors";
import { cn } from "@/lib/utils";
import type { ItemAppearance } from "@/lib/types";

const SIZES = {
  xs: "h-6 w-6 [&_svg]:h-3.5 [&_svg]:w-3.5",
  sm: "h-8 w-8 [&_svg]:h-4 [&_svg]:w-4",
  md: "h-10 w-10 [&_svg]:h-5 [&_svg]:w-5",
  lg: "h-14 w-14 [&_svg]:h-7 [&_svg]:w-7",
  xl: "h-[76px] w-[76px] [&_svg]:h-10 [&_svg]:w-10",
  hero: "h-20 w-20 [&_svg]:h-10 [&_svg]:w-10",
} as const;

export function ItemIcon({
  icon,
  appearance,
  size = "md",
  className,
}: {
  icon: string;
  appearance: ItemAppearance;
  size?: keyof typeof SIZES;
  className?: string;
}) {
  const { Icon } = getIconDef(icon);
  return (
    <span
      className={cn("grid shrink-0 select-none place-items-center", "rounded-xl", SIZES[size], className)}
      style={{
        background: `linear-gradient(145deg, color-mix(in srgb, ${appearance.accent} 30%, var(--surface-2)), color-mix(in srgb, ${appearance.accent} 12%, var(--surface-2)))`,
        color: accentTileInk(appearance.accent),
        boxShadow: `inset 0 1px 0 0 color-mix(in srgb, white 7%, transparent), inset 0 0 0 1px color-mix(in srgb, ${appearance.accent} 20%, transparent), 0 1px 2px 0 rgb(9 11 16 / 0.3)`,
      }}
    >
      <Icon aria-hidden />
    </span>
  );
}