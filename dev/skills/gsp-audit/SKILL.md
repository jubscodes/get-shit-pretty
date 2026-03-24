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
argument-hint: "[focus] e.g. 'all', 'contracts', 'installer', 'runtime', 'versions', 'templates', 'prompts'"
disable-model-invocation: true
---

<context>
GSP internal integrity checker for maintainers. Verifies that the plugin's moving parts stay consistent as the codebase evolves. This is NOT the user-facing `/gsp:doctor` (which checks `.design/` project health) — this checks the GSP *source code* itself.

Source layout:
- `gsp/skills/` — 30 skills (SKILL.md files)
- `gsp/agents/` — 15 agents (gsp-*.md files)
- `gsp/templates/` — config, state, brief, roadmap templates
- `gsp/references/` — shared reference material
- `gsp/prompts/` — 12 system prompts
- `.claude-plugin/plugin.json` — plugin manifest
- `bin/install.js` — multi-runtime installer
- `VERSION`, `package.json` — version sources

Runtime compatibility reference: `${CLAUDE_SKILL_DIR}/../gsp-runtime-compat/references/baseline.md`
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

The script accepts: `all` (default), `versions`, `contracts`, `installer`, `runtime`, `templates`, `prompts`.

Review the output. If all tests pass, report the clean result. If any tests fail or warn, investigate each issue using the deeper analysis steps below.

## Step 1: Parse scope

`$ARGUMENTS` determines which checks to run:
- **`all`** or empty — run everything
- **`contracts`** — agent↔skill contract checks only
- **`installer`** — installer correctness checks only
- **`runtime`** — runtime compatibility checks (uses gsp-runtime-compat baseline)
- **`versions`** — version sync checks only
- **`templates`** — template coherence checks only
- **`prompts`** — prompt quality checks only (line budgets, duplication, vague directives)

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

### C9: User-invocable skills have `user-invocable: true`
Every skill in `gsp/skills/` (except `get-shit-pretty`, which is the plugin entry point with `user-invocable: false`) must have `user-invocable: true` in frontmatter. Without it, Claude Code won't list the skill in the slash-command menu.
- All present → PASS
- Missing → FAIL with list of skills

### C8: Claude-only field usage matches known set
Canary test — grep agents for `memory:`, `background:`, `hooks:`, `isolation:`, `skills:`, `mcpServers:`. Compare against expected list (gsp-builder.md, gsp-reviewer.md). WARN if set changes so developer verifies converters handle new fields.

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

### I15: Statusline VERSION detection
Verify `scripts/gsp-statusline.js` checks both current (`{runtimeDir}/VERSION`) and legacy (`{runtimeDir}/get-shit-pretty/VERSION`) paths.

### I16: Skill execution_context refs resolve
Every `@${CLAUDE_SKILL_DIR}/../../` reference in skill `<execution_context>` blocks must point to an existing source file. FAIL if any ref is broken.

### I17: Skills with sibling files get full directory copy
If a skill directory contains files beyond SKILL.md (e.g. `gsp-style/styles/`), verify the installer's copy functions handle subdirectories (not just SKILL.md). FAIL if copy functions don't support siblings.

### I18: All copy functions have gsp- prefix guard
Every runtime's copy function (`copyClaudeSkills`, `copyOpencodeSkills`, `copyGeminiSkills`, `copyCodexSkillsFromSource`) must add the `gsp-` prefix to dirs that don't have it. FAIL if any function is missing the guard.

## Step 5: Runtime Compatibility (R)

Read the baseline reference at `${CLAUDE_SKILL_DIR}/../gsp-runtime-compat/references/baseline.md`.

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

## Step 6b: Prompt Quality (P)

Automated checks for prompt engineering hygiene across all skills, agents, and prompts.

### P1: Line count budgets
Flag files exceeding size thresholds: skills >300 lines, agents >150 lines, prompts >80 lines.

### P2: `<rules>` placement
`<rules>` sections should only appear in skills, not in agent definitions or system prompts.

### P3: `<rules>` size budget
Flag `<rules>` sections exceeding 30 lines — large rules blocks dilute focus.

### P4: Cross-file duplicate lines
Find non-trivial lines (>30 chars) appearing in 3+ files — signals copy-paste drift.

### P5: Skill↔agent instruction overlap
When a skill spawns an agent, check for repeated instructions between them. Overlap means the agent gets the same instruction twice (from skill context + its own definition).

### P6: Verbosity ratio
Ratio of constraint keywords (must, never, always, forbidden, required) + `<rules>` lines vs total content. Flag >40% — indicates over-prompting.

### P7: Vague directive detection
Grep for known anti-patterns: "be natural", "use good tone", "write clean", "be helpful", "ensure quality", "be thorough", "be creative", "be professional", "use best practices". These are instructions the model can't act on consistently.

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
  ✅ I15. Statusline VERSION ....... PASS
  ✅ I16. Skill refs resolve ....... PASS
  ✅ I17. Sibling file copy ........ PASS
  ✅ I18. gsp- prefix guard ........ PASS

Runtime Compatibility
  ✅ R1. Discovery paths ............ PASS
  ✅ R2. Tool name mappings ......... PASS
  ✅ R3-R7. Body replacements ....... PASS
  ✅ R8. Codex skips agents ......... PASS
  ✅ R9. Skill rename guard ......... PASS

Templates
  ✅ T1-T7. All template checks ..... PASS

Prompt Quality
  ✅ P1. Line budgets ............... PASS
  ✅ P2. <rules> placement .......... PASS
  ✅ P3. <rules> size ............... PASS
  ✅ P4. Cross-file duplicates ...... PASS
  ✅ P5. Skill↔agent overlap ....... PASS
  ✅ P6. Verbosity ratio ............ PASS
  ✅ P7. Vague directives ........... PASS

─── Summary ───────────────────────────

  37 PASS · 1 WARN · 0 FAIL
  GSP pipeline is healthy with minor issues.
```

## Important Notes

- **Read-only** — do NOT modify any files, only report findings
- **Be specific** — every issue names the exact file and suggests the exact fix
- **Don't over-report** — if the same root cause triggers multiple checks, note it once and cross-reference
- **Count everything** — the report should show exact counts (24 skills, 15 agents)
- **Runtime compat uses baseline** — read the baseline.md reference file, don't re-derive from scratch

</process>
