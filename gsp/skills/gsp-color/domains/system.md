# Color System

Domain expertise for full color system design — creative rationale, contrast validation, semantic mapping, dark mode.

---

## Modes

| Input | Mode |
|-------|------|
| `--enrich` | Enrich existing color-system.md with technical precision |
| *(no args)* | Interactive — explore and build a color system from scratch |

## Enrich mode (`--enrich`)

Read existing `{BRAND_PATH}/identity/color-system.md`. Extract chosen hex values and rationale.

Read `references/color-composition.md` via `${CLAUDE_SKILL_DIR}/references/color-composition.md` for domain expertise on composition strategies.

Enrich the file with:
- OKLCH 11-stop scales via tints.dev API: `https://www.tints.dev/api/{colorName}/{hexWithoutHash}`
- WCAG AA contrast ratios for every semantic foreground/background pair
- Semantic color mapping (error, success, warning, info)
- Dark mode color mapping with equivalent contrast
- Write `palettes.json` alongside color-system.md

Overwrite `color-system.md` with enriched version. Preserve the creative rationale — add technical data around it.

## Interactive mode (no args)

One `AskUserQuestion` at a time:

1. **Starting point** — use `AskUserQuestion`:
   - **I have hex values** — "I know my brand colors"
   - **From a style preset** — "Start from a GSP preset palette"
   - **Explore** — "Help me find the right palette"
2. If exploring: ask about mood (warm/cool/neutral), energy (vibrant/muted/earthy), context (tech/health/luxury/etc.)
3. Propose a palette with primary + secondary + accent + neutral, show hex swatches
4. Confirm or iterate

After colors are confirmed, build the full system (contrast, semantics, dark mode).

## WCAG AA contrast validation

Calculate contrast for every text/background pair:
- Normal text: 4.5:1 minimum
- Large text (18px+ or 14px+ bold): 3:1 minimum
- Flag failures with suggested alternatives from the palette scale

Test these combinations:
- Each semantic color on white (#fff) and black (#000)
- Primary text on secondary backgrounds and vice versa
- All foreground/background pairs used in semantic assignments

## Semantic color mapping

Map brand colors to semantic roles:
- **Primary** → CTAs, primary buttons, links
- **Secondary** → supporting UI, secondary surfaces
- **Accent** → highlights, badges, decorative

Define standard semantic colors:
- **Error** — red-family, distinct from brand palette
- **Success** — green-family
- **Warning** — amber/yellow-family
- **Info** — blue-family (or brand secondary if blue-adjacent)

Each semantic color needs its own 11-stop scale or at minimum light/default/dark stops.

## Dark mode mapping

Maintain equivalent contrast relationships:

| Light mode | Dark mode | Rationale |
|------------|-----------|-----------|
| primary-500 (buttons) | primary-400 | Lighter for dark bg contrast |
| primary-50 (bg tint) | primary-950 | Invert the tint |
| primary-900 (text) | primary-100 | Invert for readability |
| secondary-500 | secondary-400 | Same shift as primary |
| neutral-50 (page bg) | neutral-950 | Full inversion |
| neutral-900 (body text) | neutral-100 | Full inversion |

## Output structure

Write to the resolved output path:

### color-system.md

Full color system chunk (~100-150 lines) per chunk-format.md including:
- Source colors table
- Palette scales (all 11 stops per color)
- Contrast audit results (pass/fail per pair)
- Semantic color assignments (light + dark values)
- Dark mode mapping table
- Composition strategy recommendation (referencing color-composition.md strategies)

### palettes.json

Full OKLCH scales in structured JSON (same format as palette domain).

### Semantic assignments template

```
| Token | Light value | Dark value |
|-------|-------------|------------|
| --color-brand | primary-500 | primary-400 |
| --color-brand-hover | primary-600 | primary-300 |
| --color-surface | primary-50 | primary-950 |
| --color-text | primary-900 | primary-50 |
| --color-accent | accent-500 | accent-400 |
| --color-error | error-500 | error-400 |
| --color-success | success-500 | success-400 |
| --color-warning | warning-500 | warning-400 |
| --color-info | info-500 | info-400 |
```

## Completion

Display palette summary with contrast status. Offer next steps via `AskUserQuestion`:
- **Generate type scale** — route to `/gsp-typography`
- **Apply a full style** — route to `/gsp-style`
- **Continue to identity** — route to `/gsp-brand-identity`
- **Done** — "that's all for now"
