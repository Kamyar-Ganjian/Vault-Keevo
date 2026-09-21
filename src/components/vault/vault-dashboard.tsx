"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { FiArrowRight, FiKey, FiPlus, FiStar } from "react-icons/fi";
import { ItemCard } from "@/components/vault/item-card";
import type { ItemCardData, Category } from "@/lib/types";
import { CATEGORIES } from "@/lib/types";
import { cn } from "@/lib/utils";

type Tab = "all" | Category;

const GRID = "grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3";

export function VaultDashboard({ items }: { items: ItemCardData[] }) {
  const [tab, setTab] = useState<Tab>("all");

  const favorites = useMemo(() => items.filter((i) => i.favorite), [items]);

  const counts = useMemo(() => {
    const map = new Map<Tab, number>([["all", items.length]]);
    for (const cat of CATEGORIES) {
      map.set(
        cat.value,
        items.filter((i) => i.category === cat.value).length,
      );
    }
    return map;
  }, [items]);

  const visible = useMemo(
    () => (tab === "all" ? items : items.filter((i) => i.category === tab)),
    [items, tab],
  );

  const everythingEmpty = items.length === 0;

  if (everythingEmpty) {
    return (
      <div className="flex flex-col items-center py-24 text-center">
        <div className="grid h-16 w-16 place-items-center rounded-2xl bg-surface shadow-sm ring-1 ring-line">
          <FiKey className="h-7 w-7 text-faint" />
        </div>
        <h2 className="mt-5 text-lg font-semibold tracking-tight text-ink">
          Your vault is empty
        </h2>
        <p className="mt-1.5 max-w-sm text-sm text-muted">
          Keevo is where you keep the things you use every day. Add your first
          item — an account, a server, a domain — and give it fields, a color
          and a shape.
        </p>
        <Link
          href="/vault/new"
          className="mt-6 inline-flex h-11 items-center gap-2 rounded-full px-6 text-sm font-semibold text-white brand-gradient shadow-[0_8px_24px_-8px_rgba(99,102,241,0.7)] transition-transform hover:scale-[1.02] active:scale-[0.99]"
        >
          <FiPlus className="h-4 w-4" />
          Create your first item
        </Link>
      </div>
    );
  }

  return (
    <div>
      <div className="sticky top-14 z-30 -mx-4 bg-app/80 px-4 py-3 backdrop-blur-md sm:-mx-6 sm:px-6">
        <div className="scrollbar-none -mx-2 flex gap-1.5 overflow-x-auto px-2 pb-0.5">
          {(["all", ...CATEGORIES.map((c) => c.value)] as Tab[]).map((value) => {
            const active = tab === value;
            return (
              <button
                key={value}
                onClick={() => setTab(value)}
                className={cn(
                  "relative flex shrink-0 cursor-pointer items-center gap-1.5 rounded-full px-3.5 py-1.5 text-[13px] font-medium transition-colors",
                  active ? "text-white" : "text-muted hover:text-ink",
                )}
              >
{active ? (
                  <motion.span
                    layoutId="vault-tab"
                    className="absolute inset-0 rounded-full brand-gradient shadow-[0_2px_10px_-2px_rgba(99,102,241,0.5)]"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.4 }}
                  />
                ) : null}
                <span className="relative capitalize text-current">
                  {value === "all" ? "All" : CATEGORIES.find((c) => c.value === value)?.label}
                </span>
                <span
                  className={cn(
                    "relative rounded-full px-1.5 py-px text-[11px] tabular-nums",
                    active ? "bg-white/20 text-white" : "bg-surface-2 text-faint",
                  )}
                >
                  {counts.get(value) ?? 0}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="pt-2">
        {tab === "all" && favorites.length > 0 ? (
          <section className="mt-4">
            <h3 className="flex items-center gap-2 text-[13px] font-semibold text-muted">
              <FiStar className="h-3.5 w-3.5 text-amber-400" />
              Favorites
            </h3>
            <div className={cn("mt-2.5", GRID)}>
              {favorites.map((item) => (
                <ItemCard key={item.id} item={item} />
              ))}
            </div>
          </section>
        ) : null}

        <section className={cn(favorites.length > 0 && tab === "all" && "mt-7")}>
          <h3 className="flex items-center gap-2 text-[13px] font-semibold text-muted">
            {(favorites.length > 0 && tab === "all" ? "All items" : "Items").toUpperCase()}
            <span className="h-px flex-1 bg-line" />
            {tab !== "all" ? (
              <button
                onClick={() => setTab("all")}
                className="flex cursor-pointer items-center gap-1 text-[12px] font-medium text-accent"
              >
                View all <FiArrowRight className="h-3 w-3" />
              </button>
            ) : null}
          </h3>

          {visible.length === 0 ? (
            <div className="mt-4 flex flex-col items-center rounded-2xl border border-dashed border-line-strong bg-surface-3/40 py-14 text-center">
              <p className="text-sm font-medium text-muted">
                Nothing here yet
              </p>
              <p className="mt-1 text-xs text-faint">
                Items in this category will show up here.
              </p>
            </div>
          ) : (
            <div className={cn("mt-2.5", GRID)}>
              {visible.map((item) => (
                <ItemCard key={item.id} item={item} />
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}