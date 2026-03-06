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
Phase 5 of the GSP project diamond. Uses the Design-to-Code Translator prompt to convert design, research, and brief into production-ready frontend components.

Works with the dual-diamond architecture: reads brand system from `.design/branding/{brand}/system/` via `brand.ref`, reads/writes project assets in `.design/projects/{project}/`.
</context>

<objective>
Translate designs into production-ready frontend code.

**Input:** Design chunks + research chunks + brief chunks + brand system chunks
**Output:** `{project}/build/CODE.md` + `{project}/build/components/`
**Agent:** `gsp-builder`
</objective>

<execution_context>
@/Users/jubs/.claude/get-shit-pretty/prompts/09-design-to-code-translator.md
@/Users/jubs/.claude/get-shit-pretty/templates/phases/build.md
</execution_context>

<process>
## Step 0: Resolve project and brand

Scan `.design/projects/` for project directories. If only one project exists, use it. If multiple, ask the user which project to work on.

Set `PROJECT_PATH` = `.design/projects/{project}`

Read `{PROJECT_PATH}/brand.ref` to resolve brand path:
- Set `BRAND_PATH` = `.design/branding/{brand}`

## Step 1: Load context

Read `{PROJECT_PATH}/config.json` to get `implementation_target`, `design_scope`, `codebase_type`.

**When building a specific screen** (user specifies which) and chunks are available:
1. Read `{PROJECT_PATH}/exports/INDEX.md` — find chunk file paths
2. Load screen chunk: `{PROJECT_PATH}/design/screen-{NN}-{name}.md`
3. Load referenced component chunks from `{BRAND_PATH}/system/components/`
4. Load `{PROJECT_PATH}/brief/target-adaptations.md`
5. Load `{PROJECT_PATH}/brief/install-manifest.md` (shadcn/rn-reusables)
5b. Load `{PROJECT_PATH}/brief/gap-analysis.md` + `file-references.md` (existing target)
5d. Load `{PROJECT_PATH}/research/reference-specs.md` (if exists)
5e. Load `{PROJECT_PATH}/research/technical-research.md` (if exists)
5c. Load `{PROJECT_PATH}/codebase/INVENTORY.md` (when exists)
6. Load `{BRAND_PATH}/system/tokens.json`
7. Read `{PROJECT_PATH}/BRIEF.md` — tech stack preference
8. Load `{PROJECT_PATH}/critique/prioritized-fixes.md` (if available)

**When building all screens** (or no chunks available):
Read full monolith files from `{PROJECT_PATH}/` as fallback. Log: "⚠️ Legacy format detected — consider re-running phases for chunk output."

If design doesn't exist (no INDEX.md in design/), tell the user to run `/gsp:design` first.

## Step 2: Spawn builder

Spawn the `gsp-builder` agent with all design, plan, system, and token files, the Design-to-Code Translator prompt (09), build output template, target tech stack, implementation_target, design_scope, and codebase inventory.

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

"Run `/gsp:review` to validate built deliverables against design intent."
</process>
</output>
