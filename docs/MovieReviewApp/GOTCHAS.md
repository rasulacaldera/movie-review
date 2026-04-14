# MovieReviewApp -- Common Gotchas

Mistakes specific to this application. For generic coding mistakes, see the Common Mistakes table in AGENTS.md.

## Database

| Gotcha | Fix |
|--------|-----|
| Forgetting to run migrations after pulling | `cd MovieReviewApp/api && npm run db:migrate` |
| Schema changes without generating migration | Run `npm run db:generate` first, then `npm run db:migrate` |
| Using `pg` driver instead of `postgres` (postgres.js) | This project uses the `postgres` package (postgres.js). Do not install or import `pg` |
| Not starting Postgres before running migrations | `cd MovieReviewApp && docker compose up postgres -d` |

## API

| Gotcha | Fix |
|--------|-----|
| Missing `.js` extension in imports | The API uses `"module": "Node16"` which requires `.js` extensions: `import { config } from "./config.js"` |
| Wrapping async handlers in try/catch | Express 5 automatically catches rejected promises. Only catch errors when you need custom error mapping |
| Adding routes after error handler middleware | Routes must be registered before `app.use(errorHandler)` in `app.ts` |
| Logging with string interpolation | Use structured logging: `logger.info({ userId }, "User created")` not `logger.info("User " + userId + " created")` |

## Frontend

| Gotcha | Fix |
|--------|-----|
| Using `useState + useEffect` for API data | Use React Query (`useQuery`, `useMutation`). See `docs/best_practices/react.md` |
| Importing icons from wrong package | Use `lucide-react`, not `react-icons` or `@heroicons` |
| Missing `VITE_` prefix on env vars | Only `VITE_*` variables are exposed to client code by Vite |
| Calling API with full URL in dev | Use relative paths (`/api/movies`). Vite proxy handles routing to the API server |
| Using `form.watch()` in child components | Use `useWatch()` from react-hook-form for child component subscriptions |

## Testing

| Gotcha | Fix |
|--------|-----|
| Test file not picked up by vitest | Unit tests: `*.unit.test.ts`. Integration tests: `*.int.test.ts`. Check the vitest config `include` patterns |
| Integration tests timing out | Default timeout is 15s. If tests need longer, increase `testTimeout` in `vitest.int.config.ts` |
