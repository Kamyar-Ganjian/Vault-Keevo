"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState, type ReactNode } from "react";
import { usePathname, useRouter } from "next/navigation";
import { FiPlus, FiSearch } from "react-icons/fi";
import { Logo } from "@/components/layout/logo";
import { ThemeMenu } from "@/components/layout/theme-menu";
import { UserMenu } from "@/components/layout/user-menu";
import { SearchCommand } from "@/components/search/search-command";
import { Kbd } from "@/components/ui/kbd";
import { Button } from "@/components/ui/button";

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
    <div className="flex min-h-dvh flex-col">
      <header className="sticky top-0 z-40 border-b border-line/70 bg-app/80 backdrop-blur-md">
        <div className="mx-auto flex h-14 max-w-6xl items-center gap-1.5 px-3.5 sm:gap-2 sm:px-6">
          <Logo hideLabelOnMobile />

          <div className="flex-1" />

          <button
            onClick={() => setSearchOpen(true)}
            aria-label="Search your vault"
            className="flex h-9 w-9 shrink-0 cursor-pointer items-center justify-center gap-2 rounded-lg border border-line bg-surface-2 px-0 text-sm text-faint transition-colors hover:border-line-strong hover:text-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/60 sm:w-56 sm:justify-between sm:px-3"
          >
            <FiSearch className="h-4 w-4" />
            <span className="hidden flex-1 text-left sm:inline">Search vault…</span>
            <Kbd className="hidden sm:inline-flex">⌘K</Kbd>
          </button>

          <Button
            onClick={() => router.push("/vault/new")}
            size="icon-sm"
            aria-label="Add item"
            className="text-muted"
            variant="secondary"
          >
            <FiPlus className="h-4 w-4" />
          </Button>

          <ThemeMenu />
          <UserMenu name={user.name} email={user.email} />
        </div>
      </header>

      <div className="relative flex-1">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={pathname}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </div>

      <SearchCommand open={searchOpen} onOpenChange={setSearchOpen} />
    </div>
  );
}