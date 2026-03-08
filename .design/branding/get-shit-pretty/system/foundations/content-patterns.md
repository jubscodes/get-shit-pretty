# Content Patterns

> Phase: system | Brand: get-shit-pretty | Generated: 2026-03-08

---

## Philosophy

Terminal output is not logging. It is a designed communication experience. Every line has intent: what the user needs to know, when they need to know it, and how much attention it deserves.

The Warm Mentor voice guides the defaults. Output is direct, respectful of time, and celebrates progress without noise.

---

## Status Messages

The primary output unit. A symbol, a color, a message.

### Status Symbol Set

| Symbol | Color | Token | Meaning |
|--------|-------|-------|---------|
| `✓` | success (`#22C55E`) | `status.success` | Complete, passed, written |
| `✗` | error (`#EF4444`) | `status.error` | Failed, broken, missing |
| `⚠` | warning (`#FBBF24`) | `status.warning` | Caution, manual check needed |
| `ℹ` | info (`#60A5FA`) | `status.info` | Neutral information |
| `◈` | accent (`#FF6B35`) | `status.progress` | In-progress, active |
| `◆` | accent (`#FF6B35`) | `status.complete` | Phase complete (brand-specific) |
| `◇` | text-tertiary (`#666666`) | `status.pending` | Not started, queued |

### Status Message Format

```
  {symbol} {message}
```

Two-space indent. Symbol. One space. Message in text-primary.

### Rendered Examples

```
  ✓ brief validated — all required fields present
  ◈ running strategy phase...
  ✗ brand-platform.md failed to write
  ⚠ no audience defined — using defaults
  ℹ 3 existing chunks found, will regenerate
  ◇ identity phase queued
```

---

## Phase Completion

When a pipeline phase finishes, a structured completion block appears.

### Format

```
  ◆ {phase} complete — {count} chunks written
    ├── {filename}
    ├── {filename}
    └── {filename}
```

### Rules

1. **`◆` symbol in accent color** for the completion line.
2. **Phase name in bold** + accent color.
3. **Chunk count in bold.**
4. **File tree in text-secondary**, using box-drawing characters in text-tertiary.
5. **One blank line before** the completion block. One blank line after.

### Rendered Example

```
  ◆ strategy complete — 6 chunks written
    ├── archetype.md
    ├── brand-prism.md
    ├── brand-platform.md
    ├── golden-circle.md
    ├── messaging-hierarchy.md
    └── positioning.md
```

---

## Error Formatting

Errors get structure: what failed, why, and what to do.

### Format

```
  ✗ {what failed}
    {why it failed}
    {what to do about it}
```

### Rules

1. **First line:** `✗` in error color + description of the failure in text-primary.
2. **Second line:** Cause or context in text-secondary, indented 4 spaces.
3. **Third line (optional):** Remediation action in text-secondary, indented 4 spaces.
4. **Stack traces are hidden by default.** Show with `--verbose` flag. When shown, render in text-tertiary, indented 4 spaces.

### Rendered Example

```
  ✗ brief validation failed
    Missing required field: audience
    Run /gsp:brief to add the missing field.
```

Fatal error with banner (rare):

```
  ┌──────────────────────────────────────────┐
  │                                          │
  │  ✗  Fatal: config.json not found         │
  │                                          │
  │  GSP requires a project config to run.   │
  │  Run /gsp:init to create one.            │
  │                                          │
  └──────────────────────────────────────────┘
```

---

## Progress Output

During agent runs, progress appears as a stream of status updates.

### Running Phase

```
  ◈ strategy
    ◈ analyzing brief constraints...
    ✓ archetype selected — Creator 70% + Magician 30%
    ◈ building brand prism...
    ✓ brand-prism.md written (124 lines)
    ◈ defining positioning...
```

### Rules

1. **Phase name with `◈` at indent-1.** Active phase, accent color.
2. **Sub-tasks with their own symbols at indent-2.** Progress (`◈`) or complete (`✓`).
3. **File writes report the filename and line count** in text-secondary.
4. **Spinner replaces the `◈` symbol** for the currently active task when the terminal supports cursor control.

---

## Summary Screens

End-of-pipeline and end-of-session summaries.

### Format

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

### Rules

1. **Box-drawing border** in text-tertiary.
2. **Brand mark** with current state, bold.
3. **Key-value pairs** with right-padded keys (see Spacing > Alignment).
4. **Duration** in text-secondary.
5. **Centered in terminal** if wider than 80 columns.

---

## Prompt Formatting

When GSP needs user input (brief questions, confirmations, choices).

### Text Input

```
  ? What is the project name?
  > _
```

`?` in info color (`#60A5FA`). Question in bold text-primary. `>` prompt in accent color.

### Confirmation

```
  ? Overwrite existing brand system? (y/N)
  > _
```

Default option in uppercase. Both options shown.

### Choice List

```
  ? Select a phase to run:
    ◆ discover (complete)
    ◆ strategy (complete)
    ◈ verbal (in progress)
    ◇ identity
    ◇ system
```

Diamond states indicate completion status. Active selection highlighted with accent color.

---

## Table Formatting

Aligned columns for structured data display.

### Format

```
  Phase        Status     Chunks    Duration
  ─────        ──────     ──────    ────────
  discover     ◆ done     3         1.2s
  strategy     ◆ done     6         8.4s
  verbal       ◈ active   2/7       ...
  identity     ◇ queued   —         —
```

### Rules

1. **Header row** in bold text-secondary.
2. **Separator row** using `─` in text-tertiary. Length matches column header.
3. **Data rows** in text-primary.
4. **Column alignment:** left-align text, right-align numbers.
5. **Minimum 2 spaces between columns.**
6. **No vertical borders** (`│`) in tables. Whitespace separates columns.
7. **Missing data** shown as `—` (em dash), not empty.

---

## List Formatting

### Bulleted List

```
  - Item one
  - Item two
  - Item three
```

Hyphen + space at indent-1. Simple. No fancy bullets.

### Numbered List

```
  1. First step
  2. Second step
  3. Third step
```

### Nested List

```
  - Parent item
    - Child item
    - Child item
  - Parent item
```

Child indent is 2 additional spaces (indent-2 from parent).

---

## Dividers

### Section Divider

A horizontal rule between major sections when box borders are not used.

```
  ──────────────────────────────
```

Box-drawing `─` character, 30 characters wide, in text-tertiary. One blank line above and below.

### Inline Separator

```
  discover ─── strategy ─── verbal ─── identity ─── system
```

Three `─` characters between items. Used for pipeline flow visualization.

---

## Related

- [Color System](./color-system.md) — semantic color tokens for status symbols
- [Typography](./typography.md) — text formatting for heading and emphasis
- [Spacing](./spacing.md) — indentation and vertical rhythm rules
- [ASCII Art](./ascii-art.md) — tree rendering and box-drawing specs
- [Motion](./motion.md) — animated progress output
