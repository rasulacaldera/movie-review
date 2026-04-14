# Repository + Service Pattern

Separate data access (Repository) from business logic (Service).

> "The Repository doesn't care which component is invoking it; it blindly does what it is asked. The Service layer doesn't care how it gets accessed, it just does its work, using a Repository where required."

## The Three Layers

```
┌─────────────────────────────────────────────────────────────┐
│  API Layer (Router/Controller)                              │
│  Translates HTTP requests → domain calls.                   │
│  Handles auth, request validation, error mapping to HTTP.   │
├─────────────────────────────────────────────────────────────┤
│  Domain Layer (Service + Repository)                        │
│  The core. Business rules, orchestration, data access.      │
│  Imports from nobody — API and UI import from here.         │
├─────────────────────────────────────────────────────────────┤
│  UI Layer (Components)                                      │
│  Translates domain data → things users see and click.       │
│  Fetches data via API layer.                                │
└─────────────────────────────────────────────────────────────┘
```

**Key rule:** Dependencies flow inward. The domain layer never imports from the API or UI layers. If a type or utility is needed by both the API router and the domain service, it belongs in the domain layer.

## Why This Pattern

1. **Separation of concerns** — each layer has one job
2. **Testability** — integration tests use real DB; unit tests cover pure logic only
3. **Clarity** — obvious where new code goes
4. **Flexibility** — swap implementations without affecting other layers

## Layer Responsibilities

| Layer | Responsibility | Examples |
|-------|----------------|----------|
| Router/Controller | Request/response handling, auth, error mapping | `games.router.ts`, `members.router.ts` |
| Service | Business logic, orchestration, validation | `GameService`, `MemberService` |
| Repository | Pure data access (CRUD), no business logic | `GameRepository`, `MemberRepository` |

## Repository Layer

Thin wrapper over the database. No business logic.

```typescript
// src/games/game.repository.ts
export class GameRepository {
  constructor(private readonly db: DrizzleDb) {}

  async findOne({ id, groupId }: { id: string; groupId: string }): Promise<Game | null> {
    const results = await this.db
      .select()
      .from(games)
      .where(and(eq(games.id, id), eq(games.groupId, groupId)))
      .limit(1);
    return results[0] ?? null;
  }

  async create(input: CreateGameInput): Promise<Game> {
    const results = await this.db.insert(games).values(input).returning();
    return results[0];
  }
}
```

**Repository rules:**
- Constructor takes only database client
- Methods are simple CRUD operations
- No business validation or default resolution
- Always scope by `groupId` for group-scoped entities

## Service Layer

Business logic, orchestration, default resolution.

```typescript
// src/games/game.service.ts
export class GameService {
  constructor(
    private readonly db: DrizzleDb,
    private readonly gameRepository: GameRepository,
    private readonly transactionRepository: TransactionRepository,
  ) {}

  static create(db: DrizzleDb): GameService {
    return new GameService(db, new GameRepository(db), new TransactionRepository(db));
  }

  async markAsPlayed({ id, groupId }: { id: string; groupId: string }): Promise<void> {
    const game = await this.gameRepository.findOne({ id, groupId });
    if (!game) throw new GameNotFoundError();
    if (game.status !== 'upcoming') throw new GameAlreadyPlayedError();

    // Orchestrate: update game + create fee transactions atomically
    await this.db.transaction(async (tx) => {
      // ... business logic
    });
  }
}
```

**Service rules:**
- Use `static create()` factory method for instantiation
- Orchestrate multiple repositories
- Apply business rules and validation
- Throw domain-specific errors (see below)

## Domain Errors

Services throw framework-agnostic errors that routers map to HTTP errors:

```typescript
// src/games/errors.ts
export class GameNotFoundError extends Error {
  constructor(message = "Game not found") {
    super(message);
    this.name = "GameNotFoundError";
  }
}

export class GameAlreadyPlayedError extends Error {
  constructor(message = "Game is already played") {
    super(message);
    this.name = "GameAlreadyPlayedError";
  }
}
```

```typescript
// In router — map domain errors to HTTP responses
try {
  await gameService.markAsPlayed({ id, groupId });
  res.status(200).json({ ok: true });
} catch (error) {
  if (error instanceof GameNotFoundError) return res.status(404).json({ error: error.message });
  if (error instanceof GameAlreadyPlayedError) return res.status(409).json({ error: error.message });
  throw error;
}
```

## File Structure

```
src/<feature>/
  <feature>.repository.ts     # Data access
  <feature>.service.ts        # Business logic
  errors.ts                   # Domain errors
  types.ts                    # Domain types (Zod schemas + inferred types)
```

## Where Types Belong

Domain types live in the domain layer, not in the API layer.

```typescript
// GOOD: Domain type in domain layer
// src/games/types.ts
export const createGameSchema = z.object({
  leagueId: z.string().uuid(),
  scheduledAt: z.string().datetime(),
  fee: z.number().positive(),
});
export type CreateGameInput = z.infer<typeof createGameSchema>;

// Router imports from domain
// src/api/games.router.ts
import { createGameSchema } from "../games/types";
```

**Rule:** If a type represents a business concept, it belongs in the domain layer. Request-specific validation messages can stay in the router.

## Decision Checklist

| Question | Answer |
|----------|--------|
| Is it storage/retrieval? | Repository |
| Is it exposing functionality (HTTP)? | Router/Controller |
| Is it unique business logic? | Service |
| Need CRUD only? | Repository |
| Need to orchestrate multiple entities? | Service |
| Need validation beyond schema? | Service |

## Testing

| Test Type | What to Test | Database |
|-----------|--------------|----------|
| **Integration** | Service + Repository together | Real (test DB) |
| **Unit** | Pure logic only (transformations, calculations) | None needed |

Avoid mocking repositories in service tests — it tests implementation details. Use a real test database.
