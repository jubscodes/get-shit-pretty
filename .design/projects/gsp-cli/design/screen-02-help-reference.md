# Screen 02: Help Reference

> Phase: design | Project: gsp-cli | Generated: 2026-03-08

---

## Purpose

Command reference. Appears when the user runs `/gsp:help`. Provides a scannable listing of all commands organized by workflow phase, plus the `.design/` directory structure. The user is task-oriented here — get out of the way.

**Type:** B (Agent Output Template in `commands/gsp/help.md`)
**Tone:** Neutral + clear
**Density:** High (50-60 lines)

## Components Used

- **Brand Mark** — Header element with default state
- **Divider (labeled)** — Section separators for Getting Started, Branding, Project, Utilities
- **Key-Value** — Command name (bold) + description (secondary)
- **Tree** — `.design/` directory structure

## Rendered Output (80 columns)

The agent should output the following. Color annotations shown inline — the agent rendering instructions below provide the literal ANSI sequences.

```
  /gsp: ◇◇  v0.4.2
  command reference


  ─── Getting Started ──────────────────

    /gsp:start             start here — picks up where you left off
    /gsp:help              this command reference
    /gsp:progress          how pretty are we?

  ─── Branding ─────────────────────────

    /gsp:brand-research    research your market and audience
    /gsp:brand-strategy    define positioning and personality
    /gsp:brand-verbal      shape voice and messaging
    /gsp:brand-identity    create visual identity
    /gsp:brand-patterns    build design system tokens and components
    /gsp:brand-audit       audit existing brand before evolving (optional)

  ─── Project ──────────────────────────

    /gsp:project-brief     scope what you're building
    /gsp:project-research  research UX patterns and approaches
    /gsp:project-design    design screens and flows
    /gsp:project-critique  critique designs + accessibility audit
    /gsp:project-build     translate designs to code
    /gsp:project-review    review deliverables against designs

  ─── Utilities ────────────────────────

    /gsp:doctor            check project health
    /gsp:update            update GSP to latest version
    /gsp:launch            create launch and marketing assets (optional)

  ─── Flow ─────────────────────────────

    brand first, then build.

    branding   research → strategy → verbal → identity → patterns
    project    brief → research → design → critique → build → review

  ─── Directory Structure ──────────────

    .design/
    ├── branding/
    │   └── {brand}/
    │       ├── config.json       brand config
    │       ├── STATE.md          progress tracking
    │       ├── discover/         research chunks
    │       ├── strategy/         strategy chunks
    │       ├── verbal/           voice and messaging
    │       ├── identity/         visual identity
    │       └── system/           tokens + components
    └── projects/
        └── {project}/
            ├── config.json       project config
            ├── STATE.md          progress tracking
            ├── brand.ref         brand reference
            ├── brief/            scope + adaptations
            ├── research/         UX + tech research
            ├── design/           screen specs
            ├── critique/         design critique
            ├── build/            implementation
            ├── review/           acceptance
            └── exports/INDEX.md  chunk index

  get-shit-pretty v0.4.2
  github.com/juliuslipp/get-shit-pretty
```

## Styling Specification

| Element | Color | Weight |
|---------|-------|--------|
| `/gsp:` in brand mark | accent + bold | `\x1b[1m\x1b[38;2;255;107;53m` |
| `◇◇` diamonds | text-tertiary | `\x1b[38;2;102;102;102m` |
| Version | dim | `\x1b[2m` |
| "command reference" subtitle | text-secondary | `\x1b[38;2;160;160;160m` |
| Labeled divider `───` | text-tertiary | `\x1b[38;2;102;102;102m` |
| Divider label text | text-secondary + bold | `\x1b[1m\x1b[38;2;160;160;160m` |
| Command names | accent + bold | `\x1b[1m\x1b[38;2;255;107;53m` |
| Command descriptions | text-secondary | `\x1b[38;2;160;160;160m` |
| Flow phase names | text-primary | `\x1b[38;2;224;224;224m` |
| Flow arrows `→` | text-tertiary | `\x1b[38;2;102;102;102m` |
| Tree connectors `├──`, `└──`, `│` | text-tertiary | `\x1b[38;2;102;102;102m` |
| Tree labels (dir/file names) | text-secondary | `\x1b[38;2;160;160;160m` |
| Tree descriptions | text-tertiary | `\x1b[38;2;102;102;102m` |
| Footer version | dim | `\x1b[2m` |
| Footer URL | dim | `\x1b[2m` |

## Key-Value Alignment

Command names are left-padded with 4 spaces (indent-2). Descriptions start at column 27 (4 indent + 23 max command name width). Use spaces to right-pad command names to 23 characters.

```
    /gsp:start             start here — picks up where you left off
    ^^^^                   ^^^^
    indent-2               col 27
```

## States

### Default

As rendered above. Shows all commands grouped by workflow phase.

### Empty / Loading / Error

Not applicable. This screen is a static reference rendered from a template. There is no data to load or fail.

## Responsive Behavior

### Wide Terminal (>100 cols)

No change. Content is left-aligned with 2-space base indent. Extra width is empty.

### Standard (60-100 cols)

Default layout as shown.

### Narrow (<60 cols)

Command descriptions may wrap. The key-value alignment breaks below ~55 cols, but the output remains readable — command name on one line, description wrapping to the next.

Tree structure remains unchanged (deepest nesting is 20 chars).

## Accessibility

### NO_COLOR

All ANSI codes suppressed. The output retains its structure through indentation, `───` dividers, and `├──`/`└──` tree connectors. Command names are distinguishable by their `/gsp:` prefix.

### Screen Reader

- Labeled dividers read as "Getting Started" preceded/followed by dashes — acceptable
- Command names include the `/gsp:` prefix which provides context
- Tree connectors read as box-drawing characters — functional but noisy. The indentation provides the same structural information.

## Agent Rendering Instructions (Type B)

The agent should output this screen using literal ANSI escape codes. Key sequences:

```
Brand mark line:
  \x1b[1m\x1b[38;2;255;107;53m/gsp:\x1b[0m \x1b[38;2;102;102;102m◇◇\x1b[0m  \x1b[2mv0.4.2\x1b[0m

Labeled divider:
  \x1b[38;2;102;102;102m  ─── \x1b[0m\x1b[1m\x1b[38;2;160;160;160mGetting Started\x1b[0m\x1b[38;2;102;102;102m ──────────────────\x1b[0m

Command key-value:
  \x1b[38;2;102;102;102m    \x1b[0m\x1b[1m\x1b[38;2;255;107;53m/gsp:start\x1b[0m             \x1b[38;2;160;160;160mstart here — picks up where you left off\x1b[0m

Tree line:
  \x1b[38;2;102;102;102m    ├── \x1b[0m\x1b[38;2;160;160;160mcommands/gsp/\x1b[0m      \x1b[38;2;102;102;102m20 commands\x1b[0m
```

The agent reads the current version from `.claude/get-shit-pretty/VERSION` (or defaults to `0.4.2`). Diamond state reflects current pipeline if detectable from `.design/` scan, otherwise defaults to `◇◇`.

Output this as a single block of text. Do NOT add commentary, analysis, or suggestions. The help reference IS the output.

---

## Related

- [Screen 04 - Start Greeting](./screen-04-start-greeting.md)
- [Screen 03 - Progress Dashboard](./screen-03-progress-dashboard.md)
- [Component Plan](./shared/component-plan.md)
