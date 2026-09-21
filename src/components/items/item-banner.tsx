import { bannerBackground } from "@/lib/colors";
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
  if (appearance.banner === "none") return null;
  return (
    <span
      aria-hidden
      className={cn("block h-[3px] w-full", className)}
      style={{ background: bannerBackground(appearance) }}
    />
  );
}