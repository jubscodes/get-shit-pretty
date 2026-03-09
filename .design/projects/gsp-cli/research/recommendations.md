# Recommendations

> Phase: research | Project: gsp-cli | Generated: 2026-03-08

---

## Adopt

Patterns to use directly, backed by research findings.

### 1. Tiered Color Degradation (Screen 1)

Implement the `getColorTier()` function from [Technical Research](./technical-research.md) with the priority chain: NO_COLOR > FORCE_COLOR > COLORTERM > TERM > hasColors() > 16-color fallback. Charm.sh's Lipgloss proves this works at scale. The brand system already defines three tiers; the installer needs the detection logic.

### 2. Status Symbol System Over Emoji

Replace all emoji indicators (checkmark emoji, X emoji, paint palette) with the brand's Unicode status symbols (`✓`, `✗`, `◆`, `◈`, `◇`). These are more consistent across terminals, more accessible to screen readers, and more visually cohesive. See [Accessibility Patterns](./accessibility-patterns.md) and [UX Patterns](./ux-patterns.md).

### 3. AskUserQuestion for Phase Routing (Screen 5)

The brief correctly identifies this. Research confirms: interactive routing reduces cognitive load vs. plain text "Run /gsp:next" instructions. Guided choices with 3 options maximum: [Continue to {next}] [View progress] [Done for now]. See [Content Strategy](./content-strategy.md).

### 4. Concise Install Output (Screen 1)

Follow pnpm's model: minimal output, maximum signal. Banner + 3-5 status messages + file tree + done. No verbose dependency information. See [Competitor UX](./competitor-ux.md) (pnpm section).

### 5. Horizontal Pipeline Flow for Orientation

Starship's left-to-right scanning model validates the Pipeline Flow component. Users should be able to glance at the pipeline and know their position in <2 seconds. The compact vertical variant handles narrow terminals. See [Competitor UX](./competitor-ux.md) (Starship section).

---

## Adapt

Patterns to modify for GSP's specific context.

### 6. Agent Output Templates Need Literal Escape Codes

Unlike runtime JS where you call functions, agent-rendered screens need exact ANSI sequences baked into the template. The design phase should produce templates with literal `\x1b[38;2;255;107;53m` sequences, not abstract token references. This is a departure from how component specs are normally consumed. See [Technical Research](./technical-research.md) (Type B section).

### 7. Phase-Specific Completion Copy (Screen 5)

The Phase Block component provides the structure, but the completion message should vary by phase. Generic "X chunks written" works as a fallback, but "visual system defined" or "screens implemented" creates a more human experience. This requires 12 tailored completion messages. See [Content Strategy](./content-strategy.md).

### 8. Help Screen Heading Style (Screen 2)

Shift from ALL CAPS section headers to title case with brand formatting (H2 bold). Drop parenthetical explanations from headers and let command descriptions carry the context. This is an adaptation of the brand typography system to the help reference format. See [Content Strategy](./content-strategy.md).

### 9. Progress Bar Width Adaptation (Screen 3)

The Progress Bar component needs a formula for terminal width adaptation. Recommend: `bar_width = columns - 2 (indent) - label_length - 2 (spacing) - 5 (percentage)`. Minimum bar width: 10 characters. Below 40 columns: show percentage only, no bar. See [Technical Research](./technical-research.md).

---

## Avoid

Patterns that research shows are counterproductive for this project.

### 10. Animated Spinners in Agent Output (Screens 2-5)

Agent-rendered output is a single pass. Attempting to simulate animation creates accessibility problems and does not work reliably. Keep animation to Screen 1 only, and even there, keep it to simple sequential line output. See [Accessibility Patterns](./accessibility-patterns.md).

### 11. Box-Drawing Borders for Everything

Seirdy's research notes that box-drawing characters cause issues during terminal resize with tiling window managers. Use box borders sparingly -- the Summary Box and fatal error block justify them. Do not add borders around the help reference, progress dashboard, or phase transitions. See [Accessibility Patterns](./accessibility-patterns.md).

### 12. Color for Decoration

Every color in the output should encode meaning. Starship's discipline here is the benchmark: if removing the color removes information, the color is justified. If removing the color removes only aesthetics, the color is unnecessary. The accent color is for brand identity and emphasis, not for making things "look nice." See [Competitor UX](./competitor-ux.md) (Starship section).

### 13. Verbose Default Output

npm's historical verbosity trained users to ignore install output. GSP should train users to read output by keeping it concise and informative. When in doubt, remove a line. See [Competitor UX](./competitor-ux.md) (npm section).

### 14. Generic Transition Messages

Identical copy across all 12 phase transitions makes the tool feel robotic. Avoid the pattern of "Phase X complete. Run /gsp:next-phase." Each transition should feel like a designed moment. See [UX Patterns](./ux-patterns.md) (Phase Transition section).

---

## Priority Order for Design Phase

1. **Screen 1 (Onboarding Splash)** -- highest impact, most technical complexity (runtime JS + color detection + animation)
2. **Screen 5 (Phase Transitions)** -- highest reach (used in 12 commands), defines the template pattern for all agent output
3. **Screen 4 (Start Greeting)** -- session entry point, most frequent touchpoint
4. **Screen 3 (Progress Dashboard)** -- complex layout, multiple components
5. **Screen 2 (Help Reference)** -- simplest to design, least interaction complexity

This order balances impact (Screen 1), reach (Screen 5), frequency (Screen 4), complexity (Screen 3), and effort (Screen 2).

---

## Related

- [UX Patterns](./ux-patterns.md)
- [Competitor UX](./competitor-ux.md)
- [Technical Research](./technical-research.md)
- [Accessibility Patterns](./accessibility-patterns.md)
- [Content Strategy](./content-strategy.md)
- [Reference Specs](./reference-specs.md)
