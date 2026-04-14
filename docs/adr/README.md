# Architecture Decision Records (ADRs)

Document **important technical and architectural decisions** — context, trade-offs, and consequences. This folder is for **cross-cutting decisions** that affect the entire monorepo or multiple apps.

For app-specific ADRs, see `docs/<AppName>/adr/`.

## Decisions

| # | Decision | Status |
|---|----------|--------|
| — | *(none yet — add the first one)* | — |

## When to Write an ADR

Write one when the decision is:
- Long-lasting or hard to reverse
- Affects multiple apps or the overall monorepo structure
- Involves tools, frameworks, data models, protocols, or patterns
- Impacts costs, performance, or maintainability at the monorepo level

Skip for small implementation details, experiments, or app-specific choices (those go in `docs/<AppName>/adr/`).

## How to Write

1. **One decision per ADR** — keep it focused
2. **Keep it short** — 1–2 pages max
3. **Write for the future** — assume someone reads this in 2 years without context
4. **Be honest about trade-offs** — no decision is perfect
5. **Use narrative** — explain reasoning, not just bullet points

Use [`TEMPLATE.md`](./TEMPLATE.md) for new ADRs. Naming: `NNN-short-title.md`

## Status Lifecycle

```
Draft → Proposed → Accepted → Superseded | Deprecated
```

- **Draft** — initial write-up, not yet discussed
- **Proposed** — under discussion
- **Accepted** — in effect
- **Superseded** — replaced by a later ADR (link to it)
- **Deprecated** — no longer relevant
