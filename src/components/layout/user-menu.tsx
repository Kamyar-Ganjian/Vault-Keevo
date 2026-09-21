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
}: {
  name: string | null;
  email: string;
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
        <Button
          variant="ghost"
          size="icon"
          className="text-muted"
          aria-label="Account menu"
        >
          <span className="grid h-7 w-7 place-items-center rounded-full bg-surface-2 text-xs font-semibold text-muted ring-1 ring-line transition-colors group-hover:text-ink">
            {initials(name ?? email) || "K"}
          </span>
        </Button>
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
          className="text-red-600 focus:text-red-600 dark:text-red-400 dark:focus:text-red-400"
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