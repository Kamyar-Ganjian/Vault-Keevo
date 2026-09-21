import type { ReactNode } from "react";

/**
 * The standard content heading used across vault pages:
 * an accent dot, a title and a trailing rule, with an optional action.
 */
export function SectionHeading({
  as: Tag = "h2",
  title,
  action,
}: {
  as?: "h2" | "h3";
  title: ReactNode;
  action?: ReactNode;
}) {
  return (
    <Tag className="flex items-center gap-2.5 text-[13px] font-semibold tracking-wide text-muted">
      <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
      <span className="truncate">{title}</span>
      <span className="h-px flex-1 bg-line" />
      {action}
    </Tag>
  );
}

export function Section({
  title,
  hint,
  children,
  className,
}: {
  title: ReactNode;
  hint?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section className={className}>
      <SectionHeading title={title} />
      {hint ? <p className="mt-1 text-xs text-faint">{hint}</p> : null}
      <div className="mt-4">{children}</div>
    </section>
  );
}