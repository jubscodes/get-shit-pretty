# Pipeline Flow

> Phase: system | Brand: get-shit-pretty-v2 | Generated: 2026-03-19

---

## Description

Visual representation of the pipeline as a horizontal flow of connected phase nodes. Each node shows its state through diamond symbols and color. Used for at-a-glance pipeline overview.

Use for: pipeline overview at session start, phase navigation display, pipeline progress summary.

## Anatomy

```
  {diamond} {phase} ─── {diamond} {phase} ─── {diamond} {phase}
```

- **Phase nodes** -- diamond + phase name with state-dependent formatting
- **Connectors** -- three `─` characters in border color between nodes
- **Spacing** -- one space between node and connector on each side

## Variants

### Branding Pipeline

```
  ◆ discover ─── ◆ strategy ─── ◈ identity ─── ◇ system
```

### Project Pipeline

```
  ◆ brief ─── ◆ research ─── ◈ design ─── ◇ critique ─── ◇ build ─── ◇ review
```

### Dual Pipeline

```
  Branding
  ◆ discover ─── ◆ strategy ─── ◆ identity ─── ◆ system

  Project
  ◆ brief ─── ◆ research ─── ◈ design ─── ◇ critique ─── ◇ build ─── ◇ review
```

### Compact (Vertical)

```
  ◆ discover
  │
  ◆ strategy
  │
  ◈ identity
  │
  ◇ system
```

## Token Usage

| Element | Token | Reference |
|---------|-------|-----------|
| Connector `─` | `component.box.horizontal` | Box-drawing horizontal |
| Connector color | `--color-border` | `color.foundation.border` = `#1E1E1E` |
| Diamond states | `component.diamond.*` | `◇`, `◈`, `◆` |
| Completed phase | `--color-text` | `color.text.primary` = `#E8E8E8` |
| Active phase | `--color-accent` + bold | `color.accent.default` = `#E5A00D` |
| Pending phase | `--color-text-muted` | `color.text.muted` = `#6B6B6B` |
| Indent | 2 cols | `--space-2` equivalent |

## Rendering Rules

1. Phase names in lowercase.
2. Connectors are three `─` characters with one space on each side, border color.
3. Completed phases: `◆` prefix in text-primary, text-primary name.
4. Active phase: `◈` prefix in accent, accent-colored name, bold.
5. Pending phases: `◇` prefix in text-muted, text-muted name.
6. Horizontal layout if terminal width >= 80 cols (branding) or >= 100 cols (project pipeline).
7. Fall back to vertical compact layout in narrower terminals.
8. One blank line before and after the pipeline flow.
9. Diamond color rules match brand-mark component.

### Color Tier Mapping

| Tier | Completed | Active | Pending | Connector |
|------|-----------|--------|---------|-----------|
| Truecolor | `\x1b[38;2;232;232;232m` | `\x1b[1m\x1b[38;2;229;160;13m` | `\x1b[38;2;107;107;107m` | `\x1b[38;2;30;30;30m` |
| 256-color | `\x1b[38;5;254m` | `\x1b[1m\x1b[38;5;178m` | `\x1b[38;5;242m` | `\x1b[38;5;234m` |
| 16-color | `\x1b[37m` | `\x1b[1m\x1b[33m` | `\x1b[90m` | `\x1b[90m` |
| No-color | `[x]` | `[>]` | `[ ]` | `---` |

## Code Hints

```javascript
const RESET = '\x1b[0m';
const BOLD = '\x1b[1m';
const ACCENT = '\x1b[38;2;229;160;13m';       // #E5A00D
const TEXT = '\x1b[38;2;232;232;232m';         // #E8E8E8
const MUTED = '\x1b[38;2;107;107;107m';        // #6B6B6B
const BORDER = '\x1b[38;2;30;30;30m';          // #1E1E1E

function pipelineFlow(phases, width = 80) {
  const connector = `${BORDER} ─── ${RESET}`;

  const nodes = phases.map(({ name, state }) => {
    switch (state) {
      case 'complete':
        return `${TEXT}◆${RESET} ${TEXT}${name}${RESET}`;
      case 'active':
        return `${ACCENT}◈${RESET} ${BOLD}${ACCENT}${name}${RESET}`;
      case 'pending':
      default:
        return `${MUTED}◇ ${name}${RESET}`;
    }
  });

  const plainLength = phases.reduce((acc, p) => acc + p.name.length + 2, 0)
    + (phases.length - 1) * 5 + 2;
  if (plainLength <= width) {
    return `  ${nodes.join(connector)}`;
  }

  return nodes.map(n => `  ${n}`).join(`\n  ${BORDER}│${RESET}\n`);
}
```

## Accessibility

- **NO_COLOR:** Diamond shapes convey state without color. Phase names are plain text.
- **Non-TTY / piped:** Render horizontally if it fits, vertical otherwise. Strip ANSI. Unicode survives pipe.
- **Screen readers:** "filled diamond discover, connecting line, filled diamond strategy..."

---

## Related

- [Brand Mark](./brand-mark.md) -- diamond states shared
- [Statusline](./statusline.md) -- compact single-line version
- [Phase Block](./phase-block.md) -- detailed view of a single phase
- [Divider](./divider.md) -- connectors share `─` character
- [../foundations/color-system.md](../foundations/color-system.md)
