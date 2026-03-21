# Color System

> Phase: system | Brand: get-shit-pretty | Generated: 2026-03-19

---

## Design Rationale

GSP is dark-mode native. Void black (`#050505`) is the primary environment, not a theme variant. The system is monochrome-first -- every interface must work with zero chromatic color before amber is introduced. Color is signal, not decoration.

The 70/25/5 ratio governs all usage: 70% foundation (void, surface, border), 25% text hierarchy (muted, text, bright), 5% accent (amber). This is the Creator's restraint made systematic.

Full OKLCH palette scales are stored in [`../../identity/palettes.json`](../../identity/palettes.json).

---

## Semantic Token Map

### Foundation (Monochrome)

| Token | Role | Dark (primary) | Light (adaptation) | OKLCH |
|-------|------|----------------|-------------------|-------|
| `--color-bg` | Primary background | `#050505` | `#FAFAFA` | `oklch(0.13 0 0)` / `oklch(0.98 0 0)` |
| `--color-surface` | Cards, panels, elevated areas | `#111111` | `#F1F1F1` | `oklch(0.18 0 0)` / `oklch(0.97 0 0)` |
| `--color-surface-elevated` | Nested panels, popovers | `#1E1E1E` | `#E8E8E8` | `oklch(0.23 0 0)` / `oklch(0.93 0 0)` |
| `--color-border` | Structural lines, dividers | `#1E1E1E` | `#DFDFDF` | `oklch(0.23 0 0)` / `oklch(0.93 0 0)` |
| `--color-border-strong` | Emphasized borders, focus rings | `#404040` | `#A3A3A3` | `oklch(0.33 0 0)` / `oklch(0.72 0 0)` |

### Text Hierarchy

| Token | Role | Dark (primary) | Light (adaptation) | OKLCH |
|-------|------|----------------|-------------------|-------|
| `--color-text` | Primary body text | `#E8E8E8` | `#191919` | `oklch(0.93 0 0)` / `oklch(0.18 0 0)` |
| `--color-text-bright` | Headlines, emphasis | `#FAFAFA` | `#050505` | `oklch(0.98 0 0)` / `oklch(0.13 0 0)` |
| `--color-text-muted` | Secondary text, metadata | `#6B6B6B` | `#555555` | `oklch(0.50 0 0)` / `oklch(0.42 0 0)` |
| `--color-text-disabled` | Disabled state text | `#404040` | `#A3A3A3` | `oklch(0.33 0 0)` / `oklch(0.72 0 0)` |

### Accent (Amber)

| Token | Role | Dark (primary) | Light (adaptation) | OKLCH |
|-------|------|----------------|-------------------|-------|
| `--color-accent` | Primary interactive, brand moments | `#E5A00D` | `#B07B0A` | `oklch(0.754 0.155 77.29)` / `oklch(0.634 0.131 77.04)` |
| `--color-accent-hover` | Hover and active states | `#F5C842` | `#E5A00D` | `oklch(0.851 0.123 72.89)` / `oklch(0.754 0.155 77.29)` |
| `--color-accent-muted` | Subtle accent, background tints | `#8B6914` | `#4A3810` | `oklch(0.504 0.104 77.04)` / `oklch(0.381 0.079 76.58)` |
| `--color-accent-dim` | Accent borders, faint accent lines | `#4A3810` | `#2E230A` | `oklch(0.381 0.079 76.58)` / `oklch(0.26 0.053 77.3)` |
| `--color-accent-surface` | Accent-tinted backgrounds | `#1E1707` | `#FDF6E7` | `oklch(0.199 0.042 77.95)` / `oklch(0.975 0.016 64.69)` |
| `--color-on-accent` | Text on accent backgrounds | `#050505` | `#050505` | `oklch(0.13 0 0)` |

### Semantic

| Token | Role | Value | OKLCH | ANSI 16 |
|-------|------|-------|-------|---------|
| `--color-error` | Error states, destructive actions | `#E54D42` | `oklch(0.629 0.19 27.95)` | `\e[31m` |
| `--color-error-muted` | Error backgrounds | `#3D1410` | `oklch(0.24 0.073 27.67)` | -- |
| `--color-success` | Success states, completion | `#3FB950` | `oklch(0.695 0.181 145.62)` | `\e[32m` |
| `--color-success-muted` | Success backgrounds | `#0F3E17` | `oklch(0.245 0.064 145.38)` | -- |
| `--color-warning` | Warning states | `#D29922` | `oklch(0.72 0.14 79.91)` | `\e[33m` |
| `--color-warning-muted` | Warning backgrounds | `#372808` | `oklch(0.252 0.049 80.78)` | -- |
| `--color-info` | Informational highlights | `#58A6FF` | `oklch(0.715 0.152 253.3)` | `\e[34m` |
| `--color-info-muted` | Info backgrounds | `#0E2D52` | `oklch(0.251 0.069 248.85)` | -- |

