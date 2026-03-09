# Issues

> Phase: review | Project: gsp-cli | Generated: 2026-03-08

---

## Critical Issues

None. No issues block shipping.

---

## Important Issues

| # | Issue | Severity | Location | Expected | Actual | Remediation |
|---|-------|----------|----------|----------|--------|-------------|
| 1 | 256-color token drift | Important | [color-system.js](../build/components/color-system.js) lines 57-68 | Match `tokens.json` 256-color ANSI values | 5 of 8 values diverge (accent: 209 vs 202, text-primary: 254 vs 253, text-secondary: 248 vs 247, success: 41 vs 35, info: 75 vs 69) | Pick one source of truth and update the other. Both are reasonable approximations; the risk is maintaining two divergent mappings. |
| 2 | 16-color info token divergence | Important | [color-system.js](../build/components/color-system.js) line 79 | `\x1b[34m` (blue) per tokens.json | `\x1b[36m` (cyan) | Reconcile with tokens.json. Cyan may be intentional for readability but should be documented. |
| 3 | commandCount/agentCount not fully specified | Important | CODE.md section 1.3 (lines 120-121) | Exact code showing where to capture install counts | Note saying "must be captured" with suggestion to count files | Add explicit code snippet or line reference showing where in install.js to capture these values. |

---

## Minor Issues

| # | Issue | Severity | Location | Expected | Actual | Remediation |
|---|-------|----------|----------|----------|--------|-------------|
| 4 | Progress bar filled character mismatch | Minor | `tokens.json` component.progress-bar.filled | Build uses `U+2588` (full block) consistent with design specs | `tokens.json` defines `U+2593` (dark shade) | Update `tokens.json` to `U+2588` to match design intent. |
| 5 | Sparkle star character | Minor | `tokens.json` ascii.sparkle.star | Design spec and build use `*` (asterisk) for sparkle | `tokens.json` defines `U+2727` (star outline) | Not a build issue -- the design chose `*` for better terminal compatibility. Consider updating `tokens.json` to reflect actual usage or adding `*` as a fallback. |
| 6 | Screen 02 dim-to-token migration incomplete | Minor | CODE.md Screen 2 (lines 195, 263-264) | Version and footer use explicit text-tertiary token per A6 fix | Version on line 195 uses text-tertiary (correct), but footer on lines 263-264 also uses text-tertiary (correct per A6) | No action needed. Noting that the design spec originally specified `[dim]` for these elements; the build correctly applied the A6 fix. |

---

## Notes

1. **text-tertiary A4 bump is correct.** The build uses `\x1b[38;2;115;115;115m` (#737373) everywhere instead of the `tokens.json` value of `\x1b[38;2;102;102;102m` (#666666). This is the documented A4 accessibility fix providing 5.2:1 contrast ratio. The design specs were written before this fix, so they still reference the old value. The `tokens.json` file should eventually be updated to reflect #737373, but this is a brand-system-level change outside the scope of this project's build.

2. **Pipeline flow connector.** The `tokens.json` defines the pipeline connector as ` --- ` (5 chars with spaces). The build uses `---` (3 chars with surrounding spaces in the template). Both render equivalently in practice since the spaces are part of the template layout. No issue.

3. **Design spec Screen 02 uses `\x1b[2m` (dim) for version.** The build correctly replaced this with text-tertiary per the A6 fix. This is noted as a deliberate improvement, not a discrepancy.

4. **The build's testing checklist is thorough.** 28 test items covering all screens, color tiers, quiet mode, piped output, and edge cases. No automated tests exist, but the manual checklist provides good coverage for a first implementation pass.

5. **brand-strategy next phase routing.** Both the design spec and the build route strategy completion to "identity" (skipping verbal as a standalone step). This matches the AskUserQuestion text: "create voice and visual identity."

---

## Related

- [Acceptance Report](./acceptance-report.md)
- [Critique - Prioritized Fixes](../critique/prioritized-fixes.md)
- [Critique - Accessibility Fixes](../critique/accessibility-fixes.md)
