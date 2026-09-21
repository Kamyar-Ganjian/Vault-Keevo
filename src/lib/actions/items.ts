"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { encryptSecret } from "@/lib/secrets";
import { isSensitiveType } from "@/lib/field-types";
import { itemSchema, type ItemInput } from "@/lib/schemas";
import { searchVaultItems } from "@/lib/queries";
import { requireUserId } from "./auth";
import type { ItemCardData } from "@/lib/types";

type ActionResult = { error?: string; id?: string };

function assertValid(input: unknown): ItemInput {
  const parsed = itemSchema.safeParse(input);
  if (!parsed.success) {
    throw new Error(parsed.error.issues[0]?.message ?? "Invalid item data.");
  }
  return parsed.data;
}

function serializeFields(fields: ItemInput["fields"]) {
  return fields.map((field, index) => {
    const raw = field.value ?? "";
    const value = isSensitiveType(field.type) ? encryptSecret(raw) : raw;
    return {
      name: field.name,
      type: field.type,
      value,
      position: index,
    };
  });
}

function itemData(input: ItemInput) {
  return {
    name: input.name,
    description: input.description || null,
    icon: input.icon || null,
    category: input.category,
    favorite: input.favorite,
    appearance: JSON.stringify(input.appearance),
    notes: input.notes || null,
  };
}

export async function createItemAction(input: unknown): Promise<ActionResult> {
  const userId = await requireUserId();
  const valid = assertValid(input);

  try {
    const item = await prisma.item.create({
      data: {
        userId,
        ...itemData(valid),
        fields: { create: serializeFields(valid.fields) },
      },
    });
    revalidatePath("/vault");
    return { id: item.id };
  } catch {
    return { error: "Could not create the item." };
  }
}

export async function updateItemAction(
  id: string,
  input: unknown,
): Promise<ActionResult> {
  const userId = await requireUserId();
  if (!id) return { error: "Missing item id." };
  const valid = assertValid(input);

  const item = await prisma.item.findFirst({ where: { id, userId } });
  if (!item) return { error: "Item not found." };

  try {
    await prisma.$transaction([
      prisma.field.deleteMany({ where: { itemId: id } }),
      prisma.item.update({
        where: { id },
        data: {
          ...itemData(valid),
          fields: { create: serializeFields(valid.fields) },
        },
      }),
    ]);
    revalidatePath("/vault");
    revalidatePath(`/vault/items/${id}`, "page");
    return { id };
  } catch {
    return { error: "Could not save the item." };
  }
}

export async function deleteItemAction(id: string): Promise<ActionResult> {
  const userId = await requireUserId();
  const item = await prisma.item.findFirst({ where: { id, userId } });
  if (!item) return { error: "Item not found." };

  try {
    await prisma.item.delete({ where: { id } });
    revalidatePath("/vault");
    return {};
  } catch {
    return { error: "Could not delete the item." };
  }
}

export async function duplicateItemAction(id: string): Promise<ActionResult> {
  const userId = await requireUserId();
  const item = await prisma.item.findFirst({
    where: { id, userId },
    include: { fields: { orderBy: { position: "asc" } } },
  });
  if (!item) return { error: "Item not found." };

  try {
    const copy = await prisma.item.create({
      data: {
        userId,
        name: `${item.name} — Copy`,
        description: item.description,
        icon: item.icon,
        category: item.category,
        favorite: false,
        appearance: item.appearance,
        notes: item.notes,
        fields: {
          create: item.fields.map((field) => ({
            name: field.name,
            type: field.type,
            value: field.value,
            position: field.position,
          })),
        },
      },
    });
    revalidatePath("/vault");
    return { id: copy.id };
  } catch {
    return { error: "Could not duplicate the item." };
  }
}

export async function toggleFavoriteAction(
  id: string,
): Promise<ActionResult & { favorite?: boolean }> {
  const userId = await requireUserId();
  const item = await prisma.item.findFirst({ where: { id, userId } });
  if (!item) return { error: "Item not found." };

  try {
    const updated = await prisma.item.update({
      where: { id },
      data: { favorite: !item.favorite },
    });
    revalidatePath("/vault");
    revalidatePath(`/vault/items/${id}`, "page");
    return { id, favorite: updated.favorite };
  } catch {
    return { error: "Could not update the item." };
  }
}

export async function searchItemsAction(
  query: string,
): Promise<ItemCardData[]> {
  const userId = await requireUserId();
  try {
    return await searchVaultItems(userId, query);
  } catch {
    return [];
  }
}