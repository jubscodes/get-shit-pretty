---
name: style
description: Apply a design style — get tokens and foundations without the branding diamond
disable-model-invocation: true
allowed-tools:
  - Read
  - Write
  - Bash
  - AskUserQuestion
  - Glob
  - Grep
---
<context>
You are a GSP style applicator. You produce W3C Design Tokens (`tokens.json`) and foundation chunks from style presets — bypassing the full branding diamond (discover → strategy → identity → system). Downstream agents (designer, builder) consume `tokens.json` regardless of how it was produced.

This is a standalone composable skill. It works two ways:
1. **Standalone** — user runs `/gsp:style cyberpunk` directly, gets visual preview + tokens
2. **As a building block** — agents invoke this skill during workflows, getting tokens only
</context>

<objective>
Apply a named style preset to produce production-ready design tokens and foundation chunks.

**Input:** Style name(s), optional flags (`--list`, `--preview`)
**Output:** `tokens.json` + 5 foundation chunks + `INDEX.md` in the target system directory
**Agent:** None — token expansion from YAML presets is handled inline
</objective>

<execution_context>
@${CLAUDE_SKILL_DIR}/styles/INDEX.yml
@${CLAUDE_SKILL_DIR}/../../references/design-tokens.md
@${CLAUDE_SKILL_DIR}/../../references/chunk-format.md
@${CLAUDE_SKILL_DIR}/../../templates/phases/system.md
</execution_context>

<rules>
- Always use `AskUserQuestion` for user interaction — never prompt via plain text
- Presets are the source of truth — expand tokens deterministically, don't improvise values
- Foundation chunks follow `references/chunk-format.md` format exactly
- `tokens.json` follows W3C Design Tokens format from `references/design-tokens.md`
- When mixing styles, later style values override earlier ones (last-wins precedence)
- Never mix clashing styles — check the compatibility matrix first
</rules>

<process>
## Step 0: Parse invocation

Read the user's input to determine the mode:

| Input | Mode |
|-------|------|
| `/gsp:style --list` | List all available presets |
| `/gsp:style --preview cyberpunk` | Show tokens without writing files |
| `/gsp:style cyberpunk` | Apply single style |
| `/gsp:style cyberpunk + neubrutalism` | Mix styles (check compatibility) |
| `/gsp:style` (no args) | Interactive — browse and pick |

## Step 1: List mode (`--list`)

If `--list`, read `styles/INDEX.yml` and display all presets:

Read `styles/INDEX.yml` and render every style grouped by category. Format:

```
  /gsp:style
  ═══════════════════════════════════════

  34 styles available

  ─── Minimal ────────────────────────
    swiss-minimalist     Helvetica and whitespace — let the content breathe
    flat-design          Solid colors, zero shadows — bold color blocks as structure
    monochrome           Pure black and white — typographic depth, zero decoration
    minimal-dark         Three layers of darkness with warm amber accents

  ─── Modern ─────────────────────────
    professional         The sensible default — clean, trustworthy, gets out of the way
    saas                 Electric blue gradient — modern SaaS landing page energy
    enterprise           Indigo-to-violet gradient — dashboard-ready corporate
    fluent               Microsoft Fluent 2 — acrylic materials, semantic tokens
    material             Material Design 3 — adaptive, organic, expressive
    modern-dark          Linear/Vercel aesthetic — ambient blobs, mouse spotlights
    glassmorphism        Frosted glass panels floating over rich backgrounds
    liquid-glass         Apple's 2025 design language — refractive, fluid, alive

  ─── Creative ───────────────────────
    neubrutalism         Gumroad meets Figma — thick borders, hard shadows
    cyberpunk            Neon-soaked interfaces from a dystopian future
    maximalism           MORE IS MORE — sensory overload, 5 rotating accent colors
    bold-typography      Typography IS the design — massive headlines, poster aesthetic
    playful-geometric    Memphis-inspired candy buttons and confetti cards
    sketch               Wobbly borders and marker red on warm paper
    kinetic              Viewport-width type, marquees, extreme scale hierarchy

  ─── Elegant ────────────────────────
    luxury               Gold accent, slow reveals, asymmetric restraint
    art-deco             1920s theatrical glamour — gold on obsidian black
    academia             Victorian study halls — mahogany, brass, and serif type
    humanist-literary    Warm paper canvas, terracotta accent — quiet intelligence

  ─── Organic ────────────────────────
    botanical            Deep greens, paper grain, nature-inspired serif elegance
    organic              Moss and terracotta — blob shapes, no straight lines

  ─── Editorial ──────────────────────
    newsprint            Multi-column layouts, drop caps, high information density

  ─── Nostalgic ──────────────────────
    retro                Windows 95 bevels, marquee text — the ugliness IS the beauty
    vaporwave            80s/90s digital nostalgia with neon gradients and CRT scanlines

  ─── Tactile ────────────────────────
    claymorphism         Vinyl toy aesthetic — 4-layer shadows, super-rounded, squish
    neumorphism          Dual opposing shadows — extruded and inset on continuous surface
    industrial           Precision machinery — carbon fiber, dual-shadow, safety orange

  ─── Tech ───────────────────────────
    terminal             Your favorite code editor as a design system
    web3                 Bitcoin orange luminescence on void black

  ─── Geometric ──────────────────────
    bauhaus              Form follows function — Bauhaus primary colors, hard shadows

  ─────────────────────────────────────
  Usage: /gsp:style {name}
         /gsp:style --preview {name}
```

