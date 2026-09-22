export interface AccentColor {
  name: string;
  value: string;
}

export const ACCENT_COLORS: AccentColor[] = [
  { name: "Slate", value: "#64748b" },
  { name: "Zinc", value: "#71717a" },
  { name: "Blue", value: "#3b82f6" },
  { name: "Sky", value: "#0ea5e9" },
  { name: "Cyan", value: "#06b6d4" },
  { name: "Teal", value: "#14b8a6" },
  { name: "Emerald", value: "#10b981" },
  { name: "Green", value: "#22c55e" },
  { name: "Lime", value: "#84cc16" },
  { name: "Amber", value: "#f59e0b" },
  { name: "Orange", value: "#f97316" },
  { name: "Red", value: "#ef4444" },
  { name: "Rose", value: "#f43f5e" },
  { name: "Pink", value: "#ec4899" },
  { name: "Purple", value: "#a855f7" },
  { name: "Violet", value: "#8b5cf6" },
  { name: "Indigo", value: "#6366f1" },
  { name: "Slate Indigo", value: "#6d6fc3" },
];

export function isValidHex(color: string): boolean {
  return /^#([0-9a-f]{3}|[0-9a-f]{6})$/i.test(color);
}

export function accentTileInk(accent: string): string {
  return `color-mix(in srgb, ${accent} 78%, var(--ink))`;
}