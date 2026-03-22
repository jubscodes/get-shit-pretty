---
name: project-build
description: Translate designs to code
user-invocable: true
allowed-tools:
  - Read
  - Write
  - Bash
  - Agent
  - Glob
  - Grep
  - Skill
  - AskUserQuestion
---
<context>
Phase 5 of the GSP project diamond. Uses a 4-phase pipeline with verification checkpoints to implement designs directly in the codebase as production-ready frontend components.

Works with the dual-diamond architecture: reads brand system from `.design/branding/{brand}/system/` via `brand.ref`, reads/writes project assets in `.design/projects/{project}/`.

**Pipeline architecture:**
```
Phase 1: SCAFFOLD (skill-level, no agent)
  └─ /gsp:scaffold → verify build passes

Phase 2: FOUNDATIONS (agent: gsp-builder mode:foundations)
  ├─ Context: tokens.json, target-adaptations.md, STACK.md, CONVENTIONS.md
  ├─ Writes: token config, global CSS, layout, shared utils
  └─ CHECKPOINT: build must compile

Phase 3: FOUNDATION REVIEW (interactive)
  └─ Present summary → user confirms

Phase 4: SCREENS (agent: gsp-builder mode:screen, one per screen)
  ├─ Context per screen: its design chunk + referenced components only
  ├─ Agent reads foundations from codebase (not from context)
  ├─ CHECKPOINT per screen: compile check
  └─ Sequential (patterns compound)
```
</context>

<objective>
Implement designs as production-ready code in the codebase via phased pipeline with compile checkpoints.

**Input:** Design chunks + research chunks + brief chunks + brand system chunks
**Output:** Code in the codebase + `{project}/build/BUILD-LOG.md` + `{project}/build/SCAFFOLD-LOG.md`
**Agent:** `gsp-builder` (spawned per phase with execution mode)
</objective>

<execution_context>
@${CLAUDE_SKILL_DIR}/../../prompts/09-design-to-code-translator.md
@${CLAUDE_SKILL_DIR}/../../templates/phases/build.md
</execution_context>

<process>
## Step 0: Resolve project and brand

Scan `.design/projects/` for project directories. If only one project exists, use it. If multiple, ask the user which project to work on.

Set `PROJECT_PATH` = `.design/projects/{project}`

Read `{PROJECT_PATH}/brand.ref` to resolve brand path:
- Set `BRAND_PATH` = `.design/branding/{brand}`

## Step 1: Load config and check state

Read `{PROJECT_PATH}/config.json` to get `implementation_target`, `design_scope`, `codebase_type`.

### Branch check

Read `config.json` `git.branch`. If set, check current branch with `git branch --show-current`. If different, warn: "⚠️ Expected branch `{git.branch}`, currently on `{current}`. Switch branches or continue?"

### Figma scope check

**If `implementation_target` is `figma`:**
1. Log: "📐 Figma target — producing implementation specs (no codebase to edit)"
2. Skip to **Step 7: Figma fallback** (single agent, spec-only mode)

### Revision mode

Check `{PROJECT_PATH}/STATE.md` for build status. If status is `needs-revision`:
1. Read `{PROJECT_PATH}/review/issues.md` — these are QA issues to address
2. Log: "🔄 Revision mode — addressing QA issues from review/issues.md"
3. Skip to **Step 8: Revision mode** (single agent with issues)

### Design check

If design doesn't exist (no `design/` dir or no screen chunks in it), tell the user to run `/gsp:project-design` first and stop.

### Enumerate screens

Read `{PROJECT_PATH}/design/` directory. Collect all `screen-{NN}-{name}.md` files.
Store as ordered list: `SCREENS = [(01, landing), (02, changelog-list), ...]`

Log screen list for user visibility.

## Step 2: Phase 1 — SCAFFOLD

Invoke `/gsp:scaffold` via the Skill tool.

This handles: dependency installation, config file creation, component library init, build verification.

After scaffold completes, verify `{PROJECT_PATH}/build/SCAFFOLD-LOG.md` exists. Read it to confirm build status.

**Gate:** If scaffold reports build failure, stop and surface the error. Do not proceed to foundations with a broken build.

## Step 3: Phase 2 — FOUNDATIONS

Spawn `gsp-builder` agent with **execution_mode: foundations**.

### Context for foundations agent (lean — no screen chunks):

| File | Purpose |
|------|---------|
| `{BRAND_PATH}/system/tokens.json` | Design tokens |
| `{PROJECT_PATH}/brief/target-adaptations.md` | Component adaptations for target |
| `.design/system/STACK.md` | Stack state |
| `.design/system/CONVENTIONS.md` | Codebase conventions (if exists) |
| `.design/system/COMPONENTS.md` | Existing components (if exists) |
| `{PROJECT_PATH}/config.json` | Tech stack, target |
| Design-to-Code Translator prompt (09) | Translation methodology |

### Agent instructions:

> execution_mode: foundations
>
> Build token integration, global styles, and layout primitives ONLY.
>
> 1. Integrate design tokens into the codebase (CSS variables, Tailwind config, or theme file)
> 2. Create global CSS (resets, base styles, font imports, dark mode setup)
> 3. Create root layout with nav shell and footer shell (structure only — no page content)
> 4. Create shared utilities (cn helper, theme provider if needed)
> 5. Do NOT build individual screens or page content
> 6. Write code directly to the codebase, not to `.design/`
> 7. Leave changes unstaged
>
> After completing foundations, write `{PROJECT_PATH}/build/BUILD-LOG.md` with what was done (foundations section only).

