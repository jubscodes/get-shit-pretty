# Banner

> Phase: system | Brand: get-shit-pretty-v2 | Generated: 2026-03-19

---

## Description

Hero moment display for milestone events. Combines sparkle field, density ramp, brand mark, and tagline into a multi-line centered composition. Reserved for high-impact moments only: install splash, diamond completion (all shipped), and major celebrations.

Use for: first install, all-phases-complete, launch moment, major version milestone.

## Anatomy

```
                                            <- 3 blank lines above
      .    .              .    .           <- sparkle field (2-3 lines)
 .         .    .              .

   [][][]  GET SHIT PRETTY  [][][]        <- density ramp + title

          /gsp: {state}                    <- brand mark

    {tagline line 1}                       <- tagline / message
    {tagline line 2}
                                            <- 3 blank lines below
```

- **Sparkle field** -- 2-3 lines of sparse `. . .` in `--color-text-muted`, asymmetric
- **Density ramp** -- `[][][]  {TITLE}  [][][]`, ramp in `--color-accent`, title in bold `--color-text-bright`
- **Brand mark** -- centered, state-aware
- **Tagline** -- centered, `--color-text-muted`

## Variants

### Install Splash

First-run experience. Title is "GET SHIT PRETTY". Diamonds at starting state.

### Ship Celebration

All phases complete. Diamonds at shipped state. Custom message instead of default tagline.

### Milestone

Intermediate celebration. Custom title in density ramp. Diamonds reflect current state.

## Token Usage

| Element | Token | Reference |
|---------|-------|-----------|
| Sparkle chars | `.` | Unicode period/bullet |
| Density ramp | `░▒▓█` | `component.progress-bar.filled` / `component.progress-bar.empty` |
| Ramp color | `--color-accent` | `color.accent.default` = `#E5A00D` |
| Title text | `--color-text-bright` | `color.text.bright` = `#FAFAFA` |
| Title weight | Bold | `\x1b[1m` |
| Tagline color | `--color-text-muted` | `color.text.muted` = `#6B6B6B` |
| Sparkle color | `--color-text-muted` | `color.text.muted` = `#6B6B6B` |
| Mark | brand-mark component | See [brand-mark.md](./brand-mark.md) |
| Spacing above/below | 3 blank lines | `--space-6` equivalent |
| Spacing between sections | 1 blank line | `--space-4` equivalent |

## Rendering Rules

### All Tiers

1. Three blank lines above and below the entire banner.
2. Center-align all content within the terminal width.
3. Maximum banner width: 50 characters. Fits in 80-col with margin.
4. Title text is uppercase, bold.
5. Brand mark uses current pipeline state. Bold.
6. Tagline max 2 lines, centered.

### Truecolor (Tier 1)

```
Ramp:     \x1b[38;2;229;160;13m   (accent foreground)
Title:    \x1b[1m\x1b[38;2;250;250;250m
Sparkle:  \x1b[38;2;107;107;107m
Tagline:  \x1b[38;2;107;107;107m
```

### 256-color (Tier 2)

```
Ramp:     \x1b[38;5;178m
Title:    \x1b[1m\x1b[38;5;255m
Sparkle:  \x1b[38;5;242m
Tagline:  \x1b[38;5;242m
```

### 16-color (Tier 3)

```
Ramp:     \x1b[33m (yellow)
Title:    \x1b[1m\x1b[97m (bright white)
Sparkle:  \x1b[90m (bright black)
Tagline:  \x1b[90m
```

### No-color (Tier 4)

Strip all ANSI codes. Sparkle field, density ramp characters, and text survive as plain Unicode.

## Responsive Behavior

| Terminal Width | Behavior |
|---------------|----------|
| >= 50 cols | Full banner: sparkle + ramp + mark + tagline |
| 40-49 cols | Drop sparkle field. Keep ramp + mark + tagline |
| < 40 cols | Drop ramp. Just mark + tagline, left-aligned at indent-1 |

## Rendered Examples

Install splash (>= 50 cols):

```


      .    .              .    .
 .         .    .              .

   ░▒▓█  GET SHIT PRETTY  █▓▒░

          /gsp: ◇◇

    design engineering for the
    terminal. brief to build.



```

Ship celebration:

```


        .   .        .   .
   .        .    .          .

   ░▒▓█  GET SHIT PRETTY  █▓▒░

          /gsp: ◆◆

       brand system shipped.
       24 chunks. 47.2 seconds.



```

## Code Hints

```javascript
const RESET = '\x1b[0m';
const BOLD = '\x1b[1m';
const ACCENT = '\x1b[38;2;229;160;13m';      // #E5A00D
const BRIGHT = '\x1b[38;2;250;250;250m';      // #FAFAFA
const MUTED = '\x1b[38;2;107;107;107m';        // #6B6B6B

function center(text, width) {
  const stripped = text.replace(/\x1b\[[0-9;]*m/g, '');
  const pad = Math.max(0, Math.floor((width - stripped.length) / 2));
  return ' '.repeat(pad) + text;
}

function banner(mark, taglines = [], width = 80) {
  const title = `${ACCENT}░▒▓█${RESET}  ${BOLD}${BRIGHT}GET SHIT PRETTY${RESET}  ${ACCENT}█▓▒░${RESET}`;
  const markStr = `${BOLD}${ACCENT}/gsp:${RESET} ${BOLD}${mark}${RESET}`;

  const sparkleLines = width >= 50 ? [
    `${MUTED}      .    .              .    .${RESET}`,
    `${MUTED} .         .    .              .${RESET}`,
  ] : [];

  const lines = ['', '', ''];
  for (const sl of sparkleLines) lines.push(center(sl, width));
  if (sparkleLines.length) lines.push('');
  if (width >= 40) lines.push(center(title, width));
  lines.push('');
  lines.push(center(markStr, width));
  lines.push('');
  for (const tl of taglines) {
    lines.push(center(`${MUTED}${tl}${RESET}`, width));
  }
  lines.push('', '', '');
  return lines.join('\n');
}
```

## Accessibility

- **NO_COLOR:** Density ramp characters (`░▒▓█`) are visually distinct even without color. Sparkle characters are decorative. Title, mark, and tagline carry all meaning.
- **Non-TTY / piped:** Strip ANSI codes. Banner structure survives as plain Unicode. Center-alignment uses spaces. Consider omitting sparkle field in CI.
- **Screen readers:** Title text, brand mark state, and tagline are meaningful. Sparkle and ramp characters are decorative.

---

## Related

- [Brand Mark](./brand-mark.md) -- mark rendering within banner
- [Summary Box](./summary-box.md) -- celebration variant may precede a summary box
- [Divider](./divider.md) -- density ramp is a specialized divider
- [../foundations/color-system.md](../foundations/color-system.md) -- accent and text colors
- [../foundations/spacing.md](../foundations/spacing.md) -- vertical spacing rules
