import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * The standard centered page column across vault screens.
 * Override the max width (e.g. `max-w-2xl`) or spacing via className.
 */
export function Container({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  return (
    <div className={cn("mx-auto w-full max-w-6xl px-4 sm:px-6", className)}>
      {children}
    </div>
  );
}