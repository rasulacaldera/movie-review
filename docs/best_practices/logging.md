# Logging

Structured logging with automatic context propagation.

## Principles

- **Structured over interpolated.** Pass objects, not string concatenation.
- **Context automatically propagated.** Request-scoped data (userId, groupId, requestId) injected via middleware — don't pass it manually.
- **Object first.** Most loggers (Pino, Winston) use `(object, message)` signature, not `(message, object)`.

## Anti-Patterns

| Don't | Do |
|-------|-----|
| `logger.info("User " + userId + " logged in")` | `logger.info({ userId }, "User logged in")` |
| `logger.error("Error: " + err.message)` | `logger.error({ error: err }, "Operation failed")` |
| `logger.info({ password, token }, "...")` | Never log sensitive data |
| `logger.info("msg", { data })` | `logger.info({ data }, "msg")` — object first |
| Manually passing requestId everywhere | Let middleware inject context automatically |

## Setup Pattern

### Request Context Middleware (Express)

Attach context at the start of every request so it's available to all downstream log calls:

```typescript
// src/middleware/logger.middleware.ts
import { AsyncLocalStorage } from 'async_hooks';

interface LogContext {
  requestId: string;
  userId?: string;
  groupId?: string;
}

const storage = new AsyncLocalStorage<LogContext>();

export function loggerMiddleware(req: Request, res: Response, next: NextFunction) {
  const context: LogContext = {
    requestId: req.headers['x-request-id'] as string ?? crypto.randomUUID(),
  };
  storage.run(context, next);
}

export function getLogContext(): LogContext | undefined {
  return storage.getStore();
}

export function updateLogContext(patch: Partial<LogContext>): void {
  const ctx = storage.getStore();
  if (ctx) Object.assign(ctx, patch);
}
```

### Logger Factory

```typescript
// src/utils/logger.ts
import pino from 'pino';
import { getLogContext } from '../middleware/logger.middleware';

export function createLogger(name: string) {
  return pino({
    name,
    mixin() {
      return getLogContext() ?? {};
    },
  });
}
```

### Usage

```typescript
import { createLogger } from '~/utils/logger';

const logger = createLogger('game-service');

// Context (requestId, userId, groupId) automatically included
logger.info({ gameId }, 'Game marked as played');
logger.error({ error, gameId }, 'Failed to deduct fees');
```

### Update Context After Auth

```typescript
// After verifying JWT and loading user/group
updateLogContext({ userId: user.id, groupId: req.params.groupId });
```

## Background Jobs

Context must be explicitly propagated to jobs since they run outside the request lifecycle:

```typescript
// When enqueuing a job — capture current context
const context = getLogContext();
await queue.add('deduct-fees', { gameId, _context: context });

// In worker — restore context
worker.process(async (job) => {
  const { _context, ...data } = job.data;
  // Run with restored context so logs include original requestId/userId
  storage.run(_context ?? {}, async () => {
    logger.info({ gameId: data.gameId }, 'Processing fee deduction job');
    // ...
  });
});
```

## Log Levels

| Level | When to use |
|-------|-------------|
| `error` | Something failed and needs attention |
| `warn` | Unexpected state, but recoverable |
| `info` | Significant business events (game played, payment sent) |
| `debug` | Detailed flow information for debugging |

Never use `info` for routine per-request noise — that's `debug`.

## What Not to Log

- Passwords, tokens, API keys, secrets
- Full request/response bodies (use sampling or redaction)
- PII that isn't needed for debugging (e.g. full names, email addresses in high-volume logs)
