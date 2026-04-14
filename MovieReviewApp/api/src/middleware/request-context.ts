import { AsyncLocalStorage } from "node:async_hooks";
import crypto from "node:crypto";
import type { Request, Response, NextFunction } from "express";

interface RequestContext {
  requestId: string;
  userId?: string;
}

const storage = new AsyncLocalStorage<RequestContext>();

export function requestContextMiddleware(
  req: Request,
  _res: Response,
  next: NextFunction,
): void {
  const context: RequestContext = {
    requestId:
      (req.headers["x-request-id"] as string) ?? crypto.randomUUID(),
  };
  storage.run(context, next);
}

export function getRequestContext(): RequestContext | undefined {
  return storage.getStore();
}

export function updateRequestContext(
  patch: Partial<RequestContext>,
): void {
  const ctx = storage.getStore();
  if (ctx) Object.assign(ctx, patch);
}
