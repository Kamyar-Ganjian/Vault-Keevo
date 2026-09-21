"use client";

import Link from "next/link";
import { FiChevronRight, FiFile, FiStar } from "react-icons/fi";
import { ItemIcon } from "@/components/items/item-icon";
import { ItemBanner } from "@/components/items/item-banner";
import { CategoryBadge } from "@/components/ui/category-badge";
import { useFavorite } from "@/hooks/use-favorite";
import { categoryLabel } from "@/lib/types";
import type { ItemCardData } from "@/lib/types";
import { cn, relativeTime } from "@/lib/utils";

export function ItemCard({ item }: { item: ItemCardData }) {
  const { favorite, busy, toggle } = useFavorite(item.id, item.favorite);

  function toggleFavorite(event: React.MouseEvent) {
    event.preventDefault();
    event.stopPropagation();
    void toggle();
  }

  return (
    <div className="group relative">
      <Link
        href={`/vault/items/${item.id}`}
        className={cn(
          "relative block overflow-hidden rounded-xl bg-surface ring-1 ring-line transition-colors duration-200",
          "hover:bg-surface-2/50 hover:ring-line-strong",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40",
        )}
      >
        <span
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-200 group-hover:opacity-100"
          style={{
            background:
              "radial-gradient(120% 90% at 0% 0%, color-mix(in srgb, var(--accent) 7%, transparent), transparent 55%)",
          }}
        />

        <ItemBanner appearance={item.appearance} className="relative" />

        <div className="relative p-4">
          <div className="flex items-start gap-3">
            <ItemIcon
              icon={item.icon}
              appearance={item.appearance}
              size="md"
              className="transition-transform duration-200 group-hover:-translate-y-px group-hover:scale-[1.03]"
            />
            <div className="min-w-0 flex-1">
              <h3 className="truncate text-[15px] font-semibold tracking-tight text-ink">
                {item.name}
              </h3>
              <p className="mt-0.5 truncate text-xs text-faint">
                {item.description || categoryLabel(item.category)}
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
            <CategoryBadge category={item.category} />
            <span className="flex items-center gap-1 text-[11px] text-faint">
              <FiFile className="h-3 w-3" />
              {item.fieldCount}
            </span>
            <span className="flex-1" />
            <span className="text-[11px] text-faint">
              {relativeTime(item.updatedAt)}
            </span>
            <FiChevronRight className="h-3.5 w-3.5 shrink-0 text-faint opacity-0 transition-opacity duration-200 group-hover:opacity-100" />
          </div>
        </div>
      </Link>
    </div>
  );
}