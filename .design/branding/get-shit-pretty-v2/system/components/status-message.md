# Status Message

> Phase: system | Brand: get-shit-pretty-v2 | Generated: 2026-03-19

---

## Description

The atomic unit of GSP terminal output. A single line combining a semantic symbol, color, and message to communicate state. Every other component that reports status composes from this pattern.

Use for: file writes, validation results, phase transitions, inline feedback, sub-task completions.

## Anatomy

```
{indent}{symbol} {message}
{indent}  {detail-line}
```

- **indent** -- 2 spaces (indent-1) from left edge
- **symbol** -- one status character, colored by semantic meaning
- **message** -- `--color-text`, single line, max 76 chars
- **detail-line** (optional) -- indent-2 (4 spaces), `--color-text-muted`

## Variants

| Variant | Symbol | Color Token | Hex | ANSI 16 | Use |
|---------|--------|-------------|-----|---------|-----|
| **success** | `✓` | `--color-success` | `#3FB950` | `\x1b[32m` | Complete, passed, written |
| **error** | `✗` | `--color-error` | `#E54D42` | `\x1b[31m` | Failed, broken, missing |
| **warning** | `!` | `--color-warning` | `#D29922` | `\x1b[33m` | Caution, manual check |
| **info** | `i` | `--color-info` | `#58A6FF` | `\x1b[34m` | Neutral information |
| **progress** | `◈` | `--color-accent` | `#E5A00D` | `\x1b[33m` | In-progress, active |
| **complete** | `◆` | `--color-accent` | `#E5A00D` | `\x1b[33m` | Phase complete (brand) |
| **pending** | `◇` | `--color-text-muted` | `#6B6B6B` | `\x1b[90m` | Not started, queued |

## Token Usage

| Element | Token | Reference |
|---------|-------|-----------|
| Success `✓` | `component.status.success` | Symbol + `--color-success` |
| Error `✗` | `component.status.error` | Symbol + `--color-error` |
| Warning `!` | `component.status.warning` | Symbol + `--color-warning` |
| Info `i` | `component.status.info` | Symbol + `--color-info` |
| Progress `◈` | `component.status.progress` | Symbol + `--color-accent` |
| Complete `◆` | `component.status.complete` | Symbol + `--color-accent` |
| Pending `◇` | `component.status.pending` | Symbol + `--color-text-muted` |
| Message text | `--color-text` | `color.text.primary` = `#E8E8E8` |
| Detail text | `--color-text-muted` | `color.text.muted` = `#6B6B6B` |

## Rendering Rules

1. Always indent 2 spaces from left edge (indent-1).
2. Symbol is colored; message text is text-primary. Never color the entire message.
3. One space between symbol and message.
4. Detail lines begin at indent-2 (4 spaces) and use text-muted.
5. Maximum 3 detail lines per status message.
6. No blank line between a status message and its detail lines.
7. One blank line between consecutive unrelated status messages.
8. Consecutive related status messages (sub-task stream) use no blank lines.

## Rendered Examples

```
  ✓ brief validated -- all required fields present
  ◈ running strategy phase...
  ✗ brand-platform.md failed to write
  ! no audience defined -- using defaults
  i 3 existing chunks found, will regenerate
  ◇ identity phase queued
```

With detail:

```
  ✗ config.json validation failed
    Missing required field: brand_name
    Run /gsp:start to create a valid config.
```

Phase complete (brand-specific):

```
  ◆ strategy complete -- 6 chunks written
```

## Code Hints

```javascript
const RESET = '\x1b[0m';
const SYMBOLS = {
  success:  { char: '✓', color: '\x1b[38;2;63;185;80m' },    // #3FB950
  error:    { char: '✗', color: '\x1b[38;2;229;77;66m' },    // #E54D42
  warning:  { char: '!', color: '\x1b[38;2;210;153;34m' },   // #D29922
  info:     { char: 'i', color: '\x1b[38;2;88;166;255m' },   // #58A6FF
  progress: { char: '◈', color: '\x1b[38;2;229;160;13m' },   // #E5A00D
  complete: { char: '◆', color: '\x1b[38;2;229;160;13m' },   // #E5A00D
  pending:  { char: '◇', color: '\x1b[38;2;107;107;107m' },  // #6B6B6B
};
const MUTED = '\x1b[38;2;107;107;107m';

function statusMessage(type, message, details = []) {
  const s = SYMBOLS[type];
  const lines = [`  ${s.color}${s.char}${RESET} ${message}`];
  for (const detail of details) {
    lines.push(`    ${MUTED}${detail}${RESET}`);
  }
  return lines.join('\n');
}
```

## Accessibility

- **NO_COLOR:** Each symbol is visually distinct (`✓ ✗ ! i ◈ ◆ ◇`). Meaning never conveyed by color alone.
- **Non-TTY / piped:** Identical plain text. Symbols render as Unicode, survive pipe.
- **Screen readers:** Symbols have Unicode names. Message text is plain and descriptive.

---

## Related

- [Phase Block](./phase-block.md) -- composes status messages for phase output
- [Error Block](./error-block.md) -- extends the error variant
- [Spinner](./spinner.md) -- replaces progress symbol during animation
- [../foundations/color-system.md](../foundations/color-system.md)
