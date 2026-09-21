"use client";

import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

export type LogoVariant = "auto" | "white" | "black" | "accent";

const LOGO = {
  white: "/logos/keevo-white.png",
  black: "/logos/keevo-black.png",
  accent: "/logos/keevo-accent.png",
} as const;

function BrandImage({
  src,
  className,
  priority,
}: {
  src: string;
  className?: string;
  priority?: boolean;
}) {
  return (
    <Image
      src={src}
      alt=""
      aria-hidden
      width={663}
      height={131}
      priority={priority}
      className={cn("object-contain object-center", className)}
    />
  );
}

export function Mark({
  variant = "auto",
  className,
}: {
  variant?: LogoVariant;
  className?: string;
}) {
  if (variant === "white") {
    return <BrandImage src={LOGO.white} className={className} />;
  }
  if (variant === "black") {
    return <BrandImage src={LOGO.black} className={className} />;
  }
  if (variant === "accent") {
    return <BrandImage src={LOGO.accent} className={className} />;
  }
  return (
    <>
      <BrandImage src={LOGO.white} className={cn("hidden dark:block", className)} />
      <BrandImage src={LOGO.black} className={cn("dark:hidden", className)} />
    </>
  );
}

export function Logo({
  className,
  href = "/vault",
  size = "md",
}: {
  className?: string;
  href?: string;
  size?: "sm" | "md";
}) {
  const sizeClass = size === "md" ? "h-7 w-44" : "h-6 w-[150px]";
  return (
    <Link href={href} className={cn("group inline-block", className)}>
      <span className="sr-only">Keevo</span>
      <BrandImage
        src={LOGO.white}
        className={cn(
          "transition-transform duration-200 group-hover:scale-[1.03] group-active:scale-95 hidden dark:block",
          sizeClass,
        )}
      />
      <BrandImage
        src={LOGO.black}
        className={cn(
          "transition-transform duration-200 group-hover:scale-[1.03] group-active:scale-95 dark:hidden",
          sizeClass,
        )}
      />
    </Link>
  );
}