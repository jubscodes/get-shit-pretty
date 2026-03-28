---
name: gsp-update
description: Update GSP to the latest version
user-invocable: true
model: sonnet
allowed-tools:
  - Read
  - Bash
  - AskUserQuestion
  - Glob
  - WebFetch
---
<objective>
Check for GSP updates, show what's new, and run the update if the user confirms.
</objective>

<rules>
- Always use `AskUserQuestion` for user-facing questions — never raw text prompts
- One decision per question — never batch multiple questions in a single message
</rules>

<process>

## Step 1 — Detect installation

Determine the runtime by checking which config directory exists. Check local first, then global:

| Runtime | Local dir | Global dir |
|---------|-----------|------------|
| Claude Code | `.claude/` | `~/.claude/` |
| OpenCode | `.opencode/` | `~/.config/opencode/` |
| Gemini | `.gemini/` | `~/.gemini/` |
| Codex | `.codex/` | `~/.codex/` |

For each runtime, look for the VERSION file in two paths (current layout first, legacy fallback):
1. `{runtime-dir}/VERSION` (v0.5.0+)
2. `{runtime-dir}/get-shit-pretty/VERSION` (legacy v0.4.x)

Record which runtime(s) and install type (local/global) were found.

If no VERSION file exists anywhere, tell the user GSP doesn't appear to be installed and suggest:
```
npx get-shit-pretty
```
Then stop.

Read the VERSION file to get the installed version.

## Step 2 — Check latest version

```bash
npm view get-shit-pretty version
```

If the command fails, tell the user the version check failed (they may be offline or npm is unavailable) and stop.

## Step 3 — Compare versions

If installed version >= latest version:
```
GSP v{installed} is already up to date.
```
Then stop.

## Step 4 — Show what's new

```
Update available: v{installed} → v{latest}
```

Fetch the changelog:
```bash
curl -sf https://raw.githubusercontent.com/jubscodes/get-shit-pretty/main/CHANGELOG.md
```

If the fetch succeeds, extract and display the section(s) between the installed and latest versions. If it fails, skip — changelog display is optional.

## Step 5 — Warn about clean install

```
The update replaces:
  • skills/gsp-*          (all GSP skills + sibling files)
  • templates/            (config, state, brief templates)
  • references/           (shared reference material)
  • agents/gsp-*          (all GSP agents)

Custom files outside these prefixes are preserved.
```

## Step 6 — Confirm with user

Use `AskUserQuestion`:
- **Update now** — "Install v{latest}"
- **Skip** — "I'll update later"

If skip → stop.

## Step 7 — Execute update

Build the installer command based on what was detected in Step 1:

**Runtime flag:** use the detected runtime (`--claude`, `--opencode`, `--gemini`, `--codex`). If multiple runtimes were found, use `--all`.

**Scope flag:** `--local` if local install was detected, `--global` if global.

```bash
npx get-shit-pretty@latest {runtime-flag} {scope-flag}
```

Examples:
- Local Claude: `npx get-shit-pretty@latest --claude --local`
- Global Claude: `npx get-shit-pretty@latest --claude --global`
- Global OpenCode: `npx get-shit-pretty@latest --opencode --global`
- Multiple runtimes: `npx get-shit-pretty@latest --all --global`

Show the output to the user.

## Step 7.5 — Run migrations

Scan `.design/branding/` for brand directories. For each brand, if `{brand}/system/` exists but `{brand}/patterns/` does not, rename via `mv` and log the migration. This handles the v0.5.0 → v0.5.1 rename.

## Step 8 — Clear update cache

Remove the update cache so the statusline reflects the new state. Clear cache from the same directory where VERSION was found in Step 1:
```bash
rm -f {version-dir}/.update-cache.json
```
Also clean the legacy path if it exists:
```bash
rm -f {runtime-dir}/get-shit-pretty/.update-cache.json
```

## Step 9 — Remind to restart

```
GSP updated to v{latest}.
Restart your session to load the new skills and agents.
```

</process>
