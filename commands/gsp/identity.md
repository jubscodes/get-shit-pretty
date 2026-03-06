---
name: gsp:identity
description: Visual identity — logo system, color, typography, imagery
allowed-tools:
  - Read
  - Write
  - Bash
  - Task
  - WebSearch
  - WebFetch
---
<context>
Phase 4 of the GSP branding diamond. Creates the brand's visual identity — logo system, color, typography, imagery — all grounded in brand strategy and verbal identity.
</context>

<objective>
Create the brand's visual identity.

**Input:** `.design/branding/{brand}/strategy/STRATEGY.md` + `.design/branding/{brand}/verbal/VERBAL.md`
**Output:** `.design/branding/{brand}/identity/IDENTITY.md` + `.design/branding/{brand}/identity/palettes.json`
**Agent:** `gsp-identity-designer`
</objective>

<execution_context>
@/Users/jubs/.claude/get-shit-pretty/prompts/02-brand-identity-creator.md
@/Users/jubs/.claude/get-shit-pretty/templates/phases/identity.md
</execution_context>

<process>
## Step 1: Find brand

Scan `.design/branding/` for brand directories. If only one brand exists, use it. If multiple, ask the user which brand to work on.

Read:
- `.design/branding/{brand}/strategy/STRATEGY.md` — archetype, prism, positioning, values
- `.design/branding/{brand}/verbal/VERBAL.md` — voice attributes, tone spectrum (proceed without if not yet complete)
- `.design/branding/{brand}/BRIEF.md` — company, audience, inspiration

If STRATEGY.md doesn't exist, tell the user to run `/gsp:strategy` first.

## Step 2: Spawn identity designer

Spawn the `gsp-identity-designer` agent with:
- The full STRATEGY.md, VERBAL.md, and BRIEF.md content
- The Brand Identity Creator prompt (02)
- The identity output template

The agent should deliver:
1. **Logo System** — 3 directions with concept, strategic rationale (connecting to archetype + positioning), variations, usage rules
2. **Color System** — Full palette table (Hex, RGB, Pantone, CMYK) with strategic rationale per color, semantic colors, dark mode mapping, contrast ratios
3. **Typography** — Primary + secondary typefaces with rationale connecting to verbal tone, full type scale
4. **Imagery Style** — Photography, illustration, iconography guidelines
5. **Brand Applications** — Key touchpoints showing brand in use
6. **Brand Book Structure** — 20-page outline

## Step 3: Generate color palettes via tints.dev

For each brand color defined in the identity (primary, secondary, accent), generate a full 11-stop Tailwind palette using the [tints.dev](https://tints.dev) API by [Simeon Griggs](https://github.com/SimeonGriggs/tints.dev):

```
WebFetch: https://tints.dev/api/{colorName}/{hexWithout#}
```

Store the raw palettes in `.design/branding/{brand}/identity/palettes.json`:

```json
{
  "$schema": "tints.dev",
  "$generator": "https://tints.dev by Simeon Griggs (https://github.com/SimeonGriggs/tints.dev)",
  "primary": { "50": "oklch(...)", "100": "oklch(...)", ... "950": "oklch(...)" },
  "secondary": { ... },
  "accent": { ... }
}
```

## Step 4: Write output

Write the completed identity to `.design/branding/{brand}/identity/IDENTITY.md`.
Write the generated palettes to `.design/branding/{brand}/identity/palettes.json`.

## Step 4.5: Generate chunked exports

After writing IDENTITY.md and palettes.json, generate agent-consumable chunks:

1. Create chunks in `.design/branding/{brand}/exports/` following the structure defined in the `gsp-identity-designer` agent's `<chunked-exports>` section

Each chunk follows the standard chunk format (see `references/chunk-format.md`).

## Step 5: Update state

Update `.design/branding/{brand}/STATE.md`:
- Set Phase 4 (Identity) status to `complete`
- Record completion date
- Set Prettiness Level to 100%

## Step 6: Route next

Display identity summary and end with:

**If this is an E2E flow (brand + project):**
"Brand identity is complete! Now let's start the design project. Run `/gsp:new` to create a project using this brand."

**Otherwise:**
"Brand identity is complete! All 4 branding phases done. Run `/gsp:new` to create a design project using this brand, or `/gsp:progress` to review."
</process>
