# Banner

> Phase: system | Brand: get-shit-pretty | Generated: 2026-03-08

---

## Description

Hero moment display for milestone events. Combines sparkle field, density ramp, brand mark, and tagline into a multi-line centered composition. Reserved for high-impact moments only: install splash, diamond completion (all shipped), and major celebrations.

Use for: first install, all-phases-complete, launch moment, major version milestone.

## Anatomy

```
                                            ← space-3 (3 blank lines)
      ✧    .              ·    ✧           ← sparkle field (2-3 lines)
 .         ·    ✧              .

   ░▒▓█  GET SHIT PRETTY  █▓▒░            ← density ramp + title
                                            ← space-1
          /gsp: {state}                     ← brand mark
                                            ← space-1
    {tagline line 1}                        ← tagline / message
    {tagline line 2}
                                            ← space-3 (3 blank lines)
```

- **Sparkle field** -- 2-3 lines of sparse `✧ . ·` in text-tertiary, asymmetric
- **Density ramp** -- `░▒▓█ {TITLE} █▓▒░`, ramp in accent, title in bold text-primary
- **Brand mark** -- centered, state-aware
- **Tagline** -- centered, text-secondary

## Variants

### Install Splash

First-run experience. Title is "GET SHIT PRETTY". Diamonds at `◇◇`.

### Ship Celebration

All phases complete. Diamonds at `◆◆`. Custom message instead of default tagline.

### Milestone

Intermediate celebration. Custom title in density ramp. Diamonds reflect current state.

## Token Usage

| Token | Source | Value |
|-------|--------|-------|
| `ascii.sparkle.*` | tokens.json | `✧`, `.`, `·` |
| `ascii.density-ramp.*` | tokens.json | `░▒▓█` |
| `color.accent` | color-system.md | `#FF6B35` -- density ramp |
| `color.text-primary` | color-system.md | `#E0E0E0` -- title text |
| `color.text-secondary` | color-system.md | `#A0A0A0` -- tagline |
| `color.text-tertiary` | color-system.md | `#666666` -- sparkle field |
| `typography.bold` | typography.md | `\x1b[1m` -- title, mark |
| `mark.states.*` | tokens.json | brand mark strings |
| `spacing.vertical.lg` | spacing.md | 3 lines -- above/below |
| `spacing.vertical.sm` | spacing.md | 1 line -- between sections |

## Rendering Rules

1. Three blank lines (space-3) above and below the entire banner.
2. Center-align all content within the terminal width.
3. Maximum banner width: 50 characters. Fits in 80-col with margin.
4. Sparkle field: 5-8 characters across 2-3 lines. Asymmetric placement. Always text-tertiary.
5. Density ramp characters in accent color. Two spaces between ramp and title on each side.
6. Title text is uppercase, bold, text-primary.
7. Brand mark uses current pipeline state. Bold.
8. Tagline is text-secondary, max 2 lines, centered.
9. In narrow terminals (< 50 cols), drop sparkle field. Keep ramp + mark + tagline.
10. In very narrow terminals (< 40 cols), drop ramp. Just mark + tagline.

## Rendered Examples

Install splash:

```



      ✧    .              ·    ✧
 .         ·    ✧              .

   ░▒▓█  GET SHIT PRETTY  █▓▒░

          /gsp: ◇◇

    design engineering for the
    terminal. brief to build.



```

Ship celebration:

```



        ✧   ·        .   ✧
   .        ✧    ·          .

   ░▒▓█  GET SHIT PRETTY  █▓▒░

          /gsp: ◆◆

       brand system shipped.
       24 chunks. 47.2 seconds.



```

Narrow fallback (< 50 cols):

```



  ░▒▓█  GET SHIT PRETTY  █▓▒░

        /gsp: ◇◇

  design engineering for
  the terminal.



```

## Implementation

```javascript
const RESET = '\x1b[0m'
const BOLD = '\x1b[1m'
const ACCENT = '\x1b[38;2;255;107;53m'
const TERTIARY = '\x1b[38;2;102;102;102m'
const SECONDARY = '\x1b[38;2;160;160;160m'

function center(text, width) {
  const stripped = text.replace(/\x1b\[[0-9;]*m/g, '')
  const pad = Math.max(0, Math.floor((width - stripped.length) / 2))
  return ' '.repeat(pad) + text
}

function banner(mark, taglines = [], width = 80) {
  const title = `${ACCENT}░▒▓█${RESET}  ${BOLD}GET SHIT PRETTY${RESET}  ${ACCENT}█▓▒░${RESET}`
  const markStr = `${BOLD}${ACCENT}/gsp:${RESET} ${BOLD}${mark}${RESET}`

  const sparkleLines = width >= 50 ? [
    `${TERTIARY}      ✧    .              ·    ✧${RESET}`,
    `${TERTIARY} .         ·    ✧              .${RESET}`,
  ] : []

  const lines = ['', '', '']
  for (const sl of sparkleLines) lines.push(center(sl, width))
  if (sparkleLines.length) lines.push('')
  lines.push(center(title, width))
  lines.push('')
  lines.push(center(markStr, width))
  lines.push('')
  for (const tl of taglines) {
    lines.push(center(`${SECONDARY}${tl}${RESET}`, width))
  }
  lines.push('', '', '')

  return lines.join('\n')
}
```

## Accessibility

- **Without color:** Density ramp characters (`░▒▓█`) are visually distinct even in monochrome. Sparkle characters serve as decorative framing. All meaning is in the title, mark, and tagline text.
- **Non-TTY / piped:** Strip ANSI codes. Banner structure survives as plain Unicode. Center-alignment uses spaces (survives pipe). Consider omitting sparkle field in CI to reduce noise.
- **Screen readers:** "GET SHIT PRETTY" title, brand mark state, and tagline are the meaningful content. Sparkle and ramp characters are decorative.

---

## Related

- [Brand Mark](./brand-mark.md) -- mark rendering within banner
- [Summary Box](./summary-box.md) -- celebration variant may precede a summary box
- [Divider](./divider.md) -- density ramp is a specialized divider
- [../foundations/ascii-art.md](../foundations/ascii-art.md) -- sparkle field and density ramp specs
- [../foundations/spacing.md](../foundations/spacing.md) -- hero spacing rules
