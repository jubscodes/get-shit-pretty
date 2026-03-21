# Divider

> Phase: system | Brand: get-shit-pretty-v2 | Generated: 2026-03-19

---

## Description

Section separation component. A horizontal rule that creates visual breathing room between content sections. Three variants: plain rule, labeled divider, and inline pipeline flow.

Use for: separating major output sections, breaking up long output, visual pacing between unrelated content blocks.

## Anatomy

### Plain Rule

```
  ──────────────────────────────
```

### Labeled Divider

```
  ─── {label} ───
```

## Variants

| Variant | Structure | Use |
|---------|-----------|-----|
| **Plain** | 30 `─` characters | General section break |
| **Labeled** | 3 `─` + space + label + space + 3 `─` | Named section break |

## Token Usage

| Element | Token | Reference |
|---------|-------|-----------|
| Rule character | `─` | `component.box.horizontal` |
| Rule color | `--color-border` | `color.foundation.border` = `#1E1E1E` |
| Label color | `--color-text-muted` | `color.text.muted` = `#6B6B6B` |
| Indent | 2 cols | `--space-2` = 8px (2-char terminal equivalent) |
| Vertical spacing | 1 blank line above/below | `--space-4` equivalent |

## Rendering Rules

1. Plain rule: 30 `─` characters at indent-1, border color.
2. Labeled divider: 3 `─` + space + label (text-muted) + space + 3 `─`, border color for rules.
3. One blank line above and below all divider variants.
4. Always use box-drawing `─`, never ASCII hyphens (`-`) or equals (`=`).
5. Divider width does not stretch to fill terminal. Fixed at 30 chars (plain) or content-determined (labeled).
6. In narrow terminals (< 40 cols), plain rule shortens to 20 chars.

### Color Tier Mapping

| Tier | Rule | Label |
|------|------|-------|
| Truecolor | `\x1b[38;2;30;30;30m` | `\x1b[38;2;107;107;107m` |
| 256-color | `\x1b[38;5;234m` | `\x1b[38;5;242m` |
| 16-color | `\x1b[90m` | `\x1b[90m` |
| No-color | plain `─` | plain text |

## Rendered Examples

Plain rule:

```

  ──────────────────────────────

```

Labeled divider:

```

  ─── Branding Pipeline ───

```

Between output sections:

```
  ✓ brief validated — all required fields present

  ──────────────────────────────

  ◈ running strategy phase...
```

## Code Hints

```javascript
const RESET = '\x1b[0m';
const BORDER = '\x1b[38;2;30;30;30m';         // #1E1E1E
const MUTED = '\x1b[38;2;107;107;107m';        // #6B6B6B

function divider(width = 30) {
  return `\n  ${BORDER}${'─'.repeat(width)}${RESET}\n`;
}

function labeledDivider(label) {
  return `\n  ${BORDER}───${RESET} ${MUTED}${label}${RESET} ${BORDER}───${RESET}\n`;
}
```

## Accessibility

- **NO_COLOR:** `─` is a clear visual separator in any terminal. Label text is plain.
- **Non-TTY / piped:** Identical output. Box-drawing character survives pipe.
- **Screen readers:** Label text provides semantic meaning.

---

## Related

- [Pipeline Flow](./pipeline-flow.md) -- extends divider concept for pipeline visualization
- [Table](./table.md) -- table separators use the same `─` character
- [Summary Box](./summary-box.md) -- box borders use `─`
- [../foundations/color-system.md](../foundations/color-system.md)
