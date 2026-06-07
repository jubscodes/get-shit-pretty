# Spec

> This phase produces a single flat artifact: `{PROJECT_PATH}/spec.md`. SDD-style contract that downstream phases read.

## Artifact

`{PROJECT_PATH}/spec.md` — one file, sectioned. No subdirectory, no per-axis chunks, no INDEX. The earlier `brief/{scope,target-adaptations,install-manifest,gap-analysis,file-references}.md` structure is collapsed into sections of this file.

## Section reference

### `## Scope`
What's being built, for whom, on what platforms. Followed by a **Screens** table (priority, purpose) and **Boundaries** lists (in scope / out of scope).

### `## Acceptance Criteria` (EARS)
Testable, unambiguous behavior contract. Each line uses the form `WHEN <trigger>, THE SYSTEM SHALL <behavior>`. Grouped by feature area, numbered `AC-{N}.{M}`. Aim for 5–15 total — the happy paths + critical edges.

These are what design verifies against ("does the screen support AC-2.3?"), what build tests against ("write the test for AC-2.3"), and what review checks ("AC-2.3 passes? Y/N").

Hedge words (`distinct`, `easily`, `quickly`, `within … cycle`, bare `mobile`/`desktop`, `savings` without a formula, `visible focus` without dimensions) fail the contract — downstream phases will each invent their own answer. See the brief skill's `references/ears-quality.md` for tight-form patterns.

For every AC that produces visible UI, pair it with a **semantics AC** covering keyboard, screen-reader, and contrast contracts when not implied by the behavior AC (e.g. `AC-3.1` renders the table; `AC-3.1a` declares the row/col headers + cell SR labels).

### `## Numeric Inputs`
(only when an AC references a computed value — omit otherwise)

Declare formulas, rounding rules, and source data for every computed value referenced in an AC. Example:

```markdown
| Symbol | Formula | Source | Rounding |
|--------|---------|--------|----------|
| `annual_savings` | `(monthly_price × 12) − annual_price` | tier pricing data | nearest whole currency unit, format `Save $N/year` |
| `per_month_equivalent` | `annual_price ÷ 12` | tier pricing data | nearest whole currency unit |
```

If a computed value is referenced in an AC but not declared here, downstream phases will invent the formula — and three phases will invent it three different ways.

### `## Target Adaptations`
Project-specific token overrides and component adaptations. Each row points at the brand-system component being adapted and the project-specific reason.

### `## Install Manifest`
(shadcn / rn-reusables targets only — omit otherwise)
Copy-paste-ready install commands.

### `## Gap Analysis`
(existing codebases only — omit otherwise)
What's in the brand system but missing from the codebase.

### `## File References`
(existing target only — omit otherwise)
Where existing components live, plus reuse strategy (keep / restyle / replace).

### `## Issue Framing`
How to break the project into bounded shippable PRs.

## Skip-if-not-present

Sections without project-specific content are omitted entirely. Do not write "_Nothing meaningful for this project._" Just leave the section out.
