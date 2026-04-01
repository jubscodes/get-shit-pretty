# GSP — Get Shit Pretty

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
| `gsp/skills/` | 34 skills — each is a `gsp-<name>/SKILL.md` directory with optional `domains/` and `references/` siblings |
| `gsp/agents/` | 11 subagents (`gsp-{name}.md`) |
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
| Claude Code | `.claude/skills/` | `.claude/agents/` (11) | `.claude/{prompts,templates}/` |
| OpenCode | `.opencode/skills/` | `.opencode/agents/` (11) | `.opencode/{prompts,templates}/` |
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

### Agent input inlining rule

**Skills must inline all content when spawning agents.** The skill reads input files during validation/context steps — pass that content directly in the agent prompt. Never pass file paths and expect the agent to re-read them. Each agent Read turn costs 18-35s depending on model.

Pattern: `- **Content of** {file} (loaded in Step N)` in the spawn instruction.

Exceptions — agents that legitimately need to read from disk:
- `gsp-project-builder` (screen agents) — reads live codebase foundations
- `gsp-project-reviewer` — Grep/Glob on actual source files
- `gsp-accessibility-auditor` (code mode) — Grep/Glob on source files

### Claude Code context cost model

Understanding what loads when is critical for keeping sessions lean. These costs apply to every conversation, not just GSP workflows.

**Session start (always loaded, every conversation):**
- `.claude/agents/*.md` — agent stubs (frontmatter + one-line body, ~12 lines each, ~130 lines total)
- `.claude/references/*.md` — full file content of every reference file
- Skill descriptions — the `description:` line from each SKILL.md (negligible)
- `CLAUDE.md` files — project and user-level

**Skill invocation (loaded on demand):**
- Full SKILL.md body — only when the skill is triggered
- `@` references in `<execution_context>` — resolved and inlined when the skill runs
- Sibling files in skill directories — **inert** until explicitly Read by the skill

**Agent spawn (loaded on demand):**
- Agent stub is already in context from session start (just tool permissions + name)
- Methodology loaded by the spawning skill from `methodology/gsp-{agent}.md` sibling file
- Agent gets its own context window with the spawning skill's prompt + inlined methodology

**Implications for GSP:**
- **`gsp/references/` is empty — all references live in skill directories.** Domain knowledge is colocated with the expertise skill that owns it. Pipeline skills read from expertise skills via cross-skill paths. Nothing installs to `.claude/references/`.
- **Agent stubs are lean, methodology lives in skills.** Agent `.md` files contain only frontmatter (tools, model, hooks) + a one-line body. Full methodology lives in `gsp/skills/{skill}/methodology/gsp-{agent}.md` and is read by the skill at spawn time. This keeps session-start cost minimal (~130 lines for 11 agents vs ~1,500 for full definitions).
- **Skill sibling files are free until used.** A skill directory with 74 `.yml` presets costs zero at session start. Use this for reference material, examples, methodology, and templates that the skill reads on demand.
- **Cross-skill references use relative paths:** `${CLAUDE_SKILL_DIR}/../gsp-other-skill/ref.md` — this reads the file on demand with zero session-start cost.

### Reference colocation rule

Reference files live inside the skill directory that is their primary consumer, not in a shared `references/` directory. This ensures:
1. Zero session-start context cost (sibling files are inert)
2. Skills are self-contained and portable (standalone capability)
3. References load only when the consuming skill runs

**Single-owner references** go directly into the primary skill's directory.

**Shared references** (consumed by 2-4 skills) go into the primary consumer's directory. Other skills read them via `${CLAUDE_SKILL_DIR}/../gsp-primary-skill/ref.md`.

**Ubiquitous references** (consumed by 5+ skills, e.g. `chunk-format.md`, `phase-transitions.md`) are duplicated into each consuming skill's directory as sibling files. This costs disk space but ensures every skill is self-contained and works on all runtimes (no loose files at the skills root).

### Context optimization rules

These rules minimize token waste across the pipeline. Enforced by audit tests C12, I19.

**Model selection is the user's choice.** Skills do not declare `model:` or `effort:` in frontmatter — the user controls which model runs each phase. Pipeline creative/technical skills include a hint in their `description:` field (e.g., "benefits from capable models") as passive guidance. The installer still strips any `model:`/`effort:` fields for non-Claude runtimes (backwards compat for forks).

**Context fork for pure dispatchers:** Pipeline skills that have zero interactive steps (no `AskUserQuestion` before agent spawn) must use `context: fork` in frontmatter. This isolates execution_context references from the main conversation window. Currently forked: `project-design`, `project-critique`, `project-review`. Never fork skills with interactive steps — test C12 enforces this.

**Double-dispatch is intentional:** Forked skills use the Agent tool inside the fork to spawn executors. Do NOT collapse this with the `agent:` frontmatter field. The fork isolates the orchestrator; the Agent tool gives the executor a clean start. The orchestrator owns validation, routing, and state updates — the agent owns creative/technical execution.

**Execution context is for orchestrator-consumed content only.** Reference files that the orchestrator only passes through to agents must NOT be in `<execution_context>`. Instead, add a "Load references" step before the spawn that reads them from disk. This keeps orchestrator Steps 0-2 (validation, prerequisites) lean. Only keep templates and references the orchestrator itself consumes in execution_context.

**Templates loaded at write time.** Skills that write artifacts from templates (e.g., `gsp-start` writing BRIEF.md, STATE.md) must read templates at the point of writing, not in execution_context. Pattern: `Read templates from ${CLAUDE_SKILL_DIR}/../../templates/{path}/ and write artifacts`.

**SubagentStop hooks for all chunk-producing agents.** Every agent that writes deliverable chunks must have a SubagentStop hook in `gsp/hooks/hooks.json` that verifies expected outputs exist. Covered: `gsp-project-designer`, `gsp-project-critic`, `gsp-brand-creative-director`, `gsp-brand-engineer`, `gsp-project-builder`, `gsp-project-reviewer`.

**Filesystem is the integration layer.** Phases consume prior-phase output from disk (`.design/`), never from conversation context. Forked phases write STATE.md and artifact files to disk — these persist across fork boundaries. No phase should rely on conversation history for prior-phase artifacts.

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

Published as `get-shit-pretty` on npm. Before publishing:

1. Ensure VERSION and package.json versions agree
2. Run `bash dev/scripts/audit-tests.sh` — all tests must pass
3. Update CHANGELOG.md with the new version section
4. `npm publish`

The `files` field in package.json controls what's included: `.mcp.json`, `bin`, `scripts`, `gsp`.

### Dependencies rule

The npm package must have **zero production dependencies**. The installer (`bin/install.js`) and scripts use only Node.js builtins. All deps (Next.js, React, shadcn, MDX, etc.) are for the local website (`src/`) and must stay in `devDependencies`. Never add a package to `dependencies` — it would be pulled in by every `npx get-shit-pretty` user for no reason.

## Dev tools

Internal development tools live in `dev/` (versioned in repo, never installed to runtimes):

| Path | Purpose |
|------|---------|
| `dev/skills/gspdev-audit/` | Pipeline integrity checker — contracts, installer, runtime compat, versions, templates |
| `dev/skills/gspdev-runtime-compat/` | Fetch live runtime docs and flag drift against GSP installer |
| `dev/scripts/audit-tests.sh` | Automated test suite (65 tests across 8 suites) |
| `dev/scripts/token-budget.sh` | Static token budget analyzer — scores skills by estimated API weight |
| `dev/scripts/token-proxy-start.sh` | Live token proxy — mitmproxy addon for measuring real API usage |

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
