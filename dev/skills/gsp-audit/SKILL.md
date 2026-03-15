---
name: gsp-audit
description: Verify GSP pipeline integrity — agent/skill contracts, installer correctness, runtime compatibility, version sync, and template coherence. Internal development tool for GSP maintainers.
allowed-tools:
  - Read
  - Glob
  - Grep
  - Bash
  - WebFetch
  - WebSearch
  - Agent
argument-hint: "[focus] e.g. 'all', 'contracts', 'installer', 'runtime', 'versions', 'templates'"
disable-model-invocation: true
---

<context>
GSP internal integrity checker for maintainers. Verifies that the plugin's moving parts stay consistent as the codebase evolves. This is NOT the user-facing `/gsp:doctor` (which checks `.design/` project health) — this checks the GSP *source code* itself.

Source layout:
- `gsp/skills/` — 21 skills (SKILL.md files)
- `gsp/agents/` — 15 agents (gsp-*.md files)
- `gsp/templates/` — config, state, brief, roadmap templates
- `gsp/references/` — shared reference material
- `gsp/prompts/` — 12 system prompts
- `.claude-plugin/plugin.json` — plugin manifest
- `bin/install.js` — multi-runtime installer
- `VERSION`, `package.json` — version sources

Runtime compatibility reference: `${CLAUDE_SKILL_DIR}/../runtime-compat/references/baseline.md`
</context>

<objective>
Run a comprehensive integrity audit and report issues. Every check produces PASS, WARN, or FAIL with actionable fix suggestions.
</objective>

<process>

## Step 0: Run automated tests

Run the test suite first — it covers versions, contracts, installer, runtime, and templates:

```bash
bash dev/scripts/audit-tests.sh $ARGUMENTS
```

The script accepts: `all` (default), `versions`, `contracts`, `installer`, `runtime`, `templates`.

Review the output. If all tests pass, report the clean result. If any tests fail or warn, investigate each issue using the deeper analysis steps below.

## Step 1: Parse scope

`$ARGUMENTS` determines which checks to run:
- **`all`** or empty — run everything
- **`contracts`** — agent↔skill contract checks only
- **`installer`** — installer correctness checks only
- **`runtime`** — runtime compatibility checks (uses runtime-compat baseline)
- **`versions`** — version sync checks only
- **`templates`** — template coherence checks only

## Step 2: Version Sync (V)

Three version sources must agree:

```bash
cat VERSION
node -e "console.log(require('./package.json').version)"
node -e "console.log(require('./.claude-plugin/plugin.json').version)"
```

**V1: Version agreement** — all three match → PASS, any mismatch → FAIL with which disagrees.

**V2: CHANGELOG coverage** — `CHANGELOG.md` has an entry for the current version → PASS, missing → WARN.

## Step 3: Contract Checks (C)

Verify that skills and agents reference each other correctly.

### C3: Every skill that spawns agents references valid agents
For each `gsp/skills/gsp-*/SKILL.md`, extract agent references (patterns: `gsp-{name}`). Check each referenced agent exists in `gsp/agents/`.
- All references valid → PASS
- Missing agents → FAIL

### C4: Agent tool lists are valid
Read each agent in `gsp/agents/`. Extract `tools:` frontmatter. Verify each tool name is a valid Claude Code tool: Read, Write, Edit, Bash, Glob, Grep, WebFetch, WebSearch, Agent, NotebookEdit, TodoWrite, AskUserQuestion, Skill.
- All valid → PASS
- Unknown tools → WARN

### C5: No orphan agents
Every agent in `gsp/agents/` is spawned by at least one skill.
- All referenced → PASS
- Orphan agents → WARN

### C6: Agent frontmatter has required fields
Each agent must have `name:`, `description:`, and `tools:` in frontmatter.
- All present → PASS
- Missing fields → FAIL

### C7: Skill frontmatter has required fields
Each skill must have `name:` and `description:` in frontmatter.
- All present → PASS
- Missing fields → FAIL

### C8: Claude-only field usage matches known set
Canary test — grep agents for `memory:`, `background:`, `hooks:`, `isolation:`, `skills:`, `mcpServers:`. Compare against expected list (gsp-builder.md, gsp-codebase-scanner.md, gsp-reviewer.md). WARN if set changes so developer verifies converters handle new fields.

## Step 4: Installer Checks (I)

### I1: Installer syntax validity
```bash
node -c bin/install.js
```
PASS if exit 0, FAIL if syntax error.

### I2: Source skill count
Verify ≥20 skills exist in `gsp/skills/`.

### I3: Source agent count
Verify ≥14 agents exist in `gsp/agents/`.

### I5: Bundle directories present
Verify `gsp/prompts`, `gsp/templates`, `gsp/references` exist.

### I6: package.json `files` field
Everything in the `files` list should exist on disk.

### I7: Codex skills → .agents/skills/
Verify `getCodexSkillsDir` function returns `.agents` path.

### I8: Tool mapping objects present
Verify `claudeToOpencodeTools`, `claudeToGeminiTools`, `claudeToCodexTools` objects exist.

### I9: All conversion functions present
Verify all 5 converter functions exist in the installer.

### I10: All body replacement functions present
Verify `applyOpencodeBodyReplacements`, `applyGeminiBodyReplacements`, `applyCodexBodyReplacements` exist.

### I11: Agent converters strip Claude-only single-line fields
Grep both `convertClaudeToOpencodeAgent` and `convertClaudeToGeminiAgent` for `startsWith('memory:')`, `startsWith('background:')`, `startsWith('isolation:')` with `continue`. FAIL if any stripping pattern is missing.

### I12: Agent converters strip Claude-only multi-line blocks
Grep both agent converters for `hooks:`, `skills:`, `mcpServers:` handling and verify `inSkipBlock` state machine exists. FAIL if block-stripping logic is missing.

### I13: Body replacements handle Skill tool rename
Grep each `apply*BodyReplacements` function for `Skill` replacement pattern. FAIL if any of the 3 body replacement functions lacks the pattern.

### I14: No dead tool names in mappings
Grep tool mapping objects for known-dead names (e.g. `Task`). Regression guard — FAIL if dead tools reappear.

## Step 5: Runtime Compatibility (R)

Read the baseline reference at `${CLAUDE_SKILL_DIR}/../runtime-compat/references/baseline.md`.

### R1: Discovery paths match installer
For each runtime, check that the installer writes to the correct discovery paths:
- Claude: `.claude/skills/`, `.claude/agents/`
- OpenCode: `.opencode/skills/`, `.opencode/agents/`
- Gemini: `.gemini/skills/`, `.gemini/agents/`
- Codex: `.agents/skills/` (NOT `.codex/skills/`), no agents

### R2: Tool name mappings current (mapping + body)
Compare installer's tool mappings against baseline. Verify Skill replacement exists in body replacement functions. Any difference → WARN.

### R3-R7: Body replacements, config paths, SKILL_DIR
Check the installer's body replacement functions cover all patterns from the baseline.

### R8: Codex agents are skipped
Verify Codex runtime doesn't install agent .md files.

### R9: Skill tool replacement uses lookahead guard
Grep each `apply*BodyReplacements` for `(?=` near `Skill` — ensures the replacement isn't a naive `\bSkill\b` that would corrupt "SKILL.md", "skills", etc. WARN if guard pattern is missing.

## Step 6: Template Coherence (T)

### T1-T7: Config fields, state templates, phase templates, exports index, chunk format, state/brief templates
See automated test suite for details.

## Step 7: Report

Output a terminal-formatted report:

```
GSP Integrity Audit
═══════════════════════════════════════

Version Sync
  ✅ V1. Version agreement .......... PASS (0.5.0)
  ⚠️  V2. CHANGELOG coverage ........ WARN

Contracts
  ✅ C3. Skill→agent refs ........... PASS
  ✅ C4. Agent tool validity ........ PASS
  ✅ C5. No orphan agents ........... PASS
  ✅ C6. Agent frontmatter .......... PASS
  ✅ C7. Skill frontmatter .......... PASS
  ✅ C8. Claude-only field set ...... PASS

Installer
  ✅ I1. Installer syntax ........... PASS
  ✅ I2. Skills exist ............... PASS (21)
  ✅ I3. Agents exist ............... PASS (15)
  ✅ I5. Bundle dirs ................ PASS
  ✅ I6. Files field ................ PASS
  ✅ I7. Codex skills path .......... PASS
  ✅ I8. Tool mapping objects ....... PASS
  ✅ I9. Conversion functions ....... PASS
  ✅ I10. Body replacers ............ PASS
  ✅ I11. Single-line field strip ... PASS
  ✅ I12. Multi-line block strip .... PASS
  ✅ I13. Skill tool rename ......... PASS
  ✅ I14. No dead tool names ........ PASS

Runtime Compatibility
  ✅ R1. Discovery paths ............ PASS
  ✅ R2. Tool name mappings ......... PASS
  ✅ R3-R7. Body replacements ....... PASS
  ✅ R8. Codex skips agents ......... PASS
  ✅ R9. Skill rename guard ......... PASS

Templates
  ✅ T1-T7. All template checks ..... PASS

─── Summary ───────────────────────────

  30 PASS · 1 WARN · 0 FAIL
  GSP pipeline is healthy with minor issues.
```

## Important Notes

- **Read-only** — do NOT modify any files, only report findings
- **Be specific** — every issue names the exact file and suggests the exact fix
- **Don't over-report** — if the same root cause triggers multiple checks, note it once and cross-reference
- **Count everything** — the report should show exact counts (21 skills, 15 agents)
- **Runtime compat uses baseline** — read the baseline.md reference file, don't re-derive from scratch

</process>
