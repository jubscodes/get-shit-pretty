---
name: gsp-housekeeping
description: Quick drift-catching pass — find and fix version mismatches, stale references, count drift, and terminology rot after moderate changes. Run often.
allowed-tools:
  - Read
  - Edit
  - Glob
  - Grep
  - Bash
argument-hint: "[fix|check] default: check (dry run)"
disable-model-invocation: true
---
<context>
Lightweight housekeeping for GSP maintainers. Unlike `/gsp-audit` (comprehensive, read-only, 30+ checks), this skill catches the **most common drift** after a moderate development session and offers to fix it.

Run this often — after adding/removing skills or agents, after architecture changes, after version bumps. Think of it as a linter, not a test suite.

Source layout reference:
- `gsp/skills/` — skills (SKILL.md files)
- `gsp/agents/` — agents (gsp-*.md files)
- `gsp/prompts/` — system prompts
- `gsp/templates/` — config, state, brief, roadmap templates
- `gsp/references/` — shared reference material
- `.claude-plugin/plugin.json` — plugin manifest
- `bin/install.js` — multi-runtime installer
- `VERSION`, `package.json` — version sources
- `CLAUDE.md` — project instructions (references counts)
</context>

<objective>
Scan for common drift patterns. In `check` mode (default), report issues. In `fix` mode, apply fixes with user confirmation.
</objective>

<process>

## Step 0: Parse mode

`$ARGUMENTS`:
- **`check`** or empty — dry run, report only
- **`fix`** — report and fix each issue (confirm before editing)

## Step 1: Gather counts

Run in parallel:

```bash
# Actual counts from filesystem
SKILL_COUNT=$(ls -d gsp/skills/gsp-*/SKILL.md 2>/dev/null | wc -l | tr -d ' ')
AGENT_COUNT=$(ls gsp/agents/gsp-*.md 2>/dev/null | wc -l | tr -d ' ')
PROMPT_COUNT=$(ls gsp/prompts/*.md 2>/dev/null | wc -l | tr -d ' ')
echo "skills=$SKILL_COUNT agents=$AGENT_COUNT prompts=$PROMPT_COUNT"
```

```bash
# Versions from all sources
cat VERSION
node -e "process.stdout.write(require('./package.json').version)"
echo
node -e "process.stdout.write(require('./.claude-plugin/plugin.json').version)"
echo
node -e "process.stdout.write(require('./gsp/templates/projects/config.json').gsp_version)"
echo
node -e "process.stdout.write(require('./gsp/templates/branding/config.json').gsp_version)"
```

## Step 2: Version sync

Check that all 5 version sources agree: VERSION, package.json, plugin.json, projects/config.json, branding/config.json.

Any mismatch → drift issue. The VERSION file is the source of truth.

**Fix:** update the mismatched files to match VERSION.

## Step 3: Count drift in CLAUDE.md

Grep CLAUDE.md for counts like "21 skills", "15 agents", "12 prompts". Compare against actual filesystem counts from Step 1.

Any mismatch → drift issue.

**Fix:** update the numbers in CLAUDE.md. Also check the installer table row counts if they reference specific numbers.

## Step 4: Stale terminology

Grep across `gsp/skills/`, `gsp/agents/`, `gsp/prompts/`, `gsp/templates/`, and `bin/install.js` comments for:

```
# Stale "commands" references (should be "skills")
pattern: "commands/" or "command " (in context of GSP structure, not generic English)
files: gsp/**/*.md, bin/install.js (comments only)

# Old phase count (5 phases → 4 phases for branding)
pattern: "5 phases" or "five phases" near "brand" context
files: gsp/**/*.md

# Old invocation syntax in source
pattern: /gsp- (hyphen, not colon) in gsp/ source files
files: gsp/**/*.md (should be /gsp: in source, runtimes convert)
```

Be careful with false positives:
- "commands" in generic English context is fine
- `/gsp-` is correct in OpenCode/Gemini context (runtime conversion)
- "5" near branding that isn't about phase count is fine

**Fix:** replace stale terms with current equivalents.

## Step 5: Installer comment drift

Check `bin/install.js` for comments that reference outdated structure:
- References to "commands/" directory
- Outdated count comments
- Stale function descriptions

Only check **comments** (lines starting with `//` or inside `/* */`), not code logic — code correctness is `/gsp-audit`'s job.

**Fix:** update the comments.

## Step 6: Working tree hygiene

```bash
git status --short
```

Flag:
- Modified files that look like they belong to a previous chore session
- Untracked files in `dev/` that should be committed or gitignored
- Modified files outside the expected working area

This is informational only — don't auto-fix git state.

## Step 7: Report

Output a compact report:

```
  /gsp-housekeeping check
  ═══════════════════════════════════════

  Versions
    ✓ VERSION, package.json, plugin.json    0.5.0
    ✗ projects/config.json                  0.4.2 → 0.5.0
    ✗ branding/config.json                  0.4.3 → 0.5.0

  Counts
    ✓ skills                                21 (CLAUDE.md says 21)
    ✗ agents                                16 (CLAUDE.md says 15)
    ✓ prompts                               12 (CLAUDE.md says 12)

  Stale references
    ✗ gsp-start/SKILL.md:18                "5 phases" → "4 phases"
    ✗ gsp-update/SKILL.md:63               "commands/gsp/*" → "skills/gsp-*"
    ✗ bin/install.js:1017                   comment references "commands/"

  Working tree
    M bin/install.js                        (modified, unstaged)
    ?? dev/skills/gsp-dev/                  (untracked)

  ─────────────────────────────────────
  5 issues found. Run /gsp-housekeeping fix to apply fixes.
```

In `fix` mode, after the report, walk through each fixable issue:
1. Show the exact change (old → new, with file and line)
2. Apply the edit
3. Confirm it was applied

After all fixes, re-run the checks to confirm clean state.

## Important notes

- **Fast** — no network calls, no issue fetching, no deep analysis. Pure filesystem checks.
- **Safe** — in `check` mode, reads only. In `fix` mode, edits only the specific drift patterns.
- **Complementary to audit** — this catches the 80% of drift that happens day-to-day. Run `/gsp-audit` for the full picture before releases.
- **Don't fix code logic** — only fix metadata, comments, counts, and references. Code correctness is out of scope.

</process>
