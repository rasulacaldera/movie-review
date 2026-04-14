import express, { type Express } from "express";
import { requestContextMiddleware } from "./middleware/request-context.js";
import { errorHandler } from "./middleware/error-handler.js";
import { createMoviesRouter } from "./domains/movies/movies.router.js";
import { MoviesService } from "./domains/movies/movies.service.js";
import { TmdbGateway } from "./infrastructure/tmdb/tmdb.gateway.js";
import { config } from "./config.js";

export function createApp(): Express {
  const app = express();

  app.use(express.json());
  app.use(requestContextMiddleware);

  app.get("/health", (_req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
  });

  // Domain routes
  const tmdbGateway = new TmdbGateway({
    baseUrl: config.TMDB_BASE_URL,
    readAccessToken: config.TMDB_READ_ACCESS_TOKEN,
  });
  const moviesService = MoviesService.create(tmdbGateway);
  app.use("/api/movies", createMoviesRouter({ moviesService }));

  // app.use("/api/reviews", reviewsRouter);

  app.use(errorHandler);

  return app;
}

/**
 * Create an Express app with injected dependencies.
 * Used in integration tests to provide a test-configured gateway.
 */
export function createTestApp({
  moviesService,
}: {
  moviesService: MoviesService;
}): Express {
  const app = express();

  app.use(express.json());
  app.use(requestContextMiddleware);

  app.get("/health", (_req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
  });

  app.use("/api/movies", createMoviesRouter({ moviesService }));

  app.use(errorHandler);

  return app;
}
