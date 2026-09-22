import type { FieldType } from "./field-types";

export const CATEGORY_VALUES = ["account", "server", "domain", "other"] as const;

export type Category = (typeof CATEGORY_VALUES)[number];

export const CATEGORIES = [
  { value: "account", label: "Accounts" },
  { value: "server", label: "Servers" },
  { value: "domain", label: "Domains" },
  { value: "other", label: "Other" },
] as const satisfies readonly { value: Category; label: string }[];

const CATEGORY_LABELS: Record<Category, string> = {
  account: "Account",
  server: "Server",
  domain: "Domain",
  other: "Other",
};

export function categoryLabel(category: string) {
  return CATEGORY_LABELS[category as Category] ?? CATEGORY_LABELS.other;
}

/** Quiet color signals per category. Used only at low opacity. */
export const CATEGORY_COLORS: Record<Category, string> = {
  account: "#8b7cff",
  server: "#34d399",
  domain: "#38bdf8",
  other: "#94a3b8",
};

export interface ItemAppearance {
  accent: string;
}

export const DEFAULT_APPEARANCE: ItemAppearance = {
  accent: "#6366f1",
};

export interface FieldValue {
  /** Present when the field already exists in the database. */
  id?: string;
  name: string;
  type: FieldType;
  value: string;
}

/** Lightweight representation used for cards + search results. */
export interface ItemCardData {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: Category;
  favorite: boolean;
  appearance: ItemAppearance;
  fieldCount: number;
  createdAt: string;
  updatedAt: string;
  /** First few fields for at-a-glance previews; sensitive values are masked. */
  previewFields: { name: string; type: string; value: string }[];
}

/** Full representation used by the detail + editor pages (decrypted). */
export interface ItemDetailData extends ItemCardData {
  notes: string;
  fields: FieldValue[];
}