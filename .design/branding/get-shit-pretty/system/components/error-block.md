# Error Block

> Phase: system | Brand: get-shit-pretty | Generated: 2026-03-08

---

## Description

Structured error display following the what/why/fix pattern. Extends the status-message error variant with mandatory context lines. Two variants: inline (within flow) and fatal banner (boxed, session-ending).

Use for: validation failures, missing files, config errors, API failures, permission errors.

## Anatomy

### Inline Error

```
  ✗ {what failed}                       ← error symbol + text-primary
    {why it failed}                     ← text-secondary at indent-2
    {what to do about it}               ← text-secondary at indent-2
```

### Fatal Banner

```
  ┌──────────────────────────────────────────┐
  │                                          │
  │  ✗  Fatal: {what failed}                │
  │                                          │
  │  {why it failed — can be multi-line}    │
  │  {what to do about it}                  │
  │                                          │
  └──────────────────────────────────────────┘
```

## Variants

| Variant | When | Structure |
|---------|------|-----------|
| **Inline** | Recoverable error within a phase | 1-3 lines, no box |
| **Fatal banner** | Unrecoverable, session must stop | Boxed, prominent |
| **Verbose** | With `--verbose` flag | Inline + stack trace in tertiary |

## Token Usage

| Token | Source | Value |
|-------|--------|-------|
| `status.error.symbol` | tokens.json | `✗` |
| `color.error` | color-system.md | `#EF4444` |
| `color.text-primary` | color-system.md | `#E0E0E0` -- what line |
| `color.text-secondary` | color-system.md | `#A0A0A0` -- why/fix lines |
| `color.text-tertiary` | color-system.md | `#666666` -- stack trace, box border |
| `ascii.box.*` | tokens.json | box-drawing for fatal variant |
| `spacing.horizontal.indent-1` | spacing.md | 2 cols |
| `spacing.horizontal.indent-2` | spacing.md | 4 cols |

## Rendering Rules

1. The `✗` symbol is always error-colored. The "what" message is text-primary.
2. "Why" and "fix" lines are text-secondary at indent-2.
3. The "fix" line should contain an actionable command when possible.
4. Fatal banners use the summary-box border pattern with text-tertiary borders.
5. Stack traces (verbose mode) are text-tertiary at indent-2, prefixed with a blank line.
6. Maximum 5 lines for an inline error. Longer context should use `--verbose`.
7. One blank line before and after an error block.
8. Never use error color for the entire message, only for the symbol.

## Rendered Examples

Inline error:

```
  ✗ brief validation failed
    Missing required field: audience
    Run /gsp:brief to add the missing field.
```

Inline with verbose stack:

```
  ✗ brand-prism.md failed to write
    EACCES: permission denied, open '.design/strategy/brand-prism.md'
    Check file permissions on the .design directory.

    at Object.openSync (node:fs:601:3)
    at writeFileSync (node:fs:2249:35)
    at writeChunk (src/writer.js:44:5)
```

Fatal banner:

```
  ┌──────────────────────────────────────────┐
  │                                          │
  │  ✗  Fatal: config.json not found        │
  │                                          │
  │  GSP requires a project config to run.  │
  │  Run /gsp:init to create one.           │
  │                                          │
  └──────────────────────────────────────────┘
```

## Implementation

```javascript
const RESET = '\x1b[0m'
const ERROR = '\x1b[38;2;239;68;68m'
const SECONDARY = '\x1b[38;2;160;160;160m'
const TERTIARY = '\x1b[38;2;102;102;102m'

function errorBlock(what, why, fix, stack = null) {
  const lines = [`  ${ERROR}✗${RESET} ${what}`]
  if (why) lines.push(`    ${SECONDARY}${why}${RESET}`)
  if (fix) lines.push(`    ${SECONDARY}${fix}${RESET}`)
  if (stack) {
    lines.push('')
    for (const frame of stack.split('\n')) {
      lines.push(`    ${TERTIARY}${frame}${RESET}`)
    }
  }
  return lines.join('\n')
}

function fatalBanner(what, why, fix, width = 44) {
  const inner = width - 4
  const bdr = (l, f, r) =>
    `  ${TERTIARY}${l}${'─'.repeat(width - 2)}${r}${RESET}`
  const ln = (c) => {
    const pad = inner - stripAnsi(c).length
    return `  ${TERTIARY}│${RESET}  ${c}${' '.repeat(Math.max(0, pad))}  ${TERTIARY}│${RESET}`
  }
  const empty = ln(' '.repeat(inner))
  return [
    bdr('┌', '─', '┐'), empty,
    ln(`${ERROR}✗${RESET}  Fatal: ${what}`), empty,
    ln(`${SECONDARY}${why}${RESET}`),
    ln(`${SECONDARY}${fix}${RESET}`),
    empty, bdr('└', '─', '┘'),
  ].join('\n')
}
```

## Accessibility

- **Without color:** `✗` symbol is distinct from success/warning symbols. What/why/fix structure is conveyed through indentation.
- **Non-TTY / piped:** Identical structure, strip ANSI. Fatal banner box-drawing survives pipe.
- **Screen readers:** Three-line structure reads naturally: what happened, why, what to do.

---

## Related

- [Status Message](./status-message.md) -- error variant is a specialized status message
- [Summary Box](./summary-box.md) -- fatal banner shares box pattern
- [Phase Block](./phase-block.md) -- inline errors appear within phase output
- [../foundations/color-system.md](../foundations/color-system.md)
- [../foundations/content-patterns.md](../foundations/content-patterns.md)
