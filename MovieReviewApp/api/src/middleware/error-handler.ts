import type { Request, Response, NextFunction } from "express";
import { ZodError } from "zod";
import { createLogger } from "../utils/logger.js";

const logger = createLogger("error-handler");

export function errorHandler(
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction,
): void {
  if (err instanceof ZodError) {
    res.status(400).json({
      error: "Validation error",
      details: err.issues,
    });
    return;
  }

  logger.error({ error: err }, "Unhandled error");

  res.status(500).json({
    error:
      process.env["NODE_ENV"] === "production"
        ? "Internal server error"
        : err.message,
  });
}
