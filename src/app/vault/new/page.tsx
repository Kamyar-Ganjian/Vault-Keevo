import type { Metadata } from "next";
import { requireUserId } from "@/lib/actions/auth";
import { ItemForm } from "@/components/items/item-form";
import { VaultCore } from "@/components/vault-core";

export const metadata: Metadata = {
  title: "New item — Keevo",
};

export default async function NewItemPage() {
  await requireUserId();
  return (
    <main className="mx-auto max-w-6xl px-4 pb-20 pt-6 sm:px-6">
      <div className="mb-6 flex items-center gap-3">
        <VaultCore size={40} spinning={false} />
        <div>
          <p className="text-[11px] font-medium uppercase tracking-wider text-faint">
            Add to your vault
          </p>
          <p className="text-sm text-muted">
            Give it a name, a look and the details worth keeping.
          </p>
        </div>
      </div>
      <ItemForm mode="create" />
    </main>
  );
}