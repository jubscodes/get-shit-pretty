# Market Landscape

> Phase: discover | Brand: get-shit-pretty | Generated: 2026-03-18

---

## Industry Context

GSP operates at a nascent intersection: **design engineering for CLI-native AI workflows**. This is not a crowded market -- it is a market that barely exists yet. The adjacent territories are large and growing fast, which creates both the opportunity and the framing challenge.

### The AI Coding Tools Explosion

The AI code assistant market hit $3.0-3.5B in 2025 and is accelerating. Claude Code leads with 46% satisfaction (vs Cursor at 19%, GitHub Copilot at 9%). The terminal won -- Claude Code, Gemini CLI, and Codex all bet on CLI-first interaction, and 84% of developers now use or plan to use AI tools daily.

The critical insight for GSP: **AI makes building fast, but it does not make building coherent.** AI-assisted engineers create 98% more pull requests, but those PRs ship inconsistent UIs, mismatched colors, and gut-call design decisions. The speed amplifies the design debt.

### The Design Tool Disconnect

Figma expanded beyond designers -- only a third of its users now identify as designers. But it remains a GUI tool disconnected from terminal workflows. Storybook documents components but doesn't guide brand decisions. shadcn/ui provides components but acknowledged the "visual sameness" problem, shipping Shadcn Create in late 2025 to combat it.

None of these tools answer the question: **"How do I make coherent design decisions from my terminal?"**

### The Vibe Coding Phenomenon

The "vibe coding" tools market (v0, Bolt.new, Lovable) reached $4.7B in 2025, projected to hit $12.3B by 2027. V0 generates React components from prompts. Bolt.new scaffolds full-stack apps. But they produce output, not process. They give you a landing page, not a brand system.

This is GSP's strategic wedge: vibe coding tools answer "make me a thing." GSP answers "make me a thing that belongs to a coherent whole."

## Key Players by Adjacent Category

| Category | Players | Relationship to GSP |
|----------|---------|-------------------|
| AI Coding Agents | Claude Code, Cursor, Codex, Gemini CLI | **Hosts** -- GSP runs inside these |
| Component Libraries | shadcn/ui, Radix, Chakra | **Downstream** -- GSP feeds design tokens to these |
| Design Tools | Figma, Framer | **Lateral** -- different medium, overlapping intent |
| Component Docs | Storybook, Docusaurus | **Downstream** -- GSP's output feeds documentation |
| Vibe Coding | v0, Bolt.new, Lovable | **Competitors for attention** -- solve adjacent problem differently |
| Terminal Aesthetics | Omarchy, Ghostty, Starship | **Cultural context** -- set expectations for CLI beauty |

## User Expectation Shifts

### For Dev (Primary Persona)

Developers in 2026 expect their tools to be opinionated. The success of shadcn/ui (copy-paste, own your code), Linear (professional means beautiful), and Claude Code (agentic, not assistive) shows builders want systems that make decisions for them, not menus of options.

Dev expects:
- **Dark mode as default**, not a toggle. 82.7% of users run dark mode.
- **CLI-native** -- if it requires leaving the terminal, it's a different tool category.
- **Monospace as a legitimate design language**, not a compromise. Geist Mono, Berkeley Mono, and JetBrains Mono proved monospace is a brand choice.
- **Speed over ceremony** -- the tool should feel as fast as the AI coding agent it lives inside.

### For Des (Secondary Persona)

Designers watching AI ship entire products feel the disconnect growing. Figma's own brand refresh acknowledged this: their audience is no longer "designers" but "product builders." The design engineering role -- someone who bridges design thinking and implementation -- is the aspiration.

Des expects:
- **Design vocabulary respected** -- not dumbed down, but translated into developer context.
- **Process, not just output** -- a system that walks through brand decisions, not a generator that spits out tokens.
- **Craft signals** -- the tool itself must demonstrate design quality. Dogfooding is the trust signal.

## Market Trajectory

The market is converging on a single truth: **the terminal is where products get built now, and design needs to meet builders there.**

Three trajectories create GSP's window:

1. **AI coding tools are becoming platforms.** Claude Code, Cursor, and Codex are adding plugin/skill ecosystems. GSP is positioned to be the design layer in these ecosystems.
2. **Component libraries are becoming brand-aware.** shadcn Create, Tailwind themes, and design token specs (DTCG) are standardizing how design decisions flow into code. GSP can sit upstream of all of them.
3. **"Beautiful terminal" is now a real expectation.** Omarchy, Ghostty, Starship, and Warp proved that CLI users care about aesthetics. The audience that wants a pretty terminal also wants pretty output from their terminal.

The risk: this window closes if a major AI coding platform builds design guidance natively. The opportunity: none of them are close to doing so. Their focus is code generation, not brand coherence.

---

## Related

- [Competitive Audit](./competitive-audit.md)
- [Trend Analysis](./trend-analysis.md)
