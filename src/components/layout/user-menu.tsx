"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FiHome, FiLogOut, FiUnlock } from "react-icons/fi";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown";
import { Button } from "@/components/ui/button";
import { logoutAction } from "@/lib/actions/auth";
import { initials } from "@/lib/utils";

export function UserMenu({
  name,
  email,
  full = false,
}: {
  name: string | null;
  email: string;
  full?: boolean;
}) {
  const router = useRouter();

  async function handleLogout() {
    const result = await logoutAction();
    if (result.error) {
      toast.error(result.error);
      router.refresh();
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        {full ? (
          <button className="flex w-full cursor-pointer items-center gap-2.5 rounded-lg px-2.5 py-2 text-left transition-colors hover:bg-surface-2">
            <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-accent-soft text-[11px] font-semibold text-accent-strong">
              {initials(name ?? email) || "K"}
            </span>
            <span className="min-w-0 flex-1">
              <span className="block truncate text-[13.5px] font-medium text-ink">
                {name ?? "Account"}
              </span>
            </span>
          </button>
        ) : (
          <Button
            variant="ghost"
            size="icon"
            className="text-muted"
            aria-label="Account menu"
          >
            <span className="grid h-7 w-7 place-items-center rounded-full bg-accent-soft text-xs font-semibold text-accent-strong ring-1 ring-accent/25">
              {initials(name ?? email) || "K"}
            </span>
          </Button>
        )}
      </DropdownMenuTrigger>
      <DropdownMenuContent className="min-w-[200px]">
        <DropdownMenuLabel className="font-medium">
          <span className="block max-w-[180px] truncate text-[13px] text-ink">
            {name ?? "Account"}
          </span>
          <span className="mt-0.5 block truncate text-xs font-normal text-faint">
            {email}
          </span>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href="/vault">
            <FiHome className="h-4 w-4" />
            Your vault
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onSelect={handleLogout}
          className="text-danger focus:text-danger"
        >
          <FiLogOut className="h-4 w-4" />
          Sign out
        </DropdownMenuItem>
        <div className="mt-1 flex items-center gap-1.5 px-2.5 pb-1 pt-1.5 text-[11px] text-faint">
          <FiUnlock className="h-3 w-3" />
          Protected vault
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}