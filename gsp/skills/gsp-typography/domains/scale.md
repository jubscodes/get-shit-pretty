# Domain: Type Scale Generation

Mathematical type scale generation — the core engine for all typography modes that produce a numeric scale.

---

## Scale Levels

Generate a 9-level scale: `size = base * ratio^n`. Round px to nearest 0.5px, rem = `px / 16`.

| Level | Exponent | Tailwind | Purpose |
|-------|----------|----------|---------|
| Display | 5 | `text-6xl`-`text-7xl` | Hero headlines |
| H1 | 4 | `text-4xl` | Page titles |
| H2 | 3 | `text-3xl` | Section headings |
| H3 | 2 | `text-2xl` | Subsection headings |
| H4 | 1 | `text-xl` | Minor headings |
| body-large | 0.5* | `text-lg` | Lead paragraphs |
| body | 0 | `text-base` | Default body (= base) |
| body-small | -1 | `text-sm` | Secondary text |
| caption | -2 | `text-xs` | Labels, helper text |
| overline | -2 | `text-xs` | All-caps labels (= caption size) |

*body-large uses half-step exponent to bridge body-H4 gap.

Default base size: 16px unless overridden by `--base`.

---

## Fluid clamp() Formulas

For headings (Display through H4), generate `clamp()` values scaling between 375px (mobile) and 1280px (desktop). Body and below stay fixed.

**Formula:**
```
slope = (desktopSize - mobileSize) / (1280 - 375)
intercept = mobileSize - slope * 375
clamp(mobileSize_rem, intercept_rem + slope * 100vw, desktopSize_rem)
```

Mobile uses a ratio stepped down from the chosen ratio. The step-down map:

```
golden-ratio (1.618)     -> perfect-fifth (1.500)
perfect-fifth (1.500)    -> augmented-fourth (1.414)
augmented-fourth (1.414) -> perfect-fourth (1.333)
perfect-fourth (1.333)   -> major-third (1.250)
major-third (1.250)      -> minor-third (1.200)
minor-third (1.200)      -> major-second (1.125)
major-second (1.125)     -> minor-second (1.067)
minor-second (1.067)     -> minor-second (1.067)  [floor]
```

WCAG 1.4.4 constraint: clamp() min and max must be rem-based — never pure vw. The vw component does not respond to browser zoom.

If `--no-fluid` is passed, skip clamp() and use breakpoint-only `@media` rules instead.

---

## Line Height (4px Grid Snapped)

Formula: `ceil(fontSize * targetRatio / 4) * 4` — every line-height is a multiple of 4px.

| Level | Target ratio |
|-------|-------------|
| Display | 1.1 |
| H1 | 1.15 |
| H2 | 1.2 |
| H3 | 1.25 |
| H4 | 1.3 |
| body-large | 1.5 |
| body | 1.5 (anchor: e.g. 24px = 6 * 4px) |
| body-small | 1.5 |
| caption | 1.4 |
| overline | 1.5 |

If user provided `--line-height`, use it as the body target ratio and adjust proportionally.

Grid unit defaults to 4px. Override with `--grid N`.

---

## Letter Spacing (Size-Dependent Curve)

Principle: small text needs more space, large text needs less. Reference: Apple SF Pro tracking, Tailwind defaults.

| Level | Letter spacing | Tailwind token | Rationale |
|-------|---------------|----------------|-----------|
| Display | -0.025em | `tracking-tighter` | Tighten large type |
| H1 | -0.025em | `tracking-tight` | |
| H2 | -0.025em | `tracking-tight` | |
| H3 | -0.015em | `tracking-tight` | |
| H4 | -0.01em | `tracking-tight` | |
| body-large | 0 | `tracking-normal` | Neutral |
| body | 0 | `tracking-normal` | |
| body-small | 0.01em | `tracking-normal` | Slightly open small text |
| caption | 0.015em | `tracking-wide` | |
| overline | 0.1em | `tracking-wider` | Wide-tracked for all-caps |

---

## Weight Mapping

Default weight mapping (adjustable via `--weights`):

| Level | Weight | Rationale |
|-------|--------|-----------|
| Display | 700 | Bold headlines |
| H1 | 700 | Bold page titles |
| H2 | 600 | Semi-bold sections |
| H3 | 600 | Semi-bold subsections |
| H4 | 500 | Medium minor headings |
| body-large | 400 | Regular lead text |
| body | 400 | Regular body |
| body-small | 400 | Regular secondary |
| caption | 400 | Regular labels |
| overline | 500 | Medium all-caps |

---

