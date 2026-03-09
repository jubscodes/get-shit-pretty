# Accessibility Fixes

> Phase: critique | Project: gsp-cli | Generated: 2026-03-08

---

## Critical and Major Violations

Only Critical and Important severity items are listed. Minor/Polish items (e.g., screen reader verbosity of box-drawing characters, ASCII fallback for legacy locales) are documented in the audit but excluded here.

---

### Issue 1: NO_COLOR Not Implemented in install.js

| Field | Value |
|-------|-------|
| **Severity** | Critical |
| **WCAG Criterion** | 1.4.1 Use of Color (adapted), no-color.org standard |
| **Affected Screen** | [Screen 01 - Onboarding Splash](../design/screen-01-onboarding-splash.md) |
| **Current Behavior** | `bin/install.js` emits hardcoded ANSI escape codes (`\x1b[36m`, `\x1b[32m`, etc.) regardless of `NO_COLOR` environment variable. Users who set `NO_COLOR=1` still receive colored output. |
| **Expected Behavior** | When `NO_COLOR` is set, all ANSI escape codes are suppressed. Unicode symbols and text structure remain. |

**Remediation:**

1. Implement the `getColorTier()` function as specified in Screen 01 design spec (lines 79-103 of the design file).
2. Implement the `getColors()` function with all 4 tier constant sets (TRUECOLOR, COLOR256, COLOR16, NOCOLOR).
3. Replace all hardcoded color constants (`cyan`, `green`, `yellow`, `magenta`, `bold`, `dim`, `reset`) at lines 9-15 of `install.js` with dynamic constants from `getColors()`.
4. Replace all inline uses of these constants throughout the file with the `c.accent`, `c.success`, etc. pattern.

**Priority:** Must be implemented in the build phase. This is a documented standard that the design spec already fully addresses -- the implementation simply needs to follow the spec.

---

### Issue 2: Piped Output Contains Raw ANSI Codes

| Field | Value |
|-------|-------|
| **Severity** | Critical |
| **WCAG Criterion** | 4.1.1 Parsing (adapted for terminal) |
| **Affected Screen** | [Screen 01 - Onboarding Splash](../design/screen-01-onboarding-splash.md) |
| **Current Behavior** | Running `npx get-shit-pretty 2>&1 | cat` or redirecting to a file produces raw ANSI escape sequences (`\x1b[36m`, etc.) mixed with text content. This makes output unreadable when processed by other tools. |
| **Expected Behavior** | When stdout is not a TTY (`!process.stdout.isTTY`), `getColorTier()` returns `'none'` and all ANSI codes are suppressed. |

**Remediation:**

This is resolved by the same `getColorTier()` implementation as Issue 1. The function already checks `!process.stdout.isTTY` and returns `'none'`. No additional work beyond Issue 1.

---

### Issue 3: Color Tier Fallback Not Implemented