Stop here. Do not write any files.

## Step 2: Interactive mode (no args)

If no style name provided, show the list (Step 1) then use `AskUserQuestion` with options grouped by category. Present 6-8 curated options spanning different categories, plus a "Show all" option:
- **neubrutalism** — "thick borders, hard shadows, unapologetically flat"
- **modern-dark** — "Linear/Vercel aesthetic — ambient blobs, mouse spotlights"
- **professional** — "clean, trustworthy, gets out of the way"
- **cyberpunk** — "neon-soaked interfaces from a dystopian future"
- **botanical** — "deep greens, paper grain, nature-inspired"
- **claymorphism** — "vinyl toy aesthetic — 4-layer shadows, squish"
- **liquid-glass** — "Apple's 2025 — refractive, fluid, alive"
- **Show all 34** — "browse the full catalog"

Continue with the selected style.

## Step 3: Load preset(s)

Read the YAML preset file(s) from `styles/{name}.yml`.

If the style name doesn't match any preset, suggest the closest match based on tags in `INDEX.yml`. If still no match, tell the user and show the list.

### Mixing styles

If multiple styles are specified (e.g., `cyberpunk + bento-grid`):

1. Check `INDEX.yml` clash_pairs — if the combination appears, warn the user and stop:
   "These styles clash — {reason}. Pick one or try a compatible combination."

2. If compatible, merge token objects with last-wins precedence. The second style's values override the first where they overlap.

## Step 4: Resolve output path

Determine where to write the system output:

### Within a brand
If a brand context exists (`.design/branding/{brand}/`):
- Write to `{BRAND_PATH}/system/`
- This replaces the system phase of the branding diamond

### Within a project (quick mode)
If invoked from a project context (`.design/projects/{project}/`):
- Check if a `brand.ref` exists pointing to a brand with a completed system
- If no brand system exists, write to `.design/branding/_style-{preset-name}/system/`
- Create a minimal brand directory with just the system output
- Update the project's `brand.ref` to point to this auto-generated brand

### Standalone (no .design/ context)
- Write to `.design/branding/_style-{preset-name}/system/`
- Create minimal brand directory structure

## Step 5: Preview mode (`--preview`)

If `--preview`, display the expanded tokens without writing files:

```
  /gsp:style preview — {name}
  ═══════════════════════════════════════

  Color
    primary       {value}
    secondary     {value}
    accent        {value}
    background    {value}
    surface       {value}

  Typography
    heading       {font-family} @ {weight}
    body          {font-family} @ {weight}
    base size     {size}

  Shape
    radius        {sm} / {md} / {lg}
    border        {width} {color}

  Elevation
    sm            {value}
    md            {value}
    lg            {value}

  Motion
    fast          {duration}
    normal        {duration}
    easing        {value}

  ─────────────────────────────────────
  Run /gsp:style {name} to apply.
```

Stop here. Do not write any files.

## Step 6: Expand tokens to W3C format

Transform the YAML preset tokens into the full W3C Design Tokens JSON structure.

### Color tokens
Map preset colors to the W3C structure with `$value` and `$type` fields:

```json
{
  "color": {
    "brand": {
      "primary": { "$value": "{preset.color.primary}", "$type": "color" },
      "secondary": { "$value": "{preset.color.secondary}", "$type": "color" },
      "accent": { "$value": "{preset.color.accent}", "$type": "color" }
    },
    "semantic": {
      "background": { "$value": "{preset.color.background}", "$type": "color" },
      "surface": { "$value": "{preset.color.surface}", "$type": "color" },
      "on-primary": { "$value": "{preset.color.on-primary}", "$type": "color" },
      "on-background": { "$value": "{preset.color.on-background}", "$type": "color" },
      "error": { "$value": "{preset.color.error}", "$type": "color" },
      "success": { "$value": "{preset.color.success}", "$type": "color" },
      "warning": { "$value": "{preset.color.warning}", "$type": "color" },
      "info": { "$value": "{preset.color.info}", "$type": "color" }
    }
  }
}
```

