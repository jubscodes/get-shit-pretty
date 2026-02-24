<div align="center">

# GET SHIT PRETTY

**Design engineering for AI coding tools.**

**Research, brand, design system, UI, specs, review, build, launch — from your terminal.**

[![npm version](https://img.shields.io/npm/v/get-shit-pretty?style=for-the-badge&logo=npm&logoColor=white&color=CB3837)](https://www.npmjs.com/package/get-shit-pretty)
[![npm downloads](https://img.shields.io/npm/dm/get-shit-pretty?style=for-the-badge&logo=npm&logoColor=white&color=CB3837)](https://www.npmjs.com/package/get-shit-pretty)
[![GitHub stars](https://img.shields.io/github/stars/jubscodes/get-shit-pretty?style=for-the-badge&logo=github&color=181717)](https://github.com/jubscodes/get-shit-pretty)
[![License](https://img.shields.io/badge/license-MIT-blue?style=for-the-badge)](LICENSE)

<br>

```bash
npx get-shit-pretty
```

**Works on Mac, Windows, and Linux.**

<br>

*"Vibe-coded apps work. They also all look the same. GSP fixes that."*

<br>

[Why GSP Exists](#why-gsp-exists) · [How It Works](#how-it-works) · [Commands](#commands) · [Agents & Prompts](#agents--prompts) · [AI Tool Support](#ai-coding-tool-support)

</div>

---

## Why GSP Exists

The gap between design and code is shrinking — but only from one direction.

Figma ships Code Connect, Dev Mode, MCP servers. Design tools are learning to speak code. That bridge is being built.

Coding tools aren't learning to speak design.

You can vibe-code an entire app in an afternoon. It works. It also looks like every other vibe-coded app — the same shadcn components, the same layouts, the same sea of sameness. No research, no brand thinking, no system, no critique. AI coding tools are powerful builders with zero design process.

AI didn't cause this. Skipping design thinking did.

GSP brings design fundamentals into the tools developers already use. Research. Brand. Design systems. UI patterns. Accessibility. Critique. The process that makes design consistent — running in your terminal.

For designers, it's the other direction. Code-first environments without giving up your process. Your design decisions become tokens, specs, and components — not a Figma file someone rebuilds from scratch.

Both disciplines. Same pipeline. Same environment. Design engineering — not designers learning to code or developers learning to design, but both working through the same system.

The missing half of the bridge.

---

## How It Works

### 1. Start a Project

```
/gsp:new-project
```

Answer questions about your product — what it does, who it's for, the vibe you're going for. GSP creates a design brief that guides everything downstream.

**Creates:** `.design/BRIEF.md`

---

### 2. Research

```
/gsp:research
```

Analyzes design trends in your space — competitor patterns, emerging styles, what's working and what's not. Start with context, not guesses.

**Creates:** `.design/research/TRENDS.md`

---

### 3. Brand

```
/gsp:brand
```

Builds your complete identity — positioning, personality, logo directions, color palette, typography system. Your brand, not a default theme.

**Creates:** `.design/brand/IDENTITY.md`

---

### 4. Design System

```
/gsp:system
```

Translates your brand into a functional design system — color scales, type scales, spacing, component foundations, and design tokens. Your system, in code.

**Creates:** `.design/system/SYSTEM.md`, `tokens.json`

---

### 5. UI Design

```
/gsp:design
```

Designs your screens and interaction flows following Apple HIG patterns. Layout, navigation, states, responsive behavior — all documented with enough detail to build from.

**Creates:** `.design/screens/SCREENS.md`

---

### 6. Figma Specs

```
/gsp:spec
```

Converts screen designs into Figma-ready specifications — auto-layout rules, exact spacing, component variants, token references. Skip the handoff. Specs that both designers and AI can consume.

**Creates:** `.design/specs/FIGMA-SPECS.md`

---

### 7. Review

```
/gsp:review
```

Two parallel agents audit your designs:
- **Design Critique** — Structured critique using Nielsen's 10 usability heuristics
- **Accessibility Audit** — WCAG 2.2 AA compliance check

If issues are found, loop back to fix before building.

**Creates:** `.design/review/CRITIQUE.md`, `ACCESSIBILITY.md`

---

### 8. Build

```
/gsp:build
```

Translates reviewed designs into production-ready frontend code. Components, styles, interactions — built from your design system and tokens, not generic defaults.

**Creates:** `.design/build/CODE.md`, `components/`

---

### 9. Launch

```
/gsp:launch
```

Creates marketing campaign assets — landing page copy, social media content, launch materials. Your product ships with a story, not just code.

**Creates:** `.design/launch/CAMPAIGN.md`

---

### The Full Pipeline

```
/gsp:new-project → BRIEF.md
       ↓
/gsp:research    → .design/research/TRENDS.md
       ↓
/gsp:brand       → .design/brand/IDENTITY.md
       ↓
/gsp:system      → .design/system/SYSTEM.md + tokens.json
       ↓
/gsp:design      → .design/screens/SCREENS.md
       ↓
/gsp:spec        → .design/specs/FIGMA-SPECS.md
       ↓
/gsp:review      → .design/review/CRITIQUE.md + ACCESSIBILITY.md
       ↓  (loop back if issues found)
/gsp:build       → .design/build/CODE.md + components/
       ↓
/gsp:launch      → .design/launch/CAMPAIGN.md
```

All artifacts live in `.design/` within your project directory.

---

## Commands

| Command | What it does |
|---------|--------------|
| `/gsp:new-project` | Initialize a design brief through guided Q&A |
| `/gsp:research` | Analyze design trends for your industry |
| `/gsp:brand` | Create brand identity (strategy, logo, color, type) |
| `/gsp:system` | Build design system foundations + tokens |
| `/gsp:design` | Design UI/UX screens and flows |
| `/gsp:spec` | Generate Figma-ready specifications |
| `/gsp:review` | Design critique + accessibility audit |
| `/gsp:build` | Translate designs to production code |
| `/gsp:launch` | Create marketing campaign assets |
| `/gsp:progress` | Check project status |
| `/gsp:help` | Show command reference |

---

## Agents & Prompts

GSP ships with 9 specialized agents, each modeled after a real design discipline:

| Agent | Role |
|-------|------|
| **Design System Architect** | Complete design systems (Apple Principal Designer level) |
| **Brand Identity Creator** | Full brand identities (Pentagram Creative Director level) |
| **UI/UX Pattern Master** | App UI design following Apple HIG |
| **Marketing Asset Factory** | Campaign asset libraries |
| **Figma Auto-Layout Expert** | Figma-ready specifications with tokens |
| **Design Critique Partner** | Structured critiques using Nielsen's 10 heuristics |
| **Design Trend Synthesizer** | Industry trend analysis and competitive research |
| **Accessibility Auditor** | WCAG 2.2 AA compliance auditing |
| **Design-to-Code Translator** | Design to production-ready frontend code |

Each agent has deep reference material — Apple HIG patterns, Nielsen's heuristics, WCAG checklists, design token standards — baked into its prompts.

---

## AI Coding Tool Support

GSP works across all major AI coding tools:

| Feature | Claude Code | OpenCode | Gemini CLI | Codex CLI |
|---------|:-----------:|:--------:|:----------:|:---------:|
| Slash commands | `/gsp:command` | `/gsp-command` | `/gsp:command` | `$gsp-command` |
| Agents | Yes | Yes | Yes | Yes |
| Prompts | Yes | Yes | Yes | Yes |
| Templates | Yes | Yes | Yes | Yes |
| References | Yes | Yes | Yes | Yes |
| Statusline | Yes | — | — | — |
| Global install | `~/.claude` | `~/.config/opencode` | `~/.gemini` | `~/.codex` |
| Local install | `.claude/` | `.opencode/` | `.gemini/` | `.codex/` |

---

## Install

```bash
npx get-shit-pretty
```

The installer prompts you to choose:
1. **Runtime** — Claude Code, OpenCode, Gemini, Codex, or all
2. **Location** — Global (all projects) or local (current project only)

<details>
<summary><strong>Non-interactive install</strong></summary>

```bash
# Claude Code
npx get-shit-pretty --claude --global
npx get-shit-pretty --claude --local

# OpenCode
npx get-shit-pretty --opencode --global

# Gemini CLI
npx get-shit-pretty --gemini --global

# Codex CLI
npx get-shit-pretty --codex --global

# All runtimes
npx get-shit-pretty --all --global
```

</details>

<details>
<summary><strong>Uninstall</strong></summary>

```bash
npx get-shit-pretty --claude --global --uninstall
npx get-shit-pretty --opencode --global --uninstall
npx get-shit-pretty --codex --global --uninstall
```

</details>

<details>
<summary><strong>Legacy install (bash)</strong></summary>

```bash
git clone https://github.com/jubscodes/get-shit-pretty.git ~/get-shit-pretty
cd ~/get-shit-pretty
chmod +x install.sh
./install.sh
```

</details>

---

## Requirements

- An AI coding tool: [Claude Code](https://claude.ai/claude-code), [OpenCode](https://opencode.ai), [Gemini CLI](https://github.com/google-gemini/gemini-cli), or [Codex CLI](https://github.com/openai/codex)

---

## License

MIT License. See [LICENSE](LICENSE) for details.

---

<div align="center">

**Your code works. GSP makes it yours.**

</div>
