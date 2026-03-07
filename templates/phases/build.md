# Build

> Phase: build | Project: {PROJECT_NAME} | Generated: {DATE}

## Chunks

### `build/CODE.md`

Main build manifest containing:

1. **Component Hierarchy** — Tree diagram showing app structure with props and state annotations
2. **Setup** — Token configuration (CSS variables or Tailwind config), theme provider, global styles
3. **Component Index** — Table of all components with file paths

```markdown
| Component | File | Props | States |
|-----------|------|-------|--------|
| {Component} | [components/{name}.md](./components/{name}.md) | {props} | {states} |
```

### `build/components/`

Individual component files, one per component:

| Component | File | ~Lines |
|-----------|------|--------|
| {Component} | [{name}.md](./components/{name}.md) | ~{N} |

Each component file contains:
- Full implementation code (copy-paste ready)
- Props interface / types
- All states (default, loading, error, empty)
- Responsive behavior
- Accessibility (ARIA, keyboard, focus)
- Usage example
