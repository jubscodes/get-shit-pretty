# Prompt

> Phase: system | Brand: get-shit-pretty | Generated: 2026-03-08

---

## Description

User input components for gathering information during CLI sessions. Prompts pause output and wait for user response. Four variants cover all input patterns: text, confirmation, single choice, and multi-select.

Use for: brief questions, confirmations before destructive actions, phase selection, config values.

## Anatomy

### Text Input

```
  ? {question}
  > {cursor}
```

### Confirmation

```
  ? {question} (y/N)
  > {cursor}
```

### Choice List

```
  ? {question}
    {diamond} {option}
    {diamond} {option}       ← highlighted with accent
    {diamond} {option}
```

### Multi-Select

```
  ? {question}
    [ ] {option}
    [✓] {option}             ← selected
    [ ] {option}
```

## Variants

| Variant | Input Type | Response |
|---------|-----------|----------|
| **Text** | Free-form string | User types, presses Enter |
| **Confirmation** | y/N boolean | Single keypress |
| **Choice** | Single select from list | Arrow keys + Enter |
| **Multi-select** | Multiple from list | Space to toggle, Enter to confirm |

## Token Usage

| Token | Source | Value |
|-------|--------|-------|
| `color.info` | color-system.md | `#60A5FA` -- `?` symbol |
| `color.accent` | color-system.md | `#FF6B35` -- `>` prompt, active choice |
| `color.text-primary` | color-system.md | `#E0E0E0` -- question text |
| `color.text-secondary` | color-system.md | `#A0A0A0` -- options, defaults |
| `color.text-tertiary` | color-system.md | `#666666` -- inactive choices |
| `typography.bold` | typography.md | `\x1b[1m` -- question text |
| `status.complete.symbol` | tokens.json | `◆` -- selected choice |
| `status.progress.symbol` | tokens.json | `◈` -- active/highlighted choice |
| `status.pending.symbol` | tokens.json | `◇` -- unselected choice |
| `spacing.horizontal.indent-1` | spacing.md | 2 cols |
| `spacing.horizontal.indent-2` | spacing.md | 4 cols |

## Rendering Rules

1. `?` is info-colored (`#60A5FA`). Question text is bold text-primary.
2. `>` prompt is accent-colored (`#FF6B35`).
3. Default option in confirmation is uppercase: `(y/N)` means N is default.
4. Choice list uses diamond states: `◇` unselected, `◈` highlighted/active, `◆` selected (after confirmation).
5. The currently highlighted option uses accent color for both diamond and text.
6. Unselected options use text-secondary.
7. One blank line (space-1) before a prompt. No blank line between `?` and `>` / options.
8. After the user confirms, replace the prompt with a status-message showing the result:
   `  ✓ {question}: {answer}`
9. Multi-select checkboxes: `[ ]` empty, `[✓]` selected (success-colored checkmark).

## Rendered Examples

Text input:

```
  ? What is the project name?
  > my-project
```

After confirmation (collapses to result):

```
  ✓ Project name: my-project
```

Confirmation:

```
  ? Overwrite existing brand system? (y/N)
  > _
```

Choice list (during selection):

```
  ? Select a phase to run:
    ◆ discover (complete)
    ◆ strategy (complete)
    ◈ verbal
    ◇ identity
    ◇ system
```

Multi-select:

```
  ? Which phases to regenerate?
    [✓] discover
    [ ] strategy
    [✓] verbal
    [ ] identity
    [ ] system
```

## Implementation

```javascript
const RESET = '\x1b[0m'
const BOLD = '\x1b[1m'
const INFO = '\x1b[38;2;96;165;250m'
const ACCENT = '\x1b[38;2;255;107;53m'
const SECONDARY = '\x1b[38;2;160;160;160m'
const SUCCESS = '\x1b[38;2;34;197;94m'

function textPrompt(question) {
  process.stdout.write(`  ${INFO}?${RESET} ${BOLD}${question}${RESET}\n`)
  process.stdout.write(`  ${ACCENT}>${RESET} `)
}

function confirmPrompt(question, defaultNo = true) {
  const hint = defaultNo ? '(y/N)' : '(Y/n)'
  process.stdout.write(
    `  ${INFO}?${RESET} ${BOLD}${question}${RESET} ${SECONDARY}${hint}${RESET}\n`
  )
  process.stdout.write(`  ${ACCENT}>${RESET} `)
}

function choiceList(question, options, activeIndex) {
  const lines = [`  ${INFO}?${RESET} ${BOLD}${question}${RESET}`]
  options.forEach((opt, i) => {
    const isActive = i === activeIndex
    const diamond = isActive ? `${ACCENT}◈` : `${SECONDARY}◇`
    const text = isActive ? `${ACCENT}${opt}` : `${SECONDARY}${opt}`
    lines.push(`    ${diamond}${RESET} ${text}${RESET}`)
  })
  return lines.join('\n')
}

function promptResult(question, answer) {
  return `  ${SUCCESS}✓${RESET} ${question}: ${BOLD}${answer}${RESET}`
}
```

## Accessibility

- **Without color:** `?` and `>` symbols mark question and input areas. Diamond/checkbox states are visually distinct characters.
- **Non-TTY / piped:** Prompts degrade to simple stdin reads. Print question, read line. No cursor movement, no choice navigation. Accept first valid line.
- **Screen readers:** Question text is plain. Options are listed sequentially with state prefix.

---

## Related

- [Status Message](./status-message.md) -- prompt results collapse to success status
- [Brand Mark](./brand-mark.md) -- diamond states reused in choice lists
- [../foundations/content-patterns.md](../foundations/content-patterns.md)
- [../foundations/motion.md](../foundations/motion.md)
