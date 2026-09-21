"use client";

import * as TooltipPrimitive from "@radix-ui/react-tooltip";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function Tooltip({
  content,
  children,
  side = "bottom",
  sideOffset = 6,
}: {
  content: ReactNode;
  children: ReactNode;
  side?: "top" | "bottom" | "left" | "right";
  sideOffset?: number;
}) {
  return (
    <TooltipPrimitive.Root>
      <TooltipPrimitive.Trigger asChild>{children}</TooltipPrimitive.Trigger>
      <TooltipPrimitive.Portal>
        <TooltipPrimitive.Content
          side={side}
          sideOffset={sideOffset}
          className={cn(
            "z-50 rounded-md bg-ink px-2.5 py-1 text-xs font-medium text-app shadow-card ring-1 ring-line/50",
            "dark:bg-surface-4 dark:text-ink",
          )}
        >
          {content}
          <TooltipPrimitive.Arrow className="fill-ink dark:fill-surface-4" />
        </TooltipPrimitive.Content>
      </TooltipPrimitive.Portal>
    </TooltipPrimitive.Root>
  );
}