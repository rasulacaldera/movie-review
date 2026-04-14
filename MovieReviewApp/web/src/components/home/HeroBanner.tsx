/** Hero banner displaying a featured movie with backdrop image. */

import { Link } from "react-router-dom";
import { StarRating } from "~/components/ui/StarRating.js";
import type { MovieSummary } from "~/domains/movies/types.js";
import { buildImageUrl, BACKDROP_SIZES } from "~/domains/movies/image.js";

interface HeroBannerProps {
  /** The movie to feature, or undefined while loading. */
  movie: MovieSummary | undefined;
  /** TMDB image base URL. */
  imageBaseUrl: string | undefined;
  /** Whether data is currently loading. */
  isLoading: boolean;
}

/** Full-width hero banner with backdrop image, title, rating, and detail link. */
export function HeroBanner({ movie, imageBaseUrl, isLoading }: HeroBannerProps) {
  if (isLoading || !movie) {
    return <HeroBannerSkeleton />;
  }

  const backdropUrl =
    imageBaseUrl && movie.backdropPath
      ? buildImageUrl({
          baseUrl: imageBaseUrl,
          path: movie.backdropPath,
          size: BACKDROP_SIZES.large,
        })
      : null;

  return (
    <section
      className="relative h-[400px] w-full overflow-hidden rounded-xl bg-muted sm:h-[480px]"
      data-testid="hero-banner"
      aria-label="Featured movie"
    >
      {backdropUrl && (
        <img
          src={backdropUrl}
          alt={`${movie.title} backdrop`}
          className="absolute inset-0 h-full w-full object-cover"
        />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
      <div className="absolute bottom-0 left-0 p-6 sm:p-8">
        <h2 className="text-2xl font-bold text-foreground sm:text-4xl">
          {movie.title}
        </h2>
        <div className="mt-2">
          <StarRating rating={movie.tmdbRating} />
        </div>
        <Link
          to={`/movie/${movie.tmdbId}`}
          className="mt-4 inline-block rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90"
        >
          View Details
        </Link>
      </div>
    </section>
  );
}

function HeroBannerSkeleton() {
  return (
    <div
      className="h-[400px] w-full animate-pulse rounded-xl bg-muted sm:h-[480px]"
      data-testid="hero-banner-skeleton"
      aria-label="Loading featured movie"
    />
  );
}
