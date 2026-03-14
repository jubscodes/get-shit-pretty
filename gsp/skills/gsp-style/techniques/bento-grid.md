# Bento Grid

> Modular asymmetric grid of varying-size cards — inspired by Japanese lunch boxes — that creates visual hierarchy through deliberate size contrast rather than sequential repetition.

Last verified: 2026-03-04

---

## Visual Characteristics

- Asymmetric cell sizes with a dominant "anchor" card (typically 2x2 or 3x2) flanked by smaller supporting cards
- Uniform gap between all cells — 16px or 24px, never mixed within a grid
- Consistent border-radius across every card in the grid (16–32px, typically 24px)
- One key message per card — "snackable" information density
- 4–8 compartments per grid maximum before cognitive load increases
- 2–3 accent colors with neutral card backgrounds
- Bold, short headlines inside cards with minimal or zero body text
- Cells are self-contained units: background, illustration, stat, or short copy — never a continuation of adjacent content
- Popularized on Apple product pages (iPhone, MacBook Air, Apple Watch feature breakdowns)

---

## CSS Implementation

### Base Pattern — 12-Column System

Apple-style implementations use a 12-column base, which gives precise span control without custom line numbers.

```css
.bento-grid {
  display: grid;
  grid-template-columns: repeat(12, minmax(0, 1fr));
  grid-auto-rows: 90px;          /* row rhythm unit — stack multiples for taller cells */
  gap: 24px;
  padding: 24px;
}

/* Anchor card: 6 cols wide, 4 rows tall */
.bento-anchor {
  grid-column: span 6;
  grid-row: span 4;
  border-radius: 24px;
  padding: 40px;
}

/* Wide card: full width, 2 rows */
.bento-wide {
  grid-column: span 12;
  grid-row: span 2;
  border-radius: 24px;
  padding: 32px;
}

/* Half card: 6 cols, 2 rows */
.bento-half {
  grid-column: span 6;
  grid-row: span 2;
  border-radius: 24px;
  padding: 32px;
}

/* Quarter card: 3 cols, 2 rows */
.bento-quarter {
  grid-column: span 3;
  grid-row: span 2;
  border-radius: 24px;
  padding: 24px;
}
```

### Responsive Collapse — 12 → 4 → 2 → 1 Columns

```css
/* Desktop default: 12 columns (above) */

/* Tablet: 4-column grid */
@media (max-width: 1024px) {
  .bento-grid {
    grid-template-columns: repeat(4, minmax(0, 1fr));
    gap: 16px;
  }
  .bento-anchor { grid-column: span 4; grid-row: span 3; }
  .bento-wide   { grid-column: span 4; }
  .bento-half   { grid-column: span 2; }
  .bento-quarter { grid-column: span 2; }
}

/* Mobile: 2-column grid */
@media (max-width: 768px) {
  .bento-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 12px;
  }
  .bento-anchor  { grid-column: span 2; grid-row: span 2; }
  .bento-wide    { grid-column: span 2; }
  .bento-half    { grid-column: span 2; }
  .bento-quarter { grid-column: span 1; }
}

/* Small mobile: single column */
@media (max-width: 480px) {
  .bento-grid {
    grid-template-columns: 1fr;
    gap: 12px;
  }
  .bento-anchor,
  .bento-wide,
  .bento-half,
  .bento-quarter {
    grid-column: span 1;
    grid-row: span 1;
  }
}
```

### Explicit Placement — Precise Control

When auto-placement produces gaps, use explicit line numbers instead:

```css
.tile-hero      { grid-column: 1 / 7;  grid-row: 1 / 3; }  /* 6 cols, 2 rows */
.tile-side-top  { grid-column: 7 / 13; grid-row: 1 / 2; }  /* 6 cols, 1 row  */
.tile-side-bot  { grid-column: 7 / 13; grid-row: 2 / 3; }  /* 6 cols, 1 row  */
.tile-full      { grid-column: 1 / 13; grid-row: 3 / 4; }  /* full width      */
```

### Dense Auto-Placement — Fill Gaps Automatically

Use `grid-auto-flow: dense` when card count is dynamic (CMS-driven content):

```css
.bento-grid {
  display: grid;
  grid-template-columns: repeat(12, minmax(0, 1fr));
  grid-auto-flow: dense;    /* backfills gaps with smaller items */
  gap: 24px;
}
```

