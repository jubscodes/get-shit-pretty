---
name: gsp:doctor
description: Diagnose project health — check structure, config, outputs, and upgrade status
allowed-tools:
  - Read
  - Glob
  - Grep
  - Bash
---
<context>
Diagnostic tool for GSP design projects. Runs 8 deterministic checks against the `.design/` directory and reports health issues with actionable fix suggestions.

No agents needed — this is pure pattern matching and file inspection.
</context>

<objective>
Run a health check on the current `.design/` project and print a terminal diagnostic.

**Input:** `.design/` directory (all artifacts, config, state)
**Output:** Terminal-only diagnostic — no files written

**8 checks:** project structure, phase ordering, stale outputs, config drift, missing chunks, broken references, review status, upgrade detection
</objective>

<process>
## Step 0: Find project

Check for `.design/config.json` in the current directory.

If not found:
```
🩺 GSP Doctor — No project found
   No .design/ directory detected. Run /gsp:new-project first.
```
Stop here.

## Step 1: Load project state

Read these files (note which are missing — that itself is a finding):
- `.design/config.json` — project configuration
- `.design/STATE.md` — phase progress
- `.design/BRIEF.md` — design brief
- `.design/ROADMAP.md` — phase plan
- `.design/codebase/INVENTORY.md` — codebase inventory (may not exist)
- `.design/exports/INDEX.md` — chunk index (may not exist)

Extract from config.json:
- `codebase_type` (greenfield | boilerplate | existing)
- `design_scope` (full | partial | tokens)
- `system_strategy` (generate | extend | refactor)
- `implementation_target` (code | shadcn | rn-reusables | existing | figma | skip)
- `auto_review` (if present)
- `version` (if present)

Extract from STATE.md:
- Phase statuses (pending, in-progress, complete, needs-revision, skipped)
- Review loop count
- Current phase number

## Step 2: Run 8 checks

Track results as: PASS, WARN, or FAIL per check. Collect issues with fix suggestions.

---

### Check 1: Project Structure

**What it catches:** Missing core files, incomplete setup.

Required files for ALL projects:
- `.design/config.json`
- `.design/STATE.md`
- `.design/BRIEF.md`

Required when `codebase_type` is NOT `greenfield`:
- `.design/codebase/INVENTORY.md`

Check each exists:
- All present → PASS
- INVENTORY.md missing for non-greenfield → WARN: "Codebase inventory missing. Re-run `/gsp:new-project` or create `.design/codebase/INVENTORY.md` manually."
- Core files missing → FAIL: list which are missing, suggest `/gsp:new-project`

---

### Check 2: Phase Ordering

**What it catches:** Phases completed out of order, skipped prerequisites.

Read STATE.md phase table. Check ordering rules:

1. No phase should be `complete` if an earlier required phase is still `pending` (not `skipped` or `complete`)
2. Valid skip scenarios (not violations):
   - Phase 5 (Spec) skipped when `implementation_target` is `skip` or `design_scope` is `tokens`
   - Phase 4 (Design) skipped when `design_scope` is `tokens`
   - Phase 1 (Research) can be skipped (brand can proceed without)
3. Phase 7 (Build) complete but Phase 6 (Review) pending → WARN: "Build completed without review. Run `/gsp:review` to audit."
4. Any other out-of-order completion → FAIL with specifics

All phases in order (or validly skipped) → PASS

---

### Check 3: Stale Outputs

**What it catches:** Output content that doesn't match current config expectations.

Only check phases that are `complete`:

**When `system_strategy` is `extend`:**
- Read `.design/system/SYSTEM.md` — search for "Component Audit" or "KEEP" or "RESTYLE" or "REFACTOR" or "REPLACE"
- If none found → WARN: "Strategy is `extend` but SYSTEM.md lacks component audit table. Re-run `/gsp:system`."

