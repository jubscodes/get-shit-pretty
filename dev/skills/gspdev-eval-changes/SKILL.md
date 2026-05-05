---
name: gspdev-eval-changes
description: Quality eval for any non-trivial change to skill/agent/methodology files — spawns parallel evaluator agents that score against a fixed 8-dimension rubric (change intent + skill intent coherence + 6 preservation dimensions). Covers additions, modifications, refactors, trims, and rewrites under `gsp/skills/` or `gsp/agents/`. Use before merging.
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
GSP dev tool. Applies to **any** non-trivial change — additions, modifications, refactors, trims, rewrites. Verifies three things in order:

1. **Change intent achieved?** Did the PR/commit land what it set out to do?
2. **Skill intent coherent?** Does the skill body deliver on its description? (Catches drift between SKILL.md frontmatter `description:` and the body — a separate failure mode from the change-intent question.)
3. **Substance preserved or improved?** For modifications: did the change avoid sacrificing what the agent needs? For additions: does the new content fit the skill's existing contracts (constraints, output specs, quality bars)?

Examples of changes this covers:
- Adding a new step to a methodology
- Adding a new sibling reference file
- Modifying a rule, constraint, or rubric
- Changing the agent's role or execution mode
- Trimming verbose prose
- Extracting content to siblings
- Renaming inputs/outputs
- Adding a new SKILL.md (skill intent check from scratch)

A change that achieves its goal (Dim 1 = PASS) can still drift the skill away from its stated purpose (Dim 2 = FAIL) if it adds behavior the description doesn't reflect, or removes a step the description promised. A coherent intent + description (Dims 1-2 = PASS) can still break an output spec (Dim 6 = FAIL). All three gates matter.