Warning: dense packing reorders visual display without changing DOM order. Audit tab order afterward.

---

## Implementation Guide

### Step-by-step

1. Define your grid's column count — use 12 columns for maximum span flexibility or 4 for simpler layouts.
2. Set `grid-auto-rows` with a base unit (60–100px). Cards then use `grid-row: span N` as multiples.
3. Classify each card as anchor / wide / half / quarter and apply the corresponding span class.
4. Apply uniform `gap`, uniform `border-radius`, and `overflow: hidden` on each card.
5. Test column collapse at 1024px, 768px, and 480px — reduce column count, simplify spans.
6. If card content has imagery, add `aspect-ratio` so cells do not collapse to zero height during load.

### Progressive Enhancement

Start with a single-column stacked layout for all breakpoints, then layer in grid behavior:

```css
.bento-grid {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

@supports (display: grid) {
  .bento-grid {
    display: grid;
    grid-template-columns: repeat(12, minmax(0, 1fr));
    grid-auto-rows: 90px;
    gap: 24px;
  }
}
```

### Framework Notes

#### React + Tailwind CSS

Tailwind's `col-span-{n}` and `row-span-{n}` utilities map directly to bento spans. Tailwind UI ships official bento grid marketing section components.

```jsx
// app/components/BentoGrid.tsx
export function BentoGrid() {
  return (
    <div className="grid grid-cols-12 auto-rows-[90px] gap-6 p-6">
      {/* Anchor: 6 cols, 4 rows */}
      <div className="col-span-12 md:col-span-6 row-span-4 rounded-3xl bg-zinc-900 p-10">
        <h2 className="text-3xl font-bold text-white">Hero Feature</h2>
      </div>

      {/* Half card: 6 cols, 2 rows */}
      <div className="col-span-12 md:col-span-6 row-span-2 rounded-3xl bg-indigo-600 p-8">
        <p className="text-white font-semibold">Secondary</p>
      </div>

      {/* Quarter cards: 3 cols, 2 rows */}
      <div className="col-span-6 md:col-span-3 row-span-2 rounded-3xl bg-zinc-100 p-6">
        <p>Stat</p>
      </div>
      <div className="col-span-6 md:col-span-3 row-span-2 rounded-3xl bg-zinc-100 p-6">
        <p>Stat</p>
      </div>
    </div>
  )
}
```

For Tailwind v4, use arbitrary values: `grid-cols-[repeat(12,minmax(0,1fr))]` or register a CSS custom property in `@theme`.

#### React Native

CSS Grid does not exist in React Native. Use nested Flexbox to approximate bento structure:

```jsx
// Bento approximation in React Native
import { View, StyleSheet } from 'react-native'

export function BentoGrid() {
  return (
    <View style={styles.grid}>
      <View style={styles.anchor} />
      <View style={styles.column}>
        <View style={styles.half} />
        <View style={styles.row}>
          <View style={styles.quarter} />
          <View style={styles.quarter} />
        </View>
      </View>
    </View>
  )
}

const GAP = 12
const styles = StyleSheet.create({
  grid:    { flexDirection: 'row', gap: GAP, padding: GAP },
  anchor:  { flex: 1, aspectRatio: 1, borderRadius: 20, backgroundColor: '#18181b' },
  column:  { flex: 1, gap: GAP },
  half:    { flex: 1, borderRadius: 20, backgroundColor: '#4f46e5' },
  row:     { flexDirection: 'row', gap: GAP },
  quarter: { flex: 1, aspectRatio: 1, borderRadius: 20, backgroundColor: '#f4f4f5' },
})
```

#### Vanilla CSS — Container Queries Approach

Container queries let each bento card reflow based on its own allocated width rather than the viewport, making cards reusable in different grid positions:

```css
/* Mark each card as a query container */
.bento-card {
  container-type: inline-size;
  container-name: card;
  border-radius: 24px;
  overflow: hidden;
}

/* Card adapts its internal layout when narrow */
@container card (max-width: 280px) {
  .card-media { display: none; }
  .card-title { font-size: 1rem; }
}

@container card (min-width: 480px) {
  .card-layout { flex-direction: row; }
  .card-title  { font-size: 1.75rem; }
}
```

### Common Pitfalls

