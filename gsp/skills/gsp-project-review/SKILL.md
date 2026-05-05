---
name: gsp-project-review
description: QA review — validate implementation against designs — use when: review the build, QA this, does it match the designs, check what was built, verify implementation
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
Phase 6 of the GSP project diamond. QA validates that the actual codebase implementation matches the design intent — checking real source files for token usage, screen coverage, component quality, and accessibility compliance.

Works with the dual-diamond architecture: reads brand system from `.design/branding/{brand}/patterns/` via `brand.ref`, reads/writes project assets in `.design/projects/{project}/`.
</context>

<objective>
QA validate the codebase implementation against design intent.

**Input:** BUILD-LOG.md + actual codebase files + `git diff` + design chunks + brand system
**Output:** `{project}/review/` (acceptance-report.md + issues.md + INDEX.md) + exports/INDEX.md update
**Agent:** `gsp-project-reviewer`
</objective>

<execution_context>
@${CLAUDE_SKILL_DIR}/../../templates/phases/review.md
</execution_context>

<process>
## Step 0: Resolve project and brand

If `.design/projects/` does not exist: output "No GSP project found. Run `/gsp-start` to begin." and stop.

Resolve project from `.design/projects/` (one → use it, multiple → ask). Set `PROJECT_PATH`.

Read `{PROJECT_PATH}/brand.ref` → set `BRAND_PATH`.

## Step 1: Load context

Read `{PROJECT_PATH}/config.json` to get `implementation_target`, `design_scope`, `codebase_type`.

**Prior code accessibility audit:** Check if `{PROJECT_PATH}/review/accessibility-audit.md` exists from a prior `/gsp-accessibility-audit --code` run. If yes, load it — the reviewer will reference these findings instead of performing inline a11y checks.

### Load all artifacts

**Build log:** Read `{PROJECT_PATH}/build/BUILD-LOG.md` — what the builder says was implemented (files created, files modified, component map).

**Actual codebase:** Read the files listed in BUILD-LOG.md. Use Grep/Glob to find and verify actual source files.

**Git diff:** Run `git diff` (and `git diff --cached`) to see what actually changed in the codebase. Cross-reference against BUILD-LOG.md.

**Design:** Read `{PROJECT_PATH}/design/INDEX.md` → load all screen chunks.

**Brand patterns:** Read `{BRAND_PATH}/patterns/INDEX.md` → load foundation + component chunks.
Also read `{BRAND_PATH}/patterns/{brand-name}.yml` (the brand's token/style source of truth).

**Brand identity (selective):** Read `{BRAND_PATH}/identity/imagery-style.md` (if exists) — needed for imagery audit.

**Brief:** Read `{PROJECT_PATH}/brief/INDEX.md` → load scope and adaptations.

**Research:** Read `{PROJECT_PATH}/research/INDEX.md` → load `reference-specs.md` (to verify specs were followed).

**Critique:** Read `{PROJECT_PATH}/critique/INDEX.md` → load prioritized-fixes and accessibility-fixes (to verify they were addressed).

**Codebase context:** Read `.design/system/COMPONENTS.md` (if exists) — what existed before build. Read `{PROJECT_PATH}/codebase/MANIFEST.md` (if exists) — what build claims it produced. Cross-reference both against BUILD-LOG.md and actual git diff.

## Step 1.5: Scope check

**If `design_scope` is `tokens`:**
1. Run token-audit-only review: verify token naming, scale consistency, contrast ratios, and brand alignment. Skip screen coverage and component coverage checks.
2. Write `{PROJECT_PATH}/review/acceptance-report.md` (token-focused verdict) and `{PROJECT_PATH}/review/issues.md` (token issues only)
3. Write `{PROJECT_PATH}/review/INDEX.md`
4. Update `{PROJECT_PATH}/exports/INDEX.md` between `<!-- BEGIN:review -->` and `<!-- END:review -->` with populated table
5. Update `{PROJECT_PATH}/STATE.md` — set Phase 6 (Review) to `complete` or `needs-revision`
6. Route: display verdict or re-run `/gsp-project-review`
7. **Stop here**

## Step 1.8: Load agent methodology

Read `${CLAUDE_SKILL_DIR}/methodology/gsp-project-reviewer.md`. Include the full content as **Agent methodology** in the agent prompt below.

## Step 2: Spawn reviewer

Spawn the `gsp-project-reviewer` agent with:
- **Agent methodology** (loaded in Step 1.8)
- BUILD-LOG.md contents
- Actual codebase file paths (from BUILD-LOG.md)
- `git diff` output
- Design chunks
- Brand system chunks + `{brand-name}.yml`
- Brief chunks
- Critique fixes (to verify resolution)
- `.design/system/COMPONENTS.md` (when exists — to verify existing components weren't broken)
- MANIFEST.md (when exists — to verify build claims match reality)
- `codebase_type` from config.json
- Review output template (from execution_context)
- **Output path:** `{PROJECT_PATH}/review/`
- Prior code accessibility findings (if `{PROJECT_PATH}/review/accessibility-audit.md` exists — tell reviewer to reference these instead of performing inline a11y checks; reviewer keeps inline checks as fallback if no prior audit exists)
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

If Pass or Conditional Pass, update `.design/CLAUDE.md` — replace the existing `### {project-name}` entry (written by gsp-project-brief when started) with the completed entry:

```markdown
### {project-name} · complete · {DATE}
brand: {brand-name} · .design/projects/{project-name}/
```

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

Invoke `/gsp-phase-transition` with phase `review` and output directory `{PROJECT_PATH}/review/`.

If review identified brand-level issues (token values that don't work in context), note: "Some issues are brand-level — run `/gsp-brand-refine` to adjust tokens without re-running identity."
</process>
