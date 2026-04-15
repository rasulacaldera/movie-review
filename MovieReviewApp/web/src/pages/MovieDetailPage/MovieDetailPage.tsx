/** Movie detail page displaying hero, synopsis, cast, trailers, similar movies. */

import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { ErrorState } from "~/components/ui/ErrorState.js";
import {
  useMovieDetail,
  useMovieCredits,
  useMovieVideos,
  useSimilarMovies,
  useImageConfig,
} from "~/domains/movies/hooks.js";
import { ApiError } from "~/lib/api.js";
import { HeroSection, HeroSkeleton } from "./HeroSection.js";
import { SynopsisSection, SynopsisSkeleton } from "./SynopsisSection.js";
import { CastSection } from "./CastSection.js";
import { TrailerSection } from "./TrailerSection.js";
import { SimilarMoviesSection } from "./SimilarMoviesSection.js";
import { ReviewsPlaceholder } from "./ReviewsPlaceholder.js";
import { ActionButtons } from "./ActionButtons.js";
import { NotFoundMessage } from "./NotFoundMessage.js";
import { parseMovieId } from "./parseMovieId.js";

export default function MovieDetailPage() {
  const { id: idParam } = useParams<{ id: string }>();
  const movieId = parseMovieId(idParam);
  const isValidId = !Number.isNaN(movieId);
  const queryId = isValidId ? movieId : 0;

  const detail = useMovieDetail(queryId);
  const credits = useMovieCredits(queryId);
  const videos = useMovieVideos(queryId);
  const similar = useSimilarMovies(queryId);
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

      <CastSection
        cast={credits.data?.cast ?? []}
        director={credits.data?.director ?? null}
        isLoading={credits.isLoading}
        isError={credits.isError}
        onRetry={() => void credits.refetch()}
        baseUrl={baseUrl}
      />

      <TrailerSection
        key={movieId}
        trailers={videos.data ?? []}
        isLoading={videos.isLoading}
        isError={videos.isError}
      />

      <SimilarMoviesSection
        movies={similar.data?.results ?? []}
        isLoading={similar.isLoading}
        isError={similar.isError}
      />

      <ReviewsPlaceholder />

      <ActionButtons />
    </div>
  );
}
