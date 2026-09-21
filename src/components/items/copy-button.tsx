"use client";

import { useState } from "react";
import { FiCheck, FiCopy } from "react-icons/fi";
import { toast } from "sonner";
import { Button, type ButtonProps } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function CopyButton({
  value,
  label = "Copy",
  copiedLabel = "Copied",
  className,
  variant = "ghost",
  ...props
}: {
  value: string;
  label?: string;
  copiedLabel?: string;
} & Omit<ButtonProps, "value" | "label">) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    if (!value) return;
    try {
      await navigator.clipboard.writeText(value);
    } catch {
      toast.error("Could not copy to clipboard");
      return;
    }
    setCopied(true);
    toast.success("Copied to clipboard");
    setTimeout(() => setCopied(false), 1600);
  }

  return (
    <Button
      variant={variant}
      size="icon-sm"
      onClick={copy}
      aria-label={copied ? copiedLabel : label}
      className={cn("text-faint hover:text-ink", copied && "text-mint", className)}
      {...props}
    >
      {copied ? <FiCheck className="h-3.5 w-3.5" /> : <FiCopy className="h-3.5 w-3.5" />}
    </Button>
  );
}