# Typography & Type Scale Reference

Comprehensive reference for type scale generation, responsive typography, and typographic design decisions.

---

## 1. Type Scale Mathematics

### Standard Ratios (Musical Intervals)

| Name | Ratio | Character | Best For |
|------|-------|-----------|----------|
| Minor Second | 1.067 | Nearly invisible steps | Dense data UIs, admin panels |
| Major Second | 1.125 | Subtle, functional | Documentation, dashboards |
| Minor Third | 1.200 | Balanced, versatile | Most product UIs (Polaris uses this) |
| Major Third | 1.250 | Clear hierarchy | Marketing + product hybrid |
| Perfect Fourth | 1.333 | Strong hierarchy | Content-heavy sites, blogs |
| Augmented Fourth | 1.414 | Dramatic | Editorial, magazines |
| Perfect Fifth | 1.500 | Very dramatic | Landing pages, heroes |
| Golden Ratio | 1.618 | Maximum drama | Art, luxury, display-heavy |

### Modular Scale Formula

Given a base size `b` and ratio `r`, any step `n` is:

```
size(n) = b * r^n
```

Negative steps (smaller sizes): `size(-1) = b * r^(-1) = b / r`

### Linear Scale

Instead of geometric (multiply), add a fixed increment:

```
size(n) = base + (n * increment)
```

Example: base=16, increment=4 produces 12, 16, 20, 24, 28, 32...
Advantage: predictable pixel snapping to 4px grid. Disadvantage: hierarchy flattens at large sizes.

### Compound/Custom Approaches

**IBM Carbon formula** — A recursive, non-geometric scale:
```
Y(1) = 12px (base)
Y(n) = Y(n-1) + (floor((n-2)/4) + 1) * 2
```

Produces 23 steps: 12, 14, 16, 18, 20, 22, 24, 28, 32, 36, 40, 44, 48, 52, 56, 60, 64, 68, 72, 76, 80, 84, 92px

Key insight: increments start at +2px and grow to +4px, +8px at larger sizes. This gives tight control at text sizes and dramatic jumps at display sizes — a smarter progression than a single ratio.

**Hybrid approach** — Use one ratio for body/UI range (e.g., 1.125 for 12-20px) and a different ratio for display range (e.g., 1.2 or 1.25 for 24-72px). This avoids the "too tight at top" or "too spread at bottom" problem of single-ratio scales.

### Fluid Type Scales (Utopia Approach)

Define TWO scales — one for small viewport, one for large — and interpolate:

**Configuration:**
- Min viewport: 320px, max viewport: 1500px
- Min base: 17px, max base: 20px
- Min ratio: 1.2, max ratio: 1.33

**CSS lock formula:**
```css
--fluid-bp: calc(
  (100vw - var(--fluid-min-width)) /
  (var(--fluid-max-width) - var(--fluid-min-width))
);

/* Each step interpolates between its min and max: */
--fluid-N: calc(
  var(--min-size-N) * 1rem +
  (var(--max-size-N) - var(--min-size-N)) * var(--fluid-bp)
);
```

**Clamp shorthand** (preferred, single-line):
```css
/* slope = (maxSize - minSize) / (maxWidth - minWidth) */
/* intercept = minSize - slope * minWidth */
font-size: clamp(minSize_rem, intercept_rem + slope * 100vw, maxSize_rem);
```

Example for body text (16px at 320vw, 20px at 1280vw):
```css
font-size: clamp(1rem, 0.5833rem + 0.4167vw, 1.25rem);
```

---

## 2. Real-World Design System Type Scales

### Apple HIG (San Francisco)

**Font:** SF Pro (variable font since 2022)
- SF Pro Text optimized for <=19pt (wider spacing, heavier strokes)
- SF Pro Display optimized for >=20pt (tighter spacing, more contrast)
- Variable font transitions smoothly between 17-28pt

**Default type scale (at "Large" Dynamic Type setting):**

| Style | Size | Weight | Leading | Tracking |
|-------|------|--------|---------|----------|
| Large Title | 34pt | Regular | 41pt | 11pt |
| Title 1 | 28pt | Regular | 34pt | 13pt |
| Title 2 | 22pt | Regular | 28pt | 16pt |
| Title 3 | 20pt | Regular | 24pt | 19pt |
| Headline | 17pt | Semi-Bold | 22pt | -24pt |
| Body | 17pt | Regular | 22pt | -24pt |
| Callout | 16pt | Regular | 21pt | -20pt |
| Subhead | 15pt | Regular | 20pt | -16pt |
| Footnote | 13pt | Regular | 18pt | -6pt |
| Caption 1 | 12pt | Regular | 16pt | 0pt |
| Caption 2 | 11pt | Regular | 13pt | 6pt |

Note: Tracking values are in thousandths of an em. Negative = tighter (large text), positive = looser (small text). This is the core principle of size-dependent tracking.

**Dynamic Type** scales all 11 styles across 7 base sizes (xSmall through xxxLarge) plus 5 accessibility sizes.

### Material Design 3

**Font:** Roboto (default), supports any via theme tokens
**Base approach:** Not a mathematical ratio — hand-tuned sizes with design tokens

**Complete token set (15 core + recent additions):**

| Token | Size | Line Height | Weight | Tracking |
|-------|------|-------------|--------|----------|
| Display XL | 88px | 96px | 475 | 0 |
| Display L | 57px | 64px | 475 | 0 |
| Display M | 45px | 52px | 475 | 0 |
| Display S | 36px | 44px | 475 | 0 |
| Headline L | 32px | 40px | 475 | 0 |
| Headline M | 28px | 36px | 475 | 0 |
| Headline S | 24px | 32px | 475 | 0 |
| Title L | 22px | 30px | 400 | 0 |
| Title M | 16px | 24px | 500 | 0 |
| Title S | 14px | 20px | 500 | 0 |
| Body L | 16px | 24px | 400 | 0 |
| Body M | 14px | 20px | 400 | 0 |
| Body S | 12px | 16px | 400 | 0.1px |
| Label L | 14px | 20px | 500 | 0 |
| Label M | 12px | 16px | 500 | 0.1px |
| Label S | 11px | 16px | 500 | 0.1px |

Token naming: `--md-sys-typescale-{role}-{size}-{property}`
Properties: `font-size`, `font-weight`, `line-height`, `tracking`

### IBM Carbon

**Font:** IBM Plex (Sans, Serif, Mono — a superfamily)
**Base sizes:** 14px (productive), 16px (expressive)

**Full type scale** (23 steps via recursive formula):
12, 14, 16, 18, 20, 22, 24, 28, 32, 36, 40, 44, 48, 52, 56, 60, 64, 68, 72, 76, 80, 84, 92px

**Type sets** use semantic names with dual suffix convention:
- `-01` suffix = productive (dense UI, 14px base)
- `-02` suffix = expressive (marketing, 16px base)

Example tokens: `heading-03` = 20px/1.4 productive, `display-02` = 42px/1.15 expressive

Uses fluid typography with `calc()` formula: `font-size: calc(0.04412rem + 1.47059vw)` at certain breakpoints.

### Shopify Polaris

**Font:** Inter (variable font)
**Ratio:** 1.2 (minor third), base 14px, rounded to 4px multiples
**All line heights on 4px grid**

| Token | Size | Rem |
|-------|------|-----|
| `--p-font-size-75` | 12px | 0.75rem |
| `--p-font-size-100` (base) | 14px | 0.875rem |
| `--p-font-size-200` | 16px | 1rem |
| `--p-font-size-300` | 20px | 1.25rem |
| `--p-font-size-400` | 24px | 1.5rem |
| `--p-font-size-500` | 32px | 2rem |
| `--p-font-size-600` | 28px | 1.75rem |
| `--p-font-size-700` | 40px | 2.5rem |

Line heights: 16, 20, 24, 28, 32, 40, 48px (all 4px grid multiples)
Font weights: 400, 500, 600, 700
Two categories only: Heading (Xs-2xl) and Body (Xs-Lg)

### GitHub Primer

**Font:** System font stacks (performance-first)
**Responsive scale with mobile/desktop breakpoints:**

| Scale | Mobile | Desktop |
|-------|--------|---------|
| f00 | 40px | 48px |
| f0 | 32px | 40px |
| f1 | 26px | 32px |
| f2 | 22px | 24px |
| f3 | 18px | 20px |
| f4 | 16px | 16px |
| f5 | 14px | 14px |
| f6 | 12px | 12px |

Font sizes use rem units. Line heights are unitless: `lh-default`, `lh-condensed`, `lh-condensed-ultra`. Lighter weights (`.f00-light` through `.f3-light`) only for sizes >= 20px.

### Tailwind CSS

**Font:** User-configured (no default font family)
**Scale:** Not ratio-based — hand-tuned sizes optimized for each level

| Class | Size | Line Height |
|-------|------|-------------|
| text-xs | 12px / 0.75rem | 1.333 (16px) |
| text-sm | 14px / 0.875rem | 1.429 (20px) |
| text-base | 16px / 1rem | 1.5 (24px) |
| text-lg | 18px / 1.125rem | 1.556 (28px) |
| text-xl | 20px / 1.25rem | 1.4 (28px) |
| text-2xl | 24px / 1.5rem | 1.333 (32px) |
| text-3xl | 30px / 1.875rem | 1.2 (36px) |
| text-4xl | 36px / 2.25rem | 1.111 (40px) |
| text-5xl | 48px / 3rem | 1.0 |
| text-6xl | 60px / 3.75rem | 1.0 |
| text-7xl | 72px / 4.5rem | 1.0 |
| text-8xl | 96px / 6rem | 1.0 |
| text-9xl | 128px / 8rem | 1.0 |

Letter spacing tokens:
- `tracking-tighter`: -0.05em
- `tracking-tight`: -0.025em
- `tracking-normal`: 0em
- `tracking-wide`: 0.025em
- `tracking-wider`: 0.1em
- `tracking-widest`: 0.2em

Tailwind v4 supports combined size/line-height: `text-sm/6` and custom tokens via `@theme` with `--text-{name}--line-height`, `--text-{name}--letter-spacing`, `--text-{name}--font-weight`.

### Vercel Geist

**Font:** Geist Sans, Geist Mono, Geist Pixel
**Scale:** Named by pixel size, not ratio-based

Categories and their size ranges:
- **Heading:** 14, 16, 20, 24, 32, 40, 48, 56, 64, 72px
- **Copy:** 13, 14, 16, 18, 20, 24px
- **Label:** 12, 13, 14, 16, 18, 20px
- **Button:** 12, 14, 16px

Each style is a Tailwind class preset combining font-size, line-height, letter-spacing, and font-weight. Supports "Subtle" modifier for headings (reduced weight) and "Strong" modifier for copy/labels.

---

## 3. Responsive Typography

### Fluid Type with clamp()

**The formula:**
```css
font-size: clamp(min, preferred, max);
/* where preferred = intercept + slope * 100vw */
/* slope = (max - min) / (maxViewport - minViewport) */
/* intercept = min - slope * minViewport */
```

**Practical example (16px to 20px between 320px and 1280px viewport):**
```css
/* slope = (20 - 16) / (1280 - 320) = 0.004167 */
/* intercept = 16 - 0.004167 * 320 = 14.667px = 0.9167rem */
font-size: clamp(1rem, 0.9167rem + 0.4167vw, 1.25rem);
```

### Accessibility constraint for fluid type

WCAG 1.4.4 requires 200% zoom support. For fluid type, ensure:
**max font size <= 2.5x min font size**

The vw component does NOT respond to browser zoom — only the rem/em components do. This is why clamp() must always have rem-based min and max, not pure vw.

### Container Queries for Type

```css
@container (min-width: 400px) {
  .card-title { font-size: 1.25rem; }
}
@container (min-width: 600px) {
  .card-title { font-size: 1.5rem; }
}
```

Container queries let components adapt to their container, not the viewport. Useful for card-based layouts, modals, and sidebar content where viewport width is irrelevant.

### Best Practice (2025-2026)

1. Use `clamp()` for fluid base sizes tied to viewport
2. Use container queries for component-level type adjustments
3. Avoid pure `vw` units for font-size (breaks zoom)
4. Always set rem-based min and max in clamp()
5. Use CSS `pow()` function for generating ratio-based scales:
```css
:root {
  --scale: 1.2;
  --step-1: calc(1rem * pow(var(--scale), 1));  /* 1.2rem */
  --step-2: calc(1rem * pow(var(--scale), 2));  /* 1.44rem */
  --step-3: calc(1rem * pow(var(--scale), 3));  /* 1.728rem */
}
```

---

## 4. Optical Sizing and Variable Fonts

### Variable Font Axes

**Registered axes** (standardized, lowercase tags):

| Axis | Tag | Range | Purpose |
|------|-----|-------|---------|
| Weight | wght | 1-1000 | Thin to Black |
| Width | wdth | 50-200 | Condensed to Expanded |
| Slant | slnt | -90 to 90 | Oblique angle |
| Italic | ital | 0 or 1 | Roman or Italic |
| Optical Size | opsz | Varies | Size-specific optimization |

**Custom axes** (font-specific, uppercase tags):
- `GRAD` (Grade) — Adjusts weight without changing width/spacing
- `CASL` (Casual) — Formal to casual letterforms (e.g., Recursive)
- `CRSV` (Cursive) — Controls cursive appearance
- `MONO` (Monospace) — Proportional to monospace transition

### Optical Sizing (opsz)

At small sizes: thicker strokes, wider spacing, larger x-height, open counters
At large sizes: thinner strokes, tighter spacing, more contrast, refined details

**CSS control:**
```css
/* Auto (browser matches opsz to font-size): */
font-optical-sizing: auto;

/* Manual override: */
font-variation-settings: 'opsz' 48;
```

When `font-optical-sizing: auto` is set, the browser automatically maps font-size to the opsz axis value. SF Pro transitions between Text and Display characteristics between 17-28pt using this mechanism.

### Grade Axis (GRAD)

