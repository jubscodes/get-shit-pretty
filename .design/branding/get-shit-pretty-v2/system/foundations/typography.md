# Typography

> Phase: system | Brand: get-shit-pretty | Generated: 2026-03-19

---

## Design Rationale

JetBrains Mono is the primary typeface -- not a code-block fallback. Leading with monospace is a positioning statement: terminal is home. Instrument Sans appears only at display sizes (40px+) in web contexts, never in terminal.

Line height 1.7 for monospace body text is non-negotiable. Monospace at 1.5 feels cramped. The extra breathing room is the Guide's warmth expressed typographically.

---

## Font Stacks

| Token | Stack | Weight Range |
|-------|-------|-------------|
| `--font-primary` | `'JetBrains Mono', 'Fira Code', 'Source Code Pro', 'Cascadia Code', ui-monospace, monospace` | 400, 500, 700 |
| `--font-display` | `'Instrument Sans', 'Inter', system-ui, sans-serif` | 600, 700 |
| `--font-mono` | `'JetBrains Mono', 'Fira Code', ui-monospace, monospace` | 400, 500, 700 |

**Google Fonts import:**

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Instrument+Sans:wght@600;700&family=JetBrains+Mono:wght@400;500;700&display=swap" rel="stylesheet">
```

---

## Web Type Scale

Base: 16px. Ratio: ~1.25 (Major Third) with manual adjustments at display sizes.

| Level | Token | Size | Weight | Line Height | Letter Spacing | Font | Usage |
|-------|-------|------|--------|-------------|----------------|------|-------|
| Display 1 | `--text-display-1` | 72-160px | 700 | 1.0 | -0.04em | Instrument Sans | Hero headlines, marketing |
| Display 2 | `--text-display-2` | 48-72px | 700 | 1.1 | -0.03em | Instrument Sans | Section headers, slides |
| Heading 1 | `--text-h1` | 32-40px | 700 | 1.2 | -0.02em | JetBrains Mono | Page titles |
| Heading 2 | `--text-h2` | 24-28px | 700 | 1.3 | -0.01em | JetBrains Mono | Section titles |
| Heading 3 | `--text-h3` | 20px | 500 | 1.4 | 0 | JetBrains Mono | Subsection titles |
| Body | `--text-body` | 16px | 400 | 1.7 | 0 | JetBrains Mono | Paragraph text |
| Body Small | `--text-body-sm` | 14px | 400 | 1.6 | 0.01em | JetBrains Mono | Secondary content |
| Caption | `--text-caption` | 12px | 400 | 1.5 | 0.02em | JetBrains Mono | Metadata, labels |
| Overline | `--text-overline` | 11px | 700 | 1.4 | 0.12em | JetBrains Mono | Category labels, uppercase |

---

## Terminal Type Hierarchy

In terminal contexts, font size is fixed by the user's terminal settings. Hierarchy is achieved through weight, casing, spacing, and color -- not font size.

| Level | Weight | Treatment | Color Token | Char Width | Usage |
|-------|--------|-----------|-------------|-----------|-------|
| Phase header | 700 | UPPERCASE, box-drawing border | `--color-accent` | Full terminal width | Phase banners |
| Section header | 700 | Title Case | `--color-text-bright` | Content width | Section dividers |
| Label | 500 | UPPERCASE, spaced | `--color-text-muted` | 20-30 chars | Field labels, column headers |
| Body | 400 | Sentence case | `--color-text` | 60-80 chars (wrap) | Descriptions |
| Metadata | 400 | Sentence case, dimmed | `--color-text-muted` | 40-60 chars | File paths, timestamps |

---

## Responsive Behavior

| Breakpoint | Display 1 | Display 2 | H1 | H2 | H3 | Body | Line Height (body) |
|------------|-----------|-----------|-----|-----|-----|------|-------------------|
| Desktop (1200px+) | 160px | 72px | 40px | 28px | 20px | 16px | 1.7 |
| Tablet (768-1199px) | 96px | 56px | 32px | 24px | 20px | 16px | 1.7 |
| Mobile (< 768px) | 56px | 40px | 28px | 22px | 18px | 16px | 1.6 |

Display sizes scale down aggressively. Body text stays at 16px -- readability is non-negotiable. Line height tightens slightly on mobile (1.6) to preserve content density.

---

## CSS Custom Properties

```css
:root {
  /* Font families */
  --font-primary: 'JetBrains Mono', 'Fira Code', 'Source Code Pro', 'Cascadia Code', ui-monospace, monospace;
  --font-display: 'Instrument Sans', 'Inter', system-ui, sans-serif;
  --font-mono: 'JetBrains Mono', 'Fira Code', ui-monospace, monospace;

  /* Font weights */
  --font-weight-regular: 400;
  --font-weight-medium: 500;
  --font-weight-semibold: 600;
  --font-weight-bold: 700;

  /* Font sizes */
  --text-display-1: clamp(3.5rem, 8vw + 1rem, 10rem);
  --text-display-2: clamp(2.5rem, 4vw + 1rem, 4.5rem);
  --text-h1: clamp(1.75rem, 2vw + 1rem, 2.5rem);
  --text-h2: clamp(1.375rem, 1.5vw + 0.75rem, 1.75rem);
  --text-h3: clamp(1.125rem, 0.5vw + 1rem, 1.25rem);
  --text-body: 1rem;
  --text-body-sm: 0.875rem;
  --text-caption: 0.75rem;
  --text-overline: 0.6875rem;

  /* Line heights */
  --leading-none: 1.0;
  --leading-tight: 1.1;
  --leading-snug: 1.2;
  --leading-normal: 1.4;
  --leading-relaxed: 1.6;
  --leading-loose: 1.7;

  /* Letter spacing */
  --tracking-tighter: -0.04em;
  --tracking-tight: -0.03em;
  --tracking-snug: -0.02em;
  --tracking-normal: 0;
  --tracking-wide: 0.01em;
  --tracking-wider: 0.02em;
  --tracking-widest: 0.12em;
}
```

## Tailwind Config

```js
// tailwind.config.js — extend typography
module.exports = {
  theme: {
    extend: {
      fontFamily: {
        primary: ['JetBrains Mono', 'Fira Code', 'Source Code Pro', 'Cascadia Code', 'ui-monospace', 'monospace'],
        display: ['Instrument Sans', 'Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'ui-monospace', 'monospace'],
      },
      fontSize: {
        'display-1': ['clamp(3.5rem, 8vw + 1rem, 10rem)', { lineHeight: '1.0', letterSpacing: '-0.04em' }],
        'display-2': ['clamp(2.5rem, 4vw + 1rem, 4.5rem)', { lineHeight: '1.1', letterSpacing: '-0.03em' }],
        'h1': ['clamp(1.75rem, 2vw + 1rem, 2.5rem)', { lineHeight: '1.2', letterSpacing: '-0.02em' }],
        'h2': ['clamp(1.375rem, 1.5vw + 0.75rem, 1.75rem)', { lineHeight: '1.3', letterSpacing: '-0.01em' }],
        'h3': ['clamp(1.125rem, 0.5vw + 1rem, 1.25rem)', { lineHeight: '1.4', letterSpacing: '0' }],
        'body': ['1rem', { lineHeight: '1.7', letterSpacing: '0' }],
        'body-sm': ['0.875rem', { lineHeight: '1.6', letterSpacing: '0.01em' }],
        'caption': ['0.75rem', { lineHeight: '1.5', letterSpacing: '0.02em' }],
        'overline': ['0.6875rem', { lineHeight: '1.4', letterSpacing: '0.12em', fontWeight: '700', textTransform: 'uppercase' }],
      },
    },
  },
};
```

---

## Usage Rules

1. **JetBrains Mono is always the default.** If in doubt, use mono. Instrument Sans requires justification (display sizes, marketing only).
2. **Never mix more than two typefaces** in a single layout. JetBrains Mono + Instrument Sans is the maximum.
3. **Ligatures on in code contexts**, off in brand/display contexts.
4. **Tracking loosens as size decreases.** Display text is tight (-0.04em). Caption text is loose (0.02em).
5. **Line height 1.7 for monospace body text.** This is the system default, not a suggestion.
6. **Uppercase is reserved for overlines, labels, and terminal phase headers.** Never for body text or full sentences.
7. **Body text stays at 16px across all breakpoints.** Only display and heading sizes scale responsively.

---

## Related

- [Color System](./color-system.md)
- [Spacing](./spacing.md)
- [Grid](./grid.md)
- [Identity Typography](../../identity/typography.md)
