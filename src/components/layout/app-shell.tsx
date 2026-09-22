"use client";

import { motion } from "framer-motion";
import { useEffect, useState, type ReactNode } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { FiArchive, FiPlus, FiSearch } from "react-icons/fi";
import { Logo } from "@/components/layout/logo";
import { ThemeMenu } from "@/components/layout/theme-menu";
import { UserMenu } from "@/components/layout/user-menu";
import { SearchCommand } from "@/components/search/search-command";
import { VaultAtmosphere } from "@/components/vault-core";
import { Kbd } from "@/components/ui/kbd";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

function SidebarLink({
  href,
  icon,
  children,
  active,
}: {
  href: string;
  icon: ReactNode;
  children: ReactNode;
  active?: boolean;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
        active
          ? "bg-accent-soft text-ink"
          : "text-muted hover:bg-surface-2 hover:text-ink",
      )}
    >
      <span className="grid h-5 w-5 shrink-0 place-items-center">{icon}</span>
      <span className="flex-1">{children}</span>
    </Link>
  );
}

export function AppShell({
  user,
  children,
}: {
  user: { name: string | null; email: string };
  children: ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [searchOpen, setSearchOpen] = useState(false);
  const vaultActive = pathname === "/vault" || pathname.startsWith("/vault/");

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setSearchOpen((open) => !open);
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  return (
    <div className="flex min-h-dvh">
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-60 flex-col border-r border-line bg-sidebar lg:flex">
        <div className="flex h-16 shrink-0 items-center border-b border-line px-5">
          <Logo />
        </div>

        <nav className="flex-1 space-y-0.5 overflow-y-auto px-3 py-4">
          <SidebarLink href="/vault" active={vaultActive} icon={<FiArchive className="h-[19px] w-[19px]" />}>
            Vault
          </SidebarLink>
          <button
            onClick={() => setSearchOpen(true)}
            className={cn(
              "flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-left text-sm font-medium transition-colors",
              "text-muted hover:bg-surface-2 hover:text-ink",
            )}
          >
            <FiSearch className="h-[19px] w-[19px]" />
            <span className="flex-1">Search</span>
            <Kbd>⌘K</Kbd>
          </button>
          <SidebarLink href="/vault/new" icon={<FiPlus className="h-[19px] w-[19px]" />}>
            New item
          </SidebarLink>
        </nav>

        <div className="shrink-0 space-y-0.5 border-t border-line px-3 py-3">
          <ThemeMenu full />
          <UserMenu full name={user.name} email={user.email} />
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col lg:pl-60">
        <header className="sticky top-0 z-40 h-14 border-b border-line bg-app lg:hidden">
          <div className="mx-auto flex h-14 max-w-6xl items-center gap-1.5 px-3.5 sm:gap-2 sm:px-6">
            <Logo />

            <div className="flex-1" />

            <button
              onClick={() => setSearchOpen(true)}
              aria-label="Search your vault"
              className="flex h-9 w-9 shrink-0 cursor-pointer items-center justify-center rounded-lg border border-line bg-surface-2 text-faint transition-colors hover:border-line-strong hover:text-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40 sm:w-56 sm:px-3"
            >
              <FiSearch className="h-4 w-4" />
              <span className="hidden flex-1 text-left sm:inline">Search vault…</span>
              <Kbd className="hidden sm:inline-flex">⌘K</Kbd>
            </button>

            <Button
              onClick={() => router.push("/vault/new")}
              size="icon-sm"
              aria-label="Add item"
              variant="primary"
              className="group"
            >
              <FiPlus className="h-4 w-4 transition-transform duration-200 group-hover:rotate-90" />
            </Button>

            <ThemeMenu />
            <UserMenu name={user.name} email={user.email} />
          </div>
        </header>

        <main className="relative flex-1">
          <VaultAtmosphere />
          <div className="relative">
            <motion.div
              key={pathname}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.18, ease: "easeOut" }}
            >
              {children}
            </motion.div>
          </div>
        </main>
      </div>

      <SearchCommand open={searchOpen} onOpenChange={setSearchOpen} />
    </div>
  );
}