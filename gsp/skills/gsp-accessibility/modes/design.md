# Mode: `--design` (default when project has completed design phase)

Full WCAG audit of design screen chunks. Spawns the `gsp-accessibility-auditor` agent. Loaded on demand by `gsp-accessibility/SKILL.md`.

## Resolve context

Resolve project from `.design/projects/` (one → use it, multiple → ask). Set `PROJECT_PATH`.

Read `{PROJECT_PATH}/config.json`:
- `accessibility_level` — override conformance level (if not set via `--level`)
- `implementation_target`

Read `{PROJECT_PATH}/brand.ref` to set `BRAND_PATH` = `.design/branding/{brand}`.

Determine conformance level:
1. `--level` flag (highest priority)
2. `accessibility_level` from config.json
3. Default: "WCAG 2.2 AA"

## Verify design chunks exist

Read `{PROJECT_PATH}/design/INDEX.md` to find screen chunks. If no design chunks, tell user to complete the design phase first and stop.

## Load references and agent methodology

Read these files and hold their content for inlining into the agent prompt:
- `${CLAUDE_SKILL_DIR}/wcag-checklist.md` — WCAG checklist reference
- `${CLAUDE_SKILL_DIR}/methodology/gsp-accessibility-auditor.md` — agent methodology

## Spawn agent

Spawn `gsp-accessibility-auditor` with:
- All design chunks from `{PROJECT_PATH}/design/`
- Brand identity context (color system, typography)
- Brand system context (tokens, components)
- Conformance level
- **Content of** WCAG checklist reference (loaded above)
- **Agent methodology** (loaded above)
- **Output path:** `{PROJECT_PATH}/critique/`
- **Instructions:** "Audit all design screens against {level}. Write `accessibility-audit.md` and `accessibility-fixes.md` to the output path."

## Completion

Display result:

```
  /gsp-accessibility --design — design audit complete
  ═══════════════════════════════════════

  {PROJECT_PATH}/critique/
  ├── accessibility-audit.md
  └── accessibility-fixes.md

  ─────────────────────────────────────
```

Use `AskUserQuestion`:
- **Run token audit** — "run `/gsp-accessibility --tokens` to check design token contrast pairs"
- **Continue to build** — "implement designs in the codebase"
- **View audit** — "read the accessibility report"
- **Done** — "that's all for now"
