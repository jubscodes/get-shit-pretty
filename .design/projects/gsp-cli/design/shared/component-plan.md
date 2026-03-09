# Component Plan

> Phase: design | Project: gsp-cli | Generated: 2026-03-08

---

## Component Usage Matrix

| Component | Screen 1 | Screen 2 | Screen 3 | Screen 4 | Screen 5 |
|-----------|----------|----------|----------|----------|----------|
| Banner | **primary** | - | - | - | - |
| Brand Mark | inside banner | header | header | header | - |
| Pipeline Flow | - | - | **primary** | compact | - |
| Phase Block | - | - | - | - | **primary** |
| Progress Bar | - | - | **primary** | - | - |
| Status Message | install steps | - | - | context info | sub-tasks |
| Tree | file listing | dir structure | - | - | file listing |
| Summary Box | - | - | - | codebase info | - |
| Divider (labeled) | - | section headers | section headers | - | before routing |
| Key-Value | - | commands | summary stats | - | - |
| Table | - | - | phase status | - | - |

## Adaptations Needed

### Reuse As-Is (no changes)

- **Status Message** — `{indent}{symbol} {message}` pattern works across all screens
- **Tree** — Box-drawing file tree identical in Screen 1 and Screen 5
- **Divider** — Labeled and plain variants used without modification
- **Key-Value** — Right-padded keys, aligned values — standard pattern

### Adapt for Context

- **Banner (Screen 1)** — Needs JS implementation with `getColorTier()` detection, terminal width centering, sparkle field randomization. The brand spec defines the visual; Screen 1 adds runtime behavior.
- **Brand Mark (Screens 2-4)** — Agent-rendered. Must include literal ANSI escape codes in template. State diamonds reflect current pipeline position.
- **Pipeline Flow (Screens 3-4)** — Screen 3 uses full horizontal layout with connectors. Screen 4 uses compact variant (no connectors, just diamonds + phase names). Both need narrow terminal fallback.
- **Progress Bar (Screen 3)** — Width formula: `bar_width = columns - 2 (indent) - label_length - 2 (spacing) - 5 (percentage)`. Minimum bar width: 10 chars. Below 40 columns: percentage only.
- **Phase Block (Screen 5)** — Template embedded in 12 command files. Each gets phase-specific completion copy. Structure is identical; messaging varies.

### New (Local to This Project)

- **Color Tier Detection** — `getColorTier()` function for Screen 1. Returns `'truecolor'`, `'256'`, `'16'`, or `'none'`. Not a visual component but a runtime utility.
- **Sparkle Field** — Random star placement for Banner in Screen 1. 2-3 lines of scattered `*`, `.`, `·` characters in dim text. Unique per install run.

## Type A vs Type B Implementation

| Aspect | Type A (Screen 1) | Type B (Screens 2-5) |
|--------|--------------------|----------------------|
| Runtime | Node.js | AI agent output |
| Color detection | `getColorTier()` at runtime | Assume truecolor |
| Layout | Dynamic (terminal width) | Static (80 cols default) |
| Animations | Sequential line output | None (single pass) |
| Color codes | JS string constants | Literal ANSI in template |
| Responsive | Width-aware centering | Agent instructed to check width |

---

## Related

- [Information Architecture](./information-architecture.md)
- [Screen 01 - Onboarding Splash](../screen-01-onboarding-splash.md)
- [Screen 05 - Phase Transitions](../screen-05-phase-transitions.md)
