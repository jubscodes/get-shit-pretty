# Screen 03: Progress Dashboard

> Phase: design | Project: gsp-cli | Generated: 2026-03-08

---

## Purpose

Status check. Appears when the user runs `/gsp:progress`. Shows progress across all brands and projects with diamond state indicators, pipeline flows, and progress bars. The user wants truth, not cheerleading.

**Type:** B (Agent Output Template in `commands/gsp/progress.md`)
**Tone:** Honest + encouraging
**Density:** Medium (25-40 lines depending on instance count)

## Components Used

- **Brand Mark** — Header with current state diamonds
- **Pipeline Flow** — Horizontal with diamond states per brand/project
- **Progress Bar** — `████░░░░` with percentage and fraction
- **Table** — Phase status with diamond symbols, chunk count, timing
- **Divider (labeled)** — Section separators for brands/projects
- **Key-Value** — Summary stats at bottom

## Rendered Output: Early State (2/5 branding phases)

```
  /gsp: ◈◇


  ─── Brands ───────────────────────────

  acme-corp
  ◆ discover ─── ◆ strategy ─── ◈ verbal ─── ◇ identity ─── ◇ patterns
  ████████░░░░░░░░░░░░ 40% (2/5)

    Phase          Status    Chunks    Time
    discover       ◆         6         2m
    strategy       ◆         5         4m
    verbal         ◈         —         —
    identity       ◇         —         —
    patterns       ◇         —         —

  → next: /gsp:brand-verbal


  ─── Overall ──────────────────────────

    brands      1 in progress
    projects    0
    phases      2/5 complete
    chunks      11 written
```

## Rendered Output: Late State (branding complete, 4/6 project phases)

```
  /gsp: ◆◈


  ─── Brands ───────────────────────────

  acme-corp
  ◆ discover ─── ◆ strategy ─── ◆ verbal ─── ◆ identity ─── ◆ patterns
  ████████████████████ 100% (5/5)


  ─── Projects ─────────────────────────

  acme-website                                       brand: acme-corp
  ◆ brief ─── ◆ research ─── ◆ design ─── ◆ critique ─── ◈ build ─── ◇ review
  ████████████████░░░░ 66% (4/6)

    Phase          Status    Chunks    Time
    brief          ◆         3         1m
    research       ◆         7         5m
    design         ◆         8         12m
    critique       ◆         4         3m
    build          ◈         —         —
    review         ◇         —         —

  → next: /gsp:project-build


  ─── Overall ──────────────────────────

    brands      1 complete
    projects    1 in progress
    phases      9/11 complete
    chunks      33 written
```

## Styling Specification

| Element | Color | ANSI Code |
|---------|-------|-----------|
| Brand mark `/gsp:` | accent + bold | `\x1b[1m\x1b[38;2;255;107;53m` |
| Diamonds (state-aware) | see diamond states below | |
| Labeled divider `───` | text-tertiary | `\x1b[38;2;102;102;102m` |
| Divider label | secondary + bold | `\x1b[1m\x1b[38;2;160;160;160m` |
| Instance name (e.g., "acme-corp") | primary + bold | `\x1b[1m\x1b[38;2;224;224;224m` |
| Pipeline `◆` complete phases | text-primary | `\x1b[38;2;224;224;224m` |
| Pipeline `◈` active phase | accent | `\x1b[38;2;255;107;53m` |
| Pipeline `◇` pending phases | text-tertiary | `\x1b[38;2;102;102;102m` |
| Pipeline connectors `───` | text-tertiary | `\x1b[38;2;102;102;102m` |
| Pipeline phase names (complete) | text-primary | `\x1b[38;2;224;224;224m` |
| Pipeline phase names (active) | accent | `\x1b[38;2;255;107;53m` |
| Pipeline phase names (pending) | text-tertiary | `\x1b[38;2;102;102;102m` |
| Progress bar filled `█` | accent | `\x1b[38;2;255;107;53m` |
| Progress bar empty `░` | text-tertiary | `\x1b[38;2;102;102;102m` |
| Percentage + fraction | text-secondary | `\x1b[38;2;160;160;160m` |
| Table header | text-secondary + bold | `\x1b[1m\x1b[38;2;160;160;160m` |
| Table phase names | text-primary | `\x1b[38;2;224;224;224m` |
| Table diamond symbols | same as pipeline | |
| Table values (chunks, time) | text-secondary | `\x1b[38;2;160;160;160m` |
| Table pending `—` | text-tertiary | `\x1b[38;2;102;102;102m` |
| Next command `→` | text-secondary | `\x1b[38;2;160;160;160m` |
| Next command name | accent | `\x1b[38;2;255;107;53m` |
| Summary keys | text-secondary | `\x1b[38;2;160;160;160m` |
| Summary values | text-primary | `\x1b[38;2;224;224;224m` |
| "brand: acme-corp" reference | text-tertiary | `\x1b[38;2;102;102;102m` |

## Diamond State in Brand Mark

The Brand Mark diamonds reflect the overall pipeline state:

