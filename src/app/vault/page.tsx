import type { Metadata } from "next";
import Link from "next/link";
import { FiArchive, FiPlus } from "react-icons/fi";
import { getVaultItems } from "@/lib/queries";
import { requireUserId } from "@/lib/actions/auth";
import { auth } from "@/lib/auth";
import { VaultDashboard } from "@/components/vault/vault-dashboard";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
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
    <main className="pb-16">
      <div className="hidden border-b border-line/80 bg-app lg:flex">
        <Container className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2 py-4">
          <div>
            <p className="inline-flex items-center gap-1.5 text-md font-medium text-muted">
              <span className="h-1.5 w-1.5 rounded-full bg-accent" />
              {greeting(firstName)}
            </p>

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
        </Container>
      </div>
      <VaultDashboard items={items} />
    </main>
  );
}