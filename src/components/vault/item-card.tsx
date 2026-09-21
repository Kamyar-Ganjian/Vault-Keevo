"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import Link from "next/link";
import { FiFile, FiStar } from "react-icons/fi";
import { toast } from "sonner";
import { ItemIcon } from "@/components/items/item-icon";
import { toggleFavoriteAction } from "@/lib/actions/items";
import type { ItemCardData } from "@/lib/types";
import { cn, relativeTime } from "@/lib/utils";

const CATEGORY_LABELS: Record<ItemCardData["category"], string> = {
  account: "Account",
  server: "Server",
  domain: "Domain",
  other: "Other",
};

export function ItemCard({ item }: { item: ItemCardData }) {
  const router = useRouter();
  const [favorite, setFavorite] = useState(item.favorite);
  const [busy, setBusy] = useState(false);

  async function toggleFavorite(event: React.MouseEvent) {
    event.preventDefault();
    event.stopPropagation();
    if (busy) return;
    setBusy(true);
    const previous = favorite;
    setFavorite(!previous);
    const result = await toggleFavoriteAction(item.id);
    if (result.error) {
      setFavorite(previous);
      toast.error(result.error);
    } else if (typeof result.favorite === "boolean") {
      setFavorite(result.favorite);
    }
    setBusy(false);
    router.refresh();
  }

  const hasBanner = item.appearance.banner !== "none";

  return (
    <div className="group relative">
      <Link
        href={`/vault/items/${item.id}`}
        className={cn(
          "block overflow-hidden rounded-xl bg-surface ring-1 ring-line transition-colors duration-200",
          "hover:bg-surface-2/40 hover:ring-line-strong",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40",
        )}
      >
        {hasBanner ? (
          <span
            aria-hidden
            className="block h-[3px] w-full"
            style={{
              background:
                item.appearance.banner === "gradient"
                  ? `linear-gradient(90deg, color-mix(in srgb, ${item.appearance.accent} 85%, transparent), color-mix(in srgb, ${item.appearance.accent} 40%, transparent))`
                  : `color-mix(in srgb, ${item.appearance.accent} 75%, transparent)`,
            }}
          />
        ) : null}

        <div className="p-4">
          <div className="flex items-start gap-3">
            <ItemIcon icon={item.icon} appearance={item.appearance} size="md" />
            <div className="min-w-0 flex-1">
              <h3 className="truncate text-[15px] font-semibold tracking-tight text-ink">
                {item.name}
              </h3>
              <p className="mt-0.5 truncate text-xs text-faint">
                {item.description || CATEGORY_LABELS[item.category]}
              </p>
            </div>
            <button
              onClick={toggleFavorite}
              disabled={busy}
              aria-label={favorite ? "Remove from favorites" : "Add to favorites"}
              aria-pressed={favorite}
              className={cn(
                "-mr-1 -mt-0.5 grid h-7 w-7 shrink-0 cursor-pointer place-items-center rounded-md transition-colors",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40",
                favorite
                  ? "bg-amber-400/15 text-amber-500 ring-1 ring-amber-400/20"
                  : "text-faint hover:bg-surface-2 hover:text-ink sm:opacity-0 sm:group-hover:opacity-100",
              )}
            >
              <FiStar className={cn("h-4 w-4", favorite && "fill-current")} />
            </button>
          </div>

          <div className="mt-3.5 flex items-center gap-2 border-t border-line/60 pt-3">
            <span className="text-[11px] font-medium text-muted">
              {CATEGORY_LABELS[item.category]}
            </span>
            <span className="text-faint">·</span>
            <span className="flex items-center gap-1 text-[11px] text-faint">
              <FiFile className="h-3 w-3" />
              {item.fieldCount} {item.fieldCount === 1 ? "field" : "fields"}
            </span>
            <span className="flex-1" />
            <span className="text-[11px] text-faint">
              {relativeTime(item.updatedAt)}
            </span>
          </div>
        </div>
      </Link>
    </div>
  );
}