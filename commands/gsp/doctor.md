---
name: gsp:doctor
description: Diagnose project health — check structure, config, outputs, and brand drift
allowed-tools:
  - Read
  - Glob
  - Grep
  - Bash
---
<context>
Diagnostic tool for GSP design projects. Runs health checks across all brands in `.design/branding/` and all projects in `.design/projects/`. Reports health issues with actionable fix suggestions.

No agents needed — this is pure pattern matching and file inspection.
</context>

<objective>
Run a health check on the current `.design/` directory and print a terminal diagnostic.

**Input:** `.design/` directory (all brands, projects, artifacts, config, state)
**Output:** Terminal-only diagnostic — no files written

**Checks:** project structure, phase ordering, stale outputs, config drift, missing chunks, broken references, review status, brand drift, upgrade detection
</objective>

<process>
## Step 0: Find design directory

Check for `.design/` in the current directory.

If not found:
```
🩺 GSP Doctor — No project found
   No .design/ directory detected. Run /gsp:new to start.
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

### Per-Brand Checks (5-phase)

**Check B1: Brand Structure**
Required: config.json, STATE.md, BRIEF.md
Required dirs: discover/, strategy/, verbal/, identity/, system/
Missing → FAIL

**Check B2: Brand Phase Ordering**
No phase complete if earlier phase is pending (discover < strategy < verbal < identity < system).
Exception: strategy can proceed without discover.

**Check B3: Brand Completeness**
If all 5 phases complete, check:
- `identity/INDEX.md` exists (chunk format)
- `identity/palettes.json` exists (WARN if missing)
- `system/INDEX.md` exists (chunk format)
- `system/tokens.json` exists (WARN if missing)
- If monolith exists without INDEX.md → WARN: "Legacy monolith format"

**Check B4: Legacy Monolith Detection**
For each brand phase directory (discover, strategy, verbal, identity, system):
- If monolith exists but no INDEX.md → WARN: "Legacy format in {phase}/ — re-run /gsp:{phase} for chunk output"

### Per-Project Checks (6-phase)

**Check P1: Project Structure**
Required: config.json, STATE.md, BRIEF.md, brand.ref
Required dirs: brief/, research/, design/, critique/, build/, review/
Required when non-greenfield: codebase/INVENTORY.md
Legacy detection: if system/, screens/, specs/, plan/ dirs exist → WARN: "Legacy v0.4.0 structure detected — project uses old phase layout"

**Check P2: Brand Reference**
Read brand.ref → check brand exists in `.design/branding/{name}/`
Check brand system is complete (system phase = complete)
WARN if brand referenced but system not complete

**Check P3: Brand Drift**
Read `identity_hash` from brand.ref
If brand identity/IDENTITY.md exists, compute current hash (first 8 chars of md5)
If hashes differ → WARN: "Brand identity has changed since project consumed it. Consider re-running `/gsp:plan`."
If identity_hash is "pending" → INFO: "Brand identity wasn't complete when project was created."

**Check P4: Phase Ordering**
brief < research < design < critique < build < review
Valid skips: design skipped for tokens scope, research can proceed without brief

**Check P5: Stale Outputs**
Same as v0.3.0 checks but reading from project path.

**Check P6: Config Drift**
Same as v0.3.0 but reading from project path.

**Check P7: Missing Chunks**
For each completed project phase (brief, research, design, critique, build, review):
- Check for `{phase}/INDEX.md` — if missing → WARN
- Legacy path detection: if `screens/` exists instead of `design/` → WARN

**Check P8: Review Status**
If review phase complete, check verdict in acceptance-report.md.

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
  Phases: {N}/5 complete
  ✅ B1. Structure .............. PASS
  ✅ B2. Phase Ordering ......... PASS
  ⚠️  B3. Completeness .......... WARN

─── Project: {name} (brand: {brand}) ──
  Phases: {N}/6 complete
  ✅ P1. Structure .............. PASS
  ✅ P2. Brand Reference ........ PASS
  ⚠️  P3. Brand Drift ........... WARN
  ✅ P4. Phase Ordering ......... PASS
  ...

─── Cross-Instance ────────────────────
  ✅ X1. Brand Consistency ...... PASS

─── Issues Found ──────────────────────

FAIL:
  • [acme-website/P1] Missing brand.ref
    → Fix: Re-run /gsp:new to set up project with brand reference

WARN:
  • [acme-corp/B3] No palettes.json found
    → Fix: Re-run /gsp:brand-identity to generate OKLCH palettes

─── Summary ───────────────────────────
{health summary message}
```

Health emoji: 90-100: 💚, 70-89: 💛, 50-69: 🟠, 0-49: ❤️
Health bar: 20-char using █ and ░.

## Important Notes

- **Read-only** — do NOT modify any files
- **No agents** — run all checks directly
- **Terminal only** — no file output
- **Be specific** — every issue names the exact file and suggests the exact command to fix it
</process>
</output>