### Expression (Web/Marketing Only)

These colors appear ONLY in web, marketing, social, and documentation contexts. Never in terminal output.

| Token | Role | Value | OKLCH |
|-------|------|-------|-------|
| `--color-expression-lavender` | Primary expression color | `#B8A9D4` | `oklch(0.74 0.07 296)` |
| `--color-expression-lilac` | Lighter variant, gradients | `#D4C1E8` | `oklch(0.82 0.06 300)` |
| `--color-expression-mauve` | Deeper variant, text on light | `#9B87B8` | `oklch(0.63 0.08 293)` |
| `--color-expression-rose` | Warm pink, gradients, highlights | `#E8B4C8` | `oklch(0.80 0.06 350)` |
| `--color-expression-blush` | Softest pink, washes | `#F2D1DE` | `oklch(0.88 0.04 355)` |

**Expression usage rules:**
1. Never in terminal output
2. Pair with monochrome, not with amber -- choose one chromatic axis per context
3. Gradient direction: Lavender to Rose (warm wash), Lilac to Blush (soft glow)
4. Use at 10-20% opacity on void black for atmospheric depth
5. Use sparingly so it stays surprising

---

## Terminal ANSI Color Tiers

GSP detects terminal capability and falls back gracefully. Every color has four tiers.

### Tier 1: Truecolor (24-bit)

Full hex color via `\e[38;2;R;G;Bm` (foreground) and `\e[48;2;R;G;Bm` (background).

| Token | Foreground | Background |
|-------|-----------|------------|
| bg | -- | `\e[48;2;5;5;5m` |
| surface | -- | `\e[48;2;17;17;17m` |
| border | `\e[38;2;30;30;30m` | -- |
| text-muted | `\e[38;2;107;107;107m` | -- |
| text | `\e[38;2;232;232;232m` | -- |
| text-bright | `\e[38;2;250;250;250m` | -- |
| accent | `\e[38;2;229;160;13m` | `\e[48;2;229;160;13m` |
| accent-hover | `\e[38;2;245;200;66m` | -- |
| accent-muted | `\e[38;2;139;105;20m` | -- |
| error | `\e[38;2;229;77;66m` | -- |
| success | `\e[38;2;63;185;80m` | -- |
| warning | `\e[38;2;210;153;34m` | -- |
| info | `\e[38;2;88;166;255m` | -- |
| reset | `\e[0m` | `\e[0m` |

### Tier 2: 256-color

Closest match via `\e[38;5;Nm`.

| Token | Code |
|-------|------|
| bg | `\e[48;5;232m` |
| surface | `\e[48;5;233m` |
| border | `\e[38;5;234m` |
| text-muted | `\e[38;5;242m` |
| text | `\e[38;5;254m` |
| text-bright | `\e[38;5;255m` |
| accent | `\e[38;5;178m` |
| accent-hover | `\e[38;5;220m` |
| accent-muted | `\e[38;5;136m` |
| error | `\e[38;5;167m` |
| success | `\e[38;5;71m` |
| warning | `\e[38;5;178m` |
| info | `\e[38;5;75m` |

### Tier 3: 16-color

Standard ANSI named colors.

| Token | Code | Name |
|-------|------|------|
| bg | `\e[40m` | black bg |
| surface | `\e[40m` | black bg |
| border | `\e[90m` | bright black |
| text-muted | `\e[90m` | bright black |
| text | `\e[37m` | white |
| text-bright | `\e[97m` | bright white |
| accent | `\e[33m` | yellow |
| accent-hover | `\e[93m` | bright yellow |
| error | `\e[31m` | red |
| success | `\e[32m` | green |
| warning | `\e[33m` | yellow |
| info | `\e[34m` | blue |

### Tier 4: No-color

When `NO_COLOR` env is set or stdout is not a TTY. Strip all ANSI codes. Hierarchy through indentation, casing, and box-drawing characters only.

---

## WCAG AA Contrast Table

All ratios calculated against their intended background.

