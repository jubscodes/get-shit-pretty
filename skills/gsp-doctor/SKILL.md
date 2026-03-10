---
name: doctor
description: Check project health
disable-model-invocation: true
allowed-tools:
  - Read
  - Glob
  - Grep
  - Bash
---
<context>
Diagnostic tool for GSP design projects. Pure pattern matching — no agents, no file writes.
</context>

<objective>
Health check on `.design/` — all brands and projects. Terminal-only output.

**Checks:** structure, phase ordering, stale outputs, config drift, missing chunks, broken references, review status, brand drift, upgrade detection
</objective>

<process>
## Step 0: Find design directory

Check for `.design/` in the current directory.

If not found:
```
🩺 GSP Doctor — No project found
   No .design/ directory detected. Run /gsp:start to start.
```
Stop here.

## Step 1: Detect structure type

**New dual-diamond structure:** `.design/branding/` or `.design/projects/` exists
**Legacy flat structure:** `.design/config.json` exists at root (not inside branding/ or projects/)
**Empty:** `.design/` exists but has neither

For legacy: run legacy checks (same as v0.3.0 doctor). For new: run multi-instance checks below.

## Step 2: Scan all instances

**Brands:** List all directories in `.design/branding/` that have a `config.json` with `project_type: "brand"`
**Projects:** List all directories in `.design/projects/` that have a `config.json` with `project_type: "design"`

For each instance, read:
- `config.json` — configuration
- `STATE.md` — phase progress
- `BRIEF.md` — brief
- `brand.ref` — brand reference (projects only)

## Step 3: Run checks per instance

### Per-Brand Checks (4-phase)

**Check B1: Brand Structure**
Required: config.json, STATE.md, BRIEF.md
Required dirs: discover/, strategy/, identity/, system/
Missing → FAIL

**Check B2: Brand Phase Ordering**
No phase complete if earlier phase is pending (discover < strategy < identity < system).
Exception: strategy can proceed without discover.

**Check B3: Brand Completeness**
If all 4 phases complete, check:
- `identity/INDEX.md` exists (chunk format)
- `identity/palettes.json` exists (WARN if missing)
- `system/INDEX.md` exists (chunk format)
- `system/tokens.json` exists (WARN if missing)
- If monolith exists without INDEX.md → WARN: "Legacy monolith format"

**Check B4: Legacy Monolith Detection**
For each brand phase directory (discover, strategy, identity, system):
- If monolith exists but no INDEX.md → WARN: "Legacy format in {phase}/ — re-run /gsp:brand-{phase} for chunk output"

### Per-Project Checks (6-phase)

**Check P1: Project Structure**

**What it catches:** Missing core files, incomplete setup.

Required: config.json, STATE.md, BRIEF.md, brand.ref
Required dirs: brief/, research/, design/, critique/, build/, review/

Required when `codebase_type` is NOT `greenfield`:
- codebase/INVENTORY.md

Check each exists:
- All present → PASS
- INVENTORY.md missing for non-greenfield → WARN: "Codebase inventory missing. Re-run `/gsp:start` or create `codebase/INVENTORY.md` manually."
- Core files missing → FAIL: list which are missing, suggest `/gsp:start`

Legacy detection: if system/, screens/, specs/, plan/ dirs exist → WARN: "Legacy structure detected — project uses old phase layout"

**Check P2: Brand Reference**
Read brand.ref → check brand exists in `.design/branding/{name}/`
Check brand system is complete (system phase = complete)
WARN if brand referenced but system not complete

**Check P3: Brand Drift**
Read `identity_hash` from brand.ref
If brand identity/IDENTITY.md exists, compute current hash (first 8 chars of md5)
If hashes differ → WARN: "Brand identity has changed since project consumed it. Consider re-running `/gsp:project-brief`."
If identity_hash is "pending" → INFO: "Brand identity wasn't complete when project was created."

**Check P4: Phase Ordering**

**What it catches:** Phases completed out of order, skipped prerequisites.

Read STATE.md phase table. Check ordering rules:
brief < research < design < critique < build < review

