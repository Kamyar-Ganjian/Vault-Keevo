import type { Metadata } from "next";
import Link from "next/link";
import { FiArchive, FiPlus } from "react-icons/fi";
import { getVaultItems } from "@/lib/queries";
import { requireUserId } from "@/lib/actions/auth";
import { auth } from "@/lib/auth";
import { VaultDashboard } from "@/components/vault/vault-dashboard";
import { Button } from "@/components/ui/button";
import { pluralize } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Vault — Keevo",
};

function greeting(firstName: string | null) {
  const hour = new Date().getHours();
  const period =
    hour < 5 ? "Good night" : hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";
  return firstName ? `${period}, ${firstName}` : "Your vault";
}

export default async function VaultPage() {
  const userId = await requireUserId();
  const [items, session] = await Promise.all([getVaultItems(userId), auth()]);
  const firstName = (session?.user?.name ?? "").split(/\s+/).find(Boolean) ?? null;

  return (
    <main className="mx-auto max-w-6xl px-4 pb-16 pt-8 sm:px-6 lg:pt-12">
      <div className="flex flex-wrap items-end justify-between gap-x-4 gap-y-3">
        <div>
          <p className="inline-flex items-center gap-1.5 text-xs font-medium text-muted">
            <span className="h-1.5 w-1.5 rounded-full bg-accent" />
            {greeting(firstName)}
          </p>
          <h1 className="mt-1.5 text-[28px] font-semibold leading-tight tracking-tight text-ink sm:text-[32px]">
            Your vault
          </h1>
        </div>
        <div className="flex items-center gap-2.5">
          <p className="inline-flex items-center gap-2 rounded-full bg-surface px-3.5 py-2 text-[13px] font-medium text-muted ring-1 ring-line">
            <FiArchive className="h-4 w-4 text-faint" />
            {pluralize(items.length, "item")}
          </p>
          <Button asChild>
            <Link href="/vault/new">
              <FiPlus className="h-4 w-4" />
              New item
            </Link>
          </Button>
        </div>
      </div>
      <VaultDashboard items={items} />
    </main>
  );
}