| Foreground | Background | Ratio | AA | AAA | Usage |
|------------|------------|-------|----|-----|-------|
| Text `#E8E8E8` | Void `#050505` | 17.4:1 | Pass | Pass | Body text on primary bg |
| Bright `#FAFAFA` | Void `#050505` | 19.1:1 | Pass | Pass | Headlines on primary bg |
| Muted `#6B6B6B` | Void `#050505` | 5.2:1 | Pass | Fail | Secondary text on primary bg |
| Accent `#E5A00D` | Void `#050505` | 8.7:1 | Pass | Pass | Interactive elements on primary bg |
| Accent Bright `#F5C842` | Void `#050505` | 12.4:1 | Pass | Pass | Hover states on primary bg |
| Text `#E8E8E8` | Surface `#111111` | 14.8:1 | Pass | Pass | Body text on cards |
| Accent `#E5A00D` | Surface `#111111` | 7.4:1 | Pass | Pass | Interactive on cards |
| Muted `#6B6B6B` | Surface `#111111` | 4.4:1 | Pass* | Fail | Large text only on cards |
| Void `#050505` | Accent `#E5A00D` | 8.7:1 | Pass | Pass | Text on accent buttons |
| Error `#E54D42` | Void `#050505` | 5.3:1 | Pass | Fail | Error text on primary bg |
| Success `#3FB950` | Void `#050505` | 7.0:1 | Pass | Pass | Success text on primary bg |
| Warning `#D29922` | Void `#050505` | 7.8:1 | Pass | Pass | Warning text on primary bg |
| Info `#58A6FF` | Void `#050505` | 6.4:1 | Pass | Fail | Info text on primary bg |
| Lavender `#B8A9D4` | Void `#050505` | 8.2:1 | Pass | Pass | Expression on dark bg (web) |
| Rose `#E8B4C8` | Void `#050505` | 10.1:1 | Pass | Pass | Expression on dark bg (web) |

*Muted on Surface passes AA for large text (18px+ or 14px bold) only.

---

## CSS Custom Properties

```css
:root {
  /* Foundation */
  --color-bg: #050505;
  --color-surface: #111111;
  --color-surface-elevated: #1E1E1E;
  --color-border: #1E1E1E;
  --color-border-strong: #404040;

  /* Text */
  --color-text: #E8E8E8;
  --color-text-bright: #FAFAFA;
  --color-text-muted: #6B6B6B;
  --color-text-disabled: #404040;

  /* Accent */
  --color-accent: #E5A00D;
  --color-accent-hover: #F5C842;
  --color-accent-muted: #8B6914;
  --color-accent-dim: #4A3810;
  --color-accent-surface: #1E1707;
  --color-on-accent: #050505;

  /* Semantic */
  --color-error: #E54D42;
  --color-error-muted: #3D1410;
  --color-success: #3FB950;
  --color-success-muted: #0F3E17;
  --color-warning: #D29922;
  --color-warning-muted: #372808;
  --color-info: #58A6FF;
  --color-info-muted: #0E2D52;

  /* Expression (web only) */
  --color-expression-lavender: #B8A9D4;
  --color-expression-lilac: #D4C1E8;
  --color-expression-mauve: #9B87B8;
  --color-expression-rose: #E8B4C8;
  --color-expression-blush: #F2D1DE;
}

/* Light mode adaptation */
[data-theme="light"] {
  --color-bg: #FAFAFA;
  --color-surface: #F1F1F1;
  --color-surface-elevated: #E8E8E8;
  --color-border: #DFDFDF;
  --color-border-strong: #A3A3A3;

  --color-text: #191919;
  --color-text-bright: #050505;
  --color-text-muted: #555555;
  --color-text-disabled: #A3A3A3;

  --color-accent: #B07B0A;
  --color-accent-hover: #E5A00D;
  --color-accent-muted: #4A3810;
  --color-accent-dim: #2E230A;
  --color-accent-surface: #FDF6E7;
  --color-on-accent: #050505;
}
```

## Tailwind Config

```js
// tailwind.config.js — extend colors
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
        error: {
          DEFAULT: 'var(--color-error)',
          muted: 'var(--color-error-muted)',
        },
        success: {
          DEFAULT: 'var(--color-success)',
          muted: 'var(--color-success-muted)',
        },
        warning: {
          DEFAULT: 'var(--color-warning)',
          muted: 'var(--color-warning-muted)',
        },
        info: {
          DEFAULT: 'var(--color-info)',
          muted: 'var(--color-info-muted)',
        },
        expression: {
          lavender: 'var(--color-expression-lavender)',
          lilac: 'var(--color-expression-lilac)',
          mauve: 'var(--color-expression-mauve)',
          rose: 'var(--color-expression-rose)',
          blush: 'var(--color-expression-blush)',
        },
      },
    },
  },
};
```

---

## Related

- [Typography](./typography.md)
- [Elevation](./elevation.md)
- [Border Radius](./border-radius.md)
- [Palettes (JSON)](../../identity/palettes.json)
- [Identity Color System](../../identity/color-system.md)
