/** Responsive grid of MovieCards. */

import { MovieCard } from "~/components/ui/MovieCard.js";
import type { MovieSummary } from "~/domains/movies/types.js";

interface MovieGridProps {
  /** Movies to display in the grid. */
  movies: MovieSummary[];
  /** Maximum number of movies to display. Defaults to 10. */
  limit?: number;
}

/** Responsive grid layout: 2 cols mobile, 3 tablet, 4-5 desktop. */
export function MovieGrid({ movies, limit = 10 }: MovieGridProps) {
  const visibleMovies = movies.slice(0, limit);

  return (
    <div
      className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5"
      data-testid="movie-grid"
    >
      {visibleMovies.map((movie) => (
        <MovieCard
          key={movie.tmdbId}
          tmdbId={movie.tmdbId}
          title={movie.title}
          year={movie.year ?? 0}
          posterPath={movie.posterPath}
          tmdbRating={movie.tmdbRating}
        />
      ))}
    </div>
  );
}
