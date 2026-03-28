---
name: gsp-project-research
description: Research UX patterns and technical approaches
user-invocable: true
model: sonnet
effort: high
allowed-tools:
  - Read
  - Write
  - Bash
  - Agent
  - WebSearch
  - WebFetch
  - Grep
  - Glob
---
<context>
Phase 2 of the GSP project diamond. Deep research phase that investigates UX patterns, competitor experiences, technical approaches, accessibility strategies, and content patterns specific to what this project is building.

This is NOT brand-level discovery (that's `/gsp-brand-research`). This is project-level research — focused on the product type, user flows, and implementation challenges.

Works with the dual-diamond architecture: reads brand context from `.design/branding/{brand}/` via `brand.ref`, reads/writes project assets in `.design/projects/{project}/`.
</context>

<objective>
Deep research into UX patterns, competitor experiences, and technical approaches for this project.

**Input:** Brief scope + brand system + project BRIEF.md
**Output:** `{project}/research/` (6 research chunks + INDEX.md)
**Agent:** `gsp-project-researcher`
</objective>

<execution_context>
@${CLAUDE_SKILL_DIR}/../../templates/phases/research.md
</execution_context>

<process>
## Step 0: Resolve project and brand

Resolve project from `.design/projects/` (one → use it, multiple → ask). Set `PROJECT_PATH`.

Read `{PROJECT_PATH}/brand.ref` → set `BRAND_PATH`.

## Step 1: Load context

### Brief (chunk-first)

Read `{PROJECT_PATH}/brief/INDEX.md`. If it exists, load `scope.md` and `target-adaptations.md`.

If brief doesn't exist, tell the user to run `/gsp-project-brief` first.

### Brand system (selective)

Read `{BRAND_PATH}/patterns/INDEX.md`. If it exists, load foundation chunks (to understand the design system constraints).

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
3. Route: "Run `/gsp-project-build`."
4. Stop here.

## Step 1.75: Pre-fetch references (background)

If competitor URLs or reference sites are mentioned in BRIEF.md or `{PROJECT_PATH}/references/`, use `WebFetch` with `run_in_background: true` to pre-fetch them. This warms content for the researcher agent.

## Step 2: Spawn project researcher

Spawn the `gsp-project-researcher` agent. **Inline all content** — the agent should not need to read any input files.

Pass in the agent prompt:
- **Content of** brief scope chunks: scope.md, target-adaptations.md (loaded in Step 1)
- **Content of** brand patterns foundation chunks (loaded in Step 1)
- **Content of** brand discovery chunks: competitive-audit.md, trend-analysis.md (loaded in Step 1)
- **Content of** custom references (loaded in Step 1)
- **Content of** BRIEF.md (loaded in Step 1)
- Any pre-fetched reference content (from Step 1.75)
- Research output template (from execution_context)
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

Render phase transition (see `references/phase-transitions.md`).
</process>
</output>
