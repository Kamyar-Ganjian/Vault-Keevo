import type { IconType } from "react-icons";
import {
  FiAlignLeft,
  FiCalendar,
  FiCode,
  FiHash,
  FiLink,
  FiLock,
  FiMail,
  FiToggleRight,
  FiType,
} from "react-icons/fi";

export const FIELD_TYPES = [
  "text",
  "secret",
  "url",
  "email",
  "number",
  "date",
  "longtext",
  "toggle",
  "code",
] as const;

export type FieldType = (typeof FIELD_TYPES)[number];

const SENSITIVE: ReadonlySet<FieldType> = new Set(["secret", "code"]);

export function isSensitiveType(type: string): boolean {
  return SENSITIVE.has(type as FieldType);
}

export interface FieldTypeMeta {
  label: string;
  description: string;
  icon: IconType;
  /** How the editor renders the value. */
  kind: "input" | "textarea" | "toggle";
  inputType?: string;
  sensitive: boolean;
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
  url: {
    label: "URL",
    description: "Link",
    icon: FiLink,
    kind: "input",
    inputType: "url",
    sensitive: false,
  },
  email: {
    label: "Email",
    description: "Email address",
    icon: FiMail,
    kind: "input",
    inputType: "email",
    sensitive: false,
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