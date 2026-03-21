---
name: accessibility
description: Accessibility audit — contrast checks, WCAG compliance, code audits, token verification
user-invocable: true
allowed-tools:
  - Read
  - Write
  - Bash
  - Agent
  - Glob
  - Grep
  - AskUserQuestion
---
<context>
Standalone composable accessibility skill. Works two ways:
1. **Standalone** — user runs `/gsp:accessibility` directly for design, code, or token audits
2. **As a building block** — critique and review phases detect prior accessibility output and reuse it

Follows the composable pattern: deterministic modes, predictable output paths, filesystem as integration layer.
</context>

<objective>
Run accessibility audits in multiple modes — design, code, tokens, quick check, or statement generation.

**Input:** Mode flag + optional arguments
**Output:** Audit chunks in the appropriate project directory
**Agent:** `gsp-accessibility-auditor` (for design and code modes), inline for tokens/check/statement
</objective>

<execution_context>
@${CLAUDE_SKILL_DIR}/../../prompts/08-accessibility-auditor.md
@${CLAUDE_SKILL_DIR}/../../references/wcag-checklist.md
</execution_context>

<rules>
- Always use `AskUserQuestion` for user interaction — never prompt via plain text
- Quick check mode (`--check`) produces display output only — no files written
- Token audit mode runs inline — no agent spawned
- Statement mode reads prior audit results — fails gracefully if none exist
- Default conformance level is AA unless overridden by `--level AAA` or config
- Foundation chunks follow `references/chunk-format.md` format
</rules>

<process>
## Step 1: Parse invocation

Read `$ARGUMENTS` to determine the mode:

| Input | Mode | Agent? | Output |
|-------|------|--------|--------|
| (no args) | Design audit on `.design/` chunks | Yes (`gsp-accessibility-auditor`) | `critique/accessibility-audit.md` + `accessibility-fixes.md` |
| `--tokens` | Token-only: contrast pairs, sizing, spacing | No (inline) | `critique/accessibility-token-audit.md` |
| `--code` | Codebase audit: ARIA, keyboard, semantic HTML | Yes (`gsp-accessibility-auditor`) | `review/accessibility-audit.md` + `accessibility-fixes.md` |
| `--statement` | Generate accessibility statement from prior audits | No (inline) | `exports/accessibility-statement.md` |
| `--check #FG #BG` | Quick contrast check | No (inline, no files) | Display only |

Additional flag: `--level AAA` overrides conformance level (default: AA).

## Step 2: Resolve context

### Quick check mode (`--check`)

If args contain `--check`, extract the two hex color values and skip to Step 3.

### All other modes

Scan `.design/projects/` for project directories. If only one project exists, use it. If multiple, use `AskUserQuestion` to ask which project.

Set `PROJECT_PATH` = `.design/projects/{project}`

Read `{PROJECT_PATH}/config.json` to get:
- `accessibility_level` — override conformance level (if not set via `--level` flag)
- `implementation_target` — needed for code mode

Read `{PROJECT_PATH}/brand.ref` to resolve brand path:
- Set `BRAND_PATH` = `.design/branding/{brand}`

Determine final conformance level:
1. `--level` flag (highest priority)
2. `accessibility_level` from config.json
3. Default: "WCAG 2.2 AA"

## Step 3: Quick check mode (`--check #FG #BG`)

Calculate WCAG 2.x contrast ratio between the two hex colors.

### Contrast ratio formula

Convert hex to relative luminance (sRGB linearization), then:
`ratio = (L_lighter + 0.05) / (L_darker + 0.05)`

### Display results

```
  /gsp:accessibility — contrast check
  ═══════════════════════════════════════

  Foreground: {FG_HEX}   Background: {BG_HEX}

  WCAG 2.x Contrast Ratio: {ratio}:1

  │ Use Case           │ Required │ Result │
  │─────────────────────│──────────│────────│
  │ Normal text (AA)    │ 4.5:1    │ PASS/FAIL │
  │ Normal text (AAA)   │ 7:1      │ PASS/FAIL │
  │ Large text (AA)     │ 3:1      │ PASS/FAIL │
  │ Large text (AAA)    │ 4.5:1    │ PASS/FAIL │
  │ UI components (AA)  │ 3:1      │ PASS/FAIL │

  ─────────────────────────────────────
```

**Stop here.** No files written. No `AskUserQuestion` routing.

## Step 4: Token audit mode (`--tokens`)

Read token and palette files from the brand/project:
- `{BRAND_PATH}/identity/palettes.json`
- `{BRAND_PATH}/identity/color-system.md`
- `{BRAND_PATH}/system/tokens.json`
- `{BRAND_PATH}/identity/typography.md`

If files don't exist, report which are missing and stop.

### Token checks

**5.1 Contrast Pairs:**
- Extract every semantic foreground/background pair from tokens.json
- Calculate WCAG 2.x contrast ratio for each pair
- Flag failures: normal text < 4.5:1, large text < 3:1, non-text < 3:1

**5.2 Interactive States:**
- Check hover, active, focus, disabled state color pairs
- Verify disabled states still meet 3:1 non-text contrast

**5.3 Focus Ring:**
- Find focus ring token — check >= 3:1 contrast against adjacent backgrounds
- Verify ring width >= 2px

**5.4 Dark Mode:**
- If dark mode tokens exist, re-verify all contrast pairs
- Dark mode is a separate verification pass, not assumed from light mode

**5.5 Touch Targets:**
- Check button/link sizing tokens >= 44px for primary actions, >= 24px minimum
- Check spacing tokens between adjacent interactive elements

**5.6 Typography Minimums:**
- Body text >= 16px (1rem)
- Caption/small text >= 12px
- Line-height >= 1.5 for body text

### Write output

Write `{PROJECT_PATH}/critique/accessibility-token-audit.md` as a foundation chunk:

```markdown
# Accessibility Token Audit

> Phase: critique | Project: {name} | Generated: {DATE}

---

## Summary

{pass_count} pass | {fail_count} fail | {warn_count} warnings

Conformance target: {level}

## Contrast Pairs

| Pair | Foreground | Background | Ratio | Required | Result |
|------|-----------|------------|-------|----------|--------|
| {semantic name} | {fg hex} | {bg hex} | {ratio}:1 | {threshold}:1 | PASS/FAIL |

## Focus Ring
...

## Dark Mode
...

## Touch Targets
...

## Typography
...

## Recommendations

{Prioritized list of fixes}
```

### Completion

Display result and use `AskUserQuestion`:
- **Run full design audit** — "audit design screens for WCAG compliance"
- **Run code audit** — "check the codebase for accessibility issues"
- **Done** — "that's all for now"

## Step 5: Design audit mode (default, no flags)

Verify design chunks exist:
- Read `{PROJECT_PATH}/design/INDEX.md` to find screen chunks
- If no design chunks, tell user to complete design phase first and stop

### Spawn agent

Spawn `gsp-accessibility-auditor` with:
- All design chunks from `{PROJECT_PATH}/design/`
- Brand identity context (color system, typography)
- Brand system context (tokens, components)
- Conformance level
- WCAG checklist reference
- **Output path:** `{PROJECT_PATH}/critique/`
- **Instructions:** "Audit all design screens against {level}. Write `accessibility-audit.md` and `accessibility-fixes.md` to the output path."

### Completion

Display result:

```
  /gsp:accessibility — design audit complete
  ═══════════════════════════════════════

  {PROJECT_PATH}/critique/
  ├── accessibility-audit.md
  └── accessibility-fixes.md

  ─────────────────────────────────────
```

Use `AskUserQuestion`:
- **Run token audit** — "check design token contrast pairs"
- **Continue to build** — "implement designs in the codebase"
- **View audit** — "read the accessibility report"
- **Done** — "that's all for now"

## Step 6: Code audit mode (`--code`)

Determine codebase scope:
- Read `{PROJECT_PATH}/config.json` for `implementation_target`
- If build phase completed, read `{PROJECT_PATH}/build/BUILD-LOG.md` for file paths
- Otherwise, use `implementation_target` to determine where to look

### Spawn agent

Spawn `gsp-accessibility-auditor` with:
- Codebase paths to audit
- Brand system tokens (for contrast verification against hardcoded values)
- Conformance level
- WCAG checklist reference
- **Output path:** `{PROJECT_PATH}/review/`
- **Instructions:** "Code audit mode. Use Grep and Glob to find accessibility issues in the codebase. Check ARIA, keyboard handlers, semantic HTML, heading hierarchy, alt text, lang attributes, skip-nav, focus management. Write `accessibility-audit.md` and `accessibility-fixes.md` to the output path with actual file paths and line numbers."

### Completion

Display result:

```
  /gsp:accessibility --code — code audit complete
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

## Step 7: Statement mode (`--statement`)

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

## Step 8: Update STATE.md

If within a project and files were written:
- Read `{PROJECT_PATH}/STATE.md`
- Note accessibility audit completion in the relevant phase section
- Do not change phase status — accessibility is a supplementary check

## Step 9: Completion output

If not already displayed by a mode-specific step above, display the appropriate completion output and `AskUserQuestion` routing.
</process>
