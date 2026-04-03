# Build

> Phase: build | Project: {PROJECT_NAME} | Generated: {DATE}

## Phases

The build phase runs as a 7-phase pipeline:

### Phase 1: Scaffold
Stack setup via `/gsp-scaffold` — install deps, create configs, verify build compiles. Produces `build/SCAFFOLD-LOG.md`.

### Phase 2: Foundations
Token integration, global styles, layout primitives. Agent mode: `foundations`. Checkpoint: build must compile after foundations.

### Phase 3: Foundation Review
Interactive checkpoint — present summary of foundations to user for confirmation before building components.

### Phase 4: Components (parallel)
Orchestrator builds component manifest, classifies, partitions. One agent per partition, parallel. Agent mode: `component`. Checkpoint: build must compile after all component agents complete.

### Phase 5: Screens (parallel)
One agent per screen, parallel. Agent mode: `screen`. Each screen gets its design chunk + component paths only — reads foundations and components from the codebase. Checkpoint: build must compile after all screen agents complete.

### Phase 6: Extraction Review
Lightweight scan for hardcoded values and duplicated patterns. Interactive only if issues found.

### Phase 7: Finalize
Merge per-agent logs into BUILD-LOG.md. Write INDEX.md, MANIFEST.md. Update STATE.md. Phase transition.

---

## Chunks

### `build/SCAFFOLD-LOG.md`

Stack setup manifest:
- **Stack** — Framework, CSS, component library with versions
- **Commands Run** — Each setup command and its status
- **Components Installed** — Component library primitives added
- **Build Verification** — Build command result (pass/fail)

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
