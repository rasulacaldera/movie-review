/** Movie detail page displaying hero, synopsis, cast, trailers, similar movies. */

import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Film, User, Play, Bookmark, PenLine } from "lucide-react";
import { StarRating } from "~/components/ui/StarRating.js";
import { MovieCard } from "~/components/ui/MovieCard.js";
import { ErrorState } from "~/components/ui/ErrorState.js";
import {
  useMovieDetail,
  useMovieCredits,
  useMovieVideos,
  useSimilarMovies,
  useImageConfig,
} from "~/domains/movies/hooks.js";
import {
  buildImageUrl,
  POSTER_SIZES,
  BACKDROP_SIZES,
  PROFILE_SIZES,
} from "~/domains/movies/image.js";
import type {
  MovieDetail,
  MovieCredits,
  CastMember,
  MovieVideo,
  MovieSummary,
} from "~/domains/movies/types.js";
import { ApiError } from "~/lib/api.js";

/** Formats runtime in minutes to "Xh Ym" notation. */
function formatRuntime(minutes: number): string {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return `${h}h ${m}m`;
}

/** Parses the route ID param; returns NaN for non-numeric values. */
function parseMovieId(idParam: string | undefined): number {
  if (!idParam) return NaN;
  const parsed = Number(idParam);
  return Number.isInteger(parsed) && parsed > 0 ? parsed : NaN;
}

export default function MovieDetailPage() {
  const { id: idParam } = useParams<{ id: string }>();
  const movieId = parseMovieId(idParam);
  const isValidId = !Number.isNaN(movieId);

  const detail = useMovieDetail(isValidId ? movieId : 0);
  const credits = useMovieCredits(isValidId ? movieId : 0);
  const videos = useMovieVideos(isValidId ? movieId : 0);
  const similar = useSimilarMovies(isValidId ? movieId : 0);
  const imageConfig = useImageConfig();

  // Scroll to top on route param change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [idParam]);

  // Set document title when movie data loads
  useEffect(() => {
    if (detail.data?.title) {
      document.title = `${detail.data.title} — MovieReview`;
    }
    return () => {
      document.title = "MovieReview";
    };
  }, [detail.data?.title]);

  // Non-numeric route param
  if (!isValidId) {
    return <NotFoundMessage />;
  }

  // 404 from API
  const is404 =
    detail.isError &&
    detail.error instanceof ApiError &&
    detail.error.status === 404;

  if (is404) {
    return <NotFoundMessage />;
  }

  // Fatal error on detail fetch (non-404)
  if (detail.isError) {
    return (
      <div className="px-4 py-8">
        <ErrorState
          message="Failed to load movie details."
          onRetry={() => void detail.refetch()}
        />
      </div>
    );
  }

  const baseUrl = imageConfig.data?.baseUrl;

  return (
    <div className="space-y-10 pb-12">
      {detail.isLoading ? (
        <HeroSkeleton />
      ) : detail.data ? (
        <HeroSection movie={detail.data} baseUrl={baseUrl} />
      ) : null}

      {detail.isLoading ? (
        <SynopsisSkeleton />
      ) : detail.data && detail.data.synopsis ? (
        <SynopsisSection synopsis={detail.data.synopsis} />
      ) : null}

      <CastSection credits={credits} baseUrl={baseUrl} />

      <TrailerSection videos={videos} />

      <SimilarMoviesSection similar={similar} />

      <ReviewsPlaceholder />

      <ActionButtons />
    </div>
  );
}

// --- Hero Section ---

