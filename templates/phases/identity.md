# Visual Identity

## Brand: {BRAND_NAME}
**Date:** {DATE}

---

> This phase produces 6 chunks + palettes.json + INDEX.md in the `identity/` directory.

## Inputs
- BRIEF.md — audience, constraints
- discover/mood-board-direction.md → color direction (hex), typography (typefaces), imagery
- strategy/brand-prism.md Physique → logo concept, visual form
- strategy/archetype.md visual tendencies → color warmth, type energy, imagery style
- strategy/positioning.md → visual differentiation
- strategy/brand-platform.md → values as visual language
- verbal/brand-voice.md → typography warmth, color energy
- verbal/tone-spectrum.md → visual energy level
- audit/brand-inventory.md (if exists) → current visual elements as evolution baseline
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

Each chunk follows the format in `references/chunk-format.md`. Below is the structural reference for what each chunk should contain:

### logo-directions.md
- 3 directions each with:
  - **Concept:** description
  - **Strategic rationale:** why this direction
  - **Variations:** Primary, Secondary, Icon, Monochrome
  - **Clear space:** rules
  - **Minimum size:** min size
  - **Usage rules:** rules

### color-system.md
- Full palette table: Role, Hex, RGB, Pantone, CMYK, Usage, Rationale
- Semantic colors (error, success, warning)
- Color rationale — how colors connect to brand strategy and archetype
- Dark mode mapping table: Light Mode → Dark Mode
- Contrast ratios table: Combination, Ratio, Pass/Fail (WCAG AA)
- Reference to `./palettes.json` for machine-readable OKLCH scales

### typography.md
- **Primary typeface:** name, rationale (connect to verbal tone), weights, use cases
- **Secondary typeface:** name, rationale, weights, use cases
- Type scale table: Level, Size, Weight, Line Height, Use
- Responsive behavior notes

### imagery-style.md
- **Photography direction:** style, subjects, color treatment, composition, don'ts
- **Illustration style:** style, complexity, color palette
- **Iconography:** style, weight, grid, corner radius

### brand-applications.md
- Key touchpoints showing the brand in use (digital, print, social)
- Each application with visual direction and design notes

### brand-book.md
- 20-page outline:
  1. Cover — 2. Brand Story — 3. Brand Prism — 4. Brand Voice
  5. Logo System — 6. Logo Usage Rules — 7. Color System — 8. Color Applications
  9. Typography — 10. Type in Use — 11. Imagery Direction — 12. Photography Guidelines
  13. Illustration Guidelines — 14. Iconography — 15. Layout & Grid
  16. Brand Applications (Digital) — 17. Brand Applications (Print)
  18. Brand Applications (Social) — 19. Do's and Don'ts — 20. Contact & Resources
