/**
 * Movies router — Express routes for /api/movies/*.
 * Validates requests via Zod; errors propagate to middleware (Express 5 auto-catches).
 */

import { Router } from "express";
import { z } from "zod";
import { MoviesService } from "./movies.service.js";

const paginationSchema = z.object({
  page: z.coerce.number().int().positive().max(500).default(1),
});

const movieIdSchema = z.object({
  id: z.coerce.number().int().positive(),
});

const searchSchema = z.object({
  q: z.string().min(1, "Search query must not be empty"),
  page: z.coerce.number().int().positive().max(500).default(1),
});

export function createMoviesRouter({
  moviesService,
}: {
  moviesService: MoviesService;
}): Router {
  const router = Router();

  router.get("/now-playing", async (req, res) => {
    const { page } = paginationSchema.parse(req.query);
    const result = await moviesService.getNowPlaying({ page });
    res.json(result);
  });

  router.get("/upcoming", async (req, res) => {
    const { page } = paginationSchema.parse(req.query);
    const result = await moviesService.getUpcoming({ page });
    res.json(result);
  });

  router.get("/popular", async (req, res) => {
    const { page } = paginationSchema.parse(req.query);
    const result = await moviesService.getPopular({ page });
    res.json(result);
  });

  router.get("/top-rated", async (req, res) => {
    const { page } = paginationSchema.parse(req.query);
    const result = await moviesService.getTopRated({ page });
    res.json(result);
  });

  router.get("/search", async (req, res) => {
    const { q, page } = searchSchema.parse(req.query);
    const result = await moviesService.searchMovies({ query: q, page });
    res.json(result);
  });

  router.get("/configuration", async (_req, res) => {
    const result = await moviesService.getConfiguration();
    res.json(result);
  });

  router.get("/:id", async (req, res) => {
    const { id } = movieIdSchema.parse(req.params);
    const result = await moviesService.getMovieDetail({ movieId: id });
    res.json(result);
  });

  router.get("/:id/credits", async (req, res) => {
    const { id } = movieIdSchema.parse(req.params);
    const result = await moviesService.getMovieCredits({ movieId: id });
    res.json(result);
  });

  router.get("/:id/videos", async (req, res) => {
    const { id } = movieIdSchema.parse(req.params);
    const result = await moviesService.getMovieVideos({ movieId: id });
    res.json(result);
  });

  router.get("/:id/similar", async (req, res) => {
    const { id } = movieIdSchema.parse(req.params);
    const { page } = paginationSchema.parse(req.query);
    const result = await moviesService.getSimilarMovies({
      movieId: id,
      page,
    });
    res.json(result);
  });

  return router;
}
