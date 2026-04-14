# TypeScript Best Practices

## Types

- **No `any`.** Use `unknown` with narrowing, generics, or proper types.
- **Colocate types.** Only extract to a shared `types.ts` when consumed by multiple files.
- **Prefer `type` for unions/intersections, `interface` for object shapes.**
- **Use Zod for external input validation.** Infer TypeScript types from Zod schemas with `z.infer<typeof schema>`. Do not duplicate types.
- **Domain types over primitives.** Prefer `GroupId` (branded string) over `string` for identifiers when the distinction matters.

```typescript
// Avoid
function getGame(id: string, groupId: string): Game { ... }

// Prefer
function getGame({ id, groupId }: { id: GameId; groupId: GroupId }): Game { ... }
```

## Functions

- **Named parameters for 2+ arguments.** Use object destructuring.
- **Pure functions where possible.** No hidden state, no side effects.
- **Return types explicit for public APIs.** Inferred types are fine internally.

## Async

- **Always `await` promises.** Never fire-and-forget unless intentional and documented.
- **Use `Promise.all` for parallel independent operations.**
- **Handle errors at boundaries.** Don't let unhandled rejections propagate.

## Null Handling

- **Prefer `undefined` over `null` for optional values.**
- **Use optional chaining (`?.`) and nullish coalescing (`??`) freely.**
- **Narrow types before accessing.** Use type guards or early returns.

## Enums

- **Avoid TypeScript `enum`.** Use `as const` objects instead for better tree-shaking and JSON compatibility.

```typescript
// Avoid
enum PlayerResponseStatus { Unknown, No, Maybe, Yes }

// Prefer
const PlayerResponseStatus = {
  Unknown: 'unknown',
  No: 'no',
  Maybe: 'maybe',
  Yes: 'yes',
} as const;
type PlayerResponseStatus = typeof PlayerResponseStatus[keyof typeof PlayerResponseStatus];
```
