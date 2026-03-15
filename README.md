<div align="center">

# GET SHIT PRETTY

**Design engineering system for AI coding tools.**

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

*"GSD gets shit done. GSP gets shit pretty."*

*Brief to build. In your terminal.*

<br>

[Why GSP Exists](#why-gsp-exists) · [How It Works](#how-it-works) · [Branding Diamond](#-diamond-1--branding) · [Project Diamond](#-diamond-2--project) · [Commands](#commands) · [Agents](#agents) · [AI Tool Support](#ai-coding-tool-support)

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

GSP follows a **dual-diamond** architecture — two complete design cycles that take you from nothing to shipped.

```
/gsp:start → picks up where you left off, routes you forward

         ◆ Diamond 1 — Branding                  ◆ Diamond 2 — Project
    ┌──────────────────────────┐           ┌──────────────────────────────┐
    │  brand-research          │           │  project-brief               │
    │    ↓                     │           │    ↓                         │
    │  brand-strategy          │           │  project-research            │
    │    (includes voice       │           │    ↓                         │
    │     and messaging)       │           │  project-design              │
    │    ↓                     │           │    ↓                         │
    │  brand-identity          │           │  project-critique ←──┐      │
    │    ↓                     │           │    ↓            loop │      │
    │  brand-patterns          │           │  project-build       │      │
    └──────────────────────────┘           │    ↓                 │      │
                                           │  project-review ─────┘      │
                                           └──────────────────────────────┘
                                                      ↓
                                                  /gsp:launch (optional)
```

All artifacts live in `.design/` within your project directory.

---

### ◆ Diamond 1 — Branding

Build your brand from research to design system. Each phase feeds the next.

> **Already have a brand?** Start with `/gsp:brand-audit` to assess what you have before evolving it.

#### 1. `/gsp:brand-research` — Market landscape

Research your audience, competitors, and market position. Understand the terrain before making decisions.

**Creates:** `.design/branding/{brand}/discover/`

#### 2. `/gsp:brand-strategy` — Who you are and how you sound

Define your archetype, positioning, and personality using the Kapferer Brand Identity Prism. Includes voice, tone spectrum, messaging framework, and naming conventions — verbal identity is part of strategy.

**Creates:** `.design/branding/{brand}/strategy/`

#### 3. `/gsp:brand-identity` — How you look

Create your visual identity — logo directions, color palette, typography system, imagery style. Design decisions, not decoration.

**Creates:** `.design/branding/{brand}/identity/`

#### 4. `/gsp:brand-patterns` — Your design system

Translate your brand into tokens, components, and a living design system. Everything codified and ready to build with.

**Creates:** `.design/branding/{brand}/system/`

---

### ◆ Diamond 2 — Project

Design and build a product using your brand. Critique loops catch issues before they ship.

#### 1. `/gsp:project-brief` — Scope what you're building

Define your project through guided Q&A — what it does, who it's for, what screens it needs. The brief that guides everything downstream.

**Creates:** `.design/projects/{project}/BRIEF.md`

#### 2. `/gsp:project-research` — Patterns and precedents

Deep research into UX patterns, competitor approaches, and technical considerations for your specific project.

**Creates:** `.design/projects/{project}/research/`

#### 3. `/gsp:project-design` — Screens and flows

Design your UI screens and interaction flows following Apple HIG patterns. Layout, navigation, states, responsive behavior — documented to build from.

**Creates:** `.design/projects/{project}/design/`

#### 4. `/gsp:project-critique` — Critique + accessibility

Two parallel audits: structured design critique using Nielsen's 10 usability heuristics, and a WCAG 2.2 AA accessibility check. If issues surface, loop back and fix before building.

**Creates:** `.design/projects/{project}/critique/`

#### 5. `/gsp:project-build` — Designs to code

Translate reviewed designs into production-ready frontend code — written directly into your codebase. Components, styles, interactions built from your design system and tokens.

**Creates:** Components and styles in your codebase

#### 6. `/gsp:project-review` — QA against designs

Validate what was built against the original design intent. Catches drift between design decisions and implementation.

**Creates:** `.design/projects/{project}/review/`

---

### Optional: `/gsp:launch`

Create marketing campaign assets — landing page copy, social media content, launch materials. Your product ships with a story, not just code.

**Creates:** `.design/projects/{project}/launch/`

---

## Commands

### Entry

| Command | What it does |
|---------|--------------|
| `/gsp:start` | Pick up where you left off — routes you forward |
| `/gsp:progress` | Check project status |
| `/gsp:help` | Show command reference |

### Branding

| Command | What it does |
|---------|--------------|
| `/gsp:brand-audit` | Audit an existing brand before evolving it |
| `/gsp:brand-research` | Research market, audience, competitors |
| `/gsp:brand-strategy` | Define archetype, positioning, personality, voice, messaging |
| `/gsp:brand-identity` | Create visual identity — logo, color, type |
| `/gsp:brand-patterns` | Build design system — tokens, components |

### Project

| Command | What it does |
|---------|--------------|
| `/gsp:project-brief` | Scope through guided Q&A |
| `/gsp:project-research` | UX patterns, competitor analysis |
| `/gsp:project-design` | Design screens and interaction flows |
| `/gsp:project-critique` | Nielsen's heuristics + WCAG 2.2 AA audit |
| `/gsp:project-build` | Translate designs to production code |
| `/gsp:project-review` | QA validation against designs |
| `/gsp:launch` | Marketing campaign assets |

### Utility

| Command | What it does |
|---------|--------------|
| `/gsp:add-reference` | Add reference material to a project |
| `/gsp:doctor` | Check project health |
| `/gsp:update` | Update GSP to latest version |
| `/gsp:art` | Craft ASCII art interactively |
| `/gsp:pretty` | Surprise ASCII art in the terminal |

---

## Agents

GSP ships with 15 specialized agents, each modeled after a real design discipline:

| Agent | Role |
|-------|------|
| **Brand Strategist** | Brand strategy using Kapferer Prism, archetypes, positioning, voice, and messaging |
| **Identity Designer** | Visual identity — logo, color palettes, typography systems |
| **Design System Architect** | Complete design systems — tokens, components, foundations |
| **Brand Auditor** | Brand coherence assessment and evolution mapping |
| **Trend Researcher** | Market landscape, competitor analysis, emerging patterns |
| **Project Researcher** | Deep UX patterns, competitor UX, technical approaches |
| **Project Scoper** | Project scope through guided Q&A |
| **UI/UX Designer** | Screen design and interaction flows following Apple HIG |
| **Design Critic** | Structured critiques using Nielsen's 10 heuristics |
| **Accessibility Auditor** | WCAG 2.2 AA compliance auditing |
| **Design-to-Code Builder** | Designs to production-ready frontend code |
| **Deliverable Reviewer** | QA validation — implementation against design intent |
| **Campaign Director** | Marketing campaign asset libraries |
| **Codebase Scanner** | Tech stack detection and existing pattern inventory |
| **ASCII Artist** | Terminal ASCII art — context-aware art generation |

Each agent carries deep reference material — Apple HIG patterns, Nielsen's heuristics, WCAG checklists, design token standards — baked into its prompts.

---

## AI Coding Tool Support

GSP works across all major AI coding tools. The installer converts Claude Code's native format into each runtime's expected format.

| Feature | Claude Code | OpenCode | Gemini CLI | Codex CLI |
|---------|:-----------:|:--------:|:----------:|:---------:|
| Skills | 21 | 21 | 21 | 21 |
| Agents | 15 | 15 | 15 (experimental) | — |
| Commands | 20 | 20 (flattened) | 20 (TOML) | via skills |
| Slash syntax | `/gsp:command` | `/gsp-command` | `/gsp:command` | `$gsp-command` |
| Prompts + templates | Yes | Yes | Yes | Yes |
| References | Yes | Yes | Yes | Yes |
| Statusline hooks | Yes | — | — | — |

### Runtime directories

| Runtime | Config / bundle | Skills | Agents |
|---------|-----------------|--------|--------|
| Claude Code | `~/.claude/` | `~/.claude/skills/` | `~/.claude/agents/` |
| OpenCode | `~/.config/opencode/` | `~/.config/opencode/skills/` | `~/.config/opencode/agents/` |
| Gemini CLI | `~/.gemini/` | `~/.gemini/skills/` | `~/.gemini/agents/` |
| Codex CLI | `~/.codex/` | `~/.agents/skills/` | — |

> **Codex note:** Skills are discovered at `~/.agents/skills/`, not `~/.codex/skills/`. Config and bundle files (prompts, templates, references) stay at `~/.codex/get-shit-pretty/`. Codex does not support agent `.md` files.

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
npx get-shit-pretty --gemini --global --uninstall
npx get-shit-pretty --codex --global --uninstall
```

</details>

<details>
<summary><strong>Use as Claude Code plugin</strong></summary>

```bash
# From a project directory:
claude --plugin-dir /path/to/get-shit-pretty
```

Uses the `.claude-plugin/plugin.json` manifest. Skills, agents, and hooks load directly from source — no install step needed.

</details>

---

## Repo Structure

```
get-shit-pretty/
├── .claude-plugin/        Plugin manifest (plugin.json)
├── bin/
│   └── install.js         Multi-runtime installer
├── scripts/               Hook scripts and utilities
├── gsp/                   Source of truth for all content
│   ├── agents/            15 subagents (gsp-*.md)
│   ├── commands/gsp/      20 slash commands (backward compat)
│   ├── skills/            21 skills (*/SKILL.md — primary)
│   ├── hooks/             Plugin-level hooks (hooks.json)
│   ├── prompts/           12 agent system prompts
│   ├── templates/         Config, state, brief, roadmap templates
│   └── references/        Shared reference material
├── dev/                   Internal dev tools (not installed)
│   ├── skills/            Dev-only skills (gsp-audit, runtime-compat)
│   └── scripts/           Test suite (audit-tests.sh)
├── package.json           npm package config
├── VERSION                Single source for version string
└── CLAUDE.md              AI agent instructions for this repo
```

Skills take precedence over commands when both exist. The installer reads from `gsp/` and writes to each runtime's config directory.

---

## Contributing

Edit source under `gsp/` — never edit inside `.claude/` or other runtime dirs directly. For local development, the installer creates symlinks so changes reflect immediately without reinstalling.

```bash
# Install locally with symlinks
node bin/install.js --claude --local

# Test as a plugin
claude --plugin-dir .

# Run the integrity test suite
bash dev/scripts/audit-tests.sh
```

See [CLAUDE.md](CLAUDE.md) for editing rules, key files, and dev tool setup.

---

## Requirements

- An AI coding tool: [Claude Code](https://claude.ai/claude-code), [OpenCode](https://opencode.ai), [Gemini CLI](https://github.com/google-gemini/gemini-cli), or [Codex CLI](https://github.com/openai/codex)

---

## License

MIT License. See [LICENSE](LICENSE) for details.

---

<div align="center">

**Ship a brand, not just code.**

</div>
