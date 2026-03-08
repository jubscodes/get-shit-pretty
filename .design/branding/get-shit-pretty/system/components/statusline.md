# Statusline

> Phase: system | Brand: get-shit-pretty | Generated: 2026-03-08

---

## Description

Persistent single-line status display at the bottom of terminal output. Shows brand mark, project name, current phase, and progress in a dense, information-rich format. Updated in-place as the pipeline progresses.

Use for: persistent status during long-running sessions, at-a-glance pipeline state.

## Anatomy

```
  /gsp: ◆◈ {project} | {phase} | {progress}
```

- **Brand mark** -- state-aware lockup (compact)
- **Project name** -- bold text-primary
- **Phase** -- current active phase, accent if active
- **Progress** -- fraction or percentage, text-secondary
- **Separators** -- `|` in text-tertiary with 1 space padding

## Variants

### Active Pipeline

Full statusline with all segments.

```
  /gsp: ◆◈ get-shit-pretty | strategy | 3/6
```

### Idle

No active phase. Shows last state.

```
  /gsp: ◆◇ get-shit-pretty | branding complete
```

### Minimal

Very narrow terminals. Mark + phase only.

```
  /gsp: ◆◈ | strategy
```

## Token Usage

| Token | Source | Value |
|-------|--------|-------|
| `mark.states.*` | tokens.json | brand mark by state |
| `color.accent` | color-system.md | `#FF6B35` -- wordmark, active phase |
| `color.text-primary` | color-system.md | `#E0E0E0` -- project name |
| `color.text-secondary` | color-system.md | `#A0A0A0` -- progress count |
| `color.text-tertiary` | color-system.md | `#666666` -- separators |
| `typography.bold` | typography.md | `\x1b[1m` -- mark, project name |

## Rendering Rules

1. Single line. Never wrap. Truncate from the right if terminal is too narrow.
2. Brand mark always present. Project name next. Phase and progress are optional based on width.
3. Separators are `|` in text-tertiary, padded with one space on each side.
4. Active phase name is accent-colored. Completed phases show no color.
5. Progress shows as fraction (`3/6`) when total is known, percentage (`45%`) otherwise.
6. Update in-place via `\r` on stderr.
7. When the pipeline finishes, the statusline resolves to final state and stops updating.
8. Priority order for narrow terminals: mark > phase > project > progress.

## Rendered Examples

Full active statusline:

```
  /gsp: ◆◈ get-shit-pretty | strategy | 3/6
```

Branding complete, idle:

```
  /gsp: ◆◇ get-shit-pretty | branding complete
```

All shipped:

```
  /gsp: ◆◆ get-shit-pretty | shipped
```

Narrow (< 60 cols):

```
  /gsp: ◆◈ | strategy | 3/6
```

Very narrow (< 40 cols):

```
  /gsp: ◆◈ | strategy
```

## Implementation

```javascript
const RESET = '\x1b[0m'
const BOLD = '\x1b[1m'
const ACCENT = '\x1b[38;2;255;107;53m'
const PRIMARY = '\x1b[38;2;224;224;224m'
const SECONDARY = '\x1b[38;2;160;160;160m'
const TERTIARY = '\x1b[38;2;102;102;102m'
const CLEAR_LINE = '\x1b[2K'

function statusline(mark, project, phase, progress, width = 80) {
  const sep = `${TERTIARY} | ${RESET}`
  const parts = [mark]

  if (width >= 60) parts.push(`${BOLD}${PRIMARY}${project}${RESET}`)
  if (phase) parts.push(`${ACCENT}${phase}${RESET}`)
  if (progress && width >= 50) parts.push(`${SECONDARY}${progress}${RESET}`)

  const line = `  ${parts.join(sep)}`
  process.stderr.write(`${CLEAR_LINE}\r${line}`)
}

function clearStatusline() {
  process.stderr.write(`${CLEAR_LINE}\r`)
}
```

## Accessibility

- **Without color:** All segments separated by `|` character. Brand mark, project name, phase, and progress are distinct text segments.
- **Non-TTY / piped:** Do not render statusline. It is an interactive-only component. In non-TTY, pipeline progress is communicated through status messages and phase completion blocks.
- **Screen readers:** Single-line status is read as a continuous string. Separator characters provide structure.

---

## Related

- [Brand Mark](./brand-mark.md) -- mark rendering rules
- [Phase Block](./phase-block.md) -- provides the data for statusline progress
- [Pipeline Flow](./pipeline-flow.md) -- expanded version of pipeline state
- [../foundations/motion.md](../foundations/motion.md) -- in-place update rules
