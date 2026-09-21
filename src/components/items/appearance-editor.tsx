"use client";

import { useState } from "react";
import { ACCENT_COLORS, accentBorder, isValidHex } from "@/lib/colors";
import type { BannerStyle, IconShape, ItemAppearance } from "@/lib/types";
import { cn } from "@/lib/utils";

const SHAPES: { value: IconShape; label: string }[] = [
  { value: "circle", label: "Circle" },
  { value: "rounded", label: "Rounded" },
  { value: "square", label: "Square" },
];

const BANNERS: { value: BannerStyle; label: string }[] = [
  { value: "none", label: "None" },
  { value: "accent", label: "Accent" },
  { value: "gradient", label: "Gradient" },
];

function ShapeGlyph({ shape, accent }: { shape: IconShape; accent: string }) {
  return (
    <span
      aria-hidden
      className={cn(
        "grid h-6 w-6 place-items-center text-white",
        shape === "circle" && "rounded-full",
        shape === "rounded" && "rounded-lg",
        shape === "square" && "rounded-sm",
      )}
      style={{ background: accent }}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-white/80" />
    </span>
  );
}

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
    onChange({ ...value, accent });
  }

  function commitCustomColor(raw: string) {
    const hex = raw.trim();
    setCustomHex(hex);
    if (isValidHex(hex)) {
      onChange({ ...value, accent: hex });
    }
  }

  return (
    <div className="space-y-5">
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

      <div>
        <p className="text-xs font-semibold uppercase tracking-wide text-faint">
          Icon shape
        </p>
        <div className="mt-2.5 grid grid-cols-3 gap-2">
          {SHAPES.map((shape) => (
            <button
              key={shape.value}
              type="button"
              onClick={() => onChange({ ...value, iconShape: shape.value })}
              className={cn(
                "flex cursor-pointer flex-col items-center gap-1.5 rounded-xl border px-3 py-2.5 transition-colors",
                value.iconShape === shape.value
                  ? "border-accent/50 bg-accent-soft"
                  : "border-line bg-surface-2/60 hover:border-line-strong",
              )}
            >
              <ShapeGlyph shape={shape.value} accent={value.accent} />
              <span
                className={cn(
                  "text-xs",
                  value.iconShape === shape.value
                    ? "font-medium text-accent-strong"
                    : "text-muted",
                )}
              >
                {shape.label}
              </span>
            </button>
          ))}
        </div>
      </div>

      <div>
        <p className="text-xs font-semibold uppercase tracking-wide text-faint">
          Banner
        </p>
        <div className="mt-2.5 grid grid-cols-3 gap-2">
          {BANNERS.map((banner) => (
            <button
              key={banner.value}
              type="button"
              onClick={() => onChange({ ...value, banner: banner.value })}
              className={cn(
                "cursor-pointer overflow-hidden rounded-xl border transition-colors",
                value.banner === banner.value
                  ? "border-accent/50"
                  : "border-line hover:border-line-strong",
              )}
            >
              <span
                className="block h-6 w-full"
                style={{
                  background:
                    banner.value === "none"
                      ? "var(--surface-2)"
                      : banner.value === "accent"
                        ? accentBorder(value.accent)
                        : `linear-gradient(90deg, ${value.accent} 0%, color-mix(in srgb, ${value.accent} 55%, transparent) 100%)`,
                }}
              />
              <span
                className={cn(
                  "block py-1.5 text-xs",
                  value.banner === banner.value
                    ? "font-medium text-accent-strong"
                    : "text-muted",
                )}
              >
                {banner.label}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}