function HeroSection({
  movie,
  baseUrl,
}: {
  movie: MovieDetail;
  baseUrl: string | undefined;
}) {
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

function HeroSkeleton() {
  return (
    <div
      className="h-[400px] w-full animate-pulse rounded-xl bg-muted"
      data-testid="hero-skeleton"
    />
  );
}

// --- Synopsis ---

function SynopsisSection({ synopsis }: { synopsis: string }) {
  return (
    <section className="px-4">
      <h2 className="mb-3 text-xl font-bold text-foreground">Synopsis</h2>
      <p className="leading-relaxed text-muted-foreground">{synopsis}</p>
    </section>
  );
}

function SynopsisSkeleton() {
  return (
    <div className="space-y-3 px-4" data-testid="synopsis-skeleton">
      <div className="h-6 w-32 animate-pulse rounded bg-muted" />
      <div className="h-4 w-full animate-pulse rounded bg-muted" />
      <div className="h-4 w-3/4 animate-pulse rounded bg-muted" />
    </div>
  );
}

// --- Cast & Crew ---

function CastSection({
  credits,
  baseUrl,
}: {
  credits: ReturnType<typeof useMovieCredits>;
  baseUrl: string | undefined;
}) {
  if (credits.isLoading) {
    return <CastSkeleton />;
  }

  if (credits.isError) {
    return (
      <section data-testid="cast-section" className="px-4">
        <h2 className="mb-3 text-xl font-bold text-foreground">Cast</h2>
        <ErrorState
          message="Failed to load cast information."
          onRetry={() => void credits.refetch()}
        />
      </section>
    );
  }

  const data = credits.data;
  if (!data) return null;

  const hasCast = data.cast.length > 0;

  return (
    <section data-testid="cast-section" className="px-4">
      <h2 className="mb-3 text-xl font-bold text-foreground">Cast</h2>

      {data.director && (
        <p className="mb-4 text-sm font-medium text-muted-foreground">
          Directed by {data.director}
        </p>
      )}

      {hasCast ? (
        <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
          {data.cast.map((member) => (
            <CastCard key={member.name} member={member} baseUrl={baseUrl} />
          ))}
        </div>
      ) : (
        <p className="text-sm text-muted-foreground">
          No cast information available.
        </p>
      )}
    </section>
  );
}

function CastCard({
  member,
  baseUrl,
}: {
  member: CastMember;
  baseUrl: string | undefined;
}) {
  const photoUrl = baseUrl
    ? buildImageUrl({
        baseUrl,
        path: member.profilePath,
        size: PROFILE_SIZES.medium,
      })
    : null;

  return (
    <div className="w-32 flex-shrink-0 text-center" data-testid="cast-card">
      <div className="mx-auto h-32 w-32 overflow-hidden rounded-lg bg-muted">
        {photoUrl ? (
          <img
            src={photoUrl}
            alt={`${member.name}`}
            className="h-full w-full object-cover"
          />
        ) : (
          <div
            className="flex h-full w-full items-center justify-center"
            data-testid="profile-placeholder"
          >
            <User className="h-10 w-10 text-muted-foreground" />
          </div>
        )}
      </div>
      <p className="mt-2 truncate text-sm font-semibold text-foreground">
        {member.name}
      </p>
      <p className="truncate text-xs text-muted-foreground">
        {member.character}
      </p>
    </div>
  );
}

function CastSkeleton() {
  return (
    <div className="px-4" data-testid="cast-skeleton">
      <div className="mb-3 h-6 w-20 animate-pulse rounded bg-muted" />
      <div className="flex gap-4">
        {Array.from({ length: 5 }, (_, i) => (
          <div key={i} className="w-32 flex-shrink-0">
            <div className="h-32 w-32 animate-pulse rounded-lg bg-muted" />
            <div className="mt-2 h-4 w-24 animate-pulse rounded bg-muted" />
          </div>
        ))}
      </div>
    </div>
  );
}

// --- Trailers ---

function TrailerSection({
  videos,
}: {
  videos: ReturnType<typeof useMovieVideos>;
}) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [playing, setPlaying] = useState(false);

  if (videos.isLoading) return null;
  if (videos.isError) return null;

  const trailers = videos.data;
  if (!trailers || trailers.length === 0) return null;

  const activeTrailer = trailers[activeIndex] ?? trailers[0];
  if (!activeTrailer) return null;

  return (
    <section className="px-4" data-testid="trailers-section">
      <h2 className="mb-3 text-xl font-bold text-foreground">Trailers</h2>

      {/* Active trailer player area */}
      <div className="relative mb-4 aspect-video w-full max-w-3xl overflow-hidden rounded-lg bg-black">
        {playing ? (
          <iframe
            src={`https://www.youtube-nocookie.com/embed/${activeTrailer.youtubeKey}?autoplay=1`}
            title={activeTrailer.name}
            className="h-full w-full"
            allow="autoplay; encrypted-media"
            allowFullScreen
          />
        ) : (
          <>
            <img
              src={`https://img.youtube.com/vi/${activeTrailer.youtubeKey}/hqdefault.jpg`}
              alt={`${activeTrailer.name} thumbnail`}
              className="h-full w-full object-cover"
            />
            <button
              type="button"
              onClick={() => setPlaying(true)}
              className="absolute inset-0 flex items-center justify-center bg-black/30 transition-colors hover:bg-black/40"
              aria-label={`Play ${activeTrailer.name}`}
            >
              <div className="rounded-full bg-primary p-4">
                <Play className="h-8 w-8 fill-primary-foreground text-primary-foreground" />
              </div>
            </button>
          </>
        )}
      </div>

      {/* Trailer selection */}
      {trailers.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-2">
          {trailers.map((trailer, index) => (
            <button
              key={trailer.youtubeKey}
              type="button"
              onClick={() => {
                setActiveIndex(index);
                setPlaying(false);
              }}
              className={`flex-shrink-0 rounded-lg border px-3 py-2 text-xs font-medium transition-colors ${
                index === activeIndex
                  ? "border-primary bg-primary/10 text-primary"
                  : "border-border text-muted-foreground hover:border-primary/50"
              }`}
              aria-selected={index === activeIndex}
              role="tab"
            >
              {trailer.name}
            </button>
          ))}
        </div>
      )}
    </section>
  );
}

