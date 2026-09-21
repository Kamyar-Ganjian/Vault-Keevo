"use client";

import * as DialogPrimitive from "@radix-ui/react-dialog";
import { AnimatePresence, motion } from "framer-motion";
import { FiX } from "react-icons/fi";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type Size = "sm" | "md" | "lg";

const SIZES: Record<Size, string> = {
  sm: "max-w-sm",
  md: "max-w-md",
  lg: "max-w-lg",
};

export interface DialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title?: ReactNode;
  description?: ReactNode;
  children?: ReactNode;
  footer?: ReactNode;
  size?: Size;
  className?: string;
  hideClose?: boolean;
}

export function Dialog({
  open,
  onOpenChange,
  title,
  description,
  children,
  footer,
  size = "md",
  className,
  hideClose,
}: DialogProps) {
  return (
    <DialogPrimitive.Root open={open} onOpenChange={onOpenChange}>
      <AnimatePresence>
        {open ? (
          <DialogPrimitive.Portal forceMount>
            <DialogPrimitive.Overlay asChild forceMount>
              <motion.div
                className="fixed inset-0 z-50 bg-black/40 backdrop-blur-[2px]"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.15 }}
              />
            </DialogPrimitive.Overlay>
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
              <DialogPrimitive.Content asChild forceMount>
                <motion.div
                  role="dialog"
                  initial={{ opacity: 0, scale: 0.96, y: 10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.97, y: 6 }}
                  transition={{ type: "spring", duration: 0.35, bounce: 0.15 }}
                  className={cn(
                    "relative w-full rounded-2xl border border-line bg-surface shadow-2xl",
                    "outline-none",
                    SIZES[size],
                    className,
                  )}
                >
                  {!hideClose ? (
                    <DialogPrimitive.Close asChild>
                      <button
                        aria-label="Close"
                        className="absolute right-4 top-4 z-10 grid h-8 w-8 cursor-pointer place-items-center rounded-lg text-faint transition-colors hover:bg-surface-2 hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/60"
                      >
                        <FiX className="h-4 w-4" />
                      </button>
                    </DialogPrimitive.Close>
                  ) : null}

                  <div className="p-6">
                    {title ? (
                      <DialogPrimitive.Title className="text-base font-semibold text-ink">
                        {title}
                      </DialogPrimitive.Title>
                    ) : (
                      <DialogPrimitive.Title className="sr-only" />
                    )}
                    {description ? (
                      <DialogPrimitive.Description className="mt-1.5 text-sm leading-relaxed text-muted">
                        {description}
                      </DialogPrimitive.Description>
                    ) : (
                      <DialogPrimitive.Description className="sr-only" />
                    )}
                    {children}
                  </div>

                  {footer ? (
                    <div className="flex items-center justify-end gap-2 border-t border-line px-6 py-4">
                      {footer}
                    </div>
                  ) : null}
                </motion.div>
              </DialogPrimitive.Content>
            </div>
          </DialogPrimitive.Portal>
        ) : null}
      </AnimatePresence>
    </DialogPrimitive.Root>
  );
}