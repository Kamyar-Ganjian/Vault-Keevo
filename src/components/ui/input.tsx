import { forwardRef, type InputHTMLAttributes, type TextareaHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export const Input = forwardRef<
  HTMLInputElement,
  InputHTMLAttributes<HTMLInputElement>
>(function Input({ className, ...props }, ref) {
  return (
    <input
      ref={ref}
      className={cn(
        "h-9 w-full rounded-lg border border-line bg-surface-2 px-3 text-sm text-ink placeholder:text-faint",
        "transition-colors focus-visible:bg-surface focus-visible:outline-none focus-visible:border-accent/60 focus-visible:ring-[3px] focus-visible:ring-accent/15",
        "disabled:cursor-not-allowed disabled:opacity-60",
        className,
      )}
      {...props}
    />
  );
});

export const Textarea = forwardRef<
  HTMLTextAreaElement,
  TextareaHTMLAttributes<HTMLTextAreaElement>
>(function Textarea({ className, rows = 3, ...props }, ref) {
  return (
    <textarea
      ref={ref}
      rows={rows}
      className={cn(
        "w-full rounded-lg border border-line bg-surface-2 px-3 py-2 text-sm text-ink placeholder:text-faint",
        "transition-colors focus-visible:bg-surface focus-visible:outline-none focus-visible:border-accent/60 focus-visible:ring-[3px] focus-visible:ring-accent/15",
        "disabled:cursor-not-allowed disabled:opacity-60 resize-y",
        className,
      )}
      {...props}
    />
  );
});

export function Label({
  error,
  className,
  ...props
}: React.LabelHTMLAttributes<HTMLLabelElement> & { error?: string }) {
  return (
    <div className="flex items-baseline justify-between gap-2">
      <label
        className={cn("text-sm font-medium text-ink", className)}
        {...props}
      />
      {error ? (
        <span className="text-xs font-medium text-red-600 dark:text-red-400">
          {error}
        </span>
      ) : null}
    </div>
  );
}

export function FieldHint({ children }: { children: React.ReactNode }) {
  return <p className="mt-1.5 text-xs text-faint">{children}</p>;
}