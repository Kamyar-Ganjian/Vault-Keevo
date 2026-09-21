import { Mark } from "@/components/layout/logo";
import { cn } from "@/lib/utils";

/**
 * Gentle violet light cast over the top of the vault, like a lamp
 * in a dark room. Barely visible on purpose.
 */
export function VaultAtmosphere({ className }: { className?: string }) {
  return (
    <div
      aria-hidden
      className={cn("pointer-events-none absolute inset-0 overflow-hidden", className)}
    >
      <div className="absolute inset-x-0 top-0 h-[430px]" style={{ background: "radial-gradient(58% 90% at 50% -14%, color-mix(in srgb, var(--accent) 9%, transparent), transparent 62%)" }} />
    </div>
  );
}

/**
 * The "vault core" — a recurring Keevo motif: a quiet object with a
 * slow orbital arc and a faint breathing glow.
 */
export function VaultCore({
  size = 88,
  className,
  spinning = true,
}: {
  size?: number;
  className?: string;
  spinning?: boolean;
}) {
  return (
    <span
      aria-hidden
      className={cn("relative grid place-items-center", className)}
      style={{ width: size, height: size }}
    >
      <span
        className="absolute -inset-[14%] animate-[core-breathe_7s_ease-in-out_infinite] rounded-full"
        style={{
          background:
            "radial-gradient(closest-side, color-mix(in srgb, var(--accent) 22%, transparent), transparent 72%)",
        }}
      />
      <span
        className="absolute inset-0 rounded-full bg-surface-3 ring-1 ring-line-strong"
        style={{
          boxShadow:
            "inset 0 1px 0 0 color-mix(in srgb, white 6%, transparent), inset 0 -10px 24px -12px color-mix(in srgb, var(--accent) 18%, transparent)",
        }}
      />
      <Mark
        variant="accent"
        className="absolute h-[24%] w-[88%]"
      />
      {spinning ? (
        <svg
          viewBox="0 0 100 100"
          className="absolute inset-[-4%] animate-spin [animation-duration:55s]"
        >
          <circle
            cx="50"
            cy="50"
            r="48"
            fill="none"
            stroke="color-mix(in srgb, var(--accent) 55%, transparent)"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeDasharray="26 275"
            opacity="0.65"
          />
        </svg>
      ) : null}
    </span>
  );
}

/**
 * A tiny hairline pulse used while loading. Brand-colored ring,
 * no loud spinner.
 */
export function VaultPulse({ className }: { className?: string }) {
  return (
    <span
      aria-hidden
      className={cn("relative grid h-4 w-4 place-items-center", className)}
    >
      <span className="absolute inset-0 animate-[core-breathe_1.6s_ease-in-out_infinite] rounded-full bg-accent-soft" />
      <span className="absolute inset-[3px] rounded-full border border-accent/30" />
      <span className="absolute inset-[3px] animate-spin rounded-full border-t border-accent [animation-duration:0.8s]" />
    </span>
  );
}