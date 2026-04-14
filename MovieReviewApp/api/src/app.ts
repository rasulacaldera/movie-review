import express, { type Express } from "express";
import { requestContextMiddleware } from "./middleware/request-context.js";
import { errorHandler } from "./middleware/error-handler.js";

export function createApp(): Express {
  const app = express();

  app.use(express.json());
  app.use(requestContextMiddleware);

  app.get("/health", (_req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
  });

  // Domain routes will be mounted here:
  // app.use("/api/movies", moviesRouter);
  // app.use("/api/reviews", reviewsRouter);

  app.use(errorHandler);

  return app;
}
