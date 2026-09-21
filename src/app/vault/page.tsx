import { Metadata } from "next";
import { getVaultItems } from "@/lib/queries";
import { requireUserId } from "@/lib/actions/auth";
import { VaultDashboard } from "@/components/vault/vault-dashboard";

export const metadata: Metadata = {
  title: "Vault — Keevo",
};

export default async function VaultPage() {
  const userId = await requireUserId();
  const items = await getVaultItems(userId);

  return (
    <main className="mx-auto max-w-6xl px-4 pb-16 pt-6 sm:px-6">
      <div className="flex items-baseline gap-3">
        <h1 className="text-xl font-semibold tracking-tight text-ink">
          Your vault
        </h1>
        <p className="text-sm text-faint">
          {items.length} {items.length === 1 ? "item" : "items"}
        </p>
      </div>
      <VaultDashboard items={items} />
    </main>
  );
}