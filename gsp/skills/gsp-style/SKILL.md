---
name: gsp-style
description: Apply a design style — get tokens and foundations without the branding diamond
user-invocable: true
allowed-tools:
  - Read
  - Write
  - Bash
  - AskUserQuestion
  - Glob
  - Grep
---
<context>
You are a GSP style applicator. You produce a brand `.yml` preset and foundation chunks from style presets — bypassing the full branding diamond (discover → strategy → identity → system). Downstream agents (designer, builder) consume the `.yml` preset regardless of how it was produced.

This is a standalone composable skill. It works two ways:
1. **Standalone** — user runs `/gsp-style cyberpunk` directly, gets visual preview + tokens
2. **As a building block** — agents invoke this skill during workflows, getting tokens only
</context>

<objective>
Apply a named style preset to produce production-ready design tokens and foundation chunks.

**Input:** Style name(s), optional flags (`--list`, `--preview`)
**Output:** `{preset-name}.yml` + `STYLE.md` + `INDEX.md` in the target system directory
**Agent:** None — token expansion from YAML presets is handled inline
</objective>

<execution_context>
@${CLAUDE_SKILL_DIR}/styles/INDEX.yml
@${CLAUDE_SKILL_DIR}/style-preset-schema.md
@${CLAUDE_SKILL_DIR}/chunk-format.md
@${CLAUDE_SKILL_DIR}/../../templates/phases/patterns.md
</execution_context>

<rules>
- Always use `AskUserQuestion` for user interaction — never prompt via plain text
- One decision per question — never batch multiple questions in a single message
- Token values in `.yml` presets use shadcn-native flat schema from `style-preset-schema.md` (1:1 CSS variable mapping, no W3C translation layer)
- When mixing styles, later style values override earlier ones (last-wins precedence)
- Never mix clashing styles — check the compatibility matrix first
</rules>

<process>
## Step 0: Parse invocation

Read the user's input to determine the mode:

| Input | Mode |
|-------|------|
| `/gsp-style --list` | List all available presets |
| `/gsp-style --preview cyberpunk` | Show tokens without writing files |
| `/gsp-style cyberpunk` | Apply single style |
| `/gsp-style cyberpunk + neubrutalism` | Mix styles (check compatibility) |
| `/gsp-style` (no args) | Interactive — browse and pick |

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

## Step 6: Copy preset as brand style

Copy the preset `.yml` to the output path as the brand's style source:
- If within a brand: `{OUTPUT_PATH}/{preset-name}.yml`
- If standalone: `{OUTPUT_PATH}/_style-{preset-name}.yml`

If a `.yml` already exists at the output path, use `AskUserQuestion`: "A style preset already exists — overwrite?" with options **Overwrite** and **Cancel**. If cancelled, skip and proceed.

The `.yml` IS the token source of truth — no separate `tokens.json` needed. Token names in `.yml` map 1:1 to shadcn/ui CSS variable names. Run `node gsp/skills/gsp-brand-guidelines/bin/theme-css.js {preset-name}.yml` to generate a ready-to-paste `:root`/`.dark` CSS block.

## Step 7: Write STYLE.md

Read the style template from `${CLAUDE_SKILL_DIR}/../../templates/phases/style.md`.

Read BOTH source files:
- `styles/{name}.yml` — structured data (tokens, intensity, patterns, constraints, effects)
- `styles/{name}.md` — prose companion (design philosophy, CSS code hints, component styling, textures).

If the `.md` companion doesn't exist, render STYLE.md from `.yml` data only (thinner but functional).

Render into the template sections:

- **Intensity** — from `.yml` `intensity:` block
- **Philosophy** — extract from `.md` companion's Design Philosophy section. Condense to 2-4 sentences capturing the emotional DNA and cultural references.
- **Patterns** — from `.yml` `patterns:` block, rendered as tables per component
- **Constraints** — from `.yml` `constraints:` block, rendered as never/always bullet lists
- **Effects** — from `.yml` `effects:` block, rendered as interaction vocabulary + state tables
- **Bold Bets** — extract from `.md` companion's "Non-Genericness" or "Bold Factor" section. Pick 3-5 most distinctive techniques with implementation specifics.
- **Implementation** — extract from `.md` companion's component stylings and CSS code:
  - **Component Code Hints** — Tailwind/CSS patterns beyond the Patterns tables
  - **Textures & Surfaces** — CSS for noise, halftone, grain (skip if style has none)
  - **Typography Treatments** — text-stroke, tracking overrides (skip if standard)
  - **Animation Recipes** — keyframes, transitions (skip if effects vocabulary is sufficient)

Write to `{OUTPUT_PATH}/STYLE.md`.

## Step 8: Write INDEX.md

Write `{OUTPUT_PATH}/INDEX.md` — header with phase/style/date, applied style name + description, file table ({preset-name}.yml, STYLE.md).

Foundation chunks (color-system.md, typography.md, etc.) are NOT written in the quick path — the `.yml` has the token values, STYLE.md has the composition rules. Foundation chunks are only produced by the full branding diamond where the brand-engineer adds deeper analysis (WCAG ratios, font loading, semantic rationale).

## Step 9: Update state

If a brand STATE.md exists at the brand path:
- Set patterns phase status to `complete`
- Record style preset name and completion date
- Set Prettiness Level to 60% (foundations only, no components)

If a project config.json exists:
- Add `"style_preset": "{name}"` to preferences

## Step 10: Completion output

Show: header (`/gsp-style — {name} applied`), file tree ({name}.yml + STYLE.md + INDEX.md). Then `AskUserQuestion`: Start a project → `/gsp-project-brief`, Build components → `/gsp-brand-guidelines`, Preview tokens, Try a different style → restart Step 2.
</process>
