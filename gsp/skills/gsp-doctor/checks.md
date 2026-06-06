# Doctor check catalog

Detailed check definitions loaded on demand by `gsp-doctor/SKILL.md` Step 3. Each check below describes what it catches, how it runs, and the verdict thresholds. Run only the check sets applicable to the detected structure (B for brands, P for projects, I and S for installation health, X for cross-instance).

## Per-Brand Checks (4-phase)

**Check B1: Brand Structure**
Required: config.json, STATE.md, BRIEF.md
Required dirs: discover/, strategy/, identity/, patterns/
Missing → FAIL

**Check B2: Brand Phase Ordering**
No phase complete if earlier phase is pending (discover < strategy < identity < patterns).
Exception: strategy can proceed without discover.

**Check B3: Brand Completeness**
If all 4 phases complete, check:
- `identity/INDEX.md` exists (chunk format)
- `identity/palettes.json` exists (WARN if missing)
- `patterns/INDEX.md` exists (chunk format)
- `patterns/*.yml` preset exists (WARN if missing)
- If monolith exists without INDEX.md → WARN: "Legacy monolith format"

**Check B4: Legacy Monolith Detection**
For each brand phase directory (discover, strategy, identity, patterns):
- If monolith exists but no INDEX.md → WARN: "Monolith files are no longer supported in GSP v0.6.0+. Re-run `/gsp-brand-{phase}` to generate chunk output."

## Per-Project Checks (6-phase)

**Check P1: Project Structure**

**What it catches:** Missing core files, incomplete setup.

Required: config.json, STATE.md, BRIEF.md, brand.ref
Required dirs: brief/, research/, design/, critique/, build/, review/

Check each exists:
- All present → PASS
- Core files missing → FAIL: list which are missing, suggest `/gsp-start`

**Monorepo app_path check:**
- If `repo_type` is `monorepo` (in config.json) and `app_path` is empty → WARN: "Project has no `app_path` set. Run `/gsp-project-brief` to assign a target app."

**Design system check:**
- If `.design/system/` directory exists, verify at least `STACK.md` is present → PASS
- If `.design/system/` is missing and codebase is not greenfield → WARN: "Design system scan missing. Run `/gsp-design-system` to scan."
- If old project-scoped `codebase/INVENTORY.md` exists → WARN: "Legacy INVENTORY.md found. Run `/gsp-design-system` to migrate to workspace-level design system docs."

Legacy detection: if system/, screens/, specs/, plan/ dirs exist → WARN: "Legacy structure detected — project uses old phase layout"

**Check P2: Brand Reference**
Read brand.ref → check brand exists in `.design/branding/{name}/`
Check brand system is complete (system phase = complete)
WARN if brand referenced but system not complete

**Check P3: Brand Drift**
Read `identity_hash` from brand.ref
If brand identity/IDENTITY.md exists, compute current hash (first 8 chars of md5)
If hashes differ → WARN: "Brand identity has changed since project consumed it. Consider re-running `/gsp-project-brief`."
If identity_hash is "pending" → INFO: "Brand identity wasn't complete when project was created."

**Check P4: Phase Ordering**

**What it catches:** Phases completed out of order, skipped prerequisites.

Read STATE.md phase table. Check ordering rules:
brief < research < design < critique < build < review

1. No phase should be `complete` if an earlier required phase is still `pending` (not `skipped` or `complete`)
2. Valid skip scenarios (not violations):
   - design skipped when `design_scope` is `tokens`
   - research can proceed without brief
3. build complete but critique pending → WARN: "Build completed without critique. Run `/gsp-project-critique` to audit."
4. Any other out-of-order completion → FAIL with specifics

All phases in order (or validly skipped) → PASS

**Check P5: Stale Outputs**

**What it catches:** Output content that doesn't match current config expectations.

Only check phases that are `complete`. All paths relative to the project instance directory.

**When `system_strategy` is `extend`:**
- Check if brand's `patterns/` output contains "Component Audit" or "KEEP" or "RESTYLE" or "REFACTOR" or "REPLACE"
- If none found → WARN: "Strategy is `extend` but system output lacks component audit table. Re-run `/gsp-brand-guidelines`."

**When `implementation_target` is `shadcn`:**
- If brief phase is complete, check brief/ output for "shadcn" or "npx shadcn"
- If not found → WARN: "Target is `shadcn` but brief doesn't reference shadcn components."

**When `implementation_target` is `rn-reusables`:**
- If brief phase is complete, check brief/ output for "reusables" or "NativeWind"
- If not found → WARN: "Target is `rn-reusables` but brief doesn't reference RN Reusables."

