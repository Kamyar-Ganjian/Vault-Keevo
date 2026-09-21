import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function Alert({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      role="alert"
      className={cn(
        "rounded-xl border border-danger/25 bg-danger/5 px-3.5 py-2.5 text-[13px] font-medium text-danger",
        className,
      )}
    >
      {children}
    </div>
  );
}