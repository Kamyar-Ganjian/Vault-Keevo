"use client";

import { useState } from "react";
import { FiSearch } from "react-icons/fi";
import {
  iconDefsByGroup,
  ICON_GROUPS,
  type IconDef,
} from "@/lib/icons";
import { cn } from "@/lib/utils";

export function IconPicker({
  value,
  onChange,
}: {
  value: string;
  onChange: (key: string) => void;
}) {
  const [group, setGroup] = useState<IconDef["group"]>("general");
  const [query, setQuery] = useState("");

  const defs = iconDefsByGroup(group).filter((def) =>
    query.trim()
      ? def.label.toLowerCase().includes(query.trim().toLowerCase())
      : true,
  );

  return (
    <div>
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <FiSearch
            aria-hidden
            className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-faint"
          />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search icons…"
            className="h-8 w-full rounded-lg border border-line bg-surface-2 pl-8 pr-2.5 text-xs text-ink placeholder:text-faint focus-visible:border-accent/60 focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-accent/15"
          />
        </div>
        <div className="flex gap-0.5 rounded-lg border border-line bg-surface-2 p-0.5">
          {ICON_GROUPS.map((g) => (
            <button
              key={g.group}
              onClick={() => {
                setGroup(g.group);
                setQuery("");
              }}
              className={cn(
                "cursor-pointer rounded-md px-2.5 py-1 text-xs font-medium transition-colors",
                group === g.group
                  ? "bg-accent-soft text-accent-strong"
                  : "text-faint hover:text-muted",
              )}
            >
              {g.label}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-3 grid max-h-52 grid-cols-6 gap-1 overflow-y-auto rounded-xl bg-surface-2/40 p-2 ring-1 ring-line scrollbar-thin sm:grid-cols-8 lg:grid-cols-8 xl:grid-cols-10">
        {defs.map((def) => (
          <button
            key={def.key}
            title={def.label}
            onClick={() => onChange(def.key)}
            aria-label={def.label}
            aria-pressed={value === def.key}
            className={cn(
              "flex h-9 w-9 cursor-pointer items-center justify-center rounded-lg transition-[background-color,color,transform] duration-150 active:scale-90",
              value === def.key
                ? "bg-accent-soft text-accent-strong ring-1 ring-accent/20"
                : "text-muted hover:bg-surface-2 hover:text-ink",
            )}
          >
            <def.Icon aria-hidden className="h-[18px] w-[18px]" />
          </button>
        ))}
        {defs.length === 0 ? (
          <p className="col-span-full px-2 py-6 text-center text-xs text-faint">
            No matching icons.
          </p>
        ) : null}
      </div>
    </div>
  );
}