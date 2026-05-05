---
name: gspdev-eval-changes
description: Quality eval for skill/agent/methodology changes — spawns parallel evaluator agents that compare before/after against the parent SKILL.md using a fixed 6-dimension rubric. Use before merging non-trivial trims, refactors, or rewrites of files under `gsp/skills/` or `gsp/agents/`.
user-invocable: true
allowed-tools:
  - Read
  - Bash
  - Glob
  - Grep
  - Agent
  - AskUserQuestion
  - Edit
argument-hint: "[<commit-range>] default: main..HEAD + uncommitted"
---
<context>
GSP dev tool. After non-trivial changes to skill, agent, or methodology files, this skill verifies the change preserved substance — not just syntax. Catches lost rules, dropped output specs, vague rubric anchors, redundant prose recovered as essential signal, etc.

Spawns one general-purpose evaluator agent per modified file in parallel. Each evaluator compares BEFORE (git history) and AFTER (working tree) against the parent SKILL.md using a fixed 6-dimension rubric, returns PASS / CONCERNS / FAIL with quoted findings and surgical recommendations.

Different from siblings:
- `/gspdev-audit` — static checks across the whole repo (contracts, installer, version sync). Read-only, no eval.
- `/gspdev-housekeeping` — drift detection (count mismatches, stale references). Mechanical.
- `/gspdev-prompt-audit` — semantic analysis of all skill prompts (dead weight, contradictions). Whole-repo, slow.

This skill is targeted: it evaluates the quality of a *specific change* before it merges.
</context>

<objective>
Verify quality preservation after non-trivial changes to skill, agent, or methodology files.

**Input:** Optional commit range (default: `main..HEAD` + uncommitted)
**Output:** Aggregated verdict table + per-file findings; optional inline restoration of CONCERNS-flagged content
**Agent:** general-purpose (one per evaluated file, dispatched in parallel)
</objective>

<rules>
- Always use `AskUserQuestion` for user interaction
- Never modify files without explicit confirmation
- Skip files smaller than 30 lines unless they are SKILL.md (too small to need eval)
- Skip pure additions (BEFORE empty or new file) — eval is for trims/refactors
- All evaluator Agent calls must be dispatched in a single message for parallel execution
</rules>

<process>

## Step 0: Resolve scope

Determine which files to evaluate:

1. If `$ARGUMENTS` contains a commit range (e.g., `main..HEAD`, `HEAD~3..HEAD`, `feature-branch..main`), use it directly
2. Otherwise default to `main..HEAD` plus uncommitted working-tree changes

```bash
RANGE="${ARGUMENTS:-main..HEAD}"

# Committed changes in range
COMMITTED=$(git diff --name-only "$RANGE" 2>/dev/null | grep -E '^(gsp|dev)/(skills|agents)/.*\.md$' || true)

# Uncommitted working-tree changes
UNCOMMITTED=$(git diff --name-only HEAD 2>/dev/null | grep -E '^(gsp|dev)/(skills|agents)/.*\.md$' || true)

# Combine, dedupe
FILES=$(printf "%s\n%s\n" "$COMMITTED" "$UNCOMMITTED" | sort -u | grep -v '^$')
```

## Step 1: Filter to eval-worthy changes

For each candidate file:
- Skip if BEFORE doesn't exist in `${BEFORE_REF}` (new file — eval doesn't apply)
- Skip if AFTER doesn't exist (deleted file — different concern; user should review the deletion intentionally)
- Skip if file is < 30 lines AND not a `SKILL.md` (too small to warrant a full eval)
- Otherwise include in the eval set

If 0 files survive: print `No eval-worthy changes. Run \`git diff $RANGE\` to see what changed.` and exit cleanly.

## Step 2: Stage before/after

