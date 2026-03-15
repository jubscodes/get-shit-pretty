---
name: runtime-compat
description: Research live documentation for Claude Code, OpenCode, Gemini CLI, and Codex CLI — check discovery paths, tool names, frontmatter fields, and flag drift against the GSP installer. Internal GSP development tool.
allowed-tools:
  - WebFetch
  - WebSearch
  - Read
  - Glob
  - Grep
  - Bash
argument-hint: "[runtime|concept] e.g. 'codex skills', 'gemini agents', 'all', 'tool-mapping'"
disable-model-invocation: true
---

<context>
GSP development reference skill. Fetches live documentation for each supported runtime, cross-references with the GSP installer, and presents an up-to-date view of how each runtime handles skills, agents, and commands.

The GSP installer lives at `bin/install.js` in the repo root. It converts Claude Code's native format into each runtime's expected format. The baseline reference is at `${CLAUDE_SKILL_DIR}/references/baseline.md`.
</context>

<objective>
Research the latest documentation for the requested runtime(s) and present:
1. Current extension format specs (skills, agents, commands)
2. Discovery paths and directory layout
3. Frontmatter fields and format differences
4. Tool name mappings
5. Any recent changes or new features since the last GSP installer update
6. Delta between what docs say and what GSP currently does (flag drift)
</objective>

<process>

## Step 0: Parse request

`$ARGUMENTS` determines scope:
- **A runtime name** (`claude`, `opencode`, `gemini`, `codex`) — research that runtime only
- **A concept** (`skills`, `agents`, `commands`, `tool-mapping`) — compare across all runtimes
- **A combo** (`codex skills`, `gemini agents`) — specific runtime + concept
- **`all`** or empty — full comparison across all runtimes and concepts
- **`drift`** — compare docs against current installer and flag mismatches

## Step 1: Fetch live documentation

For each runtime in scope, fetch the authoritative docs. Use WebFetch with targeted prompts to extract extension specs.

### Claude Code
- Skills: `https://code.claude.com/docs/en/skills`
- Agents/Subagents: `https://code.claude.com/docs/en/sub-agents`
- Plugins: `https://code.claude.com/docs/en/plugins`
- Hooks: `https://code.claude.com/docs/en/hooks`

Extract: frontmatter fields, discovery paths, `${CLAUDE_SKILL_DIR}`, `$ARGUMENTS`, `context: fork`, `allowed-tools`, `disable-model-invocation`, `user-invocable`, `agent` field, skill precedence rules.

### OpenCode
- Skills: `https://opencode.ai/docs/skills/`
- Agents: `https://opencode.ai/docs/agents/`
- Commands: `https://opencode.ai/docs/commands/`
- Rules: `https://opencode.ai/docs/rules/`

Extract: frontmatter fields (`steps` vs `maxTurns`, `color` hex format, tool boolean maps), discovery paths (`~/.config/opencode/skills/`, `.opencode/skills/`), command flattening rules, `${SKILL_DIR}` variable.

### Gemini CLI
- Skills: `https://geminicli.com/docs/cli/skills/`
- Creating Skills: `https://geminicli.com/docs/cli/creating-skills/`
- Subagents: `https://geminicli.com/docs/core/subagents/`
- Extensions: `https://geminicli.com/docs/extensions/`
- Getting Started with Skills: `https://geminicli.com/docs/cli/tutorials/skills-getting-started/`

Extract: TOML command format, skill frontmatter, `activate_skill` tool, agent experimental flags, tool name mappings (`read_file`, `run_shell_command`, `google_web_search`), `~/.gemini/skills/` and `~/.agents/skills/` discovery.

### Codex CLI
- Skills: `https://developers.openai.com/codex/skills`
- Full docs index: `https://developers.openai.com/codex`

Extract: `.agents/skills/` discovery hierarchy (REPO → USER → ADMIN → SYSTEM), `agents/openai.yaml` metadata, `$` invocation syntax, implicit vs explicit invocation, `config.toml` skill disable, progressive disclosure model, tool names (`read`, `write`, `edit`, `shell`, `grep`, `glob`).

### Fallback

If any URL fails or returns empty content, use WebSearch to find the current docs:
- `"[runtime] CLI skills documentation 2026"`
- `"[runtime] CLI agents subagents documentation 2026"`

## Step 2: Cross-reference with GSP installer

Read the installer to compare what GSP currently does:

```bash
# Key conversion functions in the installer
grep -n 'function convert\|function copy\|function apply.*Body\|function get.*Dir' bin/install.js
```

For each runtime, check:
- **Discovery paths**: Does GSP install to the right directory?
- **Frontmatter conversion**: Are all required/supported fields handled?
- **Tool name mapping**: Are mappings current with the runtime's docs?
- **Body replacements**: Are path prefixes and invocation syntax correct?
- **New features**: Has the runtime added new extension points GSP doesn't support yet?

## Step 3: Present findings

Output a structured report. Format depends on scope:

### Single runtime — full deep-dive

```
## {Runtime} Extension System

### Skills
- Format: {description}
- Discovery: {paths with precedence}
- Frontmatter: {all fields}
- Invocation: {how users/model trigger skills}
- Variables: {substitution vars}

### Agents
- Format: {description}
- Discovery: {paths}
- Frontmatter: {all fields}
- Spawning: {how agents are created}

### Commands
- Format: {description}
- Discovery: {paths}

### Tool Names
| Claude Name | {Runtime} Name |
|-------------|----------------|
| Read        | {mapped}       |
| ...         | ...            |

### GSP Drift
{Any mismatches between docs and current installer behavior}

### Recent Changes
{New features or breaking changes since last GSP update}
```

### Concept comparison — cross-runtime table

```
## {Concept} Across Runtimes

| Aspect        | Claude    | OpenCode  | Gemini    | Codex     |
|---------------|-----------|-----------|-----------|-----------|
| File format   | ...       | ...       | ...       | ...       |
| Discovery     | ...       | ...       | ...       | ...       |
| Frontmatter   | ...       | ...       | ...       | ...       |
| ...           | ...       | ...       | ...       | ...       |
```

### Tool mapping

```
## Tool Name Mapping

| Claude (source) | OpenCode      | Gemini              | Codex       |
|-----------------|---------------|---------------------|-------------|
| Read            | Read          | read_file           | read        |
| Write           | Write         | write_file          | write       |
| Edit            | Edit          | replace             | edit        |
| Bash            | Bash          | run_shell_command   | shell       |
| Glob            | Glob          | glob                | glob        |
| Grep            | Grep          | search_file_content | grep        |
| WebSearch       | websearch     | google_web_search   | web_search  |
| WebFetch        | webfetch      | web_fetch           | web_fetch   |
| AskUserQuestion | question      | ask_user            | (prompt)    |
| SlashCommand    | skill         | (n/a)               | skill       |
| TodoWrite       | todowrite     | write_todos         | (n/a)       |
| Agent           | Agent         | agent               | (n/a)       |
```

### Drift report

```
## GSP Installer Drift Report

### {Runtime}
- OK: {what matches}
- DRIFT: {what's changed in docs but not in installer}
- NEW: {features docs describe that GSP doesn't handle yet}
```

## Step 4: Suggest actions

If drift or new features are found, suggest specific changes to `bin/install.js` with function names and line references.

## Important Notes

- **Always fetch live docs** — don't rely on cached knowledge, runtimes update frequently
- **Flag uncertainty** — if a doc page is unavailable, say so rather than guessing
- **Reference the installer** — every finding should connect back to what GSP does today
- **Be specific** — cite URLs, line numbers, function names
- **Skip unchanged** — if a runtime section has no drift, say "No drift detected" and move on

</process>
