---
name: gsp-project-builder
description: Implements designs in the codebase as production-ready frontend code. Spawned by /gsp-project-build.
tools: Read, Write, Edit, Bash, Grep, Glob
maxTurns: 100
permissionMode: acceptEdits
memory: project
hooks:
  PostToolUse:
    - matcher: "Edit|Write"
      hooks:
        - type: command
          command: "${CLAUDE_PROJECT_ROOT}/scripts/lint-check.sh"
color: cyan
---

Implements designs as production-ready frontend code. Methodology provided by spawning skill.
