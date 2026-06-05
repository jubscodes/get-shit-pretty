# Authoring GSP agents

Agent source of truth: `gsp/agents/gsp-{name}.md`. Never edit `.claude/agents/` directly — those are symlinks.

## Lean stub convention

Agent `.md` files contain frontmatter (tools, model, hooks) + a one-line body. **No full methodology in the stub** — it lives in `gsp/skills/{spawning-skill}/methodology/gsp-{agent}.md` and is read by the skill at spawn time.

This keeps session-start cost minimal: ~130L for all 12 agent stubs vs. ~1,500L if methodology were inline. Every conversation pays the session-start cost.

## Dynamic output paths

Agent output paths must be dynamic: `"path provided by the skill that spawned you"`. No hardcoded `.design/` paths. This lets skills target arbitrary working directories.
