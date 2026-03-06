---
name: gsp:review
description: Validate built deliverables — token compliance, screen coverage, acceptance
allowed-tools:
  - Read
  - Write
  - Bash
  - Task
  - Grep
  - Glob
---
<context>
Phase 6 of the GSP project diamond. Validates that built deliverables match the design intent — checking system token usage, screen coverage, component implementation, and accessibility compliance in the actual code.

Works with the dual-diamond architecture: reads brand system from `.design/branding/{brand}/system/` via `brand.ref`, reads/writes project assets in `.design/projects/{project}/`.
</context>

<objective>
Validate built deliverables against design intent.

**Input:** Built code + design chunks + brand system
**Output:** `{project}/review/` (acceptance-report.md + issues.md + INDEX.md) + exports/INDEX.md update
**Agent:** `gsp-reviewer`
</objective>

<execution_context>
@/Users/jubs/.claude/get-shit-pretty/prompts/11-deliverable-reviewer.md
@/Users/jubs/.claude/get-shit-pretty/templates/phases/review.md
</execution_context>

<process>
## Step 0: Resolve project and brand

Scan `.design/projects/` for project directories. If only one project exists, use it. If multiple, ask the user which project to work on.

Set `PROJECT_PATH` = `.design/projects/{project}`

Read `{PROJECT_PATH}/brand.ref` to resolve brand path:
- Set `BRAND_PATH` = `.design/branding/{brand}`

## Step 1: Load context

Read `{PROJECT_PATH}/config.json` to get `implementation_target` and `design_scope`.

### Load all artifacts

**Build output:** Read `{PROJECT_PATH}/build/CODE.md` and scan `{PROJECT_PATH}/build/components/` for implemented components.

**Design:** Read `{PROJECT_PATH}/design/INDEX.md` → load all screen chunks.
Fallback: `{PROJECT_PATH}/screens/INDEX.md` (legacy).

**Brand system:** Read `{BRAND_PATH}/system/INDEX.md` → load foundation + component chunks.
Also read `{BRAND_PATH}/system/tokens.json`.

**Brief:** Read `{PROJECT_PATH}/brief/INDEX.md` → load scope and adaptations.

**Research:** Read `{PROJECT_PATH}/research/INDEX.md` → load `reference-specs.md` (to verify specs were followed).

**Critique:** Read `{PROJECT_PATH}/critique/INDEX.md` → load prioritized-fixes and accessibility-fixes (to verify they were addressed).

**Codebase:** Scan actual codebase for implemented components (when `implementation_target` is not `figma`).

## Step 2: Spawn reviewer

Spawn the `gsp-reviewer` agent with:
- Build output (CODE.md + component files)
- Design chunks
- Brand system chunks + tokens.json
- Plan chunks
- Critique fixes (to verify resolution)
- The Deliverable Reviewer prompt (11)
- The review output template
- **Output path:** `{PROJECT_PATH}/review/`

The agent writes chunks directly:
- `review/acceptance-report.md`
- `review/issues.md`
- `review/INDEX.md`

## Step 3: Write exports

Update `{PROJECT_PATH}/exports/INDEX.md`:

```markdown
<!-- BEGIN:review -->
| Section | File |
|---------|------|
| Acceptance Report | [acceptance-report.md](../review/acceptance-report.md) |
| Issues | [issues.md](../review/issues.md) |
<!-- END:review -->
```

## Step 4: Assess results

Read `review/acceptance-report.md` for the verdict:

**Pass:** All screens implemented, tokens used correctly, accessibility compliant.
**Conditional Pass:** Minor issues found, but shippable.
**Fail:** Critical issues — must address before shipping.

## Step 5: Update state

Update `{PROJECT_PATH}/STATE.md`:
- Set Phase 6 (Review) status to `complete` or `needs-revision`
- Record completion date
- If Pass or Conditional Pass: Set Prettiness Level to 100%

## Step 6: Route next

**If Pass/Conditional Pass:**
"Project is fully pretty! All 5 project phases complete. Run `/gsp:launch` if you need marketing campaign assets, or `/gsp:progress` to see the full journey."

**If Fail:**
"Critical issues found. Address the issues in `review/issues.md`, then run `/gsp:review` again."
</process>
</output>
