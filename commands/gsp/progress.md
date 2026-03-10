---
name: gsp:progress
description: How pretty are we?
allowed-tools:
  - Read
  - Glob
---
<context>
Status check for GSP design projects. Shows progress for all brands and projects with diamond state indicators, pipeline flows, and progress bars. Renders with ANSI color codes.
</context>

<objective>
Display current progress across all brands and projects with branded terminal output.
</objective>

<styling>
## ANSI Color Tokens

| Element | ANSI Code |
|---------|-----------|
| Brand mark `/gsp:` | `\x1b[1m\x1b[38;2;255;107;53m` (accent + bold) |
| `◆` complete diamond | `\x1b[38;2;224;224;224m` (primary) |
| `◈` active diamond | `\x1b[38;2;255;107;53m` (accent) |
| `◇` pending diamond | `\x1b[38;2;102;102;102m` (tertiary) |
| Labeled divider `───` | `\x1b[38;2;102;102;102m` (tertiary) |
| Divider label | `\x1b[1m\x1b[38;2;160;160;160m` (secondary + bold) |
| Instance name | `\x1b[1m\x1b[38;2;224;224;224m` (primary + bold) |
| Pipeline phase names (complete) | `\x1b[38;2;224;224;224m` (primary) |
| Pipeline phase names (active) | `\x1b[38;2;255;107;53m` (accent) |
| Pipeline phase names (pending) | `\x1b[38;2;102;102;102m` (tertiary) |
| Pipeline connectors `───` | `\x1b[38;2;102;102;102m` (tertiary) |
| Progress bar filled `█` | `\x1b[38;2;255;107;53m` (accent) |
| Progress bar empty `░` | `\x1b[38;2;102;102;102m` (tertiary) |
| Percentage + fraction | `\x1b[38;2;160;160;160m` (secondary) |
| Table header | `\x1b[1m\x1b[38;2;160;160;160m` (secondary + bold) |
| Table values | `\x1b[38;2;160;160;160m` (secondary) |
| Table pending `—` | `\x1b[38;2;102;102;102m` (tertiary) |
| Next command `→` | `\x1b[38;2;160;160;160m` (secondary) |
| Next command name | `\x1b[38;2;255;107;53m` (accent) |
| Summary keys | `\x1b[38;2;160;160;160m` (secondary) |
| Summary values | `\x1b[38;2;224;224;224m` (primary) |
| "brand: x" reference | `\x1b[38;2;102;102;102m` (tertiary) |
| "fully pretty." | `\x1b[38;2;224;224;224m` (primary) |
| Reset | `\x1b[0m` |
</styling>

<process>
## Step 1: Scan for instances

Check `.design/branding/` for brand directories and `.design/projects/` for project directories.

If neither found, check for legacy `.design/STATE.md`:
- If found: show legacy progress
- If not: display the empty state (see below)

## Step 2: Read state for each instance

For each brand: read `STATE.md` and `config.json`
For each project: read `STATE.md`, `config.json`, and `brand.ref`

Count chunks per phase: count `.md` files in each phase directory (excluding INDEX.md).

## Step 3: Calculate prettiness

Brands: count completed/skipped phases out of 4
Projects: count completed/skipped phases out of 6

Determine the Brand Mark diamond states:
- First diamond = branding status (highest across all brands): `◇` none, `◈` in progress, `◆` all complete
- Second diamond = project status (highest across all projects): `◇` none, `◈` in progress, `◆` all complete

## Step 4: Validate state integrity

For each phase marked as complete in STATE.md, verify the phase directory contains at least 1 chunk file. If `status === 'complete'` and chunk count is 0, display that phase as `◆!` with note "(empty — may need re-run)".

If `config.json` is missing or unparseable for any instance, show the instance name with "(config error — run /gsp:doctor)" instead of crashing.

## Step 5: Display progress

Output with ANSI color codes using the tokens from the styling section above.

### Empty State

```
  /gsp: ◇◇

  no brands or projects found.
  run /gsp:start to begin.
```

### Standard State — render these elements:

**Brand Mark:** `/gsp:` (accent+bold) followed by state diamonds

**Labeled Divider:** `  ─── {Label} ──────────────────` (tertiary `───`, secondary+bold label)

**Pipeline Flow:** Diamond + phase name per phase, connected by `───` (tertiary). Color per phase status.

**Progress Bar:** `████████░░░░░░░░░░░░ 40% (2/5)` — bar width 20 chars, filled = `Math.round(20 * completed / total)`. Filled in accent, empty in tertiary, percentage in secondary.

**Status Table (in-progress items only):**
```
    Phase          Status    Chunks    Time
    discover       ◆         6         2m
    strategy       ◆         5         4m
```
Column positions: phase at col 4, status at col 19, chunks at col 29, time at col 39.

**Collapsed complete items:**
When 100% complete, single-line: `  acme-corp ◆ complete (4/4, 11 chunks)`

**Next Command:** `  → next: /gsp:brand-identity` (secondary `→ next:`, accent command name)

### Example: Early State (2/4 branding)

```
  /gsp: ◈◇


  ─── Brands ───────────────────────────

  acme-corp
  ◆ discover ─── ◆ strategy ─── ◇ identity ─── ◇ patterns
  ██████████░░░░░░░░░░ 50% (2/4)

    Phase          Status    Chunks    Time
    discover       ◆         6         2m
    strategy       ◆         5         4m
    identity       ◇         —         —
    patterns       ◇         —         —

  → next: /gsp:brand-identity


  ─── Overall ──────────────────────────

    brands      1 in progress
    projects    0
    phases      2/4 complete
    chunks      11 written
```

### Example: Late State (brand complete, 4/6 project)

```
  /gsp: ◆◈


  ─── Brands ───────────────────────────

  acme-corp ◆ complete (4/4, 48 chunks)


  ─── Projects ─────────────────────────

  acme-website                                       brand: acme-corp
  ◆ brief ─── ◆ research ─── ◆ design ─── ◆ critique ─── ◈ build ─── ◇ review
  ████████████████░░░░ 66% (4/6)

    Phase          Status    Chunks    Time
    brief          ◆         3         1m
    research       ◆         7         5m
    design         ◆         8         12m
    critique       ◆         4         3m
    build          ◈         —         —
    review         ◇         —         —

  → next: /gsp:project-build


  ─── Overall ──────────────────────────

    brands      1 complete
    projects    1 in progress
    phases      8/10 complete
    chunks      33 written
```

### All Complete State

After the summary, if everything is 100% complete, add: `  fully pretty.` in primary color.

## Step 6: Route next

For each in-progress instance, identify the next pending phase and suggest the command.

**Brand routing:**
- Phase 1 (Research) pending -> `/gsp:brand-research`
- Phase 2 (Strategy) pending -> `/gsp:brand-strategy`
- Phase 3 (Identity) pending -> `/gsp:brand-identity`
- Phase 4 (Patterns) pending -> `/gsp:brand-patterns`

**Project routing:**
- Brief pending -> `/gsp:project-brief`
- Research pending -> `/gsp:project-research`
- Design pending -> `/gsp:project-design`
- Critique pending -> `/gsp:project-critique`
- Build pending -> `/gsp:project-build`
- Review pending -> `/gsp:project-review`

Output this as a single block. Do NOT add commentary or suggestions beyond the dashboard content.
</process>
