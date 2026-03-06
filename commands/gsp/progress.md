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

Brands: count completed/skipped phases out of 4
Projects: count completed/skipped phases out of 6

## Step 4: Display progress

```
🎨 GSP — How Pretty Are We?

─── Brands ────────────────────────────

  acme-corp
  ████████████████ 100% (4/4 phases)
  ✅ Discover  ✅ Strategy  ✅ Verbal  ✅ Identity

  beta-labs
  ████████░░░░░░░░ 50% (2/4 phases)
  ✅ Discover  ✅ Strategy  ⬜ Verbal  ⬜ Identity
  → Next: /gsp:verbal

─── Projects ──────────────────────────

  acme-website (brand: acme-corp)
  ██████████░░░░░░ 66% (4/6 phases)
  ✅ System  ✅ Design  ✅ Spec  ✅ Review  ⬜ Build  ⬜ Launch
  → Next: /gsp:build

  acme-mobile (brand: acme-corp)
  ██░░░░░░░░░░░░░░ 16% (1/6 phases)
  ✅ System  ⬜ Design  ⬜ Spec  ⬜ Review  ⬜ Build  ⬜ Launch
  → Next: /gsp:design

─── Overall ───────────────────────────

  Brands:   1 complete, 1 in progress
  Projects: 0 complete, 2 in progress
```

Use ✅ for complete, ⏭️ for skipped, 🔄 for in-progress/needs-revision, ⬜ for pending.

## Step 5: Route next

For each in-progress instance, identify the next pending phase and suggest the command.
If everything is complete: "All brands and projects are fully pretty! 🎨"
</process>
