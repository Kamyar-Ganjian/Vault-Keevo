"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { motion } from "framer-motion";
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
import { Dialog } from "@/components/ui/dialog";
import { BackLink } from "@/components/ui/back-link";
import { SectionHeading } from "@/components/ui/section";
import { CategoryBadge } from "@/components/ui/category-badge";
import {
  deleteItemAction,
  duplicateItemAction,
} from "@/lib/actions/items";
import { useFavorite } from "@/hooks/use-favorite";
import { isSensitiveType } from "@/lib/field-types";
import { categoryLabel } from "@/lib/types";
import type { ItemDetailData } from "@/lib/types";
import { cn, formatDate, pluralize } from "@/lib/utils";

const ENTER = {
  initial: { opacity: 0, y: 8, scale: 0.985 },
  animate: { opacity: 1, y: 0, scale: 1 },
} as const;

export function ItemDetail({ item }: { item: ItemDetailData }) {
  const router = useRouter();
  const { favorite, toggle } = useFavorite(item.id, item.favorite);
  const [forceReveal, setForceReveal] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [busy, setBusy] = useState(false);

  const hasSensitive = item.fields.some((f) => isSensitiveType(f.type));

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
    <main className="mx-auto max-w-2xl px-4 pb-20 pt-6 sm:px-6 lg:pt-10">
      <div className="flex items-center justify-between gap-3">
        <BackLink href="/vault">← Vault</BackLink>
        <div className="flex items-center gap-1">
          <Button asChild variant="ghost" size="sm" className="text-muted">
            <Link href={`/vault/items/${item.id}/edit`}>
              <FiEdit2 className="h-4 w-4" />
              Edit
            </Link>
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon-sm"
                aria-label="More actions"
                className="text-muted"
              >
                <FiMoreHorizontal className="h-[18px] w-[18px]" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={duplicate}>
                <FiCopy className="h-4 w-4" />
                Duplicate
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => setDeleteOpen(true)}
                className="text-danger focus:text-danger"
              >
                <FiTrash2 className="h-4 w-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <motion.section
        {...ENTER}
        transition={{ type: "spring", duration: 0.5, bounce: 0.08 }}
        className="mt-5 overflow-hidden rounded-xl bg-surface ring-1 ring-line"
      >
        {item.appearance.accent ? (
          <div
            aria-hidden
            className="h-12 w-full sm:h-16"
            style={{
              background: `color-mix(in srgb, ${item.appearance.accent} 16%, transparent)`,
            }}
          />
        ) : null}

        <div className="px-5 pb-6 pt-6 sm:px-6">
          <div className="flex items-center gap-4">
            <motion.span
              className="relative shrink-0"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", duration: 0.55, bounce: 0.12, delay: 0.05 }}
            >
              <span
                aria-hidden
                className="absolute -inset-2 rounded-full blur-xl"
                style={{
                  background: `color-mix(in srgb, ${item.appearance.accent} 24%, transparent)`,
                }}
              />
              <span className="relative">
                <ItemIcon icon={item.icon} appearance={item.appearance} size="hero" />
              </span>
            </motion.span>
            <div className="min-w-0 flex-1">
              <h1 className="truncate text-2xl font-semibold tracking-tight text-ink sm:text-[28px]">
                {item.name}
              </h1>
              <p className="mt-1 truncate text-sm text-muted">
                {item.description || categoryLabel(item.category)}
              </p>
            </div>
            <button
              onClick={toggle}
              aria-label={favorite ? "Remove from favorites" : "Add to favorites"}
              aria-pressed={favorite}
              className={cn(
                "grid h-9 w-9 shrink-0 cursor-pointer place-items-center rounded-lg transition-colors",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40",
                favorite
                  ? "bg-amber-400/15 text-amber-500 ring-1 ring-amber-400/20"
                  : "bg-surface-2 text-faint hover:text-muted",
              )}
            >
              <FiStar className={cn("h-[17px] w-[17px]", favorite && "fill-current")} />
            </button>
          </div>

          <div className="mt-5 flex flex-wrap items-center gap-x-3 gap-y-2 border-t border-line pt-4 text-xs text-muted">
            <CategoryBadge category={item.category} className="px-2" />
            <span className="inline-flex items-center gap-1.5 text-faint">
              <FiCalendar className="h-3 w-3" />
              Updated {formatDate(item.updatedAt)}
            </span>
            {(item.fieldCount > 0 || hasSensitive) && (
              <>
                <span aria-hidden className="text-line-strong">
                  ·
                </span>
                {item.fieldCount > 0 && (
                  <span className="inline-flex items-center gap-1.5 text-faint">
                    {pluralize(item.fieldCount, "field")}
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
      </motion.section>

      {item.fields.length > 0 ? (
        <section className="mt-8">
          <SectionHeading title="Fields" />
          <div className="mt-3 divide-y divide-line overflow-hidden rounded-xl bg-surface ring-1 ring-line">
            {item.fields.map((field, i) => (
              <motion.div
                key={field.id ?? field.name}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.05 + Math.min(i * 0.04, 0.3), duration: 0.25 }}
              >
                <FieldDisplay
                  name={field.name || "Field"}
                  type={field.type}
                  value={field.value}
                  forceReveal={forceReveal}
                />
              </motion.div>
            ))}
          </div>
        </section>
      ) : (
        <section className="mt-8">
          <Link
            href={`/vault/items/${item.id}/edit`}
            className="flex items-center justify-center gap-2 rounded-xl border border-dashed border-line-strong bg-surface-3/40 py-9 text-sm font-medium text-muted transition-colors hover:border-accent/50 hover:bg-accent/5 hover:text-accent"
          >
            <FiPlus className="h-4 w-4" />
            Add fields to this item
          </Link>
        </section>
      )}

      {item.notes ? (
        <section className="mt-8">
          <SectionHeading title="Notes" />
          <div className="mt-3 rounded-xl bg-surface px-5 py-4 ring-1 ring-line">
            <p className="whitespace-pre-wrap text-[13px] leading-relaxed text-ink">
              {item.notes}
            </p>
          </div>
        </section>
      ) : null}

      <div className="mt-10 flex items-center justify-center gap-4 text-[11px] text-faint">
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