import type { FieldType } from "./field-types";

export const CATEGORIES = [
  { value: "account", label: "Accounts" },
  { value: "server", label: "Servers" },
  { value: "domain", label: "Domains" },
  { value: "other", label: "Other" },
] as const;

export type Category = (typeof CATEGORIES)[number]["value"];

export type IconShape = "circle" | "rounded" | "square";
export type BannerStyle = "none" | "accent" | "gradient";

export interface ItemAppearance {
  accent: string;
  iconShape: IconShape;
  banner: BannerStyle;
}

export const DEFAULT_APPEARANCE: ItemAppearance = {
  accent: "#6366f1",
  iconShape: "rounded",
  banner: "accent",
};

export interface FieldValue {
  /** Present when the field already exists in the database. */
  id?: string;
  name: string;
  type: FieldType;
  value: string;
}

/** Shape submitted by the item editor and accepted by server actions. */
export interface ItemInput {
  name: string;
  description: string;
  icon: string;
  category: Category;
  favorite: boolean;
  appearance: ItemAppearance;
  notes: string;
  fields: FieldValue[];
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
}

/** Full representation used by the detail + editor pages (decrypted). */
export interface ItemDetailData extends ItemCardData {
  notes: string;
  fields: FieldValue[];
}