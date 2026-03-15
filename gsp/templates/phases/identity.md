# Visual Identity

## Brand: {BRAND_NAME}
**Date:** {DATE}

---

> This phase produces 6 chunks + palettes.json + INDEX.md in the `identity/` directory.

## Inputs
- BRIEF.md — personas, constraints
- discover/mood-board-direction.md → color direction, typography, imagery
- strategy/archetype.md → visual tendencies, color warmth, type energy
- strategy/positioning.md → visual differentiation from competitors
- strategy/brand-platform.md → values as visual language
- strategy/voice-and-tone.md → typography warmth, visual energy level
- audit/brand-inventory.md (if exists) → current visual elements as baseline
- audit/evolution-map.md (if exists) → preserve/evolve/replace decisions

## Chunk Mapping

| Chunk File | Content |
|-----------|---------|
| `logo-directions.md` | 3 logo directions with concept, rationale, variations, usage rules |
| `color-system.md` | Full palette table, semantic colors, dark mode mapping, contrast ratios |
| `typography.md` | Primary + secondary typefaces, full type scale, responsive behavior |
| `imagery-style.md` | Photography, illustration, iconography guidelines |
| `brand-applications.md` | Key touchpoints showing the brand in use |
| `brand-book.md` | 20-page brand book outline with section descriptions |

Also produces `palettes.json` — machine-readable OKLCH color scales.

## Content Reference

Each chunk follows the format in `references/chunk-format.md`.

### logo-directions.md
- 3 directions each with:
  - **Concept:** description
  - **Strategic rationale:** connects to archetype + positioning
  - **Variations:** Primary, Secondary, Icon, Monochrome
  - **Clear space and minimum size**
  - **Usage rules**

### color-system.md
- Full palette table: Role, Hex, RGB, Pantone, CMYK, Usage, Rationale
- Semantic colors (error, success, warning)
- Color rationale — connects to archetype and brand essence
- Dark mode mapping table
- Contrast ratios table (WCAG AA)
- Reference to `./palettes.json` for machine-readable OKLCH scales

### typography.md
- **Primary typeface:** name, rationale (connect to voice), weights, use cases
- **Secondary typeface:** name, rationale, weights, use cases
- Type scale table: Level, Size, Weight, Line Height, Use
- Responsive behavior

### imagery-style.md
- **Photography direction:** style, subjects, color treatment, composition, don'ts
- **Illustration style:** style, complexity, color palette
- **Iconography:** style, weight, grid, corner radius

### brand-applications.md
- Key touchpoints showing the brand in use (digital, print, social)
- Each application with visual direction and design notes

### brand-book.md
- 20-page outline covering: Brand Story, Strategy, Voice, Logo System,
  Color, Typography, Imagery, Layout, Applications, Do's and Don'ts
