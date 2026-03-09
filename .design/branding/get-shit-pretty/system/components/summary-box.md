# Summary Box

> Phase: system | Brand: get-shit-pretty | Generated: 2026-03-08

---

## Description

A box-bordered summary screen displayed at the end of sessions, pipelines, or major operations. Contains the brand mark, key-value statistics, and optional secondary content. This is the final "punctuation mark" of a GSP run.

Use for: end-of-pipeline summary, end-of-session recap, install confirmation, audit results.

## Anatomy

```
  ┌────────────────────────────────────────┐
  │                                        │    ← top padding (1 line)
  │  {brand-mark}                          │    ← brand mark with state
  │                                        │    ← space-1
  │  {key}:     {value}                    │    ← key-value pairs
  │  {key}:     {value}                    │
  │  {key}:     {value}                    │
  │                                        │    ← bottom padding (1 line)
  └────────────────────────────────────────┘
```

- **Border** -- box-drawing characters in text-tertiary
- **Top/bottom padding** -- 1 blank line inside box after/before border
- **Left/right padding** -- 2 spaces inside box after/before `│`
- **Brand mark** -- bold, state-aware diamonds
- **Key-value pairs** -- key-value component format

## Variants

### Standard Summary

End-of-pipeline result with stats.

### Minimal Summary

No brand mark, just key-value pairs in a box. For sub-operation results.

### Celebration Summary

Includes sparkle field above the box for milestone moments (first install, all-shipped).

## Token Usage

| Token | Source | Value |
|-------|--------|-------|
| `ascii.box.*` | tokens.json | `┌─┐│└┘` border characters |
| `color.text-tertiary` | color-system.md | `#666666` -- border color |
| `spacing.box-padding.*` | spacing.md | 1 line / 2 cols padding |
| `mark.states.*` | tokens.json | brand mark state strings |
| `typography.bold` | typography.md | `\x1b[1m` -- mark, key values |
| `color.accent` | color-system.md | `#FF6B35` -- brand mark wordmark |

## Rendering Rules

1. Box width is 44 characters (40 inner + 2 border + 2 padding per side). Adapts to content if wider, max 60.
2. Border characters use text-tertiary color.
3. Brand mark is always the first content line inside the box.
4. One blank line between brand mark and key-value block.
5. Key-value pairs follow the key-value component alignment rules.
6. Box is positioned at indent-1 (2 spaces from left edge).
7. Two blank lines (space-2) before and after the box.
8. In narrow terminals (< 44 cols), drop the right border and right padding. Left-align content.

## Rendered Examples

Standard end-of-pipeline:

```
  ┌──────────────────────────────────────────┐
  │                                          │
  │  /gsp: ◆◇                               │
  │                                          │
  │  Brand:     get-shit-pretty              │
  │  Phases:    5 of 5 complete              │
  │  Chunks:    24 files written             │
  │  Duration:  47.2s                        │
  │                                          │
  └──────────────────────────────────────────┘
```

Minimal (audit result):

```
  ┌──────────────────────────────────────────┐
  │                                          │
  │  Config:    valid                        │
  │  Agents:    12 of 12 found              │
  │  Commands:  8 of 8 found                │
  │  Templates: 3 of 3 found                │
  │                                          │
  └──────────────────────────────────────────┘
```

## Implementation

```javascript
const RESET = '\x1b[0m'
const TERTIARY = '\x1b[38;2;102;102;102m'
const BOLD = '\x1b[1m'
const ACCENT = '\x1b[38;2;255;107;53m'

function summaryBox(mark, pairs, width = 44) {
  const inner = width - 4 // minus borders and padding
  const border = (l, fill, r) =>
    `  ${TERTIARY}${l}${fill.repeat(width - 2)}${r}${RESET}`
  const line = (content) => {
    const pad = inner - stripAnsi(content).length
    return `  ${TERTIARY}│${RESET}  ${content}${' '.repeat(Math.max(0, pad))}  ${TERTIARY}│${RESET}`
  }
  const empty = line(' '.repeat(inner))

  const lines = [
    border('┌', '─', '┐'),
    empty,
  ]

  if (mark) {
    lines.push(line(`${BOLD}${ACCENT}/gsp:${RESET} ${BOLD}${mark}${RESET}`))
    lines.push(empty)
  }

  const maxKey = Math.max(...pairs.map(([k]) => k.length))
  for (const [key, value] of pairs) {
    lines.push(line(`${key}:${' '.repeat(maxKey - key.length + 4)}${value}`))
  }

  lines.push(empty, border('└', '─', '┘'))
  return lines.join('\n')
}
```

## Accessibility

- **Without color:** Box-drawing characters provide clear visual boundaries. Content is structured as labeled key-value pairs, readable without formatting.
- **Non-TTY / piped:** Render box identically (box-drawing is plain Unicode). Strip ANSI color codes. Structure remains parseable.
- **Screen readers:** Key-value pairs read naturally as "Brand: get-shit-pretty, Phases: 5 of 5 complete."

---

## Related

- [Key-Value](./key-value.md) -- inner content format
- [Brand Mark](./brand-mark.md) -- mark rendering within the box
- [Banner](./banner.md) -- celebration variant uses sparkle field above
- [../foundations/spacing.md](../foundations/spacing.md)
- [../foundations/ascii-art.md](../foundations/ascii-art.md)
