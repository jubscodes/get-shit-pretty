---
name: gsp-audit
description: Verify GSP pipeline integrity — command/agent/skill contracts, installer correctness, runtime compatibility, version sync, and template coherence. Internal development tool for GSP maintainers.
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
- `gsp/commands/gsp/` — 20 commands (*.md files)
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
- **`contracts`** — command↔agent↔skill contract checks only
- **`installer`** — installer correctness checks only
- **`runtime`** — runtime compatibility checks (uses runtime-compat baseline)
- **`versions`** — version sync checks only
- **`templates`** — template coherence checks only

## Step 1: Version Sync (V)

Three version sources must agree:

```bash
cat VERSION
node -e "console.log(require('./package.json').version)"
node -e "console.log(require('./.claude-plugin/plugin.json').version)"
```

**V1: Version agreement** — all three match → PASS, any mismatch → FAIL with which disagrees.

**V2: CHANGELOG coverage** — `CHANGELOG.md` has an entry for the current version → PASS, missing → WARN.

## Step 2: Contract Checks (C)

Verify that skills, commands, and agents reference each other correctly.

### C1: Every skill has a matching command
For each `gsp/skills/gsp-*/SKILL.md`, check that a corresponding `gsp/commands/gsp/*.md` exists (skill `gsp-project-brief` → command `project-brief.md`). Exception: `get-shit-pretty` skill (meta skill, no command needed).
- All matched → PASS
- Missing commands → WARN (skills work without commands, but commands provide backward compat)

### C2: Every command that spawns agents references valid agents
Read each command in `gsp/commands/gsp/`. Extract agent references (patterns: `gsp-{name}`, `Agent:`, `agent:`, `Spawns:`, `spawns`). Check each referenced agent exists in `gsp/agents/`.
- All references valid → PASS
- Missing agents → FAIL

### C3: Every skill that spawns agents references valid agents
Same as C2 but for `gsp/skills/gsp-*/SKILL.md`.

### C4: Agent tool lists are valid
Read each agent in `gsp/agents/`. Extract `tools:` frontmatter. Verify each tool name is a valid Claude Code tool: Read, Write, Edit, Bash, Glob, Grep, WebFetch, WebSearch, Agent, NotebookEdit, TodoWrite, AskUserQuestion, Skill.
- All valid → PASS
- Unknown tools → WARN

### C5: Skill↔command content drift
For each skill/command pair, check they describe the same workflow. Extract the `description:` and `<objective>` from both. If the objectives are substantially different → WARN. (Heuristic: check first 100 chars of objective match or differ.)

### C6: Agent descriptions match spawning context
Each agent has a `description:` saying who spawns it. Verify the referenced skill/command actually spawns this agent.
- Matches → PASS
- Orphan agents (no skill/command spawns them) → WARN

## Step 3: Installer Checks (I)

### I1: All skills are installed
Read `bin/install.js`. For each runtime's skill copy function, verify it would find all 21 skills from `gsp/skills/`.
```bash
ls gsp/skills/ | wc -l
```
Cross-reference with the installer's source directory path.

### I2: All agents are installed (non-Codex)
Verify the installer copies all 15 agents for Claude, OpenCode, and Gemini (Codex skips agents).
```bash
ls gsp/agents/gsp-*.md | wc -l
```

### I3: All commands are installed
Verify the installer copies all 20 commands.
```bash
ls gsp/commands/gsp/*.md | wc -l
```

### I4: Bundle completeness
Verify the installer bundles prompts, templates, and references:
```bash
ls gsp/prompts/ gsp/templates/ gsp/references/ | head -50
```

### I5: Installer syntax validity
```bash
node -c bin/install.js
```
PASS if exit 0, FAIL if syntax error.

### I6: Tool name mappings complete
Read the installer's tool mapping functions. Extract all Claude tool names being mapped. Compare against the known Claude tool list. Any unmapped tool → WARN.

Grep for the mapping objects:
```bash
grep -A 30 'opencode.*tool\|gemini.*tool\|codex.*tool' bin/install.js | head -100
```

### I7: package.json `files` field
Verify `package.json` `files` array includes all necessary directories. Everything in the `files` list should exist.
```bash
node -e "require('./package.json').files.forEach(f => console.log(f))"
```
Check each path exists → PASS, missing → FAIL.

## Step 4: Runtime Compatibility (R)

Read the baseline reference at `${CLAUDE_SKILL_DIR}/../runtime-compat/references/baseline.md`.

### R1: Discovery paths match installer
For each runtime, check that the installer writes to the discovery paths documented in the baseline:
- Claude: `.claude/skills/`, `.claude/commands/gsp/`, `.claude/agents/`
- OpenCode: `.opencode/skills/`, `.opencode/commands/`, `.opencode/agents/`
- Gemini: `.gemini/skills/`, `.gemini/commands/gsp/`, `.gemini/agents/`
- Codex: `.agents/skills/` (NOT `.codex/skills/`), no agents

Grep the installer for each path pattern. Mismatch → FAIL.

### R2: Tool name mappings current
Compare installer's tool mappings against baseline. Any difference → WARN.

### R3: Body replacements current
Check the installer's body replacement functions cover all patterns from the baseline (command invocation prefix, config path, SKILL_DIR variable, variable escaping). Missing pattern → WARN.

### R4: Live doc check (optional, when `runtime` scope)
If scope includes `runtime`, attempt to fetch one doc page per runtime to verify URLs are still valid:
- `https://code.claude.com/docs/en/skills`
- `https://opencode.ai/docs/skills/`
- `https://geminicli.com/docs/cli/skills/`
- `https://developers.openai.com/codex/skills`

URL returns content → PASS, 404/redirect to different structure → WARN with new URL.

## Step 5: Template Coherence (T)

### T1: Config templates have all required fields
Read `gsp/templates/branding/config.json` and `gsp/templates/projects/config.json`. Verify expected fields exist:

**Brand config:** name, project_type ("brand"), version, phases (discover, strategy, identity, system)
**Project config:** name, project_type ("design"), version, brand_ref, phases (brief, research, design, critique, build, review), design_scope, implementation_target, codebase_type

Missing field → FAIL.

### T2: State templates match phase names
Read `gsp/templates/branding/state.md` and `gsp/templates/projects/state.md`. Verify phase names in the state table match the phases in the corresponding config template.
Mismatch → FAIL.

### T3: Phase templates exist for all phases
For each phase listed in config templates, verify a corresponding template exists in `gsp/templates/phases/`.
Missing → WARN.

### T4: Exports index template covers all phases
Read `gsp/templates/exports-index.md`. Verify it has BEGIN/END markers for each project phase.
Missing phase → WARN.

### T5: Chunk format reference exists
Verify `gsp/references/chunk-format.md` exists and is non-empty.

## Step 6: Report

Output a terminal-formatted report:

```
GSP Integrity Audit
═══════════════════════════════════════

Version Sync
  ✅ V1. Version agreement .......... PASS (0.4.3)
  ⚠️  V2. CHANGELOG coverage ........ WARN

Contracts
  ✅ C1. Skill→command mapping ....... PASS (21/21)
  ✅ C2. Command→agent refs ......... PASS
  ✅ C3. Skill→agent refs ........... PASS
  ✅ C4. Agent tool validity ........ PASS
  ⚠️  C5. Skill↔command drift ....... WARN
  ✅ C6. Agent spawn refs ........... PASS

Installer
  ✅ I1. Skills installed ........... PASS (21)
  ✅ I2. Agents installed ........... PASS (15)
  ✅ I3. Commands installed ......... PASS (20)
  ✅ I4. Bundle completeness ........ PASS
  ✅ I5. Installer syntax ........... PASS
  ⚠️  I6. Tool mappings complete .... WARN
  ✅ I7. Files field ................ PASS

Runtime Compatibility
  ✅ R1. Discovery paths ............ PASS
  ✅ R2. Tool name mappings ......... PASS
  ✅ R3. Body replacements .......... PASS
  ⚠️  R4. Live doc check ............ WARN

Templates
  ✅ T1. Config fields .............. PASS
  ✅ T2. State↔config phases ........ PASS
  ✅ T3. Phase templates ............ PASS
  ✅ T4. Exports index .............. PASS
  ✅ T5. Chunk format ref ........... PASS

─── Issues Found ──────────────────────

FAIL:
  (none)

WARN:
  • [V2] CHANGELOG.md missing entry for v0.4.3
    → Add a ## 0.4.3 section to CHANGELOG.md
  • [C5] Skill gsp-start objective differs from command start.md
    → Sync objectives between skill and command
  • [I6] Tool "NotebookEdit" has no Gemini mapping
    → Add mapping in convertClaudeToGeminiAgent() or filter it out
  • [R4] code.claude.com/docs/en/skills redirected (was docs.anthropic.com)
    → Update baseline.md with current URLs

─── Summary ───────────────────────────

  18 PASS · 4 WARN · 0 FAIL
  GSP pipeline is healthy with minor issues.
```

## Important Notes

- **Read-only** — do NOT modify any files, only report findings
- **Be specific** — every issue names the exact file and suggests the exact fix
- **Don't over-report** — if the same root cause triggers multiple checks, note it once and cross-reference
- **Count everything** — the report should show exact counts (21 skills, 15 agents, 20 commands)
- **Runtime compat uses baseline** — read the baseline.md reference file, don't re-derive from scratch

</process>
