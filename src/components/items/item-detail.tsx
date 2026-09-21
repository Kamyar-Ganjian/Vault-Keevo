"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { FiCalendar, FiCopy, FiEdit2, FiMoreHorizontal, FiPlus, FiStar, FiTrash2 } from "react-icons/fi";
import { toast } from "sonner";

import Link from "next/link";
import { ItemIcon } from "@/components/items/item-icon";
import { FieldDisplay } from "@/components/items/field-display";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown";
import {
  Dialog,
} from "@/components/ui/dialog";
import {
  deleteItemAction,
  duplicateItemAction,
  toggleFavoriteAction,
} from "@/lib/actions/items";
import type { ItemDetailData } from "@/lib/types";
import { cn, formatDate } from "@/lib/utils";

export function ItemDetail({ item }: { item: ItemDetailData }) {
  const router = useRouter();
  const [favorite, setFavorite] = useState(item.favorite);
  const [forceReveal, setForceReveal] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [busy, setBusy] = useState(false);

  const hasSensitive = item.fields.some(
    (f) => f.type === "secret" || f.type === "code",
  );

  function toggleFavorite() {
    setFavorite((f) => !f);
    toggleFavoriteAction(item.id).then((result) => {
      if (result.error) toast.error(result.error);
      else setFavorite(Boolean(result.favorite));
      router.refresh();
    });
  }

  async function duplicate() {
    if (busy) return;
    setBusy(true);
    const result = await duplicateItemAction(item.id);
    setBusy(false);
    if (result.error) {
      toast.error(result.error);
      return;
    }
    toast.success("Item duplicated");
    router.push(`/vault/items/${result.id}`);
    router.refresh();
  }

  async function confirmDelete() {
    if (busy) return;
    setBusy(true);
    const result = await deleteItemAction(item.id);
    setBusy(false);
    if (result.error) {
      toast.error(result.error);
      return;
    }
    toast.success(`"${item.name}" deleted`);
    router.push("/vault");
    router.refresh();
  }

  return (
    <main className="mx-auto max-w-3xl px-4 pb-20 pt-6 sm:px-6">
      <div className="flex items-center justify-between gap-3">
        <Link
          href="/vault"
          className="flex cursor-pointer items-center gap-1.5 text-[13px] font-medium text-faint transition-colors hover:text-ink"
        >
          ← Vault
        </Link>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              aria-label="Item actions"
              className="text-muted"
            >
              <FiMoreHorizontal className="h-5 w-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem asChild>
              <Link href={`/vault/items/${item.id}/edit`}>
<FiEdit2 className="h-4 w-4" />
              Edit item
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={duplicate}>
              <FiCopy className="h-4 w-4" />
              Duplicate
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => setDeleteOpen(true)}
              className="text-red-600 focus:text-red-600 dark:text-red-400 dark:focus:text-red-400"
            >
              <FiTrash2 className="h-4 w-4" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="mt-4 overflow-hidden rounded-3xl border border-line bg-surface">
        {item.appearance.banner !== "none" ? (
          <div
            aria-hidden
            className="h-16 w-full sm:h-24"
            style={{
              background:
                item.appearance.banner === "gradient"
                  ? `radial-gradient(120% 160% at 15% 0%, color-mix(in srgb, ${item.appearance.accent} 42%, transparent), transparent 60%), linear-gradient(160deg, color-mix(in srgb, ${item.appearance.accent} 16%, transparent), transparent 55%)`
                  : `linear-gradient(150deg, color-mix(in srgb, ${item.appearance.accent} 22%, transparent), transparent 70%)`,
            }}
          />
        ) : null}

        <div
          className={cn("px-5 sm:px-7", item.appearance.banner !== "none" ? "pb-6" : "pt-6 pb-6")}
        >
          <div className="flex items-center gap-4">
            <ItemIcon icon={item.icon} appearance={item.appearance} size="hero" />
            <div className="min-w-0 flex-1">
              <h1 className="truncate text-2xl font-semibold tracking-tight text-ink">
                {item.name}
              </h1>
              <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1">
                <p className="truncate text-sm text-muted">
                  {item.description || "Kept safe in your vault"}
                </p>
              </div>
            </div>
            <button
              onClick={toggleFavorite}
              aria-label={favorite ? "Remove from favorites" : "Add to favorites"}
              aria-pressed={favorite}
              className={cn(
                "grid h-10 w-10 shrink-0 cursor-pointer place-items-center rounded-full border transition-colors",
                favorite
                  ? "border-amber-200 bg-amber-50 text-amber-500 dark:border-amber-400/30 dark:bg-amber-400/10"
                  : "border-line bg-surface-2 text-faint hover:text-muted",
              )}
            >
              <FiStar className={cn("h-[18px] w-[18px]", favorite && "fill-current")} />
            </button>
          </div>

          <div className="mt-5 flex flex-wrap items-center gap-2 text-xs text-faint">
            <span className="inline-flex items-center rounded-full border border-line bg-surface-2 px-2.5 py-1 capitalize font-medium text-muted">
              {item.category}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <FiCalendar className="h-3 w-3" />
              Updated {formatDate(item.updatedAt)}
            </span>
            {(item.fieldCount > 0 || hasSensitive) && (
              <>
                <span aria-hidden className="text-line-strong">
                  ·
                </span>
                {item.fieldCount > 0 && (
                  <span>
                    {item.fieldCount} {item.fieldCount === 1 ? "field" : "fields"}
                  </span>
                )}
                {hasSensitive && (
                  <button
                    onClick={() => setForceReveal((r) => !r)}
                    className="cursor-pointer font-medium text-accent transition-opacity hover:opacity-80"
                  >
                    {forceReveal ? "Mask all" : "Reveal all"}
                  </button>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {item.fields.length > 0 ? (
        <section className="mt-6">
          <h2 className="flex items-center gap-2 text-[13px] font-semibold text-muted">
            Fields
            <span className="h-px flex-1 bg-line" />
          </h2>
          <div className="mt-3 grid gap-2.5 sm:grid-cols-2">
            {item.fields.map((field) => (
              <FieldDisplay
                key={field.id ?? field.name}
                name={field.name || "Field"}
                type={field.type}
                value={field.value}
                forceReveal={forceReveal}
              />
            ))}
          </div>
        </section>
      ) : (
        <section className="mt-6">
          <Link
            href={`/vault/items/${item.id}/edit`}
            className="flex items-center justify-center gap-2 rounded-2xl border border-dashed border-line-strong bg-surface-3/40 py-8 text-sm font-medium text-muted transition-colors hover:border-accent/50 hover:text-accent"
          >
            <FiPlus className="h-4 w-4" />
            Add fields to this item
          </Link>
        </section>
      )}

      {item.notes ? (
        <section className="mt-6">
          <h2 className="flex items-center gap-2 text-[13px] font-semibold text-muted">
            Notes
            <span className="h-px flex-1 bg-line" />
          </h2>
          <div className="mt-3 rounded-2xl border border-line bg-surface p-4">
            <p className="whitespace-pre-wrap text-[13px] leading-relaxed text-ink">
              {item.notes}
            </p>
          </div>
        </section>
      ) : null}

      <div className="mt-6 flex items-center justify-center gap-4 text-[11px] text-faint">
        <span className="inline-flex items-center gap-1.5">
          <FiCalendar className="h-3 w-3" />
          Created {formatDate(item.createdAt)}
        </span>
      </div>

      <Dialog
          open={deleteOpen}
          onOpenChange={setDeleteOpen}
          size="sm"
          title={`Delete “${item.name}”?`}
          description="This permanently removes the item and all of its saved fields. This action can’t be undone."
          footer={
            <>
              <Button
                variant="secondary"
                onClick={() => setDeleteOpen(false)}
                disabled={busy}
              >
                Cancel
              </Button>
              <Button variant="danger" onClick={confirmDelete} disabled={busy}>
                <FiTrash2 className="h-4 w-4" />
                Delete item
              </Button>
            </>
          }
        />
    </main>
  );
}