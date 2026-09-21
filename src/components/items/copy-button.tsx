"use client";

import { useState } from "react";
import { FiCheck, FiCopy } from "react-icons/fi";
import { cn } from "@/lib/utils";

export function CopyButton({
  value,
  label = "Copy",
  copiedLabel = "Copied",
  className,
}: {
  value: string;
  label?: string;
  copiedLabel?: string;
  className?: string;
}) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    if (!value) return;
    try {
      await navigator.clipboard.writeText(value);
    } catch {
      return;
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 1600);
  }

  return (
    <button
      onClick={copy}
      aria-label={copied ? copiedLabel : label}
      className={cn(
        "inline-flex min-w-[64px] cursor-pointer items-center justify-end gap-1 text-[11px] font-medium transition-colors",
        copied ? "text-mint" : "text-faint hover:text-ink",
        className,
      )}
    >
      {copied ? (
        <>
          <FiCheck className="h-3 w-3" />
          <span>{copiedLabel} ✓</span>
        </>
      ) : (
        <>
          <FiCopy className="h-3 w-3" />
          <span>{label}</span>
        </>
      )}
    </button>
  );
}