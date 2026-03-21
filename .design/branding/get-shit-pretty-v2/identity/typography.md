# Typography

> Phase: identity | Brand: get-shit-pretty | Generated: 2026-03-19

---

## Typeface Selection

### Primary: JetBrains Mono

**License:** SIL Open Font License (free, open source)
**Source:** Google Fonts, JetBrains GitHub
**Weights used:** Regular (400), Medium (500), Bold (700)

**Why JetBrains Mono:** GSP's voice is clear, warm, and lighthearted. JetBrains Mono is the typographic expression of clarity -- every character is distinct, every ligature is intentional, every glyph is designed for extended reading at small sizes. Choosing a monospace typeface as the primary (not secondary) font is the positioning statement made visible: terminal is home, not an afterthought.

The Creator archetype builds with precision. Monospace is the most precise typographic system -- every character occupies the same width, every column aligns, every indent is structural. The Guide archetype values readability. JetBrains Mono's increased x-height and distinct character forms (capital I vs lowercase l vs numeral 1) mean the user never misreads.

**Competitive differentiation:** Every major dev tool (Vercel, Linear, shadcn, Cursor) uses a proportional sans-serif as its brand typeface and reserves monospace for code blocks. GSP leads with monospace. This is not a limitation -- it is a declaration.

### Display: Instrument Sans

**License:** SIL Open Font License (free, Google Fonts)
**Source:** Google Fonts
**Weights used:** SemiBold (600), Bold (700)

**Why Instrument Sans:** For moments where monospace would feel constrained -- landing page headlines, conference slides, social media cards -- Instrument Sans provides geometric precision with enough warmth to match the voice. Its sharp, modern geometry complements JetBrains Mono without competing.

It is distinct from Inter (shadcn/Cursor), Geist Sans (Vercel), Space Grotesk (jubs.studio), and SF Pro (Apple ecosystem). This matters for founder ecosystem differentiation and market positioning.

**Usage boundary:** Instrument Sans appears only in display contexts (40px+ in web, never in terminal). It never replaces JetBrains Mono in documentation, CLI output, or code. The Creator works in monospace; Instrument Sans is for when the Creator's work needs to be seen from across the room.

---

## Type Scale

### Web Scale (pixel-based)

| Level | Size | Weight | Line Height | Tracking | Font | Use |
|-------|------|--------|-------------|----------|------|-----|
| Display 1 | 72-160px | 700 | 1.0 | -0.04em | Instrument Sans | Hero headlines, marketing |
| Display 2 | 48-72px | 700 | 1.1 | -0.03em | Instrument Sans | Section headers, slides |
| Heading 1 | 32-40px | 700 | 1.2 | -0.02em | JetBrains Mono | Page titles |
| Heading 2 | 24-28px | 700 | 1.3 | -0.01em | JetBrains Mono | Section titles |
| Heading 3 | 20px | 500 | 1.4 | 0 | JetBrains Mono | Subsection titles |
| Body | 16px | 400 | 1.7 | 0 | JetBrains Mono | Paragraph text |
| Body Small | 14px | 400 | 1.6 | 0.01em | JetBrains Mono | Secondary content |
| Caption | 12px | 400 | 1.5 | 0.02em | JetBrains Mono | Metadata, labels |
| Overline | 11px | 700 | 1.4 | 0.12em | JetBrains Mono | Category labels, uppercase |

**Scale ratio:** Approximately 1.25 (Major Third) from 16px base, with manual adjustments at display sizes for visual impact. The Creator demands a mathematical foundation; the Guide demands readability at every size.

### Terminal Scale (character-based)

In terminal contexts, size is fixed by the user's terminal font size. Hierarchy is achieved through weight, casing, spacing, and box-drawing characters -- not font size.

| Level | Weight | Treatment | Character Width | Use |
|-------|--------|-----------|----------------|-----|
| Phase header | 700 | UPPERCASE, bordered | Full terminal width | Phase completion banners |
| Section header | 700 | Title case | Content width | Section dividers in output |
| Label | 500 | Uppercase, spaced | 20-30 chars | Field labels, column headers |
| Body | 400 | Sentence case | 60-80 chars (wrap) | Descriptions, explanations |
| Metadata | 400 | Muted color | 40-60 chars | File paths, timestamps |

---

## Responsive Behavior

| Breakpoint | Display 1 | Display 2 | H1 | Body | Line Height (body) |
|------------|-----------|-----------|-----|------|-------------------|
| Desktop (1200px+) | 160px | 72px | 40px | 16px | 1.7 |
| Tablet (768-1199px) | 96px | 56px | 32px | 16px | 1.7 |
| Mobile (< 768px) | 56px | 40px | 28px | 16px | 1.6 |

Display sizes scale down aggressively. Body text stays at 16px -- readability is non-negotiable. Line height tightens slightly on mobile to preserve content density.

---

## Pairing Logic

| Context | Heading Font | Body Font | Rationale |
|---------|-------------|-----------|-----------|
| Terminal output | JetBrains Mono 700 | JetBrains Mono 400 | Single font, weight hierarchy. Terminal is home. |
| Documentation | JetBrains Mono 700 | JetBrains Mono 400 | Monospace documentation reinforces CLI-native positioning. |
| Marketing page | Instrument Sans 700 | JetBrains Mono 400 | Display headlines grab attention; mono body grounds in craft. |
| README | JetBrains Mono 700 | JetBrains Mono 400 | GitHub renders in system monospace context -- stay native. |
| Conference slides | Instrument Sans 700 | JetBrains Mono 400 | Large display needs proportional geometry; supporting text stays mono. |
| Social media cards | Instrument Sans 700 | JetBrains Mono 500 | High contrast needed at small preview sizes. |

---

## Usage Rules

1. **Never mix more than two typefaces** in a single layout. JetBrains Mono + Instrument Sans is the maximum.
2. **JetBrains Mono is always the default.** If in doubt, use mono. Instrument Sans requires justification.
3. **Ligatures on in code contexts**, off in brand/display contexts. The arrow ligature `->` is useful in code; in brand text it is a distraction.
4. **Tracking loosens as size decreases.** Display text is tight (-0.04em). Caption text is loose (0.02em). This preserves readability across the scale.
5. **Line height 1.7 for monospace body text.** This is generous by convention, but monospace at 1.5 line-height feels cramped. The extra breathing room is the Guide's warmth expressed typographically.
6. **Uppercase is reserved for overlines, labels, and terminal phase headers.** Never for body text, never for full sentences. Uppercase monospace in sentences reads as SHOUTING.

---

## Related

- [Color System](./color-system.md)
- [Logo Directions](./logo-directions.md)
- [Imagery Style](./imagery-style.md)
