# Working in `gsp/`

This directory is the source of truth for all GSP skills, agents, hooks, prompts, and templates. The installer (`bin/install.js`) copies/symlinks from here into runtime dirs (`.claude/`, `.opencode/`, `.gemini/`, `.agents/`, `.codex/`). **Edit here, never in runtime dirs.**

## Claude Code context cost model

What loads when — critical for keeping sessions lean.

**Session start (always loaded):**
- `.claude/agents/*.md` — agent stubs (frontmatter + one-line body, ~130L total)
- Skill `description:` lines (negligible)
- Top-level `CLAUDE.md` + nested `CLAUDE.md` for the working subtree
- User-level `~/.claude/CLAUDE.md`

**Skill invocation (on demand):**
- Full `SKILL.md` body
- `@`-references in `<execution_context>` (resolved & inlined at invocation)
- Sibling files (`domains/`, `references/`, `methodology/`) — inert until explicitly `Read`

**Agent spawn (on demand):**
- Agent stub already in context from session start
- Methodology loaded by the spawning skill from `methodology/gsp-{agent}.md`
- Agent gets its own context window

**Implications:**
- `gsp/references/` is empty — references live colocated with the owning skill
- Agent stubs are lean (~12L each); methodology lives in skills
- Skill sibling files are free until used — exploit this for large reference material
- Cross-skill references use `${CLAUDE_SKILL_DIR}/../gsp-other-skill/ref.md`

## Reference colocation rule

Reference files live inside the skill directory that is their primary consumer, not in a shared `references/`. Ensures (1) zero session-start cost, (2) self-contained skills, (3) references load only when consuming skill runs.

- **Single-owner references** → primary skill's directory
- **Shared references** (2–4 consumers) → primary consumer's directory; others read via `${CLAUDE_SKILL_DIR}/../gsp-primary/ref.md`
- **Ubiquitous references** (5+ consumers, e.g. `chunk-format.md`) → duplicated into each consumer (disk cost, but every skill works standalone on all runtimes)
