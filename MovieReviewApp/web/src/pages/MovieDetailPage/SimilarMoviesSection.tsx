/** Section displaying similar movie recommendations. */

import { MovieCard } from "~/components/ui/MovieCard.js";
import type { MovieSummary } from "~/domains/movies/types.js";

export interface SimilarMoviesSectionProps {
  movies: MovieSummary[];
  isLoading: boolean;
  isError: boolean;
}

export function SimilarMoviesSection({
  movies,
  isLoading,
  isError,
}: SimilarMoviesSectionProps) {
  if (isLoading) return null;
  if (isError) return null;
  if (movies.length === 0) return null;

  return (
    <section className="px-4" data-testid="similar-section">
      <h2 className="mb-3 text-xl font-bold text-foreground">Similar Movies</h2>
      <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
        {movies.map((movie) => (
          <div
            key={movie.tmdbId}
            className="w-[160px] flex-shrink-0 sm:w-[180px] md:w-[200px]"
          >
            <MovieCard
              tmdbId={movie.tmdbId}
              title={movie.title}
              year={movie.year}
              posterPath={movie.posterPath}
              tmdbRating={movie.tmdbRating}
            />
          </div>
        ))}
      </div>
    </section>
  );
}
