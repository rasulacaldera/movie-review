/**
 * Domain error handler middleware — maps domain and gateway errors to HTTP status codes.
 * Registered before the generic errorHandler so domain errors get proper status codes.
 */

import type { Request, Response, NextFunction } from "express";
import { MovieNotFoundError } from "../domains/movies/errors.js";
import {
  TmdbUnavailableError,
  TmdbTimeoutError,
  TmdbMalformedResponseError,
  TmdbNotFoundError,
} from "../infrastructure/tmdb/tmdb.errors.js";

export function domainErrorHandler(
  err: Error,
  _req: Request,
  res: Response,
  next: NextFunction,
): void {
  if (err instanceof MovieNotFoundError) {
    res.status(404).json({ error: err.message });
    return;
  }

  if (err instanceof TmdbNotFoundError) {
    res.status(404).json({ error: err.message });
    return;
  }

  if (err instanceof TmdbTimeoutError) {
    res.status(504).json({ error: err.message });
    return;
  }

  if (err instanceof TmdbMalformedResponseError) {
    res.status(502).json({ error: err.message });
    return;
  }

  if (err instanceof TmdbUnavailableError) {
    res.status(502).json({ error: err.message });
    return;
  }

  next(err);
}
