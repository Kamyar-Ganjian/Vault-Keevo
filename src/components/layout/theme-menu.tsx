"use client";

import { FiMonitor, FiMoon, FiSun } from "react-icons/fi";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useTheme, type Theme } from "@/components/theme-provider";

const OPTIONS: { value: Theme; label: string; Icon: typeof FiSun }[] = [
  { value: "light", label: "Light", Icon: FiSun },
  { value: "dark", label: "Dark", Icon: FiMoon },
  { value: "system", label: "System", Icon: FiMonitor },
];

export function ThemeMenu({ full = false }: { full?: boolean }) {
  const { theme, setTheme } = useTheme();
  const current = OPTIONS.find((o) => o.value === theme);
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        {full ? (
          <button
            aria-label="Change theme"
            className="flex w-full cursor-pointer items-center gap-2.5 rounded-lg px-3 py-2 text-left text-[13.5px] font-medium text-muted transition-colors hover:bg-surface-2 hover:text-ink"
          >
            {theme === "dark" ? (
              <FiMoon className="h-[17px] w-[17px]" />
            ) : theme === "light" ? (
              <FiSun className="h-[17px] w-[17px]" />
            ) : (
              <FiMonitor className="h-[17px] w-[17px]" />
            )}
            <span className="flex-1">Theme</span>
            <span className="text-xs font-normal text-faint">{current?.label}</span>
          </button>
        ) : (
          <Button
            variant="ghost"
            size="icon"
            aria-label="Change theme"
            className="text-muted"
          >
            {theme === "dark" ? (
              <FiMoon className="h-[18px] w-[18px]" />
            ) : theme === "light" ? (
              <FiSun className="h-[18px] w-[18px]" />
            ) : (
              <FiMonitor className="h-[18px] w-[18px]" />
            )}
          </Button>
        )}
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        {OPTIONS.map(({ value, label, Icon }) => (
          <DropdownMenuItem
            key={value}
            onClick={() => setTheme(value)}
            className={cn(theme === value && "text-accent")}
          >
            <Icon className="h-4 w-4" />
            <span className="flex-1">{label}</span>
            {theme === value ? (
              <span className="h-1.5 w-1.5 rounded-full bg-accent" />
            ) : null}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}