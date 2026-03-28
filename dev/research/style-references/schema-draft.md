# Schema Draft v2: patterns + constraints + effects (taste-aligned)

Extracted from `.md` companion prose into structured YAML blocks.
Aligned to taste-skill's intensity dials, named interaction vocabulary, and layout archetypes.

**Changes from v1:**
- Added `intensity` block (variance/motion/density dials from taste-skill)
- Effects use named techniques instead of inline CSS descriptions
- Layout gains `archetype` (named pattern) and `surfaces` (texture/decoration strategy)
- Patterns use technique names where possible, CSS only when no standard name exists

---

## 1. neubrutalism

```yaml
intensity:
  variance: 8     # asymmetric layouts, sticker rotations, deliberate chaos
  motion: 5       # snappy mechanical interactions, not cinematic
  density: 6      # visually dense — textures, borders, layered elements

patterns:
  card:
    border: "{shape.border-width} solid {shape.border-color}"
    shadow: "{elevation.shadow-md} to {elevation.shadow-lg}"
    radius: "rounded-none"
    background: "{color.background}"
    header: "colored background with border-b-4 separator"
  button-primary:
    background: "{color.accent}"
    border: "{shape.border-width} solid {shape.border-color}"
    shadow: "{elevation.shadow-sm}"
    text: "uppercase, weight {typography.font-weight-heading}, tracking-wide"
    radius: "rounded-none"
  button-secondary:
    background: "{color.secondary}"
    border: "{shape.border-width} solid {shape.border-color}"
    shadow: "{elevation.shadow-sm}"
    text: "uppercase, weight {typography.font-weight-heading}, tracking-wide"
    radius: "rounded-none"
  input:
    border: "{shape.border-width} solid {shape.border-color}"
    radius: "rounded-none"
    background: "{color.background}"
    focus: "background fills {color.secondary}, shadow appears, no ring"
    height: "h-14 to h-20"
  badge:
    shape: "rounded-full OR rounded-none with {shape.border-width} border"
    text: "font-black text-sm uppercase tracking-widest"
    decoration: "rotate-1 to rotate-3, absolute positioned"
  nav:
    logo: "bordered box with accent background, uppercase"
    links: "bold uppercase, hover adds border + background + shadow"
    mobile: "hamburger as bordered square with shadow"
  layout:
    archetype: "sticker-collage"
    max-width: "max-w-7xl"
    section-spacing: "py-16 to py-32"
    grid-gap: "gap-8 to gap-12"
    asymmetry: "60/40 splits, offset columns, staggered grids"
    surfaces: "halftone dots, grid lines, or noise overlay — never flat"
    decoration: "rotated sticker elements, overlapping shapes, large background text"

constraints:
  never:
    - "backdrop-filter or blur — conflicts with flat, structural aesthetic"
    - "gradient backgrounds — solid color blocks only"
    - "box-shadow with blur > 0 — all shadows must be hard-offset"
    - "border-radius between 1px and 9998px — binary: rounded-none or rounded-full"
    - "subtle grays (#333, #666, #999) — pure black or a saturated color"
    - "ease-in-out easing — mechanical feel requires linear or ease-out"
    - "large empty whitespace — fill with texture, patterns, or decorative elements"
    - "opacity/transparency on surfaces — except texture overlays at low opacity"
  always:
    - "hard-offset shadows (x y 0px 0px) on every elevated element"
    - "visible border-4 border-black on every interactive surface"
    - "uppercase on headings, labels, and buttons"
    - "high contrast — WCAG AA minimum, no subtle gray text"
    - "slight rotation (rotate-1 to rotate-3) on at least some containers"
    - "texture overlay (halftone, grid, or noise) on section backgrounds"

effects:
  interaction-vocabulary: [press-down, lift-shadow, snap-rotate, snap-fill]
  hover:
    card: "lift-shadow"
    button: "snap-fill — background darken, fast snap"
    link: "snap-fill — border + background + shadow appear instantly"
    badge: "snap-rotate — rotates further on hover"
  active:
    button: "press-down — translate covers shadow, mechanical click"
  focus:
    input: "snap-fill — background becomes {color.secondary}"
    general: "ring-2 ring-black ring-offset-2"
  transition: "duration-100 to duration-200, ease-linear or ease-out"
  ambient:
    - "slow-spin on decorative stars (10s linear infinite)"
    - "pulse on CTA elements"
    - "bounce on attention badges"
```

