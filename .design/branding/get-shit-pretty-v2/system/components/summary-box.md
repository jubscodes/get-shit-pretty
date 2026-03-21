# Summary Box

> Phase: system | Brand: get-shit-pretty-v2 | Generated: 2026-03-19

---

## Description

A box-bordered summary screen displayed at the end of sessions, pipelines, or major operations. Contains the brand mark, key-value statistics, and optional secondary content. The final "punctuation mark" of a GSP run.

Use for: end-of-pipeline summary, end-of-session recap, install confirmation, audit results.

## Anatomy

```
  ┌────────────────────────────────────────┐
  │                                        │
  │  /gsp: ◆◇                             │
  │                                        │
  │  Brand:     get-shit-pretty            │
  │  Phases:    5 of 5 complete            │
  │  Chunks:    24 files written           │
  │  Duration:  47.2s                      │
  │                                        │
  └────────────────────────────────────────┘
```

- **Border** -- box-drawing characters in `--color-border`
- **Top/bottom padding** -- 1 blank line inside box
- **Left/right padding** -- 2 spaces inside box after/before `│`
- **Brand mark** -- bold, state-aware diamonds
- **Key-value pairs** -- key-value component format

## Variants

| Variant | Mark | Use |
|---------|------|-----|
| **Standard** | Yes | End-of-pipeline result with stats |
| **Minimal** | No | Sub-operation results, audit results |
| **Celebration** | Yes + sparkle field above | First install, all-shipped |

## Token Usage

| Element | Token | Reference |
|---------|-------|-----------|
| Border chars | `component.box.*` | `┌─┐│└┘` |
| Border color | `--color-border` | `color.foundation.border` = `#1E1E1E` |
| Brand mark | See [brand-mark.md](./brand-mark.md) | State-aware |
| Key-value | See [key-value.md](./key-value.md) | Standard format |
| Box width | 44 chars default | 40 inner + 4 border/padding |

## Rendering Rules

1. Box width: 44 characters default. Adapts to content if wider, max 60.
2. Border characters use border color.
3. Brand mark is always the first content line.
4. One blank line between brand mark and key-value block.
5. Key-value pairs follow key-value component alignment rules.
6. Box positioned at indent-1 (2 spaces from left).
7. Two blank lines before and after the box.
8. In narrow terminals (< 44 cols), drop right border and right padding. Left-align content.

### Color Tier Mapping

| Tier | Border | Brand mark | Key-value |
|------|--------|-----------|-----------|
| Truecolor | `\x1b[38;2;30;30;30m` | See brand-mark tiers | See key-value tiers |
| 256-color | `\x1b[38;5;234m` | -- | -- |
| 16-color | `\x1b[90m` | -- | -- |
| No-color | plain box-drawing | plain text | plain text |

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
  │  Config:    ✓ valid                      │
  │  Agents:    ✓ 14 of 14 found            │
  │  Skills:    ✓ 25 of 25 found            │
  │  Templates: ✓ 3 of 3 found              │
  │                                          │
  └──────────────────────────────────────────┘
```

## Code Hints

```javascript
const RESET = '\x1b[0m';
const BORDER = '\x1b[38;2;30;30;30m';          // #1E1E1E
const BOLD = '\x1b[1m';
const ACCENT = '\x1b[38;2;229;160;13m';        // #E5A00D

function stripAnsi(str) {
  return str.replace(/\x1b\[[0-9;]*m/g, '');
}

function summaryBox(mark, pairs, width = 44) {
  const inner = width - 4;
  const border = (l, fill, r) =>
    `  ${BORDER}${l}${fill.repeat(width - 2)}${r}${RESET}`;
  const line = (content) => {
    const pad = inner - stripAnsi(content).length;
    return `  ${BORDER}│${RESET}  ${content}${' '.repeat(Math.max(0, pad))}  ${BORDER}│${RESET}`;
  };
  const empty = line(' '.repeat(inner));

  const lines = [border('┌', '─', '┐'), empty];

  if (mark) {
    lines.push(line(`${BOLD}${ACCENT}/gsp:${RESET} ${BOLD}${mark}${RESET}`));
    lines.push(empty);
  }

  const maxKey = Math.max(...pairs.map(([k]) => k.length));
  for (const [key, value] of pairs) {
    lines.push(line(`${key}:${' '.repeat(maxKey - key.length + 4)}${value}`));
  }

  lines.push(empty, border('└', '─', '┘'));
  return lines.join('\n');
}
```

## Accessibility

- **NO_COLOR:** Box-drawing characters provide clear visual boundaries. Key-value pairs are readable without formatting.
- **Non-TTY / piped:** Render identically. Box-drawing is Unicode, survives pipe.
- **Screen readers:** "Brand: get-shit-pretty, Phases: 5 of 5 complete."

---

## Related

- [Key-Value](./key-value.md) -- inner content format
- [Brand Mark](./brand-mark.md) -- mark rendering within box
- [Banner](./banner.md) -- celebration variant uses sparkle field above
- [../foundations/color-system.md](../foundations/color-system.md)
