---
name: gsp:design
description: Design UI/UX screens, flows, and interaction patterns
allowed-tools:
  - Read
  - Write
  - Bash
  - Task
  - Grep
  - Glob
---
<context>
Phase 3 of the GSP project diamond. Uses the UI/UX Pattern Master prompt to design core screens following Apple HIG and the brand's design system.

Works with the dual-diamond architecture: reads brand system from `.design/branding/{brand}/system/` via `brand.ref`, reads/writes project assets in `.design/projects/{project}/`.
</context>

<objective>
Design core UI/UX screens and interaction flows.

**Input:** Research + brief + brand system + project BRIEF.md
**Output:** `{project}/design/` (screen chunks + shared/ + INDEX.md) + exports/INDEX.md update
**Agent:** `gsp-designer`
</objective>

<execution_context>
@/Users/jubs/.claude/get-shit-pretty/prompts/03-ui-ux-pattern-master.md
@/Users/jubs/.claude/get-shit-pretty/templates/phases/design.md
@/Users/jubs/.claude/get-shit-pretty/references/apple-hig-patterns.md
</execution_context>

<process>
## Step 0: Resolve project and brand

Scan `.design/projects/` for project directories. If only one project exists, use it. If multiple, ask the user which project to work on.

Set `PROJECT_PATH` = `.design/projects/{project}`

Read `{PROJECT_PATH}/brand.ref` to resolve brand path:
- Set `BRAND_PATH` = `.design/branding/{brand}`

## Step 1: Load context

Read `{PROJECT_PATH}/config.json` — get `implementation_target`, `design_scope`.
Read `{PROJECT_PATH}/BRIEF.md` — app type, audience, goals.

### Brand system (chunk-first)

Read `{BRAND_PATH}/system/INDEX.md`. If it exists, load all foundation chunks + selective component chunks.

Fallback: read `{BRAND_PATH}/system/SYSTEM.md` (legacy monolith). Log: "⚠️ Legacy system format detected — consider re-running /gsp:brand-system for chunk output."

If neither exists, tell the user to run `/gsp:brand-system` first.

### Brand context (selective)

Read `{BRAND_PATH}/identity/INDEX.md`. If it exists, load `color-system.md` and `typography.md`.
Fallback: read `{BRAND_PATH}/identity/IDENTITY.md`.

### Brief (chunk-first)

Read `{PROJECT_PATH}/brief/INDEX.md`. If it exists, load `scope.md` and `target-adaptations.md`.

If brief doesn't exist, proceed without it (brief is informative, not blocking).

### Research (chunk-first)

Read `{PROJECT_PATH}/research/INDEX.md`. If it exists, load `ux-patterns.md`, `recommendations.md`, and `reference-specs.md`.

If research doesn't exist, proceed without it (research is informative, not blocking).

## Step 1.5: Scope check

**If `design_scope` is `tokens`:**
1. Update `{PROJECT_PATH}/STATE.md` — set Phase 3 (Design) status to `skipped`
2. Display: "Design phase skipped — design scope is `tokens`."
3. Route: "Run `/gsp:build`."
4. Stop here.

**If `design_scope` is `partial`:**
Read BRIEF.md "Target screens" to get the specific screen list.

## Step 2: Load existing components inventory

When `implementation_target` is not `figma`:
- **If `{PROJECT_PATH}/codebase/INVENTORY.md` exists**, read it. Pass to the agent.
- **If not**, fall back to scanning the codebase.

## Step 3: Spawn designer

Spawn the `gsp-designer` agent with all prior artifacts, the UI/UX Pattern Master prompt (03), design output template, Apple HIG patterns reference, implementation_target, design_scope, target screens (when partial), and existing components inventory.

**Output path:** `{PROJECT_PATH}/design/`

The agent writes chunks directly:
- `design/screen-{NN}-{name}.md` (one per screen)
- `design/shared/` (personas, IA, navigation, micro-interactions, responsive, component-plan)
- `design/INDEX.md`
- Updates `{PROJECT_PATH}/exports/INDEX.md` (design section)

## Step 4: Update state

Update `{PROJECT_PATH}/STATE.md`:
- Set Phase 3 (Design) status to `complete`
- Record completion date

## Step 5: Route next

"Run `/gsp:critique` for design critique and accessibility audit."
</process>
</output>
