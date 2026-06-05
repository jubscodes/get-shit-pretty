# Changelog

All notable changes to get-shit-pretty are documented here.

## [Unreleased]

## [0.10.1] — 2026-06-05

### Fixed
- **`gsp-project-builder` theming reference path** — was `${CLAUDE_SKILL_DIR}/../../gsp-scaffold/shadcn-theming.md` (one `../` too many), causing the builder to silently fail to read the theming reference at runtime when building or fixing themes. Now correctly `${CLAUDE_SKILL_DIR}/../gsp-scaffold/shadcn-theming.md` ([#216](https://github.com/jubscodes/get-shit-pretty/pull/216))

> Note: this release is otherwise internal — see PRs [#212](https://github.com/jubscodes/get-shit-pretty/pull/212)–[#216](https://github.com/jubscodes/get-shit-pretty/pull/216) for the harness improvements landed in this cycle (CI gate, ESLint, `PreToolUse` hook template, cross-reference sensor, nested `CLAUDE.md` for source authoring). They don't change consumer behavior.

## [0.10.0] — 2026-05-05

### Added
- **`gsp-accessibility --validate` mode** — actively scores token sets against WCAG 2.2 AA contrast thresholds, replacing the prior passive reference-only role. Brand-guidelines now gates on this validation before finalizing the design system, blocking releases that would ship inaccessible token combinations ([#208](https://github.com/jubscodes/get-shit-pretty/pull/208), [#191](https://github.com/jubscodes/get-shit-pretty/issues/191))
- **`gspdev-eval-changes` dev skill** — quality eval for skill/agent/methodology changes. Spawns parallel evaluator agents that score against a fixed 8-dimension rubric (change intent + skill intent coherence + 6 preservation dimensions). Run before merging non-trivial trims and refactors ([#184](https://github.com/jubscodes/get-shit-pretty/pull/184))

### Changed
- **Expertise integration across the brand pipeline.** `brand-strategy`, `brand-identity`, and `brand-guidelines` now read domain knowledge from `gsp-color`, `gsp-typography`, `gsp-visuals`, and `gsp-accessibility` instead of duplicating it. Brand-guidelines invokes `gsp-accessibility --validate` as a hard gate ([#201](https://github.com/jubscodes/get-shit-pretty/pull/201) covering [#189](https://github.com/jubscodes/get-shit-pretty/issues/189), [#190](https://github.com/jubscodes/get-shit-pretty/issues/190), [#198](https://github.com/jubscodes/get-shit-pretty/issues/198))
- **Expertise integration across the project pipeline.** `project-design`, `project-critique`, `project-build`, and `project-review` now delegate to expertise skills for color/typography/a11y/icons/visuals knowledge. No more duplicated domain content in pipeline skills ([#202](https://github.com/jubscodes/get-shit-pretty/pull/202) covering [#194-#197](https://github.com/jubscodes/get-shit-pretty/issues/194), [#204](https://github.com/jubscodes/get-shit-pretty/pull/204) covering [#193](https://github.com/jubscodes/get-shit-pretty/issues/193))
- **`gsp-icons` becomes the single owner of icon-library knowledge.** Resolves long-standing duplication between `gsp-icons` and `gsp-visuals` — icon library config, sizing, container rules, and SVG direction now live in one place ([#203](https://github.com/jubscodes/get-shit-pretty/pull/203) covering [#192](https://github.com/jubscodes/get-shit-pretty/issues/192))

### Fixed
- **6 cross-skill path bugs across pipeline skills.** Several `${CLAUDE_SKILL_DIR}/../...` references resolved to wrong paths after the v0.9.1 colocation refactor — pipeline skills couldn't find templates and references on clean installs. New audit-test linters added to prevent regression of this class of bug ([#200](https://github.com/jubscodes/get-shit-pretty/pull/200) covering [#188](https://github.com/jubscodes/get-shit-pretty/issues/188), [#206](https://github.com/jubscodes/get-shit-pretty/pull/206) covering [#199](https://github.com/jubscodes/get-shit-pretty/issues/199))

### Performance
- **`gsp-project-build` body trim 538L → 450L** via 4 sibling extractions. Heaviest skill in the pipeline (1801 token weight) chipped down toward the red-zone threshold ([#207](https://github.com/jubscodes/get-shit-pretty/pull/207) covering [#205](https://github.com/jubscodes/get-shit-pretty/issues/205))
- **`gsp-project-critic` methodology trimmed to 89L.** Reduces context cost for the project-critique fork ([#187](https://github.com/jubscodes/get-shit-pretty/pull/187) covering [#185](https://github.com/jubscodes/get-shit-pretty/issues/185))
- **Methodology trims for double-dispatch agents** — across `gsp-project-builder`, `gsp-project-designer`, `gsp-project-reviewer`. Cuts spawn-time context for the heaviest agent paths ([#183](https://github.com/jubscodes/get-shit-pretty/pull/183) covering [#85](https://github.com/jubscodes/get-shit-pretty/issues/85))
- **Quick wins** — icon library config consolidation + drop pass-through token refs from execution_context blocks ([#180](https://github.com/jubscodes/get-shit-pretty/pull/180))

## [0.9.1] — 2026-05-05

### Fixed
- **Global installs were broken in 0.9.0.** `/gsp-brand-apply` and `/gsp-brand-refine` referenced `bin/serve-preset.js` and `bin/theme-css.js` via `${CLAUDE_SKILL_DIR}/../../../bin/...`, which on a clean install escaped `.claude/` and resolved into the user's home directory. Local dev hid the bug because `.claude/skills/*` is symlinked to `gsp/skills/*`, so the path traversal landed back on the source `bin/` by accident. Scripts are now colocated inside their owning skill (`gsp-brand-apply/bin/serve-preset.js`, `gsp-brand-guidelines/bin/theme-css.js`) and reference paths point to `${CLAUDE_SKILL_DIR}/bin/...` (or cross-skill via `${CLAUDE_SKILL_DIR}/../gsp-brand-guidelines/bin/...` from `gsp-brand-refine`). New audit test `I20` simulates copy-mode install and asserts scripts ship to the SKILL.md-expected paths ([#159](https://github.com/jubscodes/get-shit-pretty/pull/159))

## [0.9.0] — 2026-05-04

### Added
- **`/gsp-brand-apply` skill** — universal theme-install primitive that runs `shadcn apply --only theme` against a `{brand}.theme.json` registry artifact. Multi-brand-safe: prompts before overwriting an existing brand theme
- **`bin/theme-css.js --registry` flag** — emits the brand as a shadcn `registry:theme` registry-item.json, consumed by `/gsp-brand-apply`
- **`bin/serve-preset.js`** — ephemeral localhost HTTP server used by `/gsp-brand-apply` to satisfy shadcn CLI's HTTP-only `--preset` URL fetch

### Changed
- **`gsp-brand-guidelines`** now emits `{brand}.theme.json` alongside the `.yml` preset, and prompts to install it via `/gsp-brand-apply` (never auto-installs over an existing brand)
- **`gsp-brand-refine`** regenerates `.theme.json` on each pass and prompts to install the refresh via `/gsp-brand-apply`
- **`gsp-project-build` foundations agent** no longer pastes tokens into `globals.css`; the orchestrator gates on tokens-applied between scaffold and foundations

### Fixed
- Eliminated rework where `shadcn init` writes nova defaults to `globals.css` and `layout.tsx`, only for the foundations agent to overwrite both with brand values

### Known limitations
- **`/gsp-brand-apply` modifies more than the CSS file.** `shadcn apply --only theme` (verified empirically against shadcn 4.6.0) bumps dependency versions in `package.json` (`shadcn` itself, `@base-ui/react`, etc.), regenerates `package-lock.json`, and rewrites `components.json`. There's no upstream flag to suppress this. The skill detects pending uncommitted work in those files and refuses to proceed without consent, and surfaces a "Review" line in the success output if they were modified. See [#156](https://github.com/jubscodes/get-shit-pretty/issues/156)
- **`/gsp-brand-apply` flattens `var(--*)` indirection** in cssVars. Custom design systems that map shadcn semantic tokens to upstream tokens (e.g. `--background: var(--brand-bg);`) get the indirection replaced with literal OKLCH values. The skill detects this pattern and prompts before proceeding. Greenfield projects skip the prompt silently. See [#157](https://github.com/jubscodes/get-shit-pretty/issues/157)

## [0.8.3] — 2026-05-01

### Changed
- **Recommended install command is now `pnpm dlx get-shit-pretty`** with `bunx get-shit-pretty` shown alongside as an alternative. Updated across README, `bin/install.js` help output, `install.sh`, `CLAUDE.md`, the website install widget, and the `get-shit-pretty` / `gsp-update` / `gsp-doctor` skills. The package on the npm registry is unchanged — `npx get-shit-pretty` continues to work; we just no longer recommend it
- **Non-interactive installer default flipped from global → local** — running the installer in a non-TTY shell (CI, piped scripts, AI-tool spawns) now installs into `./.claude/` instead of `~/.claude/`. Interactive runs are unchanged. The "Non-interactive terminal detected" message updates to reflect the new default. CI scripts that relied on the previous behavior need to pass `--global` explicitly

## [0.8.2] — 2026-04-15

### Added
- **`gsp-brand-coherence` subagent** — dedicated coherence auditor spawned by `gsp-brand-guidelines` after Pass 1. Scores intensity dials (declared vs expressed), runs an archetype gate (12 archetypes, each with a signature tension), surfaces the top 2 gaps as pre-filled options for the user. Runs in a clean context window — no context poisoning from the heaviest phase in the pipeline
- **Emotional compass (`brand_heartbeat`)** — confirmed at the end of brand-brief, threads through all downstream phases: hero headline, coherence check header, perspective check framing, brand complete message
- **Visual direction question in brand-brief** — Q10 collects raw aesthetic feel before confirmation: image links, adjective clusters, mood descriptions. Synthesized into a `visual_direction` block in BRIEF.md
- **`.design/CLAUDE.md` auto-maintenance** — lightweight context file written by `gsp-brand-brief` (brand started), `gsp-brand-guidelines` (brand complete), `gsp-project-brief` (project started), and `gsp-project-review` (project complete). Gives Claude immediate orientation in new sessions without filesystem scanning
- **Left sidebar table of contents for `guidelines.html`** — fixed nav with anchor links to all sections, `.toc-link` styling from brand tokens, and a small inline scroll listener for active-state tracking
- **Self-rendering `guidelines.html` spec** — `guidelines-structure.md` defines the full structure contract: shadcn `:root` token names, primitive classes derived from brand identity, baseline section order with conditional additions, live typography scale, persona cards, voice rules
- **Coherence check → perspective check flow** — after coherence, a perspective check stress-tests the visual language against the brand heartbeat from primary persona, skeptic, and top competitor viewpoints before proceeding to components
- **Monorepo / multi-stack support** — `gsp-start` detects monorepo layouts and routes to the correct sub-package
- **Empty workspace guard** — all pipeline skills check for an initialized workspace before proceeding
- **E2E project directory creation** — `gsp-brand-brief` Step 7 creates the full `.design/branding/{brand}/` directory structure on confirmation

### Changed
- **`guidelines.html` is the "visual conference"** — framed as the distillation of all four branding diamond phases (discover → strategy → identity → patterns). Every element derived from pipeline outputs, no defaults
- **Coherence check extracted from inline to subagent** — avoids context poisoning; each refinement loop re-spawns a fresh `gsp-brand-coherence` agent with only `.yml`, `guidelines.html`, `archetype`, and `brand_heartbeat`
- **Skill trigger descriptions rewritten** — all pipeline skills use explicit trigger-language in their `description:` field for reliable auto-pickup

## [0.8.1] — 2026-04-13

### Fixed
- **P0: `sidebar` token name** — all 36 preset YAMLs and `style-preset-schema.md` renamed `sidebar-background` → `sidebar` to match shadcn's actual CSS variable (`--sidebar`). The old key resolved to undefined — entire sidebar color system was silently broken
- **P1: Radius formula** — `shadcn-rules.md` `@theme inline` now uses proportional multipliers (`* 0.6`, `* 0.8`, `* 1.4`) instead of fixed-px offsets (`- 4px`, `- 2px`, `+ 4px`). Old formula produced negative radii for small base values (e.g. `0.5rem - 4px = -3.84px`)
- **P1: Missing radius steps** — added `--radius-2xl` (`* 1.8`), `--radius-3xl` (`* 2.2`), `--radius-4xl` (`* 2.6`) to match shadcn's canonical `@theme inline` block
- **P1: Chart vars in `.dark`** — `bin/theme-css.js` now emits `chart-1` through `chart-5` in both `:root` and `.dark` blocks. Previously chart vars were only emitted in `:root`
- **P2: `@layer base` reset missing** — `shadcn-rules.md` v4 template now includes the canonical `@layer base` block (`border-border`, `outline-ring/50`, `bg-background text-foreground`)
- **P2: Typography not wired** — `bin/theme-css.js` `main()` now passes `tokens.typography` to `generateBlock()`, emitting `--font-sans`, `--font-mono`, `--font-display`, `--font-secondary` CSS vars in `:root`
- **P2: Stale HSL instruction** — `gsp-project-builder.md` foundations mode now instructs using `bin/theme-css.js` for OKLCH output instead of "convert hex to HSL space-separated channels"
- **`@import "tw-animate-css"` → `@import "shadcn/tailwind.css"`** — the old import referenced a separate npm package; `shadcn/tailwind.css` ships with the shadcn CLI and requires no additional install
- **No-op font vars removed from `@theme inline`** — removed `--font-sans: var(--font-sans)` circular self-references; font vars in `@theme inline` must be literal values (e.g. `"Inter", sans-serif`), not `var()` references to themselves
- **cursor:pointer restored** — Tailwind v4 changed `button` default cursor to `default`; added `button:not(:disabled), [role="button"]:not(:disabled) { cursor: pointer; }` to the `@layer base` template
- **Token injection order** — `shadcn-rules.md` now instructs running `shadcn add` before writing brand tokens; reversed order risked shadcn appending its own `cssVars` after custom OKLCH values
- **`init -d` scope clarified** — documented that `-d` forces Next.js + nova preset; added `-t {framework}` flag for Vite/React Router/Remix targets

### Added
- **Google Fonts pattern** — `shadcn-rules.md` now includes `@import url(...)` pattern and `@theme inline` font alias wiring for Google Fonts integration
- **Explicit `chart:` section in schema** — `style-preset-schema.md` now documents `chart-1` through `chart-5` as first-class tokens (not derived at emit time)
- **Chart colors in all 36 presets** — every preset YAML now has 5 intentional data-viz colors designed to be distinct and accessible at small sizes, aesthetically matched to each preset's character
- **Community registry install pattern** — `shadcn-rules.md` documents `npx shadcn@latest add @registry/item`, `--diff` preview flag, and `registryDependencies` auto-resolution
- **Chart rules in builder** — `gsp-project-builder.md` now documents: no `hsl()` wrapper on color tokens (use `var(--chart-1)` directly), mandatory explicit height on `<ChartContainer>`, `accessibilityLayer` prop, and `layout` prop placement
- **New Form Field API** — builder methodology documents the current `<Field>/<Controller>` pattern alongside backward-compat note for projects with the old `<FormField>/<FormItem>` API
- **Sidebar width pattern** — builder notes the correct `--sidebar-width` inline CSS prop on `<SidebarProvider>`
- **Global stack compliance** — `gsp-start` propagates tech stack detection through the full project lifecycle; all build, design, and review skills inherit and gate on the detected stack

## [0.8.0] — 2026-04-13

### Added
- **`bin/theme-css.js`** — deterministic script converts any `.yml` preset to `:root`/`.dark` CSS blocks. Hex values → OKLCH (full color math). Handles alpha values, font stacks, and shadows verbatim. Usage: `node bin/theme-css.js preset.yml --stdout`
- **`gsp-scaffold/shadcn-rules.md`** — Tier 1 shadcn knowledge: install, `globals.css` patterns for Tailwind v3/v4, token injection via `bin/theme-css.js`, component install, critical rules, dark mode setup (#108)
- **`gsp-project-build/shadcn-composition.md`** — Tier 2 shadcn knowledge: `cn()`, semantic color tokens, `asChild`, `cva` variants, Card/Dialog/Form composition, sizing utilities, RSC patterns, icon imports, customization rules (#108)
- **`gsp-project-build/flows/revision.md`** — extracted revision mode flow (#87)
- **`gsp-project-build/flows/figma.md`** — extracted Figma fallback flow (#87)

### Changed
- **Breaking: shadcn-native token schema** — all 36 `.yml` presets migrated from GSP semantic naming (`on-primary`, `surface`, `error`) to shadcn/ui-native keys (`primary-foreground`, `card`, `destructive`). Token keys map 1:1 to shadcn CSS variables — no translation layer
- **Sidebar tokens explicit in `.yml`** — all 36 presets have full `sidebar-background`, `sidebar-foreground`, `sidebar-primary`, `sidebar-primary-foreground`, `sidebar-accent`, `sidebar-accent-foreground`, `sidebar-border`, `sidebar-ring` tokens
- **OKLCH color format** — presets use `oklch(L C H)` and `oklch(L C H / alpha)` for translucent values instead of hex/rgba. shadcn v2+ accepts OKLCH natively
- **`gsp-brand-guidelines/token-mapping.md`** replaced with a redirect stub pointing to `bin/theme-css.js`
- **`gsp-brand-guidelines/design-tokens.md`** — W3C background context note added; clarifies GSP uses flat shadcn-native schema, not W3C layered naming
- **`gsp-project-build/SKILL.md`** — Step 2.6 now loads `shadcn-composition.md` instead of `token-mapping.md`; Steps 7 and 8 slimmed to redirect to extracted flow files (#87)
- **`gsp-brand-refine/SKILL.md`** — cascade example updated from old W3C names (`color.brand.accent`, `color.semantic.link`) to flat shadcn names (`color.accent`, `color.ring`)
- **`style-preset-schema.md`** — fully rewritten to document new shadcn-native schema



### Fixed
- **Build: token-mapping.md now passed to foundations agent** — foundations agent was supposed to convert `.yml` hex tokens to shadcn HSL CSS variables but had no mapping spec; now loads `token-mapping.md` in Step 2.6 with explicit instructions for all 26+ shadcn variables, hex→HSL conversion, and dark mode
- **Scaffold: capture `shadcn info --json`** — new Step 5.5 captures project context (aliases, tailwindVersion, resolvedPaths, isRSC, etc.) so the foundations agent knows the actual project configuration
- **Shadcn composition rules** — builder methodology now includes semantic token usage, `gap` not `space-y`, Card composition, `data-icon`, and CLI awareness rules
- **Style skills CLI install button** — corrected the `npx skills add` command in the hero

### Changed
- **Design: brand fidelity gates** — removed low-quality `preview.html` deliverable; added Step 0 "Internalize brand DNA" (extract constraints, patterns, effects, bold bets before designing) and Step 9 "Brand fidelity self-check" (verify every bold bet appears, no generic treatments)

## [0.7.3] — 2026-04-07

### Added
- **Skills CLI support** — GSP is now discoverable via [The Agent Skills Directory](https://skills.sh/). Cherry-pick individual skills with `npx skills add jubscodes/get-shit-pretty`
- **Bento grid reference** — `bento-grid.md` added to `gsp-project-build` with responsive layout patterns and common mistakes
- **New skills in `/gsp-help`** — brand-brief, icons, logo, scaffold, design-system now listed

### Fixed
- **Help output corrections** — pipeline diagram (brief → research → ...), directory structure (patterns/ → system/), GitHub URL (jubscodes)
- **Installer text** — "all commands" → "all skills" in post-install message

## [0.7.2] — 2026-04-04

### Added
- **Parallel agent orchestration** — project-build now runs components and screens as parallel agent waves with round-robin model assignment (Opus/Sonnet), reducing build wall-clock time by ~47%
- **Components phase** (Phase 4) — orchestrator builds component manifest, classifies (library-default/customize/custom/existing), partitions, and spawns parallel agents before screens
- **`component` execution mode** for `gsp-project-builder` — install, customize, or create assigned components
- **Mixed-model critique** — `gsp-accessibility-auditor` spawns on Sonnet while critic runs on user's model, eliminating rate-limit competition
- **Resumable builds** — per-agent status files (`build/status/*.json`) enable skipping completed agents on resume
- **Progress logs** — pre-spawn manifest and post-wave completion summaries for parallel agent waves
- **Brand contract enforcement in critique** — Step 4 verdict now reads brand contract score (X/25) alongside Nielsen (X/50); constraint violations auto-fail
- **SubagentStop hooks** for `gsp-accessibility-auditor`, `gsp-brand-auditor`, `gsp-brand-researcher`, `gsp-brand-strategist`
- **Nothing style preset** — minimalist design language inspired by Nothing's transparent, dot-matrix aesthetic

### Fixed
- **BUILD-LOG.md race condition** — parallel agents now write to individual log files (`build/logs/*.md`); orchestrator merges after each wave
- **Brand sync race** — brand feedback loop runs synchronously before components phase (stale `.yml` values prevented)
- **Foundation review routing** — correctly routes to components phase (Step 4.5), not screens
- **Revision mode compile checkpoint** — QA fixes now verified with build command before finalize
- **SubagentStop hook** for `gsp-project-builder` — mode-aware (no longer checks `build/INDEX.md` mid-pipeline)

### Changed
- **7-phase build pipeline** — scaffold → foundations → review → components (parallel) → screens (parallel) → extraction review → finalize
- **Lighter extraction review** — components phase handles reuse upfront; post-build scan is just hardcoded-value grep
- **Per-screen context filtering** — `prioritized-fixes.md` and `reference-specs.md` filtered to per-screen sections instead of full file
- **Compile checkpoint deduplication** — build command table defined once in Step 3, referenced by Steps 4.5, 5, and 8
- **Parallel identity enrichment** — 4 domain skills (logo, color, typography, visuals) now invoke simultaneously in Step 3.5
- **build.md template** updated to reflect 7-phase parallel pipeline

### Performance
- Token budget: +171 tokens (+1.1%) over v0.7.0 for ~47% wall-clock time reduction
- Benchmark: total weight 15,634 → 15,805; red-zone skills unchanged at 4

## [0.7.1] — 2026-04-01

### Changed
- **exec_context refactor** — 6 skills moved ~1,579 lines of pass-through refs to spawn-time reads. Orchestrators no longer load content they only forward to agents (brand-strategy, brand-guidelines, brand-identity, brand-research, accessibility-audit, project-critique)
- **Agent stubs architecture** — 12 agents extracted to lean frontmatter stubs (~130 lines total), methodology moved to skill directories. Session-start context reduced from ~1,536 to ~140 lines
- **Shared scoring library** — `score_skill()`, constants, and pipeline definitions extracted to `lib-scoring.sh`, shared by `token-budget.sh` and `benchmark.sh`
- **Model/effort enforcement removed** — skills no longer declare `model:` or `effort:` in frontmatter; users control model selection
- **Style preset cleanup** — stripped duplicated role preamble from 34 style `.md` files

### Added
- `dev/scripts/benchmark.sh` — token budget benchmarking: capture snapshots, compare against release baseline, track trajectory across versions
- `dev/scripts/lib-scoring.sh` — shared scoring library for token budget tools
- `dev/skills/gspdev-benchmark/` — interactive benchmark skill wrapping the script
- 8 release snapshots (v0.5.0–v0.7.0) in `dev/benchmarks/` showing weight trajectory
- `dev/scripts/token-budget.sh` — static token budget analyzer with pipeline path tracing
- `dev/scripts/token-proxy-start.sh` — live token proxy for measuring real API usage
- `gsp-brand-brief` skill — extracted from `gsp-start` for dedicated brand brief collection

### Removed
- `gsp-launch` skill and `gsp-campaign-director` agent
- `gsp-brand-syncer`, `gsp-scoper`, `gsp-ascii-artist` agents (consolidated or removed)

## [0.7.0] — 2026-03-29

### Added
- `gsp-phase-transition` utility skill — single source of truth for phase transition rendering (pipeline progress line, file tree, completion banner)
- `gsp-visuals` expertise skill — consolidates `gsp-images`, `gsp-3d`, `gsp-video`, `gsp-textures` into one skill with `domains/` architecture
- `domains/` architecture for expertise skills — domain knowledge in sibling files loaded on demand, zero session-start cost
- `gsp-color/domains/palette.md` and `gsp-color/domains/system.md` — split palette generation from full color system design
- `gsp-typography/domains/scale.md`, `pairing.md`, `system.md` — split scale generation, font pairing, and full system design
- UX contract enforcement (P4 audit test) — interactive skills must have "one decision per question" and "always use AskUserQuestion" rules
- Style preset schema upgraded with `intensity`, `patterns`, `constraints`, `effects` blocks (moved to `gsp-style/style-preset-schema.md`)

### Changed
- **Two-layer skill architecture** — expertise skills (knowledge owners: color, typography, visuals, accessibility, style) vs pipeline skills (orchestrators). Skills are lean routers delegating to domain files
- **Reference colocation** — all 21 files from `gsp/references/` moved into their primary consumer's skill directory. Ubiquitous references (`chunk-format.md`, `phase-transitions.md`) duplicated or extracted into skills
- **10 skills → 5 expertise skills** — `gsp-palette` → `gsp-color`, `gsp-typescale` → `gsp-typography`, `gsp-images`/`gsp-3d`/`gsp-video`/`gsp-textures` → `gsp-visuals`
- **12 duplicated `phase-transitions.md` → 1 skill** — pipeline skills now invoke `/gsp-phase-transition` instead of reading a reference file (-1,584 lines)
- **Dev skills renamed** `gsp-*` → `gspdev-*` — prevents installer cleanup from wiping dev skills; auto-symlinked on `--local`
- Installer no longer bundles `references/` directory — all references colocated in skill directories
- Agent/template prose updated from `references/chunk-format.md` to "standard chunk format" (content inlined by spawning skills)
- P4 audit test scoped to `allowed-tools` frontmatter, not arbitrary prose mentions

### Removed
- `gsp/references/` directory — all files moved to consuming skill directories
- `gsp-palette` skill (absorbed by `gsp-color`)
- `gsp-typescale` skill (absorbed by `gsp-typography`)
- `gsp-images`, `gsp-3d`, `gsp-video`, `gsp-textures` skills (absorbed by `gsp-visuals`)
- 12 duplicated `phase-transitions.md` files (replaced by `gsp-phase-transition` skill)

## [0.6.3] — 2026-03-28

### Added
- Structured style preset schema — `intensity`, `patterns`, `constraints`, `effects` blocks in all 34 `.yml` presets (#69)
- `STYLE.md` template rendering all 4 schema blocks into a single agent-readable contract
- `token-mapping.md` reference mapping `.yml` tokens to shadcn/MUI/Tailwind/NativeWind
- 8 domain enrichment skills: `/gsp-color`, `/gsp-typography`, `/gsp-logo`, `/gsp-images`, `/gsp-icons`, `/gsp-textures`, `/gsp-video`, `/gsp-3d` (#75)
- `gsp-brand-creative-director` agent — creative decisions split from technical execution
- `gsp-brand-engineer` agent — engineers operational artifacts from confirmed creative decisions
- Visual quality checklist in builder agent (background treatment, state polish, icon/image/responsive craft)
- Critique framework research (`dev/research/critique-framework-research.md`)

### Changed
- **Critique restructured** — evaluation order now strategy → brand contract → usability (Nielsen-scored) → accessibility → content → implementation → taste → synthesis, backed by NN/g/Google/Figma research (#72)
- **Guidelines pipeline rewritten** — two-pass architecture: core artifacts → visual review → component specs
- **`/gsp-brand-patterns` → `/gsp-brand-guidelines`** — skill renamed to match new scope
- **`gsp-pattern-architect` → `gsp-brand-engineer`** — agent renamed
- **`gsp-identity-designer` → `gsp-brand-creative-director`** — agent renamed
- **`/gsp:` → `/gsp-`** across all source files — matches Claude Code registration syntax
- Distilled HIG, Nielsen, anti-patterns into agent prompts (~1,400 lines saved per pipeline run) — full refs on disk for edge-case Read (#72)
- Anti-patterns now yield to STYLE.md precedence across designer, critic, and builder agents

### Removed
- 12 vestigial prompt stubs (`gsp/prompts/01-12`) — methodology consolidated into agent definitions (#77)
- `gsp/prompts/` removed from installer bundle, audit tests, and docs
- `.claude-plugin/` directory — plugin concept dropped
- `gsp-identity-designer` and `gsp-pattern-architect` agents (replaced by above)
- `gsp-brand-patterns` skill (replaced by `gsp-brand-guidelines`)

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

## [0.4.3] — 2026-03-09

### Changed
- README refresh with updated architecture docs
- Skills discoverability via SKILL.md frontmatter

## [0.4.2] — 2026-03-08

### Added
- Build-to-codebase pipeline — builder writes directly to project code
- Branded CLI with tiered ANSI colors and phase transitions
- Design workflow with critique loop, reference material, and progress tracking
- QA review loop after build phase
- ASCII art easter egg (`/gsp:pretty` and `/gsp:art`)

### Changed
- Renamed commands: `/gsp:new` → `/gsp:start`, added `project-` prefix to project phases
- Restored `AskUserQuestion` guided choices across pipeline

## [0.4.1] — 2026-03-08

### Fixed
- Executable permission on `bin/install.js`

### Added
- Installer onboarding experience with branded output
- Symlink dev mode for local Claude installs
- Multi-runtime installer (OpenCode, Gemini, Codex)
- `/gsp:update` command

## [0.4.0] — 2026-03-07

### Added
- Dual-diamond architecture (Branding + Project)
- Full branding pipeline: research → strategy → verbal → identity → system
- `/gsp:doctor` project health diagnostic
- Design trend index with 9 enriched trend files

### Changed
- Refactored from single pipeline to dual-diamond model

## [0.3.0] — 2026-03-04

### Added
- Chunked export format — agents produce 50-200 line chunks with INDEX.md
- Codebase-aware pipeline with scope and strategy routing
- Chunk format reference specification

## [0.2.0] — 2026-03-03

### Changed
- Refactored Phase 5: Spec → Implementation Spec
- Added npm package installer
- Updated agents and commands for new phase structure

## [0.1.0] — 2026-02-20

### Added
- Initial release
- 12 specialist prompts
- 6-phase design pipeline (research → system → design → spec → build → review)
- Apple HIG, WCAG 2.2, Nielsen heuristics references
- Design tokens (W3C format) reference
