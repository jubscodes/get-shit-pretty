---
name: project-critique
description: Critique your designs + accessibility audit
disable-model-invocation: true
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
**Agents:** `gsp-critic` + `gsp-auditor`
</objective>

<execution_context>
@${CLAUDE_SKILL_DIR}/../../prompts/06-design-critique-partner.md
@${CLAUDE_SKILL_DIR}/../../prompts/08-accessibility-auditor.md
@${CLAUDE_SKILL_DIR}/../../templates/phases/critique.md
@${CLAUDE_SKILL_DIR}/../../references/nielsen-heuristics.md
@${CLAUDE_SKILL_DIR}/../../references/wcag-checklist.md
</execution_context>

<process>
## Step 0: Resolve project and brand

Scan `.design/projects/` for project directories. If only one project exists, use it. If multiple, ask the user which project to work on.

Set `PROJECT_PATH` = `.design/projects/{project}`

Read `{PROJECT_PATH}/brand.ref` to resolve brand path:
- Set `BRAND_PATH` = `.design/branding/{brand}`

## Step 1: Load context

Read `{PROJECT_PATH}/config.json` to get `implementation_target`, `design_scope`, and `accessibility_level`.

### Load all prior chunks (chunk-first with fallbacks)

**BRIEF:** `{PROJECT_PATH}/BRIEF.md`

**Identity:** Read `{BRAND_PATH}/identity/INDEX.md` → load all chunks.
Fallback: `{BRAND_PATH}/identity/IDENTITY.md`.

**System:** Read `{BRAND_PATH}/system/INDEX.md` → load all chunks.
Fallback: `{BRAND_PATH}/system/SYSTEM.md`.

**Design:** Read `{PROJECT_PATH}/design/INDEX.md` → load all chunks.
Fallback: `{PROJECT_PATH}/design/SCREENS.md` or `{PROJECT_PATH}/screens/INDEX.md` (legacy).

**Brief:** Read `{PROJECT_PATH}/brief/INDEX.md` → load all chunks (if exists).

**Research:** Read `{PROJECT_PATH}/research/INDEX.md` → load `recommendations.md` (if exists).

## Step 1.5: Scope check

**If `design_scope` is `tokens`:**
1. Review system chunks only — token foundations, naming, scale consistency
2. Run accessibility audit on color contrast and token values only
3. Write results to `{PROJECT_PATH}/critique/accessibility-audit.md` and `accessibility-fixes.md`
4. Write `{PROJECT_PATH}/critique/INDEX.md`
5. Update STATE.md — set Phase 4 to `complete`
6. Route: "Run `/gsp:project-build`."
7. **Stop here**

**Otherwise:** If design chunks don't exist and scope is not `tokens`, tell the user to complete the design phase first.

## Step 2: Spawn critics (parallel)

**Agent 1: gsp-critic** — Design critique using Nielsen's 10 Heuristics reference + all design chunks.
Output path: `{PROJECT_PATH}/critique/`

**Agent 2: gsp-auditor** — WCAG 2.2 audit using WCAG checklist + all design chunks. Pass `accessibility_level` from config (defaults to "WCAG 2.2 AA") so the auditor adapts its criteria (AA vs AAA).
Output path: `{PROJECT_PATH}/critique/`

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

Read `critique/critique.md` for the overall heuristics score and `critique/prioritized-fixes.md` for critical issues. Determine verdict:

**Pass (score ≥ 40/50, no critical fixes):** Design is solid, proceed to build.
**Conditional Pass (score 30-39/50 or critical fixes are minor):** Shippable with notes, proceed to build.
**Fail (score < 30/50 or critical fixes affect layout/navigation/IA):** Design needs revision before building.

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

Render the phase transition screen (see `references/phase-transitions.md` for ANSI color tokens):

**If Pass/Conditional Pass:**

```
  ◆ critique complete — designs critiqued

    critique/
    ├── {actual files written}
    └── INDEX.md

  ──────────────────────────────
```

Then use `AskUserQuestion` with 3 options:
- **Continue to build** — "implement designs in the codebase"
- **View progress** — "see the full dashboard"
- **Done for now** — "pick up later with /gsp:start"

**If Fail:**

```
  ◈ critique — critical issues found, revising designs

  ──────────────────────────────
```

Then use `AskUserQuestion` with 3 options:
- **Revise designs** — "address critical issues and re-run critique"
- **Override and continue** — "accept current designs and move to build"
- **View issues** — "see the full critique report"
</process>
</output>
