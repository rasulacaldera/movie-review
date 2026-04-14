# ADR-006: External API Gateway Pattern

**Date:** 2026-04-14
**Status:** Accepted

## Context

The MovieReviewApp integrates with TMDB (The Movie Database) as a read-only external HTTP API for movie catalog data. We needed to decide how to name and structure the adapter that communicates with TMDB.

The existing codebase uses the **Repository** pattern for database access (see ADR-005). However, TMDB is fundamentally different from a database repository:

- It is **read-only** (no writes, no transactions)
- It is an **external HTTP API** (network boundary, not a local data store)
- It has its own **response format** (snake_case, raw TMDB types) that must be normalized to domain types
- It is subject to **network failures** (timeouts, unavailability, malformed responses) that require different error handling than database errors

Calling it a "repository" would conflate two distinct concerns and mislead future developers about its capabilities and failure modes.

## Decision

External HTTP API integrations use the **Gateway** naming convention, not Repository. The gateway lives in the infrastructure layer, separate from domain logic.

```
src/
  infrastructure/
    tmdb/
      tmdb.gateway.ts      # HTTP client for TMDB API
      tmdb.types.ts         # Raw TMDB response types (internal)
  domains/
    movies/
      movies.service.ts     # Business logic, calls gateway
      movies.normalizer.ts  # TMDB response -> domain type mappers
      movies.types.ts       # Domain types (MovieSummary, MovieDetail, etc.)
```

### Key design rules

1. **Gateway is infrastructure, not domain.** It lives in `src/infrastructure/<provider>/`, not in a domain folder.
2. **Raw types stay internal.** TMDB response types (`tmdb.types.ts`) are not exported beyond the infrastructure layer. The normalizer converts them to domain types.
3. **Normalizers are pure functions.** They belong in the domain layer because they define how external data maps to domain concepts.
4. **Error mapping at the gateway level.** The gateway throws domain errors (`MovieNotFoundError`, `TmdbUnavailableError`, `TmdbTimeoutError`) so callers don't need to know about HTTP status codes.

### Gateway vs Repository naming guide

| Characteristic | Repository | Gateway |
|---------------|-----------|---------|
| Data source | Local database | External HTTP API |
| Read/Write | Both | Typically read-only |
| Failure modes | Connection pool, query errors | Timeouts, rate limits, unavailability |
| Response format | Already in app schema | Requires normalization |
| Naming | `*.repository.ts` | `*.gateway.ts` |
| Location | `src/domains/<feature>/` | `src/infrastructure/<provider>/` |

## Consequences

### Positive
- Clear semantic distinction between database access and external API integration
- Infrastructure layer isolation prevents domain contamination by external API formats
- Normalizer as a pure function layer is highly testable and reusable
- Future external APIs (e.g., streaming availability, movie ratings aggregators) follow the same pattern

### Negative
- One more naming convention to learn (Gateway vs Repository)
- Normalizer layer adds an extra transformation step for each response type

### Neutral
- Testing strategy uses MSW (Mock Service Worker) to stub gateway HTTP calls, consistent with the testing philosophy of mocking at external boundaries

## Enforcement

- Code review: any new external API integration must use the Gateway pattern
- File structure: external API adapters go in `src/infrastructure/<provider>/`
- Agent rules: AGENTS.md documents the Gateway vs Repository distinction