**When `implementation_target` is `shadcn`:**
- If Phase 5 (Spec) is complete, read `.design/specs/SPECS.md` — search for "shadcn" or "npx shadcn"
- If not found → WARN: "Target is `shadcn` but SPECS.md doesn't reference shadcn components. Re-run `/gsp:spec`."

**When `implementation_target` is `rn-reusables`:**
- If Phase 5 is complete, read `.design/specs/SPECS.md` — search for "reusables" or "NativeWind"
- If not found → WARN: "Target is `rn-reusables` but SPECS.md doesn't reference RN Reusables. Re-run `/gsp:spec`."

**When `design_scope` is `tokens`:**
- Phase 4 (Design) should be `skipped`, not `complete`
- Phase 5 (Spec) should be `skipped`, not `complete`
- If either is `complete` → WARN: "Scope is `tokens` but design/spec phases ran as full. Outputs may be unnecessary."

No stale outputs detected → PASS

---

### Check 4: Config Drift

**What it catches:** Config says one thing, outputs reflect another.

**Check `system_strategy` alignment:**
- Config says `extend` but SYSTEM.md contains "## Components" with 30+ component specs (no audit table) → WARN: "Config says `extend` but SYSTEM.md looks like a full `generate`. Config may be out of sync."
- Config says `generate` but SYSTEM.md contains "Component Audit" → WARN: "Config says `generate` but SYSTEM.md contains extend-style audit."

