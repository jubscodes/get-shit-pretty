# GSP — Get Shit Pretty

## Must-always / Must-never

- **Always** edit source under `gsp/` — never inside `.claude/`, `.opencode/`, `.gemini/`, `.agents/`, `.codex/` (symlinks or installer-managed).
- **Always** put new package dependencies in `devDependencies` — the npm package ships zero prod deps.
- **Always** ship changes via PR — `main` is protected, no direct push. Squash-merge via `gh pr merge --squash`.
- **Never** edit inside `.design/` from a skill — it's user/agent output only.
- **Never** add `model:` or `effort:` to skill frontmatter — model selection is the user's choice.
- **Never** hardcode output paths in agents — use `"path provided by the skill that spawned you"`.

Design engineering system for Claude Code, OpenCode, Gemini, and Codex.

## Git workflow

`main` is protected — all changes require a PR (no direct push). Use feature/release branches and squash merge via `gh pr merge --squash`.

## This repository

This repo is **both**:

- **Source and npm package** — where the GSP agentic framework is built, versioned, and published via `npm publish`. The `package.json` `files` field controls what ships: `.mcp.json`, `bin`, `scripts`, `gsp`.
- **GSP consumer** — GSP is installed here too (e.g. `.claude/` symlinks). You can run GSP workflows in this workspace while developing the framework.

Edit source under `gsp/`; the installer keeps runtimes in sync. Never edit inside `.claude/` (or other runtime dirs) directly — they point at or are populated from source.

## Architecture

Dual-diamond: **Branding** (discover → strategy → identity → patterns) + **Project** (brief → research → design → critique → build → review). Verbal identity is merged into brand-strategy (4 phases, not 5).

### Two skill layers

**Expertise skills** (knowledge owners): `gsp-color`, `gsp-typography`, `gsp-visuals`, `gsp-accessibility`, `gsp-style`

Own domain knowledge as sibling files (`domains/`, `references/`). Serve the full pipeline, not just one phase. Two consumption patterns:
- **Read** (passive) — pipeline skill or agent reads expertise skill's sibling files for domain context
- **Invoke** (active) — pipeline skill calls the expertise skill to run its logic (e.g. `--enrich`, `--validate`)

Rule: **never duplicate domain knowledge in pipeline skills.** If an expertise skill owns it, pipeline skills read or invoke.

**Pipeline skills** (orchestrators): `brand-research`, `brand-strategy`, `brand-identity`, `brand-guidelines`, `project-brief`, `project-research`, `project-design`, `project-critique`, `project-build`, `project-review`

Own workflow: state management, phase gates, agent spawning, user interaction. Consume domain knowledge from expertise skills. Produce artifacts to `.design/`.

### Skill architecture

Skills are lean routers. SKILL.md handles mode/flag parsing, context resolution, and delegation. Domain knowledge, questioning frameworks, output templates, and technical specs live in sibling files that the skill reads on demand.

Expertise skills use a `domains/` + `references/` structure:
```
gsp-color/
├── SKILL.md              ← thin router (~60-80 lines)
├── domains/
│   ├── palette.md        ← OKLCH generation spec
│   └── system.md         ← full color system direction
└── references/
    └── color-composition.md
```

The filesystem is the integration layer — skills produce artifacts to `.design/`; agents consume them. No skill-to-skill invocation except explicit `--enrich`/`--validate` calls.

## Pack structure

| Directory | Contents |
|-----------|----------|
| `gsp/skills/` | 35 skills — each is a `gsp-<name>/SKILL.md` directory with optional `domains/` and `references/` siblings |
| `gsp/agents/` | 12 subagents (`gsp-{name}.md`) |
| `gsp/hooks/` | Hooks (`hooks.json`) |
| `gsp/prompts/` | Reserved (agent methodology lives in skill `methodology/` directories) |
| `gsp/templates/` | Project/brand config, state, brief, roadmap templates |
| `.mcp.json` | Bundled MCP servers (GitHub, Figma) |
| `scripts/` | Hook scripts and utilities (at repo root) |

### Skill naming

Source skill directories under `gsp/skills/` use the `gsp-` prefix: `gsp-pretty/`, `gsp-brand-strategy/`, `gsp-style/`, etc. The one exception is `get-shit-pretty/` (entry point skill, `user-invocable: false`).

The `gsp-` prefix is part of the source directory name. The installer copies as-is — no renaming needed.

| Layer | Example |
|-------|---------|
| Source (`gsp/skills/`) | `gsp-style/SKILL.md` |
| Claude Code (`.claude/skills/`) | `gsp-style/` → `/gsp-style` |
| OpenCode (`.opencode/skills/`) | `gsp-style/` → `/gsp-style` |
| Gemini (`.gemini/skills/`) | `gsp-style/` → `/gsp-style` |
| Codex (`.agents/skills/`) | `gsp-style/` → `$gsp-style` |
| Vercel skills.sh | `gsp-style/` → `/gsp-style` |

Cross-references between skills use `gsp-` prefixed paths: `${CLAUDE_SKILL_DIR}/../gsp-style/styles/INDEX.yml`.

## Multi-runtime installer

`bin/install.js` converts Claude Code's native format into each runtime's expected format:

