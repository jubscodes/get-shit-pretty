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

1. **Primary font** — "What's your primary font family?" with options:
   - **Inter** — "clean geometric sans-serif, great all-rounder"
   - **Geist Sans** — "Vercel's modern sans — pairs with Geist Mono"
   - **Plus Jakarta Sans** — "modern geometric with personality"
   - **DM Sans** — "low-contrast geometric, contemporary"
   - **Space Grotesk** — "technical, monospaced-inspired sans"
   - **Instrument Serif** — "elegant serif with sharp details"
   - **Custom** — "enter your own font family"

2. **Scale ratio** — "What scale ratio? Preview interactively at https://typescale.com/" with options:
   - **minor-third (1.2)** — "balanced, safe default — used by Shopify Polaris"
   - **major-third (1.25)** — "clear hierarchy, marketing-friendly"
   - **perfect-fourth (1.333)** — "strong contrast, bold headlines"
   - **augmented-fourth (1.414)** — "dramatic, editorial feel"
   - **Custom** — "enter a custom ratio"

3. **Base size** — default to 16px unless user specifies otherwise

## Step 3: Calculate type scale

Generate a 9-level scale from the base size and ratio. Each level is calculated as:

```
size = base × ratio^n
```

Where `n` is the level's exponent:

| Level | Exponent | Tailwind class | shadcn equivalent | Purpose |
|-------|----------|----------------|-------------------|---------|
| Display | 5 | `text-6xl`–`text-7xl` | — | Hero headlines, splash screens |
| H1 | 4 | `text-4xl` | `scroll-m-20 text-4xl font-extrabold tracking-tight` | Page titles |
| H2 | 3 | `text-3xl` | `scroll-m-20 text-3xl font-semibold tracking-tight` | Section headings |
| H3 | 2 | `text-2xl` | `scroll-m-20 text-2xl font-semibold tracking-tight` | Subsection headings |
| H4 | 1 | `text-xl` | `scroll-m-20 text-xl font-semibold tracking-tight` | Minor headings |
| body-large | 0.5* | `text-lg` | Lead: `text-xl text-muted-foreground` | Lead paragraphs, intros |
| body | 0 | `text-base` | `leading-7 [&:not(:first-child)]:mt-6` | Default body text (= base size) |
| body-small | -1 | `text-sm` | Small: `text-sm font-medium leading-none` | Secondary text, metadata |
| caption | -2 | `text-xs` | Muted: `text-sm text-muted-foreground` | Labels, helper text |
| overline | -2 | `text-xs` | — | All-caps category labels (same size as caption) |

*body-large uses exponent 0.5 (half-step) to avoid an awkward gap between body and H4.

Round px values to nearest 0.5px. Calculate rem as `px / 16`.

### Line height per level (snapped to 4px grid)

Line height is calculated as: `ceil(fontSize * ratio / gridUnit) * gridUnit`
Where `ratio` is the target unitless line-height and `gridUnit` is 4px.

This ensures vertical rhythm — every line-height is a multiple of 4px.

| Level | Target ratio | Grid-snapped example (16px base, 1.25 ratio) |
|-------|-------------|-----------------------------------------------|
| Display | 1.1 | Round to nearest 4px multiple |
| H1 | 1.15 | |
| H2 | 1.2 | |
| H3 | 1.25 | |
| H4 | 1.3 | |
| body-large | 1.5 | |
| body | 1.5 | 24px (6 × 4px) — anchor for spacing scale |
| body-small | 1.5 | 20px (5 × 4px) |
| caption | 1.4 | 16px (4 × 4px) |
| overline | 1.5 | 16px (4 × 4px) |

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

For each heading level (Display through H4), generate a `clamp()` value that fluidly scales between mobile and desktop viewports.

**Parameters:**
- Min viewport: 375px (mobile)
- Max viewport: 1280px (desktop)
- Mobile ratio: step down two named ratios from chosen ratio
- Desktop ratio: the chosen ratio

**clamp() formula:**
```
slope = (maxSize - minSize) / (maxViewport - minViewport)
intercept = minSize - slope * minViewport
clamp(minSize_rem, intercept_rem + slope * 100vw, maxSize_rem)
```

**Ratio step-down map** (each entry steps to the next lower named ratio):

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

Mobile size = `base × mobileRatio^exponent`
Desktop size = `base × desktopRatio^exponent`

Body and below don't scale — they stay at the base size across all viewports.

If `--no-fluid` is passed, skip clamp() and use breakpoint-only `@media` rules instead.

## Step 4: Preview mode (`--preview`)

If `--preview`, display the full scale without writing files:

```
  /gsp:typescale preview — {font family}
  ═══════════════════════════════════════

  Base: {base}px | Ratio: {ratio} ({ratio name})
  Fluid: 375px → 1280px | Mobile ratio: {mobile ratio name}

  Level         Mobile       Desktop      Fluid clamp()                          Weight   LH     LS
  ───────────────────────────────────────────────────────────────────────────────────────────────────
  Display       {px}px       {px}px       clamp({min}, {pref}, {max})            {wt}     {lh}   -0.025em
  H1            {px}px       {px}px       clamp({min}, {pref}, {max})            {wt}     {lh}   -0.025em
  H2            {px}px       {px}px       clamp({min}, {pref}, {max})            {wt}     {lh}   -0.025em
  H3            {px}px       {px}px       clamp({min}, {pref}, {max})            {wt}     {lh}   -0.015em
  H4            {px}px       {px}px       clamp({min}, {pref}, {max})            {wt}     {lh}   -0.01em
  body-large    {px}px       —            —                                      {wt}     {lh}   0
  body          {base}px     —            —                                      {wt}     {lh}   0
  body-small    {px}px       —            —                                      {wt}     {lh}   0.01em
  caption       {px}px       —            —                                      {wt}     {lh}   0.015em
  overline      {px}px       —            —                                      600      {lh}   0.1em
  ───────────────────────────────────────────────────────────────────────────────────────────────────

  Vertical rhythm grid: {grid}px
  Body line-height: {lh}px ({lh/base} unitless) — spacing anchor

  Run /gsp:typescale "{font}" --ratio {ratio} to write files.
```

Stop here. Do not write any files.

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

Write `{OUTPUT_PATH}/typography.md` as a foundation chunk per `references/chunk-format.md`:

The typography.md chunk must include these sections with calculated values from Step 3:

- **Font Families** — table with Role, Family, Variable (yes/no), Source, Fallback stack. Include Google Fonts URL and self-hosting note.
- **Type Scale** — table with Level, px, rem, Fluid clamp(), Weight, Line height (px + unitless), Letter spacing, Tailwind class. All 10 levels: Display, H1-H4, body-large, body, body-small, caption, overline.
- **shadcn/ui Typography Classes** — ready-to-use className strings for headings, body, and special elements (blockquote, code, overline). Customize values to match the calculated scale.
- **Vertical Rhythm** — grid unit, body line-height as spacing anchor, spacing token table (space-xs through space-2xl) with values, lines, and usage. Include CSS `lh`/`rlh` unit examples.
- **Weights** — table mapping Regular/Medium/Semibold/Bold to values and usage.
- **Accessibility** — WCAG 2.2 AA compliance notes: body line-height ≥ 1.5, zoom survival, minimum text size, max line length. SC 1.4.12 resilience note.
- **Variable Font Notes** — conditional section: optical sizing, dark mode grade adjustment, precise weight control.
- **Modern CSS Enhancements** — `text-wrap: balance` for headings, `text-wrap: pretty` for paragraphs.
- **Related** — links to companion files.

## Step 7: Write CSS output

### Tailwind / shadcn mode (default)

Write `{OUTPUT_PATH}/tailwind.typography.css` — extends Tailwind v4 via `@theme` with the calculated scale. Drop into your project and import in `globals.css`:

The CSS file must include these sections, using calculated values from Step 3:

- **Header comment** — font family, ratio name, date, import instruction
- **Font imports** — Google Fonts `@import url()` for primary + mono families
- **Tailwind v4 @theme extension** — `--font-sans`, `--font-mono` families, plus custom `--text-{level}` tokens for Display, H1-H4, body-large, overline (each with `--line-height`, `--letter-spacing`, `--font-weight` sub-tokens)
- **Fluid type custom properties** — `:root` block with `--fs-display` through `--fs-h4` using `clamp()` (rem-based min/max, never pure vw — required for WCAG 1.4.4 zoom compliance)
- **Typography utility classes** — `.text-display`, `.text-h1` through `.text-h4`, `.text-body-large`, `.text-overline` with corresponding font-size (using fluid var), line-height, letter-spacing, font-weight, and `text-wrap: balance` for headings
- **Optical sizing + dark mode** — `font-optical-sizing: auto`, dark mode antialiasing
- **Modern CSS** — `text-wrap: balance` on headings, `text-wrap: pretty` on paragraphs

### Vanilla mode (`--vanilla`)

If `--vanilla` flag is set, write `{OUTPUT_PATH}/typescale.css` instead — plain CSS custom properties without Tailwind-specific syntax:

Plain CSS custom properties (no Tailwind syntax). Include:

- **Font imports** — Google Fonts `@import`
- **:root custom properties** — font families (`--font-primary`, `--font-secondary`, `--font-mono`), font weights (`--fw-regular` through `--fw-bold`), fluid font sizes (`--fs-display` through `--fs-overline` with clamp() for headings, rem-based min/max only — never pure vw per WCAG 1.4.4), line heights (`--lh-display` through `--lh-overline`, 4px grid-snapped), letter spacing (`--ls-display` through `--ls-overline`), vertical rhythm (`--grid-unit`, `--space-line`)

## Step 8: Completion output

Display the result:

```
  /gsp:typescale — {font family} @ {ratio}
  ═══════════════════════════════════════

  {OUTPUT_PATH}/
  ├── typography.md              Foundation chunk
  └── tailwind.typography.css    Tailwind v4 / shadcn ready

  Scale: {ratio name} ({ratio})
  Range: {caption px}px → {display px}px
  Levels: 10 (Display → Overline)
  Fluid: 375px → 1280px (clamp)
  Grid: {grid}px vertical rhythm

  ─────────────────────────────────────
```

Then use `AskUserQuestion` with routing options:

- **Generate palette** — "pair this type scale with color palettes" → route to `/gsp:palette`
- **Apply a full style** — "use a style preset for the complete system" → route to `/gsp:style`
- **Continue to identity** — "use this type scale in the branding diamond" → route to `/gsp:brand-identity`
- **Done** — "that's all for now"
</process>
