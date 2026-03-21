---
name: gsp-test-skill
description: Test skill for installer unit tests
allowed-tools:
  - Read
  - Write
  - Bash
  - mcp__github__search
disable-model-invocation: true
user-invocable: true
argument-hint: <project-name>
color: cyan
context:
  - file: config.json
agent: gsp-builder
---

# Test Skill

Read shared prompts from `${CLAUDE_SKILL_DIR}/../../prompts/system.md`.
Load templates from `${CLAUDE_SKILL_DIR}/../../templates/config.json`.

Use the AskUserQuestion tool to ask for project name.
Use the Skill tool to chain skills.

Spawn the `gsp-builder` agent with the brief.
spawn the `gsp-reviewer` agent for QA.

Text with <sub>emphasis</sub> here.

Run /gsp:build after setup.
Configure at ~/.claude/config.json.
