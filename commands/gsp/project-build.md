---
name: gsp:project-build
description: Translate designs to code
allowed-tools:
  - Read
  - Write
  - Bash
  - Task
---
<context>
Phase 5 of the GSP project diamond. Uses the Design-to-Code Translator prompt to implement designs directly in the codebase as production-ready frontend components.

Works with the dual-diamond architecture: reads brand system from `.design/branding/{brand}/system/` via `brand.ref`, reads/writes project assets in `.design/projects/{project}/`.
</context>

<objective>
Implement designs as production-ready code in the codebase.

**Input:** Design chunks + research chunks + brief chunks + brand system chunks
**Output:** Code in the codebase + `{project}/build/BUILD-LOG.md`
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

### Branch check

Read `config.json` `git.branch`. If set, check current branch with `git branch --show-current`. If different, warn: "⚠️ Expected branch `{git.branch}`, currently on `{current}`. Switch branches or continue?"

### Revision mode

Check `{PROJECT_PATH}/STATE.md` for build status. If status is `needs-revision`:
1. Read `{PROJECT_PATH}/review/issues.md` — these are QA issues to address
2. Log: "🔄 Revision mode — addressing QA issues from review/issues.md"
3. Pass issues to builder agent in Step 2

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
9. Load `{PROJECT_PATH}/references/INDEX.md` → scan for relevant references (if exists)

**When building all screens** (or no chunks available):
Read full monolith files from `{PROJECT_PATH}/` as fallback. Log: "⚠️ Legacy format detected — consider re-running phases for chunk output."

If design doesn't exist (no INDEX.md in design/), tell the user to run `/gsp:project-design` first.

## Step 1.5: Figma scope check

**If `implementation_target` is `figma`:**
1. Log: "📐 Figma target — producing implementation specs (no codebase to edit)"
2. Fall back to spec-only mode: builder writes `build/CODE.md` + `build/components/` instead of editing codebase
3. Continue to Step 2 with spec-only flag

## Step 2: Spawn builder

Spawn the `gsp-builder` agent with:
- All design, plan, system, and token files
- The Design-to-Code Translator prompt (09)
- Build output template
- Target tech stack, implementation_target, design_scope
- Codebase inventory (INVENTORY.md)
- **Codebase root path** — where to write code
- **Clear instruction:** "Write code directly to the codebase, not to the `.design/build/` directory. Leave changes unstaged."
- **Review issues** (when in revision mode): contents of `review/issues.md`

**When `design_scope` is `tokens`:**
- Output token files only
- Skip component code generation

## Step 3: Write build log

The builder writes code directly to the codebase, then writes a build log:

1. Builder edits/creates files in the codebase
2. Builder writes `{PROJECT_PATH}/build/BUILD-LOG.md` — manifest of what was done (files created, files modified, component map, patterns applied, known gaps)

**Figma exception:** Builder writes `{PROJECT_PATH}/build/CODE.md` + `{PROJECT_PATH}/build/components/` (spec-only mode).

### Write manifest

Write `{PROJECT_PATH}/codebase/MANIFEST.md` from `templates/manifest.md`:
1. **Components table** — one row per component produced. Action = `added` or `modified` based on INVENTORY.md. File paths reference actual codebase locations.
2. **Patterns table** — patterns established (infer from BUILD-LOG.md).
3. **Files Touched** — flat list of all codebase file paths from BUILD-LOG.md.

## Step 4: Update exports index

Update `{PROJECT_PATH}/exports/INDEX.md` — add build phase entries between `<!-- BEGIN:build -->` and `<!-- END:build -->` markers. Reference `build/BUILD-LOG.md`.

## Step 5: Update state

Update `{PROJECT_PATH}/STATE.md`:
- Set Phase 5 (Build) status to `complete` (if all screens done) or `in-progress` (if partial build)
- Record completion date
- Update `## Screen Build Status` table from BUILD-LOG.md screen status — set Build Status per screen (complete/partial/pending)

## Step 6: Phase transition output

Render the phase transition screen (see `references/phase-transitions.md` for ANSI color tokens):

```
  ◆ build complete — code implemented

    build/
    └── BUILD-LOG.md

  ──────────────────────────────
```

Then use `AskUserQuestion` with 3 options:
- **Continue to review** — "QA validate implementation against designs"
- **View progress** — "see the full dashboard"
- **Done for now** — "pick up later with /gsp:start"
</process>
