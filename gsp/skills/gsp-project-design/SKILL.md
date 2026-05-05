---
name: gsp-project-design
description: Design screens and interaction flows (creative phase — benefits from capable models) — use when: design this, mock up, create wireframes, how should X look, lay out the UI for
user-invocable: true
context: fork
allowed-tools:
  - Read
  - Write
  - Bash
  - Agent
  - Grep
  - Glob
---
<context>
Phase 3 of the GSP project diamond. Uses the UI/UX Pattern Master prompt to design core screens following Apple HIG and the brand's design system.

Works with the dual-diamond architecture: reads brand system from `.design/branding/{brand}/patterns/` via `brand.ref`, reads/writes project assets in `.design/projects/{project}/`.
</context>

<objective>
Design core UI/UX screens and interaction flows.

**Input:** Research + brief + brand system + project BRIEF.md
**Output:** `{project}/design/` (screen chunks + shared/ + INDEX.md) + exports/INDEX.md update
**Agent:** `gsp-project-designer`
</objective>

<execution_context>
@${CLAUDE_SKILL_DIR}/../../templates/phases/design.md
</execution_context>

<process>
## Step 0: Resolve project and brand

If `.design/projects/` does not exist: output "No GSP project found. Run `/gsp-start` to begin." and stop.

Resolve project from `.design/projects/` (one → use it, multiple → ask). Set `PROJECT_PATH`.

Read `{PROJECT_PATH}/brand.ref` → set `BRAND_PATH`.

## Step 0.5: Validate prerequisites

Read `{PROJECT_PATH}/STATE.md`. Check that Brief (Phase 1) is `complete`.
If not: "Brief hasn't been completed yet. Run `/gsp-project-brief` first." Then stop.

Research (Phase 2) is recommended but not required — if skipped, log: "No research artifacts found — designing from brief only."

## Step 1: Load context

Read `{PROJECT_PATH}/config.json` — get `implementation_target`, `design_scope`, `codebase_type`.
Read `{PROJECT_PATH}/BRIEF.md` — app type, audience, goals.

### Revision mode

Check `{PROJECT_PATH}/STATE.md` for design status. If status is `needs-revision`:
1. Read `{PROJECT_PATH}/critique/prioritized-fixes.md` — design issues to address
2. Read `{PROJECT_PATH}/critique/accessibility-fixes.md` — accessibility issues to address
3. Log: "🔄 Revision mode — addressing critique issues from prioritized-fixes.md"
4. Pass critique fixes to designer agent in Step 3

### Custom references

If `{PROJECT_PATH}/references/` exists, scan for files (images, PDFs, markdown, URLs). Pass any found references to the designer agent as additional context.

### Brand patterns (chunk-first)

Read `{BRAND_PATH}/patterns/INDEX.md`. If it exists, load all foundation chunks + selective component chunks.

If it doesn't exist, tell the user to run `/gsp-brand-guidelines` first.

### Brand context (selective)

Read `{BRAND_PATH}/identity/INDEX.md`. If it exists, load `color-system.md`, `typography.md`, and `imagery-style.md`.

### STYLE.md (visual DNA)

Check for `{BRAND_PATH}/patterns/STYLE.md`. This is the single document that governs all visual decisions.

If found, read it. Pass to the designer agent in Step 3 as the **primary visual direction** — it contains intensity dials, component patterns, constraints (never/always), effects vocabulary, and bold bets.

If not found, fall back to scanning `{BRAND_PATH}/patterns/` for a `.md` file that is NOT `INDEX.md` or inside `components/` (legacy `{brand-name}.md` format).

If neither found, proceed without it (older brands may not have this file).

### Brief (chunk-first)

Read `{PROJECT_PATH}/brief/INDEX.md`. If it exists, load `scope.md` and `target-adaptations.md`.

If brief doesn't exist, proceed without it (brief is informative, not blocking).

### Research (chunk-first)

Read `{PROJECT_PATH}/research/INDEX.md`. If it exists, load `ux-patterns.md`, `recommendations.md`, and `reference-specs.md`.

If research doesn't exist, proceed without it (research is informative, not blocking).

## Step 1.5: Scope check

**If `design_scope` is `tokens`:**
1. Update `{PROJECT_PATH}/STATE.md` — set Phase 3 (Design) status to `skipped`
2. Display: "Design phase skipped — design scope is `tokens`."
3. Route: "Run `/gsp-project-build`."
4. Stop here.

**If `design_scope` is `partial`:**
Read BRIEF.md "Target screens" to get the specific screen list.

## Step 2: Load existing design system context

When `implementation_target` is not `figma`:
- **If `.design/system/COMPONENTS.md` and `.design/system/TOKENS.md` exist**, read them. Pass to the agent.
- **If not**, fall back to scanning the codebase.

## Step 2.5: Load design references

Read these reference files (relative to skill dir `${CLAUDE_SKILL_DIR}/`):
- `block-patterns.md`

Hold their content for inlining into the agent prompt in Step 3.

> **Note:** Apple HIG patterns and anti-patterns are distilled into the `gsp-project-designer` agent prompt. Visual effects are covered by STYLE.md's patterns/constraints/effects blocks (from #69). Full refs remain on disk for edge-case agent lookup.

## Step 2.8: Load agent methodology

Read `${CLAUDE_SKILL_DIR}/methodology/gsp-project-designer.md`. Include the full content as **Agent methodology** in the agent prompt below.

## Step 3: Spawn designer

Spawn the `gsp-project-designer` agent. **Inline all content** — the agent should not need to read any input files.

Pass in the agent prompt:
- **Agent methodology** (loaded in Step 2.8)
- **Content of** STYLE.md when available — this is the primary visual direction. When STYLE.md exists, skip foundation chunks (color-system, typography, spacing, elevation, border-radius) — STYLE.md already contains this data. Only load selective component chunks.
- **Content of** all brand patterns foundation chunks (only when STYLE.md does NOT exist — fallback for older brands)
- **Content of** brand identity chunks: imagery-style.md (always — not covered by STYLE.md). Skip identity color-system.md and typography.md when STYLE.md exists (redundant).
- **Content of** brief chunks: scope.md, target-adaptations.md (loaded in Step 1)
- **Content of** research chunks: ux-patterns.md, recommendations.md, reference-specs.md (loaded in Step 1)
- **Content of** BRIEF.md
- **Content of** `.design/system/COMPONENTS.md`, `TOKENS.md` (when loaded in Step 2)
- **Content of** custom references (when loaded in Step 1)
- **Content of** critique fixes: prioritized-fixes.md, accessibility-fixes.md (when in revision mode)
- Design output template (from execution_context)
- **Content of** block patterns reference (loaded in Step 2.5)
- `implementation_target`, `design_scope`, `codebase_type`
- Target screens (when partial)
- **Output path:** `{PROJECT_PATH}/design/`

The agent writes chunks directly:
- `design/screen-{NN}-{name}.md` (one per screen)
- `design/shared/` (personas, IA, navigation, micro-interactions, responsive, component-plan)
- `design/INDEX.md`
- Updates `{PROJECT_PATH}/exports/INDEX.md` (design section)

## Step 4: Update state

Update `{PROJECT_PATH}/STATE.md`:
- Set Phase 3 (Design) status to `complete`
- Record completion date

## Step 5: Phase transition output

Invoke `/gsp-phase-transition` with phase `design` and output directory `{PROJECT_PATH}/design/`.
</process>
</output>
