---
name: gsp:launch
description: Create marketing campaign assets for launch
allowed-tools:
  - Read
  - Write
  - Bash
  - Task
  - WebSearch
---
<context>
Phase 6 of the GSP project diamond. Uses the Marketing Asset Factory prompt to create a full campaign asset library across channels.

Works with the dual-diamond architecture: reads brand identity from `.design/branding/{brand}/` via `brand.ref`, reads/writes project assets in `.design/projects/{project}/`.
</context>

<objective>
Create marketing campaign assets for product launch.

**Input:** Brand identity (via brand.ref) + `{project}/screens/SCREENS.md`
**Output:** `{project}/launch/CAMPAIGN.md`
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
1. Set Phase 6 (Launch) status to `skipped` in STATE.md
2. Display: "Launch phase skipped — tokens-only projects don't need marketing campaign assets."
3. Set Prettiness Level to 100%
4. **Stop here**

Read:
- `{BRAND_PATH}/identity/IDENTITY.md` — brand voice, visual identity
- `{BRAND_PATH}/verbal/VERBAL.md` — brand voice, messaging (if available)
- `{PROJECT_PATH}/screens/SCREENS.md` — product screens for showcase
- `{PROJECT_PATH}/BRIEF.md` — audience, goals
- `{PROJECT_PATH}/system/SYSTEM.md` — design system for consistency

If IDENTITY.md doesn't exist, tell the user to complete the brand identity first.

## Step 2: Spawn campaign director

Spawn the `gsp-campaign-director` agent with brand identity, verbal identity, screens, and brief. The Marketing Asset Factory prompt (04). The launch output template.

## Step 3: Write output

Write campaign to `{PROJECT_PATH}/launch/CAMPAIGN.md`.

## Step 3.5: Generate chunked exports

1. Create chunks in `{PROJECT_PATH}/launch/exports/`
2. Update `{PROJECT_PATH}/exports/INDEX.md`

## Step 4: Update state

Update `{PROJECT_PATH}/STATE.md`:
- Set Phase 6 (Launch) status to `complete`
- Record completion date
- Set Prettiness Level to 100%

## Step 5: Celebrate

Display campaign summary and:
```
🎨 Project is fully pretty! All 6 project phases complete.

Run /gsp:progress to see the full journey.
```
</process>