Spawns one general-purpose evaluator agent per modified file in parallel. Each evaluator compares BEFORE (if any) and AFTER against the parent SKILL.md using a fixed 8-dimension rubric, returns PASS / CONCERNS / FAIL with quoted findings and surgical recommendations.

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
- Skip files smaller than 30 lines unless they are SKILL.md (too small to warrant a full eval)
- New files (BEFORE doesn't exist) are evaluated against Dimensions 1-2 only — preservation dimensions 3-8 are scored "N/A — new file, no regression possible"
- Deleted files (AFTER doesn't exist) are flagged for separate review (Dim 2 — was the description updated to match the deletion?) but not auto-evaluated
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

## Step 1: Filter and classify changes

For each candidate file, classify into one of:

| Classification | Condition | Treatment |
|---|---|---|
| **modified** | BEFORE exists + AFTER exists | Full 8-dimension eval |
| **new** | BEFORE doesn't exist + AFTER exists | Evaluate Dims 1-2 only; mark Dims 3-8 as N/A |
| **deleted** | BEFORE exists + AFTER doesn't | Flag for manual review (was description updated to match the deletion?). Skip parallel eval |
| **trivial** | < 30 lines AND not a SKILL.md | Skip — too small to warrant eval |

If 0 files survive: print `No eval-worthy changes. Run \`git diff $RANGE\` to see what changed.` and exit cleanly.

If only deleted files: print `{N} deleted files — review manually that the parent SKILL.md description still matches the body. Skipping eval.` and exit.

## Step 2: Stage before/after

```bash
TMPDIR=$(mktemp -d /tmp/gspdev-eval-XXXXXX)
BEFORE_REF="${RANGE%..*}"
[[ -z "$BEFORE_REF" ]] && BEFORE_REF="main"

for f in $FILES; do
  base=$(echo "$f" | tr '/' '_' | sed 's/\.md$//')
  # BEFORE may not exist (new file) — capture empty
  git show "${BEFORE_REF}:$f" > "$TMPDIR/${base}-before.md" 2>/dev/null || \
    : > "$TMPDIR/${base}-before.md"
  cp "$f" "$TMPDIR/${base}-after.md"
done
```

For files classified as `new` in Step 1, the BEFORE file is empty — evaluators handle this by scoring Dim 1-2 only.

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

## Step 5: Extract change intent

Extract the change's stated intent — what the author was trying to accomplish. Sources, in order of preference:

1. **PR description** (if a PR exists for the branch) — `gh pr view --json body` and parse for goals/motivation
2. **Commit messages in range** — `git log $RANGE --format='%s%n%n%b'`. The commit subject + body usually states intent
3. **Branch name** — sometimes signals (e.g., `perf/85-trim-methodology` → "trim methodology"). Weak signal; use only if 1-2 are absent

Compose a one-paragraph **change intent statement** that names the goal in concrete terms (target metric, structural outcome, behavior change).

If sources are silent or contradictory, use `AskUserQuestion`:
- Question: "What was the intent of this change? (one sentence)"
- Options: free-form text via Other

If the user skips: pass `Change intent: not provided — defensive eval only` to each evaluator. The evaluators will skip Dimension 1 and score 2-8 only.

## Step 5.5: Extract skill intent (per file)

For each file in the eval set, extract the **skill intent** — what the parent skill is supposed to do (independent of the current change).

For each file, locate the relevant SKILL.md (file itself if it IS a SKILL.md, otherwise the parent at `gsp/skills/{name}/SKILL.md` or `dev/skills/{name}/SKILL.md`):

1. Read the `description:` field from frontmatter
2. Read the `<context>` block — purpose, when to use
3. Read the `<objective>` block — input → output contract, agent responsibilities

Compose a one-sentence **skill intent statement** capturing the skill's stated purpose.

If the change touches the SKILL.md itself, capture both BEFORE and AFTER skill intent — the evaluator will compare them.

This per-file skill intent is passed to each evaluator alongside the change intent.

## Step 6: Spawn parallel evaluators

For each file, spawn one Agent call with `subagent_type: "general-purpose"` and `run_in_background: true`. **Dispatch all Agent calls in a single message** for true parallelism.

Each evaluator prompt:

```
Evaluate change intent + skill intent + quality preservation in this file change.

Context: GSP design engineering framework. Today is {DATE}; current release is {VERSION}. The file you are evaluating is loaded into an agent's context every time the parent skill is invoked, so substance loss directly affects agent output quality.

**Classification:** {modified | new}
(For `new` files: score Dimensions 1-2 only; mark 3-8 as N/A — no BEFORE to regress against.)

**Change intent (extracted in Step 5):**
{CHANGE_INTENT_STATEMENT}

(If "not provided", skip Dimension 1 and score Dimensions 2-8.)

**Skill intent (extracted in Step 5.5):**
{SKILL_INTENT_STATEMENT}

(If the file under eval IS a SKILL.md and the description/context/objective changed, also include BEFORE skill intent for drift comparison.)

File: {RELATIVE_PATH}
BEFORE: {TMPDIR}/{base}-before.md ({BEFORE_LINES} lines, may be empty for new files)
AFTER:  {TMPDIR}/{base}-after.md ({AFTER_LINES} lines, {DELTA}%)
Parent SKILL.md (for context, may be the same as AFTER if file is itself a SKILL.md): {PARENT_PATH}

[INLINE RUBRIC — verbatim from {CLAUDE_SKILL_DIR}/rubric.md]

Output exactly this structure (markdown, under 800 words):

### Verdict: PASS / CONCERNS / FAIL

### Change intent achievement

One paragraph: did the change land its stated intent? Cite specific evidence from the diff (e.g., "Trim claimed -34%, actual was 188→125L = 33.5% — within target").

### Skill intent coherence

One paragraph: does the AFTER body deliver on the skill intent? If the SKILL.md description/context/objective changed, was the body change coherent with it? Cite specific drift if any (e.g., "description still says 'spawns 4 agents' but body now spawns 3").

### Per-dimension scores

| Dimension | Score | Notes |

(Skip Dimension 1 row if change intent was not provided.)

### Specific findings (if any)

Quoted BEFORE text + recommendation (restore / leave / discuss / redesign-intent / align-description).

### Net assessment

One paragraph: did the change land BOTH intents AND preserve the agent's ability to do its job? Direct verdict: ship / ship after restoring X / align description / revert and redesign.

Do NOT modify any files. Report only.
```

## Step 7: Aggregate verdicts

Wait for all evaluators (notifications arrive automatically). Compose summary:

```markdown
## Quality eval — {N} files

| File | Δ lines | Verdict | Concerns |
|------|---------|---------|----------|
| ... | ... | PASS | 0 |
| ... | ... | CONCERNS | 1 (restore X) |
```

Print the per-file detail underneath in collapsible form (the evaluator output verbatim).

## Step 8: Surface concerns + offer fixes

Concerns split into two categories per the new rubric:

**Intent-related (Dimension 1):**
- If any file's Dimension 1 is FAIL → the change didn't land its intent. Surface as: "Intent FAIL on {N} file(s). The change does not achieve {INTENT_STATEMENT}. Recommend redesigning the change before merging."
- If any file's Dimension 1 is CONCERNS → intent partially achieved (e.g., trim hit 8% when target was 30%). Surface as: "Intent CONCERNS — gap between target and result on {N} file(s)."

**Preservation-related (Dimensions 2-7):**
Use `AskUserQuestion`: "{N} files flagged preservation concerns. Apply suggested restorations?"

Options:
- **Apply** — for each CONCERN, restore the flagged content per evaluator's recommendation. Edit files inline. Re-run audit suite to confirm nothing breaks
- **Walk individually** — present each concern, ask per-finding (apply / skip / discuss)
- **Skip** — record concerns in the report but make no changes (user will address manually or in PR review)

If all dimensions PASS across all files: print `All {N} files PASS. Intent achieved + substance preserved. Ready to merge.` and exit.

## Step 9: Cleanup

```bash
rm -rf "$TMPDIR"
```

Print final summary:

```
N files evaluated
Intent: {INTENT_STATEMENT_SHORT}

  ✓ N PASS  (intent achieved + substance preserved)
  ! N CONCERNS  ({applied|skipped|walked})
  ✗ N FAIL  ({reverted|surfaced})

Intent verdict: {achieved | partial | not-achieved}

Recommended action: {merge | fix-then-merge | revert-and-redesign}
```

</process>

<output>
Terminal report (markdown). Optional inline file edits if the user picks Apply / Walk in Step 7. No persistent artifacts written outside `$TMPDIR` (which is cleaned up at exit).
</output>
