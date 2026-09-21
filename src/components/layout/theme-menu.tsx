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

export function ThemeMenu() {
  const { theme, setTheme } = useTheme();
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
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