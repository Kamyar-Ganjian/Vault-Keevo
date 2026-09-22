"use client";

import { useState } from "react";
import { ACCENT_COLORS, isValidHex } from "@/lib/colors";
import type { ItemAppearance } from "@/lib/types";
import { cn } from "@/lib/utils";

export function AppearanceEditor({
  value,
  onChange,
}: {
  value: ItemAppearance;
  onChange: (next: ItemAppearance) => void;
}) {
  const [customHex, setCustomHex] = useState(
    ACCENT_COLORS.some((c) => c.value === value.accent) ? "" : value.accent,
  );

  function pickAccent(accent: string) {
    setCustomHex("");
    onChange({ accent });
  }

  function commitCustomColor(raw: string) {
    const hex = raw.trim();
    setCustomHex(hex);
    if (isValidHex(hex)) {
      onChange({ accent: hex });
    }
  }

  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-wide text-faint">
        Accent color
      </p>
      <div className="mt-2.5 flex flex-wrap gap-2">
        {ACCENT_COLORS.map((color) => (
          <button
            key={color.value}
            type="button"
            title={color.name}
            onClick={() => pickAccent(color.value)}
            aria-label={`${color.name} accent`}
            aria-pressed={value.accent === color.value}
            className={cn(
              "h-7 w-7 cursor-pointer rounded-full transition-transform hover:scale-110",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-app",
              value.accent === color.value &&
                "ring-2 ring-accent ring-offset-2 ring-offset-app",
            )}
            style={{ background: color.value }}
          />
        ))}
        <label
          className={cn(
            "relative h-7 w-7 cursor-pointer overflow-hidden rounded-full border border-line bg-surface-2",
            value.accent !== "" &&
              !ACCENT_COLORS.some((c) => c.value === value.accent) &&
              "ring-2 ring-accent ring-offset-2 ring-offset-app",
          )}
          title="Custom color"
        >
          <input
            type="color"
            value={value.accent}
            onChange={(e) => pickAccent(e.target.value)}
            className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
            aria-label="Custom accent color"
          />
          <span className="grid h-full w-full place-items-center text-[10px] font-semibold text-faint">
            +
          </span>
        </label>
      </div>
      <div className="mt-3">
        <input
          value={customHex}
          onChange={(e) => commitCustomColor(e.target.value)}
          placeholder="#6366f1"
          className="h-8 w-32 rounded-lg border border-line bg-surface-2 px-2.5 font-mono text-xs text-ink placeholder:text-faint focus-visible:border-accent/60 focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-accent/15"
          aria-label="Custom hex color"
        />
      </div>
    </div>
  );
}