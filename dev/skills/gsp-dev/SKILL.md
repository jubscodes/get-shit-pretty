---
name: gsp-dev
description: Read milestones, issues, and branch state to propose the next task for GSP development.
allowed-tools:
  - Bash
  - Read
  - Glob
  - Grep
  - AskUserQuestion
argument-hint: "[focus] e.g. 'all', 'milestone', 'blockers', 'ready'"
disable-model-invocation: true
---
<context>
GSP internal development router. Reads GitHub milestones and issues, checks branch state, and proposes what to work on next. This is for GSP maintainers working on the framework itself — not for end users.

Repository: jubscodes/get-shit-pretty
</context>

<objective>
Analyze the current milestone, open issues, branch state, and recent work to recommend the highest-impact next task.
</objective>

<process>

## Step 1: Gather state

Run these in parallel:

```bash
gh api repos/jubscodes/get-shit-pretty/milestones --jq '.[] | {title, number, open_issues, closed_issues, description}'
```

```bash
gh issue list --state open --json number,title,labels,milestone,assignees,createdAt,updatedAt --jq '.[] | {number, title, labels: [.labels[].name], milestone: .milestone.title}'
```

```bash
git log main..HEAD --oneline
```

```bash
git status --short
```

## Step 2: Parse focus

`$ARGUMENTS` determines what to show:
- **`all`** or empty — full analysis + recommendation
- **`milestone`** — milestone progress only
- **`blockers`** — issues blocking other issues
- **`ready`** — issues ready to start (no dependencies, no blockers)

## Step 3: Analyze issues

For each open issue in the active milestone, classify:

### 3a: Dependency graph

Read issue bodies to extract `Related` / `Blocks` / `Depends on` references. Build a lightweight dependency picture:
- Which issues block others?
- Which issues are leaf nodes (no dependencies)?

### 3b: Branch coverage

Cross-reference open issues against commits on the current branch (`git log main..HEAD`). Classify each issue as:
- **Done on branch** — commits clearly address this issue
- **In progress** — partial commits exist
- **Not started** — no related commits

### 3c: Effort signal

Estimate relative size from issue body:
- **S** — single file change, config, or docs
- **M** — multiple files, one workstream
- **L** — cross-cutting, new architecture pattern

### 3d: Impact signal

Rate based on what the issue unblocks:
- **High** — blocks 2+ other issues or is required for milestone completion
- **Medium** — blocks 1 issue or fills a gap
- **Low** — standalone improvement

## Step 4: Recommend next task

Apply this priority stack:

1. **Blockers first** — issues that block the most other work
2. **Nearly done** — issues with partial branch coverage (finish what's started)
3. **High impact + small effort** — quick wins that unblock others
4. **Sequential dependencies** — if A blocks B, recommend A

Pick the top 1-3 recommendations. For each, explain:
- Why this one next (what it unblocks)
- What's already done (branch commits)
- What remains (concrete tasks)

## Step 5: Display

Output with clean terminal formatting:

```
  /gsp:dev
  ═══════════════════════════════════════

  ─── Milestone ────────────────────────

  v0.5.0 — Agentic design engineering
  ████████░░░░░░░░░░░░ 20% (2/10)

  ─── Issues ───────────────────────────

  Done on branch:
    ✅ #12  Cross-runtime installer fixes
    ✅ #19  Consolidate prompts/ vs agents/

  Ready to start:
    ○  #26  Validate plugin manifest             S  blocks: —
    ○  #23  /gsp:style skill                     L  blocks: #18, #24
    ○  #24  Composable skills pattern             M  blocks: —

  Blocked:
    ◌  #18  Quick mode                           M  needs: #23
    ◌  #21  designprompts.dev integration         M  needs: #23
    ◌  #25  CHANGELOG + migration guide           S  needs: all

  Not in milestone:
    ○  #7   Theme-aware terminal output
    ○  #4   Onboarding experience

  ─── Recommendation ───────────────────

  → #23 /gsp:style skill (L)
    Why: blocks #18 (quick mode) and #21 (designprompts.dev).
    First composable skill — proves the pattern for #24.
    Start: create references/styles/ preset format + SKILL.md

  → then #26 Validate plugin manifest (S)
    Why: quick win, verifies architecture work already on branch.
    All code exists — just needs manual testing.

  → then #24 Composable skills pattern (M)
    Why: defines the agent→skill contract.
    Can run in parallel with #23 implementation.
```

## Step 6: Offer to start

After displaying recommendations, ask:

"Want to start working on one of these?" with the top recommendations as options.

If the user picks one, display the issue body summary and suggest the first concrete step.

## Important notes

- **Read-only by default** — don't modify issues, just analyze
- **Use `gh` CLI** — don't hardcode issue data, always fetch fresh
- **Branch-aware** — recommendations account for what's already done
- **Keep it short** — the recommendation section is the value, not the analysis
- **Don't over-fetch** — read issue bodies only when needed for dependency analysis, not for every issue

</process>
