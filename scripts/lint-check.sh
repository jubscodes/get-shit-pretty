#!/bin/bash
# PostToolUse hook for gsp-project-builder: lint files after Edit/Write
# Runs the project's linter on modified files if available.
# Non-blocking — exit 0 even if linter isn't found.

INPUT=$(cat)
FILE_PATH=$(echo "$INPUT" | jq -r '.tool_input.file_path // .tool_input.filePath // empty')

if [ -z "$FILE_PATH" ]; then
  exit 0
fi

# Only lint frontend files
case "$FILE_PATH" in
  *.ts|*.tsx|*.js|*.jsx|*.css|*.scss)
    ;;
  *)
    exit 0
    ;;
esac

# Try project-local linter, fall back gracefully.
# Surface eslint diagnostics on stderr — non-blocking is fine, silent is not.
if [ -f "node_modules/.bin/eslint" ]; then
  node_modules/.bin/eslint --fix --quiet "$FILE_PATH" \
    || echo "lint-check: eslint reported issues on $FILE_PATH (non-blocking)" >&2
elif command -v npx &>/dev/null && [ -f "package.json" ] && grep -q "eslint" package.json 2>/dev/null; then
  npx --no-install eslint --fix --quiet "$FILE_PATH" \
    || echo "lint-check: eslint reported issues on $FILE_PATH (non-blocking)" >&2
fi

# Never block the agent
exit 0
