# Reference Specs

> Phase: research | Project: gsp-cli | Generated: 2026-03-08

---

## Component-to-Screen Mapping

Each screen requires specific brand system component specs. This mapping tells the design phase exactly which specs to load for each screen.

### Screen 1: Onboarding Splash

| Component | Spec File | Key Details |
|-----------|-----------|-------------|
| Banner | `system/components/banner.md` | Install Splash variant. Sparkle field (2-3 lines), density ramp, brand mark at ◇◇, rotating tagline. JS implementation snippet included in spec. |
| Brand Mark | `system/components/brand-mark.md` | `/gsp: ◇◇` state for fresh install. Centered within banner. |
| Status Message | `system/components/status-message.md` | ✓ for success, ✗ for skipped runtimes. 2-space indent + symbol + space + message. |
| Tree | `system/components/tree.md` | Box-drawing file tree for installed files. `├──` for items, `└──` for last item. Text-secondary for filenames, text-tertiary for connectors. |

**Foundations needed:** color-system.md (ANSI mappings), typography.md (bold/dim), spacing.md (indentation), motion.md (sparkle animation timing), content-patterns.md (status message format).

### Screen 2: Help Reference

| Component | Spec File | Key Details |
|-----------|-----------|-------------|
| Brand Mark | `system/components/brand-mark.md` | Header element. State reflects current pipeline state if detectable, else default. |
| Divider | `system/components/divider.md` | Labeled variant between sections (Getting Started, Branding, Project). 30-char `─` rule in text-tertiary. |
| Key-Value | `system/components/key-value.md` | Command name (bold) + description (secondary). Right-padded keys for alignment. |
| Tree | `system/components/tree.md` | Directory structure showing `.design/` layout. |

**Foundations needed:** color-system.md, typography.md (heading hierarchy H1/H2), spacing.md.

### Screen 3: Progress Dashboard

| Component | Spec File | Key Details |
|-----------|-----------|-------------|
| Brand Mark | `system/components/brand-mark.md` | Header with current pipeline state. |
| Pipeline Flow | `system/components/pipeline-flow.md` | Dual pipeline variant (branding + project). Horizontal with `─── ` connectors. Compact vertical for narrow terminals. |
| Progress Bar | `system/components/progress-bar.md` | `████░░░░` style. Width adapts to terminal. Percentage + fraction label. |
| Table | `system/components/table.md` | Status-annotated: phase name, diamond state, chunk count, duration. No vertical borders. |
| Divider | `system/components/divider.md` | Labeled variant between brands/projects. |
| Key-Value | `system/components/key-value.md` | Summary stats (total phases, chunks, time). |

**Foundations needed:** color-system.md, typography.md, spacing.md, content-patterns.md (table formatting, progress output).

### Screen 4: Start Greeting

| Component | Spec File | Key Details |
|-----------|-----------|-------------|
| Brand Mark | `system/components/brand-mark.md` | Hero element at top. Current state diamonds. |
| Pipeline Flow | `system/components/pipeline-flow.md` | Compact variant showing existing brands/projects with their states. |
| Status Message | `system/components/status-message.md` | Contextual messages (detected config, suggested next action). |
| Summary Box | `system/components/summary-box.md` | Box-drawn border with key-value pairs for detected codebase info. Text-tertiary border, bold brand mark inside. |

**Foundations needed:** color-system.md, typography.md, spacing.md, content-patterns.md (summary screen format).

### Screen 5: Phase Transitions

| Component | Spec File | Key Details |
|-----------|-----------|-------------|
| Phase Block | `system/components/phase-block.md` | `◆ {phase} complete — {count} chunks written` + file tree. Accent color for completion symbol and phase name. |
| Status Message | `system/components/status-message.md` | Success status for the completed phase. |
| Tree | `system/components/tree.md` | File listing of written chunks within the Phase Block. |
| Divider | `system/components/divider.md` | Separator before the next-step routing. |

**Foundations needed:** color-system.md, typography.md, spacing.md, content-patterns.md (phase completion format).

---

## Component Gaps and Adaptations

From the brief's gap analysis, cross-referenced with component specs:

### No Gaps Found

All 11 components used across the 5 screens have existing specs in the brand system. The component library is complete for this project's needs.

### Adaptations Needed

1. **Banner JS implementation:** The spec includes a JS snippet, but it uses placeholder color values. The design phase must produce a production-ready implementation with brand token constants and color tier detection.

2. **Pipeline Flow agent rendering:** The spec defines the visual output but does not include agent-specific rendering instructions (exact ANSI escape code sequences for agents to output). The design phase must translate the spec into copy-pasteable output templates.

3. **Phase Block template reuse:** The same Phase Block template will be embedded in 12 different command files. A shared template block (included via reference) would reduce maintenance burden, but markdown command files do not support includes. The design phase should define a canonical template that gets copy-pasted.

4. **Progress Bar terminal width:** The spec does not define how the bar width adapts to terminal width. The design phase should define: full width = columns - indent - label - percentage. Minimum width: 10 characters.

---

## External Reference Documentation

### NO_COLOR Specification
- **URL:** https://no-color.org/
- **Retrieved:** 2026-03-08
- **Key takeaway:** Check `NO_COLOR` env var. When set and non-empty, suppress all ANSI color codes. Diamonds and box-drawing characters remain.

### Command Line Interface Guidelines
- **URL:** https://clig.dev/
- **Retrieved:** 2026-03-08
- **Key takeaway:** Comprehensive CLI design guide covering help text format, output formatting, color handling, error display, progress indicators, TTY detection, and accessibility. The single best reference for CLI UX decisions.

### Node.js TTY API
- **URL:** https://nodejs.org/api/tty.html
- **Retrieved:** 2026-03-08
- **Key takeaway:** `process.stdout.isTTY`, `process.stdout.columns`, `process.stdout.hasColors(count)` provide native capability detection. No external dependencies needed.

### cross-platform-terminal-characters
- **URL:** https://github.com/ehmicky/cross-platform-terminal-characters
- **Retrieved:** 2026-03-08
- **Key takeaway:** Comprehensive list of characters safe across terminals. Diamonds (◇◈◆) and box-drawing characters are well-supported on all modern terminals. Legacy Windows Console Host is the only risk, mitigated by target audience.

### Evil Martians CLI Progress Patterns
- **URL:** https://evilmartians.com/chronicles/cli-ux-best-practices-3-patterns-for-improving-progress-displays
- **Retrieved:** 2026-03-08
- **Key takeaway:** Three tiers (spinner, X-of-Y, progress bar). Clear on completion. Change verb tense. Green checkmarks for success. The progress bar article is the best single reference for Screen 3's progress display design.

### GitHub CLI Accessibility Blog Post
- **URL:** https://github.blog/engineering/user-experience/building-a-more-accessible-github-cli/
- **Retrieved:** 2026-03-08
- **Key takeaway:** 4-bit color alignment allows user customization via terminal preferences. Static text progress indicators over animated spinners for screen reader compatibility. Structural text matters even without DOM markup.

### Seirdy's Inclusive CLI Best Practices
- **URL:** https://seirdy.one/posts/2022/06/10/cli-best-practices/
- **Retrieved:** 2026-03-08
- **Key takeaway:** ASCII art is noise for screen readers. Animated spinners are "extremely problematic." Provide configurable output modes. Test output with `espeak-ng`. Box-drawing characters cause issues during terminal resize with tiling window managers.

---

## Related

- [Technical Research](./technical-research.md) -- implementation patterns for these specs
- [Accessibility Patterns](./accessibility-patterns.md) -- constraints from accessibility specs
- [Recommendations](./recommendations.md) -- how to apply these references
