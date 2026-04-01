# Token Budget Bottleneck Analysis

**Date:** 2026-03-31
**Tools used:** `dev/scripts/token-budget.sh` (static analyzer)
**Branch:** chore/strip-style-preamble

## Overview

Analysis of where GSP burns API rate budget, layer by layer. Identifies five bottlenecks ranked by impact.

---

## Bottleneck 1: Pass-through exec_context refs (highest impact)

Skills load files into the orchestrator's context via `@` refs in `<execution_context>`, then just pass them through to the agent prompt. The orchestrator never reads them — they exist purely to be copy-pasted into agent prompts.

| Skill | Pass-through lines | What's being wasted |
|-------|-------------------|---------------------|
| gsp-brand-strategy | **604** (100%) | archetypes (151), positioning (197), voice (193), template (63) |
| gsp-style | **357** (of 541) | design-tokens (182), chunk-format (79), patterns template (96) |
| gsp-brand-guidelines | **278** (100%) | patterns template (96), design-tokens (182) |
| gsp-brand-identity | **239** (100%) | identity template (66), color-composition (173) |
| gsp-brand-research | **231** (100%) | discover template (47), trends (55), INDEX.yml (184) |
| gsp-accessibility-audit | **159** (100%) | wcag-checklist (159) |
| gsp-project-critique | **68** (100%) | critique template (68) |

**Total: ~1,936 lines loaded into orchestrator context that the orchestrator never reads.**

**Fix:** Move out of `<execution_context>` into explicit Read steps before agent spawn. CLAUDE.md already mandates this: "Reference files that the orchestrator only passes through to agents must NOT be in `<execution_context>`."

**Legitimately direct-use exec_context (keep as-is):**
- gsp-design-system: 5 templates, 194 lines (100% orchestrator-direct, no agent)
- gsp-brand-sync: 2 files, 261 lines (100% orchestrator-direct, no agent)
- gsp-brand-refine: 1 file, 182 lines (100% orchestrator-direct, no agent)
- gsp-style: INDEX.yml only (184 lines, used in list mode)

---

## Bottleneck 2: Double-dispatch (3 API conversations per skill)

Three skills use `context: fork` + Agent tool = 3 API conversations per invocation:

```
main conversation --> fork (sub-conversation) --> agent (sub-sub-conversation)
```

| Skill | Score | API conversations |
|-------|-------|-------------------|
| gsp-project-critique | 1,680 | 3 |
| gsp-project-design | 1,224 | 3 |
| gsp-project-review | 1,089 | 3 |

The project diamond creates **9 extra API conversations** from these three skills. Each conversation re-sends system prompts, CLAUDE.md, agent stubs (~370 lines base cost per conversation).

**Fix:** Cannot collapse (by design). Slim the content inside each conversation — methodology files (181 + 132 + 67 = 380 lines) are the main target.

---

## Bottleneck 3: design-tokens.md loaded repeatedly (182 lines x 4 skills)

This single file appears in exec_context of:
- gsp-brand-guidelines (pass-through to agent)
- gsp-style (pass-through to agent)
- gsp-brand-sync (orchestrator uses directly)
- gsp-brand-refine (orchestrator uses directly)

In a brand diamond run, it loads at least twice. In a full e2e, potentially 3-4 times across different skill invocations.

**Fix:** For the 2 pass-through cases (guidelines, style), move to spawn-time Read. For the 2 direct-use cases (sync, refine), keep as-is.

---

## Bottleneck 4: INDEX.yml loaded twice in brand pipeline

`gsp/skills/gsp-style/styles/INDEX.yml` (184 lines) loads in:
- gsp-style (orchestrator uses it directly for list mode)
- gsp-brand-research (pass-through to agent)

**Fix:** Remove from brand-research exec_context. The agent can Read it on demand.

---

## Bottleneck 5: project-build body size (382 lines)

Largest SKILL.md body. The 4-phase pipeline spec (scaffold, foundations, review, screens) plus revision mode and figma mode. Revision/figma flows only activate in specific modes but always load.

**Fix:** Extract revision/figma alternate flows into sibling files read on demand.

---

## Session start baseline (not a bottleneck)

Already optimized on this branch:
- CLAUDE.md: 241 lines
- 11 agent stubs: 126 lines
- Skill descriptions: ~30 lines
- **Total: ~370 lines** (was 1,536 before stub extraction)

---

## Red-zone skills (score >= 1000)

| Skill | Score | Breakdown |
|-------|-------|-----------|
| gsp-project-critique | 1,680 | 180 body + 68 exec + 2 agents + fork + 132 methodology |
| gsp-project-build | 1,620 | 382 body + 77 exec + 2 agents + 161 methodology |
| gsp-brand-strategy | 1,323 | 154 body + 604 exec + 1 agent + 65 methodology |
| gsp-project-design | 1,224 | 165 body + 78 exec + 1 agent + fork + 181 methodology |
| gsp-brand-guidelines | 1,138 | 238 body + 278 exec + 1 agent + 122 methodology |
| gsp-project-review | 1,089 | 182 body + 40 exec + 1 agent + fork + 67 methodology |

## Pipeline path totals

| Path | Score | Skills | Heaviest |
|------|-------|--------|----------|
| brand diamond | 4,619 | 6 | gsp-brand-strategy (1,323) |
| project diamond | 6,626 | 6 | gsp-project-critique (1,680) |
| quick flow | 1,118 | 3 | gsp-style (719) |
| full e2e | 11,245 | 12 | gsp-project-critique (1,680) |

## Priority ranking

| Priority | Bottleneck | Savings | Effort |
|----------|-----------|---------|--------|
| 1 | Pass-through exec_context refs | ~1,936 lines removed from orchestrator contexts | Medium |
| 2 | Methodology file trimming | ~380 lines across 3 double-dispatch agents | Low |
| 3 | design-tokens.md dedup | ~364 lines (2 pass-through loads eliminated) | Low (covered by #1) |
| 4 | project-build body slimming | ~100-150 lines if alternate flows extracted | Medium |

## Related

- Issue #83: perf: reduce token budget for red-zone skills
- `dev/scripts/token-budget.sh`: static analyzer used for this analysis
- `dev/research/rate-limit-investigation.md`: original rate limit root cause investigation
