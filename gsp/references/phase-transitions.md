# Phase Transition Screen

Rendered at the end of every phase skill. Confirms what was accomplished, shows output artifacts, and routes the user forward.

## When to render

Every skill that completes a phase must render a transition. The skill itself just says:

```
Render phase transition (see `references/phase-transitions.md`).
```

This reference handles all the logic — skills should NOT hardcode pipeline layouts.

## Styling

Output as plain text using Unicode characters for visual hierarchy:

- `◆` for completed phases
- `◈` for next phase (the one the user is about to enter)
- `◇` for pending phases
- `───` connecting phases in the pipeline line
- `──────` divider between sections
- Tree connectors `├──`, `└──`, `│` for file listings

## Rendering logic

Read the brand or project STATE.md to determine context.

### Step 1: Pipeline progress line (conditional)

Show the pipeline line **only when 2+ phases are complete** (i.e., the user is clearly in a flow). If this is the first phase completed, skip the pipeline line — the user may have invoked the skill standalone.

```
  {brand-or-project-name}
  ◆ discover ─── ◆ strategy ─── ◈ identity ─── ◇ system
```

#### Branding phases

`discover ─── strategy ─── identity ─── patterns`

If audit phase exists (evolve mode), prepend: `audit ─── `

#### Project phases

`brief ─── research ─── design ─── critique ─── build ─── review`

If launch is in scope, append: ` ─── launch`

### Step 2: Phase completion + file tree (always)

Always show what was accomplished and what was produced:

```
  ◆ {phase} complete — {completion_message}

    {phase_dir}/
    ├── {file1}.md
    ├── {file2}.md
    └── INDEX.md

  ──────────────────────────────
```

### Step 3: Routing options (adaptive)

Use `AskUserQuestion` with options adapted to context:

**When in a pipeline flow** (previous phase was completed in this or a recent session):
1. **Continue to {next}** — "{description of next phase}"
2. **View progress** — "see the full dashboard"
3. **Done for now** — "pick up later with /gsp:start"

**When standalone** (user invoked the skill directly, no clear pipeline context):
1. **View output** — "review what was generated"
2. **Done** — "that's all I needed"

Use judgment — if the user explicitly asked for one skill, don't push them into the next phase. If they're clearly flowing through the pipeline, offer the next step.

## Completion Messages

### Branding Phases

| Phase | Completion Message | Next Phase |
|-------|-------------------|------------|
| audit | brand assessed | discover — `/gsp:brand-research` |
| discover | market landscape mapped | strategy — `/gsp:brand-strategy` |
| strategy | brand platform defined | identity — `/gsp:brand-identity` |
| identity | visual system designed | patterns — `/gsp:brand-patterns` |
| patterns | design system built | project setup — `/gsp:start` (scans codebase, gathers brief, creates project) |

### Project Phases

| Phase | Completion Message | Next Phase |
|-------|-------------------|------------|
| brief | project scoped | research — `/gsp:project-research` |
| research | patterns and approaches researched | design — `/gsp:project-design` |
| design | screens designed | critique — `/gsp:project-critique` |
| critique | designs critiqued | build — `/gsp:project-build` |
| build | code implemented | review — `/gsp:project-review` |
| review | implementation validated | launch — `/gsp:launch` (or done) |
| launch | campaign assets created | done |

### Special cases

**Critique with critical issues:**
```
  ◈ critique — critical issues found, revising designs

  ──────────────────────────────
```
Options: Revise designs / Override and continue / View issues

**Review with QA failures:**
```
  ◈ review — QA found issues, needs revision

  ──────────────────────────────
```
Options: Fix and rebuild / View issues / Done for now

**Final phase (all complete):**
Add `  fully pretty.` after the divider.

## File Tree Rules

- Root is the phase directory name followed by `/`
- Files sorted alphabetically, directories first
- INDEX.md always listed last
- Use `├──` for all items except the last, which uses `└──`
- Subdirectories show their contents with `│` continuation
