# Key-Value

> Phase: system | Brand: get-shit-pretty-v2 | Generated: 2026-03-19

---

## Description

Aligned key-value pairs for displaying labeled data. Keys are right-padded to the longest key in the group, followed by a colon and consistent spacing before the value. The standard format for config display, summary statistics, and metadata.

Use for: summary box content, config display, audit results, metadata blocks, phase statistics.

## Anatomy

```
  {key}:{padding}{value}
```

- **Key** -- `--color-text-muted`, left-aligned
- **Colon** -- immediately after key, no space before
- **Padding** -- spaces to align all values. Key + colon padded to longest key + colon + 4 spaces
- **Value** -- `--color-text`, left-aligned from the common value column

## Variants

| Variant | Key Style | Value Style | Use |
|---------|-----------|-------------|-----|
| **Standard** | text-muted | text-primary | Default data display |
| **Emphasized** | bold text-muted | bold text-primary | Important stats |
| **With Status** | text-muted | status symbol + text-primary | Audits, checks |

## Token Usage

| Element | Token | Reference |
|---------|-------|-----------|
| Key color | `--color-text-muted` | `color.text.muted` = `#6B6B6B` |
| Value color | `--color-text` | `color.text.primary` = `#E8E8E8` |
| Bold weight | `\x1b[1m` | Emphasized variant |
| Indent | 2 cols | `--space-2` equivalent |
| Gutter | 4 spaces | Between colon and value column |

## Rendering Rules

1. All key-value groups positioned at indent-1 (2 spaces from left).
2. Calculate the maximum key length in the group. Pad all keys to that length.
3. Colon immediately follows key text. Four spaces between colon and value start.
4. Values left-align from a common column.
5. Consecutive key-value pairs use no blank lines between them.
6. One blank line before and after a key-value group.
7. If a value is too long, wrap at 78 cols. Continuation lines align to the value column.
8. Numeric values right-align within their column if all values in the group are numeric.

## Rendered Examples

Standard:

```
  Brand:     get-shit-pretty
  Phase:     strategy
  Chunks:    6
  Duration:  2.3s
```

With status:

```
  Config:    ✓ valid
  Agents:    ✓ 14 of 14 found
  Skills:    ✓ 25 of 25 found
  Templates: ✗ 2 of 3 missing
```

## Code Hints

```javascript
const RESET = '\x1b[0m';
const MUTED = '\x1b[38;2;107;107;107m';        // #6B6B6B
const TEXT = '\x1b[38;2;232;232;232m';          // #E8E8E8
const BOLD = '\x1b[1m';

function keyValue(pairs, options = {}) {
  const { indent = '  ', bold = false, gutter = 4 } = options;
  const maxKey = Math.max(...pairs.map(([k]) => k.length));

  return pairs.map(([key, value]) => {
    const pad = ' '.repeat(maxKey - key.length + gutter);
    const kStyle = bold ? `${BOLD}${MUTED}` : MUTED;
    const vStyle = bold ? `${BOLD}${TEXT}` : TEXT;
    return `${indent}${kStyle}${key}:${RESET}${pad}${vStyle}${value}${RESET}`;
  }).join('\n');
}
```

## Accessibility

- **NO_COLOR:** Keys and values separated by colon and whitespace. Alignment provides visual structure.
- **Non-TTY / piped:** Identical output. Parseable with standard text tools.
- **Screen readers:** "Brand colon get-shit-pretty" reads naturally.

---

## Related

- [Summary Box](./summary-box.md) -- primary consumer of key-value pairs
- [Table](./table.md) -- for multi-column data, use table instead
- [../foundations/spacing.md](../foundations/spacing.md)
