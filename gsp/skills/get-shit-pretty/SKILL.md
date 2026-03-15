---
name: get-shit-pretty
description: "Design engineering for AI coding tools. Full pipeline: brand research, strategy, identity, design system, UI design, critique, accessibility audit, build, and launch. Runs specialized agents with Apple HIG, Nielsen's heuristics, WCAG 2.2 AA, and design token standards baked in."
user-invocable: false
---

# Get Shit Pretty

Design engineering system for AI coding tools. Brand identity + design projects, from strategy to code.

## Install

GSP requires a full installation to work — agents, prompts, templates, and references that power the pipeline. Run:

```bash
npx get-shit-pretty
```

Pick your runtime (Claude Code, OpenCode, Gemini CLI, or Codex CLI), choose global or local install, and you're set.

## What You Get

A dual-diamond design pipeline with 23 commands:

```
◆ Branding
research → strategy → identity → patterns

◆ Project
brief → research → design → critique → build → review → launch
                                ↑                  │
                                └──── loop ────────┘
```

Each skill spawns a specialized agent modeled after a real design discipline:

- **Brand Research** — market landscape, audience, competitors
- **Brand Strategy** — archetype, positioning, personality, voice, tone, messaging (Kapferer Prism)
- **Brand Identity** — logo directions, color palette, typography
- **Brand Patterns** — design tokens, component foundations
- **Project Brief** — scope, screen list, gap analysis
- **Project Research** — UX patterns, competitor experiences
- **Project Design** — screens and flows (Apple HIG)
- **Project Critique** — Nielsen's 10 heuristics + WCAG 2.2 AA audit
- **Project Build** — production code from your design system
- **Project Review** — QA validation against designs
- **Launch** — marketing campaign assets

All artifacts live in `.design/` inside your project. Design decisions as code, versioned alongside your codebase.

## Links

- GitHub: https://github.com/jubscodes/get-shit-pretty
- npm: https://www.npmjs.com/package/get-shit-pretty
