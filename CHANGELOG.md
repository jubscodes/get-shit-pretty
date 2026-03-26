# Changelog

All notable changes to get-shit-pretty are documented here.

## [Unreleased]

## [0.6.2] — 2026-03-26

### Added
- Model and effort routing to all 30 skills — opus for creative/technical pipeline phases, sonnet for research/utility/composable (partial #68)
- SubagentStop hooks for all 8 chunk-producing agents: designer, critic, identity-designer, pattern-architect, scoper, campaign-director, builder, reviewer
- Audit tests: C11 (model routing), C12 (context fork safety), I19 (fork + interactive guard), V4 (zero prod deps), V5 (template config version sync), V6 (CLAUDE.md count drift)
- ARCHITECTURE.md with mermaid diagrams and glossary

### Changed
- Context optimization rules added to CLAUDE.md — execution_context pruning, template-at-write-time, agent input inlining
- All dependencies moved to devDependencies (zero prod deps)
- Launch skill upgraded to opus (creative copywriting, not utility)

### Fixed
- Inline agent inputs across identity phase — eliminates redundant file reads by agents (18-35s savings per read)
- Template config versions synced to 0.6.2 (were stuck at 0.5.0)
- CLAUDE.md installer table agent count corrected (14 → 15)

## [0.6.1] — 2026-03-24

### Fixed
- Brand discovery no longer batches questions — each question is its own `AskUserQuestion` call with exactly one decision. "One message per round" replaced with "one decision per question" as the primary questioning principle (#65)
- Added "never re-ask" rule across all phases — if user answered in a prior phase, downstream skills read from BRIEF.md instead of re-asking (#65)
- Brand flow restructured: "brand name → have materials? → path selection" gate replaces signal-word detection for new vs evolve mode (#65)
- E2E flow fixed — brand pipeline completes fully before project brief gathering (was batching 22 questions before any work happened) (#65)
- `copyClaudeSkills` now adds `gsp-` prefix to skill dirs that don't have it — matches all other runtimes (#64)
- All 4 runtime copy functions now recursively copy sibling files in skill directories, not just SKILL.md — fixes `gsp-style/styles/` (74 preset files) missing in global installs (#64)
- `/gsp:update` aligned with installer — supports all 4 runtimes, references current bundle layout, uses `AskUserQuestion`

### Added
- 5 new audit tests: C10 (update-installer alignment), I16 (execution_context ref resolution), I17 (sibling file copy), I18 (gsp- prefix guard)
- `/gsp:doctor` installation checks: I2 (skill completeness), I3 (bundle directories), I4 (VERSION file)
- "One decision per question" rule added to all 13 interactive skills

## [0.6.0] — 2026-03-24

### Added
- Brand refine skill (`/gsp:brand-refine`) — surgical token/palette adjustments mid-project without re-running the branding diamond. Self-contained with tints.dev API and contrast checks inline (#35)
- Accessibility audit skill (`/gsp:accessibility-audit`) — split from `/gsp:accessibility` for agent-spawning modes (design audit, code audit, statement generation) (#60)
- Overwrite guards in `/gsp:palette` and `/gsp:style` — warn before clobbering upstream artifacts (#55)
- Installer onboarding philosophy blurb ("Design engineering for AI coding tools")

### Changed
- **BREAKING:** Dropped monolith fallback from 7 skills + builder agent. Skills now require chunk format (INDEX.md + chunks). `/gsp:doctor` B4 check flags monolith files as unsupported (#54)
- Compressed path resolution from ~5 to ~2 lines across 17 skills (#56)
- Trimmed `/gsp:start` (418 → 321 lines) — cut greeting examples, verbose questioning (#57)
- Trimmed `/gsp:typescale` (355 → 232 lines) — cut standard math, kept GSP-specific decisions (#58)
- Trimmed `/gsp:style` (341 → 178 lines) — cut hardcoded catalog, kept token mapping (#59)
- Split `/gsp:accessibility` (349 lines) into inline checks (213 lines) + agent audit (218 lines) (#60)
- Skills count: 28 → 30, agents count: 15

### Removed
- Legacy monolith format support (IDENTITY.md, STRATEGY.md, SYSTEM.md, SCREENS.md fallbacks)

## [0.5.2] — 2026-03-24

### Added
- Brand sync skill (`/gsp:brand-sync`) — standalone reverse-propagation of project changes back to brand across four dimensions: tokens, voice & tone, visual patterns, and personality (#50)
- Brand feedback loop in build pipeline — detect brand-level changes at three checkpoints (foundation review, extraction, revision) and sync back to brand system (#49)
- Build quality gates — component extraction checkpoint, progressive token adoption, opt-in preview verification (#33)
- Context management — SessionStart hook for state recovery after context compaction, per-chunk and per-phase output budgets (#40)
- Prompt audit tooling — 7 automated checks (P1–P7) in audit suite + AI-driven `gsp-prompt-audit` dev skill for semantic analysis (#46)
- Visual taste evaluation — anti-patterns reference (AI convergence counters), 15-item taste checklist scored alongside Nielsen's heuristics, advanced visual effects and block patterns
- Style preset schema extracted to `references/style-preset-schema.md`
- Publish dev skill (`/gsp-publish`) for orchestrated releases

### Changed
- Trimmed 848 lines across 27 skills/agents/prompts — prompts slimmed to role-only headers, agents own methodology, dead weight removed (#43)
- Critic now produces dual scores: usability (/50) + taste (/75)
- Designer, builder, and critic wired to anti-patterns reference
- Skills count: 27 → 28, agents count: 14 → 15

### Fixed
- Installer agent installation — `copyAgents()` clean option prevents second call from wiping first call's work (#51)
- Installer banner redesigned — left-aligned box with centered sparkle field
- Vague spacing directive replaced with concrete 4/8px guidance
- Duplicated Nielsen scoring table removed from critic agent

## [0.5.1] — 2026-03-23

### Added
- Visual effects reference (`gsp/references/visual-effects.md`) — CSS/Tailwind recipes for shadows, glow, glass, gradients, noise, motion, typography effects
- Block patterns reference (`gsp/references/block-patterns.md`) — section composition patterns for heroes, features, pricing, CTAs, footers
- Imagery pipeline — designer specifies image resources per screen matching brand imagery style; builder implements branded images; critic and reviewer validate imagery consistency
- Brand visual DNA wiring — `{brand-name}.md` (generated by pattern architect) now flows into designer and builder agents
- Visual quality gates in Design-to-Code Translator prompt (background treatment, shadow depth, entrance motion, typography hierarchy, state polish)
- Audit test I15 — statusline VERSION path detection validates current + legacy fallback

### Changed
- Renamed `system/` → `patterns/` across branding pipeline for clarity
- Designer agent loads `imagery-style.md` from brand identity
- Builder foundations phase creates CSS utilities for brand signature effects
- Critic evaluates imagery consistency against brand direction
- Reviewer audits for generic placeholders and mismatched imagery types

### Fixed
- Brand→project transition — enforce phase prerequisites, fix `/gsp:start` routing with existing content
- Pipeline progress display centralized to `references/phase-transitions.md`
- `/gsp:update` VERSION detection — handles both v0.5.0+ (`{runtime-dir}/VERSION`) and legacy v0.4.x (`{runtime-dir}/get-shit-pretty/VERSION`) paths
- Statusline VERSION detection — same dual-path fallback
- GitHub URL in update skill (`jubs-cloud` → `jubscodes`)

### Performance
- Background git detection during project setup
- Pre-fetch competitor URLs before agent spawn in research phase

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
- Merged verbal identity into strategy phase — branding diamond is now 4 phases (discover, strategy, identity, patterns)
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
