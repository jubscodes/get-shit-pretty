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
Phase 6 of the GSP design pipeline. Runs two agents in parallel: the Design Critique Partner (Nielsen's 10 heuristics) and the Accessibility Auditor (WCAG 2.2 AA). If critical issues are found, loops back to design/spec phases.
</context>

<objective>
Critique design quality and audit accessibility compliance.

**Input:** All prior artifacts
**Output:** `.design/review/CRITIQUE.md` + `.design/review/ACCESSIBILITY.md`
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
## Step 1: Load context

Read `.design/config.json` to get `implementation_target`.

Read all prior artifacts:
- `.design/BRIEF.md`
- `.design/brand/IDENTITY.md`
- `.design/system/SYSTEM.md`
- `.design/screens/SCREENS.md`
- `.design/specs/SPECS.md` (if it exists)

If SCREENS.md doesn't exist, tell the user to complete the design phase first.

If SPECS.md doesn't exist and `implementation_target` is not `skip`, tell the user to run `/gsp:spec` first. When target is `skip`, review SCREENS.md + SYSTEM.md without requiring SPECS.md.

## Step 2: Spawn critics (parallel)

**Agent 1: gsp-critic** — Design critique using:
- The Design Critique Partner prompt (06)
- Nielsen's 10 Heuristics reference
- All design artifacts

Should deliver:
1. Nielsen's 10 heuristics scored 1-5 with specific examples
2. Visual hierarchy analysis
3. Typography and color assessment
4. Usability evaluation
5. Cognitive load analysis
6. Prioritized fixes (Critical / Important / Polish)
7. 2 alternative redesign directions

**Agent 2: gsp-accessibility-auditor** — WCAG audit using:
- The Accessibility Auditor prompt (08)
- WCAG 2.2 AA checklist
- All design artifacts

Should deliver:
1. Perceivable, Operable, Understandable, Robust checklists
2. Mobile and cognitive accessibility checks
3. Violations list with severity and WCAG criteria
4. Remediation steps
5. Accessibility statement

## Step 3: Write output

1. Write critique to `.design/review/CRITIQUE.md`
2. Write audit to `.design/review/ACCESSIBILITY.md`

## Step 3.5: Generate chunked exports

After writing CRITIQUE.md and ACCESSIBILITY.md, generate agent-consumable chunks:

1. Create `.design/review/exports/review-fixes.md` — Critical and Important fixes only, each with:
   - Which screen/component is affected
   - The specific issue
   - Concrete remediation
2. Create `.design/review/exports/accessibility-fixes.md` — Violations table and remediation steps
3. If `.design/exports/INDEX.md` exists, replace the `<!-- BEGIN:review -->` … `<!-- END:review -->` section with populated tables

Each chunk follows the standard chunk format (see `references/chunk-format.md`).

## Step 4: Assess results

Count critical and important issues across both reports.

**If critical issues found:**
- Display issues clearly
- Recommend looping back: "Run `/gsp:design` or `/gsp:spec` to address critical issues, then `/gsp:review` again."
- Update STATE.md review loop tracking

**If no critical issues:**
- Display positive summary with any polish items
- Proceed to build

## Step 5: Update state

Update `.design/STATE.md`:
- Set Phase 6 (Review) status to `complete` (or `needs-revision` if critical issues)
- Record review loop count
- Record completion date

## Step 6: Route next

If clean: "Run `/gsp:build` to translate designs to code."
If issues: "Address the critical issues above, then run `/gsp:review` again."
</process>
