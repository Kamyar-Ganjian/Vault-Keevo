"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { FiArchive, FiArrowRight, FiPlus, FiStar } from "react-icons/fi";
import { ItemCard } from "@/components/vault/item-card";
import { VaultCore } from "@/components/vault-core";
import { SectionHeading } from "@/components/ui/section";
import type { ItemCardData, Category } from "@/lib/types";
import { CATEGORIES } from "@/lib/types";
import { cn } from "@/lib/utils";

type Tab = "all" | Category;

const GRID = "grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3";

export function VaultDashboard({ items }: { items: ItemCardData[] }) {
  const [tab, setTab] = useState<Tab>("all");

  const favorites = items.filter((i) => i.favorite);
  const visible = tab === "all" ? items : items.filter((i) => i.category === tab);
  const counts = new Map<Tab, number>([
    ["all", items.length],
    ...CATEGORIES.map((c) => [c.value, items.filter((i) => i.category === c.value).length] as [Category, number]),
  ]);

  const everythingEmpty = items.length === 0;

  if (everythingEmpty) {
    return (
      <div className="flex flex-col items-center py-24 text-center">
        <VaultCore size={92} />
        <h2 className="mt-7 text-xl font-semibold tracking-tight text-ink">
          Your vault is empty
        </h2>
        <p className="mt-2 max-w-sm text-sm leading-relaxed text-muted">
          Start adding the things you don&apos;t want to lose — an account, a
          server, a domain. Give each one a name and a place.
        </p>
        <Link
          href="/vault/new"
          className="mt-7 inline-flex h-10 items-center gap-2 rounded-lg bg-accent px-5 text-sm font-medium text-accent-fg transition-colors hover:bg-accent-strong"
        >
          <FiPlus className="h-4 w-4" />
          Add your first item
        </Link>
      </div>
    );
  }

  return (
    <div>
      <div className="sticky top-14 z-30 -mx-4 mb-1 border-b border-line bg-app px-4 py-2.5 lg:top-0 sm:-mx-6 sm:px-6">
        <div className="scrollbar-none -mx-2 flex gap-1 overflow-x-auto px-2 py-1">
          {(["all", ...CATEGORIES.map((c) => c.value)] as Tab[]).map((value) => {
            const active = tab === value;
            return (
              <button
                key={value}
                onClick={() => setTab(value)}
                className={cn(
                  "relative flex shrink-0 cursor-pointer items-center gap-1.5 rounded-lg px-3 py-1.5 text-[13px] font-medium transition-colors",
                  active ? "text-ink" : "text-muted hover:text-ink",
                )}
              >
                {active ? (
                  <motion.span
                    layoutId="vault-tab"
                    className="absolute inset-0 rounded-lg bg-accent-soft ring-1 ring-accent/15"
                    transition={{ type: "spring", bounce: 0.15, duration: 0.35 }}
                  />
                ) : null}
                <span className="relative capitalize text-current">
                  {value === "all" ? "All" : CATEGORIES.find((c) => c.value === value)?.label}
                </span>
                <span
                  className={cn(
                    "relative rounded-md px-1.5 py-px text-[11px] tabular-nums",
                    active ? "bg-accent/15 text-accent-strong" : "text-faint",
                  )}
                >
                  {counts.get(value) ?? 0}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="pt-4">
        {tab === "all" && favorites.length > 0 ? (
          <section>
            <h3 className="flex items-center gap-2 text-[13px] font-semibold tracking-wide text-muted">
              <FiStar className="h-3.5 w-3.5 text-amber-500" />
              Favorites
            </h3>
            <div className={cn("mt-3", GRID)}>
              {favorites.map((item, i) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    delay: Math.min(i * 0.04, 0.3),
                    duration: 0.35,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                >
                  <ItemCard item={item} />
                </motion.div>
              ))}
            </div>
          </section>
        ) : null}

        <section className={cn(favorites.length > 0 && tab === "all" && "mt-8")}>
          <SectionHeading
            as="h3"
            title={favorites.length > 0 && tab === "all" ? "All items" : "Items"}
            action={
              tab !== "all" ? (
                <button
                  onClick={() => setTab("all")}
                  className="flex cursor-pointer items-center gap-1 text-[12px] font-medium text-accent transition-opacity hover:opacity-80"
                >
                  View all <FiArrowRight className="h-3 w-3" />
                </button>
              ) : null
            }
          />

          {visible.length === 0 ? (
            <div className="mt-4 flex flex-col items-center rounded-xl border border-dashed border-line-strong bg-surface-3/40 py-14 text-center">
              <span className="grid h-10 w-10 place-items-center rounded-lg bg-surface-3 text-faint ring-1 ring-line">
                <FiArchive className="h-4.5 w-4.5" />
              </span>
              <p className="mt-3 text-sm font-medium text-muted">
                Nothing here yet
              </p>
              <p className="mt-1 text-xs text-faint">
                Items in this category will show up here.
              </p>
            </div>
          ) : (
            <div className={cn("mt-3", GRID)}>
              {visible.map((item, i) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    delay: Math.min(i * 0.04, 0.3),
                    duration: 0.35,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                >
                  <ItemCard item={item} />
                </motion.div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}