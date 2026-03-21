# Statusline

> Phase: system | Brand: get-shit-pretty-v2 | Generated: 2026-03-19

---

## Description

Persistent single-line status display at the bottom of terminal output. Shows brand mark, project name, current phase, and progress in a dense, information-rich format. Updated in-place as the pipeline progresses.

Use for: persistent status during long-running sessions, at-a-glance pipeline state.

## Anatomy

```
  /gsp: ◆◈ {project} | {phase} | {progress}
```

- **Brand mark** -- state-aware lockup (compact)
- **Project name** -- bold `--color-text`
- **Phase** -- current active phase, accent if active
- **Progress** -- fraction or percentage, `--color-text-muted`
- **Separators** -- `|` in `--color-border` with 1 space padding

## Variants

### Active Pipeline

```
  /gsp: ◆◈ get-shit-pretty | strategy | 3/6
```

### Idle

```
  /gsp: ◆◇ get-shit-pretty | branding complete
```

### Minimal (< 60 cols)

```
  /gsp: ◆◈ | strategy | 3/6
```

### Very Narrow (< 40 cols)

```
  /gsp: ◆◈ | strategy
```

## Token Usage

| Element | Token | Reference |
|---------|-------|-----------|
| Brand mark | See [brand-mark.md](./brand-mark.md) | State-aware diamonds |
| Project name | `--color-text` + bold | `color.text.primary` = `#E8E8E8` |
| Active phase | `--color-accent` | `color.accent.default` = `#E5A00D` |
| Progress | `--color-text-muted` | `color.text.muted` = `#6B6B6B` |
| Separators `\|` | `--color-border` | `color.foundation.border` = `#1E1E1E` |

## Rendering Rules

1. Single line. Never wrap. Truncate from the right if too narrow.
2. Brand mark always present. Project name next. Phase and progress are optional.
3. Separators are `|` in border color, padded with one space each side.
4. Active phase name is accent-colored. Completed phases show no color.
5. Progress shows as fraction (`3/6`) when total is known, percentage otherwise.
6. Update in-place via `\r` on stderr.
7. When pipeline finishes, statusline resolves to final state and stops updating.
8. Priority order for narrow terminals: mark > phase > project > progress.

## Code Hints

```javascript
const RESET = '\x1b[0m';
const BOLD = '\x1b[1m';
const ACCENT = '\x1b[38;2;229;160;13m';       // #E5A00D
const TEXT = '\x1b[38;2;232;232;232m';         // #E8E8E8
const MUTED = '\x1b[38;2;107;107;107m';        // #6B6B6B
const BORDER = '\x1b[38;2;30;30;30m';          // #1E1E1E
const CLEAR_LINE = '\x1b[2K';

function statusline(mark, project, phase, progress, width = 80) {
  const sep = `${BORDER} | ${RESET}`;
  const parts = [mark];

  if (width >= 60) parts.push(`${BOLD}${TEXT}${project}${RESET}`);
  if (phase) parts.push(`${ACCENT}${phase}${RESET}`);
  if (progress && width >= 50) parts.push(`${MUTED}${progress}${RESET}`);

  const line = `  ${parts.join(sep)}`;
  process.stderr.write(`${CLEAR_LINE}\r${line}`);
}
```

## Accessibility

- **NO_COLOR:** All segments separated by `|` character. Plain text is structured.
- **Non-TTY / piped:** Do not render statusline. It is interactive-only. Pipeline progress communicated through status messages and phase blocks.
- **Screen readers:** Single-line status reads as continuous string.

---

## Related

- [Brand Mark](./brand-mark.md) -- mark rendering rules
- [Phase Block](./phase-block.md) -- provides data for statusline
- [Pipeline Flow](./pipeline-flow.md) -- expanded version of pipeline state
- [../foundations/color-system.md](../foundations/color-system.md)
