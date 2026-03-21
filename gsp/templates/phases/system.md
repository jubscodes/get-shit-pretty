# Design System

## Brand: {BRAND_NAME}
**Date:** {DATE}

> Created once per brand. Reused across all projects.

---

> This phase produces foundation chunks in `system/foundations/`, component chunks in `system/components/`, plus `principles.md`, `tokens.json`, and `INDEX.md`.

## Inputs
- identity/color-system.md → foundations/color-system.md
- identity/palettes.json → token generation
- identity/typography.md → foundations/typography.md
- identity/logo-directions.md → clear space tokens
- strategy/archetype.md + strategy/brand-platform.md → principles.md
- strategy/voice-and-tone.md → content component guidelines
- config.json system_config — tech_stack, system_strategy

## Chunk Mapping

### Foundations (`system/foundations/`)

| Chunk File | Content |
|-----------|---------|
| `foundations/color-system.md` | Primary, secondary, semantic, neutral scale, dark mode, contrast ratios |
| `foundations/typography.md` | 9-level type scale (Display → Overline) with all properties |
| `foundations/spacing.md` | 8px base unit spacing scale |
| `foundations/grid.md` | 12-column grid with gutters, margins, breakpoints |
| `foundations/elevation.md` | 5 shadow levels with use cases and values |
| `foundations/border-radius.md` | Token scale (none, sm, md, lg, xl, full) |

### Components (`system/components/`)

Component output is library-aware:

1. **`token-mapping.md`** (always) — brand tokens → component library theming API. Complete, copy-paste-ready config.
2. **Override specs** (selective) — one file per library component needing treatment beyond tokens. Singular kebab-case naming.
3. **Custom component specs** (selective) — one file per brand-distinctive component with no library equivalent. Includes: states, anatomy, usage rules, accessibility spec, code hints.

If no UI library is detected, write up to 15 core component specs.

### Other Files

| File | Content |
|-----------|---------|
| `principles.md` | 3-5 design principles + do's and don'ts |
| `tokens.json` | Complete W3C Design Tokens format (color, typography, spacing, shadow, border-radius, breakpoints) |
| `{brand-name}.yml` | Custom style preset — the brand's aesthetic in the same YAML format as GSP's 34 style presets. Portable and reusable. |
| `{brand-name}.md` | Custom style prompt — AI-ready prompt that reproduces this brand's aesthetic, same format as designprompts.dev. |

## Content Reference

Each chunk follows the format in `references/chunk-format.md`. Below is the structural reference for what each chunk should contain:

### foundations/color-system.md
- Full color palette with semantic mapping
- Primary, secondary, accent, background, text colors
- Semantic colors: error, success, warning, info
- Neutral scale
- Dark mode mapping
- Contrast ratios (WCAG AA)

### foundations/typography.md
- Type scale table: Level, Size, Weight, Line Height, Letter Spacing, Use
- Levels: Display, H1, H2, H3, Body Large, Body, Body Small, Caption, Overline

### foundations/spacing.md
- Base unit: 8px
- Scale: 4, 8, 12, 16, 24, 32, 48, 64, 96
- Usage guidelines per scale value

### foundations/grid.md
- Columns: 12
- Gutter, margin values
- Breakpoint definitions and behavior

### foundations/elevation.md
- 5 levels (0–4): Flat, Cards, Dropdowns, Modals, Popovers
- CSS shadow values per level

### foundations/border-radius.md
- Token scale: none (0), sm, md, lg, xl, full (9999px)
- Use cases per token

### components/token-mapping.md
- Library-specific token config (CSS vars, theme object, etc.)
- Maps every foundation token to the library's theming API
- Copy-paste-ready — no interpretation needed

### Override component chunks
- What to override and why (traces to brand identity)
- Code hints for the specific library
- Cross-references to foundation chunks

### Custom component chunks
- States: default, hover, active, disabled, focus, loading
- Anatomy diagram
- Usage rules
- Accessibility spec
- Code hints
- Cross-references to foundation chunks

### principles.md
- 3-5 design principles with rationale
- Do's and Don'ts table
