# Prompt

> Phase: system | Brand: get-shit-pretty-v2 | Generated: 2026-03-19

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
    ◇ {option}
    ◈ {option}             <- highlighted with accent
    ◇ {option}
```

### Multi-Select

```
  ? {question}
    [ ] {option}
    [✓] {option}           <- selected
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

| Element | Token | Reference |
|---------|-------|-----------|
| `?` symbol | `--color-info` | `color.semantic.info` = `#58A6FF` |
| `>` prompt | `--color-accent` | `color.accent.default` = `#E5A00D` |
| Question text | `--color-text-bright` + bold | `color.text.bright` = `#FAFAFA` |
| Options | `--color-text-muted` | `color.text.muted` = `#6B6B6B` |
| Active option | `--color-accent` | `color.accent.default` = `#E5A00D` |
| Default hint | `--color-text-muted` | `(y/N)` |
| Selected `◆` | `--color-text` | `color.text.primary` = `#E8E8E8` |
| Active `◈` | `--color-accent` | `color.accent.default` = `#E5A00D` |
| Unselected `◇` | `--color-text-muted` | `color.text.muted` = `#6B6B6B` |
| Checkmark `✓` | `--color-success` | `color.semantic.success` = `#3FB950` |

## Rendering Rules

1. `?` is info-colored. Question text is bold text-bright.
2. `>` prompt is accent-colored.
3. Default option in confirmation is uppercase: `(y/N)` means N is default.
4. Choice list uses diamond states: `◇` unselected, `◈` highlighted, `◆` selected.
5. Currently highlighted option uses accent color for both diamond and text.
6. One blank line before a prompt. No blank line between `?` and `>` / options.
7. After confirmation, replace prompt with status message: `✓ {question}: {answer}`.
8. Multi-select checkboxes: `[ ]` empty, `[✓]` selected (success-colored checkmark).

## Code Hints

```javascript
const RESET = '\x1b[0m';
const BOLD = '\x1b[1m';
const INFO = '\x1b[38;2;88;166;255m';          // #58A6FF
const ACCENT = '\x1b[38;2;229;160;13m';        // #E5A00D
const BRIGHT = '\x1b[38;2;250;250;250m';       // #FAFAFA
const MUTED = '\x1b[38;2;107;107;107m';        // #6B6B6B
const SUCCESS = '\x1b[38;2;63;185;80m';        // #3FB950

function textPrompt(question) {
  process.stdout.write(`  ${INFO}?${RESET} ${BOLD}${BRIGHT}${question}${RESET}\n`);
  process.stdout.write(`  ${ACCENT}>${RESET} `);
}

function choiceList(question, options, activeIndex) {
  const lines = [`  ${INFO}?${RESET} ${BOLD}${BRIGHT}${question}${RESET}`];
  options.forEach((opt, i) => {
    const isActive = i === activeIndex;
    const diamond = isActive ? `${ACCENT}◈` : `${MUTED}◇`;
    const text = isActive ? `${ACCENT}${opt}` : `${MUTED}${opt}`;
    lines.push(`    ${diamond}${RESET} ${text}${RESET}`);
  });
  return lines.join('\n');
}

function promptResult(question, answer) {
  return `  ${SUCCESS}✓${RESET} ${question}: ${BOLD}${answer}${RESET}`;
}
```

## Accessibility

- **NO_COLOR:** `?` and `>` symbols mark question and input areas. Diamond/checkbox states are visually distinct characters.
- **Non-TTY / piped:** Prompts degrade to simple stdin reads. Print question, read line. No cursor movement.
- **Screen readers:** Question text is plain. Options listed sequentially with state prefix.

---

## Related

- [Status Message](./status-message.md) -- prompt results collapse to success status
- [Brand Mark](./brand-mark.md) -- diamond states reused in choice lists
- [../foundations/color-system.md](../foundations/color-system.md)
