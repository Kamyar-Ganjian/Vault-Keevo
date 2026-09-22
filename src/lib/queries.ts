import "server-only";
import { prisma } from "@/lib/db";
import { decryptSecret, isEncrypted } from "@/lib/secrets";
import {
  getFieldTypeMeta,
  isSensitiveType,
  previewText,
} from "@/lib/field-types";
import {
  CATEGORY_VALUES,
  DEFAULT_APPEARANCE,
  type ItemAppearance,
  type ItemCardData,
  type ItemDetailData,
} from "@/lib/types";

function parseAppearance(raw: string | null | undefined): ItemAppearance {
  if (!raw) return DEFAULT_APPEARANCE;
  try {
    const parsed = JSON.parse(raw) as { accent?: unknown };
    const accent =
      typeof parsed.accent === "string" && /^#/.test(parsed.accent)
        ? parsed.accent
        : DEFAULT_APPEARANCE.accent;
    return { accent };
  } catch {
    return DEFAULT_APPEARANCE;
  }
}

export async function getVaultItems(userId: string): Promise<ItemCardData[]> {
  const items = await prisma.item.findMany({
    where: { userId },
    orderBy: { updatedAt: "desc" },
    include: {
      _count: { select: { fields: true } },
      fields: {
        select: { name: true, type: true, value: true },
        orderBy: { position: "asc" },
        take: 3,
      },
    },
  });
  return items.map((item) => toCardData(item));
}

function toCardData(item: {
  id: string;
  name: string;
  description: string | null;
  icon: string | null;
  category: string;
  favorite: boolean;
  appearance: string | null;
  createdAt: Date;
  updatedAt: Date;
  _count: { fields: number };
  fields: { name: string; type: string; value: string | null }[];
}): ItemCardData {
  return {
    id: item.id,
    name: item.name,
    description: item.description ?? "",
    icon: item.icon ?? "",
    category: validCategory(item.category),
    favorite: item.favorite,
    appearance: parseAppearance(item.appearance),
    fieldCount: item._count.fields,
    createdAt: item.createdAt.toISOString(),
    updatedAt: item.updatedAt.toISOString(),
    previewFields: item.fields.map((field) => ({
      name: field.name,
      type: field.type,
      value: previewText(field.type, field.value ?? ""),
    })),
  };
}

export async function getItemDetail(
  userId: string,
  itemId: string,
): Promise<ItemDetailData | null> {
  const item = await prisma.item.findFirst({
    where: { id: itemId, userId },
    include: {
      fields: { orderBy: { position: "asc" } },
    },
  });
  if (!item) return null;

  return {
    id: item.id,
    name: item.name,
    description: item.description ?? "",
    icon: item.icon ?? "",
    category: validCategory(item.category),
    favorite: item.favorite,
    appearance: parseAppearance(item.appearance),
    fieldCount: item.fields.length,
    createdAt: item.createdAt.toISOString(),
    updatedAt: item.updatedAt.toISOString(),
    notes: item.notes ?? "",
    previewFields: item.fields.slice(0, 3).map((field) => ({
      name: field.name,
      type: validFieldType(field.type),
      value: previewText(field.type, field.value ?? ""),
    })),
    fields: item.fields.map((field) => ({
      id: field.id,
      name: field.name,
      type: validFieldType(field.type),
      value: sensitiveValue(field),
    })),
  };
}

function validCategory(value: string) {
  return (CATEGORY_VALUES as readonly string[]).includes(value)
    ? (value as ItemCardData["category"])
    : "other";
}

function validFieldType(value: string) {
  return getFieldTypeMeta(value) ? (value as ItemDetailData["fields"][number]["type"]) : "text";
}

function sensitiveValue(field: {
  type: string;
  value: string | null;
}): string {
  const value = field.value ?? "";
  if (isSensitiveType(field.type)) {
    return isEncrypted(value) ? decryptSecret(value) : value;
  }
  return value;
}

export async function searchVaultItems(
  userId: string,
  query: string,
  limit = 20,
): Promise<ItemCardData[]> {
  const trimmed = query.trim();
  const items = await prisma.item.findMany({
    where: {
      userId,
      ...(trimmed
        ? {
            OR: [
              { name: { contains: trimmed } },
              { description: { contains: trimmed } },
              { notes: { contains: trimmed } },
              { fields: { some: { name: { contains: trimmed } } } },
            ],
          }
        : { favorite: true }),
    },
    orderBy: { updatedAt: "desc" },
    take: limit,
    include: {
      _count: { select: { fields: true } },
      fields: {
        select: { name: true, type: true, value: true },
        orderBy: { position: "asc" },
        take: 3,
      },
    },
  });
  return items.map(toCardData);
}