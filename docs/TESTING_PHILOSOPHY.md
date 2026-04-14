# Testing Philosophy

## Core Principles

### Test Behavior, Not Implementation

Focus on **what** the code does, not **how** it does it. Tests should validate user-visible outcomes and contracts, enabling refactoring without rewriting tests.

### No "Should" in Test Names

Use present tense, active voice. Describe expected behavior directly.

| Avoid | Prefer |
|-------|--------|
| `it("should create review")` | `it("creates review for the movie")` |
| `it("should return movies")` | `it("returns movies matching the search query")` |

### Describe Block Naming

Use MDN-style naming for the unit under test:

| Type | Format | Example |
|------|--------|---------|
| Function | `name()` | `describe("submitReview()", ...)` |
| Class/Service | `Name` | `describe("MovieService", ...)` |
| Component | `<Name/>` | `describe("<ReviewCard/>", ...)` |
| Hook | `useName()` | `describe("useMovieSearch()", ...)` |

### Nested Describe for Context

Use nested `describe` blocks to group tests by context/condition:

```typescript
describe("MovieService", () => {
  describe("searchMovies()", () => {
    describe("given movies exist in the database", () => {
      describe("when searching by title", () => {
        it("returns movies matching the search query", () => { ... });
        it("orders results by relevance", () => { ... });
      });
    });

    describe("given no movies match", () => {
      it("returns an empty array", () => { ... });
    });
  });
});
```

### Single Expectation Per Test

Isolating assertions makes failures immediately clear. When multiple behaviors need testing, create separate tests.

## Coverage is Mandatory

Every change ships with tests. No exceptions.

- **Bug fixes** must include a regression test tagged `@regression`
- **New features** must have integration and/or unit tests covering all acceptance criteria
- **Refactors** must not reduce existing coverage

## Test Hierarchy

| Level | Purpose | Mocking | Quantity |
|-------|---------|---------|----------|
| **E2E** | Core happy path regression detection | None | 5-10 total (deprioritized) |
| **Browser Verification** | Interactive feature validation during development | None | Per-feature, not persisted |
| **Integration** | Edge cases, error handling, component rendering | External boundaries only | As many as needed |
| **Unit** | Pure logic, branches, transformations | Everything | As many as needed |

### E2E Tests: Deprioritized

Maintain a minimal stable suite (5-10 tests) covering established happy paths: sign in, browse movies, submit a review, view profile. These run on a schedule, not per PR.

Do **not** generate E2E tests per feature. Use interactive browser verification (`/browser-test`) during development. Integration and unit tests are the primary coverage mechanism.

### Language-Specific Patterns

| Type | E2E | Integration | Unit | Location |
|------|-----|-------------|------|----------|
| API (TypeScript) | `*.e2e.test.ts` | `*.int.test.ts` | `*.unit.test.ts` | colocated with source |
| Web (TypeScript) | `*.e2e.test.ts` | `*.int.test.tsx` | `*.unit.test.tsx` | colocated with source |

## Mocking Strategy

**Prefer stubs and environment simulation over mocks.**

- Use stubs for external services (TMDB API, auth providers, email services)
- Use real database in integration tests (test database, not mocks)
- Mock only at external boundaries

## Test Data

**Create minimal, context-specific data.**

```typescript
// Avoid: kitchen-sink fixtures
const movie = createFullMovie({ title, director, cast, genres, runtime, budget, ... })

// Prefer: minimal data for the test
const movie = { id: "mov1", title: "Inception", year: 2010 }
```

## Feature File Parity

Every scenario in a feature file must have a corresponding test implementation.

### Convention

| Feature file | Test file |
|-------------|-----------|
| `specs/MovieReviewApp/features/movies/movie-search.feature` | `MovieReviewApp/api/src/domains/movies/movie-search.int.test.ts` |
| `specs/MovieReviewApp/features/reviews/review-submission.feature` | `MovieReviewApp/web/src/domains/reviews/review-submission.int.test.tsx` |

### Tags

| Tag | Meaning | Use when |
|-----|---------|----------|
| `@unit` | Pure logic test | Testing functions, utilities, transformations |
| `@integration` | Component/boundary test | Rendering, API calls, DB queries |
| `@regression` | Prevents a fixed bug from recurring | Bug fix scenarios |
| `@e2e` | Stable core flow (deprioritized) | Only for the 5-10 stable happy-path tests |

## Decision Tree

Apply in order. Stop at first match.

```
Is this a core happy path of a stable, established feature?
  -> @e2e (only if not already covered by the stable suite)

Is this testing UI elements exist? (form fields, buttons, layout)
  -> @integration

Is this testing navigation/routing only?
  -> @integration

Is this testing error handling or edge cases?
  -> @integration (mock boundaries)

Is this a complete user workflow for a new/changing feature?
  -> @integration + /browser-test for visual verification

Is this pure logic in isolation?
  -> @unit

Is this a regression from production?
  -> Add at LOWEST sufficient level (unit > integration > e2e)
```

## Workflow

1. **Spec first**: Write a `.feature` file in `specs/`. Apply tags.
2. **Challenge**: `/challenge` finds missing edge cases before implementation.
3. **Implement**: Outside-in TDD. Red → Green → Refactor.
4. **Browser verify**: Use `/browser-test` to validate in a real browser.