1. No phase should be `complete` if an earlier required phase is still `pending` (not `skipped` or `complete`)
2. Valid skip scenarios (not violations):
   - design skipped when `design_scope` is `tokens`
   - research can proceed without brief
3. build complete but critique pending → WARN: "Build completed without critique. Run `/gsp:project-critique` to audit."
4. Any other out-of-order completion → FAIL with specifics

All phases in order (or validly skipped) → PASS

**Check P5: Stale Outputs**

**What it catches:** Output content that doesn't match current config expectations.

Only check phases that are `complete`. All paths relative to the project instance directory.

**When `system_strategy` is `extend`:**
- Check if brand's `system/` output contains "Component Audit" or "KEEP" or "RESTYLE" or "REFACTOR" or "REPLACE"
- If none found → WARN: "Strategy is `extend` but system output lacks component audit table. Re-run `/gsp:brand-patterns`."

**When `implementation_target` is `shadcn`:**
- If brief phase is complete, check brief/ output for "shadcn" or "npx shadcn"
- If not found → WARN: "Target is `shadcn` but brief doesn't reference shadcn components."

**When `implementation_target` is `rn-reusables`:**
- If brief phase is complete, check brief/ output for "reusables" or "NativeWind"
- If not found → WARN: "Target is `rn-reusables` but brief doesn't reference RN Reusables."

**When `design_scope` is `tokens`:**
- design phase should be `skipped`, not `complete`
- If `complete` → WARN: "Scope is `tokens` but design phase ran as full. Outputs may be unnecessary."

No stale outputs detected → PASS

**Check P6: Config Drift**

**What it catches:** Config says one thing, outputs reflect another.

**Check `system_strategy` alignment:**
- Config says `extend` but brand system output contains "## Components" with 30+ component specs (no audit table) → WARN: "Config says `extend` but system looks like a full `generate`. Config may be out of sync."
- Config says `generate` but brand system output contains "Component Audit" → WARN: "Config says `generate` but system contains extend-style audit."

