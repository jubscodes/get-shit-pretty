# Progress Bar

> Phase: system | Brand: get-shit-pretty | Generated: 2026-03-08

---

## Description

Determinate progress indicator for operations with known completion percentage. Uses density ramp characters (`▓` filled, `░` empty) in a fixed-width bar with percentage and optional message. Updates in-place via carriage return.

Use for: chunk writing (N of M), file processing, multi-step operations with known totals.

## Anatomy

```
  ▓▓▓▓▓▓▓▓░░░░░░░░░░░░  40%  {message}
  ╰─── filled ───╯╰─ empty ─╯  ╰%─╯  ╰──── optional ────╯
```

- **Filled segment** -- `▓` (dark shade) in accent color
- **Empty segment** -- `░` (light shade) in text-tertiary
- **Bar width** -- 20 characters total
- **Percentage** -- right after bar, 2-space gap, right-aligned to 4 chars
- **Message** -- optional, 2-space gap after percentage, text-secondary

## Variants

### Standard

20-char bar with percentage.

### With Message

Bar + percentage + descriptive message.

### Compact

10-char bar for narrow terminals. Percentage only, no message.

### Complete

Full bar in accent, percentage shows 100%, resolves to a status message.

## Token Usage

| Token | Source | Value |
|-------|--------|-------|
| `ascii.density-ramp.dark` | tokens.json | `▓` -- filled segment |
| `ascii.density-ramp.light` | tokens.json | `░` -- empty segment |
| `color.accent` | color-system.md | `#FF6B35` -- filled bar |
| `color.text-tertiary` | color-system.md | `#666666` -- empty bar |
| `color.text-secondary` | color-system.md | `#A0A0A0` -- message |
| `spacing.horizontal.indent-1` | spacing.md | 2 cols |

## Rendering Rules

1. Bar width is 20 characters at standard terminal width. 10 at narrow (< 40 cols).
2. Filled characters use accent color. Empty characters use text-tertiary.
3. Percentage is displayed as integer with `%` suffix, right-aligned to 4 chars (`  0%` to `100%`).
4. Update in-place using `\r` (carriage return). Clear the line before redrawing.
5. Write to stderr (keeps stdout clean for piping).
6. On completion (100%), replace the entire progress bar with a success status message.
7. Bar is positioned at indent-1 (2 spaces from left edge).
8. Hide cursor during progress bar animation. Restore on completion.
9. Minimum update frequency: every 1% or 100ms, whichever is less frequent. Avoid flooding.

## Rendered Examples

Empty:

```
  ░░░░░░░░░░░░░░░░░░░░   0%
```

Partial with message:

```
  ▓▓▓▓▓▓░░░░░░░░░░░░░░  30%  writing strategy chunks...
```

Almost done:

```
  ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓░░  90%  writing positioning.md...
```

Complete (resolves to status message):

```
  ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓ 100%
  ✓ 6 chunks written
```

Compact (narrow):

```
  ▓▓▓░░░░░░░  30%
```

## Implementation

```javascript
const RESET = '\x1b[0m'
const ACCENT = '\x1b[38;2;255;107;53m'
const TERTIARY = '\x1b[38;2;102;102;102m'
const SECONDARY = '\x1b[38;2;160;160;160m'
const HIDE_CURSOR = '\x1b[?25l'
const SHOW_CURSOR = '\x1b[?25h'

function progressBar(current, total, message = '', barWidth = 20) {
  const pct = Math.round((current / total) * 100)
  const filled = Math.round((current / total) * barWidth)
  const empty = barWidth - filled

  const bar =
    `${ACCENT}${'▓'.repeat(filled)}${RESET}` +
    `${TERTIARY}${'░'.repeat(empty)}${RESET}`
  const pctStr = String(pct).padStart(3) + '%'
  const msg = message ? `  ${SECONDARY}${message}${RESET}` : ''

  process.stderr.write(`\r  ${bar} ${pctStr}${msg}`)

  if (pct >= 100) {
    process.stderr.write('\n')
    process.stderr.write(SHOW_CURSOR)
  }
}

function startProgress() {
  process.stderr.write(HIDE_CURSOR)
  // Set up cleanup handlers (see motion.md)
}
```

## Accessibility

- **Without color:** `▓` and `░` are visually distinct characters even without color. Percentage provides the precise numeric value.
- **Non-TTY / piped:** No in-place updates. Print progress at 0%, 25%, 50%, 75%, 100% as separate lines with status-message format:
  `  ◈ 25% writing chunks...`
  `  ◈ 50% writing chunks...`
  `  ✓ 100% 6 chunks written`
- **Screen readers:** Percentage value is the accessible content. Bar characters are decorative.

---

## Related

- [Spinner](./spinner.md) -- for indeterminate progress (unknown total)
- [Status Message](./status-message.md) -- bar resolves to a status message on completion
- [Phase Block](./phase-block.md) -- progress bar may appear within a phase block
- [../foundations/ascii-art.md](../foundations/ascii-art.md) -- density ramp characters
- [../foundations/motion.md](../foundations/motion.md) -- in-place update rules
