# Table

> Phase: system | Brand: get-shit-pretty | Generated: 2026-03-08

---

## Description

Aligned column display for structured data. Header row, separator, and data rows. No vertical borders -- whitespace separates columns. Supports left and right alignment, responsive truncation, and status-annotated cells.

Use for: phase status overviews, audit results, config listings, comparison data, chunk manifests.

## Anatomy

```
  {header-1}     {header-2}     {header-3}      ← bold text-secondary
  ──────────     ──────────     ──────────      ← text-tertiary separators
  {data}         {data}         {data}          ← text-primary
  {data}         {data}         {data}
```

- **Header row** -- bold text-secondary, column-aligned
- **Separator row** -- `─` characters matching each header width, text-tertiary
- **Data rows** -- text-primary, column-aligned
- **Column gap** -- minimum 2 spaces between columns

## Variants

### Standard

Plain data display, no decorations.

### Status-Annotated

Data cells prefixed with status symbols (diamond states, checkmarks).

### Compact

Narrower column gaps (1 space) for narrow terminals.

### Responsive

Columns truncated or dropped at narrow widths. Priority: leftmost columns survive.

## Token Usage

| Token | Source | Value |
|-------|--------|-------|
| `typography.bold` | typography.md | `\x1b[1m` -- header row |
| `color.text-secondary` | color-system.md | `#A0A0A0` -- header text |
| `color.text-tertiary` | color-system.md | `#666666` -- separator row |
| `color.text-primary` | color-system.md | `#E0E0E0` -- data cells |
| `ascii.box.horizontal` | tokens.json | `─` -- separator character |
| `spacing.horizontal.indent-1` | spacing.md | 2 cols -- table indent |

## Rendering Rules

1. All tables indented at indent-1 (2 spaces).
2. Header text is bold + text-secondary.
3. Separator uses `─` (box horizontal), length matches header text width. Color is text-tertiary.
4. Minimum 2 spaces between columns. Calculate column widths from max cell width in each column.
5. Text columns left-align. Numeric columns right-align.
6. Missing data rendered as `—` (em dash), not blank.
7. No vertical borders (`│`). Whitespace is the separator.
8. In wide terminals (>= 120), allow up to 120 chars total width. Do not stretch.
9. In narrow terminals (< 80), truncate rightmost columns first. Truncated cells end with `...`.
10. One blank line (space-1) before and after a table.

## Rendered Examples

Phase overview:

```
  Phase        Status     Chunks    Duration
  ─────        ──────     ──────    ────────
  discover     ◆ done          3       1.2s
  strategy     ◆ done          6       8.4s
  verbal       ◈ active      2/7        ...
  identity     ◇ queued        —          —
  system       ◇ queued        —          —
```

Audit results:

```
  Check          Result    Count
  ─────          ──────    ─────
  Agents         ✓ pass       12
  Commands       ✓ pass        8
  Templates      ✓ pass        3
  Config         ✗ fail        2
```

Compact (narrow terminal):

```
  Phase      Status   Chunks
  ─────      ──────   ──────
  discover   ◆ done        3
  strategy   ◆ done        6
  verbal     ◈ act...    2/7
```

## Implementation

```javascript
const RESET = '\x1b[0m'
const BOLD = '\x1b[1m'
const SECONDARY = '\x1b[38;2;160;160;160m'
const TERTIARY = '\x1b[38;2;102;102;102m'

function table(headers, rows, options = {}) {
  const { rightAlign = [], indent = '  ' } = options
  const cols = headers.length
  const widths = headers.map((h, i) => {
    const cellWidths = rows.map(r => String(r[i] ?? '—').length)
    return Math.max(h.length, ...cellWidths)
  })

  const pad = (str, w, right) => {
    const s = String(str ?? '—')
    const gap = w - s.length
    return right ? ' '.repeat(Math.max(0, gap)) + s : s + ' '.repeat(Math.max(0, gap))
  }

  const headerLine = headers
    .map((h, i) => `${BOLD}${SECONDARY}${pad(h, widths[i], false)}${RESET}`)
    .join('  ')

  const sepLine = headers
    .map((h, i) => `${TERTIARY}${'─'.repeat(widths[i])}${RESET}`)
    .join('  ')

  const dataLines = rows.map(row =>
    row.map((cell, i) => pad(cell, widths[i], rightAlign.includes(i))).join('  ')
  )

  return [
    `${indent}${headerLine}`,
    `${indent}${sepLine}`,
    ...dataLines.map(l => `${indent}${l}`),
  ].join('\n')
}
```

## Accessibility

- **Without color:** Table structure conveyed through aligned whitespace and `─` separator. Data is readable as plain columnar text.
- **Non-TTY / piped:** Identical rendering. Tab-separated output available as alternative via `--format=tsv` flag for machine parsing.
- **Screen readers:** Header + data structure is linear. Each row reads as a sequence of labeled values.

---

## Related

- [Key-Value](./key-value.md) -- for two-column labeled data, use key-value instead
- [Status Message](./status-message.md) -- status symbols in annotated table cells
- [Divider](./divider.md) -- table separators share the `─` character
- [../foundations/spacing.md](../foundations/spacing.md)
- [../foundations/typography.md](../foundations/typography.md)