```bash
TMPDIR=$(mktemp -d /tmp/gspdev-eval-XXXXXX)
BEFORE_REF="${RANGE%..*}"
[[ -z "$BEFORE_REF" ]] && BEFORE_REF="main"

for f in $FILES; do
  base=$(echo "$f" | tr '/' '_' | sed 's/\.md$//')
  git show "${BEFORE_REF}:$f" > "$TMPDIR/${base}-before.md" 2>/dev/null
  cp "$f" "$TMPDIR/${base}-after.md"
done
```

## Step 3: Identify parent SKILL.md per file

Each evaluator needs the parent skill for context:

| File pattern | Parent for context |
|---|---|
| `gsp/skills/{name}/SKILL.md` | itself |
| `gsp/skills/{name}/methodology/*.md` | `gsp/skills/{name}/SKILL.md` |
| `gsp/skills/{name}/{sibling}.md` | `gsp/skills/{name}/SKILL.md` |
| `gsp/agents/{name}.md` | none — agent stub stands alone |
| `dev/skills/{name}/...` | analogous to gsp/skills/ |

## Step 4: Load rubric

Read `${CLAUDE_SKILL_DIR}/rubric.md` — this is the standard evaluation rubric inlined into every evaluator's prompt.

## Step 5: Spawn parallel evaluators

For each file, spawn one Agent call with `subagent_type: "general-purpose"` and `run_in_background: true`. **Dispatch all Agent calls in a single message** for true parallelism.

Each evaluator prompt:

```
Evaluate quality preservation in this file change.

Context: GSP design engineering framework. Today is {DATE}; current release is {VERSION}. The file you are evaluating is loaded into an agent's context every time the parent skill is invoked, so substance loss directly affects agent output quality.

File: {RELATIVE_PATH}
BEFORE: {TMPDIR}/{base}-before.md ({BEFORE_LINES} lines)
AFTER:  {TMPDIR}/{base}-after.md ({AFTER_LINES} lines, {DELTA}%)
Parent SKILL.md (for context, may be the same as AFTER if file is itself a SKILL.md): {PARENT_PATH}

[INLINE RUBRIC — verbatim from {CLAUDE_SKILL_DIR}/rubric.md]

Output exactly this structure (markdown, under 600 words):

### Verdict: PASS / CONCERNS / FAIL

### Per-dimension scores

| Dimension | Score | Notes |

### Specific findings (if any)

Quoted BEFORE text + recommendation (restore / leave / discuss).

### Net assessment

One paragraph: did the change improve the file (or land its intent) without sacrificing the agent's ability to do its job?

Do NOT modify any files. Report only.
```

## Step 6: Aggregate verdicts

Wait for all evaluators (notifications arrive automatically). Compose summary:

```markdown
## Quality eval — {N} files

| File | Δ lines | Verdict | Concerns |
|------|---------|---------|----------|
| ... | ... | PASS | 0 |
| ... | ... | CONCERNS | 1 (restore X) |
```

Print the per-file detail underneath in collapsible form (the evaluator output verbatim).

## Step 7: Surface concerns + offer fixes

If any CONCERNS or FAIL verdicts exist:

Use `AskUserQuestion`: "{N} files flagged concerns. Apply suggested restorations?"

Options:
- **Apply** — for each CONCERN, restore the flagged content per evaluator's recommendation. Edit files inline. Re-run audit suite to confirm nothing breaks.
- **Walk individually** — present each concern, ask per-finding (apply / skip / discuss)
- **Skip** — record concerns in the report but make no changes (user will address manually or in PR review)

If all PASS: print `All {N} files PASS. Ready to merge.` and exit.

## Step 8: Cleanup

```bash
rm -rf "$TMPDIR"
```

Print final summary:

```
N files evaluated
  ✓ N PASS
  ! N CONCERNS  ({applied|skipped|walked})
  ✗ N FAIL  ({reverted|surfaced})

Recommended action: {merge | fix-then-merge | revert-and-redesign}
```

</process>

<output>
Terminal report (markdown). Optional inline file edits if the user picks Apply / Walk in Step 7. No persistent artifacts written outside `$TMPDIR` (which is cleaned up at exit).
</output>
