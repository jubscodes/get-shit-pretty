# Pipeline Flow

> Phase: system | Brand: get-shit-pretty | Generated: 2026-03-08

---

## Description

Visual representation of the pipeline as a horizontal flow of connected phase nodes. Each node shows its state through diamond symbols and color. Used to give an at-a-glance view of the entire pipeline and current position.

Use for: pipeline overview at session start, phase navigation display, pipeline progress summary.

## Anatomy

```
  {phase} ─── {phase} ─── {phase} ─── {phase} ─── {phase}
```

- **Phase nodes** -- phase name with state-dependent formatting
- **Connectors** -- three `─` characters in text-tertiary between nodes
- **Spacing** -- one space between node and connector on each side

## Variants

### Branding Pipeline

```
  discover ─── strategy ─── verbal ─── identity ─── system
```

### Project Pipeline

```
  brief ─── research ─── design ─── critique ─── build ─── review
```

### Dual Pipeline (Full)

Two lines showing both pipelines.

```
  ◆ discover ─── ◆ strategy ─── ◈ verbal ─── ◇ identity ─── ◇ system
  ◇ brief ─── ◇ research ─── ◇ design ─── ◇ critique ─── ◇ build ─── ◇ review
```

### Compact

For narrow terminals, vertical layout with tree characters.

```
  ◆ discover
  ◆ strategy
  ◈ verbal
  ◇ identity
  ◇ system
```

## Token Usage

| Token | Source | Value |
|-------|--------|-------|
| `ascii.box.horizontal` | tokens.json | `─` -- connector |
| `ascii.diamond.*` | tokens.json | `◇◈◆` -- state symbols |
| `color.accent` | color-system.md | `#FF6B35` -- active phase |
| `color.text-primary` | color-system.md | `#E0E0E0` -- completed phase names |
| `color.text-secondary` | color-system.md | `#A0A0A0` -- connector lines |
| `color.text-tertiary` | color-system.md | `#666666` -- pending phases, connectors |
| `color.success` | color-system.md | `#22C55E` -- completed diamond |
| `spacing.horizontal.indent-1` | spacing.md | 2 cols |

## Rendering Rules

1. Phase names in lowercase.
2. Connectors are three `─` characters with one space on each side, text-tertiary.
3. Completed phases: `◆` prefix, text-primary name.
4. Active phase: `◈` prefix, accent-colored name, bold.
5. Pending phases: `◇` prefix, text-tertiary name.
6. Horizontal layout if terminal width >= 80 cols (branding) or >= 100 cols (project pipeline).
7. Fall back to vertical compact layout in narrower terminals.
8. One blank line (space-1) before and after the pipeline flow.
9. Diamond symbols use the same color rules as brand-mark component.

## Rendered Examples

Branding pipeline mid-run:

```
  ◆ discover ─── ◆ strategy ─── ◈ verbal ─── ◇ identity ─── ◇ system
```

Branding complete:

```
  ◆ discover ─── ◆ strategy ─── ◆ verbal ─── ◆ identity ─── ◆ system
```

Vertical compact:

```
  ◆ discover
  │
  ◆ strategy
  │
  ◈ verbal
  │
  ◇ identity
  │
  ◇ system
```

Dual pipeline:

```
  Branding
  ◆ discover ─── ◆ strategy ─── ◆ verbal ─── ◆ identity ─── ◆ system

  Project
  ◆ brief ─── ◆ research ─── ◈ design ─── ◇ critique ─── ◇ build ─── ◇ review
```

## Implementation

```javascript
const RESET = '\x1b[0m'
const BOLD = '\x1b[1m'
const ACCENT = '\x1b[38;2;255;107;53m'
const PRIMARY = '\x1b[38;2;224;224;224m'
const TERTIARY = '\x1b[38;2;102;102;102m'

function pipelineFlow(phases, width = 80) {
  const connector = `${TERTIARY} ─── ${RESET}`

  const nodes = phases.map(({ name, state }) => {
    switch (state) {
      case 'complete':
        return `${PRIMARY}◆${RESET} ${PRIMARY}${name}${RESET}`
      case 'active':
        return `${ACCENT}◈${RESET} ${BOLD}${ACCENT}${name}${RESET}`
      case 'pending':
      default:
        return `${TERTIARY}◇ ${name}${RESET}`
    }
  })

  // Check if horizontal fits
  const plainLength = phases.reduce((acc, p) => acc + p.name.length + 2, 0)
    + (phases.length - 1) * 5 + 2
  if (plainLength <= width) {
    return `  ${nodes.join(connector)}`
  }

  // Vertical fallback
  return nodes.map(n => `  ${n}`).join(`\n  ${TERTIARY}│${RESET}\n`)
}
```

## Accessibility

- **Without color:** Diamond shapes (`◇◈◆`) convey state without color. Phase names are plain text.
- **Non-TTY / piped:** Render horizontally if it fits, vertical otherwise. Strip ANSI codes. Connectors and diamonds are Unicode, survive pipe.
- **Screen readers:** Reads as a sequence: "filled diamond discover, connecting line, filled diamond strategy..." Phase names and states are the essential content.

---

## Related

- [Brand Mark](./brand-mark.md) -- diamond states shared
- [Statusline](./statusline.md) -- compact single-line version of pipeline state
- [Phase Block](./phase-block.md) -- detailed view of a single phase
- [Divider](./divider.md) -- connectors share `─` character
- [../foundations/ascii-art.md](../foundations/ascii-art.md) -- diamond system
- [../foundations/content-patterns.md](../foundations/content-patterns.md) -- inline separator pattern
