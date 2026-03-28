# Domain: Full Type System (Interactive Mode)

Complete typography system direction — combines scale generation, font pairing, and loading strategy into a single interactive workflow.

---

## Interactive Questions

Use `AskUserQuestion` for each step. One decision per question.

### 1. Starting point

- **I have fonts chosen** — "I know my typefaces"
- **From a style preset** — "Start from a GSP preset type system"
- **Explore pairings** — "Help me find the right fonts"

If "Explore pairings": load `domains/pairing.md` and follow font pairing exploration workflow. Ask about voice (authoritative/friendly/technical/editorial), format (long-form/dashboard/marketing).

If "From a style preset": route to `domains/scale.md` --from-style workflow.

### 2. Fonts (if "I have fonts chosen")

Ask for primary font family. Offer popular options:
- Inter, Geist Sans, Plus Jakarta Sans, DM Sans, Space Grotesk, Instrument Serif, Custom

### 3. Scale ratio

- **1.2 Minor Third** — "subtle, compact, dashboards"
- **1.25 Major Third** — "balanced, versatile, most projects"
- **1.333 Perfect Fourth** — "pronounced hierarchy, editorial"
- **1.5 Perfect Fifth** — "dramatic, poster-like"
- **Custom** — "specify your own ratio"

Link https://typescale.com/ for interactive preview.

### 4. Base size

Default 16px unless user specifies otherwise.

---

## Output Structure

Write `typography.md` as a foundation chunk per `chunk-format.md`. Target: 80-120 lines.

### Required sections

1. **Font Families** (~10 lines)
   - Primary, secondary (if any), monospace
   - Google Fonts URL or loading strategy
   - Fallback stacks

2. **Type Scale** (~30 lines)
   - All 10 levels in a table: Level, px, rem, clamp(), Weight, Line Height, Letter Spacing, Tailwind class
   - Base size and ratio noted

3. **Fluid Type** (~10 lines)
   - Mobile viewport (375px) and desktop viewport (1280px)
   - Mobile ratio step-down
   - clamp() formula explanation

4. **Weights** (~5 lines)
   - Available weights and their roles
   - Heading weight, body weight, accent weight

5. **Vertical Rhythm** (~5 lines)
   - Grid unit (4px)
   - Body line-height anchor
   - Spacing tokens derived from line-height

6. **Letter Spacing** (~5 lines)
   - Curve summary (negative for display, zero for body, positive for captions)
   - Overline/all-caps tracking

7. **Loading Strategy** (~10 lines)
   - Recommended approach (next/font, Fontsource, self-hosted)
   - `font-display` values
   - Performance budget

8. **Accessibility** (~5 lines)
   - WCAG 2.2 AA compliance notes
   - Body line-height >= 1.5
   - SC 1.4.12 text spacing override safety

9. **Modern CSS** (~5 lines)
   - `text-wrap: balance` for headings
   - `text-wrap: pretty` for paragraphs
   - `font-optical-sizing: auto` if variable font
   - Dark mode antialiasing (`-webkit-font-smoothing: antialiased`)

10. **Related** (~5 lines)
    - Links to palette, style, identity skills

---

## CSS File

Also write a CSS file alongside `typography.md` — delegate format to `domains/scale.md` CSS output rules. Default: `tailwind.typography.css` (Tailwind v4 @theme). With `--vanilla`: `typescale.css` (plain custom properties).

---

## Completion

Display scale preview table. Offer next steps via `AskUserQuestion`:
- Generate palette -> `/gsp-color`
- Apply a full style -> `/gsp-style`
- Continue to identity -> `/gsp-brand-identity`
- Done
