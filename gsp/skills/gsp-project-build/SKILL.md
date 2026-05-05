---
name: gsp-project-build
description: Translate designs to code (technical phase — benefits from capable models) — use when: build this, implement, code this up, build me a X, add a X to the app, make the X page
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
Phase 5 of the GSP project diamond. Uses a 7-phase pipeline with verification checkpoints to implement designs directly in the codebase as production-ready frontend components.

Works with the dual-diamond architecture: reads brand system from `.design/branding/{brand}/patterns/` via `brand.ref`, reads/writes project assets in `.design/projects/{project}/`.

**Pipeline architecture:**
```
Phase 1: SCAFFOLD (skill-level, no agent)
  └─ /gsp-scaffold → verify build passes

Phase 2: FOUNDATIONS (agent: gsp-project-builder mode:foundations)
  ├─ Context: {brand-name}.yml + token-mapping.md, target-adaptations.md, STACK.md, CONVENTIONS.md
  ├─ Writes: token config, global CSS, layout, shared utils
  └─ CHECKPOINT: build must compile

Phase 3: FOUNDATION REVIEW (interactive)
  └─ Present summary → user confirms

Phase 4: COMPONENTS (agents: gsp-project-builder mode:component, parallel)
  ├─ Orchestrator: reads all design chunks → builds component manifest → partitions
  ├─ Each agent: installs/customizes/creates its assigned components
  ├─ Model assignment: round-robin (Opus/Sonnet) for rate-limit distribution
  └─ CHECKPOINT: build must compile

Phase 5: SCREENS (agents: gsp-project-builder mode:screen, parallel)
  ├─ Context per screen: its design chunk + component paths (components exist in codebase)
  ├─ Agent reads foundations + components from codebase (not from context)
  ├─ Model assignment: round-robin (Opus/Sonnet) for rate-limit distribution
  └─ CHECKPOINT: build must compile

Phase 6: EXTRACTION REVIEW (lightweight)
  └─ Grep for hardcoded values, flag remaining duplication

Phase 7: FINALIZE
  └─ BUILD-LOG, MANIFEST, STATE, phase transition
```
</context>

<objective>
Implement designs as production-ready code in the codebase via phased pipeline with compile checkpoints.

**Input:** Design chunks + research chunks + brief chunks + brand system chunks
**Output:** Code in the codebase + `{project}/build/BUILD-LOG.md` + `{project}/build/SCAFFOLD-LOG.md`
**Agent:** `gsp-project-builder` (spawned per phase with execution mode)
</objective>

<execution_context>
@${CLAUDE_SKILL_DIR}/../../templates/phases/build.md
</execution_context>

<rules>
- Always use `AskUserQuestion` for user interaction — never prompt via plain text
- One decision per question — never batch multiple questions in a single message
</rules>

<process>
## Step 0: Resolve project and brand

If `.design/projects/` does not exist: output "No GSP project found. Run `/gsp-start` to begin." and stop.

Resolve project from `.design/projects/` (one → use it, multiple → ask). Set `PROJECT_PATH`.

Read `{PROJECT_PATH}/brand.ref` → set `BRAND_PATH`.

## Step 0.5: Validate prerequisites

Read `{PROJECT_PATH}/STATE.md`. Check that Design (Phase 3) is `complete` or `needs-revision` (revision means critique ran and is feeding back).
If design is `pending` or missing: "No designs found. Run `/gsp-project-design` first — building without designs leads to poor results." Then stop.

