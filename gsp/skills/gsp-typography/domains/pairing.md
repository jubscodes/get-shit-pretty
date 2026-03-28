# Domain: Font Pairing & Enrichment

Font pairing exploration and enrichment of existing typography files with technical precision.

---

## Enrich Mode (`--enrich`)

Read existing `{BRAND_PATH}/identity/typography.md`. Extract chosen typefaces and scale direction.

Load `${CLAUDE_SKILL_DIR}/references/typography-scales.md` for domain expertise (section 7: Font Pairing Principles).

### What to add

Enrich the file with:
- Mathematical 9-level type scale from the chosen ratio (delegate calculation to `domains/scale.md` rules)
- Fluid type clamp() formulas per level
- Font weight mapping (heading weight, body weight, accent weight)
- Line height per level (tighter for display, looser for body)
- Letter spacing per level (negative for display, positive for overlines)
- Google Fonts import URL or font loading strategy
- Vertical rhythm based on base line-height

Overwrite `typography.md` with the enriched version. **Preserve the creative rationale** from the original file.

---

## Font Pairing Exploration

When the user wants to explore pairings (interactive mode, "Explore pairings" path):

### Design judgment criteria

Match fonts based on:
- **Voice** — authoritative, friendly, technical, editorial, playful
- **Format** — long-form reading, dashboard/data, marketing/landing, documentation
- **Personality** — the brand's character and how type reinforces it

### Pairing strategies

**1. Contrast** — Pair fonts that differ in classification
- Serif heading + sans-serif body (most reliable)
- Geometric sans + humanist sans
- Slab serif + thin sans

**2. Harmony** — Pair fonts sharing structural characteristics
- Match x-height, stroke width, overall proportions
- Different styles from same era or tradition

**3. Superfamily** — Use a designed family spanning classifications
- IBM Plex: Sans, Serif, Mono
- Roboto + Roboto Slab + Roboto Mono
- Source Sans + Source Serif + Source Code

### What to match
- **x-height** — most important metric; mismatched x-heights look unbalanced
- **Stroke contrast** — both high-contrast or both low-contrast
- **Overall proportions** — similar width tendencies
- **Cap height** — for text set alongside each other

### What to contrast
- **Weight** — light heading + bold body or vice versa
- **Classification** — serif vs sans, geometric vs humanist
- **Mood** — formal vs casual, mechanical vs organic

### Reliable pairings for product UI

| Heading | Body | Mono | Vibe |
|---------|------|------|------|
| Inter | Inter | JetBrains Mono | Neutral, flexible |
| Geist Sans | Geist Sans | Geist Mono | Modern, precise |
| IBM Plex Sans | IBM Plex Sans | IBM Plex Mono | Enterprise, reliable |
| Work Sans | Source Serif 4 | Source Code Pro | Editorial + functional |
| Space Grotesk | Inter | JetBrains Mono | Technical, contemporary |
| Fraunces | Inter | Fira Code | Retro-modern editorial |
| DM Sans | DM Serif Display | DM Mono | Cohesive family |

### Pairing rules
1. Never pair more than 3 typefaces in a project
2. One font should clearly lead — the other supports
3. Test pairings at actual sizes, not just in specimen
4. Ensure both fonts have the weights you need
5. Superfamilies are the safest choice for design systems

---

## Font Sourcing

### Google Fonts
- Free, widely available, automatic subsetting
- Provide full `@import` URL with selected weights
- Good for prototyping and production

### Fontsource (npm packages)
- `@fontsource/inter`, `@fontsource-variable/inter`
- Self-hosted via npm — no external requests
- Tree-shakeable weight/subset imports
- Recommended for Next.js, Vite, and other bundled apps

### Local / Premium
- Self-hosted WOFF2 files for licensed fonts
- `@font-face` declarations with `font-display: swap`
- Subsetting via `unicode-range` for performance

### Loading strategy

**Next.js:** Use `next/font/google` or `next/font/local` — automatic optimization, no layout shift
**Fontsource:** Import in global CSS or layout component
**Self-hosted:** Preload critical fonts, use `font-display: swap` for body and `fallback` for headings
