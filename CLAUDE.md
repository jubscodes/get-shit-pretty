# GSP — Get Shit Pretty

Design engineering system for Claude Code, OpenCode, Gemini, and Codex.

## This repository

This repo is **both**:

- **Source and npm package** — where the GSP agentic framework is built, versioned, and published via `npm publish`. The `package.json` `files` field controls what ships: `.claude-plugin`, `.mcp.json`, `bin`, `scripts`, `gsp`.
- **GSP consumer** — GSP is installed here too (e.g. `.claude/` symlinks, plugin dir). You can run GSP workflows in this workspace while developing the framework.

Edit source under `gsp/`; the installer keeps runtimes in sync. Never edit inside `.claude/` (or other runtime dirs) directly — they point at or are populated from source.

## Architecture

Dual-diamond: **Branding** (discover → strategy → identity → system) + **Project** (brief → research → design → critique → build → review). Optional: launch. Verbal identity is merged into brand-strategy (4 phases, not 5).

## Plugin and pack structure

GSP is a Claude Code plugin. The manifest is at `.claude-plugin/plugin.json` with name `gsp`.

| Directory | Contents |
|-----------|----------|
| `.claude-plugin/` | Plugin manifest (`plugin.json`) |
| `gsp/skills/` | 21 skills — each is a `<name>/SKILL.md` directory (single source for all runtimes) |
| `gsp/agents/` | 15 subagents (`gsp-{name}.md`) |
| `gsp/hooks/` | Plugin-level hooks (`hooks.json`) |
| `gsp/prompts/` | 12 agent system prompts |
| `gsp/templates/` | Project/brand config, state, brief, roadmap templates |
| `gsp/references/` | Shared reference material (trends, HIG, chunk format) |
| `.mcp.json` | Bundled MCP servers (GitHub, Figma) |
| `scripts/` | Hook scripts and utilities (at repo root) |

## Multi-runtime installer

`bin/install.js` converts Claude Code's native format into each runtime's expected format:

| Runtime | Skills location | Agents | Bundle location |
|---------|-----------------|--------|-----------------|
| Claude Code | `.claude/skills/` | `.claude/agents/` (15) | `.claude/{prompts,templates,references}/` |
| OpenCode | `.opencode/skills/` | `.opencode/agents/` (15) | `.opencode/{prompts,templates,references}/` |
| Gemini CLI | `.gemini/skills/` | `.gemini/agents/` (15, experimental) | `.gemini/{prompts,templates,references}/` |
| Codex CLI | **`.agents/skills/`** (not `.codex/`) | **None** (not supported) | `.codex/{prompts,templates,references}/` |

Skills are the single source for all runtimes — commands have been removed.

Key points:
- Codex has a **split layout**: config/bundles at `~/.codex/`, skills at `~/.agents/skills/`
- Codex does **not** install agents — agent `.md` files are skipped
- Tool names are mapped per runtime (e.g. `Bash` → `shell` for Codex, `run_shell_command` for Gemini)
- Body-level replacements convert paths, invocation syntax (`/gsp:` → `/gsp-` or `$gsp-`), and variables

## Local development

`.claude/agents/`, `.claude/skills/gsp-*`, `.claude/{prompts,templates,references}` are **symlinks** to `gsp/` source dirs. Edit source under `gsp/` directly — changes reflect immediately without reinstalling. These paths are gitignored.

To test as a plugin: `claude --plugin-dir .`
To reinstall after adding/removing files: `node bin/install.js --claude --local`

## Editing rules

- Agent source of truth: `gsp/agents/gsp-{name}.md`
- Skill source of truth: `gsp/skills/{name}/SKILL.md`
- Never edit inside `.claude/` directly — it's symlinked to source
- Agent output paths must be dynamic: `"path provided by the skill that spawned you"` (no hardcoded `.design/` paths)
- Skills resolve paths via `${CLAUDE_SKILL_DIR}/../../` for shared files (prompts, templates, references live directly in the runtime root, e.g. `.claude/prompts/`)

## Key files

- `.claude-plugin/plugin.json` — plugin manifest (name: gsp, version synced with package.json and VERSION)
- `bin/install.js` — multi-runtime installer (symlinks for local Claude, copies for global/other runtimes)
- `package.json` — npm package config; `files` field controls what ships
- `VERSION` — single version string, must match package.json and plugin.json
- `CHANGELOG.md` — release notes, must have entry for current version
- `gsp/templates/projects/config.json` — project config template
- `gsp/templates/branding/config.json` — brand config template
- `gsp/templates/exports-index.md` — chunked exports index with BEGIN/END markers per phase
- `gsp/references/chunk-format.md` — standard chunk format spec

## npm publication

Published as `get-shit-pretty` on npm. Before publishing:

1. Ensure VERSION, package.json, and plugin.json versions agree
2. Run `bash dev/scripts/audit-tests.sh` — all tests must pass
3. Update CHANGELOG.md with the new version section
4. `npm publish`

The `files` field in package.json controls what's included: `.claude-plugin`, `.mcp.json`, `bin`, `scripts`, `gsp`.

## Dev tools

Internal development tools live in `dev/` (versioned in repo, never installed to runtimes):

| Path | Purpose |
|------|---------|
| `dev/skills/gsp-audit/` | Pipeline integrity checker — contracts, installer, runtime compat, versions, templates |
| `dev/skills/runtime-compat/` | Fetch live runtime docs and flag drift against GSP installer |
| `dev/scripts/audit-tests.sh` | Automated test suite (36 tests across 5 suites) |

### Running tests

```bash
bash dev/scripts/audit-tests.sh          # all suites
bash dev/scripts/audit-tests.sh versions  # version sync only
bash dev/scripts/audit-tests.sh contracts # skill↔agent contracts
bash dev/scripts/audit-tests.sh installer # installer correctness
bash dev/scripts/audit-tests.sh runtime   # runtime compatibility
bash dev/scripts/audit-tests.sh templates # template coherence
```

### Using dev skills

To make dev skills available in your session, symlink into your personal skills:
```bash
ln -s "$(pwd)/dev/skills/gsp-audit" ~/.claude/skills/gsp-audit
ln -s "$(pwd)/dev/skills/runtime-compat" ~/.claude/skills/runtime-compat
```

Then invoke `/gsp-audit` or `/runtime-compat drift`.
