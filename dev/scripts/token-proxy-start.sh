#!/usr/bin/env bash
# GSP Token Proxy Launcher
# Starts mitmproxy with the token logging addon.
# Then run Claude Code with: HTTPS_PROXY=http://localhost:8080 claude
#
# Prerequisites: pip install mitmproxy

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
ADDON="$SCRIPT_DIR/token-proxy.py"
PORT="${1:-8080}"

if ! command -v mitmproxy &>/dev/null; then
  echo "  mitmproxy not found. Install with: pip install mitmproxy"
  exit 1
fi

if ! python3 -c "import mitmproxy" &>/dev/null; then
  echo "  mitmproxy Python module not found. Install with: pip install mitmproxy"
  exit 1
fi

echo ""
echo "  ── GSP Token Proxy ──────────────────────────"
echo "  proxy port     :$PORT"
echo "  addon          $ADDON"
echo ""
echo "  In another terminal, run:"
echo "    HTTPS_PROXY=http://localhost:$PORT claude"
echo ""
echo "  Press Ctrl+C to stop and see the summary report."
echo ""

mitmproxy --listen-port "$PORT" -s "$ADDON" --set stream_large_bodies=0 --quiet
