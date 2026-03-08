# Brand Mark

> Phase: system | Brand: get-shit-pretty | Generated: 2026-03-08

---

## Description

The `/gsp: ◇◇` lockup is the brand's living mark in the terminal. Two Unicode diamonds represent the dual-diamond methodology (branding + project). The mark is state-aware: diamond fills reflect actual pipeline progress. Three rendering forms: full lockup, wordmark only, symbol only.

Use for: session start, banner composition, statusline, inline brand references.

## Anatomy

```
  /gsp: ◇◇
  ╰──╯  ╰╯
   │     └── symbol: two diamonds (branding + project state)
   └──────── wordmark: slash + brand abbreviation + colon
```

- **Wordmark** (`/gsp:`) -- accent-colored, bold
- **Space** -- single space between wordmark and symbol
- **Symbol** -- two diamonds, single space between them: `◇◇` not `◇ ◇`

Wait -- reviewing the foundation spec: spacing between diamonds is one space, and the mark format shows `◇◇` without space. Let me align to the foundation:

Per ascii-art.md: "Spacing between diamonds: one space character. `/gsp: ◇◇`" -- the example shows no space between the two diamond characters but the rule says one space. The rendered examples throughout foundations consistently show `◇◇` (no space). Following the rendered examples as canonical: **no space between diamonds**.

## Variants

### Full Lockup

```
  /gsp: ◇◇
```

Wordmark + symbol. Used at session start, in banners, and in summary boxes.

### Wordmark Only

```
  /gsp:
```

For inline references, prompts, and contexts where diamonds would be noise.

### Symbol Only

```
  ◇◇
```

For compact contexts: statusline, inline state indicators.

## States

| State | Mark | Meaning |
|-------|------|---------|
| Starting | `/gsp: ◇◇` | Nothing done |
| Branding active | `/gsp: ◈◇` | Branding pipeline in progress |
| Branding complete | `/gsp: ◆◇` | Branding done, project not started |
| Project active | `/gsp: ◆◈` | Branding done, project in progress |
| Shipped | `/gsp: ◆◆` | Everything complete |

Left diamond = branding. Right diamond = project. Always. Never swap.

## Token Usage

| Token | Source | Value |
|-------|--------|-------|
| `mark.lockup` | tokens.json | `/gsp: ◇◇` |
| `mark.wordmark` | tokens.json | `/gsp:` |
| `mark.symbol` | tokens.json | `◇◇` |
| `mark.states.*` | tokens.json | state-specific strings |
| `ascii.diamond.empty` | tokens.json | `◇` |
| `ascii.diamond.progress` | tokens.json | `◈` |
| `ascii.diamond.filled` | tokens.json | `◆` |
| `color.accent` | color-system.md | `#FF6B35` -- wordmark, `◈` diamond |
| `color.text-primary` | color-system.md | `#E0E0E0` -- diamonds default |
| `color.text-tertiary` | color-system.md | `#666666` -- `◇` empty diamond |
| `typography.bold` | typography.md | `\x1b[1m` -- always bold |

## Rendering Rules

1. Wordmark (`/gsp:`) is always bold + accent.
2. Empty diamonds (`◇`) are text-tertiary.
3. In-progress diamonds (`◈`) are accent-colored.
4. Filled diamonds (`◆`) are text-primary (they recede once complete).
5. The mark appears once at session start. It does not repeat in output.
6. If the mark is still visible in the viewport, update diamond state in-place using cursor positioning.
7. If the mark has scrolled off-screen, do not reprint. Phase completion messages carry state forward.
8. The mark is always bold as a unit.
9. In non-Unicode terminals, use ASCII fallback: `/gsp: <> <>` pattern.

## Rendered Examples

Session start:

```
  /gsp: ◇◇
```

Mid-branding:

```
  /gsp: ◈◇
```

Branding complete, project active:

```
  /gsp: ◆◈
```

Shipped:

```
  /gsp: ◆◆
```

Wordmark only (inline):

```
  Run /gsp: brief to start.
```

ASCII fallback:

```
  /gsp: <> <>
  /gsp: <=> <>
  /gsp: <*> <*>
```

## Implementation

```javascript
const RESET = '\x1b[0m'
const BOLD = '\x1b[1m'
const ACCENT = '\x1b[38;2;255;107;53m'
const PRIMARY = '\x1b[38;2;224;224;224m'
const TERTIARY = '\x1b[38;2;102;102;102m'

const DIAMOND_STYLE = {
  empty:    `${TERTIARY}◇${RESET}`,
  progress: `${ACCENT}◈${RESET}`,
  filled:   `${PRIMARY}◆${RESET}`,
}

function brandMark(brandingState, projectState) {
  const left = DIAMOND_STYLE[brandingState]
  const right = DIAMOND_STYLE[projectState]
  return `${BOLD}${ACCENT}/gsp:${RESET} ${BOLD}${left}${right}${RESET}`
}

// State helpers
const STATES = {
  starting:          () => brandMark('empty', 'empty'),
  brandingActive:    () => brandMark('progress', 'empty'),
  brandingComplete:  () => brandMark('filled', 'empty'),
  projectActive:     () => brandMark('filled', 'progress'),
  shipped:           () => brandMark('filled', 'filled'),
}
```

## Accessibility

- **Without color:** Diamond shapes (◇, ◈, ◆) are visually distinct characters. State is readable from shape alone.
- **Non-TTY / piped:** Static mark rendered once. No in-place updates. Strip ANSI codes. Unicode diamonds survive pipe.
- **Non-Unicode:** Fall back to ASCII diamond representations. Test with `LANG=C`.
- **Screen readers:** "slash gsp colon" + diamond characters. The important information is the state, communicated redundantly through the context (phase completion messages).

---

## Related

- [Statusline](./statusline.md) -- includes brand mark in a status bar
- [Banner](./banner.md) -- mark centered in hero compositions
- [Summary Box](./summary-box.md) -- mark as first line in box
- [Spinner](./spinner.md) -- shares diamond character set
- [../foundations/ascii-art.md](../foundations/ascii-art.md) -- diamond system specification
