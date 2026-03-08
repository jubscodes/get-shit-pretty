# Motion

> Phase: system | Brand: get-shit-pretty | Generated: 2026-03-08

---

## Philosophy

Terminal motion is constrained. No keyframe animations, no easing curves, no 60fps renders. Motion in the terminal is: cursor control, character replacement, and timed output. These constraints are creative fuel.

Motion in GSP serves two purposes: **indicate activity** (something is happening) and **create reveal** (the Magician's transformation, made visible one line at a time).

---

## Spinner System

The spinner signals that work is happening. It replaces the status symbol on the currently active line using cursor control (`\r` carriage return or ANSI cursor movement).

### Brand Spinner

Cycle through diamond states at 80ms per frame.

| Frame | Character | Color |
|-------|-----------|-------|
| 1 | `◇` | text-tertiary (`#666666`) |
| 2 | `◈` | accent (`#FF6B35`) |
| 3 | `◆` | accent (`#FF6B35`) |
| 4 | `◈` | accent (`#FF6B35`) |

Sequence: `◇ → ◈ → ◆ → ◈ → ◇ → ...`

The cycle mirrors the brand's journey metaphor: empty to filled and back, perpetual until the task resolves to a final state (`✓` or `✗`).

### Dot Spinner (Minimal)

For sub-tasks where the diamond spinner is too prominent.

| Frame | Characters |
|-------|-----------|
| 1 | `.  ` |
| 2 | `.. ` |
| 3 | `...` |
| 4 | `.. ` |
| 5 | `.  ` |
| 6 | `   ` |

Interval: 120ms. Color: text-tertiary.

### Fallback Spinner (ASCII)

For terminals without Unicode or cursor control.

```
- → \ → | → / → - ...
```

Interval: 100ms. Color: text-secondary.

### Spinner Rules

1. **Only one spinner visible at a time.** Multiple concurrent spinners create visual chaos.
2. **Spinner replaces in place** using `\r` (carriage return) to overwrite the current line. No scrolling.
3. **On completion, replace spinner with final symbol:** `✓` for success, `✗` for failure.
4. **If the terminal does not support cursor control** (piped output, CI), fall back to static `◈ working...` without animation.
5. **Clear the spinner line completely** before writing the final status to prevent character artifacts.

### Implementation

```javascript
const SPINNER_FRAMES = ['◇', '◈', '◆', '◈']
const SPINNER_INTERVAL = 80

function createSpinner(message) {
  let i = 0
  const timer = setInterval(() => {
    const frame = SPINNER_FRAMES[i % SPINNER_FRAMES.length]
    process.stderr.write(`\r  ${accent(frame)} ${message}`)
    i++
  }, SPINNER_INTERVAL)

  return {
    stop(finalSymbol, finalMessage) {
      clearInterval(timer)
      process.stderr.write(`\r  ${finalSymbol} ${finalMessage}\n`)
    }
  }
}
```

---

## Progressive Reveal

Line-by-line output creates a sense of unfolding. This is the Magician's trick: the audience watches transformation happen in real time.

### Phase Output Pacing

During agent runs, output appears progressively:

```
  ◈ strategy                        ← appears immediately
    ◈ analyzing brief...             ← spinner, resolves to:
    ✓ archetype selected             ← appears when done
    ◈ building brand prism...        ← spinner, resolves to:
    ✓ brand-prism.md written         ← appears when done
```

### Rules

1. **No artificial delays.** Output appears as work completes. Do not add `setTimeout` to simulate progress.
2. **Sub-tasks stream as they finish.** Each `✓` line appears the moment that chunk is written.
3. **The spinner on the active task is the only animated element.** Everything above it is static.
4. **On fast operations (< 100ms), skip the spinner entirely.** Just show the result. Spinners on instant tasks feel performative.

---

## Diamond State Transitions

The brand mark in the terminal updates its diamond state as the pipeline progresses.

### Transition Sequence

```
  /gsp: ◇◇     ← initial (before any work)
  /gsp: ◈◇     ← branding phase active
  /gsp: ◆◇     ← branding complete
  /gsp: ◆◈     ← project phase active
  /gsp: ◆◆     ← all shipped
```

### Rules

1. **The brand mark appears once at the start of a session.** It does not repeat.
2. **State updates happen in place** if the mark is still visible in the terminal viewport. Use ANSI cursor positioning to update the diamond characters.
3. **If the mark has scrolled off screen,** do not reprint it. The phase completion messages carry the state forward.
4. **Never animate the transition between states.** The diamond changes instantly when the phase resolves. The pipeline work IS the animation; the state change is the punctuation.

---

## Loading States

When GSP is waiting for external resources (network, file system, AI model response).

### Indeterminate Loading

Use the brand spinner (diamond cycle) with a descriptive message:

```
  ◈ waiting for model response...
```

### Determinate Loading

Use the progress bar when the total is known:

```
  ▓▓▓▓▓▓▓▓░░░░░░░░░░░░  40%  writing chunks...
```

Progress bar updates in place using `\r`. See ASCII Art > Progress Bar for character specification.

### Timeout Behavior

If an operation exceeds the expected duration:

```
  ◈ waiting for model response... (12s)
```

Append elapsed time in text-tertiary after the message. Update every second.

---

## Cursor Management

### Rules

1. **Hide the cursor during spinner animation.** `\x1b[?25l` to hide, `\x1b[?25h` to show.
2. **Always restore the cursor on exit** -- including on `SIGINT`, `SIGTERM`, and uncaught exceptions. A hidden cursor left behind is a usability bug.
3. **Use `\r` (carriage return) for in-place updates.** Avoid `\x1b[A` (cursor up) except for the brand mark state update.
4. **Write animated output to stderr.** This keeps stdout clean for piped output and composition with other tools.

### Cleanup Implementation

```javascript
function setupCursorCleanup() {
  const show = () => process.stderr.write('\x1b[?25h')

  process.on('exit', show)
  process.on('SIGINT', () => { show(); process.exit(130) })
  process.on('SIGTERM', () => { show(); process.exit(143) })
  process.on('uncaughtException', (err) => {
    show()
    console.error(err)
    process.exit(1)
  })
}
```

---

## Piped Output / Non-TTY Behavior

When stdout or stderr is not a TTY (piped to a file, running in CI), all motion is disabled.

| Feature | TTY Behavior | Non-TTY Behavior |
|---------|-------------|-----------------|
| Spinner | Animated diamond cycle | Static `◈ message...` printed once |
| Progress bar | Updates in place | Prints at 0%, 25%, 50%, 75%, 100% |
| Brand mark update | In-place cursor positioning | Not reprinted |
| Color | Full true color / 256 / 16 | Stripped (plain text) unless `FORCE_COLOR=1` |

### Detection

```javascript
const isTTY = process.stderr.isTTY === true
const supportsColor = isTTY || process.env.FORCE_COLOR === '1'
```

---

## Related

- [ASCII Art](./ascii-art.md) — spinner characters, progress bar characters, diamond system
- [Content Patterns](./content-patterns.md) — status message patterns that motion operates on
- [Color System](./color-system.md) — color tokens used in animated elements
