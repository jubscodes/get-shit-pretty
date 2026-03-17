# Changelog

All notable changes to get-shit-pretty are documented here.

## [Unreleased]

### Added
- `/gsp:accessibility` standalone composable skill — 5 modes: design audit, token audit, code audit, accessibility statement, quick contrast check
- WCAG 2.2 new criteria in checklist — SC 2.4.11 Focus Not Obscured, SC 2.5.8 Target Size, SC 3.2.6 Consistent Help, SC 3.3.7 Redundant Entry, SC 3.3.8 Accessible Authentication
- Token-specific accessibility checks section and APCA reference in wcag-checklist.md
- Style base integration across branding diamond — presets from `/gsp:style` flow through research, strategy, identity, and system phases as shared aesthetic vocabulary
- Custom style output per brand — system phase produces `{brand-name}.yml` and `{brand-name}.md` in the same format as the 34 built-in presets

### Changed
- Renamed `gsp-auditor` agent → `gsp-accessibility-auditor` for clarity and dual-spawning support
- Critique phase reuses prior `/gsp:accessibility` output instead of re-running auditor
- Review phase detects prior code accessibility audits from `/gsp:accessibility --code`
- Help skill adds Composable section with all 4 composable skills
- Brand config template gains `style_base` array in `system_config`

## [0.5.0] — 2026-03-15

### Added
- Plugin architecture — manifest at `.claude-plugin/plugin.json`, MCP servers, hooks
- 34 design style presets via `/gsp:style` — structured YAML tokens + AI-ready prompts from designprompts.dev
- Multi-runtime installer — OpenCode, Gemini CLI, and Codex CLI support with tool name mapping, body replacements, and per-runtime discovery paths
- Agent runtime config — `maxTurns`, `disallowedTools`, `permissionMode` frontmatter
- Dev tools: `/gsp-audit` (36-test integrity suite), `/gsp-housekeeping` (drift catcher), `/gsp-dev` (dev router), `/gsp-runtime-compat` (live doc drift checker)

### Changed
- Skills-only architecture — removed commands, all functionality lives in `gsp/skills/*/SKILL.md`
- Moved all GSP content under `gsp/` prefix (agents, skills, prompts, templates, references)
- Merged verbal identity into strategy phase — branding diamond is now 4 phases (discover, strategy, identity, system)
- Simplified brand agents with concise prompts and persona-focused methodology

### Fixed
- OpenCode installer — proper skills, agents, and body replacements

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
