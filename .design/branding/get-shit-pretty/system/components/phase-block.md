# Phase Block

> Phase: system | Brand: get-shit-pretty | Generated: 2026-03-08

---

## Description

The primary pipeline output component. A phase block represents the lifecycle of one pipeline phase: header, streaming sub-task updates, and a completion summary with file tree. This is what the user watches during an agent run.

Use for: every pipeline phase execution (discover, strategy, verbal, identity, system, brief, research, design, critique, build, review).

## Anatomy

```
                                        ← space-2 (2 blank lines before)
  {phase-header}                        ← H1: bold + accent
                                        ← space-1
    {spinner/status} {sub-task}...      ← streaming sub-tasks at indent-2
    {status} {sub-task result}
    ...
                                        ← space-1
  {completion-status}                   ← ◆ + summary at indent-1
    {file-tree}                         ← tree component at indent-2
                                        ← space-2 (2 blank lines after)
```

### Structural Layers

1. **Phase header** -- bold + accent color, indent-1, preceded by space-2
2. **Sub-task stream** -- status messages at indent-2, streamed progressively
3. **Completion line** -- `◆ {phase} complete -- {count} chunks written` at indent-1
4. **File tree** -- tree component showing written files at indent-2

## Variants

### Active Phase

Shows spinner on current sub-task, completed sub-tasks above.

```
  Strategy

    ✓ archetype selected — Creator 70% + Magician 30%
    ✓ brand-prism.md written (124 lines)
    ◈ defining positioning...
```

### Completed Phase

All sub-tasks resolved, completion line and file tree shown.

```
  Strategy

    ✓ archetype selected — Creator 70% + Magician 30%
    ✓ brand-prism.md written (124 lines)
    ✓ positioning defined
    ✓ messaging hierarchy built
    ✓ golden circle mapped
    ✓ brand platform assembled

  ◆ strategy complete — 6 chunks written
    ├── archetype.md
    ├── brand-prism.md
    ├── brand-platform.md
    ├── golden-circle.md
    ├── messaging-hierarchy.md
    └── positioning.md
```

### Skipped Phase

Phase was skipped (already complete or not applicable).

```
  ◇ discover — skipped (already complete)
```

### Failed Phase

Phase encountered a fatal error.

```
  Strategy

    ✓ archetype selected
    ✗ brand-prism generation failed
      Model returned empty response. Retry with /gsp:brand-strategy.
```

## Token Usage

| Token | Source | Value |
|-------|--------|-------|
| `color.accent` | color-system.md | `#FF6B35` -- phase header, completion symbol |
| `typography.bold` | typography.md | `\x1b[1m` -- phase header |
| `color.text-secondary` | color-system.md | `#A0A0A0` -- file tree items |
| `color.text-tertiary` | color-system.md | `#666666` -- tree box-drawing chars |
| `spacing.vertical.md` | spacing.md | 2 lines -- before/after phase block |
| `spacing.vertical.sm` | spacing.md | 1 line -- after header, before completion |
| `spacing.horizontal.indent-1` | spacing.md | 2 cols -- header, completion |
| `spacing.horizontal.indent-2` | spacing.md | 4 cols -- sub-tasks, file tree |
| `status.*` | tokens.json | sub-task status symbols |
| `ascii.tree.*` | tokens.json | tree branch characters |

## Rendering Rules

1. Two blank lines before phase header (space-2). Two blank lines after the complete block.
2. Phase header is bold + accent at indent-1. No symbol prefix on the header itself.
3. Sub-tasks stream at indent-2 with status-message format.
4. Only one spinner active at a time -- on the current sub-task.
5. Completion line uses `◆` in accent, phase name in bold, chunk count in bold.
6. File tree uses text-secondary for filenames, text-tertiary for box-drawing.
7. If the phase writes zero chunks (e.g., discover), omit the file tree.
8. Fast sub-tasks (< 100ms) skip the spinner, show result directly.

## Rendered Examples

Full phase lifecycle:

```


  Strategy

    ✓ archetype selected — Creator 70% + Magician 30%
    ✓ brand-prism.md written (124 lines)
    ✓ brand-platform.md written (98 lines)
    ✓ golden-circle.md written (87 lines)
    ✓ messaging-hierarchy.md written (156 lines)
    ✓ positioning.md written (112 lines)

  ◆ strategy complete — 6 chunks written
    ├── archetype.md
    ├── brand-prism.md
    ├── brand-platform.md
    ├── golden-circle.md
    ├── messaging-hierarchy.md
    └── positioning.md


```

## Implementation

```javascript
const RESET = '\x1b[0m'
const BOLD = '\x1b[1m'
const ACCENT = '\x1b[38;2;255;107;53m'
const SECONDARY = '\x1b[38;2;160;160;160m'
const TERTIARY = '\x1b[38;2;102;102;102m'

function phaseHeader(name) {
  return `\n\n  ${BOLD}${ACCENT}${name}${RESET}\n`
}

function phaseComplete(name, files) {
  const count = files.length
  const lines = [
    '',
    `  ${ACCENT}◆${RESET} ${BOLD}${name}${RESET} complete — ${BOLD}${count}${RESET} chunks written`,
  ]
  files.forEach((file, i) => {
    const isLast = i === files.length - 1
    const branch = isLast ? '└── ' : '├── '
    lines.push(`    ${TERTIARY}${branch}${RESET}${SECONDARY}${file}${RESET}`)
  })
  lines.push('', '')
  return lines.join('\n')
}
```

## Accessibility

- **Without color:** Phase hierarchy conveyed through indentation levels and structural characters. Completion line uses `◆` symbol distinct from sub-task symbols.
- **Non-TTY / piped:** Spinners replaced with static `◈ working...`. All sub-tasks print once on completion. No cursor control. No in-place updates.
- **Screen readers:** Progressive output is naturally sequential. Each line is a complete statement.

---

## Related

- [Status Message](./status-message.md) -- sub-task lines are status messages
- [Tree](./tree.md) -- file tree rendering
- [Spinner](./spinner.md) -- active sub-task animation
- [Pipeline Flow](./pipeline-flow.md) -- shows all phases in a horizontal flow
- [../foundations/content-patterns.md](../foundations/content-patterns.md)
- [../foundations/motion.md](../foundations/motion.md)
