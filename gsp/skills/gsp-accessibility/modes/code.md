# Mode: `--code` (default when project has completed build phase)

Full WCAG audit of the codebase — ARIA, keyboard, semantic HTML, heading hierarchy, alt text, lang attributes, skip-nav, focus management. Spawns the `gsp-accessibility-auditor` agent. Loaded on demand by `gsp-accessibility/SKILL.md`.

## Resolve context

Resolve project from `.design/projects/` (one → use it, multiple → ask). Set `PROJECT_PATH`.

Read `{PROJECT_PATH}/config.json`:
- `accessibility_level` — override conformance level (if not set via `--level`)
- `implementation_target` — needed for code scope

Determine conformance level:
1. `--level` flag (highest priority)
2. `accessibility_level` from config.json
3. Default: "WCAG 2.2 AA"

## Determine codebase scope

- If build phase completed, read `{PROJECT_PATH}/build/BUILD-LOG.md` for file paths
- Otherwise, use `implementation_target` to determine where to look

## Load references and agent methodology

Read these files and hold their content for inlining into the agent prompt:
- `${CLAUDE_SKILL_DIR}/wcag-checklist.md` — WCAG checklist reference
- `${CLAUDE_SKILL_DIR}/methodology/gsp-accessibility-auditor.md` — agent methodology

## Spawn agent

Spawn `gsp-accessibility-auditor` with:
- Codebase paths to audit
- Brand system tokens (for contrast verification against hardcoded values)
- Conformance level
- **Content of** WCAG checklist reference (loaded above)
- **Agent methodology** (loaded above)
- **Output path:** `{PROJECT_PATH}/review/`
- **Instructions:** "Code audit mode. Use Grep and Glob to find accessibility issues in the codebase. Check ARIA, keyboard handlers, semantic HTML, heading hierarchy, alt text, lang attributes, skip-nav, focus management. Write `accessibility-audit.md` and `accessibility-fixes.md` to the output path with actual file paths and line numbers."

## Completion

Display result:

```
  /gsp-accessibility --code — code audit complete
  ═══════════════════════════════════════

  {PROJECT_PATH}/review/
  ├── accessibility-audit.md
  └── accessibility-fixes.md

  ─────────────────────────────────────
```

Use `AskUserQuestion`:
- **Fix issues** — "address the accessibility issues found"
- **Generate statement** — "create an accessibility statement"
- **View audit** — "read the code accessibility report"
- **Done** — "that's all for now"
