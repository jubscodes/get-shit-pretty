---
name: gsp-accessibility-audit
description: Full WCAG accessibility audit — design screens, codebase, or generate compliance statement
user-invocable: true
allowed-tools:
  - Read
  - Write
  - Edit
  - Bash
  - Agent
  - Glob
  - Grep
  - AskUserQuestion
---
<context>
Full accessibility audit skill that spawns the `gsp-accessibility-auditor` agent for deep WCAG analysis. Works two ways:
1. **Standalone** — user runs `/gsp-accessibility-audit` directly for design, code, or statement generation
2. **As a building block** — critique and review phases detect prior accessibility output and reuse it

For quick contrast checks or token audits, use `/gsp-accessibility` instead.

Follows the composable pattern: deterministic modes, predictable output paths, filesystem as integration layer.
</context>

<objective>
Run full accessibility audits — design screen reviews, codebase ARIA/keyboard/semantic checks, or compliance statement generation.

**Input:** Mode flag + optional arguments
**Output:** Audit chunks and fix lists in the appropriate project directory
**Agent:** `gsp-accessibility-auditor` (for design and code modes), inline for statement
</objective>

<rules>
- Always use `AskUserQuestion` for user interaction — never prompt via plain text
- One decision per question — never batch multiple questions in a single message
- Statement mode reads prior audit results — fails gracefully if none exist
- Default conformance level is AA unless overridden by `--level AAA` or config
- Foundation chunks follow `chunk-format.md` format
</rules>

<process>
## Step 1: Parse invocation

Read `$ARGUMENTS` to determine the mode:

| Input | Mode | Agent? | Output |
|-------|------|--------|--------|
| (no args) | Design audit on `.design/` chunks | Yes (`gsp-accessibility-auditor`) | `critique/accessibility-audit.md` + `accessibility-fixes.md` |
| `--code` | Codebase audit: ARIA, keyboard, semantic HTML | Yes (`gsp-accessibility-auditor`) | `review/accessibility-audit.md` + `accessibility-fixes.md` |
| `--statement` | Generate accessibility statement from prior audits | No (inline) | `exports/accessibility-statement.md` |

Additional flag: `--level AAA` overrides conformance level (default: AA).

## Step 2: Resolve context

Resolve project from `.design/projects/` (one → use it, multiple → ask). Set `PROJECT_PATH`.

Read `{PROJECT_PATH}/config.json` to get:
- `accessibility_level` — override conformance level (if not set via `--level` flag)
- `implementation_target` — needed for code mode

Read `{PROJECT_PATH}/brand.ref` to resolve brand path:
- Set `BRAND_PATH` = `.design/branding/{brand}`

Determine final conformance level:
1. `--level` flag (highest priority)
2. `accessibility_level` from config.json
3. Default: "WCAG 2.2 AA"

## Step 3: Design audit mode (default, no flags)

Verify design chunks exist:
- Read `{PROJECT_PATH}/design/INDEX.md` to find screen chunks
- If no design chunks, tell user to complete design phase first and stop

### Load references and agent methodology
Read these files and hold their content for inlining into the agent prompt:
- `${CLAUDE_SKILL_DIR}/wcag-checklist.md` — WCAG checklist reference
- `${CLAUDE_SKILL_DIR}/methodology/gsp-accessibility-auditor.md` — agent methodology

### Spawn agent

Spawn `gsp-accessibility-auditor` with:
- All design chunks from `{PROJECT_PATH}/design/`
- Brand identity context (color system, typography)
- Brand system context (tokens, components)
- Conformance level
- **Content of** WCAG checklist reference (loaded above)
- **Agent methodology** (loaded above)
- **Output path:** `{PROJECT_PATH}/critique/`
- **Instructions:** "Audit all design screens against {level}. Write `accessibility-audit.md` and `accessibility-fixes.md` to the output path."

### Completion

Display result:

```
  /gsp-accessibility-audit — design audit complete
  ═══════════════════════════════════════

  {PROJECT_PATH}/critique/
  ├── accessibility-audit.md
  └── accessibility-fixes.md

  ─────────────────────────────────────
```

Use `AskUserQuestion`:
- **Run token audit** — "run `/gsp-accessibility --tokens` to check design token contrast pairs"
- **Continue to build** — "implement designs in the codebase"
- **View audit** — "read the accessibility report"
- **Done** — "that's all for now"

## Step 4: Code audit mode (`--code`)

Determine codebase scope:
- Read `{PROJECT_PATH}/config.json` for `implementation_target`
- If build phase completed, read `{PROJECT_PATH}/build/BUILD-LOG.md` for file paths
- Otherwise, use `implementation_target` to determine where to look

### Spawn agent

Spawn `gsp-accessibility-auditor` with:
- Codebase paths to audit
- Brand system tokens (for contrast verification against hardcoded values)
- Conformance level
- **Content of** WCAG checklist reference (loaded in Step 3)
- **Agent methodology** (loaded in Step 3)
- **Output path:** `{PROJECT_PATH}/review/`
- **Instructions:** "Code audit mode. Use Grep and Glob to find accessibility issues in the codebase. Check ARIA, keyboard handlers, semantic HTML, heading hierarchy, alt text, lang attributes, skip-nav, focus management. Write `accessibility-audit.md` and `accessibility-fixes.md` to the output path with actual file paths and line numbers."

### Completion

Display result:

```
  /gsp-accessibility-audit --code — code audit complete
  ═══════════════════════════════════════

  {PROJECT_PATH}/review/
  ├── accessibility-audit.md
  └── accessibility-fixes.md

  ─────────────────────────────────────
```

Use `AskUserQuestion`:
- **Fix issues** — "address the accessibility issues found"
- **Generate statement** — "create an accessibility statement"
- **View audit** — "read the code accessibility report"
- **Done** — "that's all for now"

## Step 5: Statement mode (`--statement`)

Read prior audit results:
- `{PROJECT_PATH}/critique/accessibility-audit.md`
- `{PROJECT_PATH}/critique/accessibility-token-audit.md`
- `{PROJECT_PATH}/review/accessibility-audit.md`

If none exist, tell the user to run an audit first and stop.

### Generate statement

Write `{PROJECT_PATH}/exports/accessibility-statement.md`:

```markdown
# Accessibility Statement

> Project: {name} | Generated: {DATE}

---

## Conformance Status

**Target:** {level}
**Status:** {Partially Conformant / Fully Conformant}

This {project description} has been evaluated against {level} standards.

## Scope

{Brief description of what was audited — design, code, or both}

## Known Limitations

{List from audit findings — critical/major issues not yet resolved}

- {Issue}: {brief description} — {planned resolution or workaround}

## Testing Methodology

- Design audit: WCAG 2.2 checklist review of all screens
- Token audit: Automated contrast ratio verification of all semantic color pairs
- Code audit: Manual and grep-based review of ARIA, keyboard, semantic HTML
- Tools used: {list from testing methodology}

## Feedback

If you encounter accessibility barriers, please contact:

- **Email:** [placeholder@example.com]
- **Response time:** [X business days]

## Assessment Date

Last reviewed: {DATE}
```

### Completion

Display result and use `AskUserQuestion`:
- **View statement** — "read the accessibility statement"
- **Done** — "that's all for now"

## Step 6: Update STATE.md

If within a project and files were written:
- Read `{PROJECT_PATH}/STATE.md`
- Note accessibility audit completion in the relevant phase section
- Do not change phase status — accessibility is a supplementary check
</process>
