/** Synopsis section displaying the movie overview text. */

export function SynopsisSection({ synopsis }: { synopsis: string }) {
  return (
    <section className="px-4">
      <h2 className="mb-3 text-xl font-bold text-foreground">Synopsis</h2>
      <p className="leading-relaxed text-muted-foreground">{synopsis}</p>
    </section>
  );
}

export function SynopsisSkeleton() {
  return (
    <div className="space-y-3 px-4" data-testid="synopsis-skeleton">
      <div className="h-6 w-32 animate-pulse rounded bg-muted" />
      <div className="h-4 w-full animate-pulse rounded bg-muted" />
      <div className="h-4 w-3/4 animate-pulse rounded bg-muted" />
    </div>
  );
}
