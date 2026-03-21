# Error Block

> Phase: system | Brand: get-shit-pretty-v2 | Generated: 2026-03-19

---

## Description

Structured error display following the what/why/fix pattern. Extends the status-message error variant with mandatory context lines. Two variants: inline (within flow) and fatal banner (boxed, session-ending).

Use for: validation failures, missing files, config errors, API failures, permission errors.

## Anatomy

### Inline Error

```
  ✗ {what failed}
    {why it failed}
    {what to do about it}
```

### Fatal Banner

```
  ┌──────────────────────────────────────────┐
  │                                          │
  │  ✗  Fatal: {what failed}                │
  │                                          │
  │  {why it failed -- can be multi-line}    │
  │  {what to do about it}                   │
  │                                          │
  └──────────────────────────────────────────┘
```

## Variants

| Variant | When | Structure |
|---------|------|-----------|
| **Inline** | Recoverable error within a phase | 1-3 lines, no box |
| **Fatal banner** | Unrecoverable, session must stop | Boxed, prominent |
| **Verbose** | With `--verbose` flag | Inline + stack trace in text-muted |

## Token Usage

| Element | Token | Reference |
|---------|-------|-----------|
| Error symbol `✗` | `component.status.error` | Symbol + `--color-error` |
| Error color | `--color-error` | `color.semantic.error` = `#E54D42` |
| What text | `--color-text` | `color.text.primary` = `#E8E8E8` |
| Why/fix text | `--color-text-muted` | `color.text.muted` = `#6B6B6B` |
| Stack trace | `--color-text-muted` | `color.text.muted` = `#6B6B6B` |
| Box border | `--color-border` | `color.foundation.border` = `#1E1E1E` |
| Box chars | `component.box.*` | `┌─┐│└┘` |
| Indent-1 | 2 cols | Outer indent |
| Indent-2 | 4 cols | Why/fix/stack lines |

## Rendering Rules

1. The `✗` symbol is always error-colored. The "what" message is text-primary.
2. "Why" and "fix" lines are text-muted at indent-2.
3. The "fix" line should contain an actionable command when possible.
4. Fatal banners use the summary-box border pattern with border color.
5. Stack traces (verbose mode) are text-muted at indent-2, prefixed with a blank line.
6. Maximum 5 lines for an inline error. Longer context requires `--verbose`.
7. One blank line before and after an error block.
8. Never use error color for the entire message, only for the symbol.

### Color Tier Mapping

| Tier | Error symbol | What text | Why/fix text |
|------|-------------|-----------|--------------|
| Truecolor | `\x1b[38;2;229;77;66m` | `\x1b[38;2;232;232;232m` | `\x1b[38;2;107;107;107m` |
| 256-color | `\x1b[38;5;167m` | `\x1b[38;5;254m` | `\x1b[38;5;242m` |
| 16-color | `\x1b[31m` | `\x1b[37m` | `\x1b[90m` |
| No-color | `✗` plain | plain text | plain text |

## Rendered Examples

Inline error:

```
  ✗ brief validation failed
    Missing required field: audience
    Run /gsp:project-brief to add the missing field.
```

Fatal banner:

```
  ┌──────────────────────────────────────────┐
  │                                          │
  │  ✗  Fatal: config.json not found        │
  │                                          │
  │  GSP requires a project config to run.   │
  │  Run /gsp:start to create one.           │
  │                                          │
  └──────────────────────────────────────────┘
```

## Code Hints

```javascript
const RESET = '\x1b[0m';
const ERROR = '\x1b[38;2;229;77;66m';         // #E54D42
const MUTED = '\x1b[38;2;107;107;107m';        // #6B6B6B
const BORDER = '\x1b[38;2;30;30;30m';          // #1E1E1E

function errorBlock(what, why, fix, stack = null) {
  const lines = [`  ${ERROR}✗${RESET} ${what}`];
  if (why) lines.push(`    ${MUTED}${why}${RESET}`);
  if (fix) lines.push(`    ${MUTED}${fix}${RESET}`);
  if (stack) {
    lines.push('');
    for (const frame of stack.split('\n')) {
      lines.push(`    ${MUTED}${frame}${RESET}`);
    }
  }
  return lines.join('\n');
}
```

## Accessibility

- **NO_COLOR:** `✗` symbol is distinct from success/warning symbols. What/why/fix structure conveyed through indentation.
- **Non-TTY / piped:** Identical structure, strip ANSI. Box-drawing survives pipe.
- **Screen readers:** Three-line structure reads naturally: what happened, why, what to do.

---

## Related

- [Status Message](./status-message.md) -- error variant is a specialized status message
- [Summary Box](./summary-box.md) -- fatal banner shares box pattern
- [../foundations/color-system.md](../foundations/color-system.md)
