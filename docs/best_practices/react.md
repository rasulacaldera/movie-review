# React Best Practices

## Component Design

- **One component, one responsibility.** If you need "and" to describe it, split it.
- **Prefer function components.** No class components.
- **Keep components small.** Extract when a component exceeds ~100 lines or has distinct visual sections.
- **No JSX from hooks.** Hooks return state and callbacks. Rendering is the component's job.

## State Management

- **Colocate state.** State lives as close to where it's used as possible.
- **Lift when necessary.** Only lift state when multiple siblings need it.
- **Server state via React Query (TanStack Query).** Do not use `useState` + `useEffect` for data fetching.

## Props

- **Destructure props at the top of the component.**
- **Explicit prop types.** No implicit `any` props.
- **Avoid prop drilling beyond 2 levels.** Use composition or context.

## Hooks

- **Custom hooks for reusable logic.** If you use the same stateful logic in two places, extract it.
- **`useWatch` for form fields in child components.** Never `form.watch()` in children — it doesn't trigger re-renders inside field arrays.
- **`useCallback`/`useMemo` only when necessary.** Don't premature-optimize. Profile first.

## Forms

- **React Hook Form** for all forms.
- **Zod schemas** for form validation (integrate via `@hookform/resolvers/zod`).
- **No uncontrolled inputs** mixed with controlled ones.

## File Structure

```
components/
  GameCard/
    GameCard.tsx          # Component
    GameCard.test.tsx     # Tests colocated
    index.ts              # Re-export
```

## Naming Conventions

- **Components**: PascalCase (`GameCard`, `AttendanceButton`)
- **Hooks**: camelCase with `use` prefix (`useGameStatus`, `useAttendance`)
- **Event handlers**: `handle` prefix (`handleSubmit`, `handleResponseChange`)
- **Boolean props**: `is`/`has`/`can` prefix (`isLocked`, `hasResponded`, `canEdit`)