---

## 2. professional

```yaml
intensity:
  variance: 2     # symmetric, predictable, grid-aligned
  motion: 3       # subtle hover states only, no spectacle
  density: 5      # balanced — not airy, not packed

patterns:
  card:
    border: "{shape.border-width} solid {shape.border-color}"
    shadow: "{elevation.shadow-sm} resting, {elevation.shadow-md} on hover"
    radius: "{shape.border-radius-md}"
    background: "{color.surface}"
  button-primary:
    background: "{color.primary}"
    border: "none"
    shadow: "{elevation.shadow-sm}"
    text: "weight 500, sentence case"
    radius: "{shape.border-radius-sm}"
  button-secondary:
    background: "transparent"
    border: "{shape.border-width} solid {shape.border-color}"
    text: "weight 500, sentence case"
    radius: "{shape.border-radius-sm}"
  input:
    border: "{shape.border-width} solid {shape.border-color}"
    radius: "{shape.border-radius-sm}"
    background: "{color.background}"
    focus: "ring-2 ring-{color.primary}/50 with ring-offset-1"
  badge:
    shape: "rounded-full, text-xs"
    text: "font-medium, sentence case"
  nav:
    style: "clean horizontal with subtle border-bottom"
    links: "font-medium, hover shifts to {color.primary}"
  layout:
    archetype: "symmetric-grid"
    max-width: "max-w-7xl"
    section-spacing: "py-16 to py-24"
    grid-gap: "gap-6 to gap-8"
    surfaces: "clean — no texture, no grain, no patterns"

constraints:
  never:
    - "decorative rotations or skew — precision over personality"
    - "saturated background sections — white/surface/subtle tints only"
    - "text stroke effects — clean, readable type only"
    - "noise or halftone textures — clean surfaces"
    - "uppercase body text — sentence case throughout"
    - "shadows with colored tints — neutral black/gray shadows only"
    - "hard-offset shadows — all shadows soft and diffused"
  always:
    - "consistent border-radius across all components at the same elevation"
    - "subtle hover transitions (150-250ms)"
    - "muted color palette — no neon, no high-saturation accents"
    - "clean visual hierarchy through spacing and weight, not decoration"

effects:
  interaction-vocabulary: [gentle-lift, subtle-darken, scale-press]
  hover:
    card: "gentle-lift — shadow deepens sm→md, subtle border darken"
    button: "subtle-darken — background darkens 10%"
    link: "color shift to {color.primary}"
  active:
    button: "scale-press — scale-[0.98]"
  focus:
    general: "ring-2 ring-{color.primary}/50 ring-offset-1"
  transition: "duration-150 to duration-250, cubic-bezier(0.4, 0, 0.2, 1)"
```

---

## 3. organic

