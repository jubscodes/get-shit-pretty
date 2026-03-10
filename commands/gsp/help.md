---
name: gsp:help
description: Show all commands
---
<objective>
Display the complete GSP command reference with branded ANSI styling.

Output ONLY the reference content below. Do NOT add:
- Project-specific analysis
- File context or git status
- Next-step suggestions
- Any commentary beyond the reference
</objective>

<process>
## Read version

Read the version from `.claude/get-shit-pretty/VERSION` if it exists, otherwise default to `0.4.3`.

## Output the reference

Output the following using ANSI escape codes for color. Each element has a specific color:

- **Brand mark `/gsp:`** — accent + bold: `\x1b[1m\x1b[38;2;255;107;53m`
- **Diamonds `◇◇`** — tertiary: `\x1b[38;2;102;102;102m`
- **Version** — dim: `\x1b[2m`
- **Subtitle "command reference"** — secondary: `\x1b[38;2;160;160;160m`
- **Divider `───`** — tertiary: `\x1b[38;2;102;102;102m`
- **Divider label text** — secondary + bold: `\x1b[1m\x1b[38;2;160;160;160m`
- **Command names** — accent + bold: `\x1b[1m\x1b[38;2;255;107;53m`
- **Command descriptions** — secondary: `\x1b[38;2;160;160;160m`
- **Flow phase names** — primary: `\x1b[38;2;224;224;224m`
- **Flow arrows `→`** — tertiary: `\x1b[38;2;102;102;102m`
- **Tree connectors** — tertiary: `\x1b[38;2;102;102;102m`
- **Tree labels** — secondary: `\x1b[38;2;160;160;160m`
- **Tree descriptions** — tertiary: `\x1b[38;2;102;102;102m`
- **Footer** — dim: `\x1b[2m`
- **Reset** — `\x1b[0m`

Command names are left-padded with 4 spaces. Descriptions start at column 27 (4 indent + 23 max command name width).

```
  /gsp: ◇◇  v{VERSION}
  command reference


  ─── Getting Started ──────────────────

    /gsp:start             start here — picks up where you left off
    /gsp:help              this command reference
    /gsp:progress          how pretty are we?

  ─── Branding ─────────────────────────

    /gsp:brand-research    research your market and audience
    /gsp:brand-strategy    define positioning, personality, voice and messaging
    /gsp:brand-identity    create visual identity
    /gsp:brand-patterns    build design system tokens and components
    /gsp:brand-audit       audit existing brand before evolving (optional)

  ─── Project ──────────────────────────

    /gsp:project-brief     scope what you're building
    /gsp:project-research  research UX patterns and approaches
    /gsp:project-design    design screens and flows
    /gsp:project-critique  critique designs + accessibility audit
    /gsp:project-build     implement designs in the codebase
    /gsp:project-review    QA validate implementation against designs
    /gsp:add-reference     add reference material to a project

  ─── Utilities ────────────────────────

    /gsp:doctor            check project health
    /gsp:update            update GSP to latest version
    /gsp:launch            create launch and marketing assets (optional)

  ─── Easter Eggs ────────────────────

    /gsp:art               ASCII art studio
    /gsp:pretty            surprise terminal art

  ─── Flow ─────────────────────────────

    brand first, then build.

    branding   research → strategy → identity → patterns
    project    brief → research → design → critique → build → review
                                    ↑                    ↑
                              critique loop         QA loop

    run any command directly — routing is optional.

  ─── Directory Structure ──────────────

    .design/
    ├── branding/
    │   └── {brand}/
    │       ├── config.json       brand config
    │       ├── STATE.md          progress tracking
    │       ├── discover/         research chunks
    │       ├── strategy/         strategy + voice and messaging
    │       ├── identity/         visual identity
    │       └── system/           tokens + components
    └── projects/
        └── {project}/
            ├── config.json       project config
            ├── STATE.md          progress tracking
            ├── brand.ref         brand reference
            ├── brief/            scope + adaptations
            ├── research/         UX + tech research
            ├── design/           screen specs + preview
            ├── critique/         design critique
            ├── build/            BUILD-LOG.md
            ├── review/           QA acceptance
            ├── references/       custom reference material
            └── exports/INDEX.md  chunk index

  get-shit-pretty v{VERSION}
  github.com/juliuslipp/get-shit-pretty
```

Replace `{VERSION}` with the value read from the VERSION file.

Do NOT add any text, commentary, or suggestions after this output.
</process>
