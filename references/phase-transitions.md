# Phase Transition Screen

Rendered at the end of every phase command. Confirms what was accomplished, shows output artifacts, and routes to next phase.

## ANSI Color Tokens

| Element | ANSI Code |
|---------|-----------|
| `◆` completion diamond | `\x1b[38;2;255;107;53m` (accent) |
| Phase name | `\x1b[1m\x1b[38;2;255;107;53m` (accent + bold) |
| "complete" text | `\x1b[38;2;224;224;224m` (primary) |
| `—` dash | `\x1b[38;2;160;160;160m` (secondary) |
| Completion message | `\x1b[38;2;160;160;160m` (secondary) |
| Directory name | `\x1b[38;2;160;160;160m` (secondary) |
| Tree connectors `├──`, `└──`, `│` | `\x1b[38;2;102;102;102m` (tertiary) |
| File names | `\x1b[38;2;160;160;160m` (secondary) |
| Divider `──────` | `\x1b[38;2;102;102;102m` (tertiary) |
| "fully pretty." | `\x1b[38;2;224;224;224m` (primary) |
| `◈` active (critique loop) | `\x1b[38;2;255;107;53m` (accent) |
| Reset | `\x1b[0m` |

## Template

```
                                                ← 1 blank line

  ◆ {phase} complete — {completion_message}

    {phase_dir}/
    ├── {file1}.md
    ├── {file2}.md
    └── INDEX.md

  ──────────────────────────────

```

Then use `AskUserQuestion` with 3 options.

## Completion Messages

### Branding Phases

| Phase | Completion Message | Next Command |
|-------|-------------------|--------------|
| discover | market landscape mapped | `/gsp:brand-strategy` |
| strategy | brand platform defined | `/gsp:brand-identity` |
| verbal | voice and messaging shaped | `/gsp:brand-identity` |
| identity | visual system designed | `/gsp:brand-patterns` |
| system | design system built | `/gsp:project-brief` (or done) |

### Project Phases

| Phase | Completion Message | Next Command |
|-------|-------------------|--------------|
| brief | project scoped | `/gsp:project-research` |
| research | patterns and approaches researched | `/gsp:project-design` |
| design | screens designed | `/gsp:project-critique` |
| critique | designs critiqued | `/gsp:project-build` |
| build | code implemented | `/gsp:project-review` |
| review | implementation validated | `/gsp:launch` (or done) |

### Optional

| Phase | Completion Message | Next Command |
|-------|-------------------|--------------|
| launch | campaign assets created | done |

## AskUserQuestion Options

Each transition offers exactly 3 options:

1. **Continue to {next}** — "{description of next phase}"
2. **View progress** — "see the full dashboard"
3. **Done for now** — "pick up later with /gsp:start"

### Special cases

**Critique with critical issues:**
```
  ◈ critique — critical issues found, revising designs

  ──────────────────────────────
```
Options: Revise designs / Override and continue / View issues

**Final phase (all complete):**
Add `  fully pretty.` after the divider.

## File Tree Rules

- Root is the phase directory name followed by `/`
- Files sorted alphabetically, directories first
- INDEX.md always listed last
- Use `├──` for all items except the last, which uses `└──`
- Subdirectories show their contents with `│` continuation
