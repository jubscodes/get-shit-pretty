# UX Patterns

> Phase: research | Project: gsp-cli | Generated: 2026-03-08

---

## CLI Onboarding Patterns (Screen 1)

### First-Run Experience

The best CLI onboarding moments share three traits: they are fast, they are visually distinct from regular output, and they end with a clear next step. Research from the Command Line Interface Guidelines (clig.dev) emphasizes that output should appear within 100ms to avoid feeling broken.

**Pattern: Branded Splash + Status Stream + Next Step**

Oh My Zsh sets the standard here: a large ASCII art welcome, a brief confirmation of what was installed, and a prompt to configure. The pattern works because it clearly marks the transition from "installing" to "installed" and gives the user agency.

For GSP Screen 1, the Banner component fills the splash role. The key adaptation is that post-install output should transition from the celebratory banner into structured status messages, ending with a file tree showing what was created -- giving users confidence about what changed on their filesystem.

**Pattern: Progressive Disclosure**

Vercel CLI auto-detects framework and shows sensible defaults rather than asking questions. For GSP, the installer should auto-detect available runtimes and report what it found, not ask the user to choose during install (that happens via flags). Source: Vercel CLI docs (vercel.com/docs/cli).

### Avoid: Wall of Text

npm v6's install output was notorious for flooding the terminal with dependency trees. Modern package managers (pnpm, yarn berry) show only what changed. GSP's install output should be concise: banner, 3-5 status messages, file tree, done.

---

## Help Command UX (Screen 2)

### Modern Help Design

The Command Line Interface Guidelines (clig.dev) recommends: lead with examples, show the most common commands first, use formatting for scannability, and include a support/docs link. Traditional man pages fail because they overwhelm with exhaustive detail.

**Pattern: Grouped Command Reference**

GitHub CLI (`gh`) groups commands by domain (repo, pr, issue) with short descriptions. Each group has a clear heading. This maps directly to GSP's Branding/Project/Optional groupings in Screen 2.

**Pattern: Contextual Help**

Modern CLIs show different help based on context. `kubectl` suggests related commands. GSP's help is static (rendered from a markdown template), so the key insight is: make the grouping and ordering match the actual workflow. Branding commands before Project commands, because that is the intended sequence.

**Pattern: Directory Structure as Documentation**

Showing the `.design/` directory tree in help output helps users understand where outputs go. This is a pattern used by tools like Create React App and Next.js, which show the generated file structure after scaffolding.

### Avoid: Emoji as Section Headers

The current help screen uses emoji (paint palette) as headers. Emoji in CLI output is inconsistent across terminals and problematic for screen readers (WCAG SC 1.1.1). Diamond symbols or simple ASCII dividers are more reliable. Source: seirdy.one/posts/2022/06/10/cli-best-practices.

---

## Progress Dashboard Patterns (Screen 3)

### Pipeline Visualization

**Pattern: Horizontal Phase Flow**

Starship prompt and CI/CD tools (GitHub Actions, GitLab CI) show pipelines as a horizontal sequence of states. The diamond state system (pending/active/complete) maps cleanly to this. The key UX insight from Starship: show just enough to orient, not so much that it becomes noise. Source: starship.rs/config.

**Pattern: Multi-Level Progress**

Evil Martians (evilmartians.com) identifies three tiers of progress display: spinner for quick tasks, X-of-Y for measurable steps, and progress bars for long-running parallel work. Screen 3 uses progress bars for overall pipeline completion and diamond symbols for individual phase states. These complement each other well.

**Pattern: Clear Completion Indicators**

Progress indicators should change verb tense on completion: "downloading..." becomes "downloaded" with a checkmark. This matches GSP's status message format: active states use `...` gerunds, completed states use past tense. Source: Evil Martians progress patterns.

### Avoid: Animated Spinners in Static Output

Screen 3 is agent-rendered (Type B), meaning the agent outputs a snapshot, not a live updating view. Animated progress patterns are inappropriate here. The dashboard should read as a static summary, not try to simulate real-time updates.

---

## Phase Transition Patterns (Screen 5)

### Workflow Completion

**Pattern: Phase Block with File Tree**

When a build step completes, users need three things: confirmation of completion, a list of artifacts, and guidance to the next step. This maps exactly to GSP's Phase Block component.

Railway CLI shows this well: deploy completes, shows the URL, and provides next action. The format is consistent: status symbol, summary line, details, next step. Source: Railway CLI docs (docs.railway.com/cli).

**Pattern: AskUserQuestion for Routing**

Interactive routing (selection menus) is better than plain text "Run /gsp:next" because it eliminates the cognitive load of remembering command names. The brief correctly identifies this: Screen 5 should use AskUserQuestion, not text instructions. This aligns with clig.dev's guidance that interactive modes replicate GUI discoverability.

### Avoid: Identical Transition Screens

If all 12 phase commands render the same template with only the phase name changed, the output feels robotic. Each phase transition should feel like a natural pause point. The Phase Block handles the consistent structure; microcopy should be phase-specific.

---

## Information Hierarchy in Terminal Output

### Visual Hierarchy Rules

From Lucas F. Costa's CLI UX research (lucasfcosta.com) and clig.dev:

1. **Color encodes meaning, not decoration** -- green for success, yellow for warning, red for error, accent for emphasis. Never color for aesthetics alone.
2. **Bold draws the eye to structure** -- headings and key information. Dim pushes noise to the background.
3. **Indentation creates scope** -- 2-space indent for content, 4-space for nested. This matches GSP's spacing system.
4. **Whitespace separates concerns** -- one blank line between subsections, two between sections.
5. **Symbols compress meaning** -- a checkmark says "done" faster than the word. GSP's diamond system is good here.

### Terminal Width Responsiveness

Process.stdout.columns varies from 40 (split pane) to 200+ (ultrawide). The Pipeline Flow component has a compact vertical variant for narrow terminals. The critical threshold is ~60 columns: below that, horizontal layouts break. clig.dev recommends checking if output is a TTY and adapting.

---

## Related

- [Competitor UX](./competitor-ux.md) -- specific implementations of these patterns
- [Content Strategy](./content-strategy.md) -- microcopy for status messages and transitions
- [Accessibility Patterns](./accessibility-patterns.md) -- constraints on visual patterns
