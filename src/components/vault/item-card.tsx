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
          "block overflow-hidden rounded-2xl border border-line bg-surface transition-all duration-150",
          "hover:-translate-y-0.5 hover:border-line-strong hover:shadow-[0_8px_24px_-12px_rgba(0,0,0,0.18)]",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/60",
        )}
      >
        {hasBanner ? (
          <span
            aria-hidden
            className="block h-1 w-full"
            style={{
              background:
                item.appearance.banner === "gradient"
                  ? `linear-gradient(90deg, color-mix(in srgb, ${item.appearance.accent} 90%, transparent), color-mix(in srgb, ${item.appearance.accent} 55%, transparent))`
                  : `color-mix(in srgb, ${item.appearance.accent} 85%, transparent)`,
            }}
          />
        ) : null}

        <div className="p-4 pt-3.5">
          <div className="flex items-start gap-3 pr-2">
            <ItemIcon icon={item.icon} appearance={item.appearance} size="md" />
            <div className="min-w-0 flex-1">
              <h3 className="truncate text-[15px] font-semibold tracking-tight text-ink">
                {item.name}
              </h3>
              <p className="mt-0.5 truncate text-xs text-faint">
                {item.description || CATEGORY_LABELS[item.category]}
              </p>
            </div>
          </div>

          <div className="mt-3.5 flex items-center gap-2">
            <span className="rounded-full border border-line bg-surface-2 px-2 py-0.5 text-[11px] font-medium text-muted">
              {CATEGORY_LABELS[item.category]}
            </span>
            <span className="flex items-center gap-1 text-[11px] text-faint">
              {item.fieldCount > 0 ? (
                <>
                  <FiFile className="h-3 w-3" />
                  {item.fieldCount}
                </>
              ) : null}
            </span>
            <span className="flex-1" />
            <span className="text-[11px] text-faint">
              {relativeTime(item.updatedAt)}
            </span>
          </div>
        </div>
      </Link>

      <button
        onClick={toggleFavorite}
        disabled={busy}
        aria-label={favorite ? "Remove from favorites" : "Add to favorites"}
        aria-pressed={favorite}
        className={cn(
          "absolute right-2.5 top-2.5 z-10 grid h-8 w-8 cursor-pointer place-items-center rounded-full transition-all",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/60",
          favorite
            ? "text-amber-400"
            : "text-faint hover:text-muted sm:opacity-0 sm:group-hover:opacity-100",
        )}
      >
        <FiStar
          className={cn("h-[17px] w-[17px]", favorite && "fill-current")}
        />
      </button>
    </div>
  );
}