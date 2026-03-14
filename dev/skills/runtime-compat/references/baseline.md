# Runtime Documentation Baseline

Last verified: 2026-03-13

This file captures the known-good state of each runtime's extension system. The skill fetches live docs and compares against this baseline to detect drift.

## Documentation URLs

### Claude Code (source of truth)
- Skills: https://code.claude.com/docs/en/skills
- Subagents: https://code.claude.com/docs/en/sub-agents
- Plugins: https://code.claude.com/docs/en/plugins
- Hooks: https://code.claude.com/docs/en/hooks
- Permissions: https://code.claude.com/docs/en/permissions
- Full index: https://code.claude.com/docs/llms.txt

### OpenCode
- Skills: https://opencode.ai/docs/skills/
- Agents: https://opencode.ai/docs/agents/
- Commands: https://opencode.ai/docs/commands/
- Rules: https://opencode.ai/docs/rules/
- CLI: https://opencode.ai/docs/cli/

### Gemini CLI
- Skills: https://geminicli.com/docs/cli/skills/
- Creating Skills: https://geminicli.com/docs/cli/creating-skills/
- Skills Tutorial: https://geminicli.com/docs/cli/tutorials/skills-getting-started/
- Subagents: https://geminicli.com/docs/core/subagents/
- Extensions: https://geminicli.com/docs/extensions/
- Writing Extensions: https://geminicli.com/docs/extensions/writing-extensions/

### Codex CLI
- Skills: https://developers.openai.com/codex/skills
- Main docs: https://developers.openai.com/codex

## Discovery Paths (verified)

### Claude Code
| Scope      | Path                                     |
|------------|------------------------------------------|
| Enterprise | Managed settings (org-wide)              |
| Personal   | `~/.claude/skills/<name>/SKILL.md`       |
| Project    | `.claude/skills/<name>/SKILL.md`         |
| Plugin     | `<plugin>/skills/<name>/SKILL.md`        |
| Commands   | `.claude/commands/<ns>/<name>.md`        |
| Agents     | `.claude/agents/<name>.md`               |

Precedence: enterprise > personal > project. Skills > commands when names collide.
Nested discovery: `.claude/skills/` in subdirectories (monorepo support).
Additional dirs via `--add-dir` are also scanned.

### OpenCode
| Scope    | Path                                        |
|----------|---------------------------------------------|
| Global   | `~/.config/opencode/skills/<name>/SKILL.md` |
| Project  | `.opencode/skills/<name>/SKILL.md`          |
| Commands | `.opencode/commands/<name>.md`              |
| Agents   | `.opencode/agents/<name>.md`                |

Also scans: `~/.claude/skills/`, `~/.agents/skills/`, `.claude/skills/`, `.agents/skills/`

### Gemini CLI
| Scope     | Path                                  |
|-----------|---------------------------------------|
| User      | `~/.gemini/skills/<name>/SKILL.md`    |
| Workspace | `.gemini/skills/<name>/SKILL.md`      |
| Extension | Via extension packaging               |
| Commands  | `.gemini/commands/<ns>/<name>.toml`   |
| Agents    | `.gemini/agents/<name>.md`            |

Also scans: `~/.agents/skills/` alias.
Precedence: Workspace > User > Extension.

### Codex CLI
| Scope  | Path                                   |
|--------|----------------------------------------|
| REPO   | `.agents/skills/<name>/SKILL.md` (cwd) |
| REPO   | `../.agents/skills/` (parent)          |
| REPO   | `$REPO_ROOT/.agents/skills/`           |
| USER   | `~/.agents/skills/<name>/SKILL.md`     |
| ADMIN  | `/etc/codex/skills/<name>/SKILL.md`    |
| SYSTEM | Bundled skills                         |
| Config | `~/.codex/` (config.toml, bundles)     |

Skills ONLY at `.agents/skills/`, NOT `.codex/skills/`.
Config/bundles at `.codex/`.

## Skill Frontmatter Fields

### Claude Code (superset — source format)
| Field                      | Type    | Default | Notes                                    |
|----------------------------|---------|---------|------------------------------------------|
| name                       | string  | dirname | Lowercase, hyphens, max 64 chars         |
| description                | string  | —       | Used for auto-invocation matching         |
| argument-hint              | string  | —       | Shown in autocomplete                     |
| disable-model-invocation   | boolean | false   | true = user-only invocation               |
| user-invocable             | boolean | true    | false = hidden from / menu                |
| allowed-tools              | list    | —       | Tool allowlist when skill is active       |
| model                      | string  | —       | Model override                            |
| context                    | string  | —       | "fork" for subagent execution             |
| agent                      | string  | —       | Subagent type when context: fork          |
| hooks                      | object  | —       | Skill-scoped hooks                        |

### OpenCode (converted from Claude)
| Field       | Type    | Notes                                     |
|-------------|---------|-------------------------------------------|
| name        | string  | Prefixed with gsp- to avoid collisions    |
| description | string  | Kept as-is                                |
| tools       | map     | Boolean map: `{ tool_name: true }`        |

Dropped: disable-model-invocation, user-invocable, context, agent, hooks, allowed-tools (converted to tools map)

### Gemini CLI (converted from Claude)
| Field       | Type    | Notes                                     |
|-------------|---------|-------------------------------------------|
| name        | string  | Kept as-is                                |
| description | string  | Kept as-is                                |

Dropped: allowed-tools, disable-model-invocation, user-invocable, context, agent, hooks
Variable escaping: `${VAR}` → `$VAR`

### Codex CLI (converted from Claude)
| Field       | Type    | Notes                                              |
|-------------|---------|-----------------------------------------------------|
| name        | string  | Kept as-is                                          |
| description | string  | Scope boundaries for implicit invocation matching   |

Optional `agents/openai.yaml` for UI metadata (interface, policy, dependencies).
Dropped: all Claude-specific fields

## Agent Frontmatter Fields

### Claude Code (source)
| Field            | Type    | Notes                              |
|------------------|---------|------------------------------------|
| name             | string  | Agent identifier                   |
| description      | string  | When to spawn this agent           |
| allowed-tools    | list    | Tool allowlist                     |
| disallowed-tools | list    | Tool denylist                      |
| maxTurns         | number  | Max conversation turns             |
| model            | string  | Model override (sonnet, opus, etc) |
| color            | string  | Terminal color name                 |
| permissionMode   | string  | Permission level                   |
| user-invocable   | boolean | Can user invoke directly           |

### OpenCode (converted)
| Field       | Type    | Claude equivalent      |
|-------------|---------|------------------------|
| name        | string  | name                   |
| description | string  | description            |
| steps       | number  | maxTurns               |
| color       | string  | color (name → hex)     |
| tools       | map     | allowed-tools → bools  |

### Gemini CLI (converted, experimental)
| Field      | Type    | Claude equivalent      |
|------------|---------|------------------------|
| name       | string  | name                   |
| description| string  | description            |
| max_turns  | number  | maxTurns               |
| tools      | array   | allowed-tools (mapped) |

Requires: `experimental.enableAgents: true` in settings.json
Drops: disallowedTools, color, permissionMode

### Codex CLI
No agent file support. Agents are not installed.

## Tool Name Mapping

| Claude (source)  | OpenCode       | Gemini               | Codex       |
|-------------------|----------------|----------------------|-------------|
| Read              | Read           | read_file            | read        |
| Write             | Write          | write_file           | write       |
| Edit              | Edit           | replace              | edit        |
| Bash              | Bash           | run_shell_command    | shell       |
| Glob              | Glob           | glob                 | glob        |
| Grep              | Grep           | search_file_content  | grep        |
| WebSearch         | websearch      | google_web_search    | web_search  |
| WebFetch          | webfetch       | web_fetch            | web_fetch   |
| AskUserQuestion   | question       | ask_user             | (prompt)    |
| SlashCommand      | skill          | (n/a)                | skill       |
| TodoWrite         | todowrite      | write_todos          | (n/a)       |
| Agent             | Agent          | agent                | (n/a)       |
| NotebookEdit      | NotebookEdit   | (n/a)                | (n/a)       |

## Body-Level Replacements

| Pattern             | Claude        | OpenCode               | Gemini          | Codex         |
|---------------------|---------------|------------------------|-----------------|---------------|
| Command invocation  | `/gsp:`       | `/gsp-`                | `/gsp:`         | `$gsp-`       |
| Config path (global)| `~/.claude/`  | `~/.config/opencode/`  | `~/.gemini/`    | `~/.codex/`   |
| SKILL_DIR variable  | `${CLAUDE_SKILL_DIR}` | `${SKILL_DIR}` | `.`             | `.`           |
| Variable escaping   | literal       | literal                | `$VAR` (no `{}`)| literal      |

## Key Installer Functions

Reference for `bin/install.js`:

| Function                          | Purpose                                    |
|-----------------------------------|--------------------------------------------|
| `getCodexSkillsDir(isGlobal)`     | Returns `.agents/skills/` path for Codex   |
| `convertClaudeToOpencodeAgent()`  | Agent format conversion                    |
| `convertClaudeToOpencodeCommand()`| Flatten + convert commands                 |
| `convertClaudeSkillToOpencode()`  | Skill frontmatter conversion               |
| `convertClaudeToGeminiAgent()`    | Agent format conversion                    |
| `convertClaudeToGeminiToml()`     | Command → TOML conversion                  |
| `convertClaudeSkillToGemini()`    | Skill frontmatter conversion               |
| `convertClaudeCommandToCodexSkill()` | Command → Codex skill conversion        |
| `convertClaudeSkillToCodex()`     | Skill frontmatter conversion               |
| `applyOpencodeBodyReplacements()` | Body-level path/syntax replacements        |
| `applyGeminiBodyReplacements()`   | Body-level path/syntax replacements        |
| `applyCodexBodyReplacements()`    | Body-level path/syntax replacements        |
| `copyFlattenedCommands()`         | OpenCode flattened command copy            |
| `copyOpencodeSkills()`            | OpenCode skill copy from source            |
| `copyCodexSkillsFromCommands()`   | Codex: commands → skills                   |
| `copyCodexSkillsFromSource()`     | Codex: source skills → .agents/skills/     |
| `copyGeminiSkills()`              | Gemini skill copy                          |
