---
name: gsp-brand-sync
description: Sync brand to match a project's shipped state — tokens, voice, visual patterns, personality
user-invocable: true
allowed-tools:
  - Read
  - Write
  - Edit
  - Bash
  - Glob
  - Grep
  - AskUserQuestion
---
<context>
Standalone brand feedback skill. After a project ships (or mid-development), the codebase and content may have diverged from the brand system — adjusted colors, shifted tone of voice, evolved visual patterns. This skill detects those divergences across all brand dimensions and updates the brand to match.

This is the standalone version of the feedback loop built into `/gsp-project-build` (build-time). Use this when:
- A project evolved beyond its original brand during development
- Manual tweaks were made post-build
- The voice/tone landed differently than the strategy specified
- You want to capture a project's shipped look and feel as the new brand baseline
</context>

<objective>
Compare a project's shipped state against its source brand across all dimensions — tokens, voice, visual patterns, and personality — surface divergences, and update the brand if confirmed.

**Input:** A project with a linked brand (via project config or `.design/branding/`)
**Output:** Updated brand tokens, strategy chunks, identity chunks, and style preset (as applicable)
</objective>

<execution_context>
@${CLAUDE_SKILL_DIR}/chunk-format.md
</execution_context>

<rules>
- Always use `AskUserQuestion` for user interaction — never prompt via plain text
- One decision per question — never batch multiple questions in a single message
- Never update the brand without explicit user confirmation
- Show before/after for every change — no silent updates
- Only update dimensions that actually diverged — don't regenerate the entire brand
</rules>

<process>
## Step 0: Resolve brand and project

Resolve brand from `.design/branding/` (one → use it, multiple → ask). Set `BRAND_PATH`.
Check that the brand has at least one of: `patterns/{brand-name}.yml`, `strategy/`, `identity/`. If none exist, tell the user: "No brand system found. Run `/gsp-brand-guidelines` first."

Verify the project codebase has shipped output — source files with components, copy, or styles.

## Step 1: Analyze divergences

```bash
mkdir -p {BRAND_PATH}/sync
```

Run 4-dimension analysis directly. Read brand files first: `{BRAND_PATH}/patterns/{brand-name}.yml`, strategy chunks, identity chunks.

### Dimension 1: Token diff (quantitative)

Grep for token values in: `tailwind.config.*` (`theme.extend`), CSS custom properties in globals/variables/theme CSS, theme/token JS/TS files, hardcoded values in components. Compare each against brand `.yml`. Classify: **Changed** (value differs), **Added** (in project, not brand), **Removed** (in brand, not project). Skip equivalents and framework defaults.

### Dimension 2: Voice & tone (qualitative)

Read `{BRAND_PATH}/strategy/voice-and-tone.md` for attributes and tone spectrum. Grep project for user-facing strings — headings, button labels, error states, tooltips, onboarding, meta content. Sample 10-15 representative strings. Assess each voice attribute: does copy match? Note drift direction ("more casual", "more technical"). Flag new patterns not in spec.

### Dimension 3: Visual patterns (qualitative)

Read brand foundations and identity chunks. Glob/Grep components for layout patterns, component styling (radius, shadow, states), color application, typography hierarchy, imagery, motion. Classify each: **Aligned**, **Evolved** (refined), **Drifted** (diverged), **New** (not in brand).

### Dimension 4: Personality (qualitative)

Read `{BRAND_PATH}/strategy/archetype.md` and `positioning.md`. Assess holistically: does the product feel like the archetype? Has positioning shifted? Are shadow traits showing? Classify: **On-brand**, **Shifted** (name direction), **Stronger**. Connect evidence from dimensions 1-3.

### Quality standards

- Token divergences: exact values (brand vs project)
- Voice/visual assessments: cite file:line evidence
- Personality: connect to specific patterns from other dimensions
- Only flag genuine divergences, not noise

### Write report

Write `SYNC-REPORT.md` to `{BRAND_PATH}/sync/` with this structure:

```markdown
# Brand Sync Report
> Brand: {name} | Project: {directory} | Generated: {DATE}

## Tokens
| Token | Brand Value | Project Value | Status |
|-------|------------|---------------|--------|

**Summary:** {N} changed · {N} added · {N} removed

## Voice & Tone
### Divergences
- **{attribute}** — {aligned|drifted|new}
  - Brand: "{spec}" | Project: "{reality}" | Direction: {drift}
  - Evidence: {file:line}
### Overall: {N}/{N} attributes aligned

## Visual Patterns
### Divergences
- **{pattern}** — {aligned|evolved|drifted|new}
  - Brand: "{spec}" | Project: "{reality}"
  - Evidence: {file:line}

## Personality
- **Archetype:** {on-brand|shifted|stronger} — {assessment + evidence}
- **Positioning:** {holds|shifted} — {assessment if shifted}

## Update Map
| Dimension | File to Update | Change |
|-----------|---------------|--------|
```

## Step 2: Present findings

Read `{BRAND_PATH}/sync/SYNC-REPORT.md`. Present a compact summary per dimension, then use `AskUserQuestion`:

- **Sync all** — update brand across all dimensions
- **Tokens only** — just sync the quantitative token changes
- **Pick by dimension** — choose which dimensions to sync
- **Review each** — walk through every divergence individually
- **Refine manually** — run `/gsp-brand-refine` to make targeted token adjustments instead
- **Skip** — don't update the brand

If "Pick by dimension", ask per dimension. If "Review each", walk through the Update Map from the report.

For "Removed" tokens: ask whether to remove from brand or keep (may be used by other projects).

## Step 3: Apply confirmed updates

Use the Update Map from the sync report. For each confirmed change:

**Tokens** — edit the brand `.yml` preset in place. Regenerate affected STYLE.md sections if they exist.

**Voice & tone** — update `{BRAND_PATH}/strategy/voice-and-tone.md` (adjust attributes, tone positions, style rules). Update `messaging.md` if messaging shifted.

**Visual patterns** — update the brand `.yml` patterns/constraints/effects blocks. Update component specs in `{BRAND_PATH}/patterns/components/` and identity chunks if visual identity evolved.

**Personality** — update `{BRAND_PATH}/strategy/archetype.md` and `positioning.md`. Update `brand-platform.md` if values/promise shifted.

Preserve chunk format per `chunk-format.md`. Update INDEX.md files if chunks were added.

## Step 4: Summary

Show which files were updated per dimension, then use `AskUserQuestion`: "Brand synced to project. Other projects using this brand will inherit these changes on their next build."

</process>
