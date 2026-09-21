"use client";

import { Toaster as SonnerToaster } from "sonner";
import { useTheme } from "@/components/theme-provider";

export function Toaster() {
  const { resolved } = useTheme();
  return (
    <SonnerToaster
      theme={resolved}
      position="bottom-right"
      richColors
      closeButton
      toastOptions={{
        style: {
          borderRadius: "12px",
          border: "1px solid var(--line)",
          background: "var(--surface)",
          color: "var(--ink)",
        },
      }}
    />
  );
}