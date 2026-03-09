#!/bin/bash
set -e

# NOTE: This is the legacy bash installer for Claude Code only.
# The recommended method is: npx get-shit-pretty
# The npm installer supports Claude Code, OpenCode, Gemini, and Codex.

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
CLAUDE_DIR="$HOME/.claude"

echo "🎨 Installing GSP — Get Shit Pretty (legacy bash installer)"
echo "  Tip: Use 'npx get-shit-pretty' for multi-runtime support"
echo ""

# Create target directories
mkdir -p "$CLAUDE_DIR/commands/gsp"
mkdir -p "$CLAUDE_DIR/agents"

# Copy commands
echo "  Installing commands → $CLAUDE_DIR/commands/gsp/"
cp "$SCRIPT_DIR/commands/gsp/"*.md "$CLAUDE_DIR/commands/gsp/"

# Copy agents
echo "  Installing agents → $CLAUDE_DIR/agents/"
cp "$SCRIPT_DIR/agents/"*.md "$CLAUDE_DIR/agents/"

echo ""
echo "  GSP installed successfully!"
echo ""
echo "  Try: /gsp:help"
echo "  Start: /gsp:start"