```yaml
intensity:
  variance: 7     # asymmetric blob shapes, varied radii, staggered grids
  motion: 5       # gentle eased motion, no abruptness
  density: 3      # airy — generous whitespace, breathing room

patterns:
  card:
    border: "{shape.border-width} solid {shape.border-color}"
    shadow: "{elevation.shadow-sm} — color-tinted, never pure black"
    radius: "rounded-[2rem] base, asymmetric on features (rounded-tl-[4rem])"
    background: "#FEFEFA over page background"
    texture: "noise overlay at 3% opacity, multiply blend"
  button-primary:
    background: "{color.primary}"
    border: "none"
    shadow: "color-tinted soft shadow (moss)"
    text: "bold weight, sentence case"
    shape: "rounded-full — pill always"
  button-secondary:
    background: "transparent"
    border: "2px solid {color.secondary}"
    text: "{color.secondary}, sentence case"
    shape: "rounded-full"
  input:
    border: "{shape.border-width} solid {shape.border-color}"
    shape: "rounded-full"
    background: "bg-white/50 — semi-transparent, shows grain beneath"
    focus: "ring-2 ring-{color.primary}/30 ring-offset-2"
  badge:
    shape: "rounded-full"
    text: "text-xs, muted earth tones"
  nav:
    style: "sticky floating pill"
    background: "bg-white/70 with backdrop-blur-md"
    shape: "rounded-full"
  layout:
    archetype: "staggered-organic"
    max-width: "varies — max-w-7xl hero, max-w-5xl intimate, max-w-4xl text"
    section-spacing: "py-32"
    grid-gap: "gap-8 to gap-12"
    surfaces: "grain overlay (3-4% opacity, multiply blend) — always present"
    backgrounds: "alternating earth tones — off-white, stone, sand, moss, terracotta"
    decoration: "large blurred blobs (blur-3xl), curved SVG connectors, rotated images"

constraints:
  never:
    - "sharp 90-degree corners — everything must feel eroded or hand-shaped"
    - "hard-offset shadows — all shadows soft, diffused, color-tinted"
    - "pure black (#000000) in shadows or borders — use tinted alternatives"
    - "straight geometric decorations — curves and blobs only"
    - "mechanical or abrupt motion — everything gentle and eased"
    - "uppercase text — soft, natural case throughout"
    - "high-contrast neon or saturated colors — earth-drawn palette only"
    - "flat backgrounds without grain — texture is essential"
  always:
    - "organic border radii (large, varied, sometimes asymmetric)"
    - "grain/noise texture overlay (3-4% opacity, multiply blend)"
    - "color-tinted shadows using palette colors (moss green, clay orange)"
    - "generous whitespace — space is a design element"
    - "blob shapes for decorative backgrounds (complex % border-radius)"

effects:
  interaction-vocabulary: [gentle-lift, soft-scale, tilt-pick, slow-reveal]
  hover:
    card: "gentle-lift — -translate-y-1, shadow deepens"
    button: "soft-scale — scale-105, shadow increases"
    testimonial: "tilt-pick — rotate-1, like picking up a card"
    image: "slow-reveal — scale-105 over 700ms"
  active:
    button: "soft-scale — scale-95, tactile press"
  focus:
    general: "ring-2 ring-{color.primary}/30 ring-offset-2 — soft glow"
  transition: "duration-300 to duration-500, ease-out"
  ambient:
    - "blob-drift — background color washes with blur-3xl, slow movement"
    - "parallax-float — subtle depth shift on decorative elements"
```

---

## 4. glassmorphism

