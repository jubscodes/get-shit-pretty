---
name: brand-sync
description: Sync brand to match a project's shipped state — tokens, voice, visual patterns, personality
user-invocable: true
allowed-tools:
  - Read
  - Write
  - Edit
  - Bash
  - Agent
  - Glob
  - Grep
  - AskUserQuestion
---
<context>
Standalone brand feedback skill. After a project ships (or mid-development), the codebase and content may have diverged from the brand system — adjusted colors, shifted tone of voice, evolved visual patterns. This skill detects those divergences across all brand dimensions and updates the brand to match.

This is the standalone version of the feedback loop built into `/gsp:project-build` (build-time). Use this when:
- A project evolved beyond its original brand during development
- Manual tweaks were made post-build
- The voice/tone landed differently than the strategy specified
- You want to capture a project's shipped look and feel as the new brand baseline
</context>

<objective>
Compare a project's shipped state against its source brand across all dimensions — tokens, voice, visual patterns, and personality — surface divergences, and update the brand if confirmed.

**Input:** A project with a linked brand (via project config or `.design/branding/`)
**Output:** Updated brand tokens, strategy chunks, identity chunks, and style preset (as applicable)
**Agent:** `gsp-brand-syncer`
</objective>

<execution_context>
@${CLAUDE_SKILL_DIR}/../../references/design-tokens.md
@${CLAUDE_SKILL_DIR}/../../references/chunk-format.md
</execution_context>

<rules>
- Always use `AskUserQuestion` for user interaction — never prompt via plain text
- Never update the brand without explicit user confirmation
- Show before/after for every change — no silent updates
- Only update dimensions that actually diverged — don't regenerate the entire brand
</rules>

<process>
## Step 0: Resolve brand and project

Scan `.design/branding/` for brand directories. One brand → use it. Multiple → use `AskUserQuestion`.

Set `BRAND_PATH` = `.design/branding/{brand}`

Check that the brand has at least one of: `patterns/tokens.json`, `strategy/`, `identity/`. If none exist, tell the user: "No brand system found. Run `/gsp:brand-patterns` first."

Verify the project codebase has shipped output — source files with components, copy, or styles.

## Step 1: Spawn syncer agent

```bash
mkdir -p {BRAND_PATH}/sync
```

Spawn the `gsp-brand-syncer` agent with:
- `BRAND_PATH` and all available brand files (tokens.json, strategy chunks, identity chunks, foundation chunks)
- Project codebase location (working directory)
- **Output path:** `{BRAND_PATH}/sync/`

The agent writes `SYNC-REPORT.md` with divergences across four dimensions: tokens, voice & tone, visual patterns, personality. Each divergence includes evidence (file paths, line numbers, before/after values).

## Step 2: Present findings

Read `{BRAND_PATH}/sync/SYNC-REPORT.md`. Present a compact summary per dimension, then use `AskUserQuestion`:

- **Sync all** — update brand across all dimensions
- **Tokens only** — just sync the quantitative token changes
- **Pick by dimension** — choose which dimensions to sync
- **Review each** — walk through every divergence individually
- **Skip** — don't update the brand

If "Pick by dimension", ask per dimension. If "Review each", walk through the Update Map from the report.

For "Removed" tokens: ask whether to remove from brand or keep (may be used by other projects).

## Step 3: Apply confirmed updates

Use the Update Map from the sync report. For each confirmed change:

**Tokens** — edit `tokens.json` in place (preserve W3C structure). Update corresponding foundation chunks in `{BRAND_PATH}/patterns/foundations/` and style preset `.yml` if it exists.

**Voice & tone** — update `{BRAND_PATH}/strategy/voice-and-tone.md` (adjust attributes, tone positions, style rules). Update `messaging.md` if messaging shifted.

**Visual patterns** — update foundation chunks in `{BRAND_PATH}/patterns/foundations/`. Update component specs and identity chunks if visual identity evolved.

**Personality** — update `{BRAND_PATH}/strategy/archetype.md` and `positioning.md`. Update `brand-platform.md` if values/promise shifted.

Preserve chunk format per `references/chunk-format.md`. Update INDEX.md files if chunks were added.

## Step 4: Summary

Show which files were updated per dimension, then use `AskUserQuestion`: "Brand synced to project. Other projects using this brand will inherit these changes on their next build."

</process>
