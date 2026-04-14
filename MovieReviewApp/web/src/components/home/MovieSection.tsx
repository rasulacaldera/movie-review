/** Composable section wrapper combining header, content layout, and state handling. */

import { SectionHeader } from "~/components/ui/SectionHeader.js";
import { SkeletonGrid } from "~/components/ui/MovieCardSkeleton.js";
import { ErrorState } from "~/components/ui/ErrorState.js";
import { MovieCarousel } from "./MovieCarousel.js";
import { MovieGrid } from "./MovieGrid.js";
import type { MovieSummary } from "~/domains/movies/types.js";

interface MovieSectionProps {
  /** Section title. */
  title: string;
  /** Optional "See All" link destination. */
  seeAllHref?: string;
  /** Layout mode: carousel (horizontal scroll) or grid. */
  layout: "carousel" | "grid";
  /** Movie data from the hook. */
  movies: MovieSummary[] | undefined;
  /** Whether data is loading. */
  isLoading: boolean;
  /** Error from the hook, if any. */
  error: Error | null;
  /** Callback to refetch on error. */
  onRetry: () => void;
}

/** Section with header, loading/error states, and movie content. */
export function MovieSection({
  title,
  seeAllHref,
  layout,
  movies,
  isLoading,
  error,
  onRetry,
}: MovieSectionProps) {
  return (
    <section
      data-testid={`section-${title.toLowerCase().replace(/\s+/g, "-")}`}
    >
      <div className="mb-4">
        {seeAllHref !== undefined ? (
          <SectionHeader title={title} href={seeAllHref} />
        ) : (
          <SectionHeader title={title} />
        )}
      </div>
      {isLoading && <SkeletonGrid count={5} />}
      {error && (
        <ErrorState
          message={`Failed to load ${title.toLowerCase()} movies.`}
          onRetry={onRetry}
        />
      )}
      {!error && movies && movies.length > 0 && layout === "carousel" && (
        <MovieCarousel movies={movies} />
      )}
      {!error && movies && movies.length > 0 && layout === "grid" && (
        <MovieGrid movies={movies} />
      )}
    </section>
  );
}
