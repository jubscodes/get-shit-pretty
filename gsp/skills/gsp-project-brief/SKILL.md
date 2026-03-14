---
name: project-brief
description: Scope what you're building
disable-model-invocation: true
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

Works with the dual-diamond architecture: reads brand system from `.design/branding/{brand}/system/` via `brand.ref`, reads/writes project assets in `.design/projects/{project}/`.
</context>

<objective>
Scope the project and plan adaptations from the brand system.

**Input:** Brand system (via brand.ref) + project BRIEF.md + config.json
**Output:** `{project}/brief/` (scope.md, target-adaptations.md, conditionals, INDEX.md)
**Agent:** `gsp-scoper`
</objective>

<execution_context>
@${CLAUDE_SKILL_DIR}/../../prompts/10-project-scoper.md
@${CLAUDE_SKILL_DIR}/../../templates/phases/brief.md
</execution_context>

<process>
## Step 0: Resolve project and brand

Scan `.design/projects/` for project directories. If only one project exists, use it. If multiple, ask the user which project to work on.

Set `PROJECT_PATH` = `.design/projects/{project}`

Read `{PROJECT_PATH}/brand.ref` to resolve brand path:
- Extract `brand` name and `path` from brand.ref
- Set `BRAND_PATH` = `.design/branding/{brand}`

If brand.ref doesn't exist, tell the user to run `/gsp:start` to set up the project with a brand reference.

## Step 1: Load context

### Brand system (chunk-first)

Read `{BRAND_PATH}/system/INDEX.md`. If it exists, load all foundation chunks + selective component chunks.

Fallback: read `{BRAND_PATH}/system/SYSTEM.md` (legacy monolith). Log: "⚠️ Legacy system format detected."

If neither exists, tell the user to run `/gsp:brand-patterns` first to create the brand's design system.

Also read `{BRAND_PATH}/system/tokens.json`.

### Project context

Read:
- `{PROJECT_PATH}/BRIEF.md` — what we're building, platforms, tech stack
- `{PROJECT_PATH}/config.json` — get `implementation_target`, `design_scope`, `codebase_type`

### Codebase context

Read `{PROJECT_PATH}/codebase/INVENTORY.md` (if exists) — existing tokens, components, architecture.

Read `.design/CHANGELOG.md` — quick history of what prior projects built.
For projects with overlapping scope, read their `codebase/MANIFEST.md` for detail.
Glob `.design/projects/*/STATE.md` — detect active sibling projects.

## Step 1.5: Scope check

**If `design_scope` is `tokens`:**
1. Update `{PROJECT_PATH}/STATE.md` — set Phase 1 (Brief) status to `skipped`
2. Display: "Brief phase skipped — design scope is `tokens`."
3. Route: "Run `/gsp:project-build`."
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
- CHANGELOG.md + relevant MANIFEST.md files — for overlap detection and provenance
- The Project Scoper prompt (10)
- The brief output template
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

Render the phase transition screen (see `references/phase-transitions.md` for ANSI color tokens):

```
  ◆ brief complete — project scoped

    brief/
    ├── {actual files written}
    └── INDEX.md

  ──────────────────────────────
```

Then use `AskUserQuestion` with 3 options:
- **Continue to research** — "research UX patterns and approaches"
- **View progress** — "see the full dashboard"
- **Done for now** — "pick up later with /gsp:start"
</process>
</output>