| State | Brand Mark | Meaning |
|-------|-----------|---------|
| `◇◇` | No brands, no projects | Fresh install |
| `◈◇` | Branding in progress | Working on brand |
| `◆◇` | Branding complete, no projects | Brand done |
| `◆◈` | Branding complete, project in progress | Working on project |
| `◆◆` | All complete | Fully pretty |
| `◈◈` | Both in progress | Parallel work |

First diamond = branding status (highest). Second diamond = project status (highest).

## Progress Bar Construction

The progress bar width adapts to terminal width:

```
  ████████░░░░░░░░░░░░ 40% (2/5)
  ^^                   ^^ ^^
  indent-1             %   fraction
```

- **Bar width:** `min(20, columns - 2 - 1 - 10)` where 2 = indent, 1 = space, 10 = ` 100% (X/Y)`
- **Minimum bar width:** 10 characters
- **Below 40 columns:** Show percentage only, no bar: `  40% (2/5)`
- **Filled chars:** `Math.round(bar_width * completed / total)`

## Table Alignment

No vertical borders. Columns aligned with spaces:

```
    Phase          Status    Chunks    Time
    ^^^^^^         ^^^^^^    ^^^^^^    ^^^^
    col 4          col 19    col 29    col 39
```

Column positions: 4, 19, 29, 39. Phase names left-aligned, status/chunks/time left-aligned within their columns.

## States

### Default

As rendered above. Shows all brands and projects with their current states.

### Empty (no `.design/` found)

```
  /gsp: ◇◇

  no brands or projects found.
  run /gsp:start to begin.
```

### All Complete

```
  /gsp: ◆◆


  ─── Brands ───────────────────────────

  acme-corp
  ◆ discover ─── ◆ strategy ─── ◆ verbal ─── ◆ identity ─── ◆ patterns
  ████████████████████ 100% (5/5)


  ─── Projects ─────────────────────────

  acme-website                                       brand: acme-corp
  ◆ brief ─── ◆ research ─── ◆ design ─── ◆ critique ─── ◆ build ─── ◆ review
  ████████████████████ 100% (6/6)


  ─── Overall ──────────────────────────

    brands      1 complete
    projects    1 complete
    phases      11/11 complete
    chunks      48 written

  fully pretty.
```

### Multiple Instances

When multiple brands or projects exist, each gets its own pipeline flow and progress bar under the same section divider. Separated by 1 blank line between instances.

## Responsive Behavior

### Wide (>100 cols)

Pipeline flow remains horizontal. No layout changes.

### Standard (60-100 cols)

Default layout as shown.

### Narrow (<60 cols)

Pipeline flow switches to vertical compact format:

```
  ◆ discover
  ◆ strategy
  ◈ verbal
  ◇ identity
  ◇ patterns
```

Progress bar reduces width or shows percentage only. Table columns compress.

## Accessibility

### NO_COLOR

Diamond symbols (`◆`, `◈`, `◇`) and progress bar characters (`█`, `░`) remain. The state information is carried by symbol shape, not just color. Table alignment preserved through spacing.

### Screen Reader

- Pipeline flow reads as a sequence of state symbols and phase names
- Progress bar reads as block characters followed by the percentage — the percentage is the meaningful content
- Table reads row by row with aligned columns

## Agent Rendering Instructions (Type B)

The agent scans `.design/branding/` and `.design/projects/` to discover instances. For each, it reads `STATE.md` and `config.json` to determine phase statuses.

Key ANSI sequences for rendering:

```
Brand mark:
  \x1b[1m\x1b[38;2;255;107;53m/gsp:\x1b[0m \x1b[38;2;255;107;53m◈\x1b[0m\x1b[38;2;102;102;102m◇\x1b[0m

Pipeline flow (complete phase):
  \x1b[38;2;224;224;224m◆ discover\x1b[0m \x1b[38;2;102;102;102m───\x1b[0m

Pipeline flow (active phase):
  \x1b[38;2;255;107;53m◈ verbal\x1b[0m \x1b[38;2;102;102;102m───\x1b[0m

Pipeline flow (pending phase):
  \x1b[38;2;102;102;102m◇ identity\x1b[0m

Progress bar:
  \x1b[38;2;255;107;53m████████\x1b[0m\x1b[38;2;102;102;102m░░░░░░░░░░░░\x1b[0m \x1b[38;2;160;160;160m40% (2/5)\x1b[0m

Next command:
  \x1b[38;2;160;160;160m  → next: \x1b[0m\x1b[38;2;255;107;53m/gsp:brand-verbal\x1b[0m
```

Phase completion counts come from counting `.md` files in each phase directory (excluding INDEX.md). Timing data comes from STATE.md `completed_at` timestamps.

Output this as a single block. Do NOT add commentary or suggestions beyond the dashboard content.

---

## Related

- [Screen 04 - Start Greeting](./screen-04-start-greeting.md)
- [Screen 05 - Phase Transitions](./screen-05-phase-transitions.md)
- [Component Plan](./shared/component-plan.md)