- **Source-order mismatch.** CSS Grid lets you place items anywhere visually, which decouples DOM order from visual order. Screen readers and keyboard users follow DOM order. Write HTML in the intended reading sequence first, then reposition visually only when necessary.
- **Fixed row heights breaking content.** `grid-auto-rows: 90px` is a rhythm unit, not a maximum. Set `overflow: hidden` on cards and test with real content at each row-span value.
- **Dense auto-flow scrambling accessible order.** `grid-auto-flow: dense` re-sorts items visually. Only use it with purely decorative grids or image galleries. Never use it when cards contain meaningful reading sequence.
- **Inconsistent border-radius.** The bento aesthetic depends on every card sharing the same radius. One flat-cornered card collapses the visual system.
- **Too many cells.** Beyond 8 cards the asymmetry reads as clutter, not hierarchy. If you need more cells, split into two stacked bento grids.
- **Forgetting aspect-ratio on image-only cells.** Without a defined aspect ratio, image cells collapse to zero height before the image loads, causing cumulative layout shift (CLS).

---

## Examples Gallery

### Apple — Product Feature Pages
URL: apple.com/iphone / apple.com/macbook-air
Apple's canonical use: a grid of 4–6 cards per section, one large card (typically 2-column span) paired with 1×1 stat or illustration cards. Cards use deep background colors, large typographic numerals, and product photography that bleeds to the card edge. Each card communicates a single spec or capability. The grid resets per feature section — not one long grid but multiple small ones.

### Linear — Homepage Feature Grid
URL: linear.app
Linear uses a dark bento grid to showcase product capabilities. Cards use subtle gradient borders on dark backgrounds, monospace figures for performance numbers, and short two-word headlines. The grid is notably sparse — they leave breathing room rather than filling every cell with heavy content. Strong reference for developer-tool aesthetics.

### Vercel — Dashboard and Marketing Pages
URL: vercel.com
Vercel blends bento with glassmorphism: frosted card surfaces, glowing accent lines, and animated deployment graphs embedded within cells. Their grid mixes full-width "wide" cards with narrow stat cards. A strong reference for animated bento where micro-interactions (hover glows, number counters) live inside cells.

### Notion — Landing Page Feature Sections
URL: notion.so
Notion's homepage is a textbook bento: template previews, testimonials, and feature descriptions share one grid. Cards use Notion's off-white background, minimal iconography, and tight two-line descriptions. It demonstrates bento working with light color palettes rather than the dark-dominant Apple/Linear approach.

### Awwwards Featured — Givingli Interactive Bento
URL: awwwards.com/inspiration/givingli-interactive-bento-grid-givingli
Awarded for interactive bento grid with animated cards, hover state transitions, and colorful per-card theming. Reference for elevated motion design inside bento cells. Each card has its own hover color logic while maintaining grid-level visual coherence.

### Awwwards Featured — Pixlspace Creative Studio
URL: awwwards.com/inspiration/interavtive-bento-grid-with-hover-and-scroll-effects-pixlspace-creative-studio
Scroll-triggered bento grid where cells animate into view at staggered intervals. Demonstrates how bento pairs with intersection-observer entry animations without triggering layout reflow.

---

## Accessibility

### Source Order is Reading Order

HTML element sequence must reflect logical reading flow regardless of visual placement. The primary rule: write the DOM in the order a screen reader should announce it.

```html
<!-- Correct: anchor card first in DOM because it anchors meaning -->
<section class="bento-grid" style="reading-flow: grid-rows;">
  <article class="bento-anchor"><!-- 1. Hero feature --></article>
  <article class="bento-half"><!-- 2. Supporting detail --></article>
  <article class="bento-quarter"><!-- 3. Stat --></article>
  <article class="bento-quarter"><!-- 4. Stat --></article>
</section>
```

### CSS reading-flow Property (Chrome 137+)

The new `reading-flow` property aligns keyboard tab order with visual grid order for grid containers. This resolves the long-standing problem where grid reordering broke focus navigation.

```css
.bento-grid {
  display: grid;
  grid-template-columns: repeat(12, minmax(0, 1fr));
  reading-flow: grid-rows;  /* Tab follows visual row-by-row order */
}
```

Values:
- `grid-rows` — tab order follows rows left-to-right, top-to-bottom (most common for bento)
- `grid-columns` — tab order follows columns top-to-bottom, left-to-right
- `grid-order` — tab order respects CSS `order` property values

