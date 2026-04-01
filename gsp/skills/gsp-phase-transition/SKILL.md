---
name: gsp-phase-transition
description: "Render phase transition screens — pipeline progress, completion banner, file tree. Invoked by pipeline skills at phase completion."
user-invocable: false
allowed-tools:
  - Read
  - Glob
---
<context>
Rendering utility invoked by pipeline skills at phase completion. Produces the visual transition — pipeline progress line, completion banner, file tree of outputs — then returns control to the calling skill for routing.

The calling skill provides phase name and output directory. This skill reads STATE.md, renders the transition, and returns. The calling skill handles routing (AskUserQuestion, E2E auto-invoke, etc.) after this skill completes.
</context>

<objective>
Render a phase transition screen showing pipeline progress, the completed phase, and output file tree.

**Input:** Phase name + output directory path from the invoking skill
**Output:** Terminal output with pipeline progress, completion banner, and file tree
**Agent:** None — inline rendering
</objective>

<process>
## Step 0: Parse invocation context

The invoking skill provides:
- **Phase name** — which phase just completed (e.g., "discover", "strategy", "build")
- **Output directory** — path to the phase's output files

Look up the completion message from the defaults table. If the invoking skill provided a custom message, use that instead.

## Step 1: Read STATE.md

Determine context by reading the brand or project STATE.md:
- Which pipeline (branding or project)?
- Which phases are complete?
- Brand/project name?

Use Glob to find STATE.md: `.design/branding/*/STATE.md` or `.design/projects/*/STATE.md`.

## Step 2: Pipeline progress line (conditional)

Show the pipeline line **only when 2+ phases are complete**. If this is the first phase completed, skip the pipeline line.

### Styling

- `◆` for completed phases
- `◈` for next phase
- `◇` for pending phases
- `───` connecting phases

```
  {brand-or-project-name}
  ◆ discover ─── ◆ strategy ─── ◈ identity ─── ◇ guidelines
```

### Branding phases

`discover ─── strategy ─── identity ─── guidelines`

If audit phase exists (evolve mode), prepend: `audit ─── `

### Project phases

`brief ─── research ─── design ─── critique ─── build ─── review`


## Step 3: Completion banner + file tree

```
  ◆ {phase} complete — {completion_message}

    {phase_dir}/
    ├── {file1}.md
    ├── {file2}.md
    └── INDEX.md

  ──────────────────────────────
```

Read the actual output directory to list real files.

### File tree rules

- Root is the phase directory name followed by `/`
- Files sorted alphabetically, directories first
- INDEX.md always listed last
- Use `├──` for all items except the last, which uses `└──`
- Subdirectories show their contents with `│` continuation

### Final phase

If all phases in the pipeline are complete, add `  fully pretty.` after the divider.

## Default completion messages

### Branding

| Phase | Message |
|-------|---------|
| audit | brand assessed |
| discover | market landscape mapped |
| strategy | brand platform defined |
| identity | visual system designed |
| guidelines | design system built |

### Project

| Phase | Message |
|-------|---------|
| brief | project scoped |
| research | patterns and approaches researched |
| design | screens designed |
| critique | designs critiqued |
| build | code implemented |
| review | implementation validated |

## Step 4: Return

Return control to the calling skill. Do NOT present routing options — the calling skill owns routing.
</process>