### Typography tokens
```json
{
  "font": {
    "family": {
      "primary": { "$value": "{preset.typography.font-family-primary}", "$type": "fontFamily" },
      "mono": { "$value": "{preset.typography.font-family-mono}", "$type": "fontFamily" }
    }
  },
  "typography": {
    "display": {
      "$value": {
        "fontFamily": "{font.family.primary}",
        "fontSize": "48px",
        "fontWeight": "{preset.typography.font-weight-heading}",
        "lineHeight": 1.1,
        "letterSpacing": "-0.02em"
      },
      "$type": "typography"
    },
    "heading-1": {
      "$value": {
        "fontFamily": "{font.family.primary}",
        "fontSize": "36px",
        "fontWeight": "{preset.typography.font-weight-heading}",
        "lineHeight": 1.2,
        "letterSpacing": "-0.01em"
      },
      "$type": "typography"
    },
    "heading-2": {
      "$value": {
        "fontFamily": "{font.family.primary}",
        "fontSize": "28px",
        "fontWeight": "{preset.typography.font-weight-heading}",
        "lineHeight": 1.3,
        "letterSpacing": "0"
      },
      "$type": "typography"
    },
    "heading-3": {
      "$value": {
        "fontFamily": "{font.family.primary}",
        "fontSize": "22px",
        "fontWeight": "{preset.typography.font-weight-heading}",
        "lineHeight": 1.4,
        "letterSpacing": "0"
      },
      "$type": "typography"
    },
    "body-large": {
      "$value": {
        "fontFamily": "{font.family.primary}",
        "fontSize": "18px",
        "fontWeight": "{preset.typography.font-weight-body}",
        "lineHeight": "{preset.typography.line-height-base}",
        "letterSpacing": "0"
      },
      "$type": "typography"
    },
    "body": {
      "$value": {
        "fontFamily": "{font.family.primary}",
        "fontSize": "{preset.typography.font-size-base}",
        "fontWeight": "{preset.typography.font-weight-body}",
        "lineHeight": "{preset.typography.line-height-base}",
        "letterSpacing": "0"
      },
      "$type": "typography"
    },
    "body-small": {
      "$value": {
        "fontFamily": "{font.family.primary}",
        "fontSize": "14px",
        "fontWeight": "{preset.typography.font-weight-body}",
        "lineHeight": "{preset.typography.line-height-base}",
        "letterSpacing": "0"
      },
      "$type": "typography"
    },
    "caption": {
      "$value": {
        "fontFamily": "{font.family.primary}",
        "fontSize": "12px",
        "fontWeight": "{preset.typography.font-weight-body}",
        "lineHeight": 1.4,
        "letterSpacing": "0.01em"
      },
      "$type": "typography"
    },
    "overline": {
      "$value": {
        "fontFamily": "{font.family.primary}",
        "fontSize": "11px",
        "fontWeight": 600,
        "lineHeight": 1.5,
        "letterSpacing": "0.08em"
      },
      "$type": "typography"
    }
  }
}
```

### Spacing tokens
Generate from the preset's spacing scale:

```json
{
  "spacing": {
    "xs": { "$value": "4px", "$type": "dimension" },
    "sm": { "$value": "8px", "$type": "dimension" },
    "md": { "$value": "16px", "$type": "dimension" },
    "lg": { "$value": "24px", "$type": "dimension" },
    "xl": { "$value": "32px", "$type": "dimension" },
    "2xl": { "$value": "48px", "$type": "dimension" },
    "3xl": { "$value": "64px", "$type": "dimension" },
    "4xl": { "$value": "96px", "$type": "dimension" }
  }
}
```

### Shadow tokens
Map preset elevation values to W3C shadow format. Parse the CSS shadow shorthand from the preset into the structured format:

```json
{
  "shadow": {
    "sm": { "$value": "{parsed from preset.elevation.shadow-sm}", "$type": "shadow" },
    "md": { "$value": "{parsed from preset.elevation.shadow-md}", "$type": "shadow" },
    "lg": { "$value": "{parsed from preset.elevation.shadow-lg}", "$type": "shadow" },
    "xl": { "$value": "{parsed from preset.elevation.shadow-xl}", "$type": "shadow" }
  }
}
```

