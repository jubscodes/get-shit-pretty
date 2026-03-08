# Divider

> Phase: system | Brand: get-shit-pretty | Generated: 2026-03-08

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

### Pipeline Flow

```
  discover ─── strategy ─── verbal ─── identity ─── system
```

## Variants

| Variant | Structure | Use |
|---------|-----------|-----|
| **Plain** | 30 `─` characters | General section break |
| **Labeled** | 3 `─` + space + label + space + 3 `─` | Named section break |
| **Pipeline** | Phase names connected by 3 `─` | Pipeline flow visualization |

## Token Usage

| Token | Source | Value |
|-------|--------|-------|
| `ascii.box.horizontal` | tokens.json | `─` |
| `color.text-tertiary` | color-system.md | `#666666` -- rule and connectors |
| `color.text-secondary` | color-system.md | `#A0A0A0` -- label text |
| `spacing.horizontal.indent-1` | spacing.md | 2 cols |
| `spacing.vertical.sm` | spacing.md | 1 line above/below |

## Rendering Rules

1. Plain rule: 30 `─` characters at indent-1, text-tertiary.
2. Labeled divider: 3 `─` + space + label (text-secondary) + space + 3 `─`, text-tertiary for rules.
3. Pipeline flow: see pipeline-flow component for full spec.
4. One blank line (space-1) above and below all divider variants.
5. Never use ASCII hyphens (`-`) or equals (`=`). Always box-drawing `─`.
6. Divider width does not stretch to fill terminal. Fixed at 30 chars (plain) or content-determined (labeled).
7. In narrow terminals, plain rule shortens to 20 chars. Labeled divider drops trailing `─`.

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

## Implementation

```javascript
const RESET = '\x1b[0m'
const TERTIARY = '\x1b[38;2;102;102;102m'
const SECONDARY = '\x1b[38;2;160;160;160m'

function divider(width = 30) {
  return `\n  ${TERTIARY}${'─'.repeat(width)}${RESET}\n`
}

function labeledDivider(label) {
  return `\n  ${TERTIARY}───${RESET} ${SECONDARY}${label}${RESET} ${TERTIARY}───${RESET}\n`
}
```

## Accessibility

- **Without color:** `─` is a clear visual separator in any terminal. Label text is plain.
- **Non-TTY / piped:** Identical output. Box-drawing character survives pipe.
- **Screen readers:** The `─` characters may be announced as "box drawings light horizontal." Label text provides the semantic meaning.

---

## Related

- [Pipeline Flow](./pipeline-flow.md) -- extends divider concept for pipeline visualization
- [Table](./table.md) -- table separators use the same `─` character
- [Summary Box](./summary-box.md) -- box borders use `─` in a different context
- [../foundations/ascii-art.md](../foundations/ascii-art.md)
- [../foundations/spacing.md](../foundations/spacing.md)
