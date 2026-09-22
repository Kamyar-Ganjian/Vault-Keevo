import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ItemForm } from "@/components/items/item-form";
import { getItemDetail } from "@/lib/queries";
import { requireUserId } from "@/lib/actions/auth";

export const metadata: Metadata = {
  title: "Edit item — Keevo",
};

export default async function EditItemPage({
  params,
}: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const userId = await requireUserId();
  const item = await getItemDetail(userId, id);
  if (!item) notFound();

  return (
    <main className="pb-20">
      <ItemForm mode="edit" item={item} />
    </main>
  );
}