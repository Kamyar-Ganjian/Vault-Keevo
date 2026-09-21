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
    <main className="mx-auto max-w-6xl px-4 pb-16 pt-8 sm:px-6 lg:pt-12">
      <div className="flex flex-wrap items-end justify-between gap-x-4 gap-y-3">
        <div>
          <p className="inline-flex items-center gap-1.5 text-xs font-medium text-muted">
            <span className="h-1.5 w-1.5 rounded-full bg-accent" />
            Keevo vault
          </p>
          <h1 className="mt-1.5 text-[28px] font-semibold leading-tight tracking-tight text-ink sm:text-[32px]">
            Your items
          </h1>
          <p className="mt-1.5 text-sm text-muted">
            Everything you use every day — kept close and safe.
          </p>
        </div>
        <p className="inline-flex items-center gap-2 rounded-full bg-surface px-3.5 py-2 text-[13px] font-medium text-muted ring-1 ring-line">
          {items.length} {items.length === 1 ? "item" : "items"}
        </p>
      </div>
      <VaultDashboard items={items} />
    </main>
  );
}