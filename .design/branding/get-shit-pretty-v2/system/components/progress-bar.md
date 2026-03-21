# Progress Bar

> Phase: system | Brand: get-shit-pretty-v2 | Generated: 2026-03-19

---

## Description

Determinate progress indicator for operations with known completion percentage. Uses block characters (`▓` filled, `░` empty) in a fixed-width bar with percentage and optional message. Updates in-place via carriage return.

Use for: chunk writing (N of M), file processing, multi-step operations with known totals.

## Anatomy

```
  ▓▓▓▓▓▓▓▓░░░░░░░░░░░░  40%  {message}
  ╰─── filled ───╯╰─ empty ─╯  ╰%─╯  ╰──── optional ────╯
```

- **Filled segment** -- `▓` in `--color-accent`
- **Empty segment** -- `░` in `--color-border`
- **Bar width** -- 20 characters total
- **Percentage** -- right after bar, 2-space gap, right-aligned to 4 chars
- **Message** -- optional, 2-space gap after percentage, `--color-text-muted`

## Variants

| Variant | Bar Width | Message | Use |
|---------|-----------|---------|-----|
| **Standard** | 20 chars | Optional | Default progress display |
| **Compact** | 10 chars | No | Narrow terminals (< 40 cols) |
| **Complete** | 20 chars | Resolves to status | Full bar, transitions to `✓` message |

## Token Usage

| Element | Token | Reference |
|---------|-------|-----------|
| Filled char `▓` | `component.progress-bar.filled` | Block character |
| Empty char `░` | `component.progress-bar.empty` | Block character |
| Filled color | `--color-accent` | `color.accent.default` = `#E5A00D` |
| Empty color | `--color-border` | `color.foundation.border` = `#1E1E1E` |
| Message color | `--color-text-muted` | `color.text.muted` = `#6B6B6B` |
| Indent | 2 cols | `--space-2` equivalent |

## Rendering Rules

1. Bar width: 20 characters standard, 10 at narrow (< 40 cols).
2. Filled characters use accent color. Empty characters use border color.
3. Percentage displayed as integer with `%` suffix, right-aligned to 4 chars.
4. Update in-place using `\r`. Clear line before redrawing.
5. Write to stderr.
6. On completion (100%), replace progress bar with success status message.
7. Bar positioned at indent-1 (2 spaces from left).
8. Hide cursor during animation. Restore on completion.
9. Minimum update frequency: every 1% or 100ms, whichever is less frequent.

### Color Tier Mapping

| Tier | Filled `▓` | Empty `░` | Message |
|------|-----------|----------|---------|
| Truecolor | `\x1b[38;2;229;160;13m` | `\x1b[38;2;30;30;30m` | `\x1b[38;2;107;107;107m` |
| 256-color | `\x1b[38;5;178m` | `\x1b[38;5;234m` | `\x1b[38;5;242m` |
| 16-color | `\x1b[33m` | `\x1b[90m` | `\x1b[90m` |
| No-color | `#` | `.` | plain text |

## Rendered Examples

Partial with message:

```
  ▓▓▓▓▓▓░░░░░░░░░░░░░░  30%  writing strategy chunks...
```

Complete (resolves):

```
  ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓ 100%
  ✓ 6 chunks written
```

Compact (narrow):

```
  ▓▓▓░░░░░░░  30%
```

## Code Hints

```javascript
const RESET = '\x1b[0m';
const ACCENT = '\x1b[38;2;229;160;13m';       // #E5A00D
const BORDER = '\x1b[38;2;30;30;30m';          // #1E1E1E
const MUTED = '\x1b[38;2;107;107;107m';        // #6B6B6B
const HIDE = '\x1b[?25l';
const SHOW = '\x1b[?25h';

function progressBar(current, total, message = '', barWidth = 20) {
  const pct = Math.round((current / total) * 100);
  const filled = Math.round((current / total) * barWidth);
  const empty = barWidth - filled;

  const bar =
    `${ACCENT}${'▓'.repeat(filled)}${RESET}` +
    `${BORDER}${'░'.repeat(empty)}${RESET}`;
  const pctStr = String(pct).padStart(3) + '%';
  const msg = message ? `  ${MUTED}${message}${RESET}` : '';

  process.stderr.write(`\r  ${bar} ${pctStr}${msg}`);

  if (pct >= 100) {
    process.stderr.write('\n');
    process.stderr.write(SHOW);
  }
}
```

## Accessibility

- **NO_COLOR:** `▓` and `░` are visually distinct without color. Percentage provides precise numeric value.
- **Non-TTY / piped:** No in-place updates. Print at 0%, 25%, 50%, 75%, 100% as status messages.
- **Screen readers:** Percentage value is the accessible content. Bar characters are decorative.

---

## Related

- [Spinner](./spinner.md) -- for indeterminate progress
- [Status Message](./status-message.md) -- bar resolves to status message
- [Phase Block](./phase-block.md) -- progress bar may appear within phase output
- [../foundations/color-system.md](../foundations/color-system.md)
