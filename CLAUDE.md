# GSP — Get Shit Pretty

Design engineering system for Claude Code, OpenCode, Gemini, and Codex.

## Architecture

Dual-diamond: **Branding** (brand-discover → brand-strategy → brand-identity → brand-system) + **Project** (brief → research → design → critique → build → review). Optional: launch. Verbal identity is merged into brand-strategy.

Files live in `agents/`, `skills/`, `prompts/`, `templates/`, `references/`. The installer copies (or symlinks) these into runtime config dirs (`.claude/`, `.opencode/`, etc.).

## Plugin structure

GSP is a Claude Code plugin. The manifest is at `.claude-plugin/plugin.json` with name `gsp`.

| Directory | Purpose |
|-----------|---------|
| `.claude-plugin/` | Plugin manifest (`plugin.json`) |
| `skills/` | 21 skills — each is a `<name>/SKILL.md` directory (primary) |
| `commands/gsp/` | Legacy commands (kept for backward compatibility) |
| `agents/` | 15 subagents (`gsp-{name}.md`) |
| `hooks/` | Plugin-level hooks (`hooks.json`) |
| `.mcp.json` | Bundled MCP servers (GitHub, Figma) |
| `templates/` | Project/brand config, state, brief, roadmap templates |
| `references/` | Shared reference material (trends, HIG, chunk format) |
| `prompts/` | Agent system prompts |
| `scripts/` | Hook scripts and utilities |

Skills take precedence over commands when both exist.

## Local development

`.claude/agents/`, `.claude/commands/`, `.claude/get-shit-pretty/` are **symlinks** to the source dirs. Edit source files directly — changes reflect immediately. These paths are gitignored.

To test as a plugin: `claude --plugin-dir .`
To reinstall after adding/removing files: `node bin/install.js --claude --local`

## Editing rules

- Agent source of truth: `agents/gsp-{name}.md`
- Skill source of truth: `skills/{name}/SKILL.md`
- Never edit inside `.claude/` directly — it's symlinked to source
- Agent output paths must be dynamic: `"path provided by the command that spawned you"` (no hardcoded `.design/` paths)
- Skills resolve paths via `${CLAUDE_SKILL_DIR}/../../` for shared files
- Commands resolve paths via `{PROJECT_PATH}` and `{BRAND_PATH}` variables

## Key files

- `.claude-plugin/plugin.json` — plugin manifest (name: gsp, version synced with package.json)
- `bin/install.js` — multi-runtime installer (symlinks for local Claude, copies for global/other runtimes)
- `templates/projects/config.json` — project config template (0.4.0)
- `templates/branding/config.json` — brand config template (0.5.0)
- `templates/exports-index.md` — chunked exports index with BEGIN/END markers per phase
- `references/chunk-format.md` — standard chunk format spec

## Testing changes

Run `/jubs:gsp-audit` to verify pipeline consistency (command↔agent contracts, config coverage, template coherence).
