---
name: gsp:project-review
description: QA review — validate implementation against designs
allowed-tools:
  - Read
  - Write
  - Bash
  - Task
  - Grep
  - Glob
---
<context>
Phase 6 of the GSP project diamond. QA validates that the actual codebase implementation matches the design intent — checking real source files for token usage, screen coverage, component quality, and accessibility compliance.

Works with the dual-diamond architecture: reads brand system from `.design/branding/{brand}/system/` via `brand.ref`, reads/writes project assets in `.design/projects/{project}/`.
</context>

<objective>
QA validate the codebase implementation against design intent.

**Input:** BUILD-LOG.md + actual codebase files + `git diff` + design chunks + brand system
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

Read `{PROJECT_PATH}/config.json` to get `implementation_target`, `design_scope`, `codebase_type`.

### Load all artifacts

**Build log:** Read `{PROJECT_PATH}/build/BUILD-LOG.md` — what the builder says was implemented (files created, files modified, component map).

**Actual codebase:** Read the files listed in BUILD-LOG.md. Use Grep/Glob to find and verify actual source files.

**Git diff:** Run `git diff` (and `git diff --cached`) to see what actually changed in the codebase. Cross-reference against BUILD-LOG.md.

**Design:** Read `{PROJECT_PATH}/design/INDEX.md` → load all screen chunks.
Fallback: `{PROJECT_PATH}/screens/INDEX.md` (legacy).

**Brand system:** Read `{BRAND_PATH}/system/INDEX.md` → load foundation + component chunks.
Also read `{BRAND_PATH}/system/tokens.json`.

**Brief:** Read `{PROJECT_PATH}/brief/INDEX.md` → load scope and adaptations.

**Research:** Read `{PROJECT_PATH}/research/INDEX.md` → load `reference-specs.md` (to verify specs were followed).

**Critique:** Read `{PROJECT_PATH}/critique/INDEX.md` → load prioritized-fixes and accessibility-fixes (to verify they were addressed).

**Codebase context:** Read `{PROJECT_PATH}/codebase/INVENTORY.md` (if exists) — what existed before build. Read `{PROJECT_PATH}/codebase/MANIFEST.md` (if exists) — what build claims it produced. Cross-reference both against BUILD-LOG.md and actual git diff.

## Step 1.5: Scope check

**If `design_scope` is `tokens`:**
1. Run token-audit-only review: verify token naming, scale consistency, contrast ratios, and brand alignment. Skip screen coverage and component coverage checks.
2. Write `{PROJECT_PATH}/review/acceptance-report.md` (token-focused verdict) and `{PROJECT_PATH}/review/issues.md` (token issues only)
3. Write `{PROJECT_PATH}/review/INDEX.md`
4. Update `{PROJECT_PATH}/exports/INDEX.md` between `<!-- BEGIN:review -->` and `<!-- END:review -->` with populated table
5. Update `{PROJECT_PATH}/STATE.md` — set Phase 6 (Review) to `complete` or `needs-revision`
6. Route: display verdict and suggest `/gsp:launch` or re-run `/gsp:project-review`
7. **Stop here**

## Step 2: Spawn reviewer

Spawn the `gsp-reviewer` agent with:
- BUILD-LOG.md contents
- Actual codebase file paths (from BUILD-LOG.md)
- `git diff` output
- Design chunks
- Brand system chunks + tokens.json
- Brief chunks
- Critique fixes (to verify resolution)
- INVENTORY.md (when exists — to verify existing components weren't broken)
- MANIFEST.md (when exists — to verify build claims match reality)
- `codebase_type` from config.json
- The Deliverable Reviewer prompt (11)
- The review output template
- **Output path:** `{PROJECT_PATH}/review/`
- **Clear instruction:** "Review actual codebase files, not `.design/build/` specs. Use Grep to search for hardcoded values. Use `git diff` to verify changes. Reference actual file paths in issues."

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
- Update `## Screen Build Status` table — set Review Status per screen based on acceptance-report.md findings

### QA loop — if Fail

If verdict is **Fail**:
1. Set Phase 6 (Review) status to `needs-revision`
2. Set Phase 5 (Build) status to `needs-revision`
3. Ensure `review/issues.md` is written with actionable issues

### Finalize git tracking

1. If `git.branch` is set in config.json:
   - Run `gh pr list --head {branch} --json url,number --limit 1` to find an open PR
   - If found, update `git.pr` in config.json and STATE.md `## Git` table
   - If not found, note: "No PR found for branch `{branch}`."
   - If `gh` is not available, skip silently — leave PR field as "—"
2. Include PR link in the CHANGELOG.md entry if available (see format below)

### Update manifest + changelog

1. Update `{PROJECT_PATH}/codebase/MANIFEST.md`:
   - Update Status to `complete` (Pass) or `partial` (Conditional Pass)
   - Populate Branch and PR lines in the manifest header from config.json `git` values
   - Fix component paths if renamed during implementation

2. Append to `.design/CHANGELOG.md`:
   - Add entry with project name, date, brand, scope summary
   - List added/modified components, patterns, file count
   - Link to manifest for detail
   - Use this format:
     ```
     ## [{project-name}] — {DATE}
     > Brand: {brand} | Scope: {one-line scope from BRIEF.md}

     **Added:** {component list, comma-separated}
     **Modified:** {component list, or "—"}
     **Patterns:** {patterns established, comma-separated, or "—"}
     **PR:** [{#number}]({url}) or "—"
     **Files:** {count} files touched → [manifest](./projects/{name}/codebase/MANIFEST.md)
     ```

## Step 6: Phase transition output

Render the phase transition screen (see `references/phase-transitions.md` for ANSI color tokens):

**If Pass/Conditional Pass:**

```
  ◆ review complete — implementation validated

    review/
    ├── acceptance-report.md
    ├── issues.md
    └── INDEX.md

  ──────────────────────────────

  fully pretty.
```

Then use `AskUserQuestion` with 3 options:
- **Launch campaign** — "create launch and marketing assets"
- **View progress** — "see the full dashboard"
- **Done for now** — "pick up later with /gsp:start"

**If Fail:**

```
  ◈ review — QA found issues, needs revision

  ──────────────────────────────
```

Then use `AskUserQuestion` with 3 options:
- **Fix and rebuild** — "address issues in review/issues.md"
- **View issues** — "see the full QA report"
- **Done for now** — "pick up later with /gsp:start"
</process>
