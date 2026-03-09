# Screen 05: Phase Transitions

> Phase: design | Project: gsp-cli | Generated: 2026-03-08

---

## Purpose

Phase completion moment. Appears at the end of every phase command (12 total). Confirms what was accomplished, shows the output artifacts, and routes to the next phase. This is the most frequently rendered screen in the system — it defines the rhythm of the GSP experience.

**Type:** B (Agent Output Template embedded in all 12 phase command files)
**Tone:** Celebratory + directional
**Density:** Low (12-18 lines)

## Components Used

- **Phase Block** — Phase header + sub-task summary + completion line + file tree
- **Status Message** — Sub-task completion indicators during the phase
- **Tree** — File listing of written chunks
- **Divider** — Separator before routing

## Template Structure

Every phase transition follows this exact structure:

```
                                                              ← 1 blank line


  ◆ {phase} complete — {completion_message}

  {file_tree}

  ──────────────────────────────                              ← plain divider

```

Then the agent uses `AskUserQuestion` with 3 options.

## Rendered Example: Brand Strategy Complete

```

  ◆ strategy complete — brand platform defined

    strategy/
    ├── archetype.md
    ├── positioning.md
    ├── personality.md
    ├── audience.md
    ├── competitive.md
    └── INDEX.md

  ──────────────────────────────

```

Then `AskUserQuestion`:
- **Continue to verbal** — "shape voice and messaging"
- **View progress** — "see the full dashboard"
- **Done for now** — "pick up later with /gsp:start"

## Rendered Example: Project Design Complete

```

  ◆ design complete — screens designed

    design/
    ├── screen-01-home.md
    ├── screen-02-onboarding.md
    ├── screen-03-dashboard.md
    ├── screen-04-settings.md
    ├── shared/
    │   ├── personas.md
    │   ├── information-architecture.md
    │   ├── navigation.md
    │   ├── micro-interactions.md
    │   ├── responsive.md
    │   └── component-plan.md
    └── INDEX.md

  ──────────────────────────────

```

Then `AskUserQuestion`:
- **Continue to critique** — "critique designs + accessibility audit"
- **View progress** — "see the full dashboard"
- **Done for now** — "pick up later with /gsp:start"

## Styling Specification

| Element | Color | ANSI Code |
|---------|-------|-----------|
| `◆` completion diamond | accent | `\x1b[38;2;255;107;53m` |
| Phase name in completion line | accent + bold | `\x1b[1m\x1b[38;2;255;107;53m` |
| "complete" text | text-primary | `\x1b[38;2;224;224;224m` |
| `—` dash | text-secondary | `\x1b[38;2;160;160;160m` |
| Completion message | text-secondary | `\x1b[38;2;160;160;160m` |
| Directory name (e.g., `strategy/`) | text-secondary | `\x1b[38;2;160;160;160m` |
| Tree connectors `├──`, `└──`, `│` | text-tertiary | `\x1b[38;2;102;102;102m` |
| File names | text-secondary | `\x1b[38;2;160;160;160m` |
| Divider `──────` | text-tertiary | `\x1b[38;2;102;102;102m` |

## Phase-Specific Completion Messages

### Branding Phases

| Phase | Command | Completion Message | Next Command |
|-------|---------|-------------------|--------------|
| discover | `/gsp:brand-research` | market landscape mapped | `/gsp:brand-strategy` |
| strategy | `/gsp:brand-strategy` | brand platform defined | `/gsp:brand-identity` |
| verbal | `/gsp:brand-verbal` | voice and messaging shaped | `/gsp:brand-identity` |
| identity | `/gsp:brand-identity` | visual system designed | `/gsp:brand-patterns` |
| system | `/gsp:brand-patterns` | design system built | `/gsp:project-brief` (or done) |

### Project Phases

| Phase | Command | Completion Message | Next Command |
|-------|---------|-------------------|--------------|
| brief | `/gsp:project-brief` | project scoped | `/gsp:project-research` |
| research | `/gsp:project-research` | patterns and approaches researched | `/gsp:project-design` |
| design | `/gsp:project-design` | screens designed | `/gsp:project-critique` |
| critique | `/gsp:project-critique` | designs critiqued | `/gsp:project-build` |
| build | `/gsp:project-build` | designs translated to code | `/gsp:project-review` |
| review | `/gsp:project-review` | deliverables validated | `/gsp:launch` (or done) |

### Optional Phase

| Phase | Command | Completion Message | Next Command |
|-------|---------|-------------------|--------------|
| launch | `/gsp:launch` | campaign assets created | done |

## AskUserQuestion Options by Phase

Each phase transition offers exactly 3 options. The first is always "Continue to {next}", the second is "View progress", the third is "Done for now".

### Branding Transitions

| After Phase | Option 1 | Option 2 | Option 3 |
|-------------|----------|----------|----------|
| discover | Continue to strategy — "define positioning and personality" | View progress — "see the full dashboard" | Done for now — "pick up later with /gsp:start" |
| strategy | Continue to identity — "create voice and visual identity" | View progress — "see the full dashboard" | Done for now — "pick up later with /gsp:start" |
| verbal | Continue to identity — "create visual identity" | View progress — "see the full dashboard" | Done for now — "pick up later with /gsp:start" |
| identity | Continue to patterns — "build tokens and components" | View progress — "see the full dashboard" | Done for now — "pick up later with /gsp:start" |
| system | Start a project — "scope what you're building with this brand" | View progress — "see the full dashboard" | Done for now — "pick up later with /gsp:start" |

