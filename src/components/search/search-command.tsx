"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { FiArrowRight, FiSearch, FiStar } from "react-icons/fi";
import { searchItemsAction } from "@/lib/actions/items";
import type { ItemCardData } from "@/lib/types";
import { cn } from "@/lib/utils";
import { Kbd, Spinner } from "@/components/ui/kbd";
import { ItemIcon } from "@/components/items/item-icon";

export function SearchCommand({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const close = useCallback(() => onOpenChange(false), [onOpenChange]);

  useEffect(() => {
    if (!open) return;
    const handler = (event: KeyboardEvent) => {
      if (event.key === "Escape") close();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open, close]);

  return (
    <AnimatePresence>
      {open ? (
        <SearchPalette onClose={close} />
      ) : null}
    </AnimatePresence>
  );
}

function SearchPalette({ onClose }: { onClose: () => void }) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<ItemCardData[]>([]);
  const [active, setActive] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const runSearch = useCallback(async (q: string, cancelled: () => boolean) => {
    const found = await searchItemsAction(q);
    if (!cancelled()) {
      setResults(found);
      setActive(0);
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let cancelled = false;
    const timer = setTimeout(() => runSearch(query, () => cancelled), 140);
    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [query, runSearch]);

  function onChange(event: React.ChangeEvent<HTMLInputElement>) {
    setLoading(true);
    setQuery(event.target.value);
  }

  function openItem(item: ItemCardData) {
    onClose();
    router.push(`/vault/items/${item.id}`);
  }

  function onKeyDown(event: React.KeyboardEvent) {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setActive((a) => Math.min(a + 1, results.length - 1));
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setActive((a) => Math.max(a - 1, 0));
    } else if (event.key === "Enter") {
      event.preventDefault();
      const item = results[active];
      if (item) openItem(item);
    }
  }

  const showFavoritesHint = query.trim() === "";

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center p-4 pt-[12vh]"
      role="dialog"
      aria-modal="true"
      aria-label="Search your vault"
    >
      <motion.div
        className="absolute inset-0 bg-black/40 backdrop-blur-[2px]"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.15 }}
        onClick={onClose}
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.97, y: -8 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.98, y: -6 }}
        transition={{ type: "spring", duration: 0.32, bounce: 0.16 }}
        className="relative w-full max-w-xl overflow-hidden rounded-2xl bg-surface-4/90 shadow-elev ring-1 ring-line-strong backdrop-blur-2xl"
      >
        <div className="flex items-center gap-3 border-b border-line px-4">
          {loading ? (
            <Spinner className="text-faint" />
          ) : (
            <FiSearch className="h-4 w-4 shrink-0 text-faint" />
          )}
          <input
            ref={inputRef}
            value={query}
            onChange={onChange}
            onKeyDown={onKeyDown}
            placeholder="Search items, fields, notes…"
            className="h-13 w-full bg-transparent py-4 text-[15px] text-ink outline-none placeholder:text-faint"
            autoComplete="off"
            spellCheck={false}
          />
          <button
            onClick={onClose}
            aria-label="Close search"
            className="mb-px cursor-pointer rounded-md border border-line bg-surface-2 px-1.5 py-0.5 font-mono text-[11px] text-faint transition-colors hover:text-muted"
          >
            ESC
          </button>
        </div>

        <div className="max-h-[46vh] overflow-y-auto scrollbar-thin p-1.5">
          {showFavoritesHint && results.length > 0 ? (
            <div className="flex items-center gap-1.5 px-3 pb-1 pt-2 text-xs font-medium text-faint">
              <FiStar className="h-3 w-3" />
              Favorites
            </div>
          ) : null}

          {results.length === 0 && !loading ? (
            <div className="px-4 py-10 text-center">
              <p className="text-sm text-muted">
                {showFavoritesHint
                  ? "No favorites yet."
                  : "No items match your search."}
              </p>
              {!showFavoritesHint ? (
                <p className="mt-1 text-xs text-faint">
                  Try the item name, a field name, or something in your notes.
                </p>
              ) : null}
            </div>
          ) : (
            <ul>
              {results.map((item, index) => (
                <li key={item.id}>
                  <motion.button
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: Math.min(index * 0.025, 0.2) }}
                    onMouseEnter={() => setActive(index)}
                    onClick={() => openItem(item)}
                    className={cn(
                      "group flex w-full cursor-pointer items-center gap-3 rounded-xl px-3 py-2.5 text-left transition-colors",
                      index === active
                        ? "bg-accent-soft ring-1 ring-inset ring-accent/20"
                        : "hover:bg-surface-2/60",
                    )}
                  >
                    <ItemIcon icon={item.icon} appearance={item.appearance} size="sm" />
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm font-medium text-ink">
                        {item.name}
                      </span>
                      <span className="mt-0.5 flex items-center gap-1.5 text-xs text-faint">
                        <span className="capitalize">{item.category}</span>
                        {item.fieldCount ? (
                          <>
                            <span aria-hidden>·</span>
                            <span>
                              {item.fieldCount}{" "}
                              {item.fieldCount === 1 ? "field" : "fields"}
                            </span>
                          </>
                        ) : null}
                      </span>
                    </span>
                    <FiArrowRight className="h-4 w-4 shrink-0 text-faint opacity-0 transition-opacity group-hover:opacity-100" />
                  </motion.button>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="flex items-center gap-4 border-t border-line bg-surface-2/60 px-4 py-2.5 text-[11px] text-faint">
          <span className="flex items-center gap-1.5">
            <Kbd>↑</Kbd>
            <Kbd>↓</Kbd> navigate
          </span>
          <span className="flex items-center gap-1.5">
            <Kbd>↵</Kbd> open
          </span>
          <span className="flex items-center gap-1.5">
            <Kbd>esc</Kbd> close
          </span>
        </div>
      </motion.div>
    </div>
  );
}