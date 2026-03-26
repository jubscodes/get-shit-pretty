---
name: launch
description: Create launch and marketing assets
user-invocable: true
model: opus
effort: high
context: fork
allowed-tools:
  - Read
  - Write
  - Bash
  - Agent
  - WebSearch
---
<context>
Optional GSP project phase. Uses the Marketing Asset Factory prompt to create a full campaign asset library across channels. Not a mandatory phase — run when needed.

Works with the dual-diamond architecture: reads brand identity from `.design/branding/{brand}/` via `brand.ref`, reads/writes project assets in `.design/projects/{project}/`.
</context>

<objective>
Create marketing campaign assets for product launch.

**Input:** Brand identity + strategy/voice-and-tone.md + strategy/messaging.md + screen chunks
**Output:** `{project}/launch/` (6 chunks + INDEX.md) + exports/INDEX.md update
**Agent:** `gsp-campaign-director`
</objective>

<execution_context>
@${CLAUDE_SKILL_DIR}/../../prompts/04-marketing-asset-factory.md
@${CLAUDE_SKILL_DIR}/../../templates/phases/launch.md
</execution_context>

<process>
## Step 0: Resolve project and brand

Resolve project from `.design/projects/` (one → use it, multiple → ask). Set `PROJECT_PATH`.

Read `{PROJECT_PATH}/brand.ref` → set `BRAND_PATH`.

## Step 1: Load context

Read `{PROJECT_PATH}/config.json` to get `design_scope`.

**If `design_scope` is `tokens`:**
1. Display: "Launch phase skipped — tokens-only projects don't need marketing campaign assets."
2. **Stop here**

### Identity (selective, chunk-first)

Read `{BRAND_PATH}/identity/INDEX.md`. If it exists, load all identity chunks.

If it doesn't exist, tell the user to complete the brand identity first.

### Voice and Messaging (from strategy)

Read `{BRAND_PATH}/strategy/voice-and-tone.md` and `{BRAND_PATH}/strategy/messaging.md`.

### Design (chunk-first)

Read `{PROJECT_PATH}/design/INDEX.md`. If it exists, load all screen chunks.

### Other

Read `{PROJECT_PATH}/BRIEF.md` — audience, goals.

## Step 2: Spawn campaign director

Spawn the `gsp-campaign-director` agent. **Inline all content** — the agent should not need to read any input files.

Pass in the agent prompt:
- **Content of** all identity chunks (loaded in Step 1)
- **Content of** strategy voice-and-tone.md + messaging.md (loaded in Step 1)
- **Content of** all design screen chunks (loaded in Step 1)
- **Content of** BRIEF.md (loaded in Step 1)
- The Marketing Asset Factory prompt (04), launch output template (from execution_context)
- **Output path:** `{PROJECT_PATH}/launch/`

The agent writes chunks directly:
- `launch/campaign-strategy.md`
- `launch/digital-ads.md`
- `launch/email-sequences.md`
- `launch/landing-page.md`
- `launch/social-media.md`
- `launch/sales-content.md`
- `launch/INDEX.md`
- Updates `{PROJECT_PATH}/exports/INDEX.md` (launch section)

## Step 3: Update state

Update `{PROJECT_PATH}/STATE.md`:
- Add Launch status to `complete` under the Launch section
- Record completion date

## Step 4: Phase transition output

Render phase transition (see `references/phase-transitions.md`). This is the final phase.
</process>
