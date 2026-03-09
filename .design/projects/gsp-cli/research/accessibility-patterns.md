# Accessibility Patterns

> Phase: research | Project: gsp-cli | Generated: 2026-03-08

---

## NO_COLOR Standard

The NO_COLOR environment variable (no-color.org) is the consensus mechanism for users to disable color output. When `NO_COLOR` is set (to any non-empty value), all ANSI color codes must be suppressed.

**Implementation for Screen 1 (install.js):**

```javascript
const noColor = process.env.NO_COLOR !== undefined && process.env.NO_COLOR !== '';
```

When active: output all text without escape codes. Diamonds (`◇◈◆`) remain (they are Unicode characters, not color). Box-drawing characters remain. Bold and dim are suppressed (they are ANSI codes). The Banner's density ramp (`░▒▓█`) renders without color but retains its visual structure.

**Implementation for Screens 2-5 (agent output):**
Agent templates should note that NO_COLOR environments exist, but agents cannot detect environment variables without tool use. The practical approach: include a "plain output" variant in the template that agents can use when instructed to disable color.

Source: no-color.org, clig.dev.

---

## Screen Reader Compatibility

### The Core Problem

Screen readers (VoiceOver, NVDA, JAWS) read terminal output as linear text. ANSI escape codes are invisible to screen readers -- they affect visual presentation only. This means:

1. Color-only distinctions are lost. A green checkmark and a red X must also differ in character (`✓` vs `✗`).
2. Box-drawing characters read as noise. `├── file.md` reads as "box drawings light vertical and right, box drawings light horizontal, box drawings light horizontal, space, file dot md."
3. ASCII art (sparkle fields, density ramps) is pure noise.

Source: GitHub Blog -- "Building a more accessible GitHub CLI" (github.blog), ACM paper on CLI accessibility (dl.acm.org/doi/fullHtml/10.1145/3411764.3445544).

### Mitigation Strategies

**Status symbols carry meaning independent of color.** GSP's status symbol set (`✓`, `✗`, `⚠`, `ℹ`, `◈`, `◆`, `◇`) already encodes state through character identity, not just color. This is correct and should be maintained.

**Provide a machine-readable mode.** The `--json` flag pattern (used by Railway CLI, GitHub CLI, Vercel CLI) outputs structured data that assistive tools can parse. For GSP, this is a future consideration, not in scope for the current 5 screens.

**Avoid animated spinners.** The Evil Martians guide and seirdy.one both note that animated spinners using cursor repositioning are "extremely problematic for screen readers." Screen 1 could include a brief animation, but it should be a simple sequential output (line by line), not a cursor-repositioned spinner.

**GitHub CLI's approach:** They adopted `charmbracelet/huh` for prompts specifically because it handles screen reader interaction better than custom cursor-control prompts. GSP's AskUserQuestion is handled by the host tool (Claude Code, etc.), so this is not in GSP's control, but it is good to know.

---

## High Contrast and Low Vision

### Color Contrast

GSP's color system on a dark background (#0D0D0D assumed):

| Token | Hex | Contrast Ratio (approx) | WCAG AA (4.5:1) |
|-------|-----|-------------------------|------------------|
| text-primary | #E0E0E0 | 15:1 | Pass |
| text-secondary | #A0A0A0 | 9:1 | Pass |
| text-tertiary | #666666 | 4.5:1 | Borderline |
| accent | #FF6B35 | 6:1 | Pass |
| success | #22C55E | 7:1 | Pass |
| error | #EF4444 | 5.5:1 | Pass |
| warning | #FBBF24 | 12:1 | Pass |

**Risk:** text-tertiary (#666666) is at the WCAG AA boundary. On some dark backgrounds, it may fall below 4.5:1. This color is used for connectors, decorative elements, and pending items -- all low-priority information where reduced visibility is intentional. Acceptable, but should not carry critical information.

### GitHub CLI's 4-bit Strategy

GitHub CLI aligns its palette to 4-bit (16) ANSI colors so users can fully customize via terminal preferences. This is relevant for GSP's 16-color fallback tier: map brand colors to standard ANSI names, and users who customize terminal palettes get appropriate results.

---

## Reduced Motion

### Screen 1 Animation

The Banner component includes a sparkle field that could be animated (sequential line output with delays). For users with vestibular conditions or motion sensitivity:

- Check `REDUCE_MOTION` environment variable (not yet standardized but increasingly adopted)
- Provide a `--quiet` flag (already exists in install.js) that suppresses the banner
- Keep any animation to simple sequential output (printing lines), not flashing or repositioning

Source: seirdy.one CLI accessibility best practices.

### Screens 2-5

No animation concern. Agent output is a single render pass with no motion.

---

## Semantic vs. Decorative Output

### What to Strip in Accessible Mode

| Element | Role | Keep in Plain Mode? |
|---------|------|---------------------|
| Status symbols (✓, ✗, ◆) | Semantic | Yes -- they carry meaning |
| Diamond states (◇◈◆) | Semantic | Yes -- they indicate pipeline state |
| Box-drawing tree (├── └──) | Structural | Yes -- they show hierarchy |
| Sparkle field (✧ . ·) | Decorative | No -- strip in accessible mode |
| Density ramp (░▒▓█) | Decorative | No -- strip in accessible mode |
| Color codes | Visual | No -- strip when NO_COLOR set |
| Bold/dim | Visual | No -- strip when NO_COLOR set |

### The `--plain` Flag Pattern

clig.dev recommends a `--plain` flag for script-friendly output. For GSP Screen 1, `--quiet` already serves this purpose. For agent-rendered screens, agents could be instructed to render a "plain" variant, but this is low priority given the target audience.

---

## WCAG Applicability to Terminal UIs

WCAG is designed for web content, not terminal output. However, several success criteria apply conceptually:

- **SC 1.1.1 Non-text Content:** ASCII art and decorative symbols should have text alternatives or be marked as decorative. GSP's approach of using symbols with inherent meaning (diamonds = state) satisfies this.
- **SC 1.4.1 Use of Color:** Information should not be conveyed by color alone. GSP passes: status symbols differ in shape, not just color.
- **SC 1.4.3 Contrast:** Minimum 4.5:1 for normal text. GSP's palette passes except borderline text-tertiary.
- **SC 2.1.1 Keyboard:** CLIs are inherently keyboard-operated. Pass by design.

Source: WCAG 2.1 (w3.org/WAI/WCAG21), Seirdy's CLI best practices.

---

## Related

- [Technical Research](./technical-research.md) -- implementation of color detection and NO_COLOR
- [Content Strategy](./content-strategy.md) -- writing for accessibility
- [Recommendations](./recommendations.md) -- accessibility requirements to build in
