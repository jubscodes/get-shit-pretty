---
name: gspdev-benchmark
description: Benchmark GSP token budget — capture snapshots, compare between versions/PRs, track improvements over time
allowed-tools:
  - Read
  - Bash
  - Glob
  - Grep
  - AskUserQuestion
argument-hint: "[capture|compare|trend|pr] default: capture"
---
<context>
Benchmarks GSP's token budget, rate limit risk, and test health. Wraps `dev/scripts/benchmark.sh` with interactive analysis.

Snapshots live in `dev/benchmarks/` as JSON files. The workflow is release-centric:
1. At each release, capture a baseline: `benchmark.sh release` → `{version}.release.json`
2. During development, capture snapshots: `benchmark.sh capture [label]`
3. Before PR, compare against release: `benchmark.sh compare` (auto-selects release baseline)

This measures the cumulative impact of changes heading into the next release.
</context>

<process>
## Step 0: Parse mode

Read `$ARGUMENTS` to determine the mode:

| Input | Mode |
|-------|------|
| (no args) | Capture + auto-compare against release baseline |
| `capture [label]` | Capture with optional label |
| `release` | Capture as the release baseline for this version |
| `compare [v1] [v2]` | Compare two snapshots (default: release vs latest) |
| `trend` | Show trajectory across all snapshots |

## Step 1: Execute mode

### Default mode (no args)

1. Run `bash dev/scripts/benchmark.sh capture`
2. If a release baseline exists, automatically run `benchmark.sh compare`
3. Present the comparison table and analysis

This is the most common invocation — "where are we vs the last release?"

### Capture mode

Run `bash dev/scripts/benchmark.sh capture [label]`.

After capture, read the JSON from `dev/benchmarks/` and present a summary:
- Total weight and red-zone count
- Top 5 heaviest skills with their breakdown
- Rate limit risk (API conversations, double-dispatch count)
- If a release baseline exists, auto-compare and highlight changes

### Release mode

Run `bash dev/scripts/benchmark.sh release`.

This is part of the publish flow — capture the definitive baseline for this version. All future `compare` calls will diff against this baseline until the next release.

Remind the user: "Add `benchmark.sh release` to your `/gspdev-publish` checklist."

### Compare mode

Run `bash dev/scripts/benchmark.sh compare [v1] [v2]`.

Default (no args) compares release baseline → latest capture. After the table output, analyze:
- Flag any skill that moved from green/yellow to red
- Flag any skill whose exec_context increased (potential pass-through regression)
- Summarize net pipeline path changes
- Rate limit risk changes
- Highlight the biggest wins and regressions

### Trend mode

Run `bash dev/scripts/benchmark.sh trend`.

After the table, identify:
- Overall trajectory (improving, stable, regressing)
- Largest single-version improvement
- Skills that consistently stay in red zone

## Step 2: Suggest next actions

Based on the results, suggest relevant actions:
- If red-zone skills exist: "Consider optimizing {skill} — {specific suggestion}"
- If exec_context is non-zero for agent-spawning skills: "Pass-through exec_context detected in {skill}"
- If rate limit risk increased: "New double-dispatch skill adds API conversation overhead"
- If tests have failures: "Fix test failures before benchmarking"
- If total weight decreased significantly: celebrate the win with specific numbers
</process>
