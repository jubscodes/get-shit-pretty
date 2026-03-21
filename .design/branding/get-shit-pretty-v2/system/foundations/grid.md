# Grid

> Phase: system | Brand: get-shit-pretty | Generated: 2026-03-19

---

## Design Rationale

Two grid systems serve two contexts: a 12-column grid for web layouts and a character-width grid for terminal output. Both share the same spacing tokens for consistency.

---

## Web Grid

12-column grid with responsive gutters and margins.

| Property | Value | Token |
|----------|-------|-------|
| Columns | 12 | -- |
| Gutter | 24px (desktop), 16px (mobile) | `--space-6` / `--space-4` |
| Margin | 48px (desktop), 24px (tablet), 16px (mobile) | `--space-12` / `--space-6` / `--space-4` |
| Max width | 1200px | `--grid-max-width` |

### Breakpoints

| Token | Name | Value | Columns | Gutter | Margin |
|-------|------|-------|---------|--------|--------|
| `--bp-sm` | Mobile | 640px | 4 | 16px | 16px |
| `--bp-md` | Tablet | 768px | 8 | 16px | 24px |
| `--bp-lg` | Desktop | 1024px | 12 | 24px | 48px |
| `--bp-xl` | Wide | 1280px | 12 | 24px | 48px |
| `--bp-2xl` | Ultrawide | 1536px | 12 | 24px | 48px |

### Common Layouts

| Layout | Columns | Use |
|--------|---------|-----|
| Full width | 12 | Hero sections, banners |
| Content + sidebar | 8 + 4 | Documentation, settings |
| Content centered | 6-8 (centered) | Blog posts, reading content |
| Three-column | 4 + 4 + 4 | Feature grids, card layouts |
| Two-column | 6 + 6 | Comparison, split content |

---

## Terminal Grid

Terminal output uses character-width columns. No pixel grid -- everything is measured in characters and lines.

### Width Tiers

| Tier | Width | Behavior |
|------|-------|----------|
| Narrow | < 40 cols | Single column, abbreviated labels, no box-drawing |
| Standard | 40-80 cols | Default layout, box-drawing borders, aligned tables |
| Wide | 80-120 cols | Two-column possible, full tables, richer formatting |
| Ultrawide | 120+ cols | Multi-panel, side-by-side diffs, full-width tables |

### Terminal Layout Rules

| Rule | Value |
|------|-------|
| Default content width | 80 characters |
| Max content width | 120 characters |
| Left margin | 2 characters |
| Indent per level | 2 characters |
| Table column gap | 2 characters minimum |
| Box-drawing width | Content width or terminal width, whichever is smaller |
| Word wrap | At 78 characters (80 minus 2-char margin) |

### Box-Drawing Characters

```
Standard box:
┌──────────────────────┐
│  Content here        │
└──────────────────────┘

Heavy box (phase banners):
┏━━━━━━━━━━━━━━━━━━━━━━┓
┃  PHASE COMPLETE       ┃
┗━━━━━━━━━━━━━━━━━━━━━━┛

Nested structure:
┌── Section ───────────┐
│ ├── Item one         │
│ ├── Item two         │
│ └── Item three       │
└──────────────────────┘

Divider:
────────────────────────
```

---

## CSS Custom Properties

```css
:root {
  --grid-columns: 12;
  --grid-gutter: var(--space-6);    /* 24px */
  --grid-margin: var(--space-12);   /* 48px */
  --grid-max-width: 1200px;

  /* Breakpoints */
  --bp-sm: 640px;
  --bp-md: 768px;
  --bp-lg: 1024px;
  --bp-xl: 1280px;
  --bp-2xl: 1536px;
}

@media (max-width: 768px) {
  :root {
    --grid-gutter: var(--space-4);  /* 16px */
    --grid-margin: var(--space-4);  /* 16px */
  }
}
```

## Tailwind Config

```js
// tailwind.config.js — extend screens
module.exports = {
  theme: {
    extend: {
      screens: {
        'sm': '640px',
        'md': '768px',
        'lg': '1024px',
        'xl': '1280px',
        '2xl': '1536px',
      },
      maxWidth: {
        'grid': '1200px',
      },
      containers: {
        'sm': '640px',
        'md': '768px',
        'lg': '1024px',
        'xl': '1200px',
      },
    },
  },
};
```

---

## Related

- [Spacing](./spacing.md)
- [Typography](./typography.md)
