---
name: update
description: Update GSP to the latest version
user-invocable: true
---
<objective>
Check for GSP updates, show what's new, and run the update if the user confirms.
</objective>

<process>

## Step 1 — Detect installation

Check for a `VERSION` file to determine install type. The runtime directory varies by tool:
- Claude Code: `.claude/` (local) or `~/.claude/` (global)
- OpenCode: `.opencode/` (local) or `~/.config/opencode/` (global)
- Gemini: `.gemini/` (local) or `~/.gemini/` (global)
- Codex: `.codex/` (local) or `~/.codex/` (global)

Look for the VERSION file in both local and global locations. Check two paths per location (current layout first, legacy fallback):
1. `{runtime-dir}/VERSION` (v0.5.0+)
2. `{runtime-dir}/get-shit-pretty/VERSION` (legacy v0.4.x)

If neither exists in either location, tell the user GSP doesn't appear to be installed and suggest running:
```
npx get-shit-pretty
```
Then stop.

Read the VERSION file to get the installed version. Store which type was detected (local or global).

## Step 2 — Check latest version

Run:
```bash
npm view get-shit-pretty version
```

If the command fails, tell the user the version check failed (they may be offline or npm is unavailable) and stop.

## Step 3 — Compare versions

If installed version >= latest version, tell the user:
```
GSP v{installed} is already up to date.
```
Then stop.

## Step 4 — Show what's new

Tell the user:
```
Update available: v{installed} → v{latest}
```

Fetch the changelog to show what changed:
```bash
curl -sf https://raw.githubusercontent.com/jubscodes/get-shit-pretty/main/CHANGELOG.md
```

If the fetch succeeds, extract and display the section for the latest version. If it fails, skip — changelog display is optional.

## Step 5 — Warn about clean install

Tell the user:
```
The update replaces:
  • skills/gsp-*       (all GSP skills)
  • get-shit-pretty/*  (runtime files)
  • gsp-* agents       (all GSP agents)

Custom files outside these prefixes are preserved.
```

## Step 6 — Confirm with user

Ask the user to confirm before proceeding. If they decline, stop.

## Step 7 — Execute update

Based on the detected install type from Step 1:

- **Local install**: run `npx get-shit-pretty@latest --claude --local`
- **Global install**: run `npx get-shit-pretty@latest --claude`

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

Tell the user:
```
GSP updated to v{latest}.
Restart your Claude Code session to load the new commands and agents.
```

</process>
