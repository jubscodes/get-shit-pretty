# Status Message

> Phase: system | Brand: get-shit-pretty | Generated: 2026-03-08

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
- **message** -- text-primary, single line, max 76 chars (80 - indent - symbol - space)
- **detail-line** (optional) -- indented 2 more spaces (indent-2), text-secondary

## Variants

| Variant | Symbol | Color Token | Use |
|---------|--------|-------------|-----|
| **success** | `✓` | `color.success` | Complete, passed, written |
| **error** | `✗` | `color.error` | Failed, broken, missing |
| **warning** | `⚠` | `color.warning` | Caution, manual check |
| **info** | `ℹ` | `color.info` | Neutral information |
| **progress** | `◈` | `color.accent` | In-progress, active |
| **complete** | `◆` | `color.accent` | Phase complete (brand) |
| **pending** | `◇` | `color.text-tertiary` | Not started, queued |

### With Details

A status message may carry 1-3 detail lines beneath it for context. Detail lines use indent-2 and text-secondary.

### Compact

In narrow terminals (< 40 cols), truncate the message at the available width minus 6 chars, append `...`.

## Token Usage

| Token | Source | Value |
|-------|--------|-------|
| `status.success.symbol` | tokens.json | `✓` |
| `status.error.symbol` | tokens.json | `✗` |
| `status.warning.symbol` | tokens.json | `⚠` |
| `status.info.symbol` | tokens.json | `ℹ` |
| `status.progress.symbol` | tokens.json | `◈` |
| `status.complete.symbol` | tokens.json | `◆` |
| `status.pending.symbol` | tokens.json | `◇` |
| `color.success` | color-system.md | `#22C55E` |
| `color.error` | color-system.md | `#EF4444` |
| `color.warning` | color-system.md | `#FBBF24` |
| `color.info` | color-system.md | `#60A5FA` |
| `color.accent` | color-system.md | `#FF6B35` |
| `color.text-tertiary` | color-system.md | `#666666` |
| `spacing.horizontal.indent-1` | spacing.md | 2 columns |
| `spacing.horizontal.indent-2` | spacing.md | 4 columns |

## Rendering Rules

1. Always indent 2 spaces from left edge (indent-1).
2. Symbol is colored; message text is text-primary. Never color the entire message.
3. One space between symbol and message. No other separators.
4. Detail lines begin at indent-2 (4 spaces) and use text-secondary.
5. Maximum 3 detail lines per status message. More belongs in a separate block.
6. No blank line between a status message and its detail lines.
7. One blank line (space-1) between consecutive unrelated status messages.
8. Consecutive related status messages (e.g., a stream of sub-task results) use space-0.

## Rendered Examples

Basic status messages:

```
  ✓ brief validated — all required fields present
  ◈ running strategy phase...
  ✗ brand-platform.md failed to write
  ⚠ no audience defined — using defaults
  ℹ 3 existing chunks found, will regenerate
  ◇ identity phase queued
```

With detail lines:

```
  ✗ config.json validation failed
    Missing required field: brand_name
    Run /gsp:init to create a valid config.
```

Phase complete (brand-specific):

```
  ◆ strategy complete — 6 chunks written
```

## Implementation

```javascript
const RESET = '\x1b[0m'
const SYMBOLS = {
  success:  { char: '✓', color: '\x1b[38;2;34;197;94m' },
  error:    { char: '✗', color: '\x1b[38;2;239;68;68m' },
  warning:  { char: '⚠', color: '\x1b[38;2;251;191;36m' },
  info:     { char: 'ℹ', color: '\x1b[38;2;96;165;250m' },
  progress: { char: '◈', color: '\x1b[38;2;255;107;53m' },
  complete: { char: '◆', color: '\x1b[38;2;255;107;53m' },
  pending:  { char: '◇', color: '\x1b[38;2;102;102;102m' },
}
const SECONDARY = '\x1b[38;2;160;160;160m'

function statusMessage(type, message, details = []) {
  const s = SYMBOLS[type]
  const lines = [`  ${s.color}${s.char}${RESET} ${message}`]
  for (const detail of details) {
    lines.push(`    ${SECONDARY}${detail}${RESET}`)
  }
  return lines.join('\n')
}
```

## Accessibility

- **Without color:** Each symbol is visually distinct (`✓` vs `✗` vs `⚠` vs `ℹ` vs `◈` vs `◆` vs `◇`). Meaning is never conveyed by color alone.
- **Non-TTY / piped:** Output identical plain text. Symbols render as Unicode characters, which survive pipe. Strip ANSI codes unless `FORCE_COLOR=1`.
- **Screen readers:** Symbols have Unicode names that map to meaning. Message text is plain and descriptive.

---

## Related

- [Phase Block](./phase-block.md) -- composes status messages for phase output
- [Error Block](./error-block.md) -- extends the error variant with what/why/fix structure
- [Spinner](./spinner.md) -- replaces the progress variant symbol during animation
- [../foundations/color-system.md](../foundations/color-system.md)
- [../foundations/content-patterns.md](../foundations/content-patterns.md)
