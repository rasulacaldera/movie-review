/**
 * Movies router — Express routes for /api/movies/*.
 * Handles request validation, error mapping to HTTP status codes.
 */

import { Router } from "express";
import { z } from "zod";
import { MoviesService } from "./movies.service.js";
import {
  MovieNotFoundError,
  TmdbUnavailableError,
  TmdbTimeoutError,
  TmdbMalformedResponseError,
} from "./errors.js";

const paginationSchema = z.object({
  page: z.coerce.number().int().positive().default(1),
});

const movieIdSchema = z.object({
  id: z.coerce.number().int().positive(),
});

const searchSchema = z.object({
  q: z.string().min(1, "Search query must not be empty"),
  page: z.coerce.number().int().positive().default(1),
});

/**
 * Map domain errors to HTTP responses.
 * Returns true if the error was handled, false otherwise.
 */
function handleDomainError(
  error: unknown,
  res: import("express").Response,
): boolean {
  if (error instanceof MovieNotFoundError) {
    res.status(404).json({ error: error.message });
    return true;
  }
  if (error instanceof TmdbTimeoutError) {
    res.status(504).json({ error: error.message });
    return true;
  }
  if (error instanceof TmdbMalformedResponseError) {
    res.status(502).json({ error: error.message });
    return true;
  }
  if (error instanceof TmdbUnavailableError) {
    res.status(502).json({ error: error.message });
    return true;
  }
  return false;
}

export function createMoviesRouter({
  moviesService,
}: {
  moviesService: MoviesService;
}): Router {
  const router = Router();

  router.get("/now-playing", async (req, res, next) => {
    try {
      const { page } = paginationSchema.parse(req.query);
      const result = await moviesService.getNowPlaying({ page });
      res.json(result);
    } catch (error) {
      if (handleDomainError(error, res)) return;
      next(error);
    }
  });

  router.get("/upcoming", async (req, res, next) => {
    try {
      const { page } = paginationSchema.parse(req.query);
      const result = await moviesService.getUpcoming({ page });
      res.json(result);
    } catch (error) {
      if (handleDomainError(error, res)) return;
      next(error);
    }
  });

  router.get("/popular", async (req, res, next) => {
    try {
      const { page } = paginationSchema.parse(req.query);
      const result = await moviesService.getPopular({ page });
      res.json(result);
    } catch (error) {
      if (handleDomainError(error, res)) return;
      next(error);
    }
  });

  router.get("/top-rated", async (req, res, next) => {
    try {
      const { page } = paginationSchema.parse(req.query);
      const result = await moviesService.getTopRated({ page });
      res.json(result);
    } catch (error) {
      if (handleDomainError(error, res)) return;
      next(error);
    }
  });

  router.get("/search", async (req, res, next) => {
    try {
      const { q, page } = searchSchema.parse(req.query);
      const result = await moviesService.searchMovies({ query: q, page });
      res.json(result);
    } catch (error) {
      if (handleDomainError(error, res)) return;
      next(error);
    }
  });

  router.get("/configuration", async (_req, res, next) => {
    try {
      const result = await moviesService.getConfiguration();
      res.json(result);
    } catch (error) {
      if (handleDomainError(error, res)) return;
      next(error);
    }
  });

  router.get("/:id", async (req, res, next) => {
    try {
      const { id } = movieIdSchema.parse(req.params);
      const result = await moviesService.getMovieDetail({ movieId: id });
      res.json(result);
    } catch (error) {
      if (handleDomainError(error, res)) return;
      next(error);
    }
  });

  router.get("/:id/credits", async (req, res, next) => {
    try {
      const { id } = movieIdSchema.parse(req.params);
      const result = await moviesService.getMovieCredits({ movieId: id });
      res.json(result);
    } catch (error) {
      if (handleDomainError(error, res)) return;
      next(error);
    }
  });

  router.get("/:id/videos", async (req, res, next) => {
    try {
      const { id } = movieIdSchema.parse(req.params);
      const result = await moviesService.getMovieVideos({ movieId: id });
      res.json(result);
    } catch (error) {
      if (handleDomainError(error, res)) return;
      next(error);
    }
  });

  router.get("/:id/similar", async (req, res, next) => {
    try {
      const { id } = movieIdSchema.parse(req.params);
      const { page } = paginationSchema.parse(req.query);
      const result = await moviesService.getSimilarMovies({
        movieId: id,
        page,
      });
      res.json(result);
    } catch (error) {
      if (handleDomainError(error, res)) return;
      next(error);
    }
  });

  return router;
}
