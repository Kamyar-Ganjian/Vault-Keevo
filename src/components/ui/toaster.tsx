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
          borderRadius: "10px",
          border: "1px solid var(--line-strong)",
          background: "var(--surface-3)",
          color: "var(--ink)",
          boxShadow: "var(--shadow-elev)",
        },
      }}
    />
  );
}