## CSS Output

### Tailwind / shadcn mode (default)

Write `tailwind.typography.css` — Tailwind v4 `@theme` extension:
- Header comment with font, ratio, base size, generated date
- Google Fonts `@import` (or font loading note)
- `--font-sans`/`--font-mono` + custom `--text-{level}` tokens with `--line-height`, `--letter-spacing`, `--font-weight` sub-tokens
- `:root` fluid clamp() properties (rem-based min/max only — never pure vw per WCAG 1.4.4)
- Utility classes (`.text-display` through `.text-overline`)
- Optical sizing + dark mode antialiasing
- `text-wrap: balance` for headings, `pretty` for paragraphs

### Vanilla mode (`--vanilla`)

Write `typescale.css` instead — plain CSS custom properties (no Tailwind syntax):
- Google Fonts import
- `:root` with font families, weights, fluid font sizes (clamp, rem-based), 4px grid-snapped line heights, letter spacing, vertical rhythm tokens

---

## Accessibility (WCAG 2.2 AA)

- Body line-height >= 1.5 (SC 1.4.12)
- Layout must survive SC 1.4.12 text spacing overrides (line-height 1.5x, paragraph spacing 2x, letter-spacing 0.12x, word-spacing 0.16x)
- Fluid type min/max must be rem-based for zoom compliance (SC 1.4.4)
- Minimum practical font size: 12px

---

## Invocation Modes

### Direct: `/gsp-typography "Inter" --ratio 1.25`

Parse from args:
- **Font family** — quoted string
- **--ratio** — scale ratio
- **--secondary** — optional secondary font
- **--mono** — optional monospace font
- **--base** — base size in px (default: 16)
- **--weights** — weight list (e.g., `400,500,700`)
- **--line-height** — base line-height override (default: 1.5)
- **--vanilla** — plain CSS output instead of Tailwind
- **--no-fluid** — breakpoint steps instead of clamp()
- **--grid N** — vertical rhythm grid unit in px (default: 4)

Generate scale, write `typography.md` + CSS file.

### From style: `/gsp-typography --from-style cyberpunk`

Read the style preset YAML from `${CLAUDE_SKILL_DIR}/../gsp-style/styles/{name}.yml`. Extract:
- `typography.font-family-primary` -> primary font
- `typography.font-family-mono` -> mono font
- `typography.font-size-base` -> base size
- `typography.font-weight-heading` -> heading weight
- `typography.font-weight-body` -> body weight
- `typography.line-height-base` -> base line height

Calculate the implied ratio from the preset's type scale if present, or default to major-third (1.25).

### List ratios: `/gsp-typography --list-ratios`

Display all named ratios with values and practical context:

```
  /gsp-typography — ratios
  ===================================

  Name                Ratio    Character                Best for
  ------------------------------------------------------------------
  minor-second        1.067    Nearly invisible steps   Dense data UIs, admin panels
  major-second        1.125    Gentle, functional       Documentation, dashboards
  minor-third         1.200    Balanced, versatile      Most product UIs (Polaris uses this)
  major-third         1.250    Clear hierarchy          Marketing + product hybrid
  perfect-fourth      1.333    Strong contrast          Content-heavy sites, blogs
  augmented-fourth    1.414    Dramatic                 Editorial, magazine layouts
  perfect-fifth       1.500    Very dramatic            Landing pages, hero sections
  golden-ratio        1.618    Maximum drama            Art, luxury, display-heavy

  ------------------------------------------------------------------
  Usage: /gsp-typography "Inter" --ratio 1.25
  Preview interactively: https://typescale.com/
```

Stop here. Do not write any files.

### Preview: `/gsp-typography --preview "Inter" --ratio 1.25`

Display all 10 levels in a table with columns: Level, Mobile px, Desktop px, Fluid clamp(), Weight, LH, LS. Show base/ratio/fluid range header. Footer: grid unit, body line-height anchor, usage hint.

Stop here — do not write any files.

---

## Output Path

### Within a brand identity
If a brand context exists (`.design/branding/{brand}/`): write to `{BRAND_PATH}/identity/`.

### Standalone (no brand context)
Write to `.design/branding/_typescale/`. Create minimal directory structure.

---

## Completion

Show: header (`/gsp-typography — {font} @ {ratio}`), file tree (typography.md + CSS file), scale summary (ratio, range, levels, fluid, grid). Then offer next steps via `AskUserQuestion`: Generate palette -> `/gsp-color`, Apply a full style -> `/gsp-style`, Continue to identity -> `/gsp-brand-identity`, Done.
