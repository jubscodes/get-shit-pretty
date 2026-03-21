# Phase Block

> Phase: system | Brand: get-shit-pretty-v2 | Generated: 2026-03-19

---

## Description

The primary pipeline output component. A phase block represents the lifecycle of one pipeline phase: header, streaming sub-task updates, and a completion summary with file tree. This is what the user watches during an agent run.

Use for: every pipeline phase execution (discover, strategy, identity, system, brief, research, design, critique, build, review).

## Anatomy

```
                                        <- 2 blank lines before
  {phase-header}                        <- bold + accent
                                        <- 1 blank line
    {spinner/status} {sub-task}...      <- streaming sub-tasks at indent-2
    {status} {sub-task result}
    ...
                                        <- 1 blank line
  {completion-status}                   <- ◆ + summary at indent-1
    {file-tree}                         <- tree component at indent-2
                                        <- 2 blank lines after
```

### Structural Layers

1. **Phase header** -- bold + accent color, indent-1, preceded by 2 blank lines
2. **Sub-task stream** -- status messages at indent-2, streamed progressively
3. **Completion line** -- `◆ {phase} complete -- {count} chunks written` at indent-1
4. **File tree** -- tree component showing written files at indent-2

## Variants

### Active Phase

```
  Strategy

    ✓ archetype selected -- Creator 70% + Guide 30%
    ✓ brand-prism.md written (124 lines)
    ◈ defining positioning...
```

### Completed Phase

```
  Strategy

    ✓ archetype selected -- Creator 70% + Guide 30%
    ✓ brand-prism.md written (124 lines)
    ✓ positioning defined
    ✓ messaging hierarchy built

  ◆ strategy complete -- 6 chunks written
    ├── archetype.md
    ├── brand-prism.md
    ├── brand-platform.md
    ├── golden-circle.md
    ├── messaging-hierarchy.md
    └── positioning.md
```

### Skipped Phase

```
  ◇ discover -- skipped (already complete)
```

### Failed Phase

```
  Strategy

    ✓ archetype selected
    ✗ brand-prism generation failed
      Model returned empty response. Retry with /gsp:brand-strategy.
```

## Token Usage

| Element | Token | Reference |
|---------|-------|-----------|
| Phase header | `--color-accent` + bold | `color.accent.default` = `#E5A00D` |
| Sub-task symbols | `component.status.*` | See [status-message.md](./status-message.md) |
| Completion diamond | `◆` in `--color-accent` | `color.accent.default` = `#E5A00D` |
| File names | `--color-text-muted` | `color.text.muted` = `#6B6B6B` |
| Tree characters | `--color-border` | `color.foundation.border` = `#1E1E1E` |
| Indent-1 (header) | 2 cols | Phase header, completion line |
| Indent-2 (sub-tasks) | 4 cols | Sub-task lines, file tree |
| Spacing before/after | 2 blank lines | Section spacing |
| Spacing after header | 1 blank line | Before sub-tasks |

## Rendering Rules

1. Two blank lines before phase header. Two blank lines after complete block.
2. Phase header is bold + accent at indent-1. Title Case. No symbol prefix on the header.
3. Sub-tasks stream at indent-2 with status-message format.
4. Only one spinner active at a time.
5. Completion line uses `◆` in accent, phase name in bold, chunk count in bold.
6. File tree uses text-muted for filenames, border color for box-drawing.
7. If the phase writes zero chunks, omit the file tree.
8. Fast sub-tasks (< 100ms) skip the spinner, show result directly.

### Color Tier Mapping

| Tier | Header | Completion `◆` | File names |
|------|--------|----------------|------------|
| Truecolor | `\x1b[1m\x1b[38;2;229;160;13m` | `\x1b[38;2;229;160;13m` | `\x1b[38;2;107;107;107m` |
| 256-color | `\x1b[1m\x1b[38;5;178m` | `\x1b[38;5;178m` | `\x1b[38;5;242m` |
| 16-color | `\x1b[1m\x1b[33m` | `\x1b[33m` | `\x1b[90m` |
| No-color | UPPERCASE text | `*` prefix | plain text |

## Code Hints

```javascript
const RESET = '\x1b[0m';
const BOLD = '\x1b[1m';
const ACCENT = '\x1b[38;2;229;160;13m';       // #E5A00D
const MUTED = '\x1b[38;2;107;107;107m';        // #6B6B6B
const BORDER = '\x1b[38;2;30;30;30m';          // #1E1E1E

function phaseHeader(name) {
  return `\n\n  ${BOLD}${ACCENT}${name}${RESET}\n`;
}

function phaseComplete(name, files) {
  const count = files.length;
  const lines = [
    '',
    `  ${ACCENT}◆${RESET} ${BOLD}${name}${RESET} complete -- ${BOLD}${count}${RESET} chunks written`,
  ];
  files.forEach((file, i) => {
    const isLast = i === files.length - 1;
    const branch = isLast ? '└── ' : '├── ';
    lines.push(`    ${BORDER}${branch}${RESET}${MUTED}${file}${RESET}`);
  });
  lines.push('', '');
  return lines.join('\n');
}
```

## Accessibility

- **NO_COLOR:** Phase hierarchy conveyed through indentation and structural characters. `◆` is distinct from sub-task symbols.
- **Non-TTY / piped:** Spinners replaced with static `◈ working...`. All sub-tasks print once on completion. No cursor control.
- **Screen readers:** Progressive output is naturally sequential.

---

## Related

- [Status Message](./status-message.md) -- sub-task lines are status messages
- [Tree](./tree.md) -- file tree rendering
- [Spinner](./spinner.md) -- active sub-task animation
- [Pipeline Flow](./pipeline-flow.md) -- shows all phases
- [../foundations/color-system.md](../foundations/color-system.md)
- [../foundations/spacing.md](../foundations/spacing.md)
