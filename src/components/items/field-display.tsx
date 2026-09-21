"use client";

import { useState } from "react";
import { FiEye, FiEyeOff, FiExternalLink } from "react-icons/fi";
import { CopyButton } from "@/components/items/copy-button";
import { isSensitiveType, type FieldType } from "@/lib/field-types";
import { cn, formatDate } from "@/lib/utils";
import { Switch } from "@/components/ui/switch";

export function FieldDisplay({
  name,
  type,
  value,
  forceReveal = false,
}: {
  name: string;
  type: FieldType;
  value: string;
  forceReveal?: boolean;
}) {
  const sensitive = isSensitiveType(type);
  const [revealed, setRevealed] = useState(false);
  const show = sensitive ? revealed || forceReveal : true;

  return (
    <div className="group rounded-xl border border-line bg-surface p-3.5 transition-colors hover:border-line-strong">
      <div className="flex items-center justify-between gap-2">
        <span className="text-[11px] font-semibold uppercase tracking-wide text-faint">
          {name}
        </span>
        {sensitive && value ? (
          <button
            onClick={() => setRevealed((r) => !r)}
            className="flex cursor-pointer items-center gap-1.5 rounded-md px-1.5 py-0.5 text-[11px] font-medium text-faint transition-colors hover:text-ink"
          >
            {show ? (
              <>
                <FiEyeOff className="h-3 w-3" /> Hide
              </>
            ) : (
              <>
                <FiEye className="h-3 w-3" /> Reveal
              </>
            )}
          </button>
        ) : null}
      </div>

      <div className="mt-1.5 flex items-center gap-2">
        <div className="min-w-0 flex-1">
          <ValueBody type={type} value={value} show={show} />
        </div>
        {value && !["toggle", "url"].includes(type) ? (
          <CopyButton value={value} />
        ) : null}
      </div>
    </div>
  );
}

function ValueBody({
  type,
  value,
  show,
}: {
  type: FieldType;
  value: string;
  show: boolean;
}) {
  if (type === "toggle") {
    return <TogglePill raw={value} />;
  }

  if (type === "url") {
    const href = /^https?:\/\//i.test(value) ? value : null;
    return href ? (
      <a
        href={href}
        target="_blank"
        rel="noreferrer noopener"
        className="inline-flex max-w-full items-center gap-1.5 truncate rounded-lg border border-line bg-surface-2 px-2.5 py-1 text-[13px] font-medium text-accent transition-colors hover:border-line-strong"
      >
        <span className="truncate">{value}</span>
        <FiExternalLink className="h-3 w-3 shrink-0" />
      </a>
    ) : (
      <p className="truncate text-[13px] leading-relaxed text-ink">{value}</p>
    );
  }

  if (!show) {
    return (
      <span className="flex items-center gap-1.5 py-0.5">
        {new Array(Math.min(value.length, 14)).fill(0).map((_, i) => (
          <span
            key={i}
            className={cn(
              "h-2 w-1.5 rounded-sm bg-line-strong",
              type === "code" && "bg-line-strong/70",
            )}
          />
        ))}
      </span>
    );
  }

  if (type === "date") {
    return (
      <p className="text-[13px] font-medium tracking-tight text-ink">
        {formatDate(value)}
      </p>
    );
  }

  if (type === "longtext") {
    return (
      <p className="max-h-36 overflow-y-auto whitespace-pre-wrap text-[13px] leading-relaxed text-ink scrollbar-thin">
        {value || "—"}
      </p>
    );
  }

  return (
    <p
      className={cn(
        "truncate text-[13px] text-ink",
        (type === "secret" || type === "code" || type === "number") &&
          "font-mono text-[12.5px] tracking-tight",
        (type === "secret" || type === "code") && "py-0.5",
      )}
    >
      {value || "—"}
    </p>
  );
}

function TogglePill({ raw }: { raw: string }) {
  const on = ["true", "1", "yes", "on", "enabled"].includes(
    raw.trim().toLowerCase(),
  );
  return (
    <span className="inline-flex items-center gap-2">
      <Switch checked={on} disabled aria-label="Value" />
      <span
        className={cn(
          "text-xs font-semibold",
          on ? "text-mint" : "text-faint",
        )}
      >
        {on ? "On" : "Off"}
      </span>
    </span>
  );
}