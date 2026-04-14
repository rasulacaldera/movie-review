/** React Query hooks for the movies domain. */

import { useQuery } from "@tanstack/react-query";
import {
  fetchPopularMovies,
  fetchNowPlayingMovies,
  fetchUpcomingMovies,
  fetchTopRatedMovies,
  fetchImageConfig,
} from "./api.js";

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

/** Fetches and caches TMDB image configuration. */
export function useImageConfig() {
  return useQuery({
    queryKey: ["movies", "configuration"],
    queryFn: fetchImageConfig,
    staleTime: 24 * 60 * 60 * 1000, // image config rarely changes
  });
}
