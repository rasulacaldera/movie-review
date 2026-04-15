/** React Query hooks for the movies domain. */

import { useQuery } from "@tanstack/react-query";
import {
  fetchPopularMovies,
  fetchNowPlayingMovies,
  fetchUpcomingMovies,
  fetchTopRatedMovies,
  fetchMovieDetails,
  fetchMovieCredits,
  fetchMovieVideos,
  fetchSimilarMovies,
  fetchImageConfig,
} from "./api.js";
import type { MovieVideo } from "./types.js";

/** Fetches popular movies with React Query. */
export function usePopularMovies(page = 1) {
  return useQuery({
    queryKey: ["movies", "popular", page],
    queryFn: () => fetchPopularMovies(page),
  });
}

/** Fetches now-playing movies with React Query. */
export function useNowPlayingMovies(page = 1) {
  return useQuery({
    queryKey: ["movies", "now-playing", page],
    queryFn: () => fetchNowPlayingMovies(page),
  });
}

/** Fetches upcoming movies with React Query. */
export function useUpcomingMovies(page = 1) {
  return useQuery({
    queryKey: ["movies", "upcoming", page],
    queryFn: () => fetchUpcomingMovies(page),
  });
}

/** Fetches top-rated movies with React Query. */
export function useTopRatedMovies(page = 1) {
  return useQuery({
    queryKey: ["movies", "top-rated", page],
    queryFn: () => fetchTopRatedMovies(page),
  });
}

/** Fetches full movie details by TMDB ID. */
export function useMovieDetail(id: number) {
  return useQuery({
    queryKey: ["movies", "detail", id],
    queryFn: () => fetchMovieDetails(id),
    enabled: id > 0,
  });
}

/** Fetches credits (cast + director) for a movie. */
export function useMovieCredits(id: number) {
  return useQuery({
    queryKey: ["movies", "credits", id],
    queryFn: () => fetchMovieCredits(id),
    enabled: id > 0,
  });
}

/** Video types shown in the trailers section. */
const TRAILER_TYPES = new Set(["Trailer", "Teaser"]);

/** Filters videos to trailers and teasers only. */
function filterTrailers(videos: MovieVideo[]): MovieVideo[] {
  return videos.filter((v) => TRAILER_TYPES.has(v.type));
}

/** Fetches YouTube videos for a movie, filtered to trailers and teasers. */
export function useMovieVideos(id: number) {
  return useQuery({
    queryKey: ["movies", "videos", id],
    queryFn: () => fetchMovieVideos(id),
    enabled: id > 0,
    select: filterTrailers,
  });
}

/** Fetches similar movies for a given movie. */
export function useSimilarMovies(id: number) {
  return useQuery({
    queryKey: ["movies", "similar", id],
    queryFn: () => fetchSimilarMovies(id),
    enabled: id > 0,
  });
}

/** Fetches and caches TMDB image configuration. */
export function useImageConfig() {
  return useQuery({
    queryKey: ["movies", "configuration"],
    queryFn: fetchImageConfig,
    staleTime: 24 * 60 * 60 * 1000, // image config rarely changes
  });
}
