/** Typed API functions for the movies domain. */

import { fetchApi } from "~/lib/api.js";
import type {
  MovieSummary,
  MovieDetail,
  PaginatedResult,
  ImageConfiguration,
} from "./types.js";

/** Fetches popular movies. */
export function fetchPopularMovies(
  page = 1,
): Promise<PaginatedResult<MovieSummary>> {
  return fetchApi<PaginatedResult<MovieSummary>>(
    `/api/movies/popular?page=${page}`,
  );
}

/** Fetches now-playing movies. */
export function fetchNowPlayingMovies(
  page = 1,
): Promise<PaginatedResult<MovieSummary>> {
  return fetchApi<PaginatedResult<MovieSummary>>(
    `/api/movies/now-playing?page=${page}`,
  );
}

/** Fetches upcoming movies. */
export function fetchUpcomingMovies(
  page = 1,
): Promise<PaginatedResult<MovieSummary>> {
  return fetchApi<PaginatedResult<MovieSummary>>(
    `/api/movies/upcoming?page=${page}`,
  );
}

/** Fetches top-rated movies. */
export function fetchTopRatedMovies(
  page = 1,
): Promise<PaginatedResult<MovieSummary>> {
  return fetchApi<PaginatedResult<MovieSummary>>(
    `/api/movies/top-rated?page=${page}`,
  );
}

/** Fetches full movie details by TMDB ID. */
export function fetchMovieDetails(id: number): Promise<MovieDetail> {
  return fetchApi<MovieDetail>(`/api/movies/${id}`);
}

/** Fetches TMDB image configuration (base URL + available sizes). */
export function fetchImageConfig(): Promise<ImageConfiguration> {
  return fetchApi<ImageConfiguration>("/api/movies/configuration");
}
