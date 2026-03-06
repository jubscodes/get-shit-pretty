---
name: gsp:review
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

**Input:** All prior project artifacts + brand identity
**Output:** `{project}/review/CRITIQUE.md` + `{project}/review/ACCESSIBILITY.md`
**Agents:** `gsp-critic` + `gsp-accessibility-auditor`
</objective>

<execution_context>
@/Users/jubs/.claude/get-shit-pretty/prompts/06-design-critique-partner.md
@/Users/jubs/.claude/get-shit-pretty/prompts/08-accessibility-auditor.md
@/Users/jubs/.claude/get-shit-pretty/templates/phases/review.md
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

Read all prior artifacts:
- `{PROJECT_PATH}/BRIEF.md`
- `{BRAND_PATH}/identity/IDENTITY.md`
- `{PROJECT_PATH}/system/SYSTEM.md`
- `{PROJECT_PATH}/screens/SCREENS.md`
- `{PROJECT_PATH}/specs/SPECS.md` (if exists)

## Step 1.5: Scope check

**If `design_scope` is `tokens`:**
1. Review SYSTEM.md only — token foundations, naming, scale consistency
2. Run accessibility audit on color contrast and token values only
3. Write results to `{PROJECT_PATH}/review/ACCESSIBILITY.md`
4. Update STATE.md — set Phase 4 to `complete`
5. Route: "Run `/gsp:build`."
6. **Stop here**

**Otherwise:** If SCREENS.md doesn't exist and scope is not `tokens`, tell the user to complete the design phase first.

## Step 2: Spawn critics (parallel)

**Agent 1: gsp-critic** — Design critique using Nielsen's 10 Heuristics reference + all design artifacts.

**Agent 2: gsp-accessibility-auditor** — WCAG 2.2 AA audit using WCAG checklist + all design artifacts.

## Step 3: Write output

1. Write critique to `{PROJECT_PATH}/review/CRITIQUE.md`
2. Write audit to `{PROJECT_PATH}/review/ACCESSIBILITY.md`

## Step 3.5: Generate chunked exports

1. Create `{PROJECT_PATH}/review/exports/review-fixes.md`
2. Create `{PROJECT_PATH}/review/exports/accessibility-fixes.md`
3. Update `{PROJECT_PATH}/exports/INDEX.md`

## Step 4: Assess results

**If critical issues found:** Display issues, recommend looping back, update STATE.md review loops.
**If no critical issues:** Display positive summary, proceed.

## Step 5: Update state

Update `{PROJECT_PATH}/STATE.md`:
- Set Phase 4 (Review) status to `complete` or `needs-revision`
- Record review loop count and completion date

## Step 6: Route next

If clean: "Run `/gsp:build` to translate designs to code."
If issues: "Address the critical issues above, then run `/gsp:review` again."
</process>
