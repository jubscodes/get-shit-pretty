# Phase Transition Template

> Embed this template at the end of each phase command's `<process>` section.
> Replace `{phase}`, `{completion_message}`, `{next_phase}`, `{next_description}` with values from the table below.

---

## Template Text (to add at end of each phase command's `<process>`)

```markdown
## Phase Completion Output

After all phase work is complete and all files are written, render the phase transition screen as plain text. No ANSI escape codes — structure comes from Unicode symbols and indentation.

### Check for partial output (C2 fix)

Before starting phase work, check if the phase directory already contains `.md` files (excluding INDEX.md). If partial output exists, show:

```
  ◈ {phase} — partial output found ({N} chunks). re-running will overwrite.
```

Then use `AskUserQuestion`:
- **Continue (overwrite)** — "re-run this phase from scratch"
- **View existing output** — "show what's already been written"
- **Cancel** — "keep existing output and stop"

### Render completion

1. Output 1 blank line, then the completion line:
```
  ◆ {phase} complete — {completion_message}
```

2. Output 1 blank line, then list all files written to the phase directory as a tree:
```
    {phase_dir}/
    ├── {file1}.md
    ├── {file2}.md
    └── INDEX.md
```
   Sort: directories first, then files alphabetically, INDEX.md always last.

3. Output 1 blank line, then a plain divider:
```
  ──────────────────────────────
```

4. Use `AskUserQuestion` with 3 options:
   - **Continue to {next_phase}** — "{next_description}"
   - **View progress** — "see the full dashboard"
   - **Done for now** — "pick up later with /gsp:start"
```

---

## Phase Values Table

### Branding Phases

| Command | {phase} | {completion_message} | {phase_dir} | {next_phase} | {next_description} |
|---------|---------|---------------------|-------------|--------------|-------------------|
| `brand-research` | discover | market landscape mapped | discover | strategy | define positioning and personality |
| `brand-strategy` | strategy | brand platform defined | strategy | identity | create voice and visual identity |
| `brand-verbal` | verbal | voice and messaging shaped | verbal | identity | create visual identity |
| `brand-identity` | identity | visual system designed | identity | patterns | build tokens and components |
| `brand-patterns` | system | design system built | system | a project | scope what you're building with this brand |

### Project Phases

| Command | {phase} | {completion_message} | {phase_dir} | {next_phase} | {next_description} |
|---------|---------|---------------------|-------------|--------------|-------------------|
| `project-brief` | brief | project scoped | brief | research | research UX patterns and approaches |
| `project-research` | research | patterns and approaches researched | research | design | design screens and flows |
| `project-design` | design | screens designed | design | critique | critique designs + accessibility audit |
| `project-critique` | critique | designs critiqued | critique | build | translate designs to code |
| `project-build` | build | designs translated to code | build | review | review deliverables against designs |
| `project-review` | review | deliverables validated | review | launch | create launch and marketing assets |

### Optional Phase

| Command | {phase} | {completion_message} | {phase_dir} | Option 1 | Option 2 | Option 3 |
|---------|---------|---------------------|-------------|----------|----------|----------|
| `launch` | launch | campaign assets created | launch | View progress — "see the full dashboard" | Start new project — "scope another project" | Done — "that's a wrap" |

### Special Cases

**brand-patterns (terminal branding phase):**
Option 1 becomes: **Start a project** — "scope what you're building with this brand"

**project-review (terminal project phase):**
Option 1 becomes: **Launch campaign** — "create launch and marketing assets"

**launch (terminal overall phase):**
Uses a different 3-option set (see table above).

**project-critique with critical issues:**
Instead of the completion template, show:
```
  ◈ critique — critical issues found, revising designs
```
Then AskUserQuestion:
- **Revise designs** — "address critical issues and re-run critique"
- **Override and continue** — "accept current designs and move to build"
- **View issues** — "see the full critique report"

### "Fully Pretty" Check

After the last phase in a pipeline completes (brand-patterns for branding, project-review for project, or launch), check if ALL brands and ALL projects across `.design/` are complete. If so, add this line after the divider:

```
  fully pretty.
```

### Validation: Empty Phase Check (C3 fix)

Before rendering the completion template, validate that the phase directory contains at least 1 chunk file (`.md` file other than INDEX.md). If the directory is empty despite being marked complete:

```
  ◆! {phase} complete — (empty — may need re-run)
```
