#!/usr/bin/env bash
# PreToolUse blocker for Edit|Write on package.json.
# Rejects edits whose new content introduces a non-empty top-level "dependencies" key.

set -euo pipefail

INPUT=$(cat)
FILE_PATH=$(echo "$INPUT" | jq -r '.tool_input.file_path // .tool_input.filePath // empty')

# Only check root package.json
case "$FILE_PATH" in
  *package.json) ;;
  *) exit 0 ;;
esac

# Workspace package.json under node_modules — ignore
case "$FILE_PATH" in
  *node_modules*) exit 0 ;;
esac

# For Write: tool_input.content holds the full new file
# For Edit: tool_input.new_string holds the replacement string
NEW_CONTENT=$(echo "$INPUT" | jq -r '.tool_input.content // .tool_input.new_string // empty')

if [ -z "$NEW_CONTENT" ]; then
  exit 0
fi

# Look for a top-level "dependencies" key containing at least one quoted entry.
# Pattern: "dependencies": { ... "<name>": ... }
if echo "$NEW_CONTENT" | grep -qE '"dependencies"\s*:\s*\{[^}]*"[^"]+"\s*:'; then
  echo "✗ BLOCKED: package.json edit would add a production dependency." >&2
  echo "  GSP npm package must ship zero prod deps. Use devDependencies instead." >&2
  echo "  CI (Harness Audit / zero-prod-deps) enforces this on every PR." >&2
  exit 2
fi

exit 0