Support: Chrome 137+. For other browsers, ensure DOM order matches intended tab sequence without relying on this property.

### Landmark and ARIA Roles

Wrap bento grids in a `<section>` with `aria-label`. Each card should be an `<article>` or have `role="region"` with an `aria-labelledby` pointing to its headline.

```html
<section aria-label="Product features" class="bento-grid">
  <article aria-labelledby="feature-speed">
    <h3 id="feature-speed">Up to 2x faster</h3>
    <p>M3 chip benchmark results.</p>
  </article>
</section>
```

### Focus Visibility

Every interactive card must have a visible `:focus-visible` outline. The 24px border-radius on cards clips default browser outlines — define an explicit offset outline:

```css
.bento-card:focus-visible {
  outline: 3px solid #4f46e5;
  outline-offset: 4px;
}
```

---

## Performance

### Aspect Ratio on Every Cell

Always define `aspect-ratio` on cells that contain images. Without it, cells collapse to zero height during load, causing CLS (Cumulative Layout Shift).

```css
.bento-anchor  { aspect-ratio: 1 / 1; }
.bento-wide    { aspect-ratio: 16 / 5; }
.bento-quarter { aspect-ratio: 3 / 4; }
```

### CSS Containment

Apply `contain: layout paint` to individual cards to limit browser recalculation scope when one card's content changes:

```css
.bento-card {
  contain: layout paint;
  overflow: hidden;
}
```

### Image Optimization

- Use `loading="lazy"` on below-fold card images
- Use WebP or AVIF format
- Use `srcset` for cards that span different widths at different breakpoints
- Set explicit `width` and `height` attributes on `<img>` to reserve space before load

### Animation Budget

Animate only `transform` and `opacity` inside bento cells. Never animate `width`, `height`, `grid-column`, or `grid-row` — these trigger full layout recalculation across the entire grid.

```css
/* Safe: GPU-composited */
.bento-card:hover { transform: scale(1.02); transition: transform 200ms ease; }

/* Unsafe: triggers layout on every frame */
.bento-card:hover { width: 110%; }
```

---

## When to Use / When to Avoid

### Use When

- Marketing landing pages with 4–8 distinct product features to highlight simultaneously
- App or SaaS dashboards where widgets have inherently different data densities
- Portfolio or gallery pages where visual interest from asymmetry is a goal
- Hero sections that need to present multiple parallel value propositions without hierarchy requiring prose

### Avoid When

- Long-form reading content — bento fragments the reading experience
- Dense data tables — tabular data requires aligned columns and rows, not varied card sizes
- Sequential workflows or step-by-step instructions — the asymmetric layout implies parallel comparison, not sequence
- Navigation menus — bento implies content, not wayfinding
- Mobile-first products where the primary surface is a phone and the collapsed single-column view loses all hierarchy benefit

---

## Design Tokens

These token values represent the consensus across Apple, Linear, Vercel, and Notion implementations:

```css
:root {
  /* Grid structure */
  --bento-gap-sm: 12px;          /* mobile */
  --bento-gap-md: 16px;          /* tablet */
  --bento-gap-lg: 24px;          /* desktop */

  /* Card radius — consistent across all cards */
  --bento-radius-sm: 16px;       /* compact UI */
  --bento-radius-md: 24px;       /* standard (Apple default) */
  --bento-radius-lg: 32px;       /* large/prominent cards */

  /* Card elevation — muted shadows keep asymmetry readable */
  --bento-shadow: 0 1px 3px rgba(0,0,0,0.07), 0 4px 16px rgba(0,0,0,0.05);

  /* Padding inside cards — scale with card size */
  --bento-padding-sm: 20px;      /* quarter cards */
  --bento-padding-md: 32px;      /* half cards */
  --bento-padding-lg: 48px;      /* anchor cards */

  /* Row rhythm — base unit; spans stack as multiples */
  --bento-row-unit: 90px;

  /* Column system */
  --bento-cols-desktop: 12;
  --bento-cols-tablet: 4;
  --bento-cols-mobile: 2;
}
```

---

## Related

- [Micro-Interactions](./micro-interactions.md) — card hover and entrance animations pair well with bento
- [Glassmorphism](./glassmorphism.md) — frosted card surfaces used by Vercel-style bento grids
- [Neubrutalism](./neubrutalism.md) — high-contrast card borders as an alternative bento aesthetic
