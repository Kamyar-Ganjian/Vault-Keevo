import type { IconType } from "react-icons";
import {
  FiAlignLeft,
  FiCalendar,
  FiCode,
  FiHash,
  FiKey,
  FiLink,
  FiLock,
  FiMail,
  FiToggleRight,
  FiType,
} from "react-icons/fi";

export const FIELD_TYPES = [
  "text",
  "secret",
  "password",
  "url",
  "email",
  "number",
  "date",
  "longtext",
  "toggle",
  "code",
] as const;

export type FieldType = (typeof FIELD_TYPES)[number];

const SENSITIVE: ReadonlySet<FieldType> = new Set([
  "secret",
  "password",
  "code",
]);

export function isSensitiveType(type: string): boolean {
  return SENSITIVE.has(type as FieldType);
}

/** Placeholder shown instead of secret/code values in at-a-glance previews. */
export const VALUE_MASK = "••••••••";

/** True for the common affirmative spellings of a toggle value. */
export function isToggleOn(raw: string): boolean {
  return ["true", "1", "yes", "on", "enabled"].includes(
    raw.trim().toLowerCase(),
  );
}

/**
 * Compact value text for cards, search results and the editor preview:
 * sensitive values are masked, toggles collapse to On/Off, and empty
 * values fall back to a dash.
 */
export function previewText(type: string, value: string): string {
  if (isSensitiveType(type)) return VALUE_MASK;
  if (type === "toggle") return isToggleOn(value) ? "On" : "Off";
  return value || "—";
}

export interface FieldTypeMeta {
  label: string;
  description: string;
  icon: IconType;
  /** How the editor renders the value. */
  kind: "input" | "textarea" | "toggle";
  inputType?: string;
  sensitive: boolean;
  /** When set, the type is self-describing and no custom name is needed. */
  autoName?: string;
}

export const FIELD_TYPE_META: Record<FieldType, FieldTypeMeta> = {
  text: {
    label: "Text",
    description: "Short text value",
    icon: FiType,
    kind: "input",
    inputType: "text",
    sensitive: false,
  },
  secret: {
    label: "Secret",
    description: "Password, key, recovery code…",
    icon: FiLock,
    kind: "input",
    inputType: "password",
    sensitive: true,
  },
  password: {
    label: "Password",
    description: "Password",
    icon: FiKey,
    kind: "input",
    inputType: "password",
    sensitive: true,
    autoName: "Password",
  },
  url: {
    label: "URL",
    description: "Link",
    icon: FiLink,
    kind: "input",
    inputType: "url",
    sensitive: false,
    autoName: "URL",
  },
  email: {
    label: "Email",
    description: "Email address",
    icon: FiMail,
    kind: "input",
    inputType: "email",
    sensitive: false,
    autoName: "Email",
  },
  number: {
    label: "Number",
    description: "Numeric value",
    icon: FiHash,
    kind: "input",
    inputType: "text",
    sensitive: false,
  },
  date: {
    label: "Date",
    description: "A date",
    icon: FiCalendar,
    kind: "input",
    inputType: "date",
    sensitive: false,
    autoName: "Date",
  },
  longtext: {
    label: "Long text",
    description: "Multi-line text",
    icon: FiAlignLeft,
    kind: "textarea",
    sensitive: false,
  },
  toggle: {
    label: "Toggle",
    description: "On / off value",
    icon: FiToggleRight,
    kind: "toggle",
    sensitive: false,
    autoName: "Toggle",
  },
  code: {
    label: "Code",
    description: "Snippet, SSH key, token…",
    icon: FiCode,
    kind: "textarea",
    sensitive: true,
  },
};

export function getFieldTypeMeta(type: string): FieldTypeMeta {
  return FIELD_TYPE_META[type as FieldType] ?? FIELD_TYPE_META.text;
}

/** Resolve the display label for a field based on its type. */
export function fieldLabel(type: string, name: string): string {
  return FIELD_TYPE_META[type as FieldType]?.autoName ?? name;
}
