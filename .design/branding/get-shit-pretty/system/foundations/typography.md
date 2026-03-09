# Typography

> Phase: system | Brand: get-shit-pretty | Generated: 2026-03-08

---

## Terminal Type Philosophy

Everything is monospace. There is no font choice in a terminal -- there is only the user's configured monospace face. GSP's typographic system operates through ANSI text formatting: bold, dim, italic, underline, and strikethrough. These are the weight, size, and color of terminal typography.

JetBrains Mono is the brand's recommended terminal font. But the system must work in any monospace face the user has configured.

---

## ANSI Text Styles

| Style | ANSI Code | Reset | Use | Node.js (picocolors) |
|-------|-----------|-------|-----|---------------------|
| **Bold** | `\x1b[1m` | `\x1b[22m` | Headings, emphasis, brand name, key values | `pc.bold()` |
| **Dim** | `\x1b[2m` | `\x1b[22m` | Secondary info, decorative elements, sparkle | `pc.dim()` |
| **Italic** | `\x1b[3m` | `\x1b[23m` | Descriptions, notes, voice-mode text | `pc.italic()` |
| **Underline** | `\x1b[4m` | `\x1b[24m` | Links, actionable items (sparingly) | `pc.underline()` |
| **Strikethrough** | `\x1b[9m` | `\x1b[29m` | Replaced values, migration diffs | `pc.strikethrough()` |
| **Inverse** | `\x1b[7m` | `\x1b[27m` | Inline badges, critical highlights only | `pc.inverse()` |

---

## Heading Hierarchy

Terminal has no font sizes. Hierarchy is expressed through formatting, color, spacing, and structural characters.

| Level | Formatting | Color | Prefix | Vertical Space Before | Use |
|-------|-----------|-------|--------|----------------------|-----|
| **H1** | Bold + Accent | `#FF6B35` | None | 2 blank lines | Phase headers, major sections |
| **H2** | Bold | text-primary | None | 1 blank line | Subsections, command output titles |
| **H3** | Bold + Dim | text-secondary | `  ` (2-space indent) | 1 blank line | Group labels within sections |
| **Body** | Normal | text-primary | None | 0 (flow) | Default output text |
| **Secondary** | Normal | text-secondary | None | 0 (flow) | Descriptions, metadata |
| **Tertiary** | Dim | text-tertiary | None | 0 (flow) | Hints, decorative, timestamps |
| **Label** | Bold | text-secondary | None | 0 (flow) | Key names in key-value pairs |

### Rendered Examples

```
                                                       ← blank line
                                                       ← blank line
  Strategy                                             ← H1: bold + accent (#FF6B35)
                                                       ← blank line
  Brand Platform                                       ← H2: bold, text-primary
  Defines purpose, vision, values, and brand essence.  ← Secondary: text-secondary
                                                       ← blank line
    Values                                             ← H3: bold, text-secondary, indented
    Craft over speed                                   ← Body: text-primary
    Coherence over novelty                             ← Body: text-primary
```

---

## Line Length

| Context | Max Characters | Rationale |
|---------|---------------|-----------|
| **Primary output** | 80 columns | Universal terminal default. Safe for all environments. |
| **Wide output** | 120 columns | Modern widescreen terminals. Tables, trees, diff output. |
| **Minimum viable** | 40 columns | Narrow panes, split terminals. Graceful truncation. |

Rules:
- Wrap text at 80 characters by default. Do not hard-wrap -- let the terminal handle reflow.
- Tables and structured output may extend to 120 characters. Truncate with `...` if the terminal is narrower.
- Never output lines wider than 120 characters.
- Test critical output at 40 columns to ensure nothing breaks.

---

## Character Width

All layout math assumes fixed-width characters. One character = one column.

**Known exceptions** (handle explicitly):
- Unicode diamonds (◇◈◆) are often fullwidth in CJK fonts -- test rendering
- Emoji are typically 2 columns wide -- avoid emoji in structured layouts
- Box-drawing characters (┌─┐│└┘) are reliably 1 column in monospace faces

---

## Text Emphasis Patterns

Instead of font weight and size variation, terminal typography uses combinatorial formatting.

| Pattern | Formatting | Example Use |
|---------|-----------|-------------|
| **Brand name** | Bold + accent color | `/gsp:` in headers |
| **Phase name** | Bold + accent color | `strategy`, `identity` |
| **File path** | Dim | `./foundations/color-system.md` |
| **Command** | Bold | `/gsp:project-brief`, `npx get-shit-pretty` |
| **Statistic** | Bold + accent color | `6 chunks`, `142 lines` |
| **Timestamp** | Dim + tertiary | `2.3s` |
| **Placeholder** | Italic + tertiary | `<project-name>` |
| **Deprecated** | Strikethrough + dim | Old command names |

---

## Formatting Combinations

Safe to combine (well-supported):

```
Bold + Color          → \x1b[1m\x1b[38;2;255;107;53m  (brand headings)
Dim + Color           → \x1b[2m\x1b[38;2;102;102;102m  (atmosphere)
Bold + Underline      → \x1b[1m\x1b[4m                  (rare, links)
```

Avoid combining:

```
Bold + Dim            → conflicting intensity, terminal-dependent
Italic + Underline    → visual noise, hard to read
Strikethrough + Dim   → invisible in some terminals
```

---

## Identity Type Scale Mapping

The brand identity defines a pixel-based type scale (Display XL at 72px down to Code SM at 12px). In the terminal, this maps to formatting treatments, not sizes.

| Identity Level | Terminal Equivalent | Formatting |
|---------------|-------------------|------------|
| Display XL (72px) | ASCII art banner | Density ramp + bold, multi-line |
| Display (48px) | Phase header | Bold + accent, 2 blank lines above |
| H1 (36px) | Section header | Bold + accent |
| H2 (28px) | Subsection header | Bold, text-primary |
| H3 (22px) | Group label | Bold, text-secondary, indented |
| H4 (18px) | Item label | Bold, text-secondary |
| Body (16px) | Default text | Normal, text-primary |
| Body SM (14px) | Secondary text | Normal, text-secondary |
| Caption (12px) | Hint text | Dim, text-tertiary |
| Code (14px) | N/A (everything is already monospace) | Normal |

---

## Related

- [Color System](./color-system.md) — color tokens used in text hierarchy
- [Spacing](./spacing.md) — vertical rhythm between heading levels
- [Content Patterns](./content-patterns.md) — how type hierarchy appears in real output
