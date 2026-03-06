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
- **Spec files:** `screen-{NN}-spec.md`

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
