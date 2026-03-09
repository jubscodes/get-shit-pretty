# Key-Value

> Phase: system | Brand: get-shit-pretty | Generated: 2026-03-08

---

## Description

Aligned key-value pairs for displaying labeled data. Keys are right-padded to the longest key in the group, followed by a colon and consistent spacing before the value. The standard format for config display, summary statistics, and metadata.

Use for: summary box content, config display, audit results, metadata blocks, phase statistics.

## Anatomy

```
  {key}:{padding}{value}
```

- **Key** -- text-secondary (or bold text-secondary for emphasis), left-aligned
- **Colon** -- immediately after key, no space before
- **Padding** -- spaces to align all values. Key + colon padded to longest key length + colon + 4 spaces
- **Value** -- text-primary, left-aligned from the common value column

## Variants

### Standard

Keys in text-secondary, values in text-primary.

### Emphasized

Keys in bold text-secondary, values in bold text-primary. For important stats.

### With Status

Value prefixed with a status symbol. For audits and checks.

## Token Usage

| Token | Source | Value |
|-------|--------|-------|
| `color.text-secondary` | color-system.md | `#A0A0A0` -- keys |
| `color.text-primary` | color-system.md | `#E0E0E0` -- values |
| `typography.bold` | typography.md | `\x1b[1m` -- emphasized variant |
| `spacing.horizontal.indent-1` | spacing.md | 2 cols -- left indent |

## Rendering Rules

1. All key-value groups positioned at indent-1 (2 spaces from left).
2. Calculate the maximum key length in the group. Pad all keys to that length.
3. Colon immediately follows the key text. Four spaces between colon and value start.
4. Values left-align from a common column.
5. Consecutive key-value pairs use space-0 (no blank lines between them).
6. One blank line (space-1) before and after a key-value group.
7. If a value is too long to fit on one line, wrap at 80 cols. Continuation lines align to the value column.
8. Numeric values right-align within their column if all values in the group are numeric.

## Rendered Examples

Standard:

```
  Brand:     get-shit-pretty
  Phase:     strategy
  Chunks:    6
  Duration:  2.3s
```

Emphasized:

```
  Phases:    5 of 5 complete
  Chunks:    24 files written
  Duration:  47.2s
```

With status:

```
  Config:    ✓ valid
  Agents:    ✓ 12 of 12 found
  Commands:  ✓ 8 of 8 found
  Templates: ✗ 2 of 3 missing
```

Inside a summary box:

```
  │  Brand:     get-shit-pretty              │
  │  Phases:    5 of 5 complete              │
  │  Chunks:    24 files written             │
  │  Duration:  47.2s                        │
```

## Implementation

```javascript
const RESET = '\x1b[0m'
const SECONDARY = '\x1b[38;2;160;160;160m'
const PRIMARY = '\x1b[38;2;224;224;224m'
const BOLD = '\x1b[1m'

function keyValue(pairs, options = {}) {
  const { indent = '  ', bold = false, gutter = 4 } = options
  const maxKey = Math.max(...pairs.map(([k]) => k.length))

  return pairs.map(([key, value]) => {
    const pad = ' '.repeat(maxKey - key.length + gutter)
    const kStyle = bold ? `${BOLD}${SECONDARY}` : SECONDARY
    const vStyle = bold ? `${BOLD}${PRIMARY}` : PRIMARY
    return `${indent}${kStyle}${key}:${RESET}${pad}${vStyle}${value}${RESET}`
  }).join('\n')
}
```

## Accessibility

- **Without color:** Keys and values are separated by colon and whitespace. Alignment makes the structure parseable visually.
- **Non-TTY / piped:** Identical output. Alignment spaces survive pipe. Parseable with standard text tools (grep for key names).
- **Screen readers:** "Brand colon get-shit-pretty" reads naturally. Colon provides the association.

---

## Related

- [Summary Box](./summary-box.md) -- primary consumer of key-value pairs
- [Table](./table.md) -- for multi-column data, use table instead
- [../foundations/spacing.md](../foundations/spacing.md) -- alignment rules
- [../foundations/typography.md](../foundations/typography.md)
