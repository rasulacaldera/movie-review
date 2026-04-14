# Design System

UI/UX design principles and interaction patterns. These guidelines ensure a consistent, modern experience across all features of an app.

## Quick Reference

| Principle | Key Rule |
|-----------|----------|
| **Rounded Corners** | `lg` (8px) border radius for cards, inputs, containers |
| **Translucent Overlays** | Semi-transparent background + backdrop blur for drawers/dialogs |
| **Prefer Drawers** | Use drawers for creation, editing, and selection — modals for confirmations only |
| **Page Layout** | Full width, small title, action buttons top-right |
| **Compact Menu** | Use icon-only sidebar for content-heavy pages |

## Documentation

- **[guidelines.md](./guidelines.md)** — Detailed design principles with rationale
- **[components.md](./components.md)** — Component preferences and usage patterns
- **[examples.md](./examples.md)** — Code examples for common patterns

## Core Design Values

1. **Modern & Clean** — Rounded corners and translucent effects create an approachable feel
2. **Consistent** — Same patterns applied across all pages and features
3. **Focused** — Collapsible navigation reduces cognitive load on content-heavy pages
4. **Intuitive** — Drawers maintain context by keeping the underlying page visible

## When Implementing a New Feature

1. Review [guidelines.md](./guidelines.md) for design principles
2. Check [components.md](./components.md) for preferred component choices
3. Use [examples.md](./examples.md) as starting points
4. Follow established patterns in existing pages

## App-Specific Design Docs

Implementation details that depend on the UI component library (imports, component names, theming) live in the app-specific design folder:

- `docs/<AppName>/design/` — App-specific component library specifics
