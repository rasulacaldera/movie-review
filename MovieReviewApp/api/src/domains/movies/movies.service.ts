/**
 * Movies service — orchestrates TMDB gateway calls and normalization.
 * Pure TMDB passthrough for now; local review merging deferred to #13/#14.
 */

import { TmdbGateway } from "../../infrastructure/tmdb/tmdb.gateway.js";
import { TmdbNotFoundError } from "../../infrastructure/tmdb/tmdb.errors.js";
import { MovieNotFoundError } from "./errors.js";
import {
  normalizeMovieList,
  normalizeMovieDetail,
  normalizeCredits,
  normalizeVideos,
  normalizeImageConfiguration,
} from "./movies.normalizer.js";
import type {
  PaginatedResult,
  MovieSummary,
  MovieDetail,
  MovieCredits,
  MovieVideo,
  ImageConfiguration,
} from "./movies.types.js";

export class MoviesService {
  constructor(private readonly gateway: TmdbGateway) {}

  static create(gateway: TmdbGateway): MoviesService {
    return new MoviesService(gateway);
  }

  async getNowPlaying({
    page,
  }: {
    page: number;
  }): Promise<PaginatedResult<MovieSummary>> {
    const raw = await this.gateway.getNowPlaying({ page });
    return normalizeMovieList(raw);
  }

  async getUpcoming({
    page,
  }: {
    page: number;
  }): Promise<PaginatedResult<MovieSummary>> {
    const raw = await this.gateway.getUpcoming({ page });
    return normalizeMovieList(raw);
  }

  async getPopular({
    page,
  }: {
    page: number;
  }): Promise<PaginatedResult<MovieSummary>> {
    const raw = await this.gateway.getPopular({ page });
    return normalizeMovieList(raw);
  }

  async getTopRated({
    page,
  }: {
    page: number;
  }): Promise<PaginatedResult<MovieSummary>> {
    const raw = await this.gateway.getTopRated({ page });
    return normalizeMovieList(raw);
  }

  async getMovieDetail({
    movieId,
  }: {
    movieId: number;
  }): Promise<MovieDetail> {
    try {
      const raw = await this.gateway.getMovieDetail({ movieId });
      return normalizeMovieDetail(raw);
    } catch (error) {
      if (error instanceof TmdbNotFoundError) {
        throw new MovieNotFoundError(movieId);
      }
      throw error;
    }
  }

  async getMovieCredits({
    movieId,
  }: {
    movieId: number;
  }): Promise<MovieCredits> {
    try {
      const raw = await this.gateway.getMovieCredits({ movieId });
      return normalizeCredits(raw);
    } catch (error) {
      if (error instanceof TmdbNotFoundError) {
        throw new MovieNotFoundError(movieId);
      }
      throw error;
    }
  }

  async getMovieVideos({
    movieId,
  }: {
    movieId: number;
  }): Promise<MovieVideo[]> {
    try {
      const raw = await this.gateway.getMovieVideos({ movieId });
      return normalizeVideos(raw);
    } catch (error) {
      if (error instanceof TmdbNotFoundError) {
        throw new MovieNotFoundError(movieId);
      }
      throw error;
    }
  }

  async getSimilarMovies({
    movieId,
    page,
  }: {
    movieId: number;
    page: number;
  }): Promise<PaginatedResult<MovieSummary>> {
    try {
      const raw = await this.gateway.getSimilarMovies({ movieId, page });
      return normalizeMovieList(raw);
    } catch (error) {
      if (error instanceof TmdbNotFoundError) {
        throw new MovieNotFoundError(movieId);
      }
      throw error;
    }
  }

  async searchMovies({
    query,
    page,
  }: {
    query: string;
    page: number;
  }): Promise<PaginatedResult<MovieSummary>> {
    const raw = await this.gateway.searchMovies({ query, page });
    return normalizeMovieList(raw);
  }

  async getConfiguration(): Promise<ImageConfiguration> {
    const raw = await this.gateway.getConfiguration();
    return normalizeImageConfiguration(raw);
  }
}
