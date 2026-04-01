# exec_context refactor results — issue #84

**Date:** 2026-04-01
**Branch:** chore/strip-style-preamble

## Change

Moved pass-through `@` refs from `<execution_context>` to spawn-time `Read` steps in 6 skills. Orchestrators no longer load references they only pass through to agents.

## Before / After — per skill

| Skill | Before (score) | Before (exec) | After (score) | After (exec) | Saved |
|-------|---------------|---------------|--------------|--------------|-------|
| gsp-brand-strategy | 1,323 | 604 | 715 | 0 | 608 |
| gsp-brand-guidelines | 1,138 | 278 | 857 | 0 | 281 |
| gsp-brand-identity | 952 | 239 | 713 | 0 | 239 |
| gsp-brand-research | 888 | 231 | 657 | 0 | 231 |
| gsp-accessibility-audit | 939 | 159 | 780 | 0 | 159 |
| gsp-project-critique | 1,680 | 68 | 1,605 | 0 | 75 |

**Total exec_context lines removed: ~1,579**

## Before / After — pipeline paths

| Path | Before | After | Saved |
|------|--------|-------|-------|
| brand diamond | 4,619 | 3,251 | 1,368 |
| project diamond | 6,626 | 6,542 | 84 |
| quick flow | 1,118 | 1,115 | 3 |
| full e2e | 11,245 | 9,793 | 1,452 |

## Not changed (correctly using exec_context directly)

| Skill | exec lines | Reason |
|-------|-----------|--------|
| gsp-style | 541 | No agent — orchestrator uses all 4 refs directly for inline token expansion |
| gsp-design-system | 194 | No agent — orchestrator renders templates directly |
| gsp-brand-sync | 261 | No agent — orchestrator uses refs for inline edits |
| gsp-brand-refine | 182 | No agent — orchestrator uses ref for inline edits |

## Validation

- `bash dev/scripts/audit-tests.sh` — 65 pass, 0 fail
- `bash dev/scripts/token-budget.sh` — exec columns at 0 for all 6 refactored skills
- gsp-style removed from scope (false positive in original issue — no agent, all refs used directly)