**When `design_scope` is `tokens`:**
- design phase should be `skipped`, not `complete`
- If `complete` → WARN: "Scope is `tokens` but design phase ran as full. Outputs may be unnecessary."

No stale outputs detected → PASS

**Check P6: Config Drift**

**What it catches:** Config says one thing, outputs reflect another.

**Check `system_strategy` alignment:**
- Config says `extend` but brand system output contains "## Components" with 30+ component specs (no audit table) → WARN: "Config says `extend` but system looks like a full `generate`. Config may be out of sync."
- Config says `generate` but brand system output contains "Component Audit" → WARN: "Config says `generate` but system contains extend-style audit."

**Check `codebase_type` alignment:**
- Config says `existing` or `boilerplate` but no `.design/system/STACK.md` → WARN (already caught by P1, don't double-count)
- Config says `greenfield` but `.design/system/STACK.md` exists → INFO: "Config says `greenfield` but design system docs exist. Not an issue, but config may be stale."

**Check `design_scope` alignment:**
- Config says `tokens` but design/ has full screen designs → WARN: "Scope is `tokens` but design/ has full screen designs."
- Config says `partial` — check BRIEF.md for "Target screens" section. If missing → WARN: "Scope is `partial` but BRIEF.md doesn't specify target screens."

No drift detected → PASS

**Check P7: Missing Chunks**

**What it catches:** Chunk directories missing, INDEX.md references broken.

For each completed project phase (brief, research, design, critique, build, review):
- Check for `{phase}/INDEX.md` — if missing → WARN: "Phase {phase} is complete but has no INDEX.md. Re-run `/gsp-{command}` to generate chunks."

**If exports/INDEX.md exists, check for broken references:**
- Read INDEX.md, extract all file paths from markdown links
- Check each referenced file exists

Broken INDEX.md references → WARN: list broken paths
INDEX.md has unpopulated BEGIN/END sections for completed phases → WARN: "INDEX.md has empty sections for completed phases."

No chunks expected yet (no phases complete) → PASS
All chunks present and references valid → PASS

Legacy path detection: if `screens/` exists instead of `design/` → WARN

**Check P8: Broken References**

**What it catches:** Cross-file references that point to non-existent content.

**design/ → brand system:**
If both exist, extract component names referenced in design chunks (look for patterns like "Uses: {ComponentName}" or component references). Check each exists in the brand's system output.

Components referenced in designs but not in system → WARN: "Design references components not defined in brand system: {list}. Re-run `/gsp-brand-guidelines` to add them, or update designs."

**critique/ → design/:**
If both exist, extract screen references from critique chunks. Check each referenced screen exists in design/.

Screens referenced in critique but not in designs → WARN: "Critique references screens not in design/: {list}."

No broken references → PASS

**Check P9: Review Status**

**What it catches:** Stuck review loops, unaddressed critical issues.

Read STATE.md review loop table:
- Count review iterations
- If > 3 iterations → WARN: "Review has looped {N} times. Consider addressing root causes or accepting current state."

If critique phase status is `needs-revision`:
- Check if any later phase (build, review) is `complete` → FAIL: "Build/Review completed while critique still needs revision."

If critique/ contains chunks with "Critical" severity items:
- If critique phase status is `complete` (not `needs-revision`) → INFO: "Critique has critical items but phase is marked complete. Verify issues were addressed."

No review issues → PASS

**Check P10: Upgrade Detection**

**What it catches:** Project created with older GSP version, missing features now available.

**Config version check:**
- If `version` field exists in config.json, note it
- If version is older than current (0.5.0) → WARN: "Config version is {version}, current GSP is 0.5.0. Some features may not be active."
- If no `version` field → INFO: "Config has no version stamp. Project may predate versioned configs."

**Chunk format check:**
- If any phase is complete but has no INDEX.md and no chunk files → WARN: "Project may predate chunked exports. Consider re-running phases to get chunked output."

**palettes.json check:**
- If brand's identity phase is complete, check for `identity/palettes.json`
- If missing → INFO: "No tints.dev palettes found. Re-run `/gsp-brand-identity` to generate OKLCH color palettes."

No upgrade concerns → PASS

## Installation Health Checks

**Check I1: Skills have `user-invocable: true`**
Glob for all SKILL.md files in the skills directory (`{runtime-dir}/skills/*/SKILL.md` — e.g. `.claude/skills/` for Claude Code, `.opencode/skills/` for OpenCode, `.gemini/skills/` for Gemini). For each skill (except the entry point `get-shit-pretty`), check frontmatter for `user-invocable: true`.
- All present → PASS
- Missing → WARN: "Skills missing `user-invocable: true`: {list}. They won't appear in the slash-command menu. Re-run the installer or add the field manually."

**Check I2: Skill directories are complete (not just SKILL.md)**
For each gsp-* skill directory, check if `SKILL.md` references sibling files via `${CLAUDE_SKILL_DIR}/` paths (e.g. `styles/INDEX.yml`). If it does, verify those files/dirs exist in the installed skill directory.
- All referenced siblings present → PASS
- Missing siblings → FAIL: "Skill {name} references {path} but it's missing. Re-run the installer: `pnpm dlx get-shit-pretty` (or `bunx get-shit-pretty`)"

**Check I3: Bundle directories accessible**
Check that the runtime bundle directories exist (`{runtime-dir}/templates/`, `{runtime-dir}/references/`). Skills reference these via `${CLAUDE_SKILL_DIR}/../../`.
- All present → PASS
- Missing → FAIL: "Bundle directory {dir} missing. Re-run the installer: `pnpm dlx get-shit-pretty` (or `bunx get-shit-pretty`)"

**Check I4: VERSION file present**
Check `{runtime-dir}/VERSION` exists and contains a valid semver string.
- Present and valid → PASS (show version)
- Missing → WARN: "VERSION file missing. Re-run the installer."
- Mismatched with source → INFO: "Installed version {installed} differs from source {source}."

**Check I5: No duplicate skills (stale global install)**
Check if `~/.claude/skills/` contains `gsp-*` directories when running from a local install. These cause duplicates between global and local.
- Run: `ls ~/.claude/skills/ | grep '^gsp-'`
- No matches → PASS
- Matches found → FAIL: "Found {N} stale GSP skills in ~/.claude/skills/. Fix: run `pnpm dlx get-shit-pretty --claude --local` (or `bunx get-shit-pretty --claude --local`) to reinstall (the installer cleans stale globals automatically), or manually remove: `rm -rf ~/.claude/skills/gsp-*`"

## Stack Compliance Checks (shadcn targets)

Only run these checks when `.design/system/STACK.md` exists and at least one project has `implementation_target: shadcn`.

> **Monorepo note:** For monorepos, each project's S-checks run in its declared `app_path`. Read `config.json` → `preferences.app_path` before running commands. If `app_path` is empty, run in repo root.

**Check S1: Alias drift**

Read `config.json` → `preferences.app_path`. Set `APP_PATH` (default `.` if empty).

Run `cd {APP_PATH} && npx shadcn@latest info --json` and extract `aliases.components`. Compare to `## Key Paths → Components` in STACK.md.

If mismatch → FAIL: "shadcn alias drift — STACK.md declares `{declared}` but live config has `{live}`. Imports will break. Fix by updating `components.json` or `STACK.md`."

**Check S2: Tailwind version drift**

Run `cd {APP_PATH} && node -e "console.log(require('tailwindcss/package.json').version)"`. Compare major version to `## Tech Stack → Styling` in STACK.md.

If major version differs → FAIL: "Tailwind version drift — STACK.md declares `{declared}` but `{live}` is installed. Run `/gsp-scaffold` to realign or update STACK.md."

**Check S3: Icon library drift**

Read `components.json` → `iconLibrary`. Compare to icon library recorded in STACK.md (if present).

If mismatch → WARN: "Icon library drift — STACK.md declares `{declared}` but `components.json` says `{live}`. Agents may import from the wrong package."

**Check S4: Token presence in globals.css**

Find the global CSS file (from `cd {APP_PATH} && npx shadcn@latest info --json` → `tailwindCssFile`, or glob for `globals.css` inside `APP_PATH`). Check it contains `--background`, `--foreground`, `--primary` CSS custom properties.

If missing → WARN: "CSS custom properties not found in `{file}`. Token integration may be incomplete. Run `/gsp-project-build` foundations phase to regenerate."

**Check S5: Tailwind v4 source scoping (if Tailwind v4)**

If Tailwind v4 detected, check `globals.css` for `@import "tailwindcss"`. If present without `source(...)` modifier, and the repo contains non-source directories with Tailwind class names (like `.design/`) → WARN: "Tailwind v4 source not scoped. Add `source(\"../\")` to avoid scanning `.design/` spec files."

All S checks pass → single PASS line: "S1-S5. Stack compliance .......... PASS"

## Cross-Instance

**Check X1: Multiple projects, same brand**
If multiple projects reference the same brand, and brand has changed since any project consumed it → WARN with list of affected projects.
