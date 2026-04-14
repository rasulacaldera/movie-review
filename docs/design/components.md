# Component Preferences

Which components to use for common UI patterns. Implementation details (exact imports, component names) are in `docs/<AppName>/design/`.

## Overlay Components

Always use the app's local UI component wrappers, not raw library imports. Local wrappers have translucent styling and design tokens pre-applied.

| Pattern | Use |
|---------|-----|
| Resource creation/editing | Drawer |
| Resource selection | Drawer |
| Configuration panels | Drawer |
| Confirmation prompts | Dialog/Modal |
| Error alerts | Dialog/Modal or Toast |
| Contextual info | Popover or Tooltip |

## Drawer Anatomy

Every drawer follows this structure:

```
┌─────────────────────────────┐
│  ← Title               [X]  │  ← Header (back button if history exists)
├─────────────────────────────┤
│                             │
│  Body content               │  ← Scrollable body
│                             │
├─────────────────────────────┤
│  [Cancel]         [Save]    │  ← Footer with actions
└─────────────────────────────┘
```

- Close trigger (X) always present
- Back button visible only when there's navigation history
- Footer: secondary action left, primary action right

## Dialog Anatomy

```
┌─────────────────────────────┐
│  Title                 [X]  │
├─────────────────────────────┤
│  Body — confirm message     │
├─────────────────────────────┤
│  [Cancel]       [Confirm]   │
└─────────────────────────────┘
```

- Destructive confirm buttons: red/danger color
- Cancel always on the left, confirm on the right

## Buttons

| Purpose | Style |
|---------|-------|
| Primary action | Filled, primary color |
| Secondary action | Outlined |
| Destructive action | Filled, red/danger color |
| Ghost/subtle | Ghost variant |
| Header actions | Outlined or ghost, consistent size |

## Forms

- Every input field has an associated label
- Required fields marked visually
- Validation errors shown inline below the field
- Use React Hook Form + Zod for all forms (see `docs/best_practices/react.md`)

## Icons

Use [Lucide](https://lucide.dev/) for all icons — consistent style, tree-shakeable, TypeScript-friendly.

Common icons:

| Action | Icon |
|--------|------|
| Create/Add | `Plus` |
| Delete | `Trash2` |
| Edit | `Pencil` |
| Close | `X` |
| Back | `ArrowLeft` |
| Menu/More | `MoreVertical` |
| Lock | `Lock` |
| Settings | `Settings` |

## Spacing

| Token | Value | Use Case |
|-------|-------|----------|
| `4px` | Tight spacing between related elements |
| `8px` | Element margin, icon-to-text gap |
| `12px` | Small gaps |
| `16px` | Standard gaps between form fields |
| `24px` | Section padding, card padding |
| `32px` | Large section gaps |

## Tables

- Use for list views with multiple columns
- Row actions (edit, delete) grouped in a menu on the right
- Empty state with a clear call-to-action

## Toast Notifications

- Success: green, 3s auto-dismiss
- Error: red, persist until dismissed
- Info: neutral, 3s auto-dismiss
- Always positioned top-right or bottom-center (pick one and be consistent)
