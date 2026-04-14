import express, { type Express } from "express";
import { requestContextMiddleware } from "./middleware/request-context.js";
import { domainErrorHandler } from "./middleware/domain-error-handler.js";
import { errorHandler } from "./middleware/error-handler.js";
import { createMoviesRouter } from "./domains/movies/movies.router.js";
import { MoviesService } from "./domains/movies/movies.service.js";

export function createApp({
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

  // Domain routes
  app.use("/api/movies", createMoviesRouter({ moviesService }));

  // app.use("/api/reviews", reviewsRouter);

  // Error handlers: domain-specific first, then generic fallback
  app.use(domainErrorHandler);
  app.use(errorHandler);

  return app;
}
