---
name: gsp-test-skill
description: Test skill for installer unit tests
  - file: config.json
---

# Test Skill

Read shared prompts from `./../../prompts/system.md`.
Load templates from `./../../templates/config.json`.

Use the ask the user tool to ask for project name.
Use the skill tool to chain skills.

Spawn a worker agent for `gsp-builder` with the brief.
spawn a worker agent for `gsp-reviewer` for QA.

Text with <sub>emphasis</sub> here.

Run $gsp-build after setup.
Configure at ~/.codex/config.json.
