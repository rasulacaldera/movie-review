/**
 * Normalizers that convert raw TMDB responses into domain types.
 * Pure functions — no side effects, no I/O.
 */

import type {
  TmdbMovieListItem,
  TmdbPaginatedResponse,
  TmdbMovieDetail,
  TmdbCreditsResponse,
  TmdbVideosResponse,
  TmdbImageConfiguration,
} from "../../infrastructure/tmdb/tmdb.types.js";
import { TMDB_GENRE_MAP } from "../../infrastructure/tmdb/tmdb.types.js";
import type {
  MovieSummary,
  PaginatedResult,
  MovieDetail,
  MovieCredits,
  CastMember,
  MovieVideo,
  ImageConfiguration,
} from "./movies.types.js";

/** Extract year from a TMDB release_date string (e.g. "2010-07-16"). */
function extractYear(releaseDate: string): number | null {
  if (!releaseDate) return null;
  const year = parseInt(releaseDate.substring(0, 4), 10);
  return Number.isNaN(year) ? null : year;
}

/** Map an array of TMDB genre IDs to genre name strings. */
function mapGenreIds(genreIds: number[]): string[] {
  return genreIds
    .map((id) => TMDB_GENRE_MAP[id])
    .filter((name): name is string => name !== undefined);
}

/** Normalize a single TMDB movie list item to a MovieSummary. */
export function normalizeMovieSummary(item: TmdbMovieListItem): MovieSummary {
  return {
    tmdbId: item.id,
    title: item.title,
    year: extractYear(item.release_date),
    posterPath: item.poster_path,
    rating: item.vote_average,
    releaseDate: item.release_date,
    genres: mapGenreIds(item.genre_ids),
  };
}

/** Normalize a paginated TMDB movie list response. */
export function normalizeMovieList(
  response: TmdbPaginatedResponse<TmdbMovieListItem>,
): PaginatedResult<MovieSummary> {
  return {
    results: response.results.map(normalizeMovieSummary),
    page: response.page,
    totalPages: response.total_pages,
    totalResults: response.total_results,
  };
}

/** Normalize a TMDB movie detail response to a MovieDetail. */
export function normalizeMovieDetail(detail: TmdbMovieDetail): MovieDetail {
  return {
    tmdbId: detail.id,
    title: detail.title,
    year: extractYear(detail.release_date),
    synopsis: detail.overview,
    genres: detail.genres.map((g) => g.name),
    runtime: detail.runtime,
    releaseDate: detail.release_date,
    posterPath: detail.poster_path,
    backdropPath: detail.backdrop_path,
    tmdbRating: detail.vote_average,
  };
}

/** Normalize a single TMDB cast member. */
function normalizeCastMember(member: {
  name: string;
  character: string;
  profile_path: string | null;
}): CastMember {
  return {
    name: member.name,
    character: member.character,
    profilePath: member.profile_path,
  };
}

/** Normalize TMDB credits response, extracting cast and director. */
export function normalizeCredits(response: TmdbCreditsResponse): MovieCredits {
  const director =
    response.crew.find((member) => member.job === "Director")?.name ?? null;
  return {
    cast: response.cast.map(normalizeCastMember),
    director,
  };
}

/** Normalize TMDB videos response, filtering to YouTube trailers only. */
export function normalizeVideos(response: TmdbVideosResponse): MovieVideo[] {
  return response.results
    .filter((video) => video.site === "YouTube")
    .map((video) => ({
      name: video.name,
      youtubeKey: video.key,
      type: video.type,
    }));
}

/** Normalize TMDB image configuration response. */
export function normalizeImageConfiguration(
  response: TmdbImageConfiguration,
): ImageConfiguration {
  return {
    baseUrl: response.images.secure_base_url,
    posterSizes: response.images.poster_sizes,
    backdropSizes: response.images.backdrop_sizes,
  };
}
