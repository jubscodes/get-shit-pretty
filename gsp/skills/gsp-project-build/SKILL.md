---
name: gsp-project-build
description: Translate designs to code
user-invocable: true
model: opus
effort: high
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

Works with the dual-diamond architecture: reads brand system from `.design/branding/{brand}/patterns/` via `brand.ref`, reads/writes project assets in `.design/projects/{project}/`.

**Pipeline architecture:**
```
Phase 1: SCAFFOLD (skill-level, no agent)
  └─ /gsp-scaffold → verify build passes

Phase 2: FOUNDATIONS (agent: gsp-builder mode:foundations)
  ├─ Context: {brand-name}.yml + token-mapping.md, target-adaptations.md, STACK.md, CONVENTIONS.md
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

## Step 2.5: Load build references

Read these reference files:
- `${CLAUDE_SKILL_DIR}/visual-effects.md`
- `${CLAUDE_SKILL_DIR}/../gsp-project-design/block-patterns.md`

Hold their content for inlining into agent prompts in Steps 3 and 5.

> **Note:** Anti-patterns are distilled into the `gsp-builder` agent prompt. Full ref remains on disk for edge-case agent lookup.

## Step 3: Phase 2 — FOUNDATIONS

Spawn `gsp-builder` agent with **execution_mode: foundations**.

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
| Visual effects, block patterns refs (loaded in Step 2.5) | Design patterns + CSS recipes |

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

## Step 5: Phase 4 — SCREENS

Build screens sequentially. For each screen in `SCREENS`:

### Context per screen (lean — only this screen's data):

| File | Purpose |
|------|---------|
| `{PROJECT_PATH}/design/screen-{NN}-{name}.md` | This screen's design chunk |
| Referenced component chunks from `{BRAND_PATH}/patterns/components/` | Only components referenced in this screen's chunk |
| `{PROJECT_PATH}/brief/target-adaptations.md` | Component adaptations |
| `{PROJECT_PATH}/research/reference-specs.md` (if exists) | Technical specs |
| `{PROJECT_PATH}/critique/prioritized-fixes.md` (if exists) | Critique fixes relevant to this screen |
| Build output template (from execution_context) | Build log structure |
| Visual effects, block patterns refs (loaded in Step 2.5) | Design patterns + CSS recipes |

**Does NOT receive:** other screen chunks, brand `.yml` (already integrated into codebase), full brand system, research monoliths.

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
> 7. The brand's visual effects were implemented as utilities during foundations — use those utilities/classes rather than re-reading the brand style document
>
> After completing this screen, append to `{PROJECT_PATH}/build/BUILD-LOG.md` — add this screen's files and status to the existing log.

### Checkpoint per screen: Compile check

After each screen agent completes, run the build command.

**Pass:** Log success, continue to next screen.
**Fail:** Log the error as a warning. Ask user: "Screen {name} has build errors. Fix now, skip, or stop?"
- **Fix** → re-run build, surface errors for manual resolution
- **Skip** → mark screen as `partial` in BUILD-LOG, continue
- **Stop** → halt pipeline, save progress

## Step 5.5: Component extraction checkpoint

After all screens complete, audit the codebase for duplicated patterns before review.

### Automated scan

Run these checks in the built codebase:

1. **Duplicated Tailwind class clusters** — Use Grep to find identical `className` strings (>3 classes) appearing in 2+ files. These are extraction candidates.
2. **Inline color/spacing values** — Grep for hardcoded hex colors, rgb(), pixel values that should be tokens. Flag any that don't reference CSS variables or Tailwind tokens.
3. **Repeated component patterns** — Look for similar JSX structures across screen files (e.g., similar card layouts, repeated list items, identical button groups).

### Surface proposals

Present findings to the user as a numbered list:

```
  ◆ extraction candidates

    1. Card pattern in 3 screens (landing, changelog-list, dashboard)
       className="rounded-lg border bg-card p-6 shadow-sm"
       → extract to <Card> component

    2. Hardcoded colors in 2 files
       text-[#FF6B35] in hero.tsx, cta.tsx
       → use text-brand-accent token

    3. Badge pattern in changelog-list, changelog-post
       → extract to <Badge> component

  ──────────────────────────────
```

Use `AskUserQuestion`: "Apply these extractions, skip, or cherry-pick?"
- **Apply all** → make the changes inline (no agent spawn needed, these are mechanical refactors)
- **Cherry-pick** → apply selected ones
- **Skip** → continue to finalize

This step is **not auto-applied** — the user decides what to extract.

### Brand feedback on extraction

If the extraction scan finds hardcoded values that should be tokens (finding type #2), and those tokens are missing from the brand system:

1. After applying fixes in the project, ask: "These token gaps also exist in the brand. Update brand patterns?"
2. If yes, spawn a background `gsp-brand-engineer` agent with the missing token definitions to add them to `{BRAND_PATH}/patterns/{brand-name}.yml` and relevant foundation chunks.

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

For `implementation_target: figma`, skip the phased pipeline. Spawn a single `gsp-builder` agent with execution_mode: `full` and spec-only flag. Builder writes `build/CODE.md` + `build/components/` instead of editing codebase. Then continue from Step 6 (finalize).

## Step 8: Revision mode

For `needs-revision` status, spawn a single `gsp-builder` agent with execution_mode: `full` and `review/issues.md` contents. The agent fixes QA issues in the codebase and appends revision sections to BUILD-LOG.md.

### Brand feedback on revisions

After the revision agent completes, check if any QA fixes changed token-level values (colors, typography, spacing, shadows). If so:

1. Ask: "These revisions changed brand-level values. Update brand patterns so future projects inherit the fix?"
2. If yes, spawn a background `gsp-brand-engineer` agent with the changed values to update `{BRAND_PATH}/patterns/`.

Then continue from Step 6 (finalize).
</process>
