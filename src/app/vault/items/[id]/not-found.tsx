export default function ItemNotFound() {
  return (
    <main className="mx-auto flex max-w-3xl flex-col items-center px-4 py-24 text-center">
      <div className="grid h-16 w-16 place-items-center rounded-2xl border border-line bg-surface text-2xl">
        🔍
      </div>
      <h1 className="mt-5 text-lg font-semibold tracking-tight text-ink">
        Item not found
      </h1>
      <p className="mt-1.5 max-w-sm text-sm text-muted">
        It may have been deleted, or the link is broken.
      </p>
      <a
        href="/vault"
        className="mt-6 inline-flex h-11 items-center gap-2 rounded-full px-6 text-sm font-semibold text-white brand-gradient shadow-[0_8px_24px_-8px_rgba(99,102,241,0.7)] transition-transform hover:scale-[1.02]"
      >
        Back to your vault
      </a>
    </main>
  );
}