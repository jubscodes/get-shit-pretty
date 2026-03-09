---
name: gsp:launch
description: Create launch and marketing assets
allowed-tools:
  - Read
  - Write
  - Bash
  - Task
  - WebSearch
---
<context>
Optional GSP project phase. Uses the Marketing Asset Factory prompt to create a full campaign asset library across channels. Not a mandatory phase — run when needed.

Works with the dual-diamond architecture: reads brand identity from `.design/branding/{brand}/` via `brand.ref`, reads/writes project assets in `.design/projects/{project}/`.
</context>

<objective>
Create marketing campaign assets for product launch.

**Input:** Brand identity + verbal chunks (selective) + screen chunks
**Output:** `{project}/launch/` (6 chunks + INDEX.md) + exports/INDEX.md update
**Agent:** `gsp-campaign-director`
</objective>

<execution_context>
@/Users/jubs/.claude/get-shit-pretty/prompts/04-marketing-asset-factory.md
@/Users/jubs/.claude/get-shit-pretty/templates/phases/launch.md
</execution_context>

<process>
## Step 0: Resolve project and brand

Scan `.design/projects/` for project directories. If only one project exists, use it. If multiple, ask the user which project to work on.

Set `PROJECT_PATH` = `.design/projects/{project}`

Read `{PROJECT_PATH}/brand.ref` to resolve brand path:
- Set `BRAND_PATH` = `.design/branding/{brand}`

## Step 1: Load context

Read `{PROJECT_PATH}/config.json` to get `design_scope`.

**If `design_scope` is `tokens`:**
1. Display: "Launch phase skipped — tokens-only projects don't need marketing campaign assets."
2. **Stop here**

### Identity (selective, chunk-first)

Read `{BRAND_PATH}/identity/INDEX.md`. If it exists, load all identity chunks.
Fallback: read `{BRAND_PATH}/identity/IDENTITY.md`. Log: "⚠️ Legacy identity format detected."

If neither exists, tell the user to complete the brand identity first.

### Verbal (selective, chunk-first)

Read `{BRAND_PATH}/verbal/INDEX.md`. If it exists, load selective chunks (brand-voice, messaging-matrix, brand-narrative).
Fallback: read `{BRAND_PATH}/verbal/VERBAL.md`.

### Design (chunk-first)

Read `{PROJECT_PATH}/design/INDEX.md`. If it exists, load all screen chunks.
Fallback: read `{PROJECT_PATH}/screens/INDEX.md` (legacy path).

### Other

Read `{PROJECT_PATH}/BRIEF.md` — audience, goals.

## Step 2: Spawn campaign director

Spawn the `gsp-campaign-director` agent with identity chunks, verbal chunks, screen chunks, and brief. The Marketing Asset Factory prompt (04). The launch output template.

**Output path:** `{PROJECT_PATH}/launch/`

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

## Step 4: Done

Display campaign summary and:
"Launch assets complete! Run `/gsp:progress` to see the full journey."
</process>
