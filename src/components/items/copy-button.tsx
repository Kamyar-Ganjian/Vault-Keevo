"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
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
        "inline-flex min-w-[64px] cursor-pointer items-center justify-end text-[11px] font-medium transition-colors",
        copied ? "text-mint" : "text-faint hover:text-ink",
        className,
      )}
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={copied ? "copied" : "copy"}
          initial={{ opacity: 0, scale: 0.7 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.7 }}
          transition={{ duration: 0.15, ease: "easeOut" }}
          className="inline-flex items-center gap-1"
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
        </motion.span>
      </AnimatePresence>
    </button>
  );
}