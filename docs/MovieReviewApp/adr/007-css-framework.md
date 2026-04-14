# ADR-007: Tailwind CSS + shadcn/ui as CSS Framework

**Date:** 2026-04-14
**Status:** Accepted

## Context

MovieReviewApp needs a CSS framework for building a responsive, polished UI. Key requirements:

- Dark theme movie browsing experience with custom design tokens
- Rapid prototyping with consistent spacing, colors, and border radii
- Component primitives (cards, buttons, inputs) without heavy runtime overhead
- Accessible, composable components that follow project design guidelines (8px border radius, Lucide icons, translucent overlays)

Options considered:
1. **Tailwind CSS + shadcn/ui** -- utility-first CSS with copy-paste component primitives
2. **Chakra UI** -- component library with runtime CSS-in-JS
3. **Material UI** -- full component library with opinionated design system
4. **Vanilla CSS / CSS Modules** -- manual styling

## Decision

Use **Tailwind CSS 4** (CSS-based configuration) with **shadcn/ui** component patterns and the `cn()` utility (clsx + tailwind-merge) for conditional class merging.

- Tailwind CSS 4 via `@tailwindcss/vite` plugin for zero-config CSS processing
- Design tokens defined in `src/index.css` using `@theme` directive (colors, radii, spacing)
- `cn()` utility from `src/lib/utils.ts` for all conditional class composition
- Class Variance Authority (CVA) available for component variant definitions
- No `tailwind.config.js` -- Tailwind 4 uses CSS-first configuration

## Consequences

### Positive
- No runtime CSS overhead -- styles are compiled at build time
- Design tokens are CSS custom properties, easy to override per theme
- shadcn/ui patterns are copy-paste, not a dependency -- full control over component code
- Tailwind 4 CSS-based config is simpler than JS config files
- Excellent tree-shaking -- only used utilities are in the bundle
- Strong TypeScript support via CVA for component variants

### Negative
- Utility class strings can be long and harder to read than semantic CSS
- Team needs familiarity with Tailwind utility naming conventions
- shadcn/ui components are not auto-updated -- manual maintenance required

### Neutral
- Tailwind 4 is relatively new; some ecosystem tooling may lag behind
- `cn()` utility adds a small runtime cost for class merging (negligible)

## Enforcement

- All components use `cn()` for conditional classes (code review)
- Design tokens are defined only in `src/index.css` `@theme` block
- No inline `style` attributes unless required for dynamic values (e.g., calculated dimensions)
- Documented in `AGENTS.md` and `docs/MovieReviewApp/GOTCHAS.md`
