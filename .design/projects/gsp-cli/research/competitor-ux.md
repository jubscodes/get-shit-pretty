# Competitor UX

> Phase: research | Project: gsp-cli | Generated: 2026-03-08

---

## 1. Charm.sh (Bubbletea + Lipgloss)

**What they do:** Go-based TUI framework ecosystem. Bubbletea provides Elm-architecture rendering; Lipgloss provides CSS-like styling; Bubbles provides reusable components. Source: github.com/charmbracelet.

**Best-in-class moments:**
- Lipgloss uses a declarative styling API that reads like CSS (`lipgloss.NewStyle().Bold(true).Foreground(lipgloss.Color("205"))`). This is the model GSP's token system aims for, but expressed as ANSI escape code constants rather than a runtime API.
- Adaptive color support: styles automatically degrade across truecolor, 256-color, and 16-color terminals. GSP needs this same tiered approach in Screen 1 (install.js).
- The `huh` forms library (used by GitHub CLI) provides accessible prompts that work with screen readers by reducing cursor-position trickery.

**Weakness:** Go ecosystem. GSP is Node.js for Screen 1 and agent-rendered for Screens 2-5, so Charm's runtime architecture does not apply directly. The design principles do.

**Opportunity for GSP:** Adopt Lipgloss's tiered color degradation model for install.js. Use Charm's visual design language (clean borders, generous spacing, limited palette) as a quality benchmark.

---

## 2. Vercel CLI

**What they do:** Deploy platform with polished CLI. Source: vercel.com/docs/cli.

**Best-in-class moments:**
- Project setup auto-detects framework and shows defaults. This reduces onboarding friction to near zero. Relevant to Screen 1's runtime detection.
- Deploy output streams build logs with clear phase markers. Each phase has a distinct prefix and completion indicator.
- The arrow-key navigation for login method selection is smooth and accessible.

**Weakness:** Deploy output can become noisy with long build logs. The signal gets lost in verbose output. Vercel addresses this with `--prod` and `--debug` flags for controlling verbosity.

**Opportunity for GSP:** Adopt the auto-detection pattern for Screen 1 (detect which runtimes are available). Avoid Vercel's verbosity trap -- GSP's agent output should be concise by default.

---

## 3. Oh My Zsh / Omarchy

**What they do:** Shell framework installers with branded terminal experiences. Source: ohmyz.sh, github.com/ohmyzsh/ohmyzsh.

**Best-in-class moments:**
- Oh My Zsh's installer shows a large ASCII banner that creates an emotional moment. It marks the transition from "before" to "after" clearly.
- The install script prompts to change default shell -- a single high-impact question, not a questionnaire.
- Omarchy (GSP's competitive reference) applies a similar branded splash approach.

**Weakness:** Oh My Zsh's banner is purely decorative. There is no status feedback during the install process -- it either works or you get an error. GSP's Screen 1 improves on this with status messages during install.

**Opportunity for GSP:** Match Oh My Zsh's emotional impact with the Banner component, but add the structured feedback it lacks. The sparkle field + density ramp design is more sophisticated than a static ASCII art block.

---

## 4. Starship Prompt

**What they do:** Cross-shell prompt with status visualization. Written in Rust. Source: starship.rs.

**Best-in-class moments:**
- Shows contextual information at a glance: git branch, language version, command duration, exit code. Each module is visually distinct but cohesive.
- Color is semantic: red for errors, green for success. The palette is intentionally limited.
- Config is TOML-based, making it easy to customize. This is relevant to how GSP's brand tokens work.
- Nerd Font icon support with plain-text fallbacks for terminals without icon fonts.

**Weakness:** The prompt is dense. With many modules enabled, it becomes a wall of tiny colored segments. Information density can overwhelm.

**Opportunity for GSP:** Adopt Starship's semantic color discipline -- limited palette, every color means something. The Pipeline Flow component should feel as glanceable as a Starship prompt: scan left-to-right, understand state instantly.

---

## 5. Ink (React for CLI)

**What they do:** Bring React's component model to terminal UIs. Used by Gatsby, Prisma, Shopify. Source: github.com/vadimdemedes/ink.

**Best-in-class moments:**
- Component composition model: `<Box>`, `<Text>`, `<Static>`. This separates structure from styling, which is exactly what GSP's component specs aim for in a non-runtime context.
- Flexbox layout via Yoga. Terminal layout is grid-based, but Ink proves that structured layout is possible and valuable in terminals.
- The `<Static>` component renders permanent output (like build logs) while interactive elements update below. This is the pattern for Screen 3's dashboard: static pipeline overview at top, detailed status below.

**Weakness:** Ink is a runtime dependency. GSP Screens 2-5 are agent-rendered, so Ink's React model does not apply directly. The component thinking does.

**Opportunity for GSP:** Use Ink's component taxonomy as validation for GSP's own component system. The fact that Ink uses `<Box>` (our Summary Box), `<Text>` (our Status Message), and `<Static>` (our Phase Block) confirms these are the right primitives.

---

## 6. npm/yarn/pnpm Install Output

**What they do:** Package manager install flows with progress feedback. Source: npmjs.com, yarnpkg.com, pnpm.io.

**Best-in-class moments:**
- pnpm: Clean, minimal output. Shows only what changed. Progress bar for download, then a concise summary. This is the gold standard for "not noisy."
- yarn: Structured phases (Resolving, Fetching, Linking) each with their own progress indicator. Phase-based progress maps to GSP's pipeline concept.
- npm v10: Added timing information to output. Users can see which steps take time.

**Weakness:** npm historically showed too much (the full dependency tree). This trained users to ignore install output entirely.

**Opportunity for GSP:** Follow pnpm's conciseness. Screen 1's post-install output should be as tight as pnpm: banner, status lines, file tree, done. No dependency trees, no verbose logs.

---

## Cross-Cutting Patterns Worth Adopting

1. **Tiered color degradation** (Charm) -- detect and adapt, do not break
2. **Auto-detection over configuration** (Vercel) -- detect runtimes, do not ask
3. **Emotional brand moment** (Oh My Zsh) -- the banner matters
4. **Semantic-only color** (Starship) -- every color earns its place
5. **Component primitives** (Ink) -- Box, Text, Static map to GSP components
6. **Conciseness by default** (pnpm) -- show less, mean more

---

## Related

- [UX Patterns](./ux-patterns.md) -- generalized patterns these competitors implement
- [Technical Research](./technical-research.md) -- implementation approaches for these patterns
- [Recommendations](./recommendations.md) -- adopt/adapt/avoid synthesis
