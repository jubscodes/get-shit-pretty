---
name: gsp:research
description: Deep project research — UX patterns, competitor UX, technical approaches
allowed-tools:
  - Read
  - Write
  - Bash
  - Task
  - WebSearch
  - WebFetch
  - Grep
  - Glob
---
<context>
Phase 2 of the GSP project diamond. Deep research phase that investigates UX patterns, competitor experiences, technical approaches, accessibility strategies, and content patterns specific to what this project is building.

This is NOT brand-level discovery (that's `/gsp:brand-discover`). This is project-level research — focused on the product type, user flows, and implementation challenges.

Works with the dual-diamond architecture: reads brand context from `.design/branding/{brand}/` via `brand.ref`, reads/writes project assets in `.design/projects/{project}/`.
</context>

<objective>
Deep research into UX patterns, competitor experiences, and technical approaches for this project.

**Input:** Brief scope + brand system + project BRIEF.md
**Output:** `{project}/research/` (6 research chunks + INDEX.md)
**Agent:** `gsp-project-researcher`
</objective>

<execution_context>
@/Users/jubs/.claude/get-shit-pretty/prompts/12-project-researcher.md
@/Users/jubs/.claude/get-shit-pretty/templates/phases/research.md
</execution_context>

<process>
## Step 0: Resolve project and brand

Scan `.design/projects/` for project directories. If only one project exists, use it. If multiple, ask the user which project to work on.

Set `PROJECT_PATH` = `.design/projects/{project}`

Read `{PROJECT_PATH}/brand.ref` to resolve brand path:
- Set `BRAND_PATH` = `.design/branding/{brand}`

## Step 1: Load context

### Brief (chunk-first)

Read `{PROJECT_PATH}/brief/INDEX.md`. If it exists, load `scope.md` and `target-adaptations.md`.

If brief doesn't exist, tell the user to run `/gsp:brief` first.

### Brand system (selective)

Read `{BRAND_PATH}/system/INDEX.md`. If it exists, load foundation chunks (to understand the design system constraints).

### Brand discovery (selective)

Read `{BRAND_PATH}/discover/INDEX.md`. If it exists, load `competitive-audit.md` and `trend-analysis.md` (to avoid duplicating brand-level research).

### Project context

Read:
- `{PROJECT_PATH}/BRIEF.md` — what we're building, platforms, audience
- `{PROJECT_PATH}/config.json` — get `implementation_target`, `platform`, `tech_stack`

## Step 1.5: Scope check

**If `design_scope` is `tokens`:**
1. Update `{PROJECT_PATH}/STATE.md` — set Phase 2 (Research) status to `skipped`
2. Display: "Research phase skipped — design scope is `tokens`."
3. Route: "Run `/gsp:build`."
4. Stop here.

## Step 2: Spawn project researcher

Spawn the `gsp-project-researcher` agent with:
- Brief scope chunks
- Brand system foundation chunks
- Brand discovery chunks (competitive audit, trends — to build on, not duplicate)
- BRIEF.md
- config.json preferences
- The Project Researcher prompt (12)
- The research output template
- `implementation_target`, `platform`, `tech_stack`
- **Output path:** `{PROJECT_PATH}/research/`

The agent researches using WebSearch and writes chunks directly:
- `research/ux-patterns.md`
- `research/competitor-ux.md`
- `research/technical-research.md`
- `research/accessibility-patterns.md`
- `research/content-strategy.md`
- `research/reference-specs.md`
- `research/recommendations.md`
- `research/INDEX.md`

## Step 3: Update state

Update `{PROJECT_PATH}/STATE.md`:
- Set Phase 2 (Research) status to `complete`
- Record completion date

## Step 4: Route next

"Run `/gsp:design` to design screens informed by this research."
</process>
</output>