### Border radius tokens
```json
{
  "radius": {
    "none": { "$value": "0px", "$type": "dimension" },
    "sm": { "$value": "{preset.shape.border-radius-sm}", "$type": "dimension" },
    "md": { "$value": "{preset.shape.border-radius-md}", "$type": "dimension" },
    "lg": { "$value": "{preset.shape.border-radius-lg}", "$type": "dimension" },
    "full": { "$value": "9999px", "$type": "dimension" }
  }
}
```

### Style-specific token groups
If the preset has extra token groups (e.g., `glass` for glassmorphism, `glow` for cyberpunk, `gradient` for vaporwave, `syntax` for terminal), include them under an `$extensions` key:

```json
{
  "$extensions": {
    "gsp-style": "{preset-name}",
    "gsp-style-specific": {
      // style-specific tokens preserved as-is from the preset
    }
  }
}
```

### Dark mode
If the preset has a `dark_mode` section, include it under `$extensions.dark`:

```json
{
  "$extensions": {
    "dark": {
      "color": {
        "semantic": {
          "background": { "$value": "{preset.dark_mode.color.background}" },
          "surface": { "$value": "{preset.dark_mode.color.surface}" }
        }
      }
    }
  }
}
```

### Motion tokens
```json
{
  "motion": {
    "duration": {
      "fast": { "$value": "{preset.motion.duration-fast}", "$type": "duration" },
      "normal": { "$value": "{preset.motion.duration-normal}", "$type": "duration" }
    },
    "easing": {
      "default": { "$value": "{preset.motion.easing}", "$type": "cubicBezier" }
    }
  }
}
```

## Step 7: Write tokens.json

Write the complete W3C Design Tokens JSON to `{OUTPUT_PATH}/tokens.json`.

## Step 8: Write foundation chunks

Write 5 foundation chunks to `{OUTPUT_PATH}/foundations/`, each following `references/chunk-format.md`:

### foundations/color-system.md
- Document the full color palette from the preset
- Include brand colors (primary, secondary, accent)
- Include semantic colors (background, surface, on-primary, on-background, error, success, warning, info)
- Include dark mode mapping if present
- Note WCAG contrast considerations based on the color values

### foundations/typography.md
- Document the 9-level type scale (Display → Overline) with all properties
- Include font family details and where to load them (Google Fonts link if applicable)
- Include heading and body weight rationale

### foundations/spacing.md
- Document the spacing scale from the preset
- Include base unit and full scale with usage guidelines

### foundations/elevation.md
- Document the shadow/elevation scale from the preset
- Include use cases for each level (flat, cards, dropdowns, modals, popovers)
- Include any style-specific elevation notes (e.g., hard shadows for neubrutalism, glow for cyberpunk)

### foundations/border-radius.md
- Document the radius token scale
- Include style-specific shape notes (e.g., sharp corners for swiss-minimalist, chunky for neubrutalism)

## Step 9: Write INDEX.md

Write `{OUTPUT_PATH}/INDEX.md`:

```markdown
# System
> Phase: system | Style: {preset-name} | Generated: {DATE}

## Applied Style

**{preset-name}** — {preset description}

## Foundations

| Chunk | File | ~Lines |
|-------|------|--------|
| Color System | [color-system.md](./foundations/color-system.md) | ~{N} |
| Typography | [typography.md](./foundations/typography.md) | ~{N} |
| Spacing | [spacing.md](./foundations/spacing.md) | ~{N} |
| Elevation | [elevation.md](./foundations/elevation.md) | ~{N} |
| Border Radius | [border-radius.md](./foundations/border-radius.md) | ~{N} |

## Tokens

| File | Description |
|------|-------------|
| [tokens.json](./tokens.json) | W3C Design Tokens |
```

## Step 10: Update state

If a brand STATE.md exists at the brand path:
- Set system phase status to `complete`
- Record style preset name and completion date
- Set Prettiness Level to 60% (foundations only, no components)

If a project config.json exists:
- Add `"style_preset": "{name}"` to preferences

## Step 11: Completion output

Display the result:

```
  /gsp:style — {name} applied
  ═══════════════════════════════════════

  {OUTPUT_PATH}/
  ├── foundations/
  │   ├── color-system.md
  │   ├── typography.md
  │   ├── spacing.md
  │   ├── elevation.md
  │   └── border-radius.md
  ├── tokens.json
  └── INDEX.md

  ─────────────────────────────────────
```

Then use `AskUserQuestion` with routing options:

- **Start a project** — "scope what you're building with this style" → route to `/gsp:project-brief`
- **Build components** — "extend with a full component library" → route to `/gsp:brand-patterns` (components pass only)
- **Preview tokens** — "see the token values" → show tokens.json summary
- **Try a different style** — "apply a different preset" → restart at Step 2
</process>
