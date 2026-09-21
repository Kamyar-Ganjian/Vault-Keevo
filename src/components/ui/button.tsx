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
    "bg-accent text-accent-fg shadow-[inset_0_1px_0_0_rgba(255,255,255,0.14)] hover:bg-accent-strong hover:shadow-[inset_0_1px_0_0_rgba(255,255,255,0.14),0_8px_24px_-10px_rgba(139,124,255,0.6)] focus-visible:ring-accent/40",
  secondary:
    "bg-surface-2/70 text-ink border border-line hover:bg-surface-3 hover:border-line-strong",
  outline:
    "bg-transparent text-ink border border-line-strong hover:bg-surface-2 hover:border-line-strong",
  ghost: "text-muted hover:text-ink hover:bg-surface-2/70",
  danger:
    "bg-danger text-white hover:brightness-110 focus-visible:ring-danger/40",
  "danger-ghost":
    "text-danger bg-danger/5 border border-danger/20 hover:bg-danger/10",
};

const SIZES: Record<Size, string> = {
  sm: "h-8 px-3 text-[13px] gap-1.5",
  md: "h-9 px-4 text-sm gap-2",
  lg: "h-10 px-5 text-[15px] gap-2",
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
          "inline-flex cursor-pointer select-none items-center justify-center whitespace-nowrap rounded-lg font-medium transition-[color,background-color,border-color,box-shadow,transform] duration-200",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40 focus-visible:ring-offset-2 focus-visible:ring-offset-app",
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