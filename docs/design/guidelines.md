# Design Guidelines

UI/UX principles that apply to all features. Follow these for new pages and components.

## 1. Rounded Corners

All UI elements should have a rounded, approachable feel.

- Default border radius: **`lg` (8px)**
- Cards, containers, inputs, and buttons should feel soft and modern
- Menu selections should not touch container edges

```tsx
// Cards and containers
<Card borderRadius="lg">...</Card>

// Inputs
<Input borderRadius="lg" />

// Custom containers
<Box borderRadius="lg" border="1px solid" borderColor="gray.200">...</Box>
```

## 2. Translucent Overlays

All overlays (drawers, popovers, dialogs) should use a translucent background with blur.

| Property | Value |
|----------|-------|
| Background | `rgba(255, 255, 255, 0.75)` |
| Backdrop filter | `blur(8px)` |
| Border radius | `lg` |
| Margin from edge | `8px` (for drawers) |

This creates depth and keeps the user aware of context beneath the overlay.

## 3. Prefer Drawers Over Modals

Use drawers for resource selection, creation, and editing flows. Drawers maintain context — the user can see the page behind them.

### Use Drawers for:
- Creating new resources
- Editing existing resources
- Resource selection interfaces
- Configuration panels
- Detail views
- Multi-step forms or wizards

### Use Dialogs/Modals for:
- Confirmation prompts (delete, discard changes)
- Simple alerts and error messages
- Quick actions that don't need context

### Placement
- Default: right-side (`placement="end"`)
- Common widths: `md` (400px), `lg` (560px), `xl` (720px)

### Nested Drawer Navigation
When a flow requires multiple steps (e.g. select type → select item → configure), use a drawer navigation stack rather than true nested drawers:

1. **Stack** — navigation history tracked in a stack
2. **Back button** — automatically shown when there's history
3. **URL state** — drawer state stored in URL params for shareability
4. **Flow callbacks** — callbacks persist across drawer navigation

```tsx
// Open a drawer and navigate forward
openDrawer("itemSelector", { categoryId: "1" });

// Go back to previous drawer
goBack();

// Close entire flow
closeDrawer();
```

## 4. Page Layout Standards

All pages follow a consistent structure:

1. **Header** — Fixed height (~48px), contains title and actions
2. **Title** — Small, concise, left-aligned
3. **Action buttons** — Top-right corner
4. **Content** — Full width below the header divider

```
┌────────────────────────────────────────────────┐
│  Page Title                    [+ Add Item]    │
├────────────────────────────────────────────────┤
│                                                │
│  Page content                                  │
│                                                │
└────────────────────────────────────────────────┘
```

Key points:
- Page takes full available width
- Title should be concise (1-3 words)
- Action buttons grouped on the right
- Consistent padding and spacing throughout

## 5. Compact Menu for Busy Pages

For content-heavy pages (editors, settings, dashboards), use a collapsible sidebar.

- Sidebar collapses to icons only
- Expands on hover to show labels
- Maintains navigation accessibility
- Reduces visual noise, giving content more horizontal space

Use compact menu for:
- Pages with dense content (editors, data tables)
- Pages where users need maximum horizontal space
- "Focused mode" pages where navigation is secondary

## Implementation Checklist

When building a new feature or page, verify:

- [ ] Border radius uses `lg` for containers and interactive elements
- [ ] Overlays use translucent backgrounds with blur
- [ ] Resource management uses drawers, not modals
- [ ] Page follows standard layout (header, title, actions, content)
- [ ] Content-heavy pages use compact/collapsible menu
- [ ] Components imported from the app's UI component wrappers (not directly from the library)
