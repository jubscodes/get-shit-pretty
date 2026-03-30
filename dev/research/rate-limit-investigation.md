# Rate Limit Investigation — GSP Skills

**Date:** 2026-03-29
**Status:** In progress — design direction confirmed, spec pending

## Problem

Multiple GSP skills hit Anthropic API rate limits during normal usage:
- `gsp-start` — hits during greeting (before user answers anything)
- `gsp-phase-transition` — hits mid-session (lightweight skill, ~2 reads)
- `gsp-brand-research` — hits after just 3 execution_context reads

## Root Cause

**Cumulative session budget problem.** Rate limit is per-model (sonnet), shared across main conversation + all background agents. gsp-start burns too much budget before real work begins.

### How a typical session burns the budget

1. **Session start:** All 15 agent `.md` files load (always, every conversation)
2. **`/gsp-start` invocation:**
   - Skill body (331 lines) + questioning.md (87 lines) via execution_context
   - Step 1a: Glob/Read to scan `.design/`
   - Step 1b: **Background `gsp-design-system` agent** — dozens of Glob/Read/Grep/Write calls
   - Steps 3-4: 15-18 AskUserQuestion round-trips
   - Template reads + artifact writes at flow end
3. **Next skill (e.g. `/gsp-brand-research`):** 3 execution_context reads → rate limit hit

### Two compounding factors

1. **Background agent at greeting** — `gsp-design-system` competes for same rate bucket before user even sees first question
2. **execution_context reads** — every `@` reference = 1 Read call at skill load. 12 refs across a 5-skill brand pipeline = 12 calls of pure overhead

## Observed Triggers

| Skill | When | Cause |
|-------|------|-------|
| gsp-start | During greeting | Background agent competing for rate bucket |
| gsp-phase-transition | Mid-session | Accumulated calls from prior skills |
| gsp-brand-research | After 3 reads | Session already near limit from gsp-start |

## Execution Context Inventory

### Heaviest skills (lines loaded on invocation)

| Skill | @ refs | Lines | Files |
|-------|--------|-------|-------|
| gsp-project-critique | 2 | ~412 | wcag-checklist (159) + color-composition (173) |
| gsp-brand-research | 3 | ~289 | discover template (47) + design-trends (55) + INDEX.yml (184) |
| gsp-brand-guidelines | 2 | ~272 | design-tokens (182) + patterns template |
| gsp-brand-sync | 2 | ~262 | design-tokens (182) + chunk-format |
| gsp-brand-refine | 1 | ~262 | design-tokens (182) |
| gsp-style | 4 | ~260 | INDEX.yml (184) + design-tokens (182) + chunk-format + template |
| gsp-brand-identity | 2 | ~253 | identity template + color-composition (173) |
| gsp-brand-strategy | 4 | ~230+ | archetypes (151) + positioning + voice + template |
| gsp-design-system | 5 | ~194 | 5 system templates |

### Full brand pipeline execution_context cost

| Skill | @ refs |
|-------|--------|
| gsp-start | 1 |
| gsp-brand-research | 3 |
| gsp-brand-strategy | 4 |
| gsp-brand-identity | 2 |
| gsp-brand-guidelines | 2 |
| **Total** | **12 reads before any real work** |

### Agent-spawning skills (15)

gsp-start, gsp-brand-research, gsp-brand-strategy, gsp-brand-identity, gsp-brand-guidelines, gsp-brand-audit, gsp-brand-sync, gsp-project-brief, gsp-project-research, gsp-project-design, gsp-project-critique, gsp-project-build, gsp-project-review, gsp-launch, gsp-art

---

## Design Direction (confirmed by user)

### Principle: gsp-start should be ultra-light

gsp-start's actual job is **two things**:

1. **Read `.design/` state** — Glob + a few Reads. No agents, no scans, no templates.
2. **Route:**
   - Empty `.design/` → ask what they want to do (brand, project, both, quick)
   - Populated `.design/` → read state files, show where they left off, offer to continue

**Everything else belongs in the skill that needs it:**
- Design-system scan → first skill that needs stack info (project setup, or brand essence)
- Brand questioning flow → can be split into its own skill or kept but deferred
- Project questioning flow → already lives in gsp-project-brief (or should)
- Template loading → skills that write artifacts

### Principle: agents only at their actual step

No pre-emptive agent spawns. No background work at greeting. Each agent fires at the pipeline step that needs its output. This spreads the rate budget across natural user pause points (skill transitions, question answers).

### Principle: questioning is a start concern but can be split

The brand/project brief-gathering conversation is gsp-start's responsibility conceptually, but it doesn't need to live in the same skill invocation. Options:
- **Split into `gsp-brand-brief`** — separate skill for the brand questioning flow
- **Keep in gsp-start but defer** — questioning only begins after routing, keeping the greeting ultra-light
- **Fold into existing skills** — brand questioning → first step of `gsp-brand-research`, project questioning → first step of `gsp-project-brief`

The split matters because skill transitions give the rate limit time to recover between bursts.

---

## Reduction Opportunities

| Change | Calls saved | Effort |
|--------|------------|--------|
| Remove background gsp-design-system spawn | ~20-40 | Trivial |
| Inline small files (<100 lines) into SKILL.md | ~5-7 across pipeline | Medium |
| Inline chunk-format.md into consuming skills | ~7 across pipeline | Medium |
| Defer agent-only refs to spawn-time reads | 0 (spreads burst) | Medium |
| Batch inference questions in gsp-start | ~3-4 | Low |
| Split gsp-start into greeter + questioning | 0 (spreads across skills) | Medium |

## Next Steps

- [ ] Design the refactored gsp-start (thin greeter + router)
- [ ] Decide where questioning flows land (split skill vs fold into existing)
- [ ] Audit execution_context refs across all 22 skills for inline candidates
- [ ] Implement and test
