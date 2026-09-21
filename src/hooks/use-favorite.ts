"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { toggleFavoriteAction } from "@/lib/actions/items";

/** Optimistic favorite toggle shared by item cards and the item detail page. */
export function useFavorite(itemId: string, initial: boolean) {
  const router = useRouter();
  const [favorite, setFavorite] = useState(initial);
  const [busy, setBusy] = useState(false);

  async function toggle() {
    if (busy) return;
    setBusy(true);
    const previous = favorite;
    setFavorite(!previous);
    const result = await toggleFavoriteAction(itemId);
    if (result.error) {
      setFavorite(previous);
      toast.error(result.error);
    } else if (typeof result.favorite === "boolean") {
      setFavorite(result.favorite);
    }
    setBusy(false);
    router.refresh();
  }

  return { favorite, busy, toggle };
}