| Field | Value |
|-------|-------|
| **Severity** | Important |
| **WCAG Criterion** | 1.4.3 Contrast (Minimum) |
| **Affected Screen** | [Screen 01 - Onboarding Splash](../design/screen-01-onboarding-splash.md) |
| **Current Behavior** | `bin/install.js` uses basic 16-color ANSI codes (e.g., `\x1b[36m` for cyan). It does not detect terminal color capability and does not use the truecolor or 256-color palettes designed for the brand. |
| **Expected Behavior** | Terminal capability is detected. Truecolor terminals get the designed palette (#FF6B35, #E0E0E0, etc.). 256-color terminals get the nearest approximations. 16-color terminals get the safe fallback. |

**Remediation:**

This is also resolved by implementing `getColorTier()` and `getColors()` from the design spec. The 4-tier color constant system (Issue 1, step 2) handles this automatically.

Note: In the 16-color tier, `accent` and `warning` both map to `\x1b[33m` (yellow). This is acceptable because no screen currently places both tokens adjacently. If future screens do, add a comment documenting the collision.

---

### Issue 4: text-tertiary Contrast Borderline

| Field | Value |
|-------|-------|
| **Severity** | Important |
| **WCAG Criterion** | 1.4.3 Contrast (Minimum) |
| **Affected Screen** | All screens |
| **Current Behavior** | text-tertiary (#666666) achieves exactly 4.5:1 contrast against the reference background (#0D0D0D). This passes the threshold with zero margin. Terminal backgrounds vary; users with backgrounds like #1A1A1A or #1E1E1E will see contrast drop below 4.5:1. |
| **Expected Behavior** | text-tertiary achieves at least 5:1 to provide margin against background variation. |

**Remediation:**

1. Increase text-tertiary from #666666 to #737373 (approximately 5.2:1 against #0D0D0D, still maintains visual hierarchy).
2. Update the TRUECOLOR constant: `textTertiary: '\x1b[38;2;115;115;115m'`
3. Update the 256-color fallback to `\x1b[38;5;243m` (closest match).
4. The 16-color fallback (`\x1b[90m`, bright black) is terminal-dependent and cannot be adjusted.

This change affects tree connectors, dividers, pending phase labels, empty progress bar segments, and flow arrows across all 5 screens. These are all secondary structural elements, so a slightly lighter tertiary maintains the visual hierarchy while improving accessibility margin.

---

### Issue 5: Banner Renders Before --quiet Check

| Field | Value |
|-------|-------|
| **Severity** | Important |
| **WCAG Criterion** | 2.4.1 Bypass Blocks (adapted) |
| **Affected Screen** | [Screen 01 - Onboarding Splash](../design/screen-01-onboarding-splash.md) |
| **Current Behavior** | In `install.js`, the banner (ASCII art + tagline) is rendered at line 94 (`console.log(banner)`) unconditionally, before the `--quiet` flag is checked. The `--quiet` flag only suppresses the post-install onboarding message, not the banner itself. |
| **Expected Behavior** | `--quiet` suppresses the banner, sparkle field, and tagline. Only status lines and essential output are shown, as specified in the design. |

**Remediation:**

1. Move the `console.log(banner)` call inside a `if (!hasQuiet)` conditional.
2. In quiet mode, output only the status lines as specified in the design:
   ```
   checkmark commands installed -- 20 files
   checkmark agents installed -- 8 files
   ...
   Done! GSP installed for Claude Code.
   ```
3. The `--help` output should still render regardless of `--quiet` (help takes precedence).

---

### Issue 6: dim Attribute Contrast Unpredictable

| Field | Value |
|-------|-------|
| **Severity** | Important |
| **WCAG Criterion** | 1.4.3 Contrast (Minimum) |
| **Affected Screen** | [Screen 01](../design/screen-01-onboarding-splash.md), [Screen 02](../design/screen-02-help-reference.md) |
| **Current Behavior** | The `\x1b[2m` (dim) attribute is used for version numbers, taglines, example comments, and footer text. The dim attribute's effect varies by terminal: some reduce brightness by 50%, others ignore it, some change the color entirely. On terminals that apply a strong dim, text-secondary content rendered with dim could fall below 4.5:1 contrast. |
| **Expected Behavior** | Content that must be readable should not rely on the dim attribute for its only styling. |

**Remediation:**

1. For the truecolor and 256-color tiers, replace `dim` usage with explicit color values. Use text-secondary for content that currently uses dim on text-primary. Use text-tertiary for content that currently uses dim on text-secondary.
2. Keep `dim` as a fallback only in the 16-color tier where explicit color control is limited.
3. In the design spec, replace `[dim]` annotations with specific color tokens: tagline becomes `text-secondary`, version becomes `text-tertiary`, example comments become `text-tertiary`.

---

## Relationship to Implementation

Issues 1, 2, 3, and 5 are implementation gaps -- the design spec already provides the correct solution. The build phase should implement `bin/install.js` changes following the Screen 01 design spec faithfully.

Issues 4 and 6 are design-level adjustments that should be applied to the shared color token definitions before the build phase begins.

---

## Related

- [Accessibility Audit](./accessibility-audit.md)
- [Screen 01 - Onboarding Splash](../design/screen-01-onboarding-splash.md)
