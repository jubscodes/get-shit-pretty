#!/usr/bin/env bash
# polish-safety-wrap.sh — atomic safety net for /gsp-polish safe-auto fixes.
#
# Usage:
#   polish-safety-wrap.sh begin <file-path>   # backup the file before edits
#   polish-safety-wrap.sh check               # run tsc --noEmit on the project
#   polish-safety-wrap.sh commit              # accept the edits (drop backup)
#   polish-safety-wrap.sh rollback            # restore the backup
#
# Each call manages a single per-file backup at <file>.polish-backup, tracked
# via .polish-stash-ref. Run begin → apply Edits → check → (commit | rollback).
#
# Why file-copy instead of git-stash: simpler, works in any git state
# (worktrees, sparse checkouts, mid-rebase), no interaction with user stashes,
# atomic on a per-file basis.
#
# Zero dependencies beyond cp + Node.js (tsc).

set -euo pipefail

CMD="${1:-}"
STASH_REF_FILE=".polish-stash-ref"

case "$CMD" in
  begin)
    FILE="${2:-}"
    if [ -z "$FILE" ]; then
      echo "error: begin requires a file path" >&2
      exit 2
    fi
    if [ ! -f "$FILE" ]; then
      echo "error: file not found: $FILE" >&2
      exit 2
    fi
    if [ -f "$STASH_REF_FILE" ]; then
      echo "error: a polish-stash is already in progress (see $STASH_REF_FILE). Run commit or rollback first." >&2
      exit 2
    fi
    BACKUP="${FILE}.polish-backup"
    if [ -e "$BACKUP" ]; then
      echo "error: backup file already exists at $BACKUP — refusing to overwrite" >&2
      exit 2
    fi
    cp -p "$FILE" "$BACKUP"
    echo "$FILE" > "$STASH_REF_FILE"
    echo "backed up: $FILE → $BACKUP"
    ;;

  check)
    if [ ! -f "$STASH_REF_FILE" ]; then
      echo "error: no active polish backup. Run begin first." >&2
      exit 2
    fi
    # Locate tsconfig.json — if absent, skip TS check (project may be plain JS)
    TSCONFIG=$(find . -maxdepth 3 -name "tsconfig.json" -not -path "*/node_modules/*" 2>/dev/null | head -n 1)
    if [ -z "$TSCONFIG" ]; then
      echo "no tsconfig.json found — skipping TS check"
      exit 0
    fi
    TS_PROJECT_DIR=$(dirname "$TSCONFIG")
    if [ -x "node_modules/.bin/tsc" ]; then
      TSC="node_modules/.bin/tsc"
    elif [ -x "${TS_PROJECT_DIR}/node_modules/.bin/tsc" ]; then
      TSC="${TS_PROJECT_DIR}/node_modules/.bin/tsc"
    elif command -v tsc >/dev/null 2>&1; then
      TSC="tsc"
    else
      echo "tsc not found — skipping TS check"
      exit 0
    fi
    (cd "$TS_PROJECT_DIR" && "$TSC" --noEmit --pretty false 2>&1) | tail -n 20
    EXIT_CODE=${PIPESTATUS[0]}
    if [ "$EXIT_CODE" -ne 0 ]; then
      echo "tsc check failed (exit $EXIT_CODE)"
      exit 1
    fi
    echo "tsc check passed"
    ;;

  commit)
    if [ ! -f "$STASH_REF_FILE" ]; then
      echo "error: no active polish backup. Run begin first." >&2
      exit 2
    fi
    FILE=$(head -n 1 "$STASH_REF_FILE")
    BACKUP="${FILE}.polish-backup"
    rm -f "$BACKUP"
    rm -f "$STASH_REF_FILE"
    echo "polish committed; backup dropped"
    ;;

  rollback)
    if [ ! -f "$STASH_REF_FILE" ]; then
      echo "error: no active polish backup. Run begin first." >&2
      exit 2
    fi
    FILE=$(head -n 1 "$STASH_REF_FILE")
    BACKUP="${FILE}.polish-backup"
    if [ -f "$BACKUP" ]; then
      mv -f "$BACKUP" "$FILE"
    else
      echo "warning: backup file missing — file not restored" >&2
    fi
    rm -f "$STASH_REF_FILE"
    echo "polish rolled back: $FILE restored"
    ;;

  *)
    echo "usage: polish-safety-wrap.sh {begin <file>|check|commit|rollback}" >&2
    exit 2
    ;;
esac
