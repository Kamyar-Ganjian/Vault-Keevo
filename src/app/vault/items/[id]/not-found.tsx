import { Mark } from "@/components/layout/logo";

export default function ItemNotFound() {
  return (
    <main className="mx-auto flex max-w-3xl flex-col items-center px-4 py-24 text-center">
      <Mark className="h-5 w-[112px]" />
      <h1 className="mt-6 text-xl font-semibold tracking-tight text-ink">
        Item not found
      </h1>
      <p className="mt-2 max-w-sm text-sm leading-relaxed text-muted">
        It may have been deleted, or the link is broken.
      </p>
      <a
        href="/vault"
        className="mt-7 inline-flex h-10 items-center gap-2 rounded-lg bg-accent px-5 text-sm font-medium text-accent-fg transition-colors hover:bg-accent-strong"
      >
        Back to your vault
      </a>
    </main>
  );
}