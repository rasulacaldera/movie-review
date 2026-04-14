# AI Assisted Development Monorepo

Full-stack applications built with AI-assisted workflows. Start with feature specs, implement with TDD, verify with real browsers.

## Before You Implement Anything

**Check `specs/<AppName>/` first.** Feature files ARE the requirements.

```
ls specs/MovieReviewApp/
cat specs/MovieReviewApp/features/movies/movie-search.feature
```

If no feature file exists for your task, create one before writing code. If you are lost or have been implementing without checking specs, run `/refocus`.

## Applications

```
MovieReviewApp/     # Movie review web application
  api/              # Node.js + Express + TypeScript backend
  web/              # React + TypeScript frontend
```

## Development Commands

### MovieReviewApp/api
```bash
npm run dev          # Start API in watch mode
npm run build        # Compile TypeScript
npm run typecheck    # Type check only
npm run test:unit    # Unit tests
npm run test:int     # Integration tests
npm run db:migrate   # Run pending migrations
npm run db:studio    # Open Drizzle Studio
```

### MovieReviewApp/web
```bash
npm run dev          # Start Vite dev server
npm run build        # Production build
npm run typecheck    # Type check
npm run test:unit    # Unit tests
npm run test:int     # Integration tests
```

## Local Development Setup

### Prerequisites
- Docker Desktop (or Docker + Docker Compose)
- Node 22, pnpm 9

### Start the database
```bash
cd MovieReviewApp
docker compose up postgres -d
```

### Run the API
```bash
cd MovieReviewApp/api
cp .env.example .env   # first time only
npm run dev
```

### Run the web
```bash
cd MovieReviewApp/web
cp .env.example .env   # first time only
npm run dev
```

### Run migrations
```bash
cd MovieReviewApp/api
npm run db:migrate
```

## Structure

```
MovieReviewApp/                     # Movie review app
specs/
  MovieReviewApp/                   # App-specific BDD feature specs
docs/
  CODING_STANDARDS.md               # Generic: SOLID, CUPID, clean code
  TESTING_PHILOSOPHY.md             # Generic: test hierarchy, BDD workflow
  best_practices/                   # Generic: TypeScript, React conventions
  adr/                              # Generic: cross-cutting Architecture Decision Records
  MovieReviewApp/                   # App-specific: domain guide, gotchas, ADRs
    DOMAIN_GUIDE.md                 # Domain model, invariants, business rules
    GOTCHAS.md                      # Common mistakes specific to this app
    adr/                            # App-specific Architecture Decision Records
    best_practices/                 # App-specific patterns (Drizzle, Express, etc.)
```

## Diagrams

Use **Mermaid** for all diagrams in ADRs and documentation. GitHub and most editors render Mermaid fenced code blocks natively.

```markdown
​```mermaid
flowchart TD
    A --> B
​```
```

Diagram types to use:
| Use case | Mermaid type |
|----------|-------------|
| System/deployment topology | `flowchart TD` |
| Data model / entity relationships | `erDiagram` |
| State machines / lifecycles | `stateDiagram-v2` |
| Sequence / request flow | `sequenceDiagram` |

---

## Key References

### Monorepo-wide
- `docs/CODING_STANDARDS.md` — clean code, SOLID + CUPID principles
- `docs/TESTING_PHILOSOPHY.md` — test hierarchy, BDD workflow
- `docs/best_practices/` — TypeScript, React conventions
- `docs/adr/` — cross-cutting Architecture Decision Records

### MovieReviewApp-specific
- `docs/MovieReviewApp/DOMAIN_GUIDE.md` — domain model, business rules, invariants
- `docs/MovieReviewApp/GOTCHAS.md` — common mistakes for this app
- `docs/MovieReviewApp/adr/` — app-specific architectural decisions
- `specs/MovieReviewApp/` — feature files (requirements source of truth)

## Common Mistakes

| Common Mistake | Correct Behavior |
|----------------|------------------|
| Building from scratch without checking existing code | Search the codebase first — follow existing patterns, extend existing systems, reuse existing abstractions |
| Implementing without checking feature files | Check `specs/<AppName>/` for existing feature files first — they ARE the requirements. If none exists, create one before coding |
| Using "should" in test descriptions | Use action-based descriptions: `it("checks local first")` not `it("should check local first")` |
| Describe blocks without "when" context | Inner describe blocks must use "when" conditions: `describe("when user submits", () => ...)` not `describe("submit behavior", ...)` |
| Flat test structure with GWT comments | Use nested `describe("given X")` and `describe("when Y")` blocks for BDD structure, not comments |
| Code before tests | Outside-In TDD: spec → test → code |
| Tests after TODO list | BDD specs come first |
| Shared types in `types.ts` | Colocate unless truly shared |
| Duplicating Zod + TS types | When you need both validation AND types, use Zod only with `infer`. For internal constants (no external input), `as const` is sufficient |
| Skipping test run after edits | Always run tests after any code change to catch regressions immediately |
| Completing a sprint or ADR change without updating APP_SPEC.md | After any sprint, auth change, infra change, or new ADR — update `specs/<AppName>/APP_SPEC.md` to reflect current state (tech stack, architecture, invariants, phased delivery, file locations) |
| Using `any` in TypeScript | Never. Use proper types, generics, or `unknown` with narrowing |
| Returning JSX from hooks | Hooks return state and callbacks, never JSX |

For app-specific common mistakes, see `docs/<AppName>/GOTCHAS.md`.

## TypeScript

| Common Mistake | Correct Behavior |
|----------------|------------------|
| Creating shared types for single-use interfaces | Colocate interfaces with their usage; only extract to `types.ts` when shared across multiple files |
| Using positional parameters for functions with multiple args | Use named parameters via object destructuring: `fn({ a, b })` not `fn(a, b)` |
| `any` types | Use `unknown` with narrowing, or proper generics |

## Orchestration Model

Implementation tasks use `/orchestrate` to manage work. The orchestrator detects whether an issue is a **bug fix** or a **feature** and selects the appropriate workflow.

- `/orchestrate <requirements>` - Enter orchestration mode
- `/implement #123` - Fetch GitHub issue → invoke `/orchestrate`

**Feature workflow:** spec → challenge → approve → code → review → browser-verify
**Bug-fix workflow:** investigate → fix → verify → review → browser-verify

Agents:
- **coder** (`.claude/agents/coder.md`): Implements features with TDD.
- **reviewer** (`.claude/agents/reviewer.md`): Reviews code for SOLID/CUPID/clean code.
- **repo-sherpa** (`.claude/agents/repo-sherpa.md`): Owns docs, agents, DX, meta-layer.
- **devils-advocate** (`.claude/agents/devils-advocate.md`): Stress-tests proposals and plans.

See `.claude/README.md` for full orchestration documentation.
