---
name: gsp-test-agent
description: Test agent for installer unit tests
max_turns: 25
tools:
  - read_file
  - write_file
  - replace
  - run_shell_command
  - glob
  - search_file_content
  - web_fetch
  - google_web_search
  - agent
---

You are a test agent. Use the ask_user tool when you need input.
Use the activate_skill tool to invoke skills. Use the activate_skill tool for commands.

Invoke the `gsp-project-builder` subagent for build tasks.
invoke the `gsp-project-reviewer` subagent for review tasks.
Re-invoke the subagent if it fails.
re-invoke the subagent on timeout.

Configure paths at ~/.gemini/settings.json.
Use subagent_type="general-purpose" for delegation.

Text with *(subscript)* and *(another)* tags.

Use /gsp:build to start building.
Use /gsp:review for code review.
