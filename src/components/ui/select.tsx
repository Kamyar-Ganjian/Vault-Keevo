import { forwardRef, type SelectHTMLAttributes } from "react";
import { FiChevronDown } from "react-icons/fi";
import { cn } from "@/lib/utils";

export const Select = forwardRef<
  HTMLSelectElement,
  SelectHTMLAttributes<HTMLSelectElement>
>(function Select({ className, children, ...props }, ref) {
  return (
    <div className="relative">
      <select
        ref={ref}
        className={cn(
          "h-9 w-full cursor-pointer appearance-none rounded-lg border border-line bg-surface-2 pl-3 pr-9 text-sm text-ink outline-none",
          "transition-colors focus-visible:border-accent/60 focus-visible:bg-surface focus-visible:ring-[3px] focus-visible:ring-accent/15",
          className,
        )}
        {...props}
      >
        {children}
      </select>
      <FiChevronDown
        aria-hidden
        className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-faint"
      />
    </div>
  );
});