# Tree

> Phase: system | Brand: get-shit-pretty-v2 | Generated: 2026-03-19

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
- **Branch** (`├── `) -- intermediate item
- **Last** (`└── `) -- final item in group
- **Pipe** (`│   `) -- continuation line, parent has more children
- **Space** (`    `) -- continuation line, parent is done

## Variants

| Variant | Description | Use |
|---------|-------------|-----|
| **Plain** | File/directory names only | Simple file listings |
| **Status-Annotated** | Each node prefixed with status symbol | Phase output with per-file status |
| **Flat** | Single level, no nesting | Simple file lists after phase completion |

## Token Usage

| Element | Token | Reference |
|---------|-------|-----------|
| Branch chars `├── └── │` | `component.tree.*` | Box-drawing |
| Branch color | `--color-border` | `color.foundation.border` = `#1E1E1E` |
| Item labels | `--color-text-muted` | `color.text.muted` = `#6B6B6B` |
| Descriptive labels | `--color-text` | `color.text.primary` = `#E8E8E8` |
| Status symbols | See [status-message.md](./status-message.md) | Symbol + semantic color |
| Indent | 4 cols | Tree starts at indent-2 |

## Rendering Rules

1. Tree items begin at indent-2 (4 spaces) when following a status line at indent-1.
2. Box-drawing characters are border-colored.
3. Item labels are text-muted (file names) or text-primary (descriptive labels).
4. One space after `── ` before the item label (built into token string).
5. Maximum nesting depth: 4 levels.
6. Status-annotated nodes: symbol after branch characters, before label.
7. In narrow terminals (< 40 cols), collapse nested levels and show flat.

## Rendered Examples

Phase completion file tree:

```
  ◆ strategy complete -- 6 chunks written
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
    │   └── grid.md
    ├── components/
    │   ├── banner.md
    │   └── spinner.md
    └── tokens.json
```

Status-annotated tree:

```
    ├── ✓ color-system.md (312 lines)
    ├── ✓ typography.md (169 lines)
    ├── ✗ spacing.md -- failed to write
    └── ◈ grid.md -- writing...
```

## Code Hints

```javascript
const RESET = '\x1b[0m';
const BORDER = '\x1b[38;2;30;30;30m';          // #1E1E1E
const MUTED = '\x1b[38;2;107;107;107m';        // #6B6B6B

const BRANCH = '├── ';
const LAST   = '└── ';
const PIPE   = '│   ';
const SPACE  = '    ';

function renderTree(items, indent = '    ', prefix = '') {
  const lines = [];
  items.forEach((item, i) => {
    const isLast = i === items.length - 1;
    const connector = isLast ? LAST : BRANCH;
    const continuation = isLast ? SPACE : PIPE;

    lines.push(
      `${indent}${BORDER}${prefix}${connector}${RESET}${MUTED}${item.label}${RESET}`
    );
    if (item.children?.length) {
      lines.push(
        ...renderTree(item.children, indent, prefix + continuation)
      );
    }
  });
  return lines;
}

function fileTree(rootLabel, files) {
  const lines = [rootLabel];
  files.forEach((file, i) => {
    const isLast = i === files.length - 1;
    const branch = isLast ? LAST : BRANCH;
    lines.push(`    ${BORDER}${branch}${RESET}${MUTED}${file}${RESET}`);
  });
  return lines.join('\n');
}
```

## Accessibility

- **NO_COLOR:** Tree structure conveyed through box-drawing characters and indentation. Fully readable in monochrome.
- **Non-TTY / piped:** Identical output. Box-drawing is Unicode, survives pipe.
- **Screen readers:** Tree reads linearly. Item labels are plain text.

---

## Related

- [Phase Block](./phase-block.md) -- primary consumer of file trees
- [Status Message](./status-message.md) -- status-annotated nodes
- [../foundations/color-system.md](../foundations/color-system.md)
- [../foundations/spacing.md](../foundations/spacing.md)
