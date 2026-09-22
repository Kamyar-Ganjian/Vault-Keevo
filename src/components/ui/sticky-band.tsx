import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * The full-bleed toolbar band that sticks below the mobile header
 * (and at the very top on desktop). Shared by the vault tabs, the
 * editor and the item detail page.
 */
export function StickyBand({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  return (
    <div
      className={cn(
        "sticky top-14 z-30 border-b border-line/80 bg-app/90 backdrop-blur-xl lg:top-0",
        className,
      )}
    >
      {children}
    </div>
  );
}