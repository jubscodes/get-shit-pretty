# guidelines.html — Structure Spec

The `guidelines.html` is the visual conference of the entire brand pipeline — every phase of the branding diamond distilled into one self-rendering document:

- **Discover** → personas
- **Strategy** → positioning, voice
- **Identity** → color, typography, visual elements, logo
- **Patterns** → components, tokens

It uses the brand's own tokens, type, and primitives to render itself. One file, no build step, open in a browser. When someone opens this file, they should understand the brand completely — who it's for, what it stands for, and how it looks and speaks.

**Every element in this document must be derived from the brand pipeline outputs.** There are no defaults, no fallbacks, no generic treatments. If the brand is dark and editorial, the doc is dark and editorial. If the brand is warm and rounded, the doc is warm and rounded. The guidelines file is not a template being filled in — it is a brand artifact being built from the ground up using everything the pipeline produced.

## `:root` — shadcn-native token names

Use these exact CSS variable names so the file maps 1:1 with the shadcn token system. All values come from the brand's `.yml` tokens — use OKLCH values from palettes.json where available.

```css
:root {
  /* shadcn core */
  --background: ...;         /* page background */
  --foreground: ...;         /* primary text */
  --primary: ...;            /* brand primary color */
  --primary-foreground: ...; /* text on primary */
  --secondary: ...;          /* secondary surface */
  --secondary-foreground: ...;
  --muted: ...;              /* muted surface */
  --muted-foreground: ...;   /* secondary text */
  --accent: ...;             /* accent color (the memorable one) */
  --accent-foreground: ...;
  --destructive: ...;        /* error state */
  --border: ...;             /* border color */
  --ring: ...;               /* focus ring */
  --radius: ...;             /* base radius */

  /* Brand-specific extensions */
  --font-display: ...;       /* heading/editorial font */
  --font-body: ...;          /* body/UI font */
  --font-mono: ...;          /* data/code font */
  --ease: ...;               /* brand easing curve */
}
```

## Primitive classes

Define only the primitives the brand actually uses. Their implementation is derived from the brand's identity — intensity.variance, visual_direction, effects vocabulary. Don't define a class that doesn't serve this brand.

```css
/* examples — implement only what fits the brand */
.frosted-glass         /* glass surface — opacity/blur derived from brand intensity */
.frosted-glass-strong  /* heavier glass — for hero overlays */
.grain                 /* noise texture — only if brand uses texture */
.glow                  /* ambient radial glow — only if brand uses glow */
.atmosphere            /* full-bleed animated gradient — derived from brand palette */
```

## Layout primitives

```css
.container      /* max-width wrapper, responsive padding */
section         /* section spacing — density derived from brand intensity */
.section-label  /* eyebrow label */
.section-heading /* large section heading */
```

## Sections

The template defines a baseline section order. Follow it. If the brand warrants additional sections beyond this list — imagery style, motion principles, iconography, spatial system, co-branding rules, etc. — add them where they fit. Number sections sequentially. Each section gets an `id` for sidebar navigation.

### Navigation — always
Fixed left sidebar. Table of contents linking to every section. Brand-derived styling — font, color, spacing, all from the pipeline. Hidden on mobile.

**Section ID convention:** every section in the doc must have an `id` attribute that the nav links to:

```html
<!-- nav -->
<nav id="toc" style="position: fixed; left: 0; top: 0; height: 100vh; width: 180px; z-index: 50;
                     overflow-y: auto; display: flex; flex-direction: column;
                     justify-content: center; padding: 0 28px; gap: 8px;
                     border-right: 1px solid var(--border); background: var(--background);">
  <a href="#hero"         class="toc-link">Brand</a>
  <a href="#logo"         class="toc-link">Logo</a>
  <a href="#positioning"  class="toc-link">Positioning</a>
  <a href="#color"        class="toc-link">Color</a>
  <a href="#typography"   class="toc-link">Typography</a>
  <a href="#visuals"      class="toc-link">Visual Elements</a>
  <a href="#components"   class="toc-link">Components</a>
  <a href="#personas"     class="toc-link">Personas</a>
  <a href="#voice"        class="toc-link">Voice</a>
  <!-- add entries for any brand-specific sections -->
</nav>

<!-- main content offset -->
<main style="margin-left: 180px;">

  <section id="hero">...</section>
  <section id="logo">...</section>
  <!-- each section id matches its toc-link href -->

</main>
```

`.toc-link` styling: use the brand's body font, `--muted-foreground` at rest, `--foreground` on hover, no underline. Active state via a 10-line scroll listener that adds `.active` (accent color) to the link whose section is in view — include this JS inline at the bottom of `<body>`. Keep it small.

### Hero — always
Defined entirely by the brand. Visual direction, archetype, and identity outputs determine the background, typography scale, layout density, and supporting content. No default treatment.

**The headline must be the manifesto line from `positioning.md`.** If strategy phase is not complete, fall back to `brand_heartbeat` from `BRIEF.md`. Never generate a generic headline — this line was earned through the pipeline and must appear here.

The hero should feel like opening a brand book. Someone who sees it should understand the brand's energy before reading a single label.

### Logo
Logo marks (icon, wordmark, lockup) on the brand's background. Composition rules, clear space, forbidden uses. Skip if no logo was defined in identity.

### Positioning
Brand promise, point of view, manifesto line. Rendered as editorial content using the brand's type hierarchy and visual language.

### Color
Swatch grid: name, hex, OKLCH per color. Grouped by role. Contrast pairs. Layout derived from the brand.

### Typography
Show the full type scale rendered live in the actual fonts — not a table, not a screenshot. Each step is a real HTML element styled with the brand's CSS vars.

For each scale step show:
- The text rendered at its actual size
- Label: step name + font family + weight + size + line-height
- A sample sentence or phrase that fits the brand voice (not "The quick brown fox")

Render all steps in sequence from largest to smallest so the scale relationship is visible at a glance. Show each typeface family in its own block — display font, body font, mono font — with the scale steps that use it.

```html
<!-- example step -->
<div style="margin-bottom: 48px;">
  <div class="scale-step" style="font-family: var(--font-display); font-size: 4rem; line-height: 1.05; letter-spacing: -0.03em;">
    We ship what others pitch.
  </div>
  <div class="scale-meta">Display · Instrument Serif · 400 · 64px / 1.05</div>
</div>
```

Include pairing notes when the brand uses multiple typefaces: which font handles which role, and what the contrast between them communicates.

### Visual Elements
The brand's signature motifs: textures, dividers, shapes, glows, atmospheric effects, SVG elements. Each shown with its composition rule — when to use it, how much, what it must never do.

### Components
Live component previews in brand tokens: buttons, inputs, cards, badges. Include only if the brand has a meaningfully distinctive component style.

### Personas
Each persona as a branded card: name, role, frustration, aspiration. Styled in the brand's own visual language.

### Voice
Never / always rules as styled components. Monospace prefix (`x` never, `>` always).

### + Brand-specific sections
Add sections as needed to fully convey the brand. Examples: Imagery, Motion, Iconography, Spatial System, Co-branding. If the pipeline produced it and it shapes how the brand is applied, it belongs here.

## Mobile

Single `@media (max-width: 768px)` block. Hide sidebar nav. Stack grids. Reduce section padding. Scale type with `clamp()`.

## Quality bar

- Open in browser → immediately recognizable as this brand, not a generic template
- `:root` token names match shadcn — a dev can paste directly into `globals.css`
- Every visual decision traces back to a pipeline artifact
- No placeholder content — if a section has nothing real to show, it's omitted
