#!/bin/bash
set -e

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
CLAUDE_DIR="$HOME/.claude"

echo "🎨 Installing GSP — Get Shit Pretty"
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
echo "  Start: /gsp:new-project"
