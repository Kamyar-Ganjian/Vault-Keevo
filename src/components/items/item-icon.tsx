import { getIconDef } from "@/lib/icons";
import { accentTile, accentTileInk } from "@/lib/colors";
import { cn } from "@/lib/utils";
import type { ItemAppearance } from "@/lib/types";

const SHAPES = {
  circle: "rounded-full",
  rounded: "rounded-xl",
  square: "rounded-md",
} as const;

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
      className={cn(
        "grid shrink-0 select-none place-items-center",
        SHAPES[appearance.iconShape],
        SIZES[size],
        className,
      )}
      style={{
        background: accentTile(appearance.accent),
        color: accentTileInk(appearance.accent),
        boxShadow: `inset 0 0 0 1px color-mix(in srgb, ${appearance.accent} 14%, transparent)`,
      }}
    >
      <Icon aria-hidden />
    </span>
  );
}