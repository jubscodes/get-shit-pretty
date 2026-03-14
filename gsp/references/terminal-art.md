# Terminal Art Reference

Quick reference for creating ASCII/Unicode art that renders consistently across terminals.

## ANSI Escape Codes

```
\x1b[0m   reset
\x1b[1m   bold
\x1b[2m   dim
\x1b[3m   italic (limited support)
\x1b[4m   underline
\x1b[7m   inverse
```

### Colors (foreground)

```
\x1b[30m  black       \x1b[90m  bright black (gray)
\x1b[31m  red         \x1b[91m  bright red
\x1b[32m  green       \x1b[92m  bright green
\x1b[33m  yellow      \x1b[93m  bright yellow
\x1b[34m  blue        \x1b[94m  bright blue
\x1b[35m  magenta     \x1b[95m  bright magenta
\x1b[36m  cyan        \x1b[96m  bright cyan
\x1b[37m  white       \x1b[97m  bright white
```

### Colors (background)

Same as foreground but 40-47 / 100-107.

### 256 colors

```
\x1b[38;5;{n}m   foreground (0-255)
\x1b[48;5;{n}m   background (0-255)
```

### RGB colors (truecolor)

```
\x1b[38;2;{r};{g};{b}m   foreground
\x1b[48;2;{r};{g};{b}m   background
```

## Unicode Block Characters

### Density gradient (light → heavy)

```
░  U+2591  light shade
▒  U+2592  medium shade
▓  U+2593  dark shade
█  U+2588  full block
```

### Partial blocks

```
▀  U+2580  upper half        ▄  U+2584  lower half
▌  U+258C  left half         ▐  U+2590  right half
▖  U+2596  lower left        ▗  U+2597  lower right
▘  U+2598  upper left        ▝  U+259D  upper right
```

### Box drawing (single)

```
┌ ─ ┐    corners: ┌ ┐ └ ┘
│   │    lines:   ─ │
└ ─ ┘    tees:    ├ ┤ ┬ ┴
         cross:   ┼
```

### Box drawing (double)

```
╔ ═ ╗    corners: ╔ ╗ ╚ ╝
║   ║    lines:   ═ ║
╚ ═ ╝    tees:    ╠ ╣ ╦ ╩
         cross:   ╬
```

### Box drawing (rounded)

```
╭ ─ ╮    corners: ╭ ╮ ╰ ╯
│   │
╰ ─ ╯
```

## Decorative Characters

### Geometric

```
◇ ◆  diamond (outline / filled)
○ ●  circle (outline / filled)
□ ■  square (outline / filled)
△ ▲  triangle up
▽ ▼  triangle down
◁ ◀  triangle left
▷ ▶  triangle right
```

### Dots and stars

```
·  middle dot       •  bullet
∙  bullet operator  ⋅  dot operator
✦  black four-pointed star
✧  white four-pointed star
✶  six-pointed star
★  black star       ☆  white star
```

### Arrows

```
→ ← ↑ ↓   standard
▸ ◂ ▴ ▾   small triangular
⟶ ⟵       long
⇒ ⇐       double
```

### Lines and dashes

```
─  box drawing horizontal
━  heavy horizontal
┈  light quadruple dash
┄  light triple dash
╌  light double dash
~  tilde (wave effect)
```

## Techniques

### Gradient bars

```
░▒▓████▓▒░           horizontal density gradient
▁▂▃▄▅▆▇█▇▆▅▄▃▂▁     vertical block gradient
```

### Scatter / splatter

Use dim dots at varied positions to create a paint-splatter effect:
```
     *    .         ·    *
.         ·    *         .
```

Mix characters: `*` `.` `·` `✦` `˚` for varied visual weight.

### Shadow effect

Offset a dim duplicate behind the main text:
```
 ░░░░░░░░░░░░░░░░
 ░ SHADOW TEXT  ░
 ░░░░░░░░░░░░░░░░
```

### Figlet-style block text

Build large letters from block characters:
```
 ██████  ███████ ██████
██       ██      ██   ██
██   ███ ███████ ██████
██    ██      ██ ██
 ██████  ███████ ██
```

## Terminal Compatibility

| Feature | macOS Terminal | iTerm2 | VS Code | Windows Terminal |
|---------|---------------|--------|---------|-----------------|
| Basic ANSI (8 colors) | yes | yes | yes | yes |
| 256 colors | yes | yes | yes | yes |
| Truecolor (RGB) | no | yes | yes | yes |
| Unicode blocks | yes | yes | yes | yes |
| Box drawing | yes | yes | yes | yes |
| Emoji | yes | yes | partial | yes |

## Best Practices

1. **Always reset** — end every colored segment with `\x1b[0m`
2. **Test without color** — art should be readable if ANSI is stripped
3. **Respect NO_COLOR** — check `process.env.NO_COLOR` before using escape codes
4. **Keep it short** — splash screens should be < 20 lines tall
5. **Monospace only** — never assume proportional rendering
6. **Avoid emoji in art** — inconsistent width across terminals (1 vs 2 columns)
7. **Use dim for decoration** — keeps focus on the content, not the chrome
