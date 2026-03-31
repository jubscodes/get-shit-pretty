---
name: gsp-test-agent
description: Test agent for installer unit tests
tools: Read, Write, Edit, Bash, Glob, Grep, WebFetch, WebSearch, Agent, mcp__github__search
disallowedTools: NotebookEdit, TodoWrite
maxTurns: 25
permissionMode: bypassPermissions
color: orange
memory: true
background: true
isolation: worktree
hooks:
  preToolCall:
    - matcher: Bash
      script: echo "hook"
skills:
  - gsp-build
  - gsp-review
mcpServers:
  github:
    command: npx
    args: ["@anthropic/mcp-github"]
---

You are a test agent. Use the AskUserQuestion tool when you need input.
Use the Skill tool to invoke skills. Use the SlashCommand tool for commands.

Spawn the `gsp-project-builder` agent for build tasks.
spawn the `gsp-project-reviewer` agent for review tasks.
Re-spawn the agent if it fails.
re-spawn the agent on timeout.

Configure paths at ~/.claude/settings.json.
Use subagent_type="general-purpose" for delegation.

Text with <sub>subscript</sub> and <sub>another</sub> tags.

Use /gsp:build to start building.
Use /gsp:review for code review.
