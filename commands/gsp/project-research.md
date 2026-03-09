---
name: gsp:project-research
description: Research UX patterns and technical approaches
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

This is NOT brand-level discovery (that's `/gsp:brand-research`). This is project-level research — focused on the product type, user flows, and implementation challenges.

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

If brief doesn't exist, tell the user to run `/gsp:project-brief` first.

### Brand system (selective)

Read `{BRAND_PATH}/system/INDEX.md`. If it exists, load foundation chunks (to understand the design system constraints).

### Brand discovery (selective)

Read `{BRAND_PATH}/discover/INDEX.md`. If it exists, load `competitive-audit.md` and `trend-analysis.md` (to avoid duplicating brand-level research).

### Custom references

If `{PROJECT_PATH}/references/INDEX.md` exists, load relevant references (competitor screenshots, brand guidelines, design specs). Pass to the researcher agent for context.

### Project context

Read:
- `{PROJECT_PATH}/BRIEF.md` — what we're building, platforms, audience
- `{PROJECT_PATH}/config.json` — get `implementation_target`, `platform`, `tech_stack`

## Step 1.5: Scope check

**If `design_scope` is `tokens`:**
1. Update `{PROJECT_PATH}/STATE.md` — set Phase 2 (Research) status to `skipped`
2. Display: "Research phase skipped — design scope is `tokens`."
3. Route: "Run `/gsp:project-build`."
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

## Step 2.5: Write exports

Update `{PROJECT_PATH}/exports/INDEX.md`:
- If INDEX.md doesn't exist, copy it from `templates/exports-index.md`
- Replace everything between `<!-- BEGIN:research -->` and `<!-- END:research -->` with populated table:

```markdown
<!-- BEGIN:research -->
| Section | File |
|---------|------|
| UX Patterns | [ux-patterns.md](../research/ux-patterns.md) |
| Competitor UX | [competitor-ux.md](../research/competitor-ux.md) |
| Technical Research | [technical-research.md](../research/technical-research.md) |
| Accessibility Patterns | [accessibility-patterns.md](../research/accessibility-patterns.md) |
| Content Strategy | [content-strategy.md](../research/content-strategy.md) |
| Reference Specs | [reference-specs.md](../research/reference-specs.md) |
| Recommendations | [recommendations.md](../research/recommendations.md) |
<!-- END:research -->
```

## Step 3: Update state

Update `{PROJECT_PATH}/STATE.md`:
- Set Phase 2 (Research) status to `complete`
- Record completion date

## Step 4: Phase transition output

Render the phase transition screen (see `references/phase-transitions.md` for ANSI color tokens):

```
  ◆ research complete — patterns and approaches researched

    research/
    ├── {actual files written}
    └── INDEX.md

  ──────────────────────────────
```

Then use `AskUserQuestion` with 3 options:
- **Continue to design** — "design screens and flows"
- **View progress** — "see the full dashboard"
- **Done for now** — "pick up later with /gsp:start"
</process>
</output>
