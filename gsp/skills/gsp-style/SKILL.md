---
name: style
description: Apply a design style — get tokens and foundations without the branding diamond
user-invocable: true
model: sonnet
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
@${CLAUDE_SKILL_DIR}/../../templates/phases/patterns.md
</execution_context>

<rules>
- Always use `AskUserQuestion` for user interaction — never prompt via plain text
- One decision per question — never batch multiple questions in a single message
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

Read `styles/INDEX.yml` and display all presets grouped by category. Format each as `{name}  {one-line description}` with `─── Category ────` separators and footer showing usage. Example:

```
  ─── Minimal ────────────────────────
    swiss-minimalist     Helvetica and whitespace — let the content breathe
    flat-design          Solid colors, zero shadows — bold color blocks as structure
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
- Write to `{BRAND_PATH}/patterns/`
- This replaces the patterns phase of the branding diamond

### Within a project (quick mode)
If invoked from a project context (`.design/projects/{project}/`):
- Check if a `brand.ref` exists pointing to a brand with a completed system
- If no brand system exists, write to `.design/branding/_style-{preset-name}/patterns/`
- Create a minimal brand directory with just the system output
- Update the project's `brand.ref` to point to this auto-generated brand

### Standalone (no .design/ context)
- Write to `.design/branding/_style-{preset-name}/patterns/`
- Create minimal brand directory structure

## Step 5: Preview mode (`--preview`)

If `--preview`, display expanded tokens grouped by section (Color, Typography, Shape, Elevation, Motion) as key-value pairs. Footer: usage hint to apply. Stop here — do not write any files.

## Step 6: Expand tokens to W3C format

Transform the YAML preset tokens into the full W3C Design Tokens JSON structure.

### Token expansion mapping

Transform each YAML preset section into W3C Design Tokens JSON with `$value` and `$type` fields:

| Preset section | Token path | $type | Notes |
|---------------|------------|-------|-------|
| `color.*` | `color.brand.{key}`, `color.semantic.{key}` | `color` | Split into brand (primary, secondary, accent) and semantic (background, surface, on-primary, on-background, error, success, warning, info) |
| `typography.*` | `font.family.{primary,mono}` | `fontFamily` | — |
| `typography.*` | `typography.{level}` | `typography` | Composite: fontFamily, fontSize, fontWeight, lineHeight, letterSpacing. 9 levels: display, heading-1 through heading-3, body-large, body, body-small, caption, overline |
| `spacing.*` | `spacing.{xs,sm,md,lg,xl,2xl,3xl,4xl}` | `dimension` | — |
| `elevation.*` | `shadow.{sm,md,lg,xl}` | `shadow` | Parse CSS shadow shorthand into structured format |
| `shape.*` | `radius.{none,sm,md,lg,full}` | `dimension` | `full` = 9999px |
| `motion.*` | `motion.duration.{fast,normal}`, `motion.easing.default` | `duration`, `cubicBezier` | — |

**Style-specific tokens:** If preset has extra groups (e.g., `glass`, `glow`, `gradient`, `syntax`), include under `$extensions.gsp-style-specific`.

**Dark mode:** If preset has `dark_mode` section, include under `$extensions.dark` with semantic color overrides.

**Extensions metadata:** Always include `$extensions.gsp-style` with the preset name.

## Step 7: Write tokens.json

If `{OUTPUT_PATH}/tokens.json` already exists, use `AskUserQuestion`: "tokens.json already exists — overwrite with style preset? Existing component-level tokens will be replaced." with options **Overwrite** and **Cancel**. If cancelled, skip writing tokens.json and proceed to the next step.

Write the complete W3C Design Tokens JSON to `{OUTPUT_PATH}/tokens.json`.

## Step 8: Write foundation chunks

Write 5 foundation chunks to `{OUTPUT_PATH}/foundations/`, each following `references/chunk-format.md`:

- **color-system.md** — brand colors, semantic colors, dark mode mapping, WCAG contrast notes
- **typography.md** — 9-level type scale, font family details + Google Fonts link, weight rationale
- **spacing.md** — spacing scale with base unit and usage guidelines
- **elevation.md** — shadow scale with use cases per level + style-specific notes
- **border-radius.md** — radius token scale + style-specific shape notes

## Step 9: Write INDEX.md

Write `{OUTPUT_PATH}/INDEX.md` — header with phase/style/date, applied style name + description, foundations table (chunk name, file link, ~lines), tokens table (tokens.json link).

## Step 10: Update state

If a brand STATE.md exists at the brand path:
- Set patterns phase status to `complete`
- Record style preset name and completion date
- Set Prettiness Level to 60% (foundations only, no components)

If a project config.json exists:
- Add `"style_preset": "{name}"` to preferences

## Step 11: Completion output

Show: header (`/gsp:style — {name} applied`), file tree (foundations/ + tokens.json + INDEX.md). Then `AskUserQuestion`: Start a project → `/gsp:project-brief`, Build components → `/gsp:brand-patterns`, Preview tokens, Try a different style → restart Step 2.
</process>
