#!/usr/bin/env bash
# PreToolUse blocker for Edit|Write tools.
# Rejects edits to symlinked runtime dirs — source of truth is gsp/.

set -euo pipefail

INPUT=$(cat)
FILE_PATH=$(echo "$INPUT" | jq -r '.tool_input.file_path // .tool_input.filePath // empty')

if [ -z "$FILE_PATH" ]; then
  exit 0
fi

# Match runtime dirs anywhere in the path. Source under gsp/ is allowed.
case "$FILE_PATH" in
  *.claude/skills/*|*.claude/agents/*|*.claude/prompts/*|*.claude/templates/*|\
  *.opencode/skills/*|*.opencode/agents/*|*.opencode/prompts/*|*.opencode/templates/*|\
  *.gemini/skills/*|*.gemini/agents/*|*.gemini/prompts/*|*.gemini/templates/*|\
  *.agents/skills/*|*.codex/prompts/*|*.codex/templates/*)
    echo "✗ BLOCKED: runtime dirs (.claude/, .opencode/, .gemini/, .agents/, .codex/) are symlinks/installer-managed." >&2
    echo "  Edit the source under gsp/ instead. Path was: $FILE_PATH" >&2
    exit 2
    ;;
esac

exit 0
