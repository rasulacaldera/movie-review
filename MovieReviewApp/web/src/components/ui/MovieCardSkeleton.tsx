import { cn } from "~/lib/utils.js";

/** Animated skeleton placeholder mimicking a MovieCard. */
export function MovieCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-lg bg-card" data-testid="movie-card-skeleton">
      <div className={cn("aspect-[2/3] w-full animate-pulse rounded-t-lg bg-muted")} />
      <div className="space-y-2 p-3">
        <div className="h-4 w-3/4 animate-pulse rounded bg-muted" data-testid="skeleton-title" />
        <div className="h-3 w-1/4 animate-pulse rounded bg-muted" data-testid="skeleton-rating" />
      </div>
    </div>
  );
}

interface SkeletonGridProps {
  /** Number of skeleton cards to render. */
  count: number;
}

/** Grid of MovieCardSkeleton components. */
export function SkeletonGrid({ count }: SkeletonGridProps) {
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
      {Array.from({ length: count }, (_, i) => (
        <MovieCardSkeleton key={i} />
      ))}
    </div>
  );
}
