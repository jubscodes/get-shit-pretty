# Concerns
> Design System Analysis | Generated: 2026-03-18

## Design Debt

| Issue | File(s) | Severity | Fix Approach |
|-------|---------|----------|--------------|
| Color tier system duplicated between installer and statusline | `bin/install.js` (lines 10-74), `scripts/gsp-statusline.js` (lines 8-74) | Medium | Extract shared color module to `scripts/colors.js` or `gsp/lib/colors.js` and `require()` from both locations |
| Legacy bash installer references removed `commands/` directory | `install.sh` (lines 16-21) | Low | Remove `install.sh` or update to point users to `npx get-shit-pretty`. Already has deprecation notice but still copies from nonexistent `commands/gsp/` |

## Component Fragility

| Issue | File(s) | Severity | Fix Approach |
|-------|---------|----------|--------------|
| Installer is a single 1,847-line file | `bin/install.js` | Medium | Consider splitting into modules: arg parsing, banner, runtime configs, file operations, interactive prompts. Current monolithic structure makes testing harder. |
| Statusline has deeply nested try/catch with silent failures | `scripts/gsp-statusline.js` (multiple `catch (e) {}` blocks) | Low | Add optional debug logging (e.g., `GSP_DEBUG=1`) so silent failures can be diagnosed when statusline shows unexpected output |

## Accessibility Gaps

| Issue | File(s) | Severity | Fix Approach |
|-------|---------|----------|--------------|
| No issue — `NO_COLOR` respected | `bin/install.js`, `scripts/gsp-statusline.js` | N/A | Color tier detection properly handles `NO_COLOR`, `FORCE_COLOR`, and non-TTY environments. This is well-implemented. |

## Token Coverage Gaps

| Category | Status | Details |
|----------|--------|---------|
| Colors | Tokenized | Full semantic palette with 4-tier fallback (truecolor, 256, 16, none) |
| Typography | N/A | Terminal-bound — no font tokens needed |
| Spacing | Not tokenized | Terminal column math is inline; no shared spacing constants |
| Radii | N/A | Terminal rendering — not applicable |
| Shadows | N/A | Terminal rendering — `dim` used for depth |
| Dark mode | N/A | Defers to terminal theme; color choices work on both light and dark terminals |

## Dark Mode Gaps

| Issue | File(s) | Severity | Fix Approach |
|-------|---------|----------|--------------|
| No issues detected | — | N/A | Terminal output inherits the user's terminal color scheme. The ANSI palette uses foreground-only colors (no background hardcoding), so it works on both dark and light terminals. |

## Responsive Gaps

| Issue | File(s) | Severity | Fix Approach |
|-------|---------|----------|--------------|
| Banner sparkle field has minimum width gate but no maximum | `bin/install.js` (line 171) | Low | `sparkleWidth` caps at 34 but the `center()` function handles wide terminals fine. Minor: very narrow terminals (< 40 cols) skip sparkles entirely, which is correct. |

## Naming Inconsistencies

| Issue | File(s) | Severity | Fix Approach |
|-------|---------|----------|--------------|
| No inconsistencies detected | — | N/A | Naming is consistent: `gsp-{kebab-case}` for skills and agents, `kebab-case` for scripts, `{NN}-{kebab-case}` for prompts. Convention is well-enforced by the test suite (contract checks in `dev/scripts/audit-tests.sh`). |

## Summary

- **High severity:** 0
- **Medium severity:** 2 (color system duplication, monolithic installer)
- **Low severity:** 2 (legacy installer, silent error handling)
- **Overall health:** healthy — well-structured codebase with consistent conventions, automated integrity tests, and proper terminal accessibility. Main concern is the installer's size and duplicated color definitions.
