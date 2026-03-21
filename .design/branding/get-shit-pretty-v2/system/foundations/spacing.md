# Spacing

> Phase: system | Brand: get-shit-pretty | Generated: 2026-03-19

---

## Design Rationale

8px base unit. Every spacing value in the system is a multiple (or half-multiple) of 8. This mathematical consistency is the Creator's precision -- no magic numbers, no "eyeball it." The scale grows predictably, and each value has a defined purpose.

---

## Spacing Scale

| Token | Value | px | rem | Usage |
|-------|-------|-----|-----|-------|
| `--space-1` | 0.5 units | 4px | 0.25rem | Inline padding, icon gaps, tight component internals |
| `--space-2` | 1 unit | 8px | 0.5rem | Default gap between inline elements, small padding |
| `--space-3` | 1.5 units | 12px | 0.75rem | Input padding, compact component spacing |
| `--space-4` | 2 units | 16px | 1rem | Default component padding, paragraph spacing |
| `--space-6` | 3 units | 24px | 1.5rem | Card padding, section gap (small) |
| `--space-8` | 4 units | 32px | 2rem | Section padding, group spacing |
| `--space-12` | 6 units | 48px | 3rem | Section margins, large content gaps |
| `--space-16` | 8 units | 64px | 4rem | Page section spacing |
| `--space-24` | 12 units | 96px | 6rem | Hero padding, major section dividers |

---

## Terminal Spacing

In terminal contexts, spacing is character-based, not pixel-based.

### Vertical Spacing (Lines)

| Purpose | Lines | Equivalent Token |
|---------|-------|-----------------|
| Between fields in a group | 0 (consecutive lines) | `--space-1` |
| Between label and value | 0 (same line or next line) | `--space-2` |
| Between groups | 1 blank line | `--space-4` |
| Between sections | 2 blank lines | `--space-8` |
| Before/after phase banner | 1 blank line | `--space-4` |

### Horizontal Spacing (Columns)

| Purpose | Chars | Equivalent Token |
|---------|-------|-----------------|
| Icon to text | 1 space | `--space-1` |
| Column gap in tables | 2 spaces | `--space-2` |
| Indent level | 2 spaces | `--space-2` |
| Label to value | 2-4 spaces (aligned) | `--space-3` |
| Left margin (content offset) | 2 spaces | `--space-2` |

---

## CSS Custom Properties

```css
:root {
  --space-1: 0.25rem;   /* 4px */
  --space-2: 0.5rem;    /* 8px */
  --space-3: 0.75rem;   /* 12px */
  --space-4: 1rem;      /* 16px */
  --space-6: 1.5rem;    /* 24px */
  --space-8: 2rem;      /* 32px */
  --space-12: 3rem;     /* 48px */
  --space-16: 4rem;     /* 64px */
  --space-24: 6rem;     /* 96px */
}
```

## Tailwind Config

```js
// tailwind.config.js — extend spacing
module.exports = {
  theme: {
    extend: {
      spacing: {
        'gsp-1': 'var(--space-1)',    /* 4px */
        'gsp-2': 'var(--space-2)',    /* 8px */
        'gsp-3': 'var(--space-3)',    /* 12px */
        'gsp-4': 'var(--space-4)',    /* 16px */
        'gsp-6': 'var(--space-6)',    /* 24px */
        'gsp-8': 'var(--space-8)',    /* 32px */
        'gsp-12': 'var(--space-12)', /* 48px */
        'gsp-16': 'var(--space-16)', /* 64px */
        'gsp-24': 'var(--space-24)', /* 96px */
      },
    },
  },
};
```

---

## Usage Guidelines

| Scale Value | When to Use | When Not to Use |
|-------------|-------------|-----------------|
| 4px (`--space-1`) | Tight gaps: icon-to-text, badge padding, inline spacing | Component padding, section spacing |
| 8px (`--space-2`) | Default small gap: between inline items, input inner padding | Section-level spacing |
| 12px (`--space-3`) | Input padding, compact card padding, button padding | Full card padding, section gaps |
| 16px (`--space-4`) | Default component padding, paragraph margin-bottom | Hero sections, major gaps |
| 24px (`--space-6`) | Card body padding, gap between card groups | Tight layouts, inline gaps |
| 32px (`--space-8`) | Section padding inside a page, sidebar gutter | Component internals |
| 48px (`--space-12`) | Between page sections, below headings | Component padding, small gaps |
| 64px (`--space-16`) | Major page sections, above/below hero | Anything inside a component |
| 96px (`--space-24`) | Hero vertical padding, page-level breathing room | Most contexts -- use sparingly |

---

## Related

- [Grid](./grid.md)
- [Typography](./typography.md)
- [Border Radius](./border-radius.md)