// --- Similar Movies ---

function SimilarMoviesSection({
  similar,
}: {
  similar: ReturnType<typeof useSimilarMovies>;
}) {
  if (similar.isLoading) return null;
  if (similar.isError) return null;

  const movies = similar.data?.results;
  if (!movies || movies.length === 0) return null;

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

// --- Reviews Placeholder ---

function ReviewsPlaceholder() {
  return (
    <section className="px-4">
      <h2 className="mb-3 text-xl font-bold text-foreground">Reviews</h2>
      <p className="text-sm text-muted-foreground">Reviews are coming soon.</p>
    </section>
  );
}

// --- Action Buttons ---

function ActionButtons() {
  return (
    <div className="flex gap-3 px-4">
      <button
        type="button"
        disabled
        className="flex items-center gap-2 rounded-lg bg-primary/20 px-4 py-2.5 text-sm font-medium text-primary opacity-60"
        title="Sign in to add to watchlist"
      >
        <Bookmark className="h-4 w-4" />
        Add to Watchlist
      </button>
      <button
        type="button"
        disabled
        className="flex items-center gap-2 rounded-lg bg-primary/20 px-4 py-2.5 text-sm font-medium text-primary opacity-60"
        title="Sign in to write a review"
      >
        <PenLine className="h-4 w-4" />
        Write Review
      </button>
    </div>
  );
}

// --- Not Found ---

function NotFoundMessage() {
  return (
    <div className="flex flex-col items-center gap-4 px-4 py-16 text-center">
      <Film className="h-16 w-16 text-muted-foreground" />
      <h1 className="text-2xl font-bold text-foreground">Movie not found</h1>
      <p className="text-muted-foreground">
        The movie you are looking for does not exist or has been removed.
      </p>
      <Link
        to="/"
        className="rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90"
      >
        Go Home
      </Link>
    </div>
  );
}
