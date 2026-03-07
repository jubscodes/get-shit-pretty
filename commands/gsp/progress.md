---
name: gsp:progress
description: Check design progress — "How pretty are we?"
allowed-tools:
  - Read
  - Glob
---
<context>
Status check for GSP design projects. Shows progress for all brands and projects with prettiness meters.
</context>

<objective>
Display current progress across all brands and projects.
</objective>

<process>
## Step 1: Scan for instances

Check `.design/branding/` for brand directories and `.design/projects/` for project directories.

If neither found, check for legacy `.design/STATE.md`:
- If found: show legacy progress (same as v0.3.0)
- If not: display "No GSP project found. Run `/gsp:new` to start one."

## Step 2: Read state for each instance

For each brand: read `STATE.md` and `BRIEF.md`
For each project: read `STATE.md`, `BRIEF.md`, and `brand.ref`

## Step 3: Calculate prettiness

Brands: count completed/skipped phases out of 5
Projects: count completed/skipped phases out of 6

## Step 4: Display progress

```
🎨 GSP — How Pretty Are We?

─── Brands ────────────────────────────

  acme-corp
  ████████████████ 100% (5/5 phases)
  ✅ Research  ✅ Strategy  ✅ Verbal  ✅ Identity  ✅ Patterns

  beta-labs
  ██████░░░░░░░░░░ 40% (2/5 phases)
  ✅ Research  ✅ Strategy  ⬜ Verbal  ⬜ Identity  ⬜ Patterns
  → Next: /gsp:brand-identity

─── Projects ──────────────────────────

  acme-website (brand: acme-corp)
  ██████████░░░░░░ 66% (4/6 phases)
  ✅ Brief  ✅ Research  ✅ Design  ✅ Critique  ⬜ Build  ⬜ Review
  → Next: /gsp:build

  acme-mobile (brand: acme-corp)
  ███░░░░░░░░░░░░░ 16% (1/6 phases)
  ✅ Brief  ⬜ Research  ⬜ Design  ⬜ Critique  ⬜ Build  ⬜ Review
  → Next: /gsp:research
  📦 Launch: complete

─── Overall ───────────────────────────

  Brands:   1 complete, 1 in progress
  Projects: 0 complete, 2 in progress
```

Use ✅ for complete, ⏭️ for skipped, 🔄 for in-progress/needs-revision, ⬜ for pending.

Show Launch status separately if present (not counted in phase progress).

## Step 5: Route next

For each in-progress instance, identify the next pending phase and suggest the command:

**Brand routing:**
- Phase 1 (Research) pending → `/gsp:brand-research`
- Phase 2 (Strategy) pending → `/gsp:brand-strategy`
- Phase 3 or 4 (Verbal/Identity) pending → `/gsp:brand-identity` (handles both phases with skip logic)
- Phase 5 (Patterns) pending → `/gsp:brand-patterns`

**Project routing:**
- Brief pending → `/gsp:brief`
- Research pending → `/gsp:research`
- Design pending → `/gsp:design`
- Critique pending → `/gsp:critique`
- Build pending → `/gsp:build`
- Review pending → `/gsp:review`

If everything is complete: "All brands and projects are fully pretty! 🎨"
</process>
