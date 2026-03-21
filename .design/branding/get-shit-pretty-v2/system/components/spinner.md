# Spinner

> Phase: system | Brand: get-shit-pretty-v2 | Generated: 2026-03-19

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

## Variants

### Brand Spinner (Primary)

Diamond cycle: `◇ -> ◈ -> ◆ -> ◈ -> ◇ ...` at 80ms per frame.

| Frame | Char | Color Token |
|-------|------|-------------|
| 1 | `◇` | `--color-text-muted` (`#6B6B6B`) |
| 2 | `◈` | `--color-accent` (`#E5A00D`) |
| 3 | `◆` | `--color-accent` (`#E5A00D`) |
| 4 | `◈` | `--color-accent` (`#E5A00D`) |

### Dot Spinner (Secondary)

For sub-tasks where diamonds are too prominent: `.  -> .. -> ... -> .. -> .  -> (space)` at 120ms. Color: `--color-text-muted`.

### Fallback Spinner (ASCII)

For terminals without Unicode: `- -> \ -> | -> /` at 100ms. Color: `--color-text-muted`.

## Token Usage

| Element | Token | Reference |
|---------|-------|-----------|
| Brand frames | `component.spinner.brand.frames` | `["◇", "◈", "◆", "◈"]` |
| Brand interval | `component.spinner.brand.interval` | `80` ms |
| Dot frames | `component.spinner.dots.frames` | `[".  ", ".. ", "...", ".. ", ".  ", "   "]` |
| Dot interval | `component.spinner.dots.interval` | `120` ms |
| Fallback frames | `component.spinner.fallback.frames` | `["-", "\\", "|", "/"]` |
| Fallback interval | `component.spinner.fallback.interval` | `100` ms |
| Diamond colors | See brand-mark color rules | `◇` = muted, `◈◆` = accent |
| Success symbol | `✓` | `--color-success` = `#3FB950` |
| Error symbol | `✗` | `--color-error` = `#E54D42` |

## Rendering Rules

1. Only one spinner visible at a time.
2. Spinner updates in-place using `\r` (carriage return).
3. Write to stderr to keep stdout clean for piping.
4. Hide cursor (`\x1b[?25l`) during spin. Restore (`\x1b[?25h`) on stop. Always restore on SIGINT/SIGTERM/exit.
5. Clear the entire line before writing each frame.
6. On completion, replace spinner line with final status message.
7. Skip spinner entirely for operations completing in < 100ms.
8. Brand spinner is default. Dot spinner for nested sub-tasks. Fallback when Unicode detection fails.
9. Append elapsed time in text-muted if operation exceeds 10 seconds: `◈ waiting... (12s)`.

## Rendered Examples

Brand spinner cycling:

```
  ◇ analyzing brief constraints...
  ◈ analyzing brief constraints...
  ◆ analyzing brief constraints...
  ◈ analyzing brief constraints...
```

Resolves to:

```
  ✓ brief analysis complete -- 4 constraints found
```

Long-running with elapsed:

```
  ◈ waiting for model response... (15s)
```

## Code Hints

```javascript
const RESET = '\x1b[0m';
const ACCENT = '\x1b[38;2;229;160;13m';       // #E5A00D
const MUTED = '\x1b[38;2;107;107;107m';        // #6B6B6B
const SUCCESS = '\x1b[38;2;63;185;80m';        // #3FB950
const ERROR = '\x1b[38;2;229;77;66m';          // #E54D42
const HIDE = '\x1b[?25l';
const SHOW = '\x1b[?25h';
const CLEAR_LINE = '\x1b[2K';

const BRAND_FRAMES = ['◇', '◈', '◆', '◈'];
const BRAND_COLORS = [MUTED, ACCENT, ACCENT, ACCENT];
const BRAND_INTERVAL = 80;

function createSpinner(message, indent = '  ') {
  const isTTY = process.stderr.isTTY === true;
  if (!isTTY) {
    process.stderr.write(`${indent}${ACCENT}◈${RESET} ${message}...\n`);
    return {
      stop(success, finalMsg) {
        const sym = success ? `${SUCCESS}✓` : `${ERROR}✗`;
        process.stderr.write(`${indent}${sym}${RESET} ${finalMsg}\n`);
      }
    };
  }

  let frame = 0;
  const start = Date.now();
  process.stderr.write(HIDE);

  const timer = setInterval(() => {
    const i = frame % BRAND_FRAMES.length;
    const char = `${BRAND_COLORS[i]}${BRAND_FRAMES[i]}${RESET}`;
    const elapsed = Math.round((Date.now() - start) / 1000);
    const time = elapsed >= 10 ? ` ${MUTED}(${elapsed}s)${RESET}` : '';
    process.stderr.write(`${CLEAR_LINE}\r${indent}${char} ${message}...${time}`);
    frame++;
  }, BRAND_INTERVAL);

  return {
    stop(success, finalMsg) {
      clearInterval(timer);
      const sym = success ? `${SUCCESS}✓` : `${ERROR}✗`;
      process.stderr.write(`${CLEAR_LINE}\r${indent}${sym}${RESET} ${finalMsg}\n`);
      process.stderr.write(SHOW);
    }
  };
}
```

## Accessibility

- **NO_COLOR:** Diamond shapes are distinct. Animation is supplementary to the text message.
- **Non-TTY / piped:** Static single line with `◈`. No animation. Resolves to final status line.
- **Screen readers:** Only the final resolved status message matters. Intermediate frames are not announced.

---

## Related

- [Progress Bar](./progress-bar.md) -- for determinate progress
- [Status Message](./status-message.md) -- spinner resolves to status message
- [Brand Mark](./brand-mark.md) -- shares diamond character set
- [../foundations/color-system.md](../foundations/color-system.md)