**Check `codebase_type` alignment:**
- Config says `existing` or `boilerplate` but no INVENTORY.md → WARN (already caught by P1, don't double-count)
- Config says `greenfield` but INVENTORY.md exists → INFO: "Config says `greenfield` but INVENTORY.md exists. Not an issue, but config may be stale."

**Check `design_scope` alignment:**
- Config says `tokens` but design/ has full screen designs → WARN: "Scope is `tokens` but design/ has full screen designs."
- Config says `partial` — check BRIEF.md for "Target screens" section. If missing → WARN: "Scope is `partial` but BRIEF.md doesn't specify target screens."

No drift detected → PASS

**Check P7: Missing Chunks**

**What it catches:** Chunk directories missing, INDEX.md references broken.

For each completed project phase (brief, research, design, critique, build, review):
- Check for `{phase}/INDEX.md` — if missing → WARN: "Phase {phase} is complete but has no INDEX.md. Re-run `/gsp:{command}` to generate chunks."

**If exports/INDEX.md exists, check for broken references:**
- Read INDEX.md, extract all file paths from markdown links
- Check each referenced file exists

Broken INDEX.md references → WARN: list broken paths
INDEX.md has unpopulated BEGIN/END sections for completed phases → WARN: "INDEX.md has empty sections for completed phases."

No chunks expected yet (no phases complete) → PASS
All chunks present and references valid → PASS

Legacy path detection: if `screens/` exists instead of `design/` → WARN

**Check P8: Broken References**

**What it catches:** Cross-file references that point to non-existent content.

**design/ → brand system:**
If both exist, extract component names referenced in design chunks (look for patterns like "Uses: {ComponentName}" or component references). Check each exists in the brand's system output.

Components referenced in designs but not in system → WARN: "Design references components not defined in brand system: {list}. Re-run `/gsp:brand-patterns` to add them, or update designs."

**critique/ → design/:**
If both exist, extract screen references from critique chunks. Check each referenced screen exists in design/.

Screens referenced in critique but not in designs → WARN: "Critique references screens not in design/: {list}."

No broken references → PASS

**Check P9: Review Status**

**What it catches:** Stuck review loops, unaddressed critical issues.

Read STATE.md review loop table:
- Count review iterations
- If > 3 iterations → WARN: "Review has looped {N} times. Consider addressing root causes or accepting current state."

If critique phase status is `needs-revision`:
- Check if any later phase (build, review) is `complete` → FAIL: "Build/Review completed while critique still needs revision."

If critique/ contains chunks with "Critical" severity items:
- If critique phase status is `complete` (not `needs-revision`) → INFO: "Critique has critical items but phase is marked complete. Verify issues were addressed."

No review issues → PASS

**Check P10: Upgrade Detection**

**What it catches:** Project created with older GSP version, missing features now available.

**Config version check:**
- If `version` field exists in config.json, note it
- If version is older than current (0.5.0) → WARN: "Config version is {version}, current GSP is 0.5.0. Some features may not be active."
- If no `version` field → INFO: "Config has no version stamp. Project may predate versioned configs."

**Chunk format check:**
- If any phase is complete but has no INDEX.md and no chunk files → WARN: "Project may predate chunked exports. Consider re-running phases to get chunked output."

**palettes.json check:**
- If brand's identity phase is complete, check for `identity/palettes.json`
- If missing → INFO: "No tints.dev palettes found. Re-run `/gsp:brand-identity` to generate OKLCH color palettes."

No upgrade concerns → PASS

### Cross-Instance Checks

**Check X1: Multiple projects, same brand**
If multiple projects reference the same brand, and brand has changed since any project consumed it → WARN with list of affected projects.

## Step 4: Calculate health score

Score per instance (100 points each):
- Each FAIL: -15 points
- Each WARN: -5 points
- Each INFO: -0 points
- Minimum: 0

Overall score: average of all instance scores.

## Step 5: Display diagnostic

```
🩺 GSP Doctor — Project Health Check
═══════════════════════════════════════

Brands: {N} found
Projects: {N} found

Overall Health: {SCORE}/100 {emoji}
{health bar}

─── Brand: {name} ─────────────────────
  Phases: {N}/4 complete
  ✅ B1. Structure .............. PASS
  ✅ B2. Phase Ordering ......... PASS
  ⚠️  B3. Completeness .......... WARN

─── Project: {name} (brand: {brand}) ──
  Phases: {N}/6 complete
  ✅ P1. Structure .............. PASS
  ✅ P2. Brand Reference ........ PASS
  ⚠️  P3. Brand Drift ........... WARN
  ✅ P4. Phase Ordering ......... PASS
  ✅ P5. Stale Outputs .......... PASS
  ✅ P6. Config Drift ........... PASS
  ✅ P7. Missing Chunks ......... PASS
  ✅ P8. Broken References ...... PASS
  ✅ P9. Review Status .......... PASS
  ✅ P10. Upgrade Detection ..... PASS

─── Cross-Instance ────────────────────
  ✅ X1. Brand Consistency ...... PASS

─── Issues Found ──────────────────────

FAIL:
  • [acme-website/P1] Missing brand.ref
    → Fix: Re-run /gsp:start to set up project with brand reference

WARN:
  • [acme-corp/B3] No palettes.json found
    → Fix: Re-run /gsp:brand-identity to generate OKLCH palettes

INFO:
  • [acme-corp/P10] Config version is 0.3.0, current GSP is 0.5.0
    → Fix: Re-run /gsp:start to upgrade config

─── Summary ───────────────────────────

{If score >= 90:} "Project is healthy. Ship it! 🚀"
{If score >= 70:} "Project has minor issues. Address warnings when convenient."
{If score >= 50:} "Project needs attention. Fix the warnings above."
{If score < 50:}  "Project has significant issues. Address failures first."
```

Health emoji: 90-100: 💚, 70-89: 💛, 50-69: 🟠, 0-49: ❤️
Health bar: 20-char using █ and ░.

## Important Notes

- **Read-only** — do NOT modify any files
- **No agents** — run all checks directly, this is deterministic pattern matching
- **Terminal only** — no file output, all results printed to terminal
- **Be specific** — every issue names the exact file and suggests the exact command to fix it
- **Don't over-report** — if the same issue is caught by multiple checks, only report it once (in the most specific check)
</process>