```yaml
intensity:
  variance: 5     # moderate asymmetry, layered depth creates visual interest
  motion: 6       # fluid transitions, ambient blob drift, glow pulses
  density: 4      # balanced — glass needs breathing room to read

patterns:
  card:
    background: "rgba(255,255,255,0.12)"
    blur: "backdrop-blur-[12px] backdrop-saturate-[180%]"
    border: "1px solid rgba(255,255,255,0.20)"
    shadow: "{elevation.shadow-md} with inset highlight"
    radius: "{shape.border-radius-md}"
    highlight: "inset 0 1px 0 rgba(255,255,255,0.40) — top-edge refraction"
  button-primary:
    background: "{color.primary}"
    border: "none"
    shadow: "glow — 0 0 20px {color.primary}/40, 0 0 60px {color.primary}/15"
    text: "weight 600, sentence case"
    radius: "{shape.border-radius-sm}"
  button-secondary:
    background: "rgba(255,255,255,0.08)"
    blur: "backdrop-blur-[8px]"
    border: "1px solid rgba(255,255,255,0.20)"
    text: "weight 500"
    radius: "{shape.border-radius-sm}"
  input:
    background: "rgba(255,255,255,0.08)"
    blur: "backdrop-blur-[8px]"
    border: "1px solid rgba(255,255,255,0.15)"
    radius: "{shape.border-radius-sm}"
    focus: "border-white/40, glow ring"
  badge:
    background: "glass or primary-tinted glass"
    shape: "rounded-full"
    text: "text-xs font-medium"
  nav:
    background: "glass panel at 0.15 alpha"
    blur: "backdrop-blur-[16px]"
    border: "1px solid rgba(255,255,255,0.15)"
    position: "sticky frosted"
  layout:
    archetype: "layered-glass"
    max-width: "max-w-7xl"
    section-spacing: "py-20 to py-32"
    grid-gap: "gap-6 to gap-8"
    surfaces: "dark canvas required — glass does not read on light"
    decoration: "gradient orbs, ambient blobs behind glass panels"
    depth: "surface alpha scale: 0.04→0.08→0.12→0.15→0.18→0.22 by z-level"

constraints:
  never:
    - "hard-offset shadows — all shadows diffused and ambient"
    - "opaque card backgrounds — surfaces must be translucent"
    - "light page background — glass requires dark canvas to read"
    - "thick borders (>1px) — hairline only for glass edge definition"
    - "flat shadowless elements — everything needs depth cues"
    - "surface alpha above 0.22 — becomes opaque, kills glass"
    - "surface alpha below 0.04 — disappears into background"
    - "backdrop-blur on scrolling containers — fixed/sticky elements only"
  always:
    - "backdrop-filter: blur + saturate on every glass surface"
    - "hairline border (1px rgba(255,255,255,0.15-0.30)) on glass panels"
    - "inset highlight on primary glass surfaces (top-edge refraction)"
    - "-webkit-backdrop-filter prefix for Safari"
    - "dark background canvas — deep slate or darker"
    - "surface alpha hierarchy matching z-depth"

effects:
  interaction-vocabulary: [glow-intensify, alpha-step, soft-scale, spotlight-border]
  hover:
    card: "alpha-step — border opacity 0.20→0.30, surface brightens"
    button-primary: "glow-intensify — glow radius and opacity increase"
    glass-surface: "alpha-step — surface opacity increases one level"
  active:
    button: "soft-scale — scale-[0.97], glow dims"
  focus:
    general: "glow ring — ring-2 ring-{color.primary}/50 with ambient glow"
  transition: "duration-200 to duration-300, cubic-bezier(0.4, 0, 0.2, 1)"
  ambient:
    - "orb-drift — gradient blobs drift slowly behind glass panels"
    - "color-shift — background blob hues rotate subtly"
    - "glow-pulse — primary elements pulse glow at rest"
```

---

## 5. bold-typography

