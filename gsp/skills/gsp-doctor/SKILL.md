---
name: gsp-doctor
description: Check project health — use when: something's broken, check the project, is everything set up right, health check, what's the status of my GSP setup
user-invocable: true
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
   No .design/ directory detected. Run /gsp-start to start.
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

Load `${CLAUDE_SKILL_DIR}/checks.md` — the full check catalog with pass/warn/fail criteria. Read it once at this step; do not load it before Step 2 because the applicable check sets depend on what was scanned.

Run only the sets applicable to the detected state:

| Detected | Run |
|----------|-----|
| Each brand instance | B1, B2, B3, B4 |
| Each project instance | P1–P10 |
| Always (installation) | I1, I2, I3, I4, I5 |
| Project has `implementation_target: shadcn` and `.design/system/STACK.md` exists | S1–S5 |
| Multiple projects reference the same brand | X1 |

For each check, record the verdict (PASS/WARN/FAIL/INFO) plus a short instance-tagged message for issues.

**De-duplication:** if the same underlying issue is caught by multiple checks, only report it once — keep it in the most specific check.

## Step 4: Calculate health score

Score per instance (100 points each):
- Each FAIL: -15 points
- Each WARN: -5 points
- Each INFO: 0 points
- Minimum: 0

Overall score: average of all instance scores.

## Step 5: Display diagnostic

Render to terminal only (no file writes). One section per instance, then installation, stack, cross-instance, then issues, then summary.

```
🩺 GSP Doctor — Project Health Check
═══════════════════════════════════════

Brands: {N} found
Projects: {N} found

Overall Health: {SCORE}/100 {emoji}
{health bar}

─── Brand: {name} ─────────────────────
  Phases: {N}/4 complete
  {check ID}. {short label} ............ {PASS|WARN|FAIL}
  ...

─── Project: {name} (brand: {brand}) ──
  Phases: {N}/6 complete
  P1. Structure .................. {verdict}
  ... (P2–P10)

─── Installation Health ───────────────
  I1. Skills invocable ........... {verdict}
  ... (I2–I5)

─── Stack Compliance (shadcn) ─────────   (only if S checks ran)
  S1–S5. Stack compliance ........ {aggregate verdict}

─── Cross-Instance ────────────────────
  X1. Brand Consistency .......... {verdict}

─── Issues Found ──────────────────────

FAIL:
  • [{instance}/{check}] {message}
    → Fix: {suggested command}

WARN:
  • [{instance}/{check}] {message}
    → Fix: {suggested command}

INFO:
  • [{instance}/{check}] {message}

─── Summary ───────────────────────────

{summary line based on score band}
```

**Verdict glyphs:** ✅ PASS · ⚠️ WARN · ❌ FAIL · ℹ️ INFO
**Health emoji:** 90–100: 💚 · 70–89: 💛 · 50–69: 🟠 · 0–49: ❤️
**Health bar:** 20-char using █ and ░.

**Summary lines by score band:**
- `≥ 90` — "Project is healthy. Ship it! 🚀"
- `70–89` — "Project has minor issues. Address warnings when convenient."
- `50–69` — "Project needs attention. Fix the warnings above."
- `< 50` — "Project has significant issues. Address failures first."

## Important Notes

- **Read-only** — do NOT modify any files
- **No agents** — run all checks directly, this is deterministic pattern matching
- **Terminal only** — no file output, all results printed to terminal
- **Be specific** — every issue names the exact file and suggests the exact command to fix it
- **Don't over-report** — if the same issue is caught by multiple checks, only report it once (in the most specific check)
</process>
