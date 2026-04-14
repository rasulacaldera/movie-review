/** Home page with hero banner and curated movie sections. */

import { HeroBanner } from "~/components/home/HeroBanner.js";
import { MovieSection } from "~/components/home/MovieSection.js";
import {
  usePopularMovies,
  useNowPlayingMovies,
  useUpcomingMovies,
  useTopRatedMovies,
  useImageConfig,
} from "~/domains/movies/hooks.js";

export default function HomePage() {
  const popular = usePopularMovies();
  const nowPlaying = useNowPlayingMovies();
  const upcoming = useUpcomingMovies();
  const topRated = useTopRatedMovies();
  const imageConfig = useImageConfig();

  const heroMovie = popular.data?.results[0];

  return (
    <div className="space-y-10">
      <HeroBanner
        movie={heroMovie}
        imageBaseUrl={imageConfig.data?.baseUrl}
        isLoading={popular.isLoading || imageConfig.isLoading}
      />

      <MovieSection
        title="Now Playing"
        seeAllHref="/now-playing"
        layout="carousel"
        movies={nowPlaying.data?.results}
        isLoading={nowPlaying.isLoading}
        error={nowPlaying.error}
        onRetry={() => void nowPlaying.refetch()}
      />

      <MovieSection
        title="Coming Soon"
        seeAllHref="/coming-soon"
        layout="carousel"
        movies={upcoming.data?.results}
        isLoading={upcoming.isLoading}
        error={upcoming.error}
        onRetry={() => void upcoming.refetch()}
      />

      <MovieSection
        title="Popular"
        seeAllHref="/popular"
        layout="grid"
        movies={popular.data?.results}
        isLoading={popular.isLoading}
        error={popular.error}
        onRetry={() => void popular.refetch()}
      />

      <MovieSection
        title="Top Rated"
        seeAllHref="/top-rated"
        layout="grid"
        movies={topRated.data?.results}
        isLoading={topRated.isLoading}
        error={topRated.error}
        onRetry={() => void topRated.refetch()}
      />
    </div>
  );
}
