import Link from "next/link";
import type { ReactNode } from "react";

export function BackLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <Link
      href={href}
      className="flex cursor-pointer items-center gap-1.5 text-[13px] font-medium text-faint transition-colors hover:text-ink"
    >
      {children}
    </Link>
  );
}