# Authoring GSP skills

## Agent input inlining rule

**Skills must inline all content when spawning agents.** The skill reads input files during validation/context steps — pass that content directly in the agent prompt. Never pass file paths and expect the agent to re-read them. Each agent `Read` turn costs 18–35s.

Pattern in the spawn instruction: `- **Content of** {file} (loaded in Step N)`.

**Exceptions** — agents that legitimately read from disk:
- `gsp-project-builder` (screen agents) — reads live codebase foundations
- `gsp-project-reviewer` — Grep/Glob on actual source files
- `gsp-accessibility-auditor` (code mode) — Grep/Glob on source files

## Context optimization rules

Enforced by audit tests C12, I19.

**Model selection is the user's choice.** Skills do not declare `model:` or `effort:` in frontmatter. Pipeline creative/technical skills hint in their `description:` (e.g., "benefits from capable models"). The installer strips `model:`/`effort:` for non-Claude runtimes.

**Context fork for pure dispatchers.** Pipeline skills with zero interactive steps (no `AskUserQuestion` before agent spawn) must use `context: fork` in frontmatter. Currently forked: `project-design`, `project-critique`, `project-review`. Never fork skills with interactive steps — test C12 enforces this.

**Double-dispatch is intentional.** Forked skills use the `Agent` tool inside the fork to spawn executors. Do NOT collapse this with the `agent:` frontmatter field. The fork isolates the orchestrator; the `Agent` tool gives the executor a clean start.

**Execution context is for orchestrator-consumed content only.** Reference files the orchestrator only passes through to agents must NOT be in `<execution_context>`. Add a "Load references" step before the spawn that reads them from disk.

**Templates loaded at write time.** Skills that write artifacts from templates must read templates at the point of writing, not in `execution_context`. Pattern: `Read templates from ${CLAUDE_SKILL_DIR}/../../templates/{path}/ and write artifacts`.

**SubagentStop hooks for all chunk-producing agents.** Every agent that writes deliverable chunks needs a `SubagentStop` hook in `gsp/hooks/hooks.json` verifying expected outputs exist. Covered: `gsp-project-designer`, `gsp-project-critic`, `gsp-brand-creative-director`, `gsp-brand-engineer`, `gsp-project-builder`, `gsp-project-reviewer`.

**Filesystem is the integration layer.** Phases consume prior-phase output from disk (`.design/`), never from conversation context. Forked phases write STATE.md and artifact files to disk.
