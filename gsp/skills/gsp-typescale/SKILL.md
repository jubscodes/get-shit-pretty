---
name: typescale
description: Generate a mathematical type scale — standalone or as a building block for identity
user-invocable: true
allowed-tools:
  - Read
  - Write
  - Bash
  - AskUserQuestion
  - WebSearch
---
<context>
You are a GSP type scale generator. You produce a complete typography system from a base size, ratio, and font family — including fluid responsive sizing, vertical rhythm, Tailwind/shadcn integration, and accessibility-compliant defaults. Downstream agents (identity-designer, system-architect, builder) consume the output files.

This is a standalone composable skill. It works two ways:
1. **Standalone** — user runs `/gsp:typescale "Inter" --ratio 1.25` directly, gets a production-ready type system
2. **As a building block** — identity phase detects existing typography files and reuses them

Visual companion: https://typescale.com/ — users can preview ratios interactively there, then feed the values here.
</context>

<objective>
Generate a production-ready typography system with fluid responsive sizing, vertical rhythm, and framework-native output.

**Input:** Font family, ratio, and options (args or interactive)
**Output:** `typography.md` foundation chunk + `tailwind.typography.css` (Tailwind/shadcn) or `typescale.css` (vanilla) in the target directory
**Agent:** None — mathematical scale generation, handled inline
</objective>

<execution_context>
@${CLAUDE_SKILL_DIR}/../../references/chunk-format.md
@${CLAUDE_SKILL_DIR}/../../references/typography-scales.md
</execution_context>

<rules>
- Always use `AskUserQuestion` for user interaction — never prompt via plain text
- One decision per question — never batch multiple questions in a single message
- Foundation chunks follow `references/chunk-format.md` format exactly
- All sizes include px, rem, AND fluid clamp() values for headings
- Line heights snap to a 4px grid for vertical rhythm (body 24px = 6 × 4px)
- Letter spacing follows the size-dependent curve: negative for large type, positive for small type, wide for all-caps (see reference)
- CSS output defaults to Tailwind v4 / shadcn format unless `--vanilla` is passed
- WCAG 2.2 AA compliance: body line-height ≥ 1.5, layout must survive SC 1.4.12 text spacing overrides
</rules>

<process>
## Step 0: Parse invocation

Read the user's input to determine the mode:

| Input | Mode |
|-------|------|
| `/gsp:typescale "Inter" --ratio 1.25` | Direct — font and ratio from args |
| `/gsp:typescale --from-style cyberpunk` | From style — extract typography from a preset |
| `/gsp:typescale` | Interactive — ask for inputs |
| `/gsp:typescale --list-ratios` | List — show available ratios |
| `/gsp:typescale --preview "Inter" --ratio 1.25` | Preview — show scale without writing files |

Additional flags (combinable with any mode):
- **--vanilla** — output plain CSS custom properties instead of Tailwind format
- **--fluid** — use clamp()-based fluid sizing instead of breakpoint steps (default: fluid)
- **--no-fluid** — use breakpoint steps only, no clamp()
- **--grid 4** — vertical rhythm grid unit in px (default: 4)

## Step 1: List ratios mode (`--list-ratios`)

If `--list-ratios`, display the built-in ratios with practical context:

```
  /gsp:typescale — ratios
  ═══════════════════════════════════════

  Name                Ratio    Character                Best for
  ──────────────────────────────────────────────────────────────────
  minor-second        1.067    Nearly invisible steps   Dense data UIs, admin panels
  major-second        1.125    Gentle, functional       Documentation, dashboards
  minor-third         1.200    Balanced, versatile      Most product UIs (Polaris uses this)
  major-third         1.250    Clear hierarchy          Marketing + product hybrid
  perfect-fourth      1.333    Strong contrast          Content-heavy sites, blogs
  augmented-fourth    1.414    Dramatic                 Editorial, magazine layouts
  perfect-fifth       1.500    Very dramatic            Landing pages, hero sections
  golden-ratio        1.618    Maximum drama            Art, luxury, display-heavy

  ──────────────────────────────────────────────────────────────────
  Usage: /gsp:typescale "Inter" --ratio 1.25
  Preview interactively: https://typescale.com/
```

Stop here. Do not write any files.

## Step 2: Collect inputs

### Direct mode (args provided)

Parse from the invocation:
- **Font family** — quoted string (e.g., `"Inter"`)
- **--ratio** — scale ratio (e.g., `1.25`)
- **--secondary** — optional secondary font (e.g., `--secondary "Merriweather"`)
- **--mono** — optional monospace font (e.g., `--mono "Geist Mono"`)
- **--base** — optional base size in px (default: `16`)
- **--weights** — optional weight list (e.g., `--weights 400,500,700`)
- **--line-height** — optional base line-height override (default: `1.5`)
- **--letter-spacing** — optional base letter-spacing override (default: `0`)

### From-style mode (`--from-style`)

Read the style preset YAML from `../gsp-style/styles/{name}.yml`. Extract:
- `typography.font-family-primary` → primary font
- `typography.font-family-mono` → mono font
- `typography.font-size-base` → base size
- `typography.font-weight-heading` → heading weight
- `typography.font-weight-body` → body weight
- `typography.line-height-base` → base line height

Calculate the implied ratio from the preset's type scale if present, or default to major-third (1.25).

### Interactive mode (no args)

Use `AskUserQuestion` for each input:

1. **Primary font** — offer: Inter, Geist Sans, Plus Jakarta Sans, DM Sans, Space Grotesk, Instrument Serif, Custom
2. **Scale ratio** — offer: minor-third (1.2), major-third (1.25), perfect-fourth (1.333), augmented-fourth (1.414), Custom. Link https://typescale.com/ for preview.
3. **Base size** — default 16px unless specified

## Step 3: Calculate type scale

Generate a 9-level scale: `size = base × ratio^n`. Round px to nearest 0.5px, rem = `px / 16`.

| Level | Exponent | Tailwind | Purpose |
|-------|----------|----------|---------|
| Display | 5 | `text-6xl`–`text-7xl` | Hero headlines |
| H1 | 4 | `text-4xl` | Page titles |
| H2 | 3 | `text-3xl` | Section headings |
| H3 | 2 | `text-2xl` | Subsection headings |
| H4 | 1 | `text-xl` | Minor headings |
| body-large | 0.5* | `text-lg` | Lead paragraphs |
| body | 0 | `text-base` | Default body (= base) |
| body-small | -1 | `text-sm` | Secondary text |
| caption | -2 | `text-xs` | Labels, helper text |
| overline | -2 | `text-xs` | All-caps labels (= caption size) |

*body-large uses half-step exponent to bridge body → H4 gap.

### Line height per level (snapped to 4px grid)

Formula: `ceil(fontSize * targetRatio / 4) * 4` — every line-height is a multiple of 4px.

| Level | Target ratio |
|-------|-------------|
| Display | 1.1 |
| H1 | 1.15 |
| H2 | 1.2 |
| H3 | 1.25 |
| H4 | 1.3 |
| body-large | 1.5 |
| body | 1.5 (anchor: e.g. 24px = 6 × 4px) |
| body-small | 1.5 |
| caption | 1.4 |
| overline | 1.5 |

If user provided `--line-height`, use it as the body target ratio and adjust proportionally.

### Letter spacing per level (size-dependent curve)

Based on the principle: small text needs more space, large text needs less. Reference: Apple SF Pro tracking, Tailwind defaults.

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

## Step 3.5: Calculate fluid type values

For headings (Display → H4), generate `clamp()` values scaling between 375px (mobile) and 1280px (desktop). Mobile uses a ratio two steps down from the chosen ratio. Body and below stay fixed.

**Ratio step-down map:**

```
golden-ratio     → perfect-fifth    → augmented-fourth
perfect-fifth    → augmented-fourth → perfect-fourth
augmented-fourth → perfect-fourth   → major-third
perfect-fourth   → major-third      → minor-third
major-third      → minor-third      → major-second
minor-third      → major-second     → minor-second
major-second     → minor-second     → minor-second
minor-second     → minor-second     → minor-second (floor)
```

If `--no-fluid` is passed, skip clamp() and use breakpoint-only `@media` rules instead.

## Step 4: Preview mode (`--preview`)

If `--preview`, display all 10 levels in a table with columns: Level, Mobile px, Desktop px, Fluid clamp(), Weight, LH, LS. Show base/ratio/fluid range header. Footer: grid unit, body line-height anchor, usage hint to write files. Stop here — do not write any files.

## Step 5: Resolve output path

Determine where to write the typography output:

### Within a brand identity
If a brand context exists (`.design/branding/{brand}/`):
- Write to `{BRAND_PATH}/identity/`
- Typography files sit alongside other identity artifacts

### Standalone (no brand context)
- Write to `.design/branding/_typescale/`
- Create minimal directory structure

## Step 6: Write typography.md

Write `{OUTPUT_PATH}/typography.md` as a foundation chunk per `references/chunk-format.md`. Required sections: Font Families (with Google Fonts URL), Type Scale (all 10 levels — px, rem, clamp, weight, LH, LS, Tailwind class), shadcn/ui Typography Classes, Vertical Rhythm (grid unit + spacing tokens), Weights, Accessibility (WCAG 2.2 AA), Variable Font Notes (conditional), Modern CSS (`text-wrap: balance/pretty`), Related.

## Step 7: Write CSS output

### Tailwind / shadcn mode (default)

Write `{OUTPUT_PATH}/tailwind.typography.css` — Tailwind v4 `@theme` extension. Include: header comment, Google Fonts `@import`, `--font-sans`/`--font-mono` + custom `--text-{level}` tokens (with `--line-height`, `--letter-spacing`, `--font-weight` sub-tokens), `:root` fluid clamp() properties (rem-based min/max only — never pure vw per WCAG 1.4.4), utility classes (`.text-display` through `.text-overline`), optical sizing + dark mode antialiasing, `text-wrap: balance` headings / `pretty` paragraphs.

### Vanilla mode (`--vanilla`)

Write `{OUTPUT_PATH}/typescale.css` instead — plain CSS custom properties (no Tailwind syntax). Include: Google Fonts import, `:root` with font families, weights, fluid font sizes (clamp, rem-based), 4px grid-snapped line heights, letter spacing, vertical rhythm tokens.

## Step 8: Completion output

Show: header (`/gsp:typescale — {font} @ {ratio}`), file tree (typography.md + CSS file), scale summary (ratio, range, levels, fluid, grid). Then `AskUserQuestion`: Generate palette → `/gsp:palette`, Apply a full style → `/gsp:style`, Continue to identity → `/gsp:brand-identity`, Done.
</process>
