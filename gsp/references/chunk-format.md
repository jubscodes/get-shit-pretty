# Chunk Format Reference

Standard format for all GSP phase output files. Chunks are the primary output — agents write chunks directly, not monoliths.

## File Format

Every chunk follows this structure:

    # {Section/Component/Screen Name}

    > Phase: {phase} | Brand/Project: {name} | Generated: {DATE}

    ---

    {Content for this chunk}

    ---

    ## Related

    - [{Related chunk name}]({relative-path-to-related-chunk})

## Naming Conventions

- **Singular, kebab-case, lowercase:** "Buttons" → `button.md`, "Date Picker" → `date-picker.md`
- **Screen files:** `screen-{NN}-{kebab-case-name}.md` (e.g., `screen-01-home.md`)

## INDEX.md Format

Each phase directory gets an INDEX.md manifest:

    # {Phase Name}
    > Phase: {phase} | Brand/Project: {name} | Generated: {DATE}

    | Chunk | File | ~Lines |
    |-------|------|--------|
    | {Section} | [{filename}](./{filename}) | ~{N} |

Lightweight — just a lookup table. No prose.

## Rules

- **Chunks are primary output** — agents write chunks directly to the phase directory
- **No monoliths** — do not write a single large file then re-chunk it
- **Size target:** 50-200 lines per chunk
- **Self-contained:** each chunk must be understandable without loading other chunks
- **Cross-references:** `## Related` section uses relative paths to related chunks
- **Idempotent:** re-running a phase regenerates all chunks in that phase directory

## Output Budgets

Context is finite. Every line in a chunk is consumed by downstream agents. Budget accordingly.

### Per-chunk budgets

| Chunk type | Target | Hard max | Notes |
|-----------|--------|----------|-------|
| Phase chunk (design, research, etc.) | 50-150 lines | 200 lines | Self-contained, one concept per chunk |
| INDEX.md | 10-30 lines | 50 lines | Lookup table only, no prose |
| BUILD-LOG.md | 50-100 lines | 150 lines | Summary + tables, not narrative |
| Component spec | 30-80 lines | 120 lines | Props, states, behavior — not full implementation |
| Screen spec | 80-150 lines | 200 lines | Layout, components, interactions, states |

### Per-phase budgets (total across all chunks)

| Phase | Target total | Hard max | Typical chunks |
|-------|-------------|----------|----------------|
| Brief | 100-200 lines | 300 lines | 2-4 |
| Research | 200-400 lines | 600 lines | 5-8 |
| Design | 300-600 lines | 800 lines | 6-12 |
| Critique | 100-200 lines | 300 lines | 2-4 |
| Build log | 50-100 lines | 150 lines | 1 |
| Review | 100-200 lines | 300 lines | 2-4 |

### Terminal output (inline skills)

- **Diagnostic** (doctor, progress): uncapped — user needs to see it, does not persist in agent context
- **Greeting/status** (start): 20-40 lines
- **Phase transitions**: 10-20 lines
