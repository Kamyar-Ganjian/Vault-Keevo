import type { Metadata } from "next";
import { requireUserId } from "@/lib/actions/auth";
import { ItemForm } from "@/components/items/item-form";

export const metadata: Metadata = {
  title: "New item — Keevo",
};

export default async function NewItemPage() {
  await requireUserId();
  return (
    <main className="mx-auto max-w-6xl px-4 pb-20 pt-6 sm:px-6">
      <ItemForm mode="create" />
    </main>
  );
}