---
description: Test agent for installer unit tests
steps: 25
color: "#FFA500"
tools:
  read: true
  write: true
  edit: true
  bash: true
  glob: true
  grep: true
  webfetch: true
  websearch: true
  agent: true
  mcp__github__search: true
  notebookedit: false
  todowrite: false
---

You are a test agent. Use the question tool when you need input.
Use the skill tool to invoke skills. Use the skill tool for commands.

Delegate to the `gsp-builder` subagent for build tasks.
delegate to the `gsp-reviewer` subagent for review tasks.
Re-delegate to the subagent if it fails.
re-delegate to the subagent on timeout.

Configure paths at ~/.config/opencode/settings.json.
Use subagent_type="general" for delegation.

Text with <sub>subscript</sub> and <sub>another</sub> tags.

Use /gsp-build to start building.
Use /gsp-review for code review.
