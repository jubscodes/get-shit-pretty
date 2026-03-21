# Table

> Phase: system | Brand: get-shit-pretty-v2 | Generated: 2026-03-19

---

## Description

Aligned column display for structured data. Header row, separator, and data rows. No vertical borders -- whitespace separates columns. Supports left and right alignment, responsive truncation, and status-annotated cells.

Use for: phase status overviews, audit results, config listings, comparison data, chunk manifests.

## Anatomy

```
  {header-1}     {header-2}     {header-3}
  ──────────     ──────────     ──────────
  {data}         {data}         {data}
  {data}         {data}         {data}
```

- **Header row** -- bold `--color-text-muted`, column-aligned
- **Separator row** -- `─` characters matching header width, `--color-border`
- **Data rows** -- `--color-text`, column-aligned
- **Column gap** -- minimum 2 spaces between columns

## Variants

| Variant | Description | Use |
|---------|-------------|-----|
| **Standard** | Plain data, no decorations | General data display |
| **Status-Annotated** | Cells prefixed with status symbols | Phase overviews, audits |
| **Compact** | 1-space column gaps | Narrow terminals |
| **Responsive** | Columns dropped at narrow widths | Priority: leftmost survive |

## Token Usage

| Element | Token | Reference |
|---------|-------|-----------|
| Header text | `--color-text-muted` + bold | `color.text.muted` = `#6B6B6B` |
| Separator `─` | `--color-border` | `color.foundation.border` = `#1E1E1E` |
| Data text | `--color-text` | `color.text.primary` = `#E8E8E8` |
| Indent | 2 cols | `--space-2` equivalent |

## Rendering Rules

1. All tables indented at indent-1 (2 spaces).
2. Header text is bold + text-muted.
3. Separator uses `─`, length matches header width. Color is border.
4. Minimum 2 spaces between columns.
5. Text columns left-align. Numeric columns right-align.
6. Missing data rendered as `--` (em dash), not blank.
7. No vertical borders (`│`). Whitespace is the separator.
8. Max total width: 120 chars.
9. In narrow terminals (< 80), truncate rightmost columns first. Truncated cells end with `...`.
10. One blank line before and after a table.

## Rendered Examples

Phase overview:

```
  Phase        Status     Chunks    Duration
  ─────        ──────     ──────    ────────
  discover     ◆ done          3       1.2s
  strategy     ◆ done          6       8.4s
  identity     ◈ active      2/7        ...
  system       ◇ queued        --         --
```

Audit results:

```
  Check          Result    Count
  ─────          ──────    ─────
  Agents         ✓ pass       14
  Skills         ✓ pass       25
  Templates      ✓ pass        3
  Config         ✗ fail        2
```

## Code Hints

```javascript
const RESET = '\x1b[0m';
const BOLD = '\x1b[1m';
const MUTED = '\x1b[38;2;107;107;107m';        // #6B6B6B
const BORDER = '\x1b[38;2;30;30;30m';           // #1E1E1E

function table(headers, rows, options = {}) {
  const { rightAlign = [], indent = '  ' } = options;
  const widths = headers.map((h, i) => {
    const cellWidths = rows.map(r => String(r[i] ?? '--').length);
    return Math.max(h.length, ...cellWidths);
  });

  const pad = (str, w, right) => {
    const s = String(str ?? '--');
    const gap = w - s.length;
    return right ? ' '.repeat(Math.max(0, gap)) + s : s + ' '.repeat(Math.max(0, gap));
  };

  const headerLine = headers
    .map((h, i) => `${BOLD}${MUTED}${pad(h, widths[i], false)}${RESET}`)
    .join('  ');

  const sepLine = headers
    .map((h, i) => `${BORDER}${'─'.repeat(widths[i])}${RESET}`)
    .join('  ');

  const dataLines = rows.map(row =>
    row.map((cell, i) => pad(cell, widths[i], rightAlign.includes(i))).join('  ')
  );

  return [
    `${indent}${headerLine}`,
    `${indent}${sepLine}`,
    ...dataLines.map(l => `${indent}${l}`),
  ].join('\n');
}
```

## Accessibility

- **NO_COLOR:** Table structure conveyed through aligned whitespace and `─` separator.
- **Non-TTY / piped:** Identical rendering. Tab-separated output available via `--format=tsv`.
- **Screen readers:** Header + data structure is linear.

---

## Related

- [Key-Value](./key-value.md) -- for two-column labeled data
- [Status Message](./status-message.md) -- status symbols in annotated cells
- [Divider](./divider.md) -- separators share `─` character
- [../foundations/color-system.md](../foundations/color-system.md)
- [../foundations/spacing.md](../foundations/spacing.md)
