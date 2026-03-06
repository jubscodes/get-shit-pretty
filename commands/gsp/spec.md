---
name: gsp:spec
description: Generate implementation specifications — map design to your UI framework
allowed-tools:
  - Read
  - Write
  - Bash
  - Task
  - Grep
  - Glob
---
<context>
Phase 3 of the GSP project diamond. Converts screen designs into implementation specifications tailored to the project's UI framework.

Works with the dual-diamond architecture: reads/writes project assets in `.design/projects/{project}/`.
</context>

<objective>
Generate implementation specifications from screen designs.

**Input:** `{project}/screens/SCREENS.md` + `{project}/system/SYSTEM.md` + `{project}/config.json`
**Output:** `{project}/specs/SPECS.md` + exports
**Agent:** `gsp-spec-engineer`
</objective>

<execution_context>
@/Users/jubs/.claude/get-shit-pretty/prompts/05-implementation-spec-expert.md
@/Users/jubs/.claude/get-shit-pretty/templates/phases/spec.md
</execution_context>

<process>
## Step 0: Resolve project

Scan `.design/projects/` for project directories. If only one project exists, use it. If multiple, ask the user which project to work on.

Set `PROJECT_PATH` = `.design/projects/{project}`

## Step 1: Load context

Read:
- `{PROJECT_PATH}/config.json` — get `implementation_target`, `design_scope`
- `{PROJECT_PATH}/screens/SCREENS.md` — screen designs
- `{PROJECT_PATH}/system/SYSTEM.md` — design system
- `{PROJECT_PATH}/system/tokens.json` — token values

If SCREENS.md doesn't exist, tell the user to run `/gsp:design` first.

## Step 2: Check for skip

If `implementation_target` is `skip` OR `design_scope` is `tokens`:
1. Update `{PROJECT_PATH}/STATE.md` — set Phase 3 (Spec) status to `skipped`
2. Display: "Spec phase skipped."
3. Route: "Run `/gsp:review`."
4. Stop here.

## Step 3: Gather target context

**If `{PROJECT_PATH}/codebase/INVENTORY.md` exists**, read it and pass as target context.

**If not**, fall back to scanning the codebase based on implementation_target.

## Step 4: Spawn spec engineer

Spawn the `gsp-spec-engineer` agent with SCREENS.md, SYSTEM.md, tokens.json, Implementation Spec Expert prompt (05), spec output template, implementation_target, and target-specific context.

## Step 5: Write output

Write specs to `{PROJECT_PATH}/specs/SPECS.md`.

## Step 5.5: Generate chunked exports

1. Create `{PROJECT_PATH}/specs/exports/` with component-mapping, token-mapping, install-manifest (or gap-analysis + file-references)
2. Create `{PROJECT_PATH}/specs/exports/screens/screen-{NN}-spec.md` per screen
3. Update `{PROJECT_PATH}/exports/INDEX.md`

## Step 6: Update state

Update `{PROJECT_PATH}/STATE.md`:
- Set Phase 3 (Spec) status to `complete`
- Record completion date

## Step 7: Route next

"Run `/gsp:review` for design critique and accessibility audit."
</process>
