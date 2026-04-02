---
name: gsp-project-build
description: Translate designs to code (technical phase — benefits from capable models)
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

Resolve project from `.design/projects/` (one → use it, multiple → ask). Set `PROJECT_PATH`.

Read `{PROJECT_PATH}/brand.ref` → set `BRAND_PATH`.

## Step 0.5: Validate prerequisites

Read `{PROJECT_PATH}/STATE.md`. Check that Design (Phase 3) is `complete` or `needs-revision` (revision means critique ran and is feeding back).
If design is `pending` or missing: "No designs found. Run `/gsp-project-design` first — building without designs leads to poor results." Then stop.

Exception: if `design_scope` is `tokens` in config.json, skip this check (tokens-only projects don't need design).

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

Read `${CLAUDE_SKILL_DIR}/methodology/gsp-project-builder.md`. Include the full content as **Agent methodology** in all agent prompts below (Steps 3, 5, 7, 8).

## Step 2.6: Load build references

Read these reference files:
- `${CLAUDE_SKILL_DIR}/visual-effects.md`
- `${CLAUDE_SKILL_DIR}/../gsp-project-design/block-patterns.md`

Hold their content for inlining into agent prompts in Steps 3, 5, 7, and 8.

> **Note:** Anti-patterns are distilled into the `gsp-project-builder` agent prompt. Full ref remains on disk for edge-case agent lookup.

## Step 3: Phase 2 — FOUNDATIONS

Spawn `gsp-project-builder` agent with **execution_mode: foundations**.

### Context for foundations agent (lean — no screen chunks):

| File | Purpose |
|------|---------|
| `{BRAND_PATH}/patterns/{brand-name}.yml` | Token values only — used with `gsp-brand-guidelines/token-mapping.md` to generate CSS variables. Do NOT re-read patterns/constraints/effects from here — those are in STYLE.md. |
| `{BRAND_PATH}/patterns/STYLE.md` | Design law — philosophy, patterns, constraints, effects, bold bets, implementation hints (if exists; fall back to `{brand-name}.md`) |
| `{PROJECT_PATH}/brief/target-adaptations.md` | Component adaptations for target |
| `.design/system/STACK.md` | Stack state |
| `.design/system/CONVENTIONS.md` | Codebase conventions (if exists) |
| `.design/system/COMPONENTS.md` | Existing components (if exists) |
| `{PROJECT_PATH}/config.json` | Tech stack, target |
| Build output template (from execution_context) | Build log structure |
| Visual effects, block patterns refs (loaded in Step 2.6) | Design patterns + CSS recipes |
| Agent methodology (loaded in Step 2.5) | Builder role, process, quality standards |

### Agent instructions:

> execution_mode: foundations
>
> Build token integration, global styles, and layout primitives ONLY.
>
> 1. Integrate design tokens into the codebase (CSS variables, Tailwind config, or theme file)
> 2. Create global CSS (resets, base styles, font imports, dark mode setup)
> 3. Create root layout with nav shell and footer shell (structure only — no page content)
> 4. Create shared utilities (cn helper, theme provider if needed)
> 5. Apply the STYLE.md bold bets and effects vocabulary — create CSS utilities or Tailwind extensions for the brand's signature effects. Validate against constraints (never/always rules are non-negotiable).
> 6. Do NOT build individual screens or page content
> 7. Write code directly to the codebase, not to `.design/`
> 8. Leave changes unstaged
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

Use `AskUserQuestion`: "Foundations look good? Continue building screens, or review first?"
- **Continue** → proceed to Step 5
- **Review first** → pause, let user inspect, resume when ready
- **Adjust** → user requests changes (colors, typography, spacing, etc.)

### Brand feedback loop

If the user requests adjustments during foundation review:

1. Apply the changes to the project codebase first (directly or via a quick builder re-run)
2. Ask: "Should this change also update the brand system? (Other projects using this brand would inherit it)"
3. If yes, spawn a background `gsp-brand-engineer` agent to update brand patterns:
   - Pass: the specific changes made (what tokens/values changed, old → new)
   - Pass: `{BRAND_PATH}/patterns/{brand-name}.yml` and relevant identity chunks
   - Agent updates the `.yml` preset, foundation chunks, and STYLE.md if applicable
   - Agent writes to `{BRAND_PATH}/` — the brand source of truth
   - Run in background (`run_in_background: true`) so the build pipeline continues
4. Continue to Step 5 without waiting for brand sync

## Step 4.5: Phase 4 — COMPONENTS

### Build component manifest

Read ALL design chunks from `{PROJECT_PATH}/design/` — every `screen-{NN}-{name}.md`. Also read:
- `{PROJECT_PATH}/brief/scope.md` (feature map)
- `{PROJECT_PATH}/brief/target-adaptations.md` (component adaptations)
- `{BRAND_PATH}/patterns/components/token-mapping.md` (if exists)

Extract every component referenced across all screens. Deduplicate. Build a manifest:

```
COMPONENT_MANIFEST = [
  { name: "Button", source: "shadcn", classification: "library-default", screens: [01, 03, 05] },
  { name: "Card", source: "shadcn", classification: "library-customize", screens: [01, 02, 04], overrides: "custom radius + shadow from STYLE.md" },
  { name: "PricingTier", source: "custom", classification: "custom", screens: [03] },
  ...
]
```

### Classify each component

| Category | Criteria | Action |
|----------|----------|--------|
| `library-default` | Exists in target library, no brand overrides needed | Install as-is |
| `library-customize` | Exists in target library, STYLE.md or token-mapping requires overrides | Install then customize |
| `custom` | No library match, or design requires bespoke component | Build from scratch |
| `existing` | Already in codebase (from scaffold or prior project) | Skip — already available |

### Partition into agent groups

Group components to minimize conflicts:
1. No two agents install the same library component
2. Group related variants together (Card + CardHeader + CardContent + CardFooter → same agent)
3. Balance work across agents (aim for 3-6 components per agent)
4. If total components ≤ 5, use a single agent (no need to parallelize)

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
> Install, customize, or create the assigned components.
> 1. For library-default: install via CLI, verify import works
> 2. For library-customize: install via CLI, then apply brand overrides (STYLE.md constraints, token values)
> 3. For custom: create from scratch following brand patterns and STYLE.md
> 4. Read foundations from codebase (tokens, utilities already exist)
> 5. Do NOT modify foundation files (global CSS, layout, tokens, theme provider)
> 6. Do NOT build screens or page content
> 7. Write code directly to the codebase
> 8. Leave changes unstaged
>
> After completing components, append to `{PROJECT_PATH}/build/BUILD-LOG.md` — add a components section listing what was installed/customized/created.

### Checkpoint: Compile check

After ALL component agents complete, run the build command:

| Stack | Build command |
|-------|--------------|
| Next.js | `npx next build` |
| Vite | `npx vite build` |
| TypeScript only | `npx tsc --noEmit` |
| Generic | `npm run build` |

**Pass:** Continue to Step 5.
**Fail:** Log the error. Surface to user: "Component build failed: {error}. Fix now or skip to screens?"

## Step 5: Phase 5 — SCREENS (parallel)

Build all screens in parallel. Components exist in the codebase from Phase 4.

### Context per screen (lean — only this screen's data):

| File | Purpose |
|------|---------|
| `{PROJECT_PATH}/design/screen-{NN}-{name}.md` | This screen's design chunk |
| Component file paths from BUILD-LOG.md components section | Where to import from (paths only — agent reads codebase) |
| `{PROJECT_PATH}/brief/target-adaptations.md` | Component adaptations |
| `{PROJECT_PATH}/research/reference-specs.md` (if exists) | Technical specs |
| `{PROJECT_PATH}/critique/prioritized-fixes.md` (if exists) | Critique fixes relevant to this screen |
| Build output template (from execution_context) | Build log structure |
| Visual effects, block patterns refs (loaded in Step 2.6) | Design patterns + CSS recipes |
| Agent methodology (loaded in Step 2.5) | Builder role, process, quality standards |

**Does NOT receive:** other screen chunks, brand `.yml` (already in codebase), full brand system, research monoliths, component source code (agent reads from codebase).

### Spawn screen agents in parallel

For each screen in `SCREENS`, spawn `gsp-project-builder` with **execution_mode: screen**.

Assign models in round-robin: first screen on user's model, second on `sonnet`, third on user's model, etc.

Agent instructions per screen:

> execution_mode: screen
> screen: {name} ({NN})
>
> Build the {name} screen. Foundations and components are already in the codebase.
>
> 1. Read the existing layout, tokens, utilities, and components from the codebase
> 2. Create the route page and screen-specific components
> 3. Wire imports to existing foundation and component files
> 4. Do NOT modify foundation files (global CSS, layout, tokens, theme provider)
> 5. Do NOT modify shared component files (they were built in the components phase)
> 6. Write code directly to the codebase, not to `.design/`
> 7. Leave changes unstaged
> 8. The brand's visual effects were implemented as utilities during foundations — use those utilities/classes
>
> After completing this screen, append to `{PROJECT_PATH}/build/BUILD-LOG.md` — add this screen's files and status.

### Checkpoint: Compile check

After ALL screen agents complete, run the build command.

**Pass:** Log success, continue to Step 5.5.
**Fail:** Log the errors. Present to user: "Build errors after screens phase: {errors}. The following screens may have issues: {list}. Fix now or continue to extraction review?"

## Step 5.5: Extraction review (lightweight)

Components were built in Phase 4, so most reuse is already handled. This is a quick sanity check.

### Automated scan

Run these checks on the built codebase:

1. **Hardcoded values** — Grep for hardcoded hex colors, rgb(), pixel values that should be tokens. Flag any that don't reference CSS variables or Tailwind tokens.
2. **Duplicated patterns** — Use Grep to find identical `className` strings (>3 classes) appearing in 2+ screen files. These are patterns the components phase missed.

### Surface findings

If issues found, present to user:

```
  ◆ post-build scan

    Found {N} hardcoded values and {M} duplicated patterns.
    {list if any}

  ──────────────────────────────
```

If no issues: "Post-build scan clean — no hardcoded values or duplicated patterns found."

Use `AskUserQuestion` only if issues were found: "Fix these, or continue to finalize?"
- **Fix** → apply changes inline (mechanical refactors, no agent needed)
- **Continue** → proceed to Step 6

If hardcoded values map to missing brand tokens, suggest: "These token gaps may also exist in the brand. Consider running `/gsp-brand-refine` after build completes."

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

For `implementation_target: figma`, skip the phased pipeline. Spawn a single `gsp-project-builder` agent with execution_mode: `full` and spec-only flag. Builder writes `build/CODE.md` + `build/components/` instead of editing codebase. Then continue from Step 6 (finalize).

## Step 8: Revision mode

For `needs-revision` status, spawn a single `gsp-project-builder` agent with execution_mode: `full` and `review/issues.md` contents. The agent fixes QA issues in the codebase and appends revision sections to BUILD-LOG.md.

### Brand feedback on revisions

After the revision agent completes, check if any QA fixes changed token-level values (colors, typography, spacing, shadows). If so:

1. Ask: "These revisions changed brand-level values. Update brand patterns so future projects inherit the fix?"
2. If yes, spawn a background `gsp-brand-engineer` agent with the changed values to update `{BRAND_PATH}/patterns/`.

Then continue from Step 6 (finalize).
</process>
