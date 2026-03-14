# Build

> Phase: build | Project: {PROJECT_NAME} | Generated: {DATE}

## Chunks

### `build/BUILD-LOG.md`

Implementation manifest documenting what was built:

1. **Implementation Summary** — What was built, which screens, overall approach taken
2. **Files Created** — New files added to the codebase

```markdown
| File | Purpose |
|------|---------|
| {path/to/file} | {what it does} |
```

3. **Files Modified** — Existing files edited in the codebase

```markdown
| File | Changes |
|------|---------|
| {path/to/file} | {what was changed} |
```

4. **Component Map** — How design components map to codebase files

```markdown
| Design Component | Codebase File | Status |
|-----------------|---------------|--------|
| {component name} | {path/to/file} | complete / partial |
```

5. **Patterns Applied** — Architecture decisions, naming conventions, design patterns used
6. **Dependencies Added** — Packages installed during build
7. **Known Gaps** — What wasn't implemented and why

### Revision sections (when addressing QA issues)

When re-entering build after QA failure, append:

- **Revision Summary** — Issues addressed from `review/issues.md`
- **Files Changed** — What was modified to fix the issues

### Figma exception

When `implementation_target` is `figma`, build produces specs instead of codebase edits:
- `build/CODE.md` — Component hierarchy + implementation guide
- `build/components/` — Individual component spec files
