---
name: gsp-accessibility
description: Quick contrast checks and token WCAG audits — inline, no agent
user-invocable: true
allowed-tools:
  - Read
  - Write
  - Bash
  - Glob
  - Grep
  - AskUserQuestion
---
<context>
Standalone composable accessibility skill. Works two ways:
1. **Standalone** — user runs `/gsp-accessibility` directly for quick contrast checks or token audits
2. **As a building block** — critique and review phases detect prior accessibility output and reuse it

Follows the composable pattern: deterministic modes, predictable output paths, filesystem as integration layer.

For full design audits, code audits, or statement generation, use `/gsp-accessibility-audit`.
</context>

<objective>
Run lightweight accessibility checks inline — contrast ratio lookups and token WCAG verification.

**Input:** Mode flag + optional arguments
**Output:** Display output (check mode) or audit chunk (token mode)
**Agent:** None — this skill runs entirely inline
</objective>

<rules>
- Always use `AskUserQuestion` for user interaction — never prompt via plain text
- One decision per question — never batch multiple questions in a single message
- Quick check mode (`--check`) produces display output only — no files written
- Token audit mode runs inline — no agent spawned
- Default conformance level is AA unless overridden by `--level AAA` or config
- Foundation chunks follow `chunk-format.md` format
</rules>

<process>
## Step 1: Parse invocation

Read `$ARGUMENTS` to determine the mode:

| Input | Mode | Output |
|-------|------|--------|
| `--check #FG #BG` | Quick contrast check | Display only |
| `--tokens` | Token-only: contrast pairs, sizing, spacing | `critique/accessibility-token-audit.md` |
| `--validate <yml-path>` | Pre-emit gate: validate a brand `.yml` for WCAG compliance | Exit 0 (pass) / exit 1 (fail) — failures to stdout, no file writes |
| (no args) | Mode picker | Prompt user |

Additional flag: `--level AAA` overrides conformance level (default: AA).

## Step 2: Route by mode

### No args → mode picker

If no arguments provided, use `AskUserQuestion`:

**"What would you like to do?"**
- **Quick contrast check** — "check specific color pairs for WCAG contrast compliance"
- **Token audit** — "audit brand `.yml` tokens for WCAG compliance"
- **Full design/code audit** — "run `/gsp-accessibility-audit` for full WCAG audits, code audits, or statement generation"

If user picks "Full design/code audit", tell them to run `/gsp-accessibility-audit` and stop.

### Quick check mode (`--check`)

If args contain `--check`, extract the two hex color values and skip to Step 3.

### Token audit mode (`--tokens`)

Skip to Step 4.

### Validate mode (`--validate <yml-path>`)

Skip to Step 4.5.

## Step 3: Quick check mode (`--check #FG #BG`)

Calculate WCAG 2.x contrast ratio between the two hex colors.

### Contrast ratio formula

Convert hex to relative luminance (sRGB linearization), then:
`ratio = (L_lighter + 0.05) / (L_darker + 0.05)`

### Display results

```
  /gsp-accessibility — contrast check
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

### Resolve context

Resolve project from `.design/projects/` (one → use it, multiple → ask). Set `PROJECT_PATH`.

Read `{PROJECT_PATH}/config.json` to get:
- `accessibility_level` — override conformance level (if not set via `--level` flag)

Read `{PROJECT_PATH}/brand.ref` to resolve brand path:
- Set `BRAND_PATH` = `.design/branding/{brand}`

Determine final conformance level:
1. `--level` flag (highest priority)
2. `accessibility_level` from config.json
3. Default: "WCAG 2.2 AA"

### Read token and palette files

Read from the brand/project:
- `{BRAND_PATH}/identity/palettes.json`
- `{BRAND_PATH}/identity/color-system.md`
- `{BRAND_PATH}/patterns/*.yml` (brand style preset)
- `{BRAND_PATH}/identity/typography.md`

If files don't exist, report which are missing and stop.

### Token checks

**4.1 Contrast Pairs:**
- Extract every semantic foreground/background pair from the brand `.yml` preset
- Calculate WCAG 2.x contrast ratio for each pair
- Flag failures: normal text < 4.5:1, large text < 3:1, non-text < 3:1

**4.2 Interactive States:**
- Check hover, active, focus, disabled state color pairs
- Verify disabled states still meet 3:1 non-text contrast

**4.3 Focus Ring:**
- Find focus ring token — check >= 3:1 contrast against adjacent backgrounds
- Verify ring width >= 2px

**4.4 Dark Mode:**
- If dark mode tokens exist, re-verify all contrast pairs
- Dark mode is a separate verification pass, not assumed from light mode

**4.5 Touch Targets:**
- Check button/link sizing tokens >= 44px for primary actions, >= 24px minimum
- Check spacing tokens between adjacent interactive elements

**4.6 Typography Minimums:**
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
- **Run full design audit** — "run `/gsp-accessibility-audit` for full WCAG design audit"
- **Run code audit** — "run `/gsp-accessibility-audit --code` to check the codebase"
- **Done** — "that's all for now"

## Step 4.5: Validate mode (`--validate <yml-path>`)

Pre-emit gate for `gsp-brand-guidelines` (and any caller that needs a yes/no contrast verdict on a brand `.yml` without project context).

**Differs from `--tokens`:** no project resolution, no file writes, returns exit code instead of writing a chunk. Use when you need a hard PASS/FAIL gate before downstream emission.

### Inputs

- `<yml-path>` — absolute or relative path to a brand `.yml` preset (e.g. `.design/branding/{brand}/patterns/{brand-name}.yml`)
- `--level AA|AAA` — optional conformance override (default: AA)

### Checks (subset of `--tokens`, contrast-only)

Reuse the contrast logic from Step 4 (sections 4.1, 4.2, 4.3):

1. **Contrast pairs** — every semantic foreground/background pair from the `.yml`. Flag failures: normal text < 4.5:1 (AA) or < 7:1 (AAA), large text < 3:1 (AA) or < 4.5:1 (AAA), non-text < 3:1
2. **Interactive states** — hover/active/focus/disabled pairs. Disabled states still need 3:1 non-text contrast
3. **Focus ring** — `--ring` token vs adjacent backgrounds, ≥ 3:1
4. **Dark mode** — if `dark_mode.color` exists, re-verify all pairs

Skip the `--tokens` extras (touch targets, typography minimums) — those are not contrast gates.

### Output

**On pass** — print one line to stdout, exit 0:

```
✓ /gsp-accessibility --validate {yml-name} — N pairs checked, all WCAG 2.2 {level} compliant
```

**On fail** — print failing pairs + exit 1:

```
✗ /gsp-accessibility --validate {yml-name} — {M} contrast failure(s) (WCAG 2.2 {level})

  Failures:
    {token-pair}      ratio {N.N}:1   required {required}:1   ({use-case})
    {token-pair}      ratio {N.N}:1   required {required}:1   ({use-case})
    ...

  Fix via: /gsp-brand-refine "{token-name} contrast"
```

**No file writes.** This mode is a callable gate — output goes to stdout, exit code carries the verdict. Stop here; no AskUserQuestion routing.

## Step 5: Update STATE.md

If within a project and files were written:
- Read `{PROJECT_PATH}/STATE.md`
- Note accessibility audit completion in the relevant phase section
- Do not change phase status — accessibility is a supplementary check
</process>