**Check `codebase_type` alignment:**
- Config says `existing` or `boilerplate` but no INVENTORY.md → WARN (already caught by Check 1, don't double-count)
- Config says `greenfield` but INVENTORY.md exists → INFO: "Config says `greenfield` but INVENTORY.md exists. Not an issue, but config may be stale."

**Check `design_scope` alignment:**
- Config says `tokens` but SCREENS.md exists with full screen designs → WARN: "Scope is `tokens` but SCREENS.md has full screen designs."
- Config says `partial` — check BRIEF.md for "Target screens" section. If missing → WARN: "Scope is `partial` but BRIEF.md doesn't specify target screens."

No drift detected → PASS

---

### Check 5: Missing Chunks

**What it catches:** Chunk directories missing, INDEX.md references broken.

**If any phase >= 3 (System) is complete:**

Check if chunked export infrastructure exists:
- `.design/exports/INDEX.md` exists?
- For each complete phase with chunks:
  - System (Phase 3): `.design/system/exports/` directory exists with files?
  - Design (Phase 4): `.design/screens/exports/` directory exists with files?
  - Spec (Phase 5): `.design/specs/exports/` directory exists with files?
  - Review (Phase 6): `.design/review/exports/` directory exists with files?

**If INDEX.md exists, check for broken references:**
- Read INDEX.md, extract all file paths from markdown links
- Check each referenced file exists

Missing export directories for completed phases → WARN: "Phase {N} is complete but has no chunked exports. Re-run `/gsp:{phase}` to generate chunks."
Broken INDEX.md references → WARN: list broken paths
INDEX.md has unpopulated BEGIN/END sections for completed phases → WARN: "INDEX.md has empty sections for completed phases."

No chunks expected yet (no phases >= 3 complete) → PASS
All chunks present and references valid → PASS

---

### Check 6: Broken References

**What it catches:** Cross-file references that point to non-existent content.

**SCREENS.md → SYSTEM.md:**
If both exist, extract component names referenced in SCREENS.md (look for patterns like "Uses: {ComponentName}" or component references in wireframe sections). Check each exists in SYSTEM.md's component section.

Components referenced in screens but not in system → WARN: "SCREENS.md references components not defined in SYSTEM.md: {list}. Re-run `/gsp:system` to add them, or update screen designs."

**SPECS.md → SCREENS.md:**
If both exist, extract screen references from SPECS.md. Check each screen name appears in SCREENS.md.

Screens referenced in specs but not in designs → WARN: "SPECS.md references screens not in SCREENS.md: {list}."

**CRITIQUE.md → SCREENS.md:**
If both exist, extract screen references from CRITIQUE.md. Check each referenced screen exists.

No broken references → PASS

---

### Check 7: Review Status

**What it catches:** Stuck review loops, unaddressed critical issues.

Read STATE.md review loop table:
- Count review iterations
- If > 3 iterations → WARN: "Review has looped {N} times. Consider addressing root causes or accepting current state."

If Phase 6 (Review) status is `needs-revision`:
- Check if any phase after review (Build, Launch) is `complete` → FAIL: "Build/Launch completed while review still needs revision."

If CRITIQUE.md exists:
- Search for "Critical" severity items
- If found and Phase 6 status is `complete` (not `needs-revision`) → INFO: "CRITIQUE.md has critical items but review is marked complete. Verify issues were addressed."

No review issues → PASS

---

### Check 8: Upgrade Detection

**What it catches:** Project created with older GSP version, missing features now available.

Feature markers to check:

**Codebase awareness (v0.3.0):**
- INVENTORY.md exists? (for non-greenfield projects)
- Chunked exports exist? (exports/ directories)
- INDEX.md exists?
- If none of these exist for a project with completed phases >= 3 → WARN: "Project may predate codebase-awareness features (v0.3.0). Consider re-running phases to get chunked exports and codebase integration."

**Config version check:**
- If `version` field exists in config.json, note it
- If version is older than current (0.3.0) → WARN: "Config version is {version}, current GSP is 0.3.0. Some features may not be active."
- If no `version` field → INFO: "Config has no version stamp. Project may predate versioned configs."

**palettes.json check:**
- If Phase 2 (Brand) is complete, check for `.design/brand/palettes.json`
- If missing → INFO: "No tints.dev palettes found. Re-run `/gsp:brand` to generate OKLCH color palettes."

No upgrade concerns → PASS

---

## Step 3: Calculate health score

Score calculation (100 points total):

- Start at 100
- Each FAIL: -15 points
- Each WARN: -5 points
- Each INFO: -0 points (informational only)
- Minimum score: 0

## Step 4: Display diagnostic

Print the full diagnostic to terminal:

```
🩺 GSP Doctor — Project Health Check
═══════════════════════════════════════

Project: {PROJECT_NAME}
Config: codebase_type={X}, scope={X}, strategy={X}, target={X}
Phases: {N}/8 complete

Health Score: {SCORE}/100 {emoji}
{health bar}

─── Check Results ─────────────────────

{For each check, one of:}
  ✅ 1. Project Structure ........... PASS
  ⚠️  2. Phase Ordering ............. WARN
  ❌ 3. Stale Outputs .............. FAIL

─── Issues Found ──────────────────────

{For each WARN/FAIL, grouped by severity:}

FAIL:
  • [Check 3] Strategy is extend but SYSTEM.md lacks component audit.
    → Fix: Re-run /gsp:system

WARN:
  • [Check 5] Phase 3 complete but no chunked exports.
    → Fix: Re-run /gsp:system to generate chunks

INFO:
  • [Check 8] No tints.dev palettes found.
    → Fix: Re-run /gsp:brand to generate OKLCH palettes

─── Summary ───────────────────────────

{If score >= 90:} "Project is healthy. Ship it! 🚀"
{If score >= 70:} "Project has minor issues. Address warnings when convenient."
{If score >= 50:} "Project needs attention. Fix the warnings above."
{If score < 50:}  "Project has significant issues. Address failures first."
```

Health score emoji:
- 90-100: 💚
- 70-89: 💛
- 50-69: 🟠
- 0-49: ❤️

Health bar: 20-char bar using █ and ░, proportional to score.

## Important Notes

- **Read-only** — do NOT modify any files
- **No agents** — run all checks directly, this is deterministic pattern matching
- **Terminal only** — no file output, all results printed to terminal
- **Be specific** — every issue should name the exact file and suggest the exact command to fix it
- **Don't over-report** — if the same issue is caught by multiple checks, only report it once (in the most specific check)
</process>
