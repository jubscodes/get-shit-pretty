# Chunk Format Reference

Standard format for all GSP chunked exports. Referenced by agent `<chunked-exports>` sections.

## File Format

Every chunk follows this structure:

    # {Section/Component/Screen Name}

    > Phase: {System|Design|Spec|Review} | Source: [{FILENAME}]({relative-path}) | Generated: {DATE}

    ---

    {Exact content extracted from source monolith — no summarization}

    ---

    ## Related

    - [{Related chunk name}]({relative-path-to-related-chunk})

## Naming Conventions

- **Singular, kebab-case, lowercase:** "Buttons" → `button.md`, "Date Picker" → `date-picker.md`
- **Screen files:** `screen-{NN}-{kebab-case-name}.md` (e.g., `screen-01-home.md`)
- **Spec files:** `screen-{NN}-spec.md`

## Rules

- **Preserve exact content** — no summarization, no rewriting, no omission
- **Size target:** 50-200 lines per chunk
- **Self-contained:** each chunk must be understandable without loading other chunks
- **Cross-references:** `## Related` section uses relative paths to related chunks
- **Idempotent:** re-running a phase regenerates all chunks in that phase's `exports/` directory