### Project Transitions

| After Phase | Option 1 | Option 2 | Option 3 |
|-------------|----------|----------|----------|
| brief | Continue to research — "research UX patterns and approaches" | View progress — "see the full dashboard" | Done for now — "pick up later with /gsp:start" |
| research | Continue to design — "design screens and flows" | View progress — "see the full dashboard" | Done for now — "pick up later with /gsp:start" |
| design | Continue to critique — "critique designs + accessibility audit" | View progress — "see the full dashboard" | Done for now — "pick up later with /gsp:start" |
| critique | Continue to build — "translate designs to code" | View progress — "see the full dashboard" | Done for now — "pick up later with /gsp:start" |
| build | Continue to review — "review deliverables against designs" | View progress — "see the full dashboard" | Done for now — "pick up later with /gsp:start" |
| review | Launch campaign — "create launch and marketing assets" | View progress — "see the full dashboard" | Done for now — "pick up later with /gsp:start" |

### Terminal Phase

| After Phase | Option 1 | Option 2 | Option 3 |
|-------------|----------|----------|----------|
| launch | View progress — "see the full dashboard" | Start new project — "scope another project" | Done — "that's a wrap" |

## File Tree Construction

The tree shows the actual files written during the phase. The agent should list the contents of the phase output directory and render them as a tree.

```
    {phase_dir}/
    ├── {file1}.md
    ├── {file2}.md
    ├── {subdir}/
    │   ├── {file3}.md
    │   └── {file4}.md
    └── INDEX.md
```

Rules:
- Root is the phase directory name followed by `/`
- Files sorted alphabetically, directories first
- INDEX.md always listed last
- Indent: 4 spaces from left margin for the tree root, connectors add 4 more
- Use `├──` for all items except the last, which uses `└──`
- Subdirectories show their contents with `│` continuation

## States

### Default (phase completed successfully)

As rendered above. Completion diamond, message, file tree, divider, routing.

### Phase with Critique Loop

When `/gsp:project-critique` finds critical issues, it loops back instead of completing:

```

  ◈ critique — critical issues found, revising designs

  ──────────────────────────────

```

Then `AskUserQuestion`:
- **Revise designs** — "address critical issues and re-run critique"
- **Override and continue** — "accept current designs and move to build"
- **View issues** — "see the full critique report"

Note: uses `◈` (active, accent) instead of `◆` (complete) because the phase is not finished.

### Final Phase (all done)

When the last phase in a pipeline completes:

```

  ◆ review complete — deliverables validated

    review/
    ├── acceptance-report.md
    ├── issues.md
    └── INDEX.md

  ──────────────────────────────

  fully pretty.

```

The "fully pretty." line appears only when ALL phases across ALL brands and projects are complete. Uses text-primary color.

## Responsive Behavior

### Wide (>100 cols)

No change. Content is left-aligned with 2-space indent.

### Standard (60-100 cols)

Default layout.

### Narrow (<60 cols)

File tree may truncate long filenames. Completion line wraps if needed. Divider shortens to fit: `min(30, columns - 4)` characters.

## Accessibility

### NO_COLOR

Diamond symbols carry the state information. Tree connectors remain. The completion message is plain text.

### Screen Reader

- Completion line reads naturally: "diamond strategy complete dash brand platform defined"
- File tree reads as a list of filenames with connector characters
- AskUserQuestion routing is handled by the tool's native accessibility

## Agent Rendering Instructions (Type B)

This template is embedded at the end of each phase command's `<process>` section. The agent renders it after completing all phase work.

Key ANSI sequences:

```
Completion line:
  \x1b[38;2;255;107;53m  ◆\x1b[0m \x1b[1m\x1b[38;2;255;107;53mstrategy\x1b[0m \x1b[38;2;224;224;224mcomplete\x1b[0m \x1b[38;2;160;160;160m— brand platform defined\x1b[0m

Tree root:
  \x1b[38;2;160;160;160m    strategy/\x1b[0m

Tree item:
  \x1b[38;2;102;102;102m    ├── \x1b[0m\x1b[38;2;160;160;160marchetype.md\x1b[0m

Tree last item:
  \x1b[38;2;102;102;102m    └── \x1b[0m\x1b[38;2;160;160;160mINDEX.md\x1b[0m

Divider:
  \x1b[38;2;102;102;102m  ──────────────────────────────\x1b[0m
```

After rendering the styled output, the agent uses `AskUserQuestion` with the 3 options for the current phase. The options use the phase-specific copy from the tables above.

### Implementation Pattern for Command Files

Each phase command file should include this at the end of its `<process>` section:

```markdown
## Phase Completion Output

After all phase work is complete, render the phase transition screen:

1. Output the completion line with the phase-specific message
2. List all files written to the phase directory as a tree
3. Output a plain divider (30 `─` characters in text-tertiary)
4. Use `AskUserQuestion` with the 3 routing options

See the Phase Transitions design spec for exact ANSI sequences and copy.
```

This reference pattern avoids duplicating the full template across 12 files while keeping each command file self-contained enough for agents to follow.

---

## Related

- [Screen 04 - Start Greeting](./screen-04-start-greeting.md)
- [Screen 03 - Progress Dashboard](./screen-03-progress-dashboard.md)
- [Component Plan](./shared/component-plan.md)
- [Information Architecture](./shared/information-architecture.md)
