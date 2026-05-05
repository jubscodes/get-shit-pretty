# Agent Rules (foundations + components + screens)

Common guardrails for `gsp-project-builder` agent spawns. Each spawn references this file once instead of repeating the rules inline. Mode-specific instructions are in the spawn block (foundations / component / screen).

## Universal rules (all modes)

- **Write code directly to the codebase** — not to `.design/`
- **Leave changes unstaged** — orchestrator handles commits
- **Do NOT write to BUILD-LOG.md directly** — orchestrator merges per-agent logs after each phase. Each agent writes to `{PROJECT_PATH}/build/logs/{phase}-{name}.md`
- For component/screen modes, also write `{PROJECT_PATH}/build/status/{phase}-{name}.json` with `{"status": "complete", "timestamp": "{ISO}"}` for resume support

## Mode-specific guardrails

### foundations
- Verify brand tokens are already installed in `globals.css` (orchestrator gates this; tokens MUST be present before agent runs)
- If tokens missing, abort with error pointing at `/gsp-brand-apply {brand-name}`. Do NOT manually paste tokens
- Build root layout shells, shared utilities, theme providers ONLY
- Do NOT build individual screens or page content

### component
- Read foundations from codebase (tokens, utilities already exist)
- Do NOT modify foundation files (global CSS, layout, tokens, theme provider)
- Do NOT build screens or page content
- Library-default → install via CLI as-is
- Library-customize → install + apply STYLE.md overrides (radius, shadow, color tokens)
- Custom → create from scratch following brand patterns

### screen
- Read foundations + components from codebase
- Do NOT modify foundation files
- Do NOT modify shared component files (built in Phase 4)
- Build the screen's route page + screen-specific components only

## When in doubt

STYLE.md takes precedence over all defaults. If the preset explicitly defines a technique, implement it. The methodology file (`methodology/gsp-project-builder.md`) has the full domain-rule pointers (color, typography, accessibility, imagery, anti-patterns).
