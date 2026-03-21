# Border Radius

> Phase: system | Brand: get-shit-pretty | Generated: 2026-03-19

---

## Design Rationale

GSP defaults to sharp. Rounded corners imply softness; GSP's Creator archetype values precision. The radius scale is tight: 2-4px for most elements, 0 for structural components. Full radius (pill shapes) is reserved for specific use cases like tags and status indicators.

In terminal contexts, there is no radius concept -- box-drawing characters create square structures.

---

## Token Scale

| Token | Value | px | Usage |
|-------|-------|-----|-------|
| `--radius-none` | 0 | 0px | Tables, code blocks, terminal-style elements |
| `--radius-sm` | 0.125rem | 2px | Buttons, inputs, badges, default interactive elements |
| `--radius-md` | 0.25rem | 4px | Cards, panels, dialogs |
| `--radius-lg` | 0.5rem | 8px | Large cards, hero containers (rare) |
| `--radius-full` | 9999px | 9999px | Pills, avatars, status dots |

---

## Usage Rules

1. **Default is `--radius-sm` (2px).** Most interactive elements use this. It is sharp enough to read as precise, rounded enough to not feel harsh.
2. **Cards and containers use `--radius-md` (4px).** One step up from interactive elements creates subtle hierarchy.
3. **`--radius-none` for code-adjacent elements.** Anything that represents code, terminal output, or structured data stays square.
4. **`--radius-lg` (8px) is rare.** Use only for hero-level containers or marketing elements where softness is intentional.
5. **`--radius-full` is functional.** Pills for tags, circles for avatars and status dots. Never for buttons or cards.
6. **Nested radius rule:** Inner radius = outer radius minus border/padding. A card (`--radius-md`, 4px) with 16px padding contains elements with `--radius-sm` (2px) or `--radius-none` (0px).

---

## Terminal Equivalent

Terminal elements use box-drawing characters, which are inherently square. No radius concept applies.

| Web Element | Terminal Equivalent |
|------------|-------------------|
| `--radius-sm` button | Text with brackets: `[ OK ]` |
| `--radius-md` card | Box-drawing: `┌──┐ │  │ └──┘` |
| `--radius-full` pill | Parentheses: `(tag)` |
| `--radius-none` code | Indented block, no box |

---

## CSS Custom Properties

```css
:root {
  --radius-none: 0;
  --radius-sm: 0.125rem;    /* 2px */
  --radius-md: 0.25rem;     /* 4px */
  --radius-lg: 0.5rem;      /* 8px */
  --radius-full: 9999px;
}
```

## Tailwind Config

```js
// tailwind.config.js — extend borderRadius
module.exports = {
  theme: {
    extend: {
      borderRadius: {
        'none': '0',
        'sm': 'var(--radius-sm)',      /* 2px */
        'md': 'var(--radius-md)',      /* 4px */
        'lg': 'var(--radius-lg)',      /* 8px */
        'full': 'var(--radius-full)',  /* 9999px */
      },
    },
  },
};
```

---

## Related

- [Elevation](./elevation.md)
- [Color System](./color-system.md)
- [Spacing](./spacing.md)
