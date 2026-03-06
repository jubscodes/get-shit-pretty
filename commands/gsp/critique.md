---
name: gsp:critique
description: Design critique (Nielsen's heuristics) + WCAG accessibility audit
allowed-tools:
  - Read
  - Write
  - Bash
  - Task
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
@/Users/jubs/.claude/get-shit-pretty/prompts/06-design-critique-partner.md
@/Users/jubs/.claude/get-shit-pretty/prompts/08-accessibility-auditor.md
@/Users/jubs/.claude/get-shit-pretty/templates/phases/critique.md
@/Users/jubs/.claude/get-shit-pretty/references/nielsen-heuristics.md
@/Users/jubs/.claude/get-shit-pretty/references/wcag-checklist.md
</execution_context>

<process>
## Step 0: Resolve project and brand

Scan `.design/projects/` for project directories. If only one project exists, use it. If multiple, ask the user which project to work on.

Set `PROJECT_PATH` = `.design/projects/{project}`

Read `{PROJECT_PATH}/brand.ref` to resolve brand path:
- Set `BRAND_PATH` = `.design/branding/{brand}`

## Step 1: Load context

Read `{PROJECT_PATH}/config.json` to get `implementation_target` and `design_scope`.

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
6. Route: "Run `/gsp:build`."
7. **Stop here**

**Otherwise:** If design chunks don't exist and scope is not `tokens`, tell the user to complete the design phase first.

## Step 2: Spawn critics (parallel)

**Agent 1: gsp-critic** — Design critique using Nielsen's 10 Heuristics reference + all design chunks.
Output path: `{PROJECT_PATH}/critique/`

**Agent 2: gsp-auditor** — WCAG 2.2 AA audit using WCAG checklist + all design chunks.
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

**If critical issues found:** Display issues, recommend looping back, update STATE.md review loops.
**If no critical issues:** Display positive summary, proceed.

## Step 5: Update state

Update `{PROJECT_PATH}/STATE.md`:
- Set Phase 4 (Critique) status to `complete` or `needs-revision`
- Record review loop count and completion date

## Step 6: Route next

If clean: "Run `/gsp:build` to translate designs to code."
If issues: "Address the critical issues above, then run `/gsp:critique` again."
</process>
</output>
