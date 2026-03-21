---
name: gsp-test-skill
description: Test skill for installer unit tests
  - file: config.json
---

# Test Skill

Read shared prompts from `${SKILL_DIR}/../../prompts/system.md`.
Load templates from `${SKILL_DIR}/../../templates/config.json`.

Use the question tool to ask for project name.
Use the skill tool to chain skills.

Delegate to the `gsp-builder` subagent with the brief.
delegate to the `gsp-reviewer` subagent for QA.

Text with <sub>emphasis</sub> here.

Run /gsp-build after setup.
Configure at ~/.config/opencode/config.json.
