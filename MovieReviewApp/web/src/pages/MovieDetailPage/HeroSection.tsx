/** Hero section displaying backdrop, poster, title, metadata, genres, and rating. */

import { Film } from "lucide-react";
import { StarRating } from "~/components/ui/StarRating.js";
import {
  buildImageUrl,
  POSTER_SIZES,
  BACKDROP_SIZES,
} from "~/domains/movies/image.js";
import type { MovieDetail } from "~/domains/movies/types.js";
import { formatRuntime } from "./formatRuntime.js";

interface HeroSectionProps {
  movie: MovieDetail;
  baseUrl: string | undefined;
}

export function HeroSection({ movie, baseUrl }: HeroSectionProps) {
  const backdropUrl = baseUrl
    ? buildImageUrl({
        baseUrl,
        path: movie.backdropPath,
        size: BACKDROP_SIZES.large,
      })
    : null;

  const posterUrl = baseUrl
    ? buildImageUrl({
        baseUrl,
        path: movie.posterPath,
        size: POSTER_SIZES.large,
      })
    : null;

  return (
    <section
      data-testid="hero-section"
      className="relative w-full overflow-hidden rounded-xl bg-muted"
    >
      {backdropUrl && (
        <img
          src={backdropUrl}
          alt={`${movie.title} backdrop`}
          className="absolute inset-0 h-full w-full object-cover"
          data-testid="hero-backdrop"
        />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-background/40" />

      <div className="relative flex flex-col gap-6 p-6 md:flex-row md:items-end md:p-8">
        {/* Poster */}
        <div className="mx-auto w-48 flex-shrink-0 overflow-hidden rounded-lg shadow-lg md:mx-0 md:w-64">
          {posterUrl ? (
            <img
              src={posterUrl}
              alt={`${movie.title} poster`}
              className="aspect-[2/3] w-full object-cover"
            />
          ) : (
            <div
              className="flex aspect-[2/3] w-full items-center justify-center bg-muted"
              data-testid="poster-placeholder"
            >
              <Film className="h-12 w-12 text-muted-foreground" />
            </div>
          )}
        </div>

        {/* Info */}
        <div className="flex-1 space-y-3 text-center md:text-left">
          <h1 className="text-3xl font-bold text-foreground md:text-4xl">
            {movie.title}
          </h1>

          <div className="flex flex-wrap items-center justify-center gap-2 text-sm text-muted-foreground md:justify-start">
            <span>{movie.year}</span>
            {movie.runtime > 0 && (
              <>
                <span aria-hidden="true">&middot;</span>
                <span>{formatRuntime(movie.runtime)}</span>
              </>
            )}
            <span aria-hidden="true">&middot;</span>
            <span>{movie.releaseDate}</span>
          </div>

          <div className="flex flex-wrap justify-center gap-2 md:justify-start">
            {movie.genres.map((genre) => (
              <span
                key={genre}
                className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary"
              >
                {genre}
              </span>
            ))}
          </div>

          <div className="flex items-center justify-center gap-3 md:justify-start">
            <span className="text-2xl font-bold text-foreground">
              {movie.tmdbRating.toFixed(1)}
            </span>
            <StarRating rating={movie.tmdbRating} />
          </div>
        </div>
      </div>
    </section>
  );
}

export function HeroSkeleton() {
  return (
    <div
      className="h-[400px] w-full animate-pulse rounded-xl bg-muted"
      data-testid="hero-skeleton"
    />
  );
}
