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

**Paired semantics ACs are required for every UI-rendering AC.** An AC is UI-rendering if it introduces, reveals, or restructures on-screen content or controls (table renders, dialog opens, badge shows, toggle appears). Navigation-only ACs don't need a pair. Numbering convention: behavior is `AC-N.M`, paired semantics is `AC-N.Ma`. Each pair declares: ARIA role / label / heading semantics, keyboard model where interactive, and SR-perceivable text equivalents for non-text content. See `references/ears-quality.md` §5 for pair patterns by element kind (table, toggle, button, dialog, image, live region).

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

### `## Breakpoints`
(only when an AC references viewport / responsive behavior — omit otherwise)

Declare the project's breakpoints as numeric thresholds with names. ACs reference them by name (`breakpoints.mobile`, `breakpoints.desktop`) rather than bare `mobile`/`desktop` strings. Downstream phases (design, build) MUST NOT introduce breakpoints not declared here.

Example (mobile + desktop only):

```markdown
| Name | Threshold | Notes |
|------|-----------|-------|
| `breakpoints.mobile` | `< 640px` | single column, touch-first |
| `breakpoints.desktop` | `≥ 640px` | multi-column, hover-capable |
```

Example (mobile + tablet + desktop):

```markdown
| Name | Threshold | Notes |
|------|-----------|-------|
| `breakpoints.mobile` | `< 640px` | single column |
| `breakpoints.tablet` | `640px – 1023px` | 2-column grid |
| `breakpoints.desktop` | `≥ 1024px` | 3-column grid |
```

If only two tiers are declared (mobile + desktop), the design phase MUST NOT silently invent a tablet tier — surface the gap as a question rather than fill it in.

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
