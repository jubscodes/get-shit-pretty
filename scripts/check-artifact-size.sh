#!/usr/bin/env bash
# SubagentStop hook — verify a project-pipeline agent's output respects the project's
# declared output mode (chat | compact | full). See gsp/policies/output-modes.md.
#
# Usage: check-artifact-size.sh <agent-name>
# Exit 0 if within budget (or skip cases); exit 1 with stdout message if over budget.

set -euo pipefail

AGENT="${1:-}"
if [ -z "$AGENT" ]; then exit 0; fi

# Locate the active project (first one under .design/projects/ with a STATE.md).
PROJECT_PATH=""
if [ -d ".design/projects" ]; then
  for dir in .design/projects/*/; do
    if [ -f "${dir}STATE.md" ]; then
      PROJECT_PATH="$dir"
      break
    fi
  done
fi
if [ -z "$PROJECT_PATH" ]; then exit 0; fi

CONFIG="${PROJECT_PATH}config.json"
if [ ! -f "$CONFIG" ]; then exit 0; fi

# Extract project_size. Cheap grep/sed — avoids a jq dependency since the npm package
# ships zero prod deps.
MODE=$(grep -o '"project_size"[[:space:]]*:[[:space:]]*"[^"]*"' "$CONFIG" \
  | sed 's/.*"\([^"]*\)"$/\1/' | head -n 1)
if [ -z "$MODE" ]; then MODE="compact"; fi

# Agent → phase directory mapping.
case "$AGENT" in
  gsp-project-researcher)        PHASE_DIR="research" ;;
  gsp-project-designer)          PHASE_DIR="design" ;;
  gsp-project-critic)            PHASE_DIR="critique" ;;
  gsp-accessibility-auditor)     PHASE_DIR="critique" ;;
  gsp-project-builder)           PHASE_DIR="build" ;;
  gsp-project-reviewer)          PHASE_DIR="review" ;;
  *) exit 0 ;;
esac

PHASE_PATH="${PROJECT_PATH}${PHASE_DIR}"
if [ ! -d "$PHASE_PATH" ]; then exit 0; fi

# Per-mode budget. See gsp/policies/output-modes.md for the canonical table.
case "$MODE" in
  chat)
    MAX_FILES=1
    MAX_LINES=50
    ;;
  compact)
    MAX_FILES=3
    MAX_LINES=500
    ;;
  full)
    # Generous ceiling for full mode — only catches pathological output.
    MAX_FILES=25
    MAX_LINES=5000
    ;;
  *)
    exit 0
    ;;
esac

FILE_COUNT=$(find "$PHASE_PATH" -maxdepth 2 -name "*.md" -type f 2>/dev/null | wc -l | tr -d ' ')
TOTAL_LINES=$(find "$PHASE_PATH" -maxdepth 2 -name "*.md" -type f -exec cat {} \; 2>/dev/null | wc -l | tr -d ' ')

OVER_FILES=0
OVER_LINES=0
[ "$FILE_COUNT" -gt "$MAX_FILES" ] && OVER_FILES=1
[ "$TOTAL_LINES" -gt "$MAX_LINES" ] && OVER_LINES=1

if [ "$OVER_FILES" -eq 0 ] && [ "$OVER_LINES" -eq 0 ]; then
  exit 0
fi

cat <<EOF
Output mode violation — agent "${AGENT}" exceeded the budget for project_size="${MODE}".

Phase directory: ${PHASE_PATH}
Files emitted:   ${FILE_COUNT} (budget: ${MAX_FILES})
Total lines:     ${TOTAL_LINES} (budget: ${MAX_LINES})

Per gsp/policies/output-modes.md, "${MODE}" mode requires consolidated output. Ask the agent to:
1. Consolidate the per-chunk files into a single ${PHASE_DIR}/PHASE.md with H2 sections matching the chunk vocabulary
2. Delete the redundant chunk files
3. Update ${PHASE_DIR}/INDEX.md to reflect the consolidated structure

Skip-if-not-present: omit sections that have no real content for this project. Do not pad.
EOF

exit 1
