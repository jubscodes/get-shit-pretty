# Stack
> Design System Analysis | Generated: 2026-03-18

## Classification

**Codebase type:** `existing`
**Rationale:** Mature Node.js CLI tool and Claude Code plugin with a 1,847-line multi-runtime installer, 170+ source files across 26 skills, 14 agents, 12 prompts, and a 597-line automated test suite. Fully custom — no scaffold or boilerplate origin.

## Tech Stack

| Layer | Value |
|-------|-------|
| Framework | Node.js (CLI / plugin — no frontend framework) |
| Language | JavaScript (CommonJS) |
| Styling | ANSI escape codes (truecolor, 256-color, 16-color, no-color tiers) |
| UI Kit | None (terminal-native — box-drawing characters, Unicode block elements, sparkle fields) |
| Package Manager | npm (`package-lock.json` present) |
| Build Tool | None — ships raw JS; no transpilation or bundling step |

## Architecture Patterns

| Pattern | Value |
|---------|-------|
| Component style | Procedural Node.js scripts (no classes, no React) |
| State management | Filesystem-based — `.design/STATE.md`, `config.json`, markdown artifacts |
| Data fetching | `fs.readFileSync` for local state; `npm view` for update checks; MCP servers for GitHub/Figma |
| Routing | CLI arg parsing in `bin/install.js` (`--claude`, `--opencode`, `--gemini`, `--codex`, `--global`, `--local`) |
| File organization | Role-based directories: `gsp/skills/`, `gsp/agents/`, `gsp/prompts/`, `gsp/templates/`, `gsp/references/`, `scripts/`, `dev/` |

## Key Paths

| Path | Purpose |
|------|---------|
| Components | N/A — this is a CLI tool, not a UI application |
| Layouts | N/A |
| Pages / Screens | N/A |
| Tokens / Theme | `gsp/references/design-tokens.md`, `.design/branding/get-shit-pretty/system/tokens.json` |
| Config | `package.json`, `.claude-plugin/plugin.json`, `.mcp.json`, `gsp/hooks/hooks.json` |
| Public / Assets | N/A — distributed via npm; no static assets |
| Installer | `bin/install.js` (1,847 lines — multi-runtime installer) |
| Scripts | `scripts/gsp-statusline.js`, `scripts/statusline-dispatcher.js`, `scripts/lint-check.sh` |
| Dev tools | `dev/scripts/audit-tests.sh`, `dev/tests/installer.test.js`, `dev/tests/installer-integration.test.js` |
| Skills source | `gsp/skills/` (26 skill directories, each with `SKILL.md`) |
| Agents source | `gsp/agents/` (14 agent `.md` files) |
| Prompts | `gsp/prompts/` (12 system prompts) |
| Templates | `gsp/templates/` (project/brand config, state, system scan templates) |
| References | `gsp/references/` (13 reference docs — HIG, WCAG, trends, archetypes, etc.) |
