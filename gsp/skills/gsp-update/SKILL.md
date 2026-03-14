---
name: update
description: Update GSP to the latest version
disable-model-invocation: true
---
<objective>
Check for GSP updates, show what's new, and run the update if the user confirms.
</objective>

<process>

## Step 1 — Detect installation

Check for a `VERSION` file to determine install type:

1. **Local install**: `.claude/get-shit-pretty/VERSION` relative to the current working directory
2. **Global install**: `~/.claude/get-shit-pretty/VERSION`

If neither exists, tell the user GSP doesn't appear to be installed and suggest running:
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
curl -sf https://raw.githubusercontent.com/jubs-cloud/get-shit-pretty/main/CHANGELOG.md
```

If the fetch succeeds, extract and display the section for the latest version. If it fails, skip — changelog display is optional.

## Step 5 — Warn about clean install

Tell the user:
```
The update replaces:
  • commands/gsp/*     (all GSP commands)
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

## Step 8 — Clear update cache

Remove the update cache so the statusline reflects the new state:
```bash
rm -f ~/.claude/get-shit-pretty/.update-cache.json
```

Also check for a local cache:
```bash
rm -f .claude/get-shit-pretty/.update-cache.json
```

## Step 9 — Remind to restart

Tell the user:
```
GSP updated to v{latest}.
Restart your Claude Code session to load the new commands and agents.
```

</process>