Exception: if `design_scope` is `tokens` in config.json, skip this check (tokens-only projects don't need design).

## Step 1: Load config and check state

Read `{PROJECT_PATH}/config.json` to get `implementation_target`, `design_scope`, `codebase_type`, `app_path`.

Set `APP_PATH` = value of `app_path`. If empty, default to `.` (repo root).

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

If design doesn't exist (no `design/` dir or no screen chunks in it), tell the user to run `/gsp-project-design` first and stop.

### Enumerate screens

Read `{PROJECT_PATH}/design/` directory. Collect all `screen-{NN}-{name}.md` files.
Store as ordered list: `SCREENS = [(01, landing), (02, changelog-list), ...]`

Log screen list for user visibility.

## Step 2: Phase 1 — SCAFFOLD

Invoke `/gsp-scaffold` via the Skill tool.

This handles: dependency installation, config file creation, component library init, build verification.

After scaffold completes, verify `{PROJECT_PATH}/build/SCAFFOLD-LOG.md` exists. Read it to confirm build status.

**Gate:** If scaffold reports build failure, stop and surface the error. Do not proceed to foundations with a broken build.

## Step 2.5: Load agent methodology

Read `${CLAUDE_SKILL_DIR}/methodology/gsp-project-builder.md`. Include the full content as **Agent methodology** in all agent prompts below (Steps 3, 4.5, 5, 7, 8).

## Step 2.6: Load build references

Read these reference files:
- `${CLAUDE_SKILL_DIR}/visual-effects.md`
- `${CLAUDE_SKILL_DIR}/../gsp-project-design/block-patterns.md`
- `${CLAUDE_SKILL_DIR}/shadcn-composition.md`
- `${CLAUDE_SKILL_DIR}/agent-rules.md` — common spawn guardrails (universal + per-mode)

Hold their content for inlining into agent prompts in Steps 3, 4.5, 5, 7, and 8.

## Step 2.7: Theme apply gate

Verify brand tokens are installed in the codebase before spawning foundations. Foundations no longer pastes tokens — `/gsp-brand-apply` is the install primitive.

1. If `{APP_PATH}/components.json` does not exist, skip this gate silently — the target is non-shadcn (scaffold's failure gate at end of Step 2 already covers a broken shadcn scaffold).
2. Resolve the CSS path: read `{APP_PATH}/components.json` and extract the value at `.tailwind.css` (a relative path from `APP_PATH`).
3. Open `{APP_PATH}/{cssPath}`. Verify:
   - Contains `oklch(`
   - Has both `:root {` and `.dark {` blocks
   - Declares `--background`, `--foreground`, `--primary`, `--radius`
   - **If** `{BRAND_PATH}/patterns/{brand-name}.theme.json` exists: contains the brand's signature `cssVars.light.background` value from that file (this distinguishes the applied brand from shadcn's nova defaults). If `{brand-name}.theme.json` does NOT exist (older brand from before Task 4 landed), skip the brand-signature check and rely on the structural checks only — log `⚠ Brand theme.json not found — skipping brand-signature check.`

If any required check fails, brand tokens are not applied (or the wrong brand is applied). Use `AskUserQuestion`:
- Question: "Brand tokens for **{brand-name}** not detected in `{APP_PATH}/{cssPath}`. Run `/gsp-brand-apply {brand-name}` now?"
- Options:
  - A: "Yes — I'll run /gsp-brand-apply {brand-name}, then re-run /gsp-project-build"
  - B: "No, abort the build"

On A: output `Next: run /gsp-brand-apply {brand-name}, then re-invoke /gsp-project-build` and exit this skill. The build does not auto-continue — the apply runs out-of-band and you re-invoke when ready.

On B: stop the build phase. Output: `Build aborted — apply brand tokens with /gsp-brand-apply {brand-name} and re-run /gsp-project-build.`

If all checks pass, log `✓ Brand tokens verified` and continue to Step 3.

## Step 3: Phase 2 — FOUNDATIONS

Spawn `gsp-project-builder` agent with **execution_mode: foundations**.

### Context for foundations agent (lean — no screen chunks):

| File | Purpose |
|------|---------|
| `{BRAND_PATH}/patterns/{brand-name}.yml` | Token values only — used with token-mapping.md to generate CSS variables. Do NOT re-read patterns/constraints/effects from here — those are in STYLE.md. |
| `{BRAND_PATH}/patterns/STYLE.md` | Design law — philosophy, patterns, constraints, effects, bold bets, implementation hints (if exists; fall back to `{brand-name}.md`) |
| `{PROJECT_PATH}/brief/target-adaptations.md` | Component adaptations for target |
| `.design/system/STACK.md` | Stack state (or `.design/system/stacks/{APP_NAME}.md` for monorepos) |
| `.design/system/CONVENTIONS.md` | Codebase conventions (if exists) |
| `.design/system/COMPONENTS.md` | Existing components (if exists) |
| `{PROJECT_PATH}/config.json` | Tech stack, target, `app_path` |
| `APP_PATH = {APP_PATH}` | Working directory — all file writes and build commands run here |
| Build output template (from execution_context) | Build log structure |
| Token mapping ref (loaded in Step 2.6) | shadcn component composition rules, semantic token usage, `cn()`, `cva`, RSC patterns |
| Visual effects, block patterns refs (loaded in Step 2.6) | Design patterns + CSS recipes |
| Agent methodology (loaded in Step 2.5) | Builder role, process, quality standards |

### Agent instructions:

> execution_mode: foundations
> Build token integration, global styles, layout primitives, theme provider/utilities ONLY.
>
> Foundation-specific actions:
> 1. Add base styles + dark mode setup + font imports that `apply` did not handle (`cssVars.theme.font-sans` may set the CSS var without the `next/font/google` import — add it if missing)
> 2. Create root layout with nav + footer shells (structure only)
> 3. Create shared utilities (cn helper, theme provider)
> 4. Apply STYLE.md bold bets + effects as CSS utilities / Tailwind extensions; validate against never/always constraints
> 5. For shadcn targets: semantic tokens (`bg-primary`), never raw values (`bg-blue-500`); `gap-*` not `space-y-*`; `size-*` when w/h equal
>
> See `agent-rules.md` (loaded in Step 2.6) for universal + per-mode guardrails (write to codebase, leave unstaged, log to `build/logs/foundations.md`, no BUILD-LOG.md direct write).

### Checkpoint: Compile check

After the foundations agent completes, run the build command in `APP_PATH`:

| Stack | Build command |
|-------|--------------|
| Next.js | `cd {APP_PATH} && npx next build` |
| Vite | `cd {APP_PATH} && npx vite build` |
| TypeScript only | `cd {APP_PATH} && npx tsc --noEmit` |
| Generic | `cd {APP_PATH} && npm run build` |

**Pass:** Continue to preview verification, then Step 4.
**Fail:** Log the error. Do NOT re-spawn the agent. Surface the error to the user and ask how to proceed.

### Preview verification (opt-in)

After compile passes, verify the foundations actually render:

1. Check if dev server is already running (`lsof -i :3000` or `:5173`)
2. If running, use `curl -s http://localhost:{port}` to fetch the page
3. Check the HTML response for:
   - **Not blank** — response body has more than just the shell/boilerplate (>500 chars of content)
   - **Tokens resolved** — grep the response for CSS variables or Tailwind classes from the token config. If `var(--` appears but no matching custom property is defined, tokens may be broken.
   - **Font loaded** — check for the expected Google Fonts import or `@font-face` rule

If dev server is not running, skip verification silently — do not start one. This keeps it zero-config.

Report any issues found: "⚠️ Preview check: {issue}. This may be cosmetic — continue or investigate?"

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

Use `AskUserQuestion`: "Foundations look good? Continue building components, or review first?"
- **Continue** → proceed to Step 4.5
- **Review first** → pause, let user inspect, resume when ready
- **Adjust** → user requests changes (colors, typography, spacing, etc.)

### Brand feedback loop

Read `${CLAUDE_SKILL_DIR}/brand-feedback.md` for the full procedure. Key constraint: the `gsp-brand-engineer` re-sync runs synchronously before Step 4.5 begins.

## Step 4.5: Phase 4 — COMPONENTS

### Build component manifest + classify + partition

Read `${CLAUDE_SKILL_DIR}/component-classification.md` for the manifest schema, classification table (`library-default` / `library-customize` / `custom` / `existing`), and partitioning rules (≤5 → single agent; group related variants; 3-6 components per agent).

### Resume check

Check for existing `build/status/component-*.json` files. For each partition with a `"status": "complete"` file, skip that agent — log: "Skipping {name} — already complete."

### Progress log

Before spawning, log the manifest:

```
  ◆ components phase

    Spawning {N} agents in parallel:
    {for each partition}: [{model}] {partition-name} — {component-count} components
```

### Spawn component agents in parallel

For each partition, spawn `gsp-project-builder` with **execution_mode: component**.

Assign models in round-robin: first agent on user's model, second on `sonnet`, third on user's model, etc. This splits rate-limit pressure across model buckets.

Context per component agent:

| File | Purpose |
|------|---------|
| Component partition (list + classifications + overrides) | What to build |
| `{BRAND_PATH}/patterns/STYLE.md` (or fallback `{brand-name}.md`) | Design constraints, effects vocabulary |
| `{BRAND_PATH}/patterns/{brand-name}.yml` | Token values |
| `{BRAND_PATH}/patterns/components/token-mapping.md` | Component-to-token mapping |
| Design chunk excerpts (only sections referencing these components) | Usage context — how screens use them |
| `{PROJECT_PATH}/brief/target-adaptations.md` | Component adaptations for target |
| `{PROJECT_PATH}/config.json` | Tech stack, implementation target |
| Visual effects, block patterns refs (loaded in Step 2.6) | Design patterns + CSS recipes |
| Agent methodology (loaded in Step 2.5) | Builder role, process, quality standards |

Agent instructions template:

> execution_mode: component
> implementation_target: {target}
> components: [{partition list with classifications}]
>
> Install, customize, or create the assigned components per their classification (library-default → install as-is; library-customize → install + STYLE.md overrides; custom → create from scratch).
>
> See `agent-rules.md` (loaded in Step 2.6) for guardrails (read foundations from codebase, do not modify foundation files, log to `build/logs/component-{partition-name}.md`, write `build/status/component-{partition-name}.json` for resume support).

### Checkpoint: Compile check

After ALL component agents complete, run the build command (same stack table as Step 3 checkpoint).

**Pass:** Continue to Step 5.
**Fail:** Log the error. Surface to user: "Component build failed: {error}. Fix now or skip to screens?"

### Merge component logs

After the compile checkpoint passes, merge all `build/logs/component-*.md` files into `{PROJECT_PATH}/build/BUILD-LOG.md` (foundations section from `build/logs/foundations.md` + all component sections, in partition order).

Log: "  ✓ components complete — {N} agents, build compiles"

Update `{PROJECT_PATH}/STATE.md` — set completed component partitions in build status.

## Step 5: Phase 5 — SCREENS (parallel)

Build all screens in parallel. Components exist in the codebase from Phase 4.

### Context per screen (lean — only this screen's data):

| File | Purpose |
|------|---------|
| `{PROJECT_PATH}/design/screen-{NN}-{name}.md` | This screen's design chunk |
| Component file paths from BUILD-LOG.md components section | Where to import from (paths only — agent reads codebase) |
| `{PROJECT_PATH}/brief/target-adaptations.md` | Component adaptations |
| `{PROJECT_PATH}/research/reference-specs.md` (if exists) | Technical specs — include only sections relevant to this screen |
| `{PROJECT_PATH}/critique/prioritized-fixes.md` (if exists) | Critique fixes — include only fixes tagged to this screen |
| Build output template (from execution_context) | Build log structure |
| Visual effects, block patterns refs (loaded in Step 2.6) | Design patterns + CSS recipes |
| Agent methodology (loaded in Step 2.5) | Builder role, process, quality standards |

**Does NOT receive:** other screen chunks, brand `.yml` (already in codebase), full brand system, research monoliths, component source code (agent reads from codebase).

### Resume check

Check for existing `build/status/screen-*.json` files. For each screen with a `"status": "complete"` file, skip that agent — log: "Skipping screen-{NN}-{name} — already complete."

### Progress log

Before spawning, log:

```
  ◆ screens phase

    Spawning {N} agents in parallel:
    {for each screen}: [{model}] screen-{NN}-{name}
```

### Spawn screen agents in parallel

For each screen in `SCREENS`, spawn `gsp-project-builder` with **execution_mode: screen**.

Assign models in round-robin: first screen on user's model, second on `sonnet`, third on user's model, etc.

Agent instructions per screen:

> execution_mode: screen
> screen: {name} ({NN})
>
> Build the {name} screen. Foundations + components are already in the codebase.
>
> 1. Read existing layout, tokens, utilities, components from the codebase
> 2. Create the route page + screen-specific components
> 3. Wire imports to existing foundation + component files
> 4. The brand's visual effects exist as utilities/classes from foundations — use them, don't redefine
>
> See `agent-rules.md` (loaded in Step 2.6) for guardrails (no modifying foundations or shared components, log to `build/logs/screen-{NN}-{name}.md`, write `build/status/screen-{NN}-{name}.json` for resume support).

### Checkpoint: Compile check

After ALL screen agents complete, run the build command (same stack table as Step 3 checkpoint).

**Pass:** Log success, continue to Step 5.5.
**Fail:** Log the errors. Present to user: "Build errors after screens phase: {errors}. The following screens may have issues: {list}. Fix now or continue to extraction review?"

### Merge screen logs

After the compile checkpoint passes, merge all `build/logs/screen-*.md` files into `{PROJECT_PATH}/build/BUILD-LOG.md` (append screen sections in order: 01, 02, 03, etc.).

Log: "  ✓ screens complete — {N} screens, build compiles"

Update `{PROJECT_PATH}/STATE.md` `## Screen Build Status` table — set completed screens to `complete`.

## Step 5.5: Extraction review (lightweight)

Read `${CLAUDE_SKILL_DIR}/extraction-review.md` for the full procedure. Quick post-build sanity check: hardcoded values + duplicated patterns. If issues found, AskUserQuestion (Fix inline / Continue to Step 6).

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

Invoke `/gsp-phase-transition` with phase `build` and output directory `{PROJECT_PATH}/build/`.

---

## Step 7: Figma fallback

Read `${CLAUDE_SKILL_DIR}/flows/figma.md` for full instructions.

For `implementation_target: figma`, skip the phased pipeline. Produce Figma-ready implementation specs instead of editing the codebase. Then continue from Step 6 (finalize).

## Step 8: Revision mode

Read `${CLAUDE_SKILL_DIR}/flows/revision.md` for full instructions.

For `needs-revision` status, fix QA issues from `review/issues.md` via a single revision agent. Then continue from Step 6 (finalize).
</process>
