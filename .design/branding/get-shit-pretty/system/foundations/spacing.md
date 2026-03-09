# Spacing

> Phase: system | Brand: get-shit-pretty | Generated: 2026-03-08

---

## Terminal Spacing Units

Terminal spacing is measured in two units: **columns** (horizontal) and **lines** (vertical). There are no sub-character units. One space character = one column. One newline = one line.

The 8px base spacing system from the identity translates to character/line units for terminal output.

---

## Vertical Rhythm

Vertical spacing creates hierarchy and breathing room in terminal output. Blank lines are the primary tool.

| Token | Lines | Use |
|-------|-------|-----|
| `space-0` | 0 | Consecutive related lines (list items, table rows) |
| `space-1` | 1 | Between groups within a section (after a heading, between paragraphs) |
| `space-2` | 2 | Between major sections (before H1, between phase blocks) |
| `space-3` | 3 | Hero moments only (before/after ASCII art banners, install splash) |

### Rules

1. **Never exceed 3 blank lines.** More than 3 reads as a bug, not a design choice.
2. **No trailing blank lines** at the end of output.
3. **One blank line before the first content line** after the command is invoked (gives the eye a landing point).
4. **Two blank lines before phase headers** to clearly separate major sections.

### Rendered Example

```
$ npx get-shit-pretty                          ← command
                                               ← space-1 (landing)
  /gsp: ◇◇                                    ← brand mark
                                               ← space-2
                                               ← space-2
  Discovery                                    ← H1 phase header
                                               ← space-1
  Analyzing project structure...               ← body
  Found package.json                           ← body
  Found tsconfig.json                          ← body
                                               ← space-1
  ✓ discovery complete — 3 sources analyzed    ← completion
                                               ← space-2
                                               ← space-2
  Strategy                                     ← H1 next phase
```

---

## Horizontal Spacing (Indentation)

| Token | Columns | Use |
|-------|---------|-----|
| `indent-0` | 0 | Top-level output (rare — most output uses indent-1) |
| `indent-1` | 2 | Default output indentation. All primary content. |
| `indent-2` | 4 | Nested content. Sub-items, detail lines under a header. |
| `indent-3` | 6 | Deep nesting. Third-level items. Avoid if possible. |
| `indent-4` | 8 | Maximum nesting depth. Indicates a structural problem if reached frequently. |

### Rules

1. **All GSP output is indented 2 spaces from the left edge** (`indent-1`). This separates GSP output from the shell prompt and gives visual margin.
2. **Maximum nesting depth is 4 levels** (8 columns from left). If content needs deeper nesting, restructure it.
3. **Use 2-space increments consistently.** Never mix 2-space and 4-space indentation in the same output block.
4. **Tree structures use box-drawing characters** at the indent level, not additional spaces.

### Rendered Example

```
  ✓ identity complete — 7 chunks written       ← indent-1 (2 cols)
    ├── color-system.md                         ← indent-2 (4 cols) + tree chars
    ├── typography.md                           ← indent-2
    ├── logo-directions.md                      ← indent-2
    │   ├── Direction 1: Living Mark            ← indent-3 (6 cols) + tree chars
    │   └── Direction 2: Minimal Slash          ← indent-3
    └── imagery-style.md                        ← indent-2
```

---

## Box Padding

When content appears inside box-drawing borders, consistent padding applies.

| Element | Value | Example |
|---------|-------|---------|
| **Top padding** | 1 blank line after top border | `┌──────┐\n│\n│  content` |
| **Bottom padding** | 1 blank line before bottom border | `content\n│\n└──────┘` |
| **Left padding** | 2 spaces after `│` | `│  content` |
| **Right padding** | 2 spaces before `│` (if right-bordered) | `content  │` |

### Rendered Example

```
  ┌──────────────────────────────────────────┐
  │                                          │
  │  Brand: get-shit-pretty                  │
  │  Phase: strategy                         │
  │  Chunks: 6                               │
  │                                          │
  └──────────────────────────────────────────┘
```

---

## Terminal Width Handling

| Width | Classification | Behavior |
|-------|---------------|----------|
| < 40 cols | **Narrow** | Truncate long lines with `...`. Collapse tree structures. Single-column tables. |
| 40-79 cols | **Compact** | Reduce padding. Abbreviate labels. Wrap at boundary. |
| 80-119 cols | **Standard** | Default layout. Full labels. Standard padding. |
| >= 120 cols | **Wide** | Allow expanded tables. Keep content at 80-col reading width, don't stretch. |

### Rules

1. **Detect terminal width** at startup via `process.stdout.columns`.
2. **Never assume width.** Default to 80 if detection fails.
3. **Content does not stretch to fill wide terminals.** Maximum content width is 80 characters. Wide terminals get more margin, not wider content.
4. **Tables may use up to 120 columns** in wide terminals.
5. **Truncation character is `...`** (three dots, not ellipsis character, for monospace alignment).

---

## Alignment

| Pattern | Method | Use |
|---------|--------|-----|
| **Left-aligned** | Default | All text, all contexts |
| **Right-aligned** | Pad with spaces | Numeric columns in tables, timestamps |
| **Center-aligned** | Pad with spaces | ASCII art banners, brand mark, hero moments only |
| **Columnar** | Fixed column widths | Key-value pairs, tables, status lines |

### Key-Value Alignment

```
  Brand:    get-shit-pretty                    ← keys right-padded to longest key
  Phase:    strategy                              values left-aligned
  Chunks:   6
  Duration: 2.3s
```

Pad key names to the width of the longest key in the group. Two spaces between the key's colon and the value.

---

## Related

- [Typography](./typography.md) — heading levels that determine vertical spacing
- [ASCII Art](./ascii-art.md) — spacing within and around art elements
- [Content Patterns](./content-patterns.md) — spacing in structured output patterns
