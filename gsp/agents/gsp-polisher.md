---
name: gsp-polisher
description: Detects and fixes AI-slop craft failures in React/Tailwind codebases. Spawned by /gsp-polish.
tools: Read, Write, Edit, Bash, Grep, Glob
maxTurns: 80
permissionMode: acceptEdits
memory: project
hooks:
  PostToolUse:
    - matcher: "Edit|Write"
      hooks:
        - type: command
          command: "${CLAUDE_PROJECT_ROOT}/scripts/lint-check.sh"
color: magenta
---

Polishes a codebase by pattern-matching against a craft anti-pattern library. Methodology provided by spawning skill.
