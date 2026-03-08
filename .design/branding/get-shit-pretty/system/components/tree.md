# Tree

> Phase: system | Brand: get-shit-pretty | Generated: 2026-03-08

---

## Description

File tree and hierarchy display using box-drawing branch characters. Shows nested structures with optional status annotations per node. The primary way GSP communicates file system output.

Use for: chunk file listings after phase completion, directory structure display, nested config display, dependency trees.

## Anatomy

```
  {root-label}
    ├── {item}
    ├── {item}
    │   ├── {nested-item}
    │   └── {nested-item}
    └── {item}
```

- **Root label** -- optional, at indent-1, can be a status message
- **Branch** (`├── `) -- intermediate item, more siblings follow
- **Last** (`└── `) -- final item in a group
- **Pipe** (`│   `) -- continuation line, parent has more children
- **Space** (`    `) -- continuation line, parent is done

## Variants

### Plain Tree

File/directory names only, no status annotations.

### Status-Annotated Tree

Each node prefixed with a status symbol (checkmark, diamond state).

### Flat Tree

Single level, no nesting. Used for simple file lists after phase completion.

## Token Usage

| Token | Source | Value |
|-------|--------|-------|
| `ascii.tree.branch` | tokens.json | `├── ` |
| `ascii.tree.last` | tokens.json | `└── ` |
| `ascii.tree.pipe` | tokens.json | `│   ` |
| `ascii.tree.space` | tokens.json | `    ` |
| `color.text-secondary` | color-system.md | `#A0A0A0` -- item labels |
| `color.text-tertiary` | color-system.md | `#666666` -- tree characters |
| `spacing.horizontal.indent-2` | spacing.md | 4 cols -- tree starts at indent-2 |

## Rendering Rules

1. Tree items begin at indent-2 (4 spaces) when following a status line at indent-1.
2. Box-drawing characters (`├──`, `└──`, `│`) are text-tertiary.
3. Item labels are text-secondary (file names) or text-primary (descriptive labels).
4. One space after `── ` before the item label (built into the token string).
5. Maximum nesting depth: 4 levels. Deeper structures indicate a design problem.
6. If a node has children, it uses `├──` or `└──` plus continuation lines (`│   ` or `    `) for its children.
7. Status-annotated nodes: symbol appears immediately after the branch characters, before the label.
8. In narrow terminals (< 40 cols), collapse nested levels and show flat with indentation hints.

## Rendered Examples

Phase completion file tree:

```
  ◆ strategy complete — 6 chunks written
    ├── archetype.md
    ├── brand-prism.md
    ├── brand-platform.md
    ├── golden-circle.md
    ├── messaging-hierarchy.md
    └── positioning.md
```

Nested directory tree:

```
    ├── foundations/
    │   ├── color-system.md
    │   ├── typography.md
    │   ├── spacing.md
    │   └── ascii-art.md
    ├── components/
    │   ├── button.md
    │   └── card.md
    └── tokens.json
```

Status-annotated tree:

```
    ├── ✓ color-system.md (182 lines)
    ├── ✓ typography.md (147 lines)
    ├── ✗ spacing.md — failed to write
    └── ◈ ascii-art.md — writing...
```

## Implementation

```javascript
const RESET = '\x1b[0m'
const TERTIARY = '\x1b[38;2;102;102;102m'
const SECONDARY = '\x1b[38;2;160;160;160m'

const BRANCH = '├── '
const LAST   = '└── '
const PIPE   = '│   '
const SPACE  = '    '

function renderTree(items, indent = '    ', prefix = '') {
  const lines = []
  items.forEach((item, i) => {
    const isLast = i === items.length - 1
    const connector = isLast ? LAST : BRANCH
    const continuation = isLast ? SPACE : PIPE

    lines.push(
      `${indent}${TERTIARY}${prefix}${connector}${RESET}${SECONDARY}${item.label}${RESET}`
    )
    if (item.children?.length) {
      lines.push(
        ...renderTree(item.children, indent, prefix + continuation)
      )
    }
  })
  return lines
}

function fileTree(rootLabel, files) {
  const lines = [rootLabel]
  files.forEach((file, i) => {
    const isLast = i === files.length - 1
    const branch = isLast ? LAST : BRANCH
    lines.push(`    ${TERTIARY}${branch}${RESET}${SECONDARY}${file}${RESET}`)
  })
  return lines.join('\n')
}
```

## Accessibility

- **Without color:** Tree structure is conveyed entirely through box-drawing characters and indentation. Fully readable in monochrome.
- **Non-TTY / piped:** Identical output. Box-drawing characters are Unicode and survive pipe. No cursor control needed.
- **Screen readers:** Tree reads linearly. Each item is preceded by structural characters that screen readers may announce. Item labels are plain text.

---

## Related

- [Phase Block](./phase-block.md) -- primary consumer of file trees
- [Status Message](./status-message.md) -- status-annotated tree nodes
- [../foundations/ascii-art.md](../foundations/ascii-art.md) -- tree character specs
- [../foundations/spacing.md](../foundations/spacing.md)
