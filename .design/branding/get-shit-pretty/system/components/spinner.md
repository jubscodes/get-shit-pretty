# Spinner

> Phase: system | Brand: get-shit-pretty | Generated: 2026-03-08

---

## Description

Indeterminate loading indicator for operations without known duration. Animates a cycling symbol in-place alongside a descriptive message. Resolves to a final status symbol when the operation completes. Three tiers: brand diamond spinner, minimal dot spinner, and ASCII fallback.

Use for: model responses, network requests, file system operations, any async task without a known total.

## Anatomy

```
  {spinning-symbol} {message}...
```

On resolution:

```
  {final-symbol} {final-message}
```

- **spinning-symbol** -- cycles through frames, accent-colored
- **message** -- text-primary, describes what is happening
- **final-symbol** -- `✓` success or `✗` error, colored
- **final-message** -- result text, replaces the spinner line

## Variants

### Brand Spinner (Primary)

Diamond cycle: `◇ → ◈ → ◆ → ◈ → ◇ ...` at 80ms per frame.

| Frame | Char | Color |
|-------|------|-------|
| 1 | `◇` | text-tertiary |
| 2 | `◈` | accent |
| 3 | `◆` | accent |
| 4 | `◈` | accent |

### Dot Spinner (Secondary)

For sub-tasks where diamonds are too prominent: `.  → .. → ... → .. → .  → (space)` at 120ms.

Color: text-tertiary.

### Fallback Spinner (ASCII)

For terminals without Unicode: `- → \ → | → /` at 100ms.

Color: text-secondary.

## Token Usage

| Token | Source | Value |
|-------|--------|-------|
| `spinner.brand.frames` | tokens.json | `["◇", "◈", "◆", "◈"]` |
| `spinner.brand.interval` | tokens.json | `80ms` |
| `spinner.dots.frames` | tokens.json | `[".  ", ".. ", "...", ".. ", ".  ", "   "]` |
| `spinner.dots.interval` | tokens.json | `120ms` |
| `spinner.fallback.frames` | tokens.json | `["-", "\\", "|", "/"]` |
| `spinner.fallback.interval` | tokens.json | `100ms` |
| `color.accent` | color-system.md | `#FF6B35` |
| `color.text-tertiary` | color-system.md | `#666666` |
| `status.success` | tokens.json | `✓` + `#22C55E` |
| `status.error` | tokens.json | `✗` + `#EF4444` |

## Rendering Rules

1. Only one spinner visible at a time. Multiple spinners create visual chaos.
2. Spinner updates in-place using `\r` (carriage return).
3. Write to stderr to keep stdout clean for piping.
4. Hide cursor (`\x1b[?25l`) during spin. Restore (`\x1b[?25h`) on stop. Always restore on SIGINT/SIGTERM/exit.
5. Clear the entire line before writing each frame (prevent character artifacts from variable-length messages).
6. On completion, replace spinner line with final status message (success or error).
7. Skip spinner entirely for operations completing in < 100ms. Just show the result.
8. Brand spinner is default. Dot spinner for nested sub-tasks at indent-2. Fallback when Unicode detection fails.
9. Append elapsed time in text-tertiary if operation exceeds 10 seconds: `◈ waiting... (12s)`.

## Rendered Examples

Brand spinner (frames cycling):

```
  ◇ analyzing brief constraints...
  ◈ analyzing brief constraints...
  ◆ analyzing brief constraints...
  ◈ analyzing brief constraints...
```

Resolves to:

```
  ✓ brief analysis complete — 4 constraints found
```

Dot spinner (sub-task):

```
    .   generating brand prism
    ..  generating brand prism
    ... generating brand prism
```

Long-running with elapsed time:

```
  ◈ waiting for model response... (15s)
```

Non-TTY fallback (static):

```
  ◈ analyzing brief constraints...
  ✓ brief analysis complete — 4 constraints found
```

## Implementation

```javascript
const RESET = '\x1b[0m'
const ACCENT = '\x1b[38;2;255;107;53m'
const TERTIARY = '\x1b[38;2;102;102;102m'
const SUCCESS = '\x1b[38;2;34;197;94m'
const ERROR = '\x1b[38;2;239;68;68m'
const HIDE = '\x1b[?25l'
const SHOW = '\x1b[?25h'
const CLEAR_LINE = '\x1b[2K'

const BRAND_FRAMES = ['◇', '◈', '◆', '◈']
const BRAND_COLORS = [TERTIARY, ACCENT, ACCENT, ACCENT]
const BRAND_INTERVAL = 80

function createSpinner(message, indent = '  ') {
  const isTTY = process.stderr.isTTY === true
  if (!isTTY) {
    process.stderr.write(`${indent}${ACCENT}◈${RESET} ${message}...\n`)
    return {
      stop(success, finalMsg) {
        const sym = success ? `${SUCCESS}✓` : `${ERROR}✗`
        process.stderr.write(`${indent}${sym}${RESET} ${finalMsg}\n`)
      }
    }
  }

  let frame = 0
  const start = Date.now()
  process.stderr.write(HIDE)

  const timer = setInterval(() => {
    const i = frame % BRAND_FRAMES.length
    const char = `${BRAND_COLORS[i]}${BRAND_FRAMES[i]}${RESET}`
    const elapsed = Math.round((Date.now() - start) / 1000)
    const time = elapsed >= 10 ? ` ${TERTIARY}(${elapsed}s)${RESET}` : ''
    process.stderr.write(`${CLEAR_LINE}\r${indent}${char} ${message}...${time}`)
    frame++
  }, BRAND_INTERVAL)

  return {
    stop(success, finalMsg) {
      clearInterval(timer)
      const sym = success ? `${SUCCESS}✓` : `${ERROR}✗`
      process.stderr.write(`${CLEAR_LINE}\r${indent}${sym}${RESET} ${finalMsg}\n`)
      process.stderr.write(SHOW)
    }
  }
}
```

## Accessibility

- **Without color:** Diamond shapes are distinct from each other and from status symbols. Animation is supplementary to the text message.
- **Non-TTY / piped:** Static single line with `◈` symbol. No animation. Resolves to final status line on completion.
- **Screen readers:** Only the final resolved status message matters. Intermediate spinner frames are not announced (they overwrite in-place on stderr).

---

## Related

- [Progress Bar](./progress-bar.md) -- for determinate progress with known total
- [Status Message](./status-message.md) -- spinner resolves to a status message
- [Phase Block](./phase-block.md) -- spinners appear on active sub-tasks
- [Brand Mark](./brand-mark.md) -- shares diamond character set
- [../foundations/motion.md](../foundations/motion.md) -- animation timing and cursor rules
