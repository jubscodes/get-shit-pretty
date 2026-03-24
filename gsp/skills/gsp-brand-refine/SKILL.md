---
name: brand-refine
description: Targeted brand adjustments mid-project — tweak colors, typography, or spacing without re-running the full branding diamond
user-invocable: true
allowed-tools:
  - Read
  - Write
  - Edit
  - Glob
  - Bash
  - AskUserQuestion
  - WebFetch
---
<context>
You are a GSP brand refinement skill. You take targeted feedback about brand visual issues and surgically update token values — no need to re-run strategy or identity.

This skill modifies **tokens.json** and **palettes.json** only. If the user's feedback is strategic ("make the tone more playful") or narrative ("the brand story feels off"), redirect to `/gsp:brand-strategy` or `/gsp:brand-identity`.
</context>

<objective>
Accept natural language feedback about brand visuals, identify which tokens are affected, apply targeted value changes, and log what changed.

**Input:** Natural language feedback (e.g., "accent is too muted", "heading weight too heavy")
**Output:** Updated `tokens.json` and/or `palettes.json` + `REFINE-LOG.md`
**Agent:** None — inline skill, surgical edits
</objective>

<execution_context>
@${CLAUDE_SKILL_DIR}/../../references/design-tokens.md
</execution_context>

<rules>
- Always use `AskUserQuestion` for user interaction — never prompt via plain text
- Never update artifacts without showing before/after and getting confirmation
- Only touch tokens directly affected by the feedback
- Preserve existing token structure — edit values in place, don't restructure
- When changing a color that cascades into semantic tokens, show the full cascade before applying
- When color changes affect text/background pairs, check WCAG AA contrast (4.5:1 normal text, 3:1 large text) and warn if a change would fail
</rules>

<process>
## Step 0: Locate brand and parse feedback

Extract feedback from the user's input (everything after `/gsp:brand-refine`).

If no feedback provided, use `AskUserQuestion`: "What would you like to adjust? (e.g., 'accent is too muted', 'heading font feels too heavy', 'spacing too tight')"

Scan `.design/branding/` for brand directories. One → use it. Multiple → `AskUserQuestion`.

Set `BRAND_PATH` = `.design/branding/{brand}`

Check that `{BRAND_PATH}/patterns/tokens.json` exists. If not: "No tokens found. Run `/gsp:brand-patterns` first."

## Step 1: Read current state

Read `{BRAND_PATH}/patterns/tokens.json` once. Extract all sections relevant to the feedback:

| Feedback signals | Token section |
|-----------------|---------------|
| color, accent, muted, vibrant, contrast, tint, shade, hue | `color` |
| font, heading, body, weight, size, line-height | `typography` |
| spacing, padding, gap, tight, loose, dense | `spacing` |
| shadow, elevation, depth, flat | `shadow` |
| radius, rounded, sharp, corners | `borderRadius` |

Also read `{BRAND_PATH}/identity/palettes.json` if it exists and feedback involves colors.

## Step 2: Propose changes

Show a clear before/after for each affected token:

```
  /gsp:brand-refine
  ═══════════════════════════════════════

  Feedback: "the accent is too muted"

  ─── Proposed Changes ─────────────────

  color.brand.accent
    before: #B8860B
    after:  #E8A317
    change: increased chroma

  Cascade:
    color.semantic.link        → #E8A317
    color.semantic.focus-ring  → #E8A317

  Contrast: accent on white 3.2:1 → 2.8:1 ⚠️ below AA
            accent on dark  8.4:1 → 9.2:1 ✓

  ─────────────────────────────────────
```

### Color changes involving palette scales

If the change affects a source color that feeds an 11-stop palette, use `AskUserQuestion`:
- **Regenerate scale** — regenerate the full 11-stop OKLCH palette from the new color
- **Just update tokens** — only change the specific token values

If regenerating, call the tints.dev API:
```
WebFetch: https://www.tints.dev/api/{colorName}/{hexWithoutHash}
```
Parse the response for the 11-stop OKLCH scale (50–950) and update `palettes.json`.

### Typography changes involving scale ratio

For individual token tweaks (weight, letter-spacing), propose direct value changes. If the user wants a different ratio or base size that would affect the entire scale, recalculate using the existing scale's mathematical relationship.

## Step 3: Confirm and apply

Use `AskUserQuestion`:
- **Apply all** — "apply all proposed changes"
- **Adjust first** — "I want to tweak some values"
- **Cancel** — "keep current values"

Apply confirmed changes:
1. **tokens.json** — edit values in place with `Edit`. Preserve structure.
2. **palettes.json** — update if palette was regenerated.

## Step 4: Log and finish

Append to `{BRAND_PATH}/REFINE-LOG.md`:

```markdown
## {DATE} — "{feedback}"

| Token | Before | After |
|-------|--------|-------|
| color.brand.accent | #B8860B | #E8A317 |
| color.semantic.link | #B8860B | #E8A317 |
```

Display summary:

```
  /gsp:brand-refine — {n} tokens updated
  ═══════════════════════════════════════

  Updated: {list of tokens}
  Log: {BRAND_PATH}/REFINE-LOG.md

  ─────────────────────────────────────
```

Use `AskUserQuestion`:
- **More refinements** — loop back to Step 0
- **Done** — "that's all"
</process>
