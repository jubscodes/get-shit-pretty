---
name: gsp:progress
description: Check design project progress — "How pretty are we?"
allowed-tools:
  - Read
  - Glob
---
<context>
Status check for GSP design projects. Reads STATE.md and shows phase progress with a prettiness meter.
</context>

<objective>
Display current project progress and route to next action.
</objective>

<process>
## Step 1: Find project

Check for `.design/STATE.md` in the current directory.

If not found, display:
```
No GSP project found. Run /gsp:new-project to start one.
```

## Step 2: Read state

Read `.design/STATE.md` and `.design/BRIEF.md`.

## Step 3: Calculate prettiness

Count completed and skipped phases out of 8. Both count toward progress. Calculate percentage.

## Step 4: Display progress

```
🎨 GSP — How Pretty Are We?

Project: {PROJECT_NAME}
Prettiness: ██████░░░░░░░░░░ 37.5% (3/8 phases)

Phase Progress:
  ✅ 1. Research    — complete
  ✅ 2. Brand       — complete
  ✅ 3. System      — complete
  ⬜ 4. Design      — pending        ← you are here
  ⬜ 5. Spec        — pending
  ⬜ 6. Review      — pending
  ⬜ 7. Build       — pending
  ⬜ 8. Launch      — pending

Review Loops: {COUNT}
```

Use ✅ for complete, ⏭️ for skipped, 🔄 for in-progress/needs-revision, ⬜ for pending.

## Step 5: Route next

Identify the next pending phase and suggest the command:
"Next up: Run `/gsp:{next_phase}` to continue."
</process>
