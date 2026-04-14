/**
 * TMDB Gateway — HTTP adapter for the TMDB API.
 * Read-only, uses native fetch with bearer token auth.
 */

import { createLogger } from "../../utils/logger.js";
import {
  TmdbUnavailableError,
  TmdbTimeoutError,
  TmdbMalformedResponseError,
  TmdbNotFoundError,
} from "./tmdb.errors.js";
import type {
  TmdbPaginatedResponse,
  TmdbMovieListItem,
  TmdbMovieDetail,
  TmdbCreditsResponse,
  TmdbVideosResponse,
  TmdbImageConfiguration,
} from "./tmdb.types.js";

const logger = createLogger("tmdb-gateway");

const REQUEST_TIMEOUT_MS = 5_000;

interface TmdbGatewayConfig {
  baseUrl: string;
  readAccessToken: string;
}

export class TmdbGateway {
  private readonly baseUrl: string;
  private readonly readAccessToken: string;

  constructor(config: TmdbGatewayConfig) {
    this.baseUrl = config.baseUrl;
    this.readAccessToken = config.readAccessToken;
  }

  /** Fetch a paginated list of now-playing movies. */
  async getNowPlaying({
    page = 1,
  }: {
    page?: number;
  }): Promise<TmdbPaginatedResponse<TmdbMovieListItem>> {
    return this.get<TmdbPaginatedResponse<TmdbMovieListItem>>(
      "/movie/now_playing",
      { page: String(page) },
    );
  }

  /** Fetch a paginated list of upcoming movies. */
  async getUpcoming({
    page = 1,
  }: {
    page?: number;
  }): Promise<TmdbPaginatedResponse<TmdbMovieListItem>> {
    return this.get<TmdbPaginatedResponse<TmdbMovieListItem>>(
      "/movie/upcoming",
      { page: String(page) },
    );
  }

  /** Fetch a paginated list of popular movies. */
  async getPopular({
    page = 1,
  }: {
    page?: number;
  }): Promise<TmdbPaginatedResponse<TmdbMovieListItem>> {
    return this.get<TmdbPaginatedResponse<TmdbMovieListItem>>(
      "/movie/popular",
      { page: String(page) },
    );
  }

  /** Fetch a paginated list of top-rated movies. */
  async getTopRated({
    page = 1,
  }: {
    page?: number;
  }): Promise<TmdbPaginatedResponse<TmdbMovieListItem>> {
    return this.get<TmdbPaginatedResponse<TmdbMovieListItem>>(
      "/movie/top_rated",
      { page: String(page) },
    );
  }

  /** Fetch details for a single movie by TMDB ID. */
  async getMovieDetail({
    movieId,
  }: {
    movieId: number;
  }): Promise<TmdbMovieDetail> {
    return this.get<TmdbMovieDetail>(`/movie/${movieId}`);
  }

  /** Fetch credits for a movie by TMDB ID. */
  async getMovieCredits({
    movieId,
  }: {
    movieId: number;
  }): Promise<TmdbCreditsResponse> {
    return this.get<TmdbCreditsResponse>(`/movie/${movieId}/credits`);
  }

  /** Fetch videos for a movie by TMDB ID. */
  async getMovieVideos({
    movieId,
  }: {
    movieId: number;
  }): Promise<TmdbVideosResponse> {
    return this.get<TmdbVideosResponse>(`/movie/${movieId}/videos`);
  }

  /** Fetch similar movies for a movie by TMDB ID. */
  async getSimilarMovies({
    movieId,
    page = 1,
  }: {
    movieId: number;
    page?: number;
  }): Promise<TmdbPaginatedResponse<TmdbMovieListItem>> {
    return this.get<TmdbPaginatedResponse<TmdbMovieListItem>>(
      `/movie/${movieId}/similar`,
      { page: String(page) },
    );
  }

  /** Search movies by query string. */
  async searchMovies({
    query,
    page = 1,
  }: {
    query: string;
    page?: number;
  }): Promise<TmdbPaginatedResponse<TmdbMovieListItem>> {
    return this.get<TmdbPaginatedResponse<TmdbMovieListItem>>(
      "/search/movie",
      { query, page: String(page) },
    );
  }

  /** Fetch TMDB image configuration (base URLs and sizes). */
  async getConfiguration(): Promise<TmdbImageConfiguration> {
    return this.get<TmdbImageConfiguration>("/configuration");
  }

  /**
   * Generic GET request to the TMDB API.
   * Handles auth, timeout, and error mapping.
   */
  private async get<T>(
    path: string,
    params?: Record<string, string>,
  ): Promise<T> {
    const url = new URL(`${this.baseUrl}${path}`);
    if (params) {
      for (const [key, value] of Object.entries(params)) {
        url.searchParams.set(key, value);
      }
    }

    let response: Response;
    try {
      response = await fetch(url.toString(), {
        method: "GET",
        headers: {
          Authorization: `Bearer ${this.readAccessToken}`,
          Accept: "application/json",
        },
        signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
      });
    } catch (error) {
      if (
        error instanceof DOMException &&
        error.name === "TimeoutError"
      ) {
        logger.error({ path }, "TMDB request timed out");
        throw new TmdbTimeoutError();
      }
      logger.error({ path, error }, "TMDB request failed");
      throw new TmdbUnavailableError();
    }

    if (response.status === 404) {
      throw new TmdbNotFoundError(`TMDB resource not found: ${path}`);
    }

    if (!response.ok) {
      logger.error(
        { path, status: response.status },
        "TMDB returned non-OK status",
      );
      throw new TmdbUnavailableError(
        `TMDB API returned status ${response.status}`,
      );
    }

    try {
      return (await response.json()) as T;
    } catch (error) {
      logger.error({ path, error }, "Failed to parse TMDB response JSON");
      throw new TmdbMalformedResponseError();
    }
  }
}
