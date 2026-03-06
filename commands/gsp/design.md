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
Phase 2 of the GSP project diamond. Uses the UI/UX Pattern Master prompt to design core screens following Apple HIG and the project's design system.

Works with the dual-diamond architecture: reads brand context from `.design/branding/{brand}/` via `brand.ref`, reads/writes project assets in `.design/projects/{project}/`.
</context>

<objective>
Design core UI/UX screens and interaction flows.

**Input:** `{project}/system/SYSTEM.md` + `{project}/BRIEF.md`
**Output:** `{project}/screens/SCREENS.md` + exports
**Agent:** `gsp-ui-designer`
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

Read:
- `{PROJECT_PATH}/BRIEF.md` — app type, audience, goals
- `{PROJECT_PATH}/system/SYSTEM.md` — design system to use
- `{BRAND_PATH}/identity/IDENTITY.md` — brand personality
- `{PROJECT_PATH}/config.json` — get `implementation_target`, `design_scope`

If SYSTEM.md doesn't exist, tell the user to run `/gsp:system` first.

## Step 1.5: Scope check

**If `design_scope` is `tokens`:**
1. Update `{PROJECT_PATH}/STATE.md` — set Phase 2 (Design) status to `skipped`
2. Display: "Design phase skipped — design scope is `tokens`."
3. Route: "Run `/gsp:review`."
4. Stop here.

**If `design_scope` is `partial`:**
Read BRIEF.md "Target screens" to get the specific screen list.

## Step 2: Load existing components inventory

When `implementation_target` is not `figma`:
- **If `{PROJECT_PATH}/codebase/INVENTORY.md` exists**, read it. Pass to the agent.
- **If not**, fall back to scanning the codebase.

## Step 3: Spawn UI designer

Spawn the `gsp-ui-designer` agent with all prior artifacts, the UI/UX Pattern Master prompt (03), design output template, Apple HIG patterns reference, implementation_target, design_scope, target screens (when partial), and existing components inventory.

The agent should deliver:
1. User personas
2. Information architecture
3. Navigation pattern and gestures
4. Core screens (8 for full, target list for partial) with all states
5. Accessibility specs
6. Micro-interactions and animations
7. Responsive behavior
8. Component Plan (when target is not figma)
9. Designer's notes

## Step 4: Write output

Write screens to `{PROJECT_PATH}/screens/SCREENS.md`.

## Step 4.5: Generate chunked exports

1. Create `{PROJECT_PATH}/screens/exports/screen-{NN}-{name}.md` per screen
2. Create `{PROJECT_PATH}/screens/exports/shared/` with global sections
3. Update `{PROJECT_PATH}/exports/INDEX.md`

## Step 5: Update state

Update `{PROJECT_PATH}/STATE.md`:
- Set Phase 2 (Design) status to `complete`
- Record completion date

## Step 6: Route next

**When `implementation_target` is `skip`:**
"Run `/gsp:review` for design critique and accessibility audit."

**Otherwise:**
"Run `/gsp:spec` to generate implementation specifications."
</process>
