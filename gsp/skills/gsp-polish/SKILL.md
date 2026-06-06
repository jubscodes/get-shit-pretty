---
name: gsp-polish
description: Detect and fix AI-slop craft failures in the codebase — scrolling text without fade mask, default chart palettes, lorem placeholders, missing empty states, hardcoded hex outside tokens. Auto-runs after build; user-invocable anytime.
user-invocable: true
allowed-tools:
  - Read
  - Write
  - Bash
  - Edit
  - Grep
  - Glob
  - Agent
  - AskUserQuestion
---
<context>
Polish phase. Sits between `gsp-project-build` (writes code) and `gsp-project-review` (QA against design). Polish reviews **craft**: the execution-level details that make an agent-built codebase feel "designed" vs "AI slop."

Operates on actual code, not on design specs. Pattern-matches against a curated library of mechanically-detectable anti-patterns. Each pattern is a self-contained file in `patterns/` describing symptom, detection rule, fix, and classification.

Two tiers of fix:
- **`safe-auto`** — fix is purely additive/reversible (e.g., add `mask-image` className). Applied automatically, wrapped in a git stash safety net + `tsc --noEmit` check; rolled back if either fails.
- **`propose-diff`** / **`flag-only`** — fix is contextual or requires human input. Surfaced in `polish/proposed-fixes.md` for review.

The skill does **not** overlap with:
- `gsp-accessibility` (WCAG concerns: focus, contrast, tap targets — any mode)
- `gsp-project-review` (QA against design intent)
- `gsp-typography` (font choices)
- `gsp-brand-guidelines` (token system)

If a pattern would catch something those skills own, it's been stripped from this library.
</context>

<objective>
Detect and fix craft-level failures in the codebase.

**Input:** Codebase (default scope: `git diff` since HEAD or last polish run) + project config + brand `STYLE.md`
**Output:** `{project}/polish/` (findings.md, applied-fixes.md, proposed-fixes.md, INDEX.md)
**Agent:** `gsp-polisher`
**Output volume:** Honor `skip-if-not-present` doctrine — omit any pattern that returned zero findings. If `preferences.project_size` exists in config, polish writes a single consolidated `polish/PHASE.md` for `compact`; emits the full file set for `full`; returns to chat for `chat`.
</objective>

<execution_context>
@${CLAUDE_SKILL_DIR}/patterns/INDEX.yml
</execution_context>

<rules>
- Always use `AskUserQuestion` for user interaction — never prompt via plain text.
- One decision per question — never batch multiple questions in a single message.
- Never auto-apply a `safe-auto` fix without wrapping in `scripts/polish-safety-wrap.sh` — git stash → apply → tsc check → commit or rollback.
- Never touch files outside the scope returned by `git diff` unless invoked with `--full`.
- Respect escape hatches: skip any element with `data-polish-ignore` attribute or preceded by a `{/* polish-ignore */}` comment.
- Respect brand overrides: each pattern declares which `STYLE.md` keys mute it (e.g., `constraints.never: ["soft-edges"]` mutes `mask-image-on-scrolling-text`).
- Auto-fix is opt-out via `--no-fix` flag — default is to apply safe-auto.
- Never modify `node_modules/`, `.next/`, `dist/`, `build/`, or any path matched in `.gitignore`.
</rules>

<process>
## Step 0: Parse invocation

| Input | Mode |
|-------|------|
| `/gsp-polish` (no args) | Default — scan `git diff`, apply safe-auto, propose review-required |
| `/gsp-polish --scan` | Scan only — produce findings.md, no fixes |
| `/gsp-polish --full` | Scan entire project (not just diff) |
| `/gsp-polish --scope <path>` | Limit scope to a directory or glob |
| `/gsp-polish --no-fix` | Scan + propose, never auto-apply |
| `/gsp-polish --pipeline` | Internal — invoked by `gsp-project-build` finalize |
| `/gsp-polish --list-patterns` | Display the pattern library and exit |

## Step 1: Resolve project context

Resolve project from `.design/projects/` (one → use it, multiple → ask). Set `PROJECT_PATH`.

Read `{PROJECT_PATH}/brand.ref` → set `BRAND_PATH`. If absent, polish runs without brand-override support (logs a warning, but proceeds).

