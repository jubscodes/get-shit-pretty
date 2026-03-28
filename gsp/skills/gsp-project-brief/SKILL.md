---
name: gsp-project-brief
description: Scope what you're building
user-invocable: true
model: sonnet
allowed-tools:
  - Read
  - Write
  - Bash
  - Agent
  - Grep
  - Glob
---
<context>
Phase 1 of the GSP project diamond. Scopes the project by determining what screens and components are needed, what adaptations the brand system requires for this specific project, and performs gap analysis against the codebase.

Encourages treating the project as a bounded issue (or set of issues) and a PR — ship small, ship complete.

Works with the dual-diamond architecture: reads brand system from `.design/branding/{brand}/patterns/` via `brand.ref`, reads/writes project assets in `.design/projects/{project}/`.
</context>

<objective>
Scope the project and plan adaptations from the brand system.

**Input:** Brand system (via brand.ref) + project BRIEF.md + config.json
**Output:** `{project}/brief/` (scope.md, target-adaptations.md, conditionals, INDEX.md)
**Agent:** `gsp-scoper`
</objective>

<execution_context>
@${CLAUDE_SKILL_DIR}/../../templates/phases/brief.md
</execution_context>

<process>
## Step 0: Resolve project and brand

Resolve project from `.design/projects/` (one → use it, multiple → ask). Set `PROJECT_PATH`.

Read `{PROJECT_PATH}/brand.ref` → set `BRAND_PATH`. If brand.ref doesn't exist, tell the user to run `/gsp-start`.

## Step 1: Load context

### Brand patterns (chunk-first)

Read `{BRAND_PATH}/patterns/INDEX.md`. If it exists, load all foundation chunks + selective component chunks.

If it doesn't exist, tell the user to run `/gsp-brand-guidelines` first to create the brand's design patterns.

Also read the brand `.yml` preset from `{BRAND_PATH}/patterns/`.

### Project context

Read:
- `{PROJECT_PATH}/BRIEF.md` — what we're building, platforms, tech stack
- `{PROJECT_PATH}/config.json` — get `implementation_target`, `design_scope`, `codebase_type`

### Codebase context

Read `.design/system/STACK.md` and `.design/system/COMPONENTS.md` (if exist) — existing tech stack, components, architecture.

Read `.design/CHANGELOG.md` — quick history of what prior projects built.
For projects with overlapping scope, read their `codebase/MANIFEST.md` for detail.
Glob `.design/projects/*/STATE.md` — detect active sibling projects.

## Step 1.5: Scope check

**If `design_scope` is `tokens`:**
1. Update `{PROJECT_PATH}/STATE.md` — set Phase 1 (Brief) status to `skipped`
2. Display: "Brief phase skipped — design scope is `tokens`."
3. Route: "Run `/gsp-project-build`."
4. Stop here.

## Step 1.7: Issue framing

Suggest to the user:
"Consider framing this project as a bounded issue (or set of issues) and a PR. Smaller scope = higher quality. What's the tightest version of this that ships?"

If the project scope feels large, suggest breaking it into multiple bounded issues — each one a focused deliverable that can be reviewed independently.

## Step 2: Spawn scoper

Spawn the `gsp-scoper` agent. **Inline all content** — the agent should not need to read any input files.

Pass in the agent prompt:
- **Content of** brand patterns foundation + component chunks (loaded in Step 1)
- **Content of** brand `.yml` preset (loaded in Step 1)
- **Content of** BRIEF.md (loaded in Step 1)
- **Content of** `.design/system/STACK.md`, `COMPONENTS.md` (when loaded in Step 1)
- **Content of** CHANGELOG.md + relevant MANIFEST.md files (loaded in Step 1)
- Brief output template (from execution_context)
- `implementation_target`, `design_scope`, `codebase_type`
- **Output path:** `{PROJECT_PATH}/brief/`

If any sibling project is active and its scope overlaps with this project, flag it: "⚠️ {name} is actively working on {scope}. Coordinate to avoid conflicts."
If this project modifies components from a sibling's manifest, note provenance.

The agent writes chunks directly:
- `brief/scope.md`
- `brief/target-adaptations.md`
- `brief/install-manifest.md` (shadcn/rn-reusables)
- `brief/gap-analysis.md` (existing target)
- `brief/file-references.md` (existing target)
- `brief/INDEX.md`

## Step 3: Write exports

Update `{PROJECT_PATH}/exports/INDEX.md`:
- If INDEX.md doesn't exist, copy it from `templates/exports-index.md`
- Replace everything between `<!-- BEGIN:brief -->` and `<!-- END:brief -->` with populated table:

```markdown
<!-- BEGIN:brief -->
| Section | File |
|---------|------|
| Scope | [scope.md](../brief/scope.md) |
| Target Adaptations | [target-adaptations.md](../brief/target-adaptations.md) |
| Install Manifest | [install-manifest.md](../brief/install-manifest.md) |
| Gap Analysis | [gap-analysis.md](../brief/gap-analysis.md) |
| File References | [file-references.md](../brief/file-references.md) |
<!-- END:brief -->
```

Only include rows for chunks that were actually produced.

## Step 4: Update state

Update `{PROJECT_PATH}/STATE.md`:
- Set Phase 1 (Brief) status to `complete`
- Record completion date

## Step 5: Phase transition output

Render phase transition (see `phase-transitions.md` in the skills root).
</process>
</output>