| Runtime | Skills location | Agents | Bundle location |
|---------|-----------------|--------|-----------------|
| Claude Code | `.claude/skills/` | `.claude/agents/` (12) | `.claude/{prompts,templates}/` |
| OpenCode | `.opencode/skills/` | `.opencode/agents/` (12) | `.opencode/{prompts,templates}/` |
| Gemini CLI | `.gemini/skills/` | `.gemini/agents/` (11, experimental) | `.gemini/{prompts,templates}/` |
| Codex CLI | **`.agents/skills/`** (not `.codex/`) | **None** (not supported) | `.codex/{prompts,templates}/` |

Skills are the single source for all runtimes — commands have been removed.

Key points:
- Codex has a **split layout**: config/bundles at `~/.codex/`, skills at `~/.agents/skills/`
- Codex does **not** install agents — agent `.md` files are skipped
- Tool names are mapped per runtime (e.g. `Bash` → `shell` for Codex, `run_shell_command` for Gemini)
- Body-level replacements convert paths, invocation syntax (`/gsp-` → `$gsp-` for Codex), and variables

## Local development

`.claude/agents/`, `.claude/skills/*` (GSP skills), `.claude/{prompts,templates}` are **symlinks** to `gsp/` source dirs. Edit source under `gsp/` directly — changes reflect immediately without reinstalling. These paths are gitignored. Domain knowledge lives as sibling files inside skill directories — no separate `references/` runtime directory.

To reinstall after adding/removing files: `node bin/install.js --claude --local`

## Editing rules

- Agent source of truth: `gsp/agents/gsp-{name}.md`
- Skill source of truth: `gsp/skills/gsp-{name}/SKILL.md`
- Never edit inside `.claude/` directly — it's symlinked to source
- Agent output paths must be dynamic: `"path provided by the skill that spawned you"` (no hardcoded `.design/` paths)
- Skills resolve shared files via `${CLAUDE_SKILL_DIR}/../../` for templates, and `${CLAUDE_SKILL_DIR}/../gsp-{skill}/` for colocated references (see reference colocation rule)

## Key files

- `bin/install.js` — multi-runtime installer (symlinks for local Claude, copies for global/other runtimes)
- `package.json` — npm package config; `files` field controls what ships
- `VERSION` — single version string, must match package.json
- `CHANGELOG.md` — release notes, must have entry for current version
- `gsp/templates/projects/config.json` — project config template
- `gsp/templates/branding/config.json` — brand config template
- `gsp/templates/exports-index.md` — chunked exports index with BEGIN/END markers per phase
- `chunk-format.md` — standard chunk format spec (ubiquitous reference, duplicated into each consuming skill)

## npm publication

Published as `get-shit-pretty` on npm. Use `/gspdev-publish` — it runs the audit suite, bumps versions, updates CHANGELOG, and prompts `npm publish`. Manual steps in `dev/skills/gspdev-publish/SKILL.md`.

### Dependencies rule

The npm package must have **zero production dependencies**. The installer (`bin/install.js`) and scripts use only Node.js builtins. All deps stay in `devDependencies`. Never add to `dependencies` — every `pnpm dlx get-shit-pretty` user would pull them in for no reason.

## Dev tools

Internal development tools live in `dev/` (versioned in repo, never installed to runtimes):

| Path | Purpose |
|------|---------|
| `dev/skills/gspdev-audit/` | Pipeline integrity checker — contracts, installer, runtime compat, versions, templates |
| `dev/skills/gspdev-runtime-compat/` | Fetch live runtime docs and flag drift against GSP installer |
| `dev/scripts/audit-tests.sh` | Automated test suite (65 tests across 8 suites) |
| `dev/scripts/token-budget.sh` | Static token budget analyzer — scores skills by estimated API weight |
| `dev/scripts/token-proxy-start.sh` | Live token proxy — mitmproxy addon for measuring real API usage |
| `dev/scripts/benchmark.sh` | Token budget benchmarking — capture snapshots, compare against release baseline |
| `dev/skills/gspdev-benchmark/` | Interactive benchmark skill — wraps benchmark.sh with analysis and suggestions |
| `dev/skills/gspdev-eval-changes/` | Quality eval for skill/agent/methodology changes — parallel evaluators against parent SKILL.md, 6-dimension rubric. Run before merging non-trivial trims/refactors |
| `dev/benchmarks/` | JSON snapshots — one per release, plus working comparisons |

### Running tests

```bash
bash dev/scripts/audit-tests.sh              # all suites
bash dev/scripts/audit-tests.sh versions     # version sync only
bash dev/scripts/audit-tests.sh contracts    # skill↔agent contracts
bash dev/scripts/audit-tests.sh installer    # installer correctness
bash dev/scripts/audit-tests.sh runtime      # runtime compatibility
bash dev/scripts/audit-tests.sh templates    # template coherence
bash dev/scripts/audit-tests.sh tokenbudget  # token budget analysis
```

### Using dev skills

Dev skills use the `gspdev-` prefix so the installer's cleanup doesn't remove them. Run `node bin/install.js --claude --local` — it symlinks dev skills alongside GSP skills automatically.

Then invoke `/gspdev-audit` or `/gspdev-runtime-compat drift`.

## Inspiration links

When the user shares X/Twitter posts or other links as design inspiration, append them as a comment to **issue #70** (`inspo: collected X posts for design reference`).
