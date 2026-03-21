# Web Token Mapping

> Phase: system | Brand: get-shit-pretty-v2 | Generated: 2026-03-19

---

## Description

Maps GSP foundation tokens to web technologies for a future docs/marketing site. This file bridges the terminal-native design system to CSS custom properties, Tailwind configuration, and common web component patterns.

The expression palette (lavender, rose) is available here and ONLY here -- never in terminal output.

---

## CSS Custom Properties

All foundation tokens are already defined in the color-system, typography, spacing, and border-radius foundation chunks. Import them as a single CSS block:

```css
@import './foundations/color-system.css';   /* --color-* */
@import './foundations/typography.css';      /* --font-*, --text-*, --leading-*, --tracking-* */
@import './foundations/spacing.css';         /* --space-* */
@import './foundations/border-radius.css';   /* --radius-* */
```

See the CSS blocks in each foundation chunk for the complete property listing. All values reference `tokens.json`.

---

## Tailwind Config (Extend)

Merge this into `tailwind.config.js`. All values use CSS custom properties for runtime theming.

```js
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        bg: 'var(--color-bg)',
        surface: {
          DEFAULT: 'var(--color-surface)',
          elevated: 'var(--color-surface-elevated)',
        },
        border: {
          DEFAULT: 'var(--color-border)',
          strong: 'var(--color-border-strong)',
        },
        text: {
          DEFAULT: 'var(--color-text)',
          bright: 'var(--color-text-bright)',
          muted: 'var(--color-text-muted)',
          disabled: 'var(--color-text-disabled)',
        },
        accent: {
          DEFAULT: 'var(--color-accent)',
          hover: 'var(--color-accent-hover)',
          muted: 'var(--color-accent-muted)',
          dim: 'var(--color-accent-dim)',
          surface: 'var(--color-accent-surface)',
        },
        'on-accent': 'var(--color-on-accent)',
        error: { DEFAULT: 'var(--color-error)', muted: 'var(--color-error-muted)' },
        success: { DEFAULT: 'var(--color-success)', muted: 'var(--color-success-muted)' },
        warning: { DEFAULT: 'var(--color-warning)', muted: 'var(--color-warning-muted)' },
        info: { DEFAULT: 'var(--color-info)', muted: 'var(--color-info-muted)' },
        expression: {
          lavender: 'var(--color-expression-lavender)',
          lilac: 'var(--color-expression-lilac)',
          mauve: 'var(--color-expression-mauve)',
          rose: 'var(--color-expression-rose)',
          blush: 'var(--color-expression-blush)',
        },
      },
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
      spacing: {
        'gsp-1': 'var(--space-1)',
        'gsp-2': 'var(--space-2)',
        'gsp-3': 'var(--space-3)',
        'gsp-4': 'var(--space-4)',
        'gsp-6': 'var(--space-6)',
        'gsp-8': 'var(--space-8)',
        'gsp-12': 'var(--space-12)',
        'gsp-16': 'var(--space-16)',
        'gsp-24': 'var(--space-24)',
      },
      borderRadius: {
        'none': '0',
        'sm': 'var(--radius-sm)',
        'md': 'var(--radius-md)',
        'lg': 'var(--radius-lg)',
        'full': 'var(--radius-full)',
      },
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
    },
  },
};
```

---

## Web Component Patterns

These are not full specs -- they are token-mapping recipes for common web components on a future docs/marketing site.

### Buttons

```css
.btn-primary {
  background: var(--color-accent);
  color: var(--color-on-accent);
  font-family: var(--font-primary);
  font-weight: var(--font-weight-bold);
  font-size: var(--text-body-sm);
  letter-spacing: var(--tracking-wide);
  padding: var(--space-2) var(--space-4);
  border-radius: var(--radius-sm);
  border: 1px solid var(--color-accent);
  transition: background var(--duration-fast) linear;
}
.btn-primary:hover {
  background: var(--color-accent-hover);
  border-color: var(--color-accent-hover);
}
.btn-secondary {
  background: transparent;
  color: var(--color-text);
  border: 1px solid var(--color-border-strong);
  /* Same font, padding, radius as primary */
}
.btn-secondary:hover {
  border-color: var(--color-accent);
  color: var(--color-accent);
}
```

### Cards

```css
.card {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  padding: var(--space-6);
}
.card:hover {
  border-color: var(--color-border-strong);
}
.card-title {
  font-family: var(--font-primary);
  font-weight: var(--font-weight-bold);
  font-size: var(--text-h3);
  color: var(--color-text-bright);
}
```

### Inputs

```css
.input {
  background: var(--color-bg);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
  padding: var(--space-2) var(--space-3);
  font-family: var(--font-primary);
  font-size: var(--text-body);
  color: var(--color-text);
  line-height: var(--leading-loose);
}
.input:focus {
  border-color: var(--color-accent);
  outline: none;
}
.input::placeholder {
  color: var(--color-text-disabled);
}
```

### Navigation

```css
.nav-link {
  font-family: var(--font-primary);
  font-size: var(--text-body-sm);
  color: var(--color-text-muted);
  text-decoration: none;
  transition: color var(--duration-fast) linear;
}
.nav-link:hover {
  color: var(--color-accent);
}
.nav-link.active {
  color: var(--color-text-bright);
  font-weight: var(--font-weight-medium);
}
```

### Code Blocks

```css
.code-block {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-none);   /* Terminal-style: no rounding */
  padding: var(--space-4);
  font-family: var(--font-mono);
  font-size: var(--text-body-sm);
  line-height: var(--leading-loose);
  overflow-x: auto;
}
```

---

## Expression Palette Usage

The expression palette (lavender, lilac, mauve, rose, blush) is for web/marketing only. Use for:

### Gradients

```css
.gradient-warm {
  background: linear-gradient(135deg, var(--color-expression-lavender), var(--color-expression-rose));
}
.gradient-soft {
  background: linear-gradient(135deg, var(--color-expression-lilac), var(--color-expression-blush));
}
```

### Atmospheric Backgrounds

```css
.atmosphere {
  background: radial-gradient(
    ellipse at 30% 20%,
    oklch(0.74 0.07 296 / 0.12),  /* lavender at 12% */
    transparent 60%
  ),
  radial-gradient(
    ellipse at 70% 80%,
    oklch(0.80 0.06 350 / 0.08),  /* rose at 8% */
    transparent 50%
  ),
  var(--color-bg);
}
```

### Text Accents (Web Display Only)

```css
.expression-heading {
  color: var(--color-expression-lavender);
}
.expression-highlight {
  color: var(--color-expression-rose);
}
```

**Rule:** Never use expression colors AND amber in the same element. Choose one chromatic axis per context.

---

## Related

- [../foundations/color-system.md](../foundations/color-system.md) -- all color tokens with CSS and Tailwind output
- [../foundations/typography.md](../foundations/typography.md) -- type scale with CSS and Tailwind output
- [../foundations/spacing.md](../foundations/spacing.md) -- spacing scale
- [../foundations/border-radius.md](../foundations/border-radius.md) -- radius scale
- [../foundations/elevation.md](../foundations/elevation.md) -- no shadows, use color steps
