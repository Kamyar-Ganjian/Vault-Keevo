import Link from "next/link";
import { FiKey } from "react-icons/fi";
import { cn } from "@/lib/utils";

export function Logo({
  className,
  href = "/vault",
  size = "md",
  hideLabelOnMobile = false,
}: {
  className?: string;
  href?: string;
  size?: "sm" | "md";
  hideLabelOnMobile?: boolean;
}) {
  return (
    <Link href={href} className={cn("group inline-flex items-center gap-2.5", className)}>
      <span
        className={cn(
          "grid shrink-0 place-items-center rounded-xl text-white brand-gradient shadow-[0_4px_14px_-6px_rgba(99,102,241,0.65)]",
          "transition-[transform,filter] duration-150 group-hover:brightness-105",
          size === "md" ? "h-8 w-8" : "h-7 w-7",
        )}
      >
        <FiKey className={cn(size === "md" ? "h-4 w-4" : "h-3.5 w-3.5")} />
      </span>
      <span
        className={cn(
          "bg-gradient-to-r from-accent to-mint bg-clip-text text-transparent font-semibold tracking-tight",
          size === "md" ? "text-[17px]" : "text-[15px]",
          hideLabelOnMobile && "hidden min-[400px]:inline",
        )}
      >
        Keevo
      </span>
    </Link>
  );
}