import type { ItemAppearance } from "@/lib/types";
import { cn } from "@/lib/utils";

/** Top-edge accent stripe shared by item cards and the editor preview. */
export function ItemBanner({
  appearance,
  className,
}: {
  appearance: ItemAppearance;
  className?: string;
}) {
  return (
    <span
      aria-hidden
      className={cn("block h-[3px] w-full", className)}
      style={{
        background: `color-mix(in srgb, ${appearance.accent} 75%, transparent)`,
      }}
    />
  );
}