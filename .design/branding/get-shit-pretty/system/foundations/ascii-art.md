# ASCII Art System

> Phase: system | Brand: get-shit-pretty | Generated: 2026-03-08

---

## Philosophy

ASCII art is GSP's equivalent of illustration. It is not retro decoration -- it is the brand's visual language operating in the medium where the brand lives. Every composition is hand-crafted, deliberate, and traceable to the brand strategy.

The Creator archetype builds systems. The Magician archetype reveals transformations. ASCII art does both: systematic character sets that create moments of wonder.

---

## The Living Diamond System

The brand mark IS the pipeline state. Two Unicode diamonds represent the dual-diamond methodology.

### Characters

| Character | Name | Unicode | Meaning |
|-----------|------|---------|---------|
| `◇` | Empty diamond | U+25C7 | Not started |
| `◈` | In-progress diamond | U+25C8 | Active, working |
| `◆` | Filled diamond | U+25C6 | Complete |

### States

```
  ◇◇    nothing done (starting state)
  ◈◇    branding in progress
  ◆◇    branding complete, project not started
  ◆◈    branding complete, project in progress
  ◆◆    everything shipped (final state)
```

### ASCII Fallback

For terminals without Unicode diamond support:

```
  <>  <>     empty (starting)
  <=> <>     branding in progress
  <*> <>     branding complete
  <*> <=>    project in progress
  <*> <*>    shipped
```

### Rendering Rules

1. **State must be truthful.** Never display a filled diamond for a phase that is not complete. The mark is functional, not decorative.
2. **Left diamond = branding.** Right diamond = project. Always. Never swap.
3. **Default color is text-primary** (`#E0E0E0`). Accent color (`#FF6B35`) may be applied to the in-progress diamond (`◈`) only.
4. **Spacing between diamonds:** one space character. `/gsp: ◇◇` not `/gsp: ◇ ◇` and not `/gsp:◇◇`.

### Brand Mark Rendering

```
  /gsp: ◇◇                                   ← full lockup, starting state
  /gsp: ◆◈                                   ← project in progress
  /gsp:                                       ← wordmark only (inline, prompts)
  ◇◇                                          ← symbol only (compact contexts)
```

---

## The Sparkle Field

Scattered atmospheric characters that create wonder around focal elements. The "child's imagination" half of the Teenage Engineering principle.

### Characters

| Char | Name | Role |
|------|------|------|
| `✧` | Brand sparkle | Primary sparkle (U+2727) |
| `.` | Period | Subtle dot |
| `·` | Middle dot | Medium dot (U+00B7) |

**Never use:** `*` (reads as glob/wildcard in CLI), `+`, `x`, `o`

### Placement Rules

1. **Asymmetric.** Never grid-aligned. The irregularity is the charm.
2. **Sparse.** 5-8 characters across 2-3 lines. Resist the urge to fill space.
3. **Dim.** Always rendered in text-tertiary (`#666666`) or ANSI dim. The sparkle is ambient.
4. **Above and around focal content.** Never below (reads as debris, not atmosphere).
5. **Use at reveal moments only.** Install splash, phase completion, final ship. Not routine output.

### Rendered Example

```
      ✧    .              ·    ✧
 .         ·    ✧              .

          /gsp: ◆◆

         get shit pretty.
```

All sparkle characters in dim text-tertiary. Brand mark in bold. Tagline in text-secondary.

---

## The Density Ramp

Four Unicode block characters of increasing density. Void to solid. The pipeline's journey compressed into four glyphs.

### Characters

| Char | Name | Unicode | Density |
|------|------|---------|---------|
| `░` | Light shade | U+2591 | 25% |
| `▒` | Medium shade | U+2592 | 50% |
| `▓` | Dark shade | U+2593 | 75% |
| `█` | Full block | U+2588 | 100% |

### Rendering Rules

1. **Always in accent color** (`#FF6B35`). The density ramp IS the brand color emerging from void.
2. **Always symmetrical.** Opening ramp mirrors closing ramp: `░▒▓█ content █▓▒░`
3. **Hero moments only.** Install splash, major milestones, launch. Never routine output.
4. **Content between ramps is bold text-primary.** The ramp frames; it does not compete.
5. **Two spaces between ramp and content** on each side.

### Rendered Example

```
   ░▒▓█  GET SHIT PRETTY  █▓▒░
```

Ramp characters in accent (`#FF6B35`). "GET SHIT PRETTY" in bold text-primary (`#E0E0E0`).

---

## Box-Drawing System

Unicode box-drawing characters provide architectural structure. The neubrutalist thick borders of the brand identity, translated to terminal.

### Character Set

| Char | Name | Use |
|------|------|-----|
| `┌` | Top-left corner | Box start |
| `─` | Horizontal line | Top/bottom borders, dividers |
| `┐` | Top-right corner | Box start |
| `│` | Vertical line | Side borders, tree branches |
| `└` | Bottom-left corner | Box end, last tree item |
| `┘` | Bottom-right corner | Box end |
| `├` | Left tee | Tree branch (more items follow) |
| `┤` | Right tee | Right-side branch |
| `┬` | Top tee | Column separator in header |
| `┴` | Bottom tee | Column separator in footer |
| `┼` | Cross | Intersection |

**Never use ASCII approximations** (`+`, `-`, `|`) when Unicode box-drawing is available.

### Box Pattern

```
  ┌─────────────────────────────┐
  │                             │
  │  Content with 2-col pad     │
  │                             │
  └─────────────────────────────┘
```

### Divider Pattern

```
  ──────────────────────────────
```

Full-width horizontal rule. Rendered in text-tertiary. Use between major sections when box enclosure is not needed.

---

## Tree Rendering

File trees and hierarchy structures use box-drawing characters with consistent rules.

### Pattern

```
  ├── intermediate item
  ├── intermediate item
  │   ├── nested item
  │   └── last nested item
  └── last item
```

### Rules

1. **`├──` for all items except the last** in a group.
2. **`└──` for the last item** in a group.
3. **`│   ` (pipe + 3 spaces) for continuation** of a parent that has more children.
4. **`    ` (4 spaces) for continuation** past a completed parent.
5. **Two spaces** between `──` and the item label.
6. **Tree characters in text-tertiary.** Item labels in text-primary or text-secondary.

### Rendered Example

```
  ◆ identity complete — 7 chunks written
    ├── color-system.md
    ├── typography.md
    ├── logo-directions.md
    │   ├── Direction 1: Living Mark
    │   ├── Direction 2: Minimal Slash
    │   └── Direction 3: Diamond System
    ├── imagery-style.md
    ├── brand-applications.md
    ├── brand-book.md
    └── palettes.json
```

---

## Progress Indicators

### Spinner

The spinner runs during agent processing. Characters cycle at 80ms intervals.

**Primary spinner (brand):**

```
◇ → ◈ → ◆ → ◈ → ◇ → ◈ → ◆ ...
```

Diamond characters cycle empty-to-filled and back. Rendered in accent color.

**Fallback spinner (ASCII):**

```
- → \ → | → / → - ...
```

For terminals without Unicode support.

### Progress Bar

For operations with known progress (file writing, chunk generation):

```
  ░░░░░░░░░░░░░░░░░░░░  0%     ← empty: text-tertiary
  ▓▓▓▓▓▓░░░░░░░░░░░░░░  30%    ← partial: accent + text-tertiary
  ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓  100%   ← complete: accent (full)
```

Uses `▓` (dark shade) for filled and `░` (light shade) for empty. Width: 20 characters. Percentage right-aligned after 2-space gap.

---

## Banner Art

The install splash and major milestone screens use multi-line ASCII compositions.

### Composition Rules

1. **Center-aligned** within the terminal width.
2. **Maximum width: 50 characters** (fits comfortably in 80-col terminals with margin).
3. **Sparkle field above.** Brand mark or content in center. Tagline or status below.
4. **Three blank lines above and below** the banner block to isolate it as a hero moment.

### Install Splash Template

```


      ✧    .              ·    ✧
 .         ·    ✧              .

   ░▒▓█  GET SHIT PRETTY  █▓▒░

          /gsp: ◇◇

    design engineering for the
    terminal. brief to build.


```

---

## Related

- [Color System](./color-system.md) — color tokens for art elements
- [Spacing](./spacing.md) — vertical rhythm around art blocks
- [Motion](./motion.md) — animation of spinners and progressive reveal
- [Content Patterns](./content-patterns.md) — how art integrates with structured output
