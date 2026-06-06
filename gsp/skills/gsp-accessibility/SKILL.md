---
name: gsp-accessibility
description: Audit accessibility — contrast, tokens, screens, code, or compliance statement. Picks the right mode from project state when invoked with no flags — use when: is this accessible, check contrast, WCAG check, a11y audit, accessibility report, before we ship, accessibility statement
user-invocable: true
allowed-tools:
  - Read
  - Write
  - Bash
  - Agent
  - Glob
  - Grep
  - AskUserQuestion
---
<context>
Unified accessibility skill — every WCAG mode lives here. Merges the former `gsp-accessibility` (quick checks, token audit, pre-emit validate gate) and `gsp-accessibility-audit` (design audit, code audit, compliance statement) into one context-aware router.

Two consumption patterns:
1. **Standalone** — user runs `/gsp-accessibility` and the skill picks the right mode from project state, or runs an explicit `--mode`
2. **As a building block** — `gsp-brand-guidelines` calls `--validate` as a pre-emit gate; `gsp-project-critique` and `gsp-project-review` reuse the chunks this skill writes

Accessibility runs at multiple checkpoints in the pipeline (brand emit, post-design, post-build, pre-ship). The mode determines which checkpoint.
</context>

<objective>
Run the right accessibility check for the project's current state.

**Input:** Mode flag (or none — auto-pick) + optional arguments
**Output:** Display, chunk file, statement, or audit log depending on mode
**Agent:** `gsp-accessibility-auditor` (only in `--design` and `--code` modes)
</objective>

<rules>
- Always use `AskUserQuestion` for user interaction — never prompt via plain text
- One decision per question — never batch multiple questions in a single message
- Quick check mode (`--check`) and validate mode (`--validate`) never write chunk files
- `--validate` carries verdict via exit code; do not swallow exit 1
- Default conformance level is AA unless overridden by `--level AAA` or project config
- Foundation chunks follow `chunk-format.md` format
</rules>

<process>
## Step 1: Parse invocation

Read `$ARGUMENTS` to determine the mode:

| Input | Mode | Sibling | Agent? | Output |
|-------|------|---------|--------|--------|
| `--check #FG #BG` | Quick contrast | `modes/check.md` | No | Display only |
| `--validate <yml>` | Pre-emit WCAG gate | `modes/validate.md` | No | Stdout verdict + `<yml-dir>/wcag-validate.log` |
| `--tokens` | Brand token audit | `modes/tokens.md` | No | `critique/accessibility-token-audit.md` |
| `--design` | Design screen audit | `modes/design.md` | Yes | `critique/accessibility-audit.md` + fixes |
| `--code` | Codebase audit | `modes/code.md` | Yes | `review/accessibility-audit.md` + fixes |
| `--statement` | Compliance statement | `modes/statement.md` | No | `exports/accessibility-statement.md` |
| (no args) | Context-aware default | — | depends | depends |

Additional flag: `--level AAA` overrides conformance level (default: AA).

## Step 2: Context-aware default (no args)

When invoked with no mode flag, pick the right mode from project state:

1. **No `.design/projects/` and no yml path** → mode picker via `AskUserQuestion`:
   - "Quick contrast check (--check)"
   - "Audit a brand token file (--tokens)"
   - "Validate a brand yml (--validate)"
   - "Run a full audit on this project (resolves below)"
2. **Brand mid-emit (`gsp-brand-guidelines` is the caller)** → `--validate {yml}` (callers pass it explicitly; this clause is a safety net)
3. **Project exists with design phase complete and no `critique/accessibility-audit.md`** → `--design`
4. **Project exists with build phase complete and no `review/accessibility-audit.md`** → `--code`
5. **Project exists with both audits present** → offer `--statement`
6. **Project exists with neither phase complete** → tell user to complete a phase first; offer `--tokens` if a brand exists

Once the mode is resolved (explicit or auto-picked), continue to Step 3.

## Step 3: Route to mode

Load the matching sibling and follow its instructions:

- `${CLAUDE_SKILL_DIR}/modes/check.md`
- `${CLAUDE_SKILL_DIR}/modes/validate.md`
- `${CLAUDE_SKILL_DIR}/modes/tokens.md`
- `${CLAUDE_SKILL_DIR}/modes/design.md`
- `${CLAUDE_SKILL_DIR}/modes/code.md`
- `${CLAUDE_SKILL_DIR}/modes/statement.md`

Each mode file is self-contained: it resolves its own context (project, brand, conformance level), describes its checks, and specifies its output. Agent-spawning modes (`--design`, `--code`) also reference `${CLAUDE_SKILL_DIR}/wcag-checklist.md` and `${CLAUDE_SKILL_DIR}/methodology/gsp-accessibility-auditor.md`.

## Step 4: Update STATE.md (chunk-writing modes only)

After `--tokens`, `--design`, or `--code` finish, if running within a project and chunk files were written:
- Read `{PROJECT_PATH}/STATE.md`
- Note accessibility audit completion in the relevant phase section
- Do not change phase status — accessibility is a supplementary check across phases, not a phase itself

`--check`, `--validate`, and `--statement` do not update STATE.md (no chunk written, or output is final artifact not phase progress).
</process>
