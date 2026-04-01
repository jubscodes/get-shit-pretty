---
name: gsp-test-skill
description: Test skill for installer unit tests
  - file: config.json
---

# Test Skill

Read shared prompts from `./../../prompts/system.md`.
Load templates from `./../../templates/config.json`.

Use the ask_user tool to ask for project name.
Use the activate_skill tool to chain skills.

Invoke the `gsp-project-builder` subagent with the brief.
invoke the `gsp-project-reviewer` subagent for QA.

Text with *(emphasis)* here.

Run /gsp:build after setup.
Configure at ~/.gemini/config.json.
