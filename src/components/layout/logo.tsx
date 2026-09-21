import Link from "next/link";
import { cn } from "@/lib/utils";

export function KeevoMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" fill="none" aria-hidden="true" className={className}>
      <rect
        x="4.5"
        y="4.5"
        width="23"
        height="23"
        rx="8"
        stroke="currentColor"
        strokeWidth="2.2"
      />
      <path
        d="M13.5 11.5v9"
        stroke="currentColor"
        strokeWidth="2.6"
        strokeLinecap="round"
      />
      <path
        d="M19.5 12.5 15 16l4.5 3.5"
        stroke="currentColor"
        strokeWidth="2.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

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
          "grid shrink-0 place-items-center rounded-[9px] bg-accent text-accent-fg",
          "transition-transform duration-200 group-hover:scale-[1.03] group-active:scale-95",
          size === "md" ? "h-8 w-8" : "h-7 w-7",
        )}
      >
        <KeevoMark className={cn(size === "md" ? "h-[58%] w-[58%]" : "h-[54%] w-[54%]")} />
      </span>
      <span
        className={cn(
          "font-semibold tracking-tight text-ink",
          size === "md" ? "text-[17px]" : "text-[15px]",
          hideLabelOnMobile && "hidden min-[400px]:inline",
        )}
      >
        Keevo
      </span>
    </Link>
  );
}