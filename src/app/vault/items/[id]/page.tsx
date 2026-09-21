import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ItemDetail } from "@/components/items/item-detail";
import { getItemDetail } from "@/lib/queries";
import { requireUserId } from "@/lib/actions/auth";

export async function generateMetadata({
  params,
}: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const userId = await requireUserId();
  const item = await getItemDetail(userId, id);
  return { title: item ? `${item.name} — Keevo` : "Item — Keevo" };
}

export default async function ItemPage({
  params,
}: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const userId = await requireUserId();
  const item = await getItemDetail(userId, id);
  if (!item) notFound();

  return <ItemDetail item={item} />;
}