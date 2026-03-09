# Accessibility Audit -- WCAG 2.2 AA (Terminal-Adapted)

> Phase: critique | Project: gsp-cli | Generated: 2026-03-08

---

## Scope

Five terminal screens audited against WCAG 2.2 AA criteria, adapted for CLI context. The audit covers both the design specifications and the current `bin/install.js` implementation where applicable.

---

## 1. Perceivable

### 1.1.1 Non-text Content -- PASS

All decorative elements (sparkle field, density ramp block characters) are supplementary. Meaningful content is conveyed through text. Diamond symbols carry state meaning through shape variation, not just color. Status symbols use distinct glyphs: checkmark, cross, warning triangle, info letter, filled/half/empty diamond.

### 1.3.1 Info and Relationships -- CONDITIONAL PASS

Structure is conveyed through indentation, labeled dividers, and box-drawing characters. In NO_COLOR mode, structural elements (tree connectors, dividers, diamonds) persist. **Condition:** The design relies on spatial alignment for table readability (Screen 3 status table). When piped to a file or processed by a screen reader, column alignment may break if tab characters or proportional spacing is encountered. Fixed-width terminal fonts mitigate this in normal use.

### 1.3.2 Meaningful Sequence -- PASS

Reading order matches visual order across all screens. Content flows top-to-bottom, left-to-right. No reordering or absolute positioning.

### 1.3.3 Sensory Characteristics -- PASS

Instructions reference commands by name (`/gsp:start`), not by position or visual appearance. Phase states use both shape (diamond fill level) and text labels ("complete", "in progress").

### 1.4.1 Use of Color -- CONDITIONAL PASS

Status is never conveyed by color alone. Diamonds differ in shape. Status symbols differ in glyph. The progress bar uses both fill characters and a percentage+fraction text label. **Condition:** In the 16-color fallback, `accent` and `warning` both map to `\x1b[33m` (yellow). If a screen ever uses both tokens adjacently, they become indistinguishable. Currently no screen does this, but future changes could introduce this collision.

### 1.4.3 Contrast (Minimum) -- WARN

