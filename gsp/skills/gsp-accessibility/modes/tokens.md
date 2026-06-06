# Mode: `--tokens`

Audit a brand's `.yml` preset + identity tokens for WCAG compliance. Writes a foundation chunk to `critique/accessibility-token-audit.md`. Loaded on demand by `gsp-accessibility/SKILL.md` when invoked with `--tokens`.

## Resolve context

Resolve project from `.design/projects/` (one → use it, multiple → ask). Set `PROJECT_PATH`.

Read `{PROJECT_PATH}/config.json` to get:
- `accessibility_level` — override conformance level (if not set via `--level` flag)

Read `{PROJECT_PATH}/brand.ref` to resolve brand path:
- Set `BRAND_PATH` = `.design/branding/{brand}`

Determine final conformance level:
1. `--level` flag (highest priority)
2. `accessibility_level` from config.json
3. Default: "WCAG 2.2 AA"

## Read token and palette files

Read from the brand/project:
- `{BRAND_PATH}/identity/palettes.json`
- `{BRAND_PATH}/identity/color-system.md`
- `{BRAND_PATH}/patterns/*.yml` (brand style preset)
- `{BRAND_PATH}/identity/typography.md`

If files don't exist, report which are missing and stop.

## Token checks

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

## Write output

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

## Completion

Display result and use `AskUserQuestion`:
- **Run design audit** — "run `/gsp-accessibility --design` for full WCAG screen review"
- **Run code audit** — "run `/gsp-accessibility --code` to check the codebase"
- **Done** — "that's all for now"
