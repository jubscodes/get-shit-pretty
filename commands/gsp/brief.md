---
name: gsp:brief
description: Project scoping — screen list, adaptations, gap analysis
allowed-tools:
  - Read
  - Write
  - Bash
  - Task
  - Grep
  - Glob
---
<context>
Phase 1 of the GSP project diamond. Scopes the project by determining what screens and components are needed, what adaptations the brand system requires for this specific project, and performs gap analysis against the codebase.

Encourages treating the project as a bounded issue (or set of issues) and a PR — ship small, ship complete.

Works with the dual-diamond architecture: reads brand system from `.design/branding/{brand}/system/` via `brand.ref`, reads/writes project assets in `.design/projects/{project}/`.
</context>

<objective>
Scope the project and plan adaptations from the brand system.

**Input:** Brand system (via brand.ref) + project BRIEF.md + config.json
**Output:** `{project}/brief/` (scope.md, target-adaptations.md, conditionals, INDEX.md)
**Agent:** `gsp-scoper`
</objective>

<execution_context>
@/Users/jubs/.claude/get-shit-pretty/prompts/10-project-scoper.md
@/Users/jubs/.claude/get-shit-pretty/templates/phases/brief.md
</execution_context>

<process>
## Step 0: Resolve project and brand

Scan `.design/projects/` for project directories. If only one project exists, use it. If multiple, ask the user which project to work on.

Set `PROJECT_PATH` = `.design/projects/{project}`

Read `{PROJECT_PATH}/brand.ref` to resolve brand path:
- Extract `brand` name and `path` from brand.ref
- Set `BRAND_PATH` = `.design/branding/{brand}`

If brand.ref doesn't exist, tell the user to run `/gsp:new` to set up the project with a brand reference.

## Step 1: Load context

### Brand system (chunk-first)

Read `{BRAND_PATH}/system/INDEX.md`. If it exists, load all foundation chunks + selective component chunks.

Fallback: read `{BRAND_PATH}/system/SYSTEM.md` (legacy monolith). Log: "⚠️ Legacy system format detected."

If neither exists, tell the user to run `/gsp:brand-system` first to create the brand's design system.

Also read `{BRAND_PATH}/system/tokens.json`.

### Project context

Read:
- `{PROJECT_PATH}/BRIEF.md` — what we're building, platforms, tech stack
- `{PROJECT_PATH}/config.json` — get `implementation_target`, `design_scope`, `codebase_type`

### Codebase context

Read `{PROJECT_PATH}/codebase/INVENTORY.md` (if exists) — existing tokens, components, architecture.

## Step 1.5: Scope check

**If `design_scope` is `tokens`:**
1. Update `{PROJECT_PATH}/STATE.md` — set Phase 1 (Brief) status to `skipped`
2. Display: "Brief phase skipped — design scope is `tokens`."
3. Route: "Run `/gsp:build`."
4. Stop here.

## Step 1.7: Issue framing

Suggest to the user:
"Consider framing this project as a bounded issue (or set of issues) and a PR. Smaller scope = higher quality. What's the tightest version of this that ships?"

If the project scope feels large, suggest breaking it into multiple bounded issues — each one a focused deliverable that can be reviewed independently.

## Step 2: Spawn scoper

Spawn the `gsp-scoper` agent with:
- Brand system chunks (or fallback)
- tokens.json
- BRIEF.md
- config.json preferences
- INVENTORY.md (when exists)
- The Project Scoper prompt (10)
- The brief output template
- `implementation_target`, `design_scope`, `codebase_type`
- **Output path:** `{PROJECT_PATH}/brief/`

The agent writes chunks directly:
- `brief/scope.md`
- `brief/target-adaptations.md`
- `brief/install-manifest.md` (shadcn/rn-reusables)
- `brief/gap-analysis.md` (existing target)
- `brief/file-references.md` (existing target)
- `brief/INDEX.md`

## Step 3: Update state

Update `{PROJECT_PATH}/STATE.md`:
- Set Phase 1 (Brief) status to `complete`
- Record completion date

## Step 4: Route next

"Run `/gsp:research` to research UX patterns, competitor experiences, and technical approaches for this project."
</process>
</output>
