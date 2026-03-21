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
- Scales are deterministic — same inputs always produce the same output
- Foundation chunks follow `references/chunk-format.md` format exactly
- All sizes include px, rem, AND fluid clamp() values for headings
- Line heights snap to a 4px grid for vertical rhythm (body 24px = 6 × 4px)
- Letter spacing follows the size-dependent curve: negative for large type, positive for small type, wide for all-caps (see reference)
- When loading from a style preset, extract only typography-related tokens
- CSS output defaults to Tailwind v4 / shadcn format unless `--vanilla` is passed
- WCAG 2.2 AA compliance: body line-height ≥ 1.5, layout must survive SC 1.4.12 text spacing overrides
- Fluid type clamp() must always use rem-based min/max — never pure vw (breaks zoom per WCAG 1.4.4)
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

```markdown
# Typography

> Phase: identity | Brand: {name} | Generated: {DATE}

---

## Font Families

| Role | Family | Variable | Source | Fallback stack |
|------|--------|----------|--------|----------------|
| Primary | {family} | {yes/no} | Google Fonts | {system fallbacks} |
| Secondary | {family or "—"} | {yes/no} | {source} | {system fallbacks} |
| Monospace | {family or "Geist Mono"} | {yes/no} | Google Fonts | ui-monospace, monospace |

**Google Fonts URL:**
`https://fonts.googleapis.com/css2?family={primary}:wght@{weights}&family={mono}:wght@400;700&display=swap`

**Self-hosting recommended** for production — eliminates third-party DNS lookup, improves GDPR compliance, and allows precise subsetting. Use WOFF2 only.

**Performance budget:** < 100KB total font weight, 2-3 weights max. If using a variable font, a single file replaces all static weights (< 150KB).

## Type Scale

Base: {base}px | Ratio: {ratio} ({ratio name}) | Grid: {grid}px

| Level | px | rem | Fluid | Weight | Line height | Letter spacing | Tailwind |
|-------|----|-----|-------|--------|-------------|----------------|----------|
| Display | {px} | {rem} | clamp({...}) | {heading wt} | {lh}px / {unitless} | -0.025em | text-[{rem}rem] tracking-tighter |
| H1 | {px} | {rem} | clamp({...}) | {heading wt} | {lh}px / {unitless} | -0.025em | text-4xl tracking-tight font-extrabold |
| H2 | {px} | {rem} | clamp({...}) | {heading wt} | {lh}px / {unitless} | -0.025em | text-3xl tracking-tight font-semibold |
| H3 | {px} | {rem} | clamp({...}) | {heading wt} | {lh}px / {unitless} | -0.015em | text-2xl tracking-tight font-semibold |
| H4 | {px} | {rem} | clamp({...}) | {heading wt} | {lh}px / {unitless} | -0.01em | text-xl tracking-tight font-semibold |
| body-large | {px} | {rem} | — | {body wt} | {lh}px / {unitless} | 0 | text-lg |
| body | {base}px | 1rem | — | {body wt} | {lh}px / {unitless} | 0 | text-base leading-7 |
| body-small | {px} | {rem} | — | {body wt} | {lh}px / {unitless} | 0.01em | text-sm |
| caption | {px} | {rem} | — | {body wt} | {lh}px / {unitless} | 0.015em | text-xs |
| overline | {px} | {rem} | — | 600 | {lh}px / {unitless} | 0.1em | text-xs uppercase tracking-wider |

## shadcn/ui Typography Classes

Ready-to-use className strings for shadcn projects. These match the calculated scale above:

```tsx
// Headings
<h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
<h2 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0">
<h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">
<h4 className="scroll-m-20 text-xl font-semibold tracking-tight">

// Body
<p className="leading-7 [&:not(:first-child)]:mt-6">
<p className="text-xl text-muted-foreground">          {/* Lead */}
<p className="text-lg font-semibold">                  {/* Large */}
<p className="text-sm font-medium leading-none">       {/* Small */}
<p className="text-sm text-muted-foreground">          {/* Muted */}

// Special
<blockquote className="mt-6 border-l-2 pl-6 italic">
<code className="relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold">
<span className="text-xs uppercase tracking-wider font-semibold"> {/* Overline */}
```

To customize these for your exact scale, extend Tailwind with the CSS file below.

## Vertical Rhythm

Grid unit: {grid}px | Body line-height: {body lh}px ({unitless})

All line-heights are snapped to {grid}px multiples. The body line-height ({body lh}px) serves as the spacing anchor — use multiples of it for consistent vertical spacing:

| Token | Value | Lines | Usage |
|-------|-------|-------|-------|
| space-xs | {grid}px | {fraction} | Inline element gaps |
| space-sm | {grid*2}px | {fraction} | Related element gaps |
| space-md | {body lh / 2}px | 0.5 | Compact section spacing |
| space-lg | {body lh}px | 1 | Default paragraph spacing |
| space-xl | {body lh * 1.5}px | 1.5 | Section breaks |
| space-2xl | {body lh * 2}px | 2 | Major section breaks |

CSS `lh` and `rlh` units (94%+ browser support) can reference line-height directly:
```css
p + p { margin-block: 1lh; }        /* one line of spacing */
section { padding-block: 2rlh; }    /* two root-line-heights */
```

## Weights

| Name | Value | Usage |
|------|-------|-------|
| Regular | {body weight} | Body text, descriptions |
| Medium | 500 | Emphasized body, nav items, labels |
| Semibold | 600 | shadcn heading default (H2-H4), overlines |
| Bold / Extrabold | {heading weight} | H1, page titles, CTAs |

## Accessibility

This scale meets WCAG 2.2 AA requirements:
- Body line-height ≥ 1.5× font size (SC 1.4.12) ✓
- Layout survives 200% zoom (SC 1.4.4) — fluid clamp() uses rem bounds ✓
- Minimum text size: {caption px}px (practical floor 12px) ✓
- Max line length recommendation: 60–75 characters (`max-w-prose` in Tailwind = 65ch)

**SC 1.4.12 resilience:** Layout must not break when users override to: line-height ≥ 1.5×, letter-spacing ≥ 0.12×, word-spacing ≥ 0.16×, paragraph-spacing ≥ 2× font size. Avoid fixed-height text containers.

## Variable Font Notes

{If the primary font is a variable font:}
- Enable optical sizing: `font-optical-sizing: auto` (browser maps opsz to font-size automatically)
- Dark mode grade adjustment: `@media (prefers-color-scheme: dark) { body { font-variation-settings: 'GRAD' -25; } }` — reduces apparent weight of light-on-dark text
- Use `font-variation-settings: 'wght' {value}` for precise weight control beyond standard keywords
{End if}

## Modern CSS Enhancements

```css
h1, h2, h3, h4 { text-wrap: balance; }  /* Auto-balance heading line lengths */
p { text-wrap: pretty; }                 /* Avoid orphans in paragraphs */
```

---

## Related

- [tailwind.typography.css](./tailwind.typography.css)
- [palettes.json](./palettes.json)
```

## Step 7: Write CSS output

### Tailwind / shadcn mode (default)

Write `{OUTPUT_PATH}/tailwind.typography.css` — extends Tailwind v4 via `@theme` with the calculated scale. Drop into your project and import in `globals.css`:

```css
/* Typography — {font family} @ {ratio} ({ratio name})
   Generated by /gsp:typescale | {DATE}
   Import in globals.css: @import './tailwind.typography.css';
   Preview: https://typescale.com/ */

/* ─── Font imports ─── */
@import url('https://fonts.googleapis.com/css2?family={primary}:wght@{weights}&family={mono}:wght@400;700&display=swap');

/* ─── Tailwind v4 theme extension ─── */
@theme {
  /* Font families */
  --font-sans: '{primary}', ui-sans-serif, system-ui, sans-serif;
  --font-mono: '{mono}', ui-monospace, 'SFMono-Regular', monospace;

  /* Custom font size tokens (extend Tailwind's built-in scale) */
  --text-display: {display rem}rem;
  --text-display--line-height: {display lh};
  --text-display--letter-spacing: -0.025em;
  --text-display--font-weight: {heading weight};

  --text-h1: {h1 rem}rem;
  --text-h1--line-height: {h1 lh};
  --text-h1--letter-spacing: -0.025em;
  --text-h1--font-weight: {heading weight};

  --text-h2: {h2 rem}rem;
  --text-h2--line-height: {h2 lh};
  --text-h2--letter-spacing: -0.025em;
  --text-h2--font-weight: {heading weight};

  --text-h3: {h3 rem}rem;
  --text-h3--line-height: {h3 lh};
  --text-h3--letter-spacing: -0.015em;
  --text-h3--font-weight: 600;

  --text-h4: {h4 rem}rem;
  --text-h4--line-height: {h4 lh};
  --text-h4--letter-spacing: -0.01em;
  --text-h4--font-weight: 600;

  --text-body-large: {body-large rem}rem;
  --text-body-large--line-height: {body-large lh};

  --text-overline: {overline rem}rem;
  --text-overline--line-height: {overline lh};
  --text-overline--letter-spacing: 0.1em;
  --text-overline--font-weight: 600;
}

