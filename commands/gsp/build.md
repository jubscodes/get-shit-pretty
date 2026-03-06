---
name: gsp:build
description: Translate designs to production-ready frontend code
allowed-tools:
  - Read
  - Write
  - Bash
  - Task
---
<context>
Phase 5 of the GSP project diamond. Uses the Design-to-Code Translator prompt to convert implementation specs and design system into production-ready frontend components.

Works with the dual-diamond architecture: reads/writes project assets in `.design/projects/{project}/`.
</context>

<objective>
Translate designs into production-ready frontend code.

**Input:** `{project}/specs/SPECS.md` (or SCREENS.md + SYSTEM.md if spec skipped) + `{project}/system/SYSTEM.md`
**Output:** `{project}/build/CODE.md` + `{project}/build/components/`
**Agent:** `gsp-design-engineer`
</objective>

<execution_context>
@/Users/jubs/.claude/get-shit-pretty/prompts/09-design-to-code-translator.md
@/Users/jubs/.claude/get-shit-pretty/templates/phases/build.md
</execution_context>

<process>
## Step 0: Resolve project

Scan `.design/projects/` for project directories. If only one project exists, use it. If multiple, ask the user which project to work on.

Set `PROJECT_PATH` = `.design/projects/{project}`

## Step 1: Load context

Read `{PROJECT_PATH}/config.json` to get `implementation_target`, `design_scope`, `codebase_type`.

**Check for chunked exports:**
If `{PROJECT_PATH}/exports/INDEX.md` exists, chunked exports are available.

**When building a specific screen** (user specifies which) and chunks are available:
1. Read `{PROJECT_PATH}/exports/INDEX.md` — find chunk file paths
2. Load screen chunk: `{PROJECT_PATH}/screens/exports/screen-{NN}-{name}.md`
3. Load screen spec: `{PROJECT_PATH}/specs/exports/screens/screen-{NN}-spec.md`
4. Load referenced component chunks from `{PROJECT_PATH}/system/exports/components/`
5. Load `{PROJECT_PATH}/specs/exports/token-mapping.md`
6. Load `{PROJECT_PATH}/specs/exports/install-manifest.md` (shadcn/rn-reusables)
6b. Load `{PROJECT_PATH}/specs/exports/gap-analysis.md` + `file-references.md` (existing target)
6c. Load `{PROJECT_PATH}/codebase/INVENTORY.md` (when exists)
7. Load `{PROJECT_PATH}/system/tokens.json`
8. Read `{PROJECT_PATH}/BRIEF.md` — tech stack preference
9. Load `{PROJECT_PATH}/review/exports/review-fixes.md` (if available)

**When building all screens** (or no chunks available):
Read full monolith files from `{PROJECT_PATH}/`.

If SPECS.md doesn't exist, check if `implementation_target` is `skip`:
- **If `skip`:** Read SCREENS.md + SYSTEM.md as primary input
- **If not `skip`:** Tell the user to run `/gsp:spec` first

## Step 2: Spawn design engineer

Spawn the `gsp-design-engineer` agent with all specs/screens, system, and token files, the Design-to-Code Translator prompt (09), build output template, target tech stack, implementation_target, design_scope, and codebase inventory.

**When `design_scope` is `tokens`:**
- Output token files only
- Skip component code generation

## Step 3: Write output

1. Write implementation guide to `{PROJECT_PATH}/build/CODE.md`
2. Write individual components to `{PROJECT_PATH}/build/components/`

## Step 4: Update state

Update `{PROJECT_PATH}/STATE.md`:
- Set Phase 5 (Build) status to `complete`
- Record completion date

## Step 5: Route next

"Run `/gsp:launch` to create marketing campaign assets."
</process>
