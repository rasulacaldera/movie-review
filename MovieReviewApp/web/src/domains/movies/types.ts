/** Frontend domain types for movies. Mirrors API response shapes. */

/** Summary of a movie, used in list/search results. */
export interface MovieSummary {
  tmdbId: number;
  title: string;
  year: number | null;
  posterPath: string | null;
  tmdbRating: number;
  releaseDate: string;
  genres: string[];
}

/** Full movie details. */
export interface MovieDetail {
  tmdbId: number;
  title: string;
  year: number | null;
  synopsis: string;
  genres: string[];
  runtime: number;
  releaseDate: string;
  posterPath: string | null;
  backdropPath: string | null;
  tmdbRating: number;
}

/** Paginated list response wrapper. */
export interface PaginatedResult<T> {
  results: T[];
  page: number;
  totalPages: number;
  totalResults: number;
}

/** TMDB image configuration. */
export interface ImageConfiguration {
  baseUrl: string;
  posterSizes: string[];
  backdropSizes: string[];
}
