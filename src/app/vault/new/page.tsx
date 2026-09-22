import type { Metadata } from "next";
import { requireUserId } from "@/lib/actions/auth";
import { ItemForm } from "@/components/items/item-form";

export const metadata: Metadata = {
  title: "New item — Keevo",
};

export default async function NewItemPage() {
  await requireUserId();
  return (
    <main className="pb-20">
      <ItemForm mode="create" />
    </main>
  );
}