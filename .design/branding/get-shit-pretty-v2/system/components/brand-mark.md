# Brand Mark

> Phase: system | Brand: get-shit-pretty-v2 | Generated: 2026-03-19

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
- **Symbol** -- two diamonds, no space between: `◇◇`

## States

| State | Mark | Meaning |
|-------|------|---------|
| Starting | `/gsp: ◇◇` | Nothing done |
| Branding active | `/gsp: ◈◇` | Branding pipeline in progress |
| Branding complete | `/gsp: ◆◇` | Branding done, project not started |
| Project active | `/gsp: ◆◈` | Branding done, project in progress |
| Shipped | `/gsp: ◆◆` | Everything complete |

Left diamond = branding. Right diamond = project. Always. Never swap.

## Variants

### Full Lockup

`/gsp: ◇◇` -- Wordmark + symbol. Session start, banners, summary boxes.

### Wordmark Only

`/gsp:` -- Inline references, prompts, contexts where diamonds would be noise.

### Symbol Only

`◇◇` -- Compact contexts: statusline, inline state indicators.

## Token Usage

| Element | Token | Reference |
|---------|-------|-----------|
| Wordmark color | `--color-accent` | `color.accent.default` = `#E5A00D` |
| Wordmark weight | Bold | `\x1b[1m` |
| Empty diamond `◇` | `--color-text-muted` | `color.text.muted` = `#6B6B6B` |
| In-progress diamond `◈` | `--color-accent` | `color.accent.default` = `#E5A00D` |
| Filled diamond `◆` | `--color-text` | `color.text.primary` = `#E8E8E8` |
| Diamond chars | `component.diamond.*` | `◇`, `◈`, `◆` |

## Rendering Rules

### All Tiers

1. Wordmark (`/gsp:`) is always bold + accent.
2. Empty diamonds (`◇`) are text-muted.
3. In-progress diamonds (`◈`) are accent-colored.
4. Filled diamonds (`◆`) are text-primary (they recede once complete).
5. The mark appears once at session start. It does not repeat in output.
6. The mark is always bold as a unit.

### Color Tier Mapping

| Tier | Wordmark | Empty `◇` | Progress `◈` | Filled `◆` |
|------|----------|-----------|-------------|------------|
| Truecolor | `\x1b[38;2;229;160;13m` | `\x1b[38;2;107;107;107m` | `\x1b[38;2;229;160;13m` | `\x1b[38;2;232;232;232m` |
| 256-color | `\x1b[38;5;178m` | `\x1b[38;5;242m` | `\x1b[38;5;178m` | `\x1b[38;5;254m` |
| 16-color | `\x1b[33m` | `\x1b[90m` | `\x1b[33m` | `\x1b[37m` |
| No-color | plain text | plain text | plain text | plain text |

### ASCII Fallback

For terminals without Unicode support:

```
  /gsp: <> <>       (starting)
  /gsp: <=> <>      (branding active)
  /gsp: <*> <*>     (shipped)
```

## Code Hints

```javascript
const RESET = '\x1b[0m';
const BOLD = '\x1b[1m';
const ACCENT = '\x1b[38;2;229;160;13m';       // #E5A00D
const TEXT = '\x1b[38;2;232;232;232m';         // #E8E8E8
const MUTED = '\x1b[38;2;107;107;107m';        // #6B6B6B

const DIAMOND_STYLE = {
  empty:    `${MUTED}◇${RESET}`,
  progress: `${ACCENT}◈${RESET}`,
  filled:   `${TEXT}◆${RESET}`,
};

function brandMark(brandingState, projectState) {
  const left = DIAMOND_STYLE[brandingState];
  const right = DIAMOND_STYLE[projectState];
  return `${BOLD}${ACCENT}/gsp:${RESET} ${BOLD}${left}${right}${RESET}`;
}

const STATES = {
  starting:          () => brandMark('empty', 'empty'),
  brandingActive:    () => brandMark('progress', 'empty'),
  brandingComplete:  () => brandMark('filled', 'empty'),
  projectActive:     () => brandMark('filled', 'progress'),
  shipped:           () => brandMark('filled', 'filled'),
};
```

## Accessibility

- **NO_COLOR:** Diamond shapes (◇, ◈, ◆) are visually distinct characters. State is readable from shape alone.
- **Non-TTY / piped:** Static mark rendered once. Strip ANSI codes. Unicode diamonds survive pipe.
- **Non-Unicode:** Fall back to ASCII diamond representations. Test with `LANG=C`.
- **Screen readers:** "slash gsp colon" + diamond characters. State communicated redundantly through phase completion messages.

---

## Related

- [Statusline](./statusline.md) -- includes brand mark
- [Banner](./banner.md) -- mark centered in hero compositions
- [Summary Box](./summary-box.md) -- mark as first line in box
- [Spinner](./spinner.md) -- shares diamond character set
- [../foundations/color-system.md](../foundations/color-system.md)