/* ─── Fluid type (clamp) ─── */
:root {
  --fs-display: clamp({display min}rem, {display intercept}rem + {display slope}vw, {display max}rem);
  --fs-h1: clamp({h1 min}rem, {h1 intercept}rem + {h1 slope}vw, {h1 max}rem);
  --fs-h2: clamp({h2 min}rem, {h2 intercept}rem + {h2 slope}vw, {h2 max}rem);
  --fs-h3: clamp({h3 min}rem, {h3 intercept}rem + {h3 slope}vw, {h3 max}rem);
  --fs-h4: clamp({h4 min}rem, {h4 intercept}rem + {h4 slope}vw, {h4 max}rem);
}

/* ─── Typography utility classes ─── */
/* Use these or compose with Tailwind's built-in classes */

.text-display {
  font-size: var(--fs-display);
  line-height: {display lh};
  letter-spacing: -0.025em;
  font-weight: {heading weight};
  text-wrap: balance;
}

.prose-headings h1, .text-h1 {
  font-size: var(--fs-h1);
  line-height: {h1 lh};
  letter-spacing: -0.025em;
  font-weight: {heading weight};
  text-wrap: balance;
}

.prose-headings h2, .text-h2 {
  font-size: var(--fs-h2);
  line-height: {h2 lh};
  letter-spacing: -0.025em;
  font-weight: 600;
  text-wrap: balance;
}

.prose-headings h3, .text-h3 {
  font-size: var(--fs-h3);
  line-height: {h3 lh};
  letter-spacing: -0.015em;
  font-weight: 600;
  text-wrap: balance;
}

.prose-headings h4, .text-h4 {
  font-size: var(--fs-h4);
  line-height: {h4 lh};
  letter-spacing: -0.01em;
  font-weight: 600;
  text-wrap: balance;
}

.text-body-large {
  font-size: {body-large rem}rem;
  line-height: {body-large lh};
}

.text-overline {
  font-size: {overline rem}rem;
  line-height: {overline lh};
  letter-spacing: 0.1em;
  font-weight: 600;
  text-transform: uppercase;
}

/* ─── Optical sizing + dark mode (variable fonts) ─── */
body {
  font-optical-sizing: auto;
}

@media (prefers-color-scheme: dark) {
  body {
    /* Reduce apparent weight for light-on-dark text */
    -webkit-font-smoothing: antialiased;
  }
}

/* ─── Modern CSS enhancements ─── */
h1, h2, h3, h4, h5, h6 { text-wrap: balance; }
p { text-wrap: pretty; }
```

### Vanilla mode (`--vanilla`)

If `--vanilla` flag is set, write `{OUTPUT_PATH}/typescale.css` instead — plain CSS custom properties without Tailwind-specific syntax:

```css
/* Typography — {font family} @ {ratio} ({ratio name})
   Generated by /gsp:typescale | {DATE} */

@import url('https://fonts.googleapis.com/css2?family={primary}:wght@{weights}&family={mono}:wght@400;700&display=swap');

:root {
  /* Font families */
  --font-primary: '{primary}', {fallback stack};
  --font-secondary: '{secondary or primary}', {fallback stack};
  --font-mono: '{mono}', ui-monospace, monospace;

  /* Font weights */
  --fw-regular: {body weight};
  --fw-medium: 500;
  --fw-semibold: 600;
  --fw-bold: {heading weight};

  /* Type scale — fluid */
  --fs-display: clamp({...});
  --fs-h1: clamp({...});
  --fs-h2: clamp({...});
  --fs-h3: clamp({...});
  --fs-h4: clamp({...});
  --fs-body-large: {rem}rem;
  --fs-body: {base}rem;
  --fs-body-small: {rem}rem;
  --fs-caption: {rem}rem;
  --fs-overline: {rem}rem;

  /* Line heights (4px grid-snapped) */
  --lh-display: {value};
  --lh-h1: {value};
  --lh-h2: {value};
  --lh-h3: {value};
  --lh-h4: {value};
  --lh-body-large: {value};
  --lh-body: {value};
  --lh-body-small: {value};
  --lh-caption: {value};
  --lh-overline: {value};

  /* Letter spacing */
  --ls-display: -0.025em;
  --ls-h1: -0.025em;
  --ls-h2: -0.025em;
  --ls-h3: -0.015em;
  --ls-h4: -0.01em;
  --ls-body-large: 0;
  --ls-body: 0;
  --ls-body-small: 0.01em;
  --ls-caption: 0.015em;
  --ls-overline: 0.1em;

  /* Vertical rhythm */
  --grid-unit: {grid}px;
  --space-line: {body lh}px;
}
```

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
