---
name: gsp-project-critique
description: Critique designs + accessibility audit (creative phase — benefits from capable models) — use when: review the designs, critique this, check accessibility, what's wrong with, give feedback on
user-invocable: true
context: fork
allowed-tools:
  - Read
  - Write
  - Bash
  - Agent
---
<context>
Phase 4 of the GSP project diamond. Runs two agents in parallel: the Design Critique Partner (Nielsen's 10 heuristics) and the Accessibility Auditor (WCAG 2.2 AA).

Works with the dual-diamond architecture: reads brand context from `.design/branding/{brand}/` via `brand.ref`, reads/writes project assets in `.design/projects/{project}/`.
</context>

<objective>
Critique design quality and audit accessibility compliance.

**Input:** All prior project chunks + brand identity
**Output:** `{project}/critique/` (critique + accessibility chunks + INDEX.md) + exports/INDEX.md update
**Agents:** `gsp-project-critic` + `gsp-accessibility-auditor`
</objective>

<process>
## Step 0: Resolve project and brand

If `.design/projects/` does not exist: output "No GSP project found. Run `/gsp-start` to begin." and stop.

Resolve project from `.design/projects/` (one → use it, multiple → ask). Set `PROJECT_PATH`.

Read `{PROJECT_PATH}/brand.ref` → set `BRAND_PATH`.

## Step 1: Load context

Read `{PROJECT_PATH}/config.json` to get `implementation_target`, `design_scope`, and `accessibility_level`.

### Load all prior chunks (chunk-first with fallbacks)

**BRIEF:** `{PROJECT_PATH}/BRIEF.md`

**Identity:** Read `{BRAND_PATH}/identity/INDEX.md` → load all chunks.

**Patterns:** Read `{BRAND_PATH}/patterns/INDEX.md` → load all chunks.

**Design:** Read `{PROJECT_PATH}/design/INDEX.md` → load all chunks.

**Brief:** Read `{PROJECT_PATH}/brief/INDEX.md` → load all chunks (if exists).

**Research:** Read `{PROJECT_PATH}/research/INDEX.md` → load `recommendations.md` (if exists).

## Step 1.5: Scope check

**If `design_scope` is `tokens`:**
1. Check if `{PROJECT_PATH}/critique/accessibility-token-audit.md` exists (from prior `/gsp-accessibility --tokens`). If yes, reference it and skip inline token checks. If no, suggest running `/gsp-accessibility --tokens` for detailed token contrast analysis.
2. Review system chunks only — token foundations, naming, scale consistency
3. Run accessibility audit on color contrast and token values only (unless prior token audit exists)
4. Write results to `{PROJECT_PATH}/critique/accessibility-audit.md` and `accessibility-fixes.md`
5. Write `{PROJECT_PATH}/critique/INDEX.md`
6. Update STATE.md — set Phase 4 to `complete`
7. Route: "Run `/gsp-project-build`."
8. **Stop here**

**Otherwise:** If design chunks don't exist and scope is not `tokens`, tell the user to complete the design phase first.

## Step 1.8: Load critique references

Read these reference files and hold their content for inlining into agent prompts in Step 2:
- `${CLAUDE_SKILL_DIR}/../gsp-accessibility-audit/wcag-checklist.md`
- `${CLAUDE_SKILL_DIR}/../gsp-color/references/color-composition.md`
- `${CLAUDE_SKILL_DIR}/../gsp-typography/domains/scale.md` — type-scale verification rules
- `${CLAUDE_SKILL_DIR}/../gsp-visuals/domains/imagery.md` — imagery vocabulary for critique
- `${CLAUDE_SKILL_DIR}/../gsp-accessibility-audit/methodology/gsp-accessibility-auditor.md`
- `${CLAUDE_SKILL_DIR}/../../templates/phases/critique.md` — critique output template

> **Note:** Nielsen's heuristics, visual taste, and anti-patterns are distilled into the `gsp-project-critic` agent prompt. anti-patterns.md is a critic-owned consolidated checklist; canonical sources are gsp-typography, gsp-color, gsp-visuals — update those when fixing drift, not the consolidated checklist alone.

## Step 1.9: Load agent methodology

Read `${CLAUDE_SKILL_DIR}/methodology/gsp-project-critic.md`. Include the full content as **Agent methodology** in the gsp-project-critic agent prompt below.

## Step 2: Spawn critics (parallel)

**Inline all project content** — agents should not need to read project files. Reference files for supplementary evaluation (visual-taste, anti-patterns) are on disk — the critic reads them as needed.

**Agent 1: gsp-project-critic** — Pass in the agent prompt:
- **Agent methodology** (loaded in Step 1.9)
- **Content of** all design chunks (loaded in Step 1)
- **Content of** all identity chunks (loaded in Step 1)
- **Content of** all patterns chunks (loaded in Step 1)
- **Content of** `STYLE.md` from `{BRAND_PATH}/patterns/` (if exists) — the critic checks designs against STYLE.md constraints, patterns, effects vocabulary, and bold bets
- **Content of** brief chunks (loaded in Step 1)
- **Content of** research recommendations.md (loaded in Step 1)
- **Content of** BRIEF.md
- **Content of** color composition reference (loaded in Step 1.8)
- **Content of** typography scale reference (loaded in Step 1.8)
- **Content of** imagery vocabulary reference (loaded in Step 1.8)
- **Content of** critique output template (loaded in Step 1.8)
- `references_path`: `${CLAUDE_SKILL_DIR}/` — for supplementary Read access to visual-taste.md, anti-patterns.md
- Output path: `{PROJECT_PATH}/critique/`

**Agent 2: gsp-accessibility-auditor** — Check if `{PROJECT_PATH}/critique/accessibility-audit.md` already exists from a prior `/gsp-accessibility` run. If yes, skip spawning the accessibility auditor — reuse the existing output. If no, pass in the agent prompt:
- **Content of** all design chunks (loaded in Step 1)
- **Content of** identity color-system.md and typography.md (loaded in Step 1)
- **Content of** patterns tokens chunks (loaded in Step 1)
- **Content of** WCAG checklist reference (loaded in Step 1.8)
- **Agent methodology** (loaded in Step 1.8)
- `accessibility_level` from config (defaults to "WCAG 2.2 AA")
- Output path: `{PROJECT_PATH}/critique/`

**Model assignment:** Spawn `gsp-accessibility-auditor` with `model: sonnet`. The accessibility audit is checklist-based (WCAG compliance) and works well on Sonnet. This splits rate-limit pressure — the critic runs on the user's current model while the auditor runs on Sonnet.

## Step 3: Write critique INDEX.md

After both agents complete, write `{PROJECT_PATH}/critique/INDEX.md`:

```markdown
# Critique
> Phase: critique | Project: {name} | Generated: {DATE}

## Critique

| Chunk | File | ~Lines |
|-------|------|--------|
| Critique | [critique.md](./critique.md) | ~{N} |
| Prioritized Fixes | [prioritized-fixes.md](./prioritized-fixes.md) | ~{N} |
| Alternative Directions | [alternative-directions.md](./alternative-directions.md) | ~{N} |
| Strengths | [strengths.md](./strengths.md) | ~{N} |

## Accessibility

| Chunk | File | ~Lines |
|-------|------|--------|
| Accessibility Audit | [accessibility-audit.md](./accessibility-audit.md) | ~{N} |
| Accessibility Fixes | [accessibility-fixes.md](./accessibility-fixes.md) | ~{N} |
```

Update `{PROJECT_PATH}/exports/INDEX.md`:

```markdown
<!-- BEGIN:critique -->
| Section | File |
|---------|------|
| Critique | [critique.md](../critique/critique.md) |
| Prioritized Fixes | [prioritized-fixes.md](../critique/prioritized-fixes.md) |
| Alternative Directions | [alternative-directions.md](../critique/alternative-directions.md) |
| Strengths | [strengths.md](../critique/strengths.md) |
| Accessibility Audit | [accessibility-audit.md](../critique/accessibility-audit.md) |
| Accessibility Fixes | [accessibility-fixes.md](../critique/accessibility-fixes.md) |
<!-- END:critique -->
```

## Step 4: Assess results

Read `critique/critique.md` for the heuristics score (X/50) and brand contract score (X/25, present when STYLE.md was used). Read `critique/prioritized-fixes.md` for critical issues. Determine verdict:

**Pass:** Nielsen ≥ 40/50 AND brand contract ≥ 20/25 (when present) AND no critical fixes. Design is solid, proceed to build.
**Conditional Pass:** Nielsen 30-39/50 OR brand contract 15-19/25 OR critical fixes are minor. Shippable with notes, proceed to build.
**Fail:** Nielsen < 30/50 OR brand contract < 15/25 OR any brand contract dimension at 1 (constraint violation) OR critical fixes affect layout/navigation/IA. Design needs revision before building.

Note: If no STYLE.md was used, the brand contract score is absent — apply Nielsen thresholds only.

## Step 5: Update state

Update `{PROJECT_PATH}/STATE.md`:
- Set Phase 4 (Critique) status to `complete` or `needs-revision`
- Record review loop count and completion date

### Critique→Design loop — if Fail

If verdict is **Fail**:
1. Set Phase 4 (Critique) status to `needs-revision`
2. Set Phase 3 (Design) status to `needs-revision`
3. Ensure `critique/prioritized-fixes.md` and `critique/accessibility-fixes.md` contain actionable issues

## Step 6: Phase transition output

Invoke `/gsp-phase-transition` with phase `critique` and output directory `{PROJECT_PATH}/critique/`.

If critique identified brand-level issues (palette contrast, typography weight, spacing scale), note: "Some issues are brand-level — run `/gsp-brand-refine` to adjust tokens without re-running identity."
</process>
</output>