Read `{PROJECT_PATH}/config.json` → get `preferences.project_size` (default `compact`).

Read `{BRAND_PATH}/patterns/STYLE.md` if present — extract `constraints`, `density`, `intensity` for brand-override evaluation.

## Step 2: Stack detection

Glob for `package.json` at project root. Read `dependencies` + `devDependencies`. Polish supports:

- React (`react`)
- Tailwind CSS (`tailwindcss`)
- Optional: shadcn/ui (detected by presence of `components/ui/` or `components.json`)
- Optional: Next.js (`next`)

If React + Tailwind are absent, output: *"Polish targets React + Tailwind codebases. Detected: {stack}. Skipping."* and exit clean.

## Step 3: Determine scope

```bash
SCOPE_FILES=$(git diff --name-only HEAD -- '*.tsx' '*.jsx' '*.ts' '*.js' '*.mdx' 2>/dev/null \
  | grep -v -E '(node_modules|\.next|dist|build|\.test\.|\.stories\.)' \
  | head -200)
```

For `--full`: replace with `find` over the entire project. For `--scope`: limit to the path. Cap at 200 files per run (perf guardrail).

If `SCOPE_FILES` is empty: output *"No relevant changes. Run /gsp-polish --full to scan the project."* and exit.

## Step 4: Spawn the polisher agent

Spawn `gsp-polisher` agent with this context:

- `SCOPE_FILES` — the file list to scan
- `PROJECT_PATH` — where to write `polish/` output
- `BRAND_OVERRIDES` — extracted from STYLE.md (or `{}` if no brand)
- `OUTPUT_MODE` — chat / compact / full
- `FIX_MODE` — auto-apply safe-auto, or `--no-fix` flag passed through
- `PATTERN_LIBRARY` — list of pattern files at `${CLAUDE_SKILL_DIR}/patterns/` (10 entries from INDEX.yml)

The agent reads each pattern file as needed. It does NOT load all 10 into context at once — it iterates and reads on demand.

## Step 5: Agent reports back

After the agent completes, read `polish/findings.md`. Summarize for the user:

```
  polish — {N} findings, {auto} auto-fixed, {prop} proposed, {flag} flagged

  ─── Auto-fixed ──────────────────
  ✓ mask-image-on-scrolling-text   3 sites in 2 files
  ✓ internal-a-not-link            1 site in 1 file

  ─── Proposed (review) ──────────
  ⚠ transition-all-everywhere     5 sites — see polish/proposed-fixes.md

  ─── Flagged (no auto-fix) ──────
  ! lorem-and-placeholder-copy    2 sites — copy needs human
  ! missing-empty-state           1 site — needs design

  next: review polish/proposed-fixes.md or run /gsp-project-build to apply.
```

If the safety wrap rolled back any auto-fix (tsc failure), it appears as flagged with `rollback-reason: tsc-error`.

## Step 6: Pipeline integration

When invoked with `--pipeline` flag (from `gsp-project-build` finalize), polish runs silently — no user prompts, all fixes auto-applied where classification permits, output written to `polish/`. Build's BUILD-LOG.md gets a single line: `Polish: {N} findings, {auto} applied`.

For other modes (manual user invocation), Step 5's summary is shown.
</process>

<patterns_library_summary>
| Pattern | Tier | Rationale |
|---|---|---|
| `mask-image-on-scrolling-text` | safe-auto | Pure className addition; reversible |
| `default-recharts-palette` | safe-auto | Token swap, only fires if chart tokens defined in globals.css |
| `mobile-text-no-clamp` | safe-auto | Adds `text-balance` + responsive ramp |
| `internal-a-not-link` | safe-auto | Mechanical `<a>` → `<Link>` rewrite for internal hrefs |
| `image-fill-no-relative-parent` | safe-auto | Adds `relative` to parent + `aspect-*` ratio |
| `transition-all-everywhere` | propose-diff | Target property is contextual |
| `lorem-and-placeholder-copy` | flag-only | Copy needs human |
| `generic-loading-text` | flag-only | Skeleton shape is contextual |
| `missing-empty-state` | flag-only | Copy + design needed |
| `raw-hex-colors-outside-tokens` | flag-only | Slop tell; token swap may ripple |
</patterns_library_summary>