Grade changes apparent weight without changing the space a glyph occupies. Use cases:
- Compensate for dark mode (reduce grade so white-on-dark text doesn't look heavier)
- Adjust for different rendering environments
- Create hover/active states without layout shift

```css
/* Reduce grade in dark mode: */
@media (prefers-color-scheme: dark) {
  body { font-variation-settings: 'GRAD' -50; }
}
```

### Type Scale Tool Implications

A type scale generator should:
1. Detect if a font is variable and which axes it supports
2. Recommend `font-optical-sizing: auto` when opsz is available
3. Suggest grade adjustments for dark mode when GRAD is available
4. Use `wght` axis values (not font-weight keywords) for precision
5. Consider that variable fonts eliminate the Text/Display split — one file handles all sizes

---

## 5. Vertical Rhythm and Baseline Grids

### The Math

1. Choose a **base unit** (typically 4px or 8px)
2. Set **body line-height** as a multiple of the base unit
3. All vertical spacing (margins, padding, gaps) must be multiples of the base unit

**Example with 4px base, 16px body:**
```
Body: 16px font, 24px line-height (6 * 4px)
H3:   20px font, 28px line-height (7 * 4px)
H2:   24px font, 32px line-height (8 * 4px)
H1:   32px font, 40px line-height (10 * 4px)
```

**Line-height calculation formula:**
```
line-height = ceil(font-size / base-unit) * base-unit
```
If font-size=20 and base-unit=4: `ceil(20/4) * 4 = 20` — too tight, so add one unit: 24.
Rule: if `line-height == font-size`, add one base unit.

**Better formula:**
```
line-height = ceil(font-size * ratio / base-unit) * base-unit
```
Where `ratio` is typically 1.2 to 1.5. For body text, 1.5 is standard. For headings, 1.1-1.3.

### CSS lh and rlh Units

```css
/* lh = computed line-height of current element */
/* rlh = computed line-height of root element */

p { margin-block: 1lh; }        /* Margin equals one line of the paragraph */
.card { padding: 1rlh 2rlh; }   /* Tied to root rhythm */
.spacer { height: 2rlh; }       /* Exact 2-line gap */
```

Browser support: 94%+ (shipped in all major browsers 2023). Fallback:
```css
padding: 1.5rem;  /* fallback */
padding: 1rlh;    /* modern */
```

### Spacing Scale Aligned to Typography

If body line-height = 24px (1.5rem), derive spacing from it:

| Token | Value | Lines |
|-------|-------|-------|
| space-xs | 4px | 1/6 |
| space-sm | 8px | 1/3 |
| space-md | 16px | 2/3 |
| space-lg | 24px | 1 |
| space-xl | 32px | 4/3 |
| space-2xl | 48px | 2 |
| space-3xl | 64px | 8/3 |
| space-4xl | 96px | 4 |

---

## 6. Letter Spacing Rules

### The Core Principle

**Small text needs MORE spacing (positive tracking)**
**Large text needs LESS spacing (negative tracking)**

This is because:
- At small sizes, characters crowd together and become illegible
- At large sizes, the inter-character space appears disproportionately large

### Apple SF Pro Tracking Reference

Apple's tracking values (in thousandths of an em) demonstrate the curve:

| Size | Tracking | Direction |
|------|----------|-----------|
| 11pt | +6 | Looser |
| 12pt | 0 | Neutral |
| 13pt | -6 | Slightly tight |
| 15pt | -16 | Tighter |
| 16pt | -20 | Tighter |
| 17pt | -24 | Tighter |
| 20pt | +19 | Switches to Display, reopens |
| 22pt | +16 | |
| 28pt | +13 | |
| 34pt | +11 | Converging to neutral at large sizes |

Note: The apparent reversal at 20pt is because Apple switches from SF Text to SF Display, which has its own tracking curve. With the variable font, this transition is continuous.

### Practical Tracking Guidelines

| Size Range | Letter Spacing | Notes |
|------------|---------------|-------|
| < 12px | +0.05em to +0.1em | Essential for legibility |
| 12-16px | 0 to +0.02em | Minimal adjustment |
| 16-24px | 0 to -0.01em | Default or very slight tightening |
| 24-48px | -0.01em to -0.02em | Noticeable tightening |
| 48px+ | -0.02em to -0.04em | Significant tightening |
| ALL CAPS | +0.05em to +0.12em | Always add space, any size |

### Converting Design Tool Values to CSS

**Figma/Sketch** use percentage or pixel values:
```
CSS letter-spacing = Figma value in px → em = px / font-size
```

**Adobe** uses thousandths of an em:
```
CSS letter-spacing = tracking / 1000 em
```
Example: Adobe tracking 75 at 16px = 0.075em = 1.2px

### Tailwind Default Tracking Scale

| Token | Value | Use Case |
|-------|-------|----------|
| tracking-tighter | -0.05em | Large display headings |
| tracking-tight | -0.025em | Headings |
| tracking-normal | 0em | Body text |
| tracking-wide | 0.025em | Small labels, captions |
| tracking-wider | 0.1em | ALL CAPS text |
| tracking-widest | 0.2em | Extreme letter-spaced design |

---

## 7. Font Pairing Principles

### Three Strategies

**1. Contrast** — Pair fonts that differ clearly in classification
- Serif heading + sans-serif body (most reliable)
- Geometric sans + humanist sans
- Slab serif + thin sans

**2. Harmony** — Pair fonts that share structural characteristics
- Match x-height, stroke width, or overall proportions
- Different styles from the same era or tradition
- Two sans-serifs with different voices but similar metrics

**3. Superfamily** — Use a designed family spanning classifications
- IBM Plex: Sans, Serif, Mono (shared skeleton)
- Roboto + Roboto Slab + Roboto Mono
- Source Sans + Source Serif + Source Code
- Noto Sans + Noto Serif + Noto Mono
- PT Sans + PT Serif + PT Mono

### What to Match

- **x-height:** Most important metric. Mismatched x-heights look unbalanced.
- **Stroke contrast:** Both high-contrast or both low-contrast.
- **Overall proportions:** Similar width tendencies.
- **Cap height:** For text set alongside each other.

### What to Contrast

- **Weight:** Light heading + bold body or vice versa
- **Classification:** Serif vs sans, geometric vs humanist
- **Mood:** Formal vs casual, mechanical vs organic

### Reliable Pairings for Product UI

| Heading | Body | Mono | Vibe |
|---------|------|------|------|
| Inter | Inter | JetBrains Mono | Neutral, flexible |
| Geist Sans | Geist Sans | Geist Mono | Modern, precise |
| IBM Plex Sans | IBM Plex Sans | IBM Plex Mono | Enterprise, reliable |
| Work Sans | Source Serif 4 | Source Code Pro | Editorial + functional |
| Space Grotesk | Inter | JetBrains Mono | Technical, contemporary |
| Fraunces | Inter | Fira Code | Retro-modern editorial |
| DM Sans | DM Serif Display | DM Mono | Cohesive family |

### Pairing Rules

1. Never pair more than 3 typefaces in a project
2. One font should clearly lead — the other supports
3. Test pairings at actual sizes, not just in specimen
4. Ensure both fonts have the weights you need
5. Superfamilies are the safest choice for design systems

---

## 8. Accessibility Requirements

### WCAG 2.2 Text Requirements

**SC 1.4.4 Resize Text (Level AA):**
- Text must be resizable up to 200% without assistive technology
- No loss of content or functionality at 200% zoom

**SC 1.4.12 Text Spacing (Level AA):**
Content must not break when users override these properties to at least:
- Line height: **>= 1.5x** the font size
- Paragraph spacing: **>= 2x** the font size
- Letter spacing: **>= 0.12x** the font size
- Word spacing: **>= 0.16x** the font size

Important: This does NOT mean you must set these values as defaults — it means your layout must not break when a user overrides to these values. Do not use fixed heights on text containers. Do not clip overflow.

**SC 1.4.3 Contrast (Minimum) (Level AA):**
- Normal text (<18pt or <14pt bold): 4.5:1 contrast ratio
- Large text (>=18pt or >=14pt bold): 3:1 contrast ratio

**SC 1.4.8 Visual Presentation (Level AAA):**
- Line length no more than 80 characters
- Text not fully justified
- Line spacing >= 1.5 within paragraphs
- Paragraph spacing >= 1.5x line spacing

### Practical Minimums for Type Scales

| Property | Minimum (AA) | Recommended |
|----------|-------------|-------------|
| Body font size | 16px (no WCAG req, but de facto) | 16-18px |
| Minimum font size | No WCAG minimum, but 12px practical floor | 12px |
| Line height (body) | 1.5 | 1.5-1.6 |
| Line height (heading) | 1.1-1.3 | 1.2-1.3 |
| Max line length | 80 characters | 60-75 characters |
| Touch target (text links) | 24x24px (WCAG 2.2 SC 2.5.8) | 44x44px |

### Language Exceptions

Not all spacing properties apply to all scripts:
- Letter spacing is not applicable to logographic scripts (Chinese, Japanese, Korean)
- Word spacing may not apply to scripts without word boundaries
- Line height applies to all scripts

---

## 9. Font Performance

### font-display Strategies

| Value | Behavior | Use When |
|-------|----------|----------|
| `swap` | Shows fallback immediately, swaps when ready | Body text, most UI |
| `fallback` | 100ms invisible, then fallback forever if late | Headings, key UI |
| `optional` | 100ms invisible, only uses if cached | Non-critical decorative |
| `block` | Up to 3s invisible, then fallback | Icons fonts (avoid generally) |
| `auto` | Browser default (usually block) | Never use explicitly |

**Best practice:** `font-display: swap` for body, `font-display: fallback` for headings.

### Format and Subsetting

**WOFF2 only** — 30% better compression than WOFF, supported by all modern browsers. No need for WOFF, TTF, or EOT fallbacks.

**Subsetting** — Strip unused glyphs:
```css
/* Only load Latin characters: */
@font-face {
  font-family: 'Inter';
  src: url('inter-latin.woff2') format('woff2');
  unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+2000-206F;
}
```

### Self-Hosting vs Google Fonts

**Self-host** (recommended):
- No third-party DNS lookup
- Full control over caching headers
- GDPR compliant (no data sent to Google)
- Can subset precisely for project needs
- Faster in practice (one fewer connection)

**Google Fonts** advantages:
- Automatic subsetting per request
- CDN delivery
- Easy for prototyping

### Performance Budget

| Metric | Target |
|--------|--------|
| Total font weight | < 100KB (all weights combined) |
| Font files | 2-4 files maximum |
| Weights loaded | 2-3 (Regular, Medium/SemiBold, Bold) |
| Variable font single file | < 150KB (replaces multiple files) |

### Preloading Critical Fonts

```html
<link rel="preload" href="/fonts/inter-var.woff2" as="font" type="font/woff2" crossorigin>
```

Only preload 1-2 fonts (the ones used above the fold). Over-preloading delays other critical resources.

---

## 10. Emerging Trends (2025-2026)

### New CSS Features for Typography

**text-wrap: balance** — Automatically balances line lengths in headings:
```css
h1, h2, h3 { text-wrap: balance; }
```
Limited to 6 lines (Chrome) or 10 lines (Firefox). 10-100x faster than JS alternatives.

**text-wrap: pretty** — Avoids orphans and improves paragraph wrapping:
```css
p { text-wrap: pretty; }
```
Supported in Chrome 117+, Edge 117+, Safari 26+. Not yet in Firefox (early 2026).

**text-box-trim / text-box-edge** — Trim whitespace above and below text:
```css
h1 {
  text-box-trim: both;
  text-box-edge: cap alphabetic;
}
```
Eliminates half-leading, enabling true edge-to-edge text alignment. Major improvement for vertical rhythm and card layouts.

**CSS pow() for type scales:**
```css
:root {
  --ratio: 1.25;
  --step-1: calc(1rem * pow(var(--ratio), 1));
  --step-2: calc(1rem * pow(var(--ratio), 2));
  --step-3: calc(1rem * pow(var(--ratio), 3));
}
```

**Shorthand text-box property:**
```css
h1 { text-box: trim-both cap alphabetic; }
```

### Design Trends

1. **Expressive serifs returning** — The "SaaS sans-serif" era is fading. High-contrast modern serifs are gaining traction for brand differentiation.

2. **Strategic imperfection** — Counter-movement to pixel-perfect design. Handcrafted, slightly irregular typography used intentionally.

3. **Variable fonts as standard** — Weight, width, and optical size adapting responsively. Single-file delivery replacing multiple static weights.

4. **Fluid everything** — Utopia-style fluid scales for type AND space, not just type. Entire design systems interpolated between viewport bounds.

5. **Generative/adaptive typography** — Fonts that adjust tracking, weight, or grade based on ambient conditions (dark mode, screen type, reading distance).

6. **AI-assisted font selection** — Tools that suggest pairings, detect contrast issues, and optimize scales for specific content types.

7. **Typography as hero** — Large, expressive type replacing hero images. Reduces page weight, improves performance, strengthens brand.

---

## Quick Reference: Generating a Type Scale

### Input Parameters

```
base_size:       16px (body text size)
ratio:           1.25 (major third)
steps_up:        6 (number of heading levels)
steps_down:      2 (number of smaller sizes)
line_height_body: 1.5
line_height_heading: 1.2
grid_unit:       4px
tracking_curve:  auto (size-dependent)
fluid:           true
min_viewport:    320px
max_viewport:    1280px
min_ratio:       1.2 (tighter scale on mobile)
max_ratio:       1.25 (default ratio on desktop)
```

### Output Tokens

For each step, generate:
- `font-size` (px, rem, and clamp if fluid)
- `line-height` (unitless ratio, snapped to grid unit)
- `letter-spacing` (em, size-dependent)
- `font-weight` recommendation
- `text-wrap` recommendation (balance for headings, pretty for body)

### Token Naming Conventions

| Convention | Example | Used By |
|-----------|---------|---------|
| Size number | `text-100`, `text-200` | Polaris |
| Semantic role | `display-lg`, `body-md` | Material, Carbon |
| T-shirt | `text-xs`, `text-2xl` | Tailwind |
| Pixel reference | `heading-24`, `copy-14` | Geist |
| Scale step | `f1`, `f2`, `f3` | Primer |
