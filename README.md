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

[Why GSP Exists](#why-gsp-exists) · [Quick Start](#quick-start) · [How It Works](#how-it-works) · [Style Presets](#style-presets) · [Expertise Skills](#expertise-skills) · [Skills](#skills) · [Agents](#agents) · [Architecture](#architecture) · [AI Tool Support](#ai-coding-tool-support) · [Contributing](#contributing)

</div>

---

## Why GSP Exists

The gap between design and code is shrinking — but only from one direction.

Figma ships Code Connect, Dev Mode, MCP servers. Design tools are learning to speak code. That bridge is being built. Coding tools aren't learning to speak design.

You can vibe-code an entire app in an afternoon. It works. It also looks like every other vibe-coded app — the same shadcn components, the same layouts, the same sea of sameness. No research, no brand thinking, no system, no critique. AI coding tools are powerful builders with zero design process.

GSP brings design fundamentals into the tools developers already use. Research. Brand. Design systems. UI patterns. Accessibility. Critique. The process that makes design consistent — running in your terminal.

For designers, it's the other direction. Code-first environments without giving up your process. Your design decisions become tokens, specs, and components — not a Figma file someone rebuilds from scratch.

Both disciplines. Same pipeline. Same environment. The missing half of the bridge.

---

## Quick Start

```bash
# 1. Install
npx get-shit-pretty

# 2. Define your brand — or skip with a style preset
/gsp-brand-brief                    # guided brand definition
/gsp-style cyberpunk                # instant tokens from 35 presets

# 3. Build something
/gsp-project-brief                  # scope your project
/gsp-project-build                  # parallel agents build it
```

Or run `/gsp-start` — it detects your workspace state and routes you forward.

---

## How It Works

GSP follows a **dual-diamond** architecture — two complete design cycles that take you from nothing to shipped.

```
/gsp-start → picks up where you left off, routes you forward

       ◆ Diamond 1 — Branding                    ◆ Diamond 2 — Project
  ┌──────────────────────────────┐         ┌──────────────────────────────┐
  │  brand-brief                 │         │  project-brief               │
  │    ↓                         │         │    ↓                         │
  │  brand-research              │         │  project-research            │
  │    ↓                         │         │    ↓                         │
  │  brand-strategy              │         │  project-design              │
  │    (includes voice           │         │    ↓                         │
  │     and messaging)           │         │  project-critique ←──┐      │
  │    ↓                         │         │    ↓            loop │      │
  │  brand-identity              │         │  project-build       │      │
  │    (4 expertise skills       │         │    ↓                 │      │
  │     run in parallel)         │         │  project-review ─────┘      │
  │    ↓                         │         └──────────────────────────────┘
  │  brand-guidelines            │
  └──────────────────────────────┘
```

All artifacts live in `.design/` within your project directory. State tracked in `STATE.md` with automatic session recovery.

---

## Style Presets

35 built-in design styles. Fuzzy-matched — describe what you want, get production-ready tokens.

```bash
/gsp-style cyberpunk                # exact match
/gsp-style "something dark and techy"  # fuzzy → cyberpunk, terminal, modern-dark
```

| Category | Presets |
|----------|---------|
| **Industrial** | nothing |
| **Minimal** | swiss-minimalist, flat-design, monochrome, minimal-dark |
| **Modern** | professional, saas, enterprise, fluent, material, modern-dark, glassmorphism, liquid-glass |
| **Creative** | neubrutalism, cyberpunk, maximalism, bold-typography, playful-geometric, sketch, kinetic |
| **Elegant** | luxury, art-deco, academia, humanist-literary |
| **Organic** | botanical, organic |
| **Editorial** | newsprint |
| **Nostalgic** | retro, vaporwave |
| **Tactile** | claymorphism, neumorphism, industrial |
| **Tech** | terminal, web3 |
| **Geometric** | bauhaus |

Each preset produces design tokens (W3C format), `STYLE.md`, and foundation chunks. Skip the full branding diamond when you just need a solid starting point.

---

## Expertise Skills

Seven standalone design tools that work independently or as part of the pipeline.

| Skill | What it does |
|-------|--------------|
| `/gsp-color` | Palettes, contrast, semantic mapping, dark mode (OKLCH) |
| `/gsp-typography` | Scale, pairing, fluid type, vertical rhythm |
| `/gsp-visuals` | Imagery, 3D, video, textures, surface treatments |
| `/gsp-icons` | Library selection, sizing, containers, custom SVG direction |
| `/gsp-logo` | Concepts, variations, usage rules, clear space |
| `/gsp-accessibility` | Quick contrast checks and token WCAG audits (inline) |
| `/gsp-style` | Apply a preset — tokens without the full branding diamond |

These are the knowledge owners in GSP's two-layer architecture. Pipeline skills invoke them during orchestration, but you can run any of them directly for standalone design decisions.

---

### ◆ Diamond 1 — Branding

Build your brand from research to design system. Each phase feeds the next.

> **Already have a brand?** Run `/gsp-start` and choose "evolve existing brand" — it sets up the `.design/` structure, then routes you to `/gsp-brand-audit` to assess what you have before evolving it.

#### 1. `/gsp-brand-brief` — Define your brand

Guided Q&A — who it's for, why it exists, what it should feel like. The brief that feeds every downstream phase.

**Creates:** `.design/branding/{brand}/BRIEF.md`

#### 2. `/gsp-brand-research` — Market landscape

Research your audience, competitors, and market position. Understand the terrain before making decisions.

**Creates:** `.design/branding/{brand}/discover/`

#### 3. `/gsp-brand-strategy` — Who you are and how you sound

Define your archetype, positioning, and personality using the Kapferer Brand Identity Prism. Includes voice, tone spectrum, messaging framework, and naming conventions — verbal identity is part of strategy.

**Creates:** `.design/branding/{brand}/strategy/`

#### 4. `/gsp-brand-identity` — How you look

Create your visual identity — logo directions, color palette, typography system, imagery style. Four expertise skills (logo, color, typography, visuals) run in parallel for speed.

**Creates:** `.design/branding/{brand}/identity/`

#### 5. `/gsp-brand-guidelines` — Your design system

Operationalize your brand — assemble tokens, `STYLE.md`, component mapping, and guidelines. Everything codified and ready to build with.

**Creates:** `.design/branding/{brand}/system/`

---

### ◆ Diamond 2 — Project

Design and build a product using your brand. Critique loops catch issues before they ship.

#### 1. `/gsp-project-brief` — Scope what you're building

Define your project through guided Q&A — what it does, who it's for, what screens it needs. The brief that guides everything downstream.

**Creates:** `.design/projects/{project}/BRIEF.md`

#### 2. `/gsp-project-research` — Patterns and precedents

Deep research into UX patterns, competitor approaches, and technical considerations for your specific project.

**Creates:** `.design/projects/{project}/research/`

#### 3. `/gsp-project-design` — Screens and flows

Design your UI screens and interaction flows following Apple HIG patterns. Layout, navigation, states, responsive behavior — documented to build from.

**Creates:** `.design/projects/{project}/design/`

#### 4. `/gsp-project-critique` — Critique + accessibility

Two parallel audits: structured design critique (Nielsen's 10 heuristics + brand contract scoring) and WCAG 2.2 AA accessibility check. Mixed-model assignment — critic runs on your model while the accessibility auditor runs on Sonnet, eliminating rate-limit competition. Brand constraint violations auto-fail.

**Creates:** `.design/projects/{project}/critique/`

#### 5. `/gsp-project-build` — Designs to code

Seven-phase parallel build pipeline: scaffold, foundations, review, components (parallel wave), screens (parallel wave), extraction review, finalize. Round-robin model assignment (Opus/Sonnet) distributes rate-limit pressure across agents. ~47% faster than sequential builds.

**Creates:** Components and styles in your codebase

#### 6. `/gsp-project-review` — QA against designs

Validate what was built against the original design intent. Catches drift between design decisions and implementation. Pass/Conditional/Fail verdict.

**Creates:** `.design/projects/{project}/review/`

---

## Skills

### Entry

| Skill | What it does |
|-------|--------------|
| `/gsp-start` | Pick up where you left off — routes you forward |
| `/gsp-progress` | Check project status |
| `/gsp-help` | Show skill reference |

### Branding

| Skill | What it does |
|-------|--------------|
| `/gsp-brand-brief` | Define your brand through guided Q&A |
| `/gsp-brand-audit` | Audit an existing brand before evolving it |
| `/gsp-brand-research` | Research market, audience, competitors |
| `/gsp-brand-strategy` | Define archetype, positioning, personality, voice, messaging |
| `/gsp-brand-identity` | Create visual identity — logo, color, type |
| `/gsp-brand-guidelines` | Build design system — tokens, STYLE.md, components |
| `/gsp-brand-refine` | Surgical token and palette adjustments mid-project |
| `/gsp-brand-sync` | Sync brand to match a project's shipped state |

### Project

| Skill | What it does |
|-------|--------------|
| `/gsp-project-brief` | Scope through guided Q&A |
| `/gsp-project-research` | UX patterns, competitor analysis |
| `/gsp-project-design` | Design screens and interaction flows |
| `/gsp-project-critique` | Nielsen's heuristics + WCAG 2.2 AA audit |
| `/gsp-project-build` | Translate designs to production code |
| `/gsp-project-review` | QA validation against designs |

### Expertise

| Skill | What it does |
|-------|--------------|
| `/gsp-color` | Design color systems — palettes, contrast, dark mode |
| `/gsp-typography` | Design type systems — scale, pairing, fluid type |
| `/gsp-visuals` | Define visual direction — imagery, textures, 3D |
| `/gsp-icons` | Design icon systems — library, sizing, custom SVG |
| `/gsp-logo` | Design logo directions — concepts, variations, rules |
| `/gsp-accessibility` | Quick contrast checks and token WCAG audits |
| `/gsp-style` | Apply a style preset — tokens without the full diamond |

### Utilities

| Skill | What it does |
|-------|--------------|
| `/gsp-design-system` | Scan and document existing design system state |
| `/gsp-scaffold` | Deterministic stack setup — install deps, create configs, verify build |
| `/gsp-accessibility-audit` | Full WCAG 2.2 AA accessibility audit |
| `/gsp-add-reference` | Add reference material to a project |
| `/gsp-doctor` | Check project health |
| `/gsp-update` | Update GSP to latest version |
| `/gsp-art` | Craft ASCII art interactively |
| `/gsp-pretty` | Surprise ASCII art in the terminal |

---

## Agents

GSP ships 11 specialized agents, each modeled after a real design discipline:

| Agent | Role |
|-------|------|
| **Brand Strategist** | Brand strategy using Kapferer Prism, archetypes, positioning, voice, and messaging |
| **Brand Creative Director** | Visual identity — logo, color palettes, typography systems |
| **Brand Engineer** | Design systems — tokens, components, foundations, guidelines |
| **Brand Auditor** | Brand coherence assessment and evolution mapping |
| **Brand Researcher** | Market landscape, competitor analysis, emerging patterns |
| **Project Researcher** | Deep UX patterns, competitor UX, technical approaches |
| **Project Designer** | Screen design and interaction flows following Apple HIG |
| **Project Critic** | Structured critiques using Nielsen's 10 heuristics |
| **Project Builder** | Designs to production-ready frontend code |
| **Project Reviewer** | QA validation — implementation against design intent |
| **Accessibility Auditor** | WCAG 2.2 AA compliance auditing |

Agents are thin stubs (~12 lines) at session start — full methodology loads on-demand when spawned. Each agent gets its own context window for focused work.

### Parallel execution

Build phases spawn agents in parallel waves with round-robin model assignment:

```
Orchestrator
  │
  ├── Wave 1: Components (parallel)
  │   ├── Agent A (Opus)   → Button, Card, Input
  │   ├── Agent B (Sonnet) → Nav, Footer, Sidebar
  │   └── Agent C (Opus)   → Hero, Modal, Toast
  │   └── ✓ SubagentStop hooks verify each agent's output
  │
  └── Wave 2: Screens (parallel)
      ├── Agent D (Sonnet) → Home
      ├── Agent E (Opus)   → Dashboard
      └── Agent F (Sonnet) → Settings
      └── ✓ SubagentStop hooks verify each agent's output
```

Components build first so screens can compose from them. Mixed-model assignment distributes rate-limit pressure — no single model gets overloaded.

---

## Architecture

### Two-layer skills

```
┌─────────────────────────────────────────────────┐
│  Pipeline Skills (orchestrators)                │
│  brand-brief → research → strategy →            │
│  identity → guidelines                          │
│  project-brief → research → design →            │
│  critique → build → review                      │
│                                                 │
│  ┌─────────────────────────────────────────┐    │
│  │  Expertise Skills (knowledge owners)    │    │
│  │  color · typography · visuals · icons   │    │
│  │  logo · accessibility · style           │    │
│  │  ← invoked by pipeline OR standalone    │    │
│  └─────────────────────────────────────────┘    │
│                                                 │
│  Utilities                                      │
│  start · progress · help · doctor · scaffold    │
│  art · pretty · update                          │
└─────────────────────────────────────────────────┘
```

Pipeline skills own workflow — state management, phase gates, agent spawning. Expertise skills own domain knowledge — palettes, type scales, visual direction. Pipeline skills read from expertise skills, never the other way around. No domain knowledge is duplicated across skills.

### `.design/` artifacts

Every phase writes structured output to `.design/`:

```
.design/
├── branding/{brand}/
│   ├── BRIEF.md, STATE.md, config.json
│   ├── discover/        ← brand-research
│   ├── strategy/        ← brand-strategy (includes voice + messaging)
│   ├── identity/        ← brand-identity (color, type, logo, imagery)
│   └── system/          ← brand-guidelines (tokens, STYLE.md, components)
│
├── projects/{project}/
│   ├── BRIEF.md, STATE.md, config.json
│   ├── research/        ← project-research
│   ├── design/          ← project-design (screens, flows, preview.html)
│   ├── critique/        ← project-critique (Nielsen + WCAG scores)
│   ├── build/           ← project-build (logs, status, manifests)
│   └── review/          ← project-review (acceptance report, verdict)
│
└── CHANGELOG.md         ← aggregated across all projects
```

### Hooks and integrations

- **SessionStart** — context recovery script re-injects active brand/project state on session resume
- **SubagentStop** — 10 verification hooks confirm deliverables after every agent completes
- **PostToolUse** — lint-check on builder agent edits
- **Statusline** — live display of model, phase, prettiness score, context usage (Claude Code)
- **Figma MCP** — read designs directly from Figma into your pipeline
- **GitHub MCP** — issues and PRs accessible from within the pipeline

Zero production dependencies. The installer and all scripts use pure Node.js builtins.

---

## AI Coding Tool Support

GSP works across all major AI coding tools. The installer converts Claude Code's native format into each runtime's expected format.

| Feature | Claude Code | OpenCode | Gemini CLI | Codex CLI |
|---------|:-----------:|:--------:|:----------:|:---------:|
| Skills | 34 | 34 | 34 | 34 |
| Agents | 11 | 11 | 11 (experimental) | — |
| Slash syntax | `/gsp-command` | `/gsp-command` | `/gsp-command` | `$gsp-command` |
| MCP servers | Figma + GitHub | — | — | — |
| Statusline hooks | Yes | — | — | — |
| Prompts + templates | Yes | Yes | Yes | Yes |

### Runtime directories

| Runtime | Config / bundle | Skills | Agents |
|---------|-----------------|--------|--------|
| Claude Code | `~/.claude/` | `~/.claude/skills/` | `~/.claude/agents/` |
| OpenCode | `~/.config/opencode/` | `~/.config/opencode/skills/` | `~/.config/opencode/agents/` |
| Gemini CLI | `~/.gemini/` | `~/.gemini/skills/` | `~/.gemini/agents/` |
| Codex CLI | `~/.codex/` | `~/.agents/skills/` | — |

> **Codex note:** Skills are discovered at `~/.agents/skills/`, not `~/.codex/skills/`. Codex does not support agent `.md` files.

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
<summary><strong>Cherry-pick skills</strong></summary>

Don't need the full pack? Pick individual skills via the [skills CLI](https://github.com/nicepkg/skills):

```bash
npx skills add jubscodes/get-shit-pretty
```

Select the skills you want — no agents, hooks, or pipeline setup. Works with Claude Code.

</details>

---

## Repo Structure

```
get-shit-pretty/
├── bin/
│   └── install.js         Multi-runtime installer
├── scripts/               Hook scripts (statusline, lint-check, context recovery)
├── gsp/                   Source of truth for all content
│   ├── agents/            11 subagents (gsp-*.md stubs + methodology in skills)
│   ├── skills/            34 skills (*/SKILL.md + domains/ + references/ + methodology/)
│   ├── hooks/             Hooks (hooks.json)
│   └── templates/         Config, state, brief, roadmap templates
├── dev/                   Internal dev tools (not installed to runtimes)
│   ├── skills/            Dev skills (gspdev-audit, gspdev-benchmark, gspdev-publish, ...)
│   ├── scripts/           Test suite, token budget tools, benchmarking
│   └── benchmarks/        Token budget snapshots per release
├── package.json           npm package config (zero production dependencies)
├── VERSION                Single source for version string
└── CLAUDE.md              AI agent instructions for this repo
```

---

## Contributing

GSP's architecture is designed to be approachable. Each skill is a self-contained directory with a `SKILL.md` and optional sibling files (`methodology/`, `domains/`, `references/`). No complex build step — edit source, see results.

### Where contributions are welcome

- **New style presets** — add a `.yml` + `.md` to `gsp/skills/gsp-style/styles/` and register in `INDEX.yml`
- **Expertise domain files** — expand design knowledge in `gsp/skills/gsp-color/domains/`, `gsp-typography/domains/`, etc.
- **Runtime support** — improve installer compatibility for OpenCode, Gemini, Codex, or add new runtimes
- **Test coverage** — the test suite has 65+ tests across 9 suites but always needs more
- **Documentation** — skill descriptions, examples, tutorials

### Local development

```bash
# Clone and install with symlinks (edits to gsp/ reflect immediately)
node bin/install.js --claude --local

# Run the integrity test suite (9 suites: versions, contracts, installer, runtime, templates, prompts, unit, tokenbudget)
bash dev/scripts/audit-tests.sh

# Run a single suite
bash dev/scripts/audit-tests.sh contracts
```

### Dev tools

| Tool | Purpose |
|------|---------|
| `/gspdev-audit` | Pipeline integrity checker — contracts, installer, runtime compat |
| `/gspdev-benchmark` | Token budget benchmarking — snapshots, comparisons, trajectory |
| `/gspdev-housekeeping` | Drift catching — version mismatches, stale references |
| `/gspdev-prompt-audit` | Semantic analysis of skills and agents |
| `/gspdev-publish` | Release workflow — bump, changelog, audit, tag |

See [CLAUDE.md](CLAUDE.md) for editing rules, architecture details, and key files.

**Issues:** [github.com/jubscodes/get-shit-pretty/issues](https://github.com/jubscodes/get-shit-pretty/issues)

---

## Requirements

- An AI coding tool: [Claude Code](https://claude.ai/claude-code), [OpenCode](https://opencode.ai), [Gemini CLI](https://github.com/google-gemini/gemini-cli), or [Codex CLI](https://github.com/openai/codex)

---

## License

MIT License. See [LICENSE](LICENSE) for details.

---

<div align="center">

**Code is a commodity, your brand is not.**

</div>
