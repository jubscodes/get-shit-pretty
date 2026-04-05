# Bento Grid Layout Reference

Responsive bento grids that tile into clean rectangles across all breakpoints.

## The Problem

Bento grids use `row-span` and `col-span` to create mixed-size card layouts. These break at smaller breakpoints — a `row-span-2` card at 2-col creates gaps, and single-column layouts can't span rows at all.

## The Rule

**Every breakpoint must produce a complete rectangle with no gaps.** Design the grid for each breakpoint independently, not just the largest one.

## Breakpoint Strategy

```
Mobile  (< 640px)   grid-cols-1    No spans. All cards stack. Equal auto-row height.
Tablet  (640-1023px) grid-cols-2   col-span-2 for wide cards. NO row-span (creates gaps at 2-col).
Desktop (1024+)      grid-cols-3/4  Full bento: row-span + col-span. Explicit grid-template-rows.
```

## Implementation Pattern

### Grid container

```tsx
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4
  sm:[grid-auto-rows:280px]
  lg:[grid-template-rows:280px_280px]"
>
```

- `grid-cols-1` → mobile: single column, auto height
- `sm:grid-cols-2` → tablet: 2-col, fixed row height (280px)
- `lg:grid-cols-4` → desktop: 4-col with explicit 2-row template
- `sm:[grid-auto-rows:280px]` → consistent row height from tablet up
- `lg:[grid-template-rows:280px_280px]` → explicit rows for desktop bento

### Card classes by type

**Tall card** (spans 2 rows on desktop, regular on mobile/tablet):
```tsx
className="lg:row-span-2"
```
No `sm:row-span-2` — at 2-col, tall cards break the grid.

**Wide card** (spans 2 columns from tablet up):
```tsx
className="sm:col-span-2 lg:col-span-2"
```
Works at both tablet (fills full width) and desktop (fills 2 of 4 columns).

**Regular card** (1×1 at all sizes):
```tsx
// No span classes needed
```

### Example: 5-card bento (2 tall + 2 regular + 1 wide)

```
Desktop (4-col):
┌──────┬──────┬──────┬──────┐
│ tall │ reg  │ reg  │ tall │
│  A   │  B   │  C   │  E   │
│      ├──────┴──────┤      │
│      │   wide D    │      │
└──────┴─────────────┴──────┘

Tablet (2-col):
┌──────┬──────┐
│  A   │  B   │
├──────┼──────┤
│  C   │  E   │
├──────┴──────┤
│   wide D    │
└─────────────┘

Mobile (1-col):
┌─────────────┐
│      A      │
├─────────────┤
│      B      │
├─────────────┤
│      C      │
├─────────────┤
│      E      │
├─────────────┤
│      D      │
└─────────────┘
```

## Card internals

Each bento card follows a consistent structure:

```tsx
{/* GSP outer frame — consistent border, radius, hover across all cards */}
<div className="relative overflow-hidden rounded-md border border-border
  transition-colors hover:border-primary/40"
  style={{ transitionDuration: "var(--gsp-motion-normal)" }}
>
  {/* Inner content — styled by the card's own design language */}
  <div className="absolute inset-0" style={{ background: "..." }}>
    {/* Visual hero content */}
    {/* ... */}

    {/* Info bar — pinned to bottom */}
    <div className="absolute bottom-0 left-0 right-0 p-6"
      style={{ backgroundColor: "...", borderTop: "..." }}
    >
      <p className="text-caption uppercase tracking-widest mb-1">card name</p>
      <p className="text-body-sm">description</p>
    </div>
  </div>
</div>
```

**Outer frame is always GSP:** `rounded-md`, `border-border`, `hover:border-primary/40`, GSP motion timing.

**Inner content is card-specific:** backgrounds, typography, visual elements, info bar colors all match the card's own design language.

**Info bar pattern:** Absolutely positioned at bottom, semi-opaque background matching the card's palette, `borderTop` for separation, preset name in `text-caption uppercase tracking-widest`, description in `text-body-sm`.

## Common mistakes

1. **Using `row-span` at small breakpoints** — creates gaps in the grid. Only use `lg:row-span-2`.
2. **Forgetting `overflow-hidden` on the outer frame** — inner content bleeds past rounded corners.
3. **Absolute positioning without `relative` parent** — inner content layers need the outer frame to be `relative`.
4. **Fixed pixel heights on mobile** — use `min-h-[280px]` only if needed, prefer auto-rows from the grid.
5. **Content inside tall cards using absolute bottom positioning** — breaks when the card isn't tall. Use flex layout (`flex flex-col` + `flex-1` for content area) for tall cards.