```yaml
intensity:
  variance: 6     # asymmetric type layouts, deliberate negative space
  motion: 3       # minimal — underline animations, color inversions
  density: 2      # gallery airy — type needs space to breathe

patterns:
  card:
    border: "{shape.border-width} solid {shape.border-color}"
    shadow: "none — depth from typographic layering only"
    radius: "0px"
    background: "{color.surface}"
  button-primary:
    style: "text-only with animated underline — no background fill"
    text: "{color.primary}, uppercase, tracking-wider (0.1em), weight 600"
    underline: "absolute h-0.5 bg-{color.primary}, scale-x-100 resting"
  button-secondary:
    background: "transparent → fills on hover"
    border: "1px solid {color.on-background}"
    text: "{color.on-background}, uppercase, tracking-wider"
    radius: "0px"
  input:
    border: "1px solid {shape.border-color}"
    radius: "0px"
    background: "{color.surface}"
    focus: "border-{color.primary} — border-only focus, no glow"
  badge:
    shape: "sharp corners, thin border"
    text: "uppercase, tracking-widest, text-xs"
  nav:
    style: "minimal — logo + sparse links"
    links: "uppercase tracking-wider, underline reveals on hover"
  layout:
    archetype: "editorial-whitespace"
    max-width: "max-w-6xl"
    section-spacing: "py-24 to py-40 — extreme negative space"
    grid-gap: "gap-8 to gap-16"
    surfaces: "noise grain at 1.5% opacity — subtle tactile depth"
    typography-hero: "text-7xl to text-9xl desktop, tracking-tighter (-0.06em)"
    decoration: "oversized muted numbers/text behind content at low opacity"
    dividers: "full-width horizontal rules as section breaks"

constraints:
  never:
    - "box-shadow of any kind — no shadows in this aesthetic"
    - "border-radius above 0px — everything sharp-edged"
    - "background fills on primary buttons — underline-only interaction"
    - "small headlines — minimum text-5xl mobile, text-7xl desktop"
    - "decorative imagery competing with type — type IS the visual"
    - "more than one accent color — black, white, and one (vermillion)"
    - "rounded or pill shapes — angular geometry only"
    - "ease-in-out or bouncy easing — precise, deliberate motion only"
  always:
    - "extreme scale contrast between headline and body (6:1+ ratio)"
    - "tight letter-spacing on display text (-0.04em to -0.06em)"
    - "wide letter-spacing on labels/overlines (0.1em to 0.2em)"
    - "generous negative space framing headlines"
    - "noise grain texture (1-2% opacity)"
    - "sharp 0px radius on all elements"
    - "full-width horizontal rules between sections"

effects:
  interaction-vocabulary: [underline-reveal, color-invert, border-brighten, micro-press]
  hover:
    button-primary: "underline-reveal — scale-x expands to 110%"
    button-secondary: "color-invert — bg fills foreground, text inverts"
    link: "underline-reveal — scale-x-0 → scale-x-100 slide-in"
    card: "border-brighten — border subtly lightens"
  active:
    button: "micro-press — translate-y-px"
  focus:
    general: "border-{color.primary} — border-based, no ring, no glow"
  transition: "duration-150 to duration-200, cubic-bezier(0.25, 0, 0, 1)"
```

---

## Schema summary

### New blocks per preset (3 + intensity = 4)

| Block | Purpose | Taste alignment |
|-------|---------|-----------------|
| `intensity` | Variance/motion/density dials (1-10) | Direct from taste-skill §1, §6 |
| `patterns` | Per-component composition rules (7 types) | Taste §4 (component mastery), §5 (component specs) |
| `constraints` | Never/always hard boundaries | Taste §2 (Absolute Zero), §7 (AI Tells), §9 (anti-patterns) |
| `effects` | Named interaction vocabulary + state rules | Taste §5 (motion choreography), §8 (creative arsenal) |

### Component list (7 types)
`card`, `button-primary`, `button-secondary`, `input`, `badge`, `nav`, `layout`

### Key design decisions

**Named interaction vocabulary.** Effects declare technique names (`press-down`, `lift-shadow`, `glow-intensify`) that agents know from training, not CSS strings. The `interaction-vocabulary` list is the style's allowed interaction palette — agents pick from this list, never invent outside it.

**Intensity dials drive agent creativity.** A designer agent seeing `variance: 8` knows to break grids, use asymmetry, and push layouts. `variance: 2` means stay centered, stay predictable. Same agent, different calibration.

**Layout archetype replaces generic max-width.** Instead of just plumbing (`max-w-7xl`), the `archetype` names the layout DNA: `sticker-collage`, `symmetric-grid`, `staggered-organic`, `layered-glass`, `editorial-whitespace`. Agents can pattern-match on these names.

**Surfaces replaces texture/decoration split.** One field describing the surface treatment strategy — "never flat" for neubrutalism, "clean" for professional, "grain always" for organic.

### What stays OUT of presets (universal, belongs in agents)
- Performance guardrails (GPU-safe animation, will-change, etc.)
- Responsive collapse rules (single-column <768px)
- Accessibility (WCAG, focus indicators, touch targets)
- Content quality (no lorem ipsum, no AI clichés, no generic names)
- Loading/empty/error states
- Semantic HTML requirements