### Checkpoint: Compile check

After the foundations agent completes, run the build command:

| Stack | Build command |
|-------|--------------|
| Next.js | `npx next build` |
| Vite | `npx vite build` |
| TypeScript only | `npx tsc --noEmit` |
| Generic | `npm run build` |

**Pass:** Continue to Step 4.
**Fail:** Log the error. Do NOT re-spawn the agent. Surface the error to the user and ask how to proceed.

## Step 4: Phase 3 — FOUNDATION REVIEW

Present a summary of what the foundations phase produced:

```
  ◆ foundations complete

    Files created/modified:
    - {list from BUILD-LOG.md}

    Tokens: {integrated / skipped}
    Layout: {created / modified}
    Build: compiles ✓

  ──────────────────────────────
```

Use `AskUserQuestion`: "Foundations look good? Continue building screens, or review first?"
- **Continue** → proceed to Step 5
- **Review first** → pause, let user inspect, resume when ready

## Step 5: Phase 4 — SCREENS

Build screens sequentially. For each screen in `SCREENS`:

### Context per screen (lean — only this screen's data):

| File | Purpose |
|------|---------|
| `{PROJECT_PATH}/design/screen-{NN}-{name}.md` | This screen's design chunk |
| Referenced component chunks from `{BRAND_PATH}/system/components/` | Only components referenced in this screen's chunk |
| `{PROJECT_PATH}/brief/target-adaptations.md` | Component adaptations |
| `{PROJECT_PATH}/research/reference-specs.md` (if exists) | Technical specs |
| `{PROJECT_PATH}/critique/prioritized-fixes.md` (if exists) | Critique fixes relevant to this screen |
| Design-to-Code Translator prompt (09) | Translation methodology |

**Does NOT receive:** other screen chunks, tokens.json (already in codebase), full brand system, research monoliths.

### Agent instructions per screen:

> execution_mode: screen
> screen: {name} ({NN})
>
> Build the {name} screen. Foundations are already in the codebase — read them, don't recreate them.
>
> 1. Read the existing layout, tokens, and utilities from the codebase
> 2. Create the route page and screen-specific components
> 3. Wire imports to existing foundation components
> 4. Do NOT modify foundation files (global CSS, layout, tokens, theme provider)
> 5. Write code directly to the codebase, not to `.design/`
> 6. Leave changes unstaged
>
> After completing this screen, append to `{PROJECT_PATH}/build/BUILD-LOG.md` — add this screen's files and status to the existing log.

### Checkpoint per screen: Compile check

After each screen agent completes, run the build command.

**Pass:** Log success, continue to next screen.
**Fail:** Log the error as a warning. Ask user: "Screen {name} has build errors. Fix now, skip, or stop?"
- **Fix** → re-run build, surface errors for manual resolution
- **Skip** → mark screen as `partial` in BUILD-LOG, continue
- **Stop** → halt pipeline, save progress

## Step 6: Finalize

After all screens complete (or pipeline stops):

### Write INDEX.md

Write `{PROJECT_PATH}/build/INDEX.md`:

```markdown
# Build
> Phase: build | Project: {name} | Generated: {DATE}

| Chunk | File | ~Lines |
|-------|------|--------|
| Scaffold Log | [SCAFFOLD-LOG.md](./SCAFFOLD-LOG.md) | ~{N} |
| Build Log | [BUILD-LOG.md](./BUILD-LOG.md) | ~{N} |
```

### Write manifest

Write `{PROJECT_PATH}/codebase/MANIFEST.md` from `templates/manifest.md`:
1. **Components table** — one row per component produced. Action = `added` or `modified` based on `.design/system/COMPONENTS.md`. File paths reference actual codebase locations.
2. **Patterns table** — patterns established (infer from BUILD-LOG.md).
3. **Files Touched** — flat list of all codebase file paths from BUILD-LOG.md.

### Update exports index

Update `{PROJECT_PATH}/exports/INDEX.md` — add build phase entries between `<!-- BEGIN:build -->` and `<!-- END:build -->` markers. Reference `build/BUILD-LOG.md` and `build/SCAFFOLD-LOG.md`.

### Update state

Update `{PROJECT_PATH}/STATE.md`:
- Set Phase 5 (Build) status to `complete` (if all screens done) or `in-progress` (if partial build)
- Record completion date
- Update `## Screen Build Status` table — set Build Status per screen (complete/partial/pending)

### Phase transition output

Render phase transition (see `references/phase-transitions.md`). Include screen count and build status in the output.

---

## Step 7: Figma fallback

For `implementation_target: figma`, skip the phased pipeline. Spawn a single `gsp-builder` agent with execution_mode: `full` and spec-only flag. Builder writes `build/CODE.md` + `build/components/` instead of editing codebase. Then continue from Step 6 (finalize).

## Step 8: Revision mode

For `needs-revision` status, spawn a single `gsp-builder` agent with execution_mode: `full` and `review/issues.md` contents. The agent fixes QA issues in the codebase and appends revision sections to BUILD-LOG.md. Then continue from Step 6 (finalize).
</process>
