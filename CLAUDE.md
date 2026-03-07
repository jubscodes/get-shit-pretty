# GSP — Get Shit Pretty

Design engineering system for Claude Code, OpenCode, Gemini, and Codex.

## Architecture

Dual-diamond: **Branding** (brand-discover → brand-strategy → brand-verbal → brand-identity → brand-system) + **Project** (brief → research → design → critique → build → review). Optional: launch.

Files live in `agents/`, `commands/gsp/`, `prompts/`, `templates/`, `references/`. The installer copies (or symlinks) these into runtime config dirs (`.claude/`, `.opencode/`, etc.).

## Local development

`.claude/agents/`, `.claude/commands/`, `.claude/get-shit-pretty/` are **symlinks** to the source dirs. Edit source files directly — changes reflect immediately. These paths are gitignored.

To reinstall after adding/removing files: `node bin/install.js --claude --local`

## Editing rules

- Agent source of truth: `agents/gsp-{name}.md`
- Command source of truth: `commands/gsp/{name}.md`
- Never edit inside `.claude/` directly — it's symlinked to source
- Agent output paths must be dynamic: `"path provided by the command that spawned you"` (no hardcoded `.design/` paths)
- Commands resolve paths via `{PROJECT_PATH}` and `{BRAND_PATH}` variables

## Key files

- `bin/install.js` — multi-runtime installer (symlinks for local Claude, copies for global/other runtimes)
- `templates/projects/config.json` — project config template (0.4.0)
- `templates/branding/config.json` — brand config template (0.4.0)
- `templates/exports-index.md` — chunked exports index with BEGIN/END markers per phase
- `references/chunk-format.md` — standard chunk format spec

## Testing changes

Run `/jubs:gsp-audit` to verify pipeline consistency (command↔agent contracts, config coverage, template coherence).
