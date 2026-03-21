# Changelog

All notable changes to get-shit-pretty are documented here.

## [Unreleased]

## [0.5.0] — 2026-03-21

### Added
- Plugin architecture — manifest at `.claude-plugin/plugin.json`, MCP servers, hooks
- Quick mode for `/gsp:start` — skip the branding diamond entirely, start from a style preset and go straight to project brief
- Phased build pipeline — `/gsp:scaffold` skill for deterministic stack setup, wave-based agent execution with lean context per agent
- 34 design style presets via `/gsp:style` — structured YAML tokens + AI-ready prompts from designprompts.dev
- `/gsp:accessibility` standalone composable skill — 5 modes: design audit, token audit, code audit, accessibility statement, quick contrast check
- `/gsp:palette` and `/gsp:typescale` composable skills — OKLCH palettes and mathematical type scales
- `/gsp:design-system` composable skill — workspace-level codebase scanner replacing inline scanner in `/gsp:start`
- Brand-as-custom-style output — system phase produces `{brand-name}.yml` and `{brand-name}.md` matching built-in preset format
- Style base integration across branding diamond — presets flow through all 4 phases as shared aesthetic vocabulary
- Multi-runtime installer — OpenCode, Gemini CLI, and Codex CLI support with tool name mapping and body replacements
- Agent runtime config — `maxTurns`, `disallowedTools`, `permissionMode` frontmatter
- Automated installer test suite — 37 tests across 5 suites (versions, contracts, installer, runtime, templates)
- Color composition strategies reference — 30-60-10 ratio guidance for design agents
- WCAG 2.2 new criteria — SC 2.4.11, SC 2.5.8, SC 3.2.6, SC 3.3.7, SC 3.3.8 + APCA reference
- Dev tools: `/gsp-audit` (37-test integrity suite), `/gsp-housekeeping`, `/gsp-dev`, `/gsp-runtime-compat`
- 27 skills, 14 agents (up from 21 skills, 12 agents in v0.4.x)

### Changed
- Skills-only architecture — removed commands, all functionality lives in `gsp/skills/*/SKILL.md`
- Moved all GSP content under `gsp/` prefix (agents, skills, prompts, templates, references)
- Merged verbal identity into strategy phase — branding diamond is now 4 phases (discover, strategy, identity, system)
- Simplified brand agents with concise prompts and persona-focused methodology
- Renamed `gsp-auditor` agent → `gsp-accessibility-auditor`
- Critique phase reuses prior `/gsp:accessibility` output instead of re-running auditor
- Sonnet model set on evaluation agents for faster feedback loops
- Library-aware component strategy in builder agent

### Fixed
- Cross-runtime installer — OpenCode, Gemini CLI, and Codex CLI now produce correct formats
- Removed ANSI escape codes from all skill text output — was printing literal `\x1b[` instead of rendering colors
- Updated all skill frontmatter from `disable-model-invocation` to `user-invocable: true`
- Brand-research style preset wiring
- Installer banner sparkle line centering

### Migration guide (v0.4.x → v0.5.0)

**Breaking: directory structure changed.** All GSP content moved under `gsp/` prefix:
- `agents/` → `gsp/agents/`
- `skills/` → `gsp/skills/`
- `prompts/` → `gsp/prompts/`
- `templates/` → `gsp/templates/`
- `references/` → `gsp/references/`

**Breaking: commands removed.** All functionality is now skills-only (`gsp/skills/*/SKILL.md`). If you had custom workflows referencing GSP commands, update them to use `/gsp:` skill invocations.

**Breaking: branding diamond is 4 phases, not 5.** Verbal identity is merged into the strategy phase. If you have existing `.design/branding/` output from v0.4.x, the verbal artifacts are still valid — strategy now produces them inline.

**Upgrade path:**
1. Run `npx get-shit-pretty` (or `npm install -g get-shit-pretty && gsp`) to reinstall
2. Existing `.design/` project output is compatible — no migration needed for design artifacts
3. If you have custom hooks or scripts referencing old paths, update to `gsp/` prefix

## [0.4.3] — 2025-11-21

### Changed
- README refresh with updated architecture docs
- Skills discoverability via SKILL.md frontmatter

## [0.4.2] — 2025-11-10

### Added
- Build-to-codebase pipeline — builder writes directly to project code
- Branded CLI with tiered ANSI colors and phase transitions
- Design workflow with critique loop, reference material, and progress tracking
- QA review loop after build phase
- ASCII art easter egg (`/gsp:pretty` and `/gsp:art`)

### Changed
- Renamed commands: `/gsp:new` → `/gsp:start`, added `project-` prefix to project phases
- Restored `AskUserQuestion` guided choices across pipeline

## [0.4.1] — 2025-10-30

### Fixed
- Executable permission on `bin/install.js`

### Added
- Installer onboarding experience with branded output
- Symlink dev mode for local Claude installs
- Multi-runtime installer (OpenCode, Gemini, Codex)
- `/gsp:update` command

## [0.4.0] — 2025-10-20

### Added
- Dual-diamond architecture (Branding + Project)
- Full branding pipeline: research → strategy → verbal → identity → system
- `/gsp:doctor` project health diagnostic
- Design trend index with 9 enriched trend files

### Changed
- Refactored from single pipeline to dual-diamond model

## [0.3.0] — 2025-10-01

### Added
- Chunked export format — agents produce 50-200 line chunks with INDEX.md
- Codebase-aware pipeline with scope and strategy routing
- Chunk format reference specification

## [0.2.0] — 2025-09-15

### Changed
- Refactored Phase 5: Spec → Implementation Spec
- Added npm package installer
- Updated agents and commands for new phase structure

## [0.1.0] — 2025-09-01

### Added
- Initial release
- 12 specialist prompts
- 6-phase design pipeline (research → system → design → spec → build → review)
- Apple HIG, WCAG 2.2, Nielsen heuristics references
- Design tokens (W3C format) reference