Most color combinations pass 4.5:1 against the dark background (~#0D0D0D):

| Token | Ratio | Verdict |
|-------|-------|---------|
| text-primary #E0E0E0 | ~15:1 | PASS |
| text-secondary #A0A0A0 | ~9:1 | PASS |
| text-tertiary #666666 | ~4.5:1 | BORDERLINE |
| accent #FF6B35 | ~6:1 | PASS |
| success #22C55E | ~7:1 | PASS |
| error #EF4444 | ~5.5:1 | PASS |
| warning #FBBF24 | ~12:1 | PASS |
| info #60A5FA | ~6.5:1 | PASS |

**Issue:** text-tertiary at exactly 4.5:1 is borderline. It passes the threshold but has zero margin. In practice, terminal background colors vary; a user with a background lighter than #0D0D0D (e.g., #1A1A1A, common in many terminals) would see text-tertiary fall below 4.5:1. Text-tertiary is used for tree connectors, dividers, pending phase labels, and flow arrows -- all functional content that aids comprehension.

Additionally, the `dim` attribute (`\x1b[2m`) reduces brightness unpredictably across terminals. When applied to text-secondary or text-tertiary content, the effective contrast may drop below thresholds.

### 1.4.11 Non-text Contrast -- PASS

Progress bar filled/empty segments (`U+2588`/`U+2591`) are distinguishable by character shape as well as color. Diamond state indicators use shape differentiation. Tree connectors are structural, not informational on their own.

### 1.4.12 Text Spacing -- N/A

Terminal text spacing is controlled by the terminal emulator, not the application.

### 1.4.10 Reflow -- CONDITIONAL PASS

Design specifies responsive behavior at 3 breakpoints (>100, 60-100, <60 cols). Pipeline flow switches to vertical compact below 60 cols. Progress bars adapt width. **Condition:** Very narrow terminals (<40 cols) are only partially addressed. Screen 1 suppresses sparkle field but other screens lack specific <40 col handling.

---

## 2. Operable

### 2.1.1 Keyboard -- PASS

CLI is keyboard-native. All interaction happens through typed commands and AskUserQuestion tool prompts. No mouse or pointer interaction required.

### 2.1.2 No Keyboard Trap -- PASS

All screens produce output and return control to the shell or present AskUserQuestion choices. No modal states trap keyboard input.

### 2.2.1 Timing Adjustable -- PASS

No time-limited content. All output is static text rendered to the terminal.

### 2.3.1 Three Flashes -- PASS

No animation or flashing content in any screen. All output is rendered once as static text.

### 2.4.1 Bypass Blocks -- CONDITIONAL PASS

The `--quiet` flag (Screen 1) allows skipping decorative content. **Condition:** Type B screens rendered by AI agents have no equivalent `--quiet` mechanism. The decorative content in those screens is minimal (dividers, diamonds), so this is low-impact.

### 2.5.8 Target Size -- N/A

Not applicable to terminal CLI. No pointer targets.

---

## 3. Understandable

### 3.1.1 Language of Page -- N/A

Terminal output does not declare language metadata. Screen readers infer language from system settings.

### 3.1.5 Reading Level -- PASS

Content uses clear, direct language appropriate for a developer audience. Phase names are plain English. Status messages are concise. Jargon is domain-appropriate (`tokens`, `components`, `pipeline`).

### 3.2.1 On Focus -- PASS

No unexpected context changes. Running a command produces expected output.

### 3.2.3 Consistent Navigation -- PASS

All 5 screens share the same brand mark header pattern. Phase transitions (Screen 5) follow an identical template across all 12 phases. Diamond state system is consistent throughout.

### 3.2.4 Consistent Identification -- PASS

Commands are always identified by their `/gsp:` prefix. Status symbols have consistent meaning across all screens.

### 3.3.1 Error Identification -- CONDITIONAL PASS

Screen 1 shows error states with descriptive messages ("agents -- directory not created"). Uses warning color (yellow, not red) for recoverable errors. **Condition:** Error messages in the current `install.js` implementation use `console.error` with yellow ANSI but do not include actionable remediation steps beyond the error description.

### 3.3.2 Labels or Instructions -- PASS

AskUserQuestion options include both a label and a description (e.g., "Continue to strategy" -- "define positioning and personality"). Help reference (Screen 2) provides clear command descriptions.

---

## 4. Robust

### 4.1.1 Parsing -- N/A

No HTML/ARIA markup. Terminal output is plain text with ANSI escape sequences.

### 4.1.2 Name, Role, Value -- N/A for terminal output.

AskUserQuestion routing is handled by the host tool (Claude Code, etc.) which provides its own accessible interaction model. The GSP design correctly delegates interaction to the tool rather than reimplementing selection UI in raw terminal output.

### 4.1.3 Status Messages -- CONDITIONAL PASS

Status messages (checkmark/cross indicators) appear as static output, not live regions. Screen readers will read them in document order. **Condition:** If a future version adds streaming/animated output, status messages would need to be announced programmatically.

---

## 5. Terminal-Specific

### 5.1 NO_COLOR Compliance -- FAIL

**Design:** Fully specified. `getColorTier()` checks `NO_COLOR` with absolute precedence, supports `FORCE_COLOR`, detects `COLORTERM` and `TERM`, provides 4 tiers (truecolor, 256, 16, none), and strips all ANSI codes in none mode while preserving Unicode symbols.

**Implementation:** The current `bin/install.js` (Screen 1) does NOT implement `NO_COLOR` support. It uses hardcoded ANSI escape codes (`\x1b[36m`, `\x1b[32m`, etc.) with no environment variable checks. The `--quiet` flag exists but only suppresses the onboarding message, not color output. The banner always emits ANSI codes regardless of `NO_COLOR`, `FORCE_COLOR`, or piped output context.

This is a violation of the no-color.org standard and the design specification itself.

### 5.2 Piped/Non-TTY Output -- FAIL

**Design:** `getColorTier()` returns `'none'` when `!process.stdout.isTTY`. This would strip ANSI codes from piped output.

**Implementation:** The current `install.js` checks `process.stdin.isTTY` (for interactive prompts) but never checks `process.stdout.isTTY` for color output. Piping `npx get-shit-pretty` to a file or another program produces raw ANSI escape codes in the output.

### 5.3 Screen Reader with ANSI -- WARN

Terminal screen readers (e.g., NVDA with terminal, VoiceOver in Terminal.app) typically ignore ANSI escape codes and read the text content. The design handles this acceptably:

- Diamond symbols read as their Unicode names ("diamond suit", etc.) -- recognizable after initial learning
- Block characters in the density ramp and progress bar read as "full block", "light shade" -- noisy but the text labels carry the meaning
- Sparkle field reads as scattered punctuation -- harmless noise, suppressible via `--quiet`

**Issue:** Box-drawing characters (Screen 2 tree, Screen 4 summary box borders) are verbose in screen readers. A tree with 10 lines generates significant screen reader noise from connector characters. The design acknowledges this ("functional but noisy") but offers no alternative.

### 5.4 Unicode Character Support -- CONDITIONAL PASS

The design uses Unicode characters (diamonds, box-drawing, block elements, check/cross marks). Modern terminals universally support these. **Condition:** Legacy systems or misconfigured locale settings (`LANG=C`) may render these as replacement characters. No ASCII fallback is defined in the design spec.

### 5.5 Color Tier Fallback -- PASS (design) / FAIL (implementation)

**Design:** Specifies 4 color tiers with graceful degradation. 256-color and 16-color palettes are defined with appropriate nearest-match colors. The NOCOLOR tier strips all formatting. This is well-designed.

**Implementation:** Not implemented. The current code uses a single set of 16-color ANSI codes with no tier detection.

---

## 6. Cognitive Accessibility

### 6.1 Consistent Layout -- PASS

All screens share the brand mark header, consistent spacing, and predictable structure. Phase transitions use an identical template.

### 6.2 Information Density -- PASS

Screen density is appropriate: splash is 15-20 lines, phase transitions are 12-18 lines, progress dashboard scales with content. The help reference is the densest at 50-60 lines but is a reference document by nature.

### 6.3 Clear Next Steps -- PASS

Every screen either shows explicit next steps (`/gsp:start`, `/gsp:help`) or presents AskUserQuestion routing with descriptive labels. The user is never left without direction.

---

## Summary

| Category | Pass | Conditional Pass | Warn | Fail | N/A |
|----------|------|------------------|------|------|-----|
| Perceivable | 4 | 3 | 1 | 0 | 1 |
| Operable | 4 | 1 | 0 | 0 | 1 |
| Understandable | 4 | 2 | 0 | 0 | 1 |
| Robust | 0 | 1 | 0 | 0 | 2 |
| Terminal-Specific | 0 | 1 | 1 | 3 | 0 |
| Cognitive | 3 | 0 | 0 | 0 | 0 |
| **Total** | **15** | **8** | **2** | **3** | **5** |

**Overall Conformance:** Does NOT meet WCAG 2.2 AA due to 3 implementation failures in terminal-specific criteria. The design specifications themselves are strong -- the failures are gaps between design and implementation in `bin/install.js`.

### Key Finding

The design system is well-considered for accessibility. The diamond shape system, NO_COLOR architecture, color tier fallbacks, and responsive breakpoints demonstrate genuine accessibility thinking. The problem is that the current `install.js` implementation predates the design spec and has none of these features. The build phase must close this gap.

---

## Related

- [Accessibility Fixes](./accessibility-fixes.md)
- [Screen 01 - Onboarding Splash](../design/screen-01-onboarding-splash.md)
- [Screen 03 - Progress Dashboard](../design/screen-03-progress-dashboard.md)
