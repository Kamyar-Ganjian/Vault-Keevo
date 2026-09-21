import { Slot } from "@radix-ui/react-slot";
import { forwardRef, type ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

type Variant =
  | "primary"
  | "secondary"
  | "outline"
  | "ghost"
  | "danger"
  | "danger-ghost";
type Size = "sm" | "md" | "lg" | "icon" | "icon-sm";

const VARIANTS: Record<Variant, string> = {
  primary:
    "bg-accent text-accent-fg shadow-[0_1px_2px_rgba(99,102,241,0.35)] hover:brightness-110",
  secondary:
    "bg-surface-2 text-ink hover:bg-surface-3 border border-line",
  outline:
    "bg-transparent text-ink border border-line-strong hover:bg-surface-2 hover:border-line-strong",
  ghost: "text-muted hover:text-ink hover:bg-surface-2",
  danger:
    "bg-red-600 text-white shadow-sm hover:bg-red-500 dark:bg-red-500 dark:hover:bg-red-400",
  "danger-ghost":
    "text-red-600 dark:text-red-400 bg-red-500/5 border border-red-500/20 hover:bg-red-500/10",
};

const SIZES: Record<Size, string> = {
  sm: "h-8 px-3 text-[13px] gap-1.5",
  md: "h-9 px-4 text-sm gap-2",
  lg: "h-11 px-5 text-[15px] gap-2",
  icon: "h-9 w-9",
  "icon-sm": "h-8 w-8",
};

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  asChild?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  function Button(
    { className, variant = "primary", size = "md", asChild, ...props },
    ref,
  ) {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        ref={ref}
        className={cn(
          "inline-flex cursor-pointer select-none items-center justify-center whitespace-nowrap rounded-lg font-medium transition-colors duration-150",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/60 focus-visible:ring-offset-2 focus-visible:ring-offset-app",
          "disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98]",
          VARIANTS[variant],
          SIZES[size],
          className,
        )}
        {...props}
      />
    );
  },
);