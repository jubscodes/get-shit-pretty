# Screen 04: Start Greeting

> Phase: design | Project: gsp-cli | Generated: 2026-03-08

---

## Purpose

Session entry point. Appears when the user runs `/gsp:start`. Scans the codebase, detects existing brands/projects, and routes the user into the right flow through guided choices. This is where users re-orient after time away.

**Type:** B (Agent Output Template in `commands/gsp/start.md`)
**Tone:** Welcoming + efficient
**Density:** Low (10-20 lines)

## Components Used

- **Brand Mark** — Header with state-aware diamonds
- **Pipeline Flow** — Compact variant showing existing brands/projects
- **Status Message** — Contextual info about codebase detection
- **Summary Box** — Codebase info (when codebase exists)

## State 1: Fresh Start (no `.design/`)

```
  /gsp: ◇◇

  looks like a fresh start.
```

Followed by `AskUserQuestion` with options:

- **Brand identity** — "define who you are — strategy, voice, visuals"
- **Design project** — "design screens and flows for something you're building"
- **Both (brand + project)** — "full pipeline — brand first, then design"

### Rendered Output

```
  [bold][accent]/gsp:[/accent][/bold] [tertiary]◇◇[/tertiary]

  [primary]looks like a fresh start.[/primary]
```

Then the agent uses `AskUserQuestion` tool — the choices are NOT rendered as terminal output. They appear through the tool's native UI.

### With Codebase Detected

If `package.json` exists, append a status message before the AskUserQuestion:

```
  [bold][accent]/gsp:[/accent][/bold] [tertiary]◇◇[/tertiary]

  [primary]looks like a fresh start.[/primary]
  [info]i[/info] [secondary]scanning your codebase in the background — i'll factor in what i find.[/secondary]
```

## State 2: Brands Exist, No Projects

```
  /gsp: ◆◇

  ─── Brands ───────────────────────────

  acme-corp
  ◆ discover ─── ◆ strategy ─── ◆ verbal ─── ◆ identity ─── ◆ patterns
  100% (5/5)
```

Followed by `AskUserQuestion` with options:

- **Start a project with acme-corp** — "design screens and flows using the acme-corp brand"
- **Create new brand** — "start a new brand identity"

If multiple brands exist, show each brand's pipeline flow and provide one option per brand plus the "create new brand" option.

### Incomplete Brand Variant

```
  /gsp: ◈◇

  ─── Brands ───────────────────────────

  acme-corp
  ◆ discover ─── ◆ strategy ─── ◈ verbal ─── ◇ identity ─── ◇ patterns
  40% (2/5)

  → next: /gsp:brand-verbal
```

Followed by `AskUserQuestion`:

- **Continue acme-corp branding** — "pick up at verbal identity"
- **Start a new brand** — "start a new brand identity"
- **Start a project anyway** — "use acme-corp as-is for a design project"

## State 3: Brands + Projects Exist

```
  /gsp: ◆◈

  ─── Brands ───────────────────────────

  acme-corp                                          ◆ complete

  ─── Projects ─────────────────────────

  acme-website                                       brand: acme-corp
  ◆ brief ─── ◆ research ─── ◆ design ─── ◈ critique ─── ◇ build ─── ◇ review
  50% (3/6)

  → next: /gsp:project-critique
```

When a brand is complete, show it in a compact single-line format (no full pipeline flow — the user doesn't need to re-read completed work). Projects always show the full pipeline flow.

Followed by `AskUserQuestion`:

- **Continue acme-website** — "pick up at design critique"
- **New project** — "start a new design project"
- **New brand** — "create a new brand identity"
- **View progress** — "see full progress dashboard"

### With Codebase Summary Box

When a codebase has been scanned (INVENTORY.md exists), show a Summary Box:

```
  ┌──────────────────────────────────────────┐
  │  /gsp: ◆◈                               │
  │                                          │
  │  framework     Next.js 14               │
  │  styling       Tailwind + shadcn/ui     │
  │  components    47 detected              │
  │  type          existing codebase        │
  └──────────────────────────────────────────┘
```

The Summary Box replaces the standalone Brand Mark when codebase info is available. Border in text-tertiary. Key labels in text-secondary. Values in text-primary. Brand mark inside uses its standard styling.

Summary Box width: 44 characters default. Adapts to terminal width with minimum 36 characters.

## State 4: Continue Existing (single in-progress item)

When there is exactly one in-progress brand or project with a clear next step, the greeting is minimal:

```
  /gsp: ◆◈

  acme-website — critique phase ready.
```

Followed by `AskUserQuestion`:

- **Continue to critique** — "run design critique now"
- **View progress** — "see full progress dashboard"
- **Something else** — "new project, new brand, or help"

## Styling Specification

| Element | Color | ANSI Code |
|---------|-------|-----------|
| Brand mark `/gsp:` | accent + bold | `\x1b[1m\x1b[38;2;255;107;53m` |
| Diamonds (state-aware) | per state | see Screen 03 |
| "looks like a fresh start" | text-primary | `\x1b[38;2;224;224;224m` |
| Status message `i` symbol | info | `\x1b[38;2;96;165;250m` |
| Status message text | text-secondary | `\x1b[38;2;160;160;160m` |
| Instance name | primary + bold | `\x1b[1m\x1b[38;2;224;224;224m` |
| Pipeline flow | see Screen 03 spec | |
| Next command `→` | text-secondary | `\x1b[38;2;160;160;160m` |
| Summary Box border `┌┐└┘│─` | text-tertiary | `\x1b[38;2;102;102;102m` |
| Summary Box keys | text-secondary | `\x1b[38;2;160;160;160m` |
| Summary Box values | text-primary | `\x1b[38;2;224;224;224m` |
| "brand: acme-corp" | text-tertiary | `\x1b[38;2;102;102;102m` |
| "◆ complete" compact status | text-primary | `\x1b[38;2;224;224;224m` |

## States Summary

| State | Condition | Content Shown | AskUserQuestion Options |
|-------|-----------|---------------|------------------------|
| Fresh | No `.design/` | Brand Mark + welcome | Brand / Project / Both |
| Brands only | `.design/branding/` exists | Brand Mark + pipeline flows | Per-brand project / New brand |
| Brands + projects | Both exist | Brand Mark + compact brands + project flows | Continue / New project / New brand / View progress |
| Continue | Single in-progress | Brand Mark + one-liner status | Continue / View progress / Something else |

## Responsive Behavior

### Wide (>100 cols)

Pipeline flows remain horizontal. Summary Box stays at 44 chars.

### Standard (60-100 cols)

Default layout.

### Narrow (<60 cols)

Pipeline flows switch to vertical compact (one phase per line, no connectors). Summary Box width reduces to terminal width minus 4 (2 indent + 2 border chars).

## Accessibility

### NO_COLOR

Structure maintained through Unicode box-drawing characters and diamond symbols. Summary Box borders render in plain text. Pipeline flow phase names remain readable.

### Screen Reader

- AskUserQuestion options are the primary interaction — these are handled by the agent tool's native accessibility
- Pipeline flow reads as a sequence of symbols and phase names
- Summary Box reads as key-value pairs within a bordered container

## Agent Rendering Instructions (Type B)

The agent scans `.design/` to determine the current state, then renders the appropriate variant. Key logic:

1. Check if `.design/branding/` exists and has subdirectories
2. Check if `.design/projects/` exists and has subdirectories
3. For each, read `config.json` and `STATE.md` for phase statuses
4. Determine which state variant to render
5. Output the styled text block
6. Use `AskUserQuestion` for routing (the options depend on the state)

The agent should NOT output the AskUserQuestion options as formatted text. Use the `AskUserQuestion` tool, which renders the options in its own UI.

Key ANSI sequences:

```
Brand mark (fresh):
  \x1b[1m\x1b[38;2;255;107;53m/gsp:\x1b[0m \x1b[38;2;102;102;102m◇◇\x1b[0m

Welcome message:
  \x1b[38;2;224;224;224m  looks like a fresh start.\x1b[0m

Info status:
  \x1b[38;2;96;165;250m  i\x1b[0m \x1b[38;2;160;160;160mscanning your codebase in the background\x1b[0m

Summary Box top border:
  \x1b[38;2;102;102;102m  ┌──────────────────────────────────────────┐\x1b[0m
```

---

## Related

- [Screen 01 - Onboarding Splash](./screen-01-onboarding-splash.md)
- [Screen 03 - Progress Dashboard](./screen-03-progress-dashboard.md)
- [Screen 05 - Phase Transitions](./screen-05-phase-transitions.md)
- [Component Plan](./shared/component-plan.md)
