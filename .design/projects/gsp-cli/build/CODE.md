# GSP CLI Build Implementation Guide

> Phase: build | Project: gsp-cli | Generated: 2026-03-08

---

## Overview

This guide covers all changes needed to apply the GSP brand identity to the CLI's terminal output. There are 5 screens across 2 output types:

| Screen | File | Type | Change Scope |
|--------|------|------|-------------|
| 1. Onboarding Splash | `bin/install.js` | A (JavaScript) | Color system, banner, onboarding |
| 2. Help Reference | `commands/gsp/help.md` | B (Plain text) | Full rewrite |
| 3. Progress Dashboard | `commands/gsp/progress.md` | B (Plain text) | Full rewrite |
| 4. Start Greeting | `commands/gsp/start.md` | B (Plain text) | Targeted modifications |
| 5. Phase Transitions | 12 phase command files | B (Plain text) | Append template to each |

**Apply in order.** Screen 1 is the most complex (JS changes with ANSI color system). Screens 2-5 are plain text output — no ANSI escape codes. Agent-rendered text in Claude Code (and other AI coding tools) does not interpret ANSI sequences, so Screens 2-5 rely on Unicode symbols (◆◈◇), box-drawing characters (├──└──│───), and indentation for structure.

---

## Component Index

| Component | File | Purpose |
|-----------|------|---------|
| Color System | `build/components/color-system.js` | getColorTier, getColors, all tier constants |
| Banner | `build/components/banner.js` | printBanner with sparkle field + density ramp |
| Status Message | `build/components/status-message.js` | statusSuccess, statusSkipped, statusWarning, statusInfo helpers |
| File Tree | `build/components/file-tree.js` | printFileTree helper for box-drawing output |
| Phase Transition | `build/components/phase-transition-template.md` | Template text + values table for all 12 phase commands |

---

## Screen 1: `bin/install.js` Changes

### 1.1 Replace color constants (lines 9-15)

**Delete** the existing color block:

```javascript
// Colors
const cyan = '\x1b[36m';
const green = '\x1b[32m';
const yellow = '\x1b[33m';
const magenta = '\x1b[35m';
const bold = '\x1b[1m';
const dim = '\x1b[2m';
const reset = '\x1b[0m';
```

**Replace with** the full contents of `build/components/color-system.js` (the `getColorTier`, tier constants, `getColors`, and `const c = getColors()` block). See that file for the complete code.

### 1.2 Replace banner (lines 82-94)

**Delete** the existing banner block:

```javascript
// Banner
const banner = '\n' +
  cyan + '   ██████╗ ███████╗██████╗\n' +
  ...
  '  ' + dim + tagline + reset + '\n';

console.log(banner);
```

**Replace with** the full contents of `build/components/banner.js` (the `columns`, `center`, `sparkleLine`, `printBanner` definitions and the quiet-guarded call).

Key change: the banner is now wrapped in `if (!hasQuiet)` so `--quiet` suppresses it (accessibility fix A5).

### 1.3 Replace finishInstall onboarding (lines 1107-1128)

**Delete** the existing onboarding block inside `finishInstall()`:

```javascript
if (!onboardingShown && !hasQuiet) {
    onboardingShown = true;
    console.log(`
  ${dim}        *    .              ·    *${reset}
  ...
    ${cyan}${helpCmd}${reset}    all commands
`);
  }
```

**Replace with:**

```javascript
  if (!onboardingShown && !hasQuiet) {
    onboardingShown = true;
    const runtimeLabel = getRuntimeLabel(runtime);

    // Status messages for install results
    console.log(`\n  ${c.success}\u2713${c.reset} ${c.textPrimary}commands installed \u2014 ${commandCount} files${c.reset}`);
    console.log(`  ${c.success}\u2713${c.reset} ${c.textPrimary}agents installed \u2014 ${agentCount} files${c.reset}`);
    console.log(`  ${c.success}\u2713${c.reset} ${c.textPrimary}prompts, templates, references bundled${c.reset}`);
    if (shouldInstallStatusline) {
      console.log(`  ${c.success}\u2713${c.reset} ${c.textPrimary}statusline configured${c.reset}`);
    }

    // File tree
    const configLabel = isGlobal ? getGlobalDir(runtime) : `./${getDirName(runtime)}`;
    console.log(`\n  ${c.textSecondary}installed to ${c.textPrimary}${configLabel}${c.reset}`);
    console.log(`  ${c.textTertiary}\u251C\u2500\u2500 ${c.reset}${c.textSecondary}commands/gsp/${c.reset}      ${c.textSecondary}${commandCount} commands${c.reset}`);
    console.log(`  ${c.textTertiary}\u251C\u2500\u2500 ${c.reset}${c.textSecondary}agents/${c.reset}             ${c.textSecondary}${agentCount} agents${c.reset}`);
    console.log(`  ${c.textTertiary}\u251C\u2500\u2500 ${c.reset}${c.textSecondary}get-shit-pretty/${c.reset}    ${c.textSecondary}prompts, templates, references${c.reset}`);
    if (shouldInstallStatusline) {
      console.log(`  ${c.textTertiary}\u251C\u2500\u2500 ${c.reset}${c.textSecondary}hooks/${c.reset}              ${c.textSecondary}statusline${c.reset}`);
    }
    console.log(`  ${c.textTertiary}\u2514\u2500\u2500 ${c.reset}${c.textSecondary}settings.json${c.reset}       ${c.textSecondary}updated${c.reset}`);

    // Next steps
    console.log(`\n\n  ${c.bold}Get started:${c.reset}`);
    console.log(`    ${c.accent}${newCmd}${c.reset}     ${c.textSecondary}start here \u2014 brand, project, or both${c.reset}`);
    console.log(`    ${c.accent}${helpCmd}${c.reset}      ${c.textSecondary}all commands${c.reset}`);
    console.log('');
  }
```

**Note:** `commandCount` and `agentCount` must be captured during the install process. These variables should be set by counting the files actually installed. Search the install logic for where commands and agents are copied/symlinked and capture the counts there. Currently the file counts are available from the `installCommands` and `installAgents` calls -- you may need to return counts from those functions or count files in the target directories after install.

### 1.4 Color variable migration (rest of file)

Replace every remaining reference to the old color variables throughout `install.js`. Use find-and-replace with these mappings:

| Old | New | Context |
|-----|-----|---------|
| `${cyan}` | `${c.accent}` | Command names, option flags, highlights |
| `${green}` | `${c.success}` | Success indicators (`+`, `Done!`) |
| `${yellow}` | `${c.warning}` | Warnings, prompts, section headers |
| `${magenta}` | `${c.accent}` | Brand elements (only in old onboarding) |
| `${bold}` | `${c.bold}` | Bold text |
| `${dim}` | `${c.dim}` | Dimmed text (comments, examples) |
| `${reset}` | `${c.reset}` | Reset sequences |

**Specific locations to update:**

1. **Help text** (lines 97-130): `${yellow}Usage:` -> `${c.warning}Usage:`, `${cyan}-g` -> `${c.accent}-g`, etc.
2. **parseConfigDirArg** (lines 51, 60): `${yellow}--config-dir` -> `${c.warning}--config-dir`
3. **Install log messages** throughout (e.g., `${green}+${reset}` -> `${c.success}+${c.reset}`)
4. **Uninstall messages** (~line 1000-1039): `${green}+` -> `${c.success}+`, `${yellow}!` -> `${c.warning}!`
5. **Statusline handling** (~lines 1046-1078): `${yellow}!` -> `${c.warning}!`, `${cyan}--force-statusline` -> `${c.accent}--force-statusline`
6. **Interactive prompts** (~lines 1135-1148): `${yellow}Which runtime` -> `${c.warning}Which runtime`, `${cyan}1` -> `${c.accent}1`
7. **All remaining instances** of `${green}`, `${cyan}`, `${yellow}`, `${magenta}`, `${bold}`, `${dim}`, `${reset}`

After migration, the old constants (`cyan`, `green`, `yellow`, `magenta`, `bold`, `dim`, `reset`) should have zero references and can be confirmed deleted.

### 1.5 Status emoji update

Throughout install.js, replace the old status markers:

| Old | New |
|-----|-----|
| `${green}+${reset}` (success) | `${c.success}\u2713${c.reset}` |
| `${yellow}!${reset}` (warning) | `${c.warning}!${c.reset}` |

This applies to all `console.log` calls that use `+` as a success indicator (approximately 15-20 occurrences).

---

## Screen 2: `commands/gsp/help.md` — Complete Replacement

Replace the entire contents of `commands/gsp/help.md` with:

```markdown
---
name: gsp:help
description: Show all commands
---
<objective>
Display the complete GSP command reference.

Output ONLY the reference content below. Do NOT add:
- Project-specific analysis
- File context or git status
- Next-step suggestions
- Any commentary beyond the reference
</objective>

<process>
## Read version

Read the version from `.claude/get-shit-pretty/VERSION` if it exists, otherwise default to `0.4.2`.

## Output the reference

Output the following as plain text. No ANSI escape codes — structure comes from Unicode symbols and indentation.

```
  /gsp: ◇◇  v{VERSION}
  command reference


  ─── Getting Started ──────────────────

    /gsp:start             start here — picks up where you left off
    /gsp:help              this command reference
    /gsp:progress          how pretty are we?

  ─── Branding ─────────────────────────

    /gsp:brand-research    research your market and audience
    /gsp:brand-strategy    define positioning and personality
    /gsp:brand-verbal      shape voice and messaging
    /gsp:brand-identity    create visual identity
    /gsp:brand-patterns    build design system tokens and components
    /gsp:brand-audit       audit existing brand before evolving (optional)

  ─── Project ──────────────────────────

    /gsp:project-brief     scope what you're building
    /gsp:project-research  research UX patterns and approaches
    /gsp:project-design    design screens and flows
    /gsp:project-critique  critique designs + accessibility audit
    /gsp:project-build     translate designs to code
    /gsp:project-review    review deliverables against designs

  ─── Utilities ────────────────────────

    /gsp:doctor            check project health
    /gsp:update            update GSP to latest version
    /gsp:launch            create launch and marketing assets (optional)

  ─── Art ──────────────────────────────

    /gsp:art               craft ASCII art interactively
    /gsp:pretty            surprise ASCII art in the terminal

  ─── Flow ─────────────────────────────

    brand first, then build.

    branding   research → strategy → verbal → identity → patterns
    project    brief → research → design → critique → build → review

    run any command directly — routing is optional.

  ─── Directory Structure ──────────────

    .design/
    ├── branding/
    │   └── {brand}/
    │       ├── config.json       brand config
    │       ├── STATE.md          progress tracking
    │       ├── discover/         research chunks
    │       ├── strategy/         strategy chunks
    │       ├── verbal/           voice and messaging
    │       ├── identity/         visual identity
    │       └── system/           tokens + components
    └── projects/
        └── {project}/
            ├── config.json       project config
            ├── STATE.md          progress tracking
            ├── brand.ref         brand reference
            ├── brief/            scope + adaptations
            ├── research/         UX + tech research
            ├── design/           screen specs
            ├── critique/         design critique
            ├── build/            implementation
            ├── review/           acceptance
            └── exports/INDEX.md  chunk index

  get-shit-pretty v{VERSION}
  github.com/juliuslipp/get-shit-pretty
```

Replace `{VERSION}` with the value read from the VERSION file.

Do NOT add any text, commentary, or suggestions after this output.
</process>
</output>
```

---

## Screen 3: `commands/gsp/progress.md` — Complete Replacement

Replace the entire contents of `commands/gsp/progress.md` with:

```markdown
---
name: gsp:progress
description: How pretty are we?
allowed-tools:
  - Read
  - Glob
---
<context>
Status check for GSP design projects. Shows progress for all brands and projects with diamond state indicators, pipeline flows, and progress bars.
</context>

<objective>
Display current progress across all brands and projects.
</objective>

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

Brands: count completed/skipped phases out of 5
Projects: count completed/skipped phases out of 6

Determine the Brand Mark diamond states:
- First diamond = branding status (highest across all brands): `◇` none, `◈` in progress, `◆` all complete
- Second diamond = project status (highest across all projects): `◇` none, `◈` in progress, `◆` all complete

## Step 4: Validate state integrity (C3 fix)

For each phase marked as complete in STATE.md, verify the phase directory contains at least 1 chunk file. If `status === 'complete'` and chunk count is 0, display that phase as `◆!` with note "(empty -- may need re-run)".

If `config.json` is missing or unparseable for any instance, show the instance name with "(config error -- run /gsp:doctor)" instead of crashing.

## Step 5: Display progress

Output as plain text. No ANSI escape codes — use Unicode symbols and indentation for structure.

### Empty State

If no brands or projects found:

```
  /gsp: ◇◇

  no brands or projects found.
  run /gsp:start to begin.
```

### Standard State

Render the full dashboard using these elements:

**Brand Mark:** `/gsp:` followed by state diamonds (`◆◈◇`)

**Labeled Divider:** `  ─── {Label} ──────────────────`

**Pipeline Flow:** `◆ discover ─── ◆ strategy ─── ◈ verbal ─── ◇ identity ─── ◇ patterns`

**Progress Bar:** `████████░░░░░░░░░░░░ 40% (2/5)` — bar width 20 chars, filled = `Math.round(20 * completed / total)`

**Status Table (in-progress items only):**
```
    Phase          Status    Chunks    Time
    discover       ◆         6         2m
    strategy       ◆         5         4m
    verbal         ◈         —         —
```
Column positions: phase at col 4, status at col 19, chunks at col 29, time at col 39.

**Collapsed complete items (I2 fix):**
When 100% complete, single-line: `  acme-corp ◆ complete (5/5, 11 chunks)`

**Next Command:** `  → next: /gsp:brand-verbal`

### Example: Early State (2/5 branding)

```
  /gsp: ◈◇


  ─── Brands ───────────────────────────

  acme-corp
  ◆ discover ─── ◆ strategy ─── ◈ verbal ─── ◇ identity ─── ◇ patterns
  ████████░░░░░░░░░░░░ 40% (2/5)

    Phase          Status    Chunks    Time
    discover       ◆         6         2m
    strategy       ◆         5         4m
    verbal         ◈         —         —
    identity       ◇         —         —
    patterns       ◇         —         —

  → next: /gsp:brand-verbal


  ─── Overall ──────────────────────────

    brands      1 in progress
    projects    0
    phases      2/5 complete
    chunks      11 written
```

### Example: Late State (brand complete, 4/6 project)

```
  /gsp: ◆◈


  ─── Brands ───────────────────────────

  acme-corp ◆ complete (5/5, 48 chunks)


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
    phases      9/11 complete
    chunks      33 written
```

### All Complete State

After the summary, if everything is 100% complete, add: `  fully pretty.`

## Step 6: Route next

For each in-progress instance, identify the next pending phase and suggest the command.

**Brand routing:**
- Phase 1 (Research) pending -> `/gsp:brand-research`
- Phase 2 (Strategy) pending -> `/gsp:brand-strategy`
- Phase 3 or 4 (Verbal/Identity) pending -> `/gsp:brand-identity`
- Phase 5 (Patterns) pending -> `/gsp:brand-patterns`

**Project routing:**
- Brief pending -> `/gsp:project-brief`
- Research pending -> `/gsp:project-research`
- Design pending -> `/gsp:project-design`
- Critique pending -> `/gsp:project-critique`
- Build pending -> `/gsp:project-build`
- Review pending -> `/gsp:project-review`

Output this as a single block. Do NOT add commentary or suggestions beyond the dashboard content.
</process>
</output>
```

---

## Screen 4: `commands/gsp/start.md` — Targeted Modifications

Modify `commands/gsp/start.md` by replacing the greeting output in each state variant. Do NOT rewrite the entire file — only change the output format in Step 1c. All output is plain text — no ANSI escape codes.

### 4.1 Fresh start greeting (around line 80-89)

**Replace:**
```markdown
**Fresh start (no `.design/`):**
```
🎨 GSP — Get Shit Pretty

Looks like a fresh start!
```
```

**With:**
```markdown
**Fresh start (no `.design/`):**

Output this greeting as plain text:
```
  /gsp: ◇◇

  looks like a fresh start.
```

If `package.json` exists and contains dependencies, append:
```
  scanning your codebase in the background — i'll factor in what i find.
```
```

### 4.2 Legacy state greeting (around line 91-94)

**Replace the emoji header** with the Brand Mark: `  /gsp: ◇◇`

### 4.3 Brands exist greeting (around line 96-105)

**Replace** the emoji-based brand status display with Pipeline Flow rendering.

For each brand, render the pipeline flow as plain text:
```
  ─── Brands ───────────────────────────

  acme-corp
  ◆ discover ─── ◆ strategy ─── ◈ verbal ─── ◇ identity ─── ◇ patterns
  40% (2/5)

  → next: /gsp:brand-verbal
```

When a brand is complete, use compact single-line format:
```
  acme-corp ◆ complete
```

### 4.4 Brands + projects greeting (around line 101-108)

Same approach: Brand Mark with state-aware diamonds, Pipeline Flow for projects, compact format for complete brands.

For projects, also show the brand reference:
```
  acme-website                                       brand: acme-corp
```

### 4.5 Summary Box (when INVENTORY.md exists)

When codebase info is available, render a Summary Box using box-drawing characters:
```
  ┌────────────────────────────────────────┐
  │  /gsp: ◆◈                             │
  │                                        │
  │  framework    Next.js 14               │
  │  styling      Tailwind + shadcn/ui     │
  │  components   47 detected              │
  │  type         existing codebase        │
  └────────────────────────────────────────┘
```

Summary Box inner width: 40 characters (between the `│` borders). Key labels at col 2 inside box, values at col 15 inside box. Pad each line to exactly 40 chars before the closing `│`.

---

## Screen 5: Phase Transition Template — All 12 Phase Commands

Add the phase completion output template to the end of the `<process>` section in each of these 12 command files. All output is plain text — no ANSI escape codes.

### Files to modify

| File | Phase | Completion Message | Next Phase | Next Description |
|------|-------|-------------------|------------|-----------------|
| `commands/gsp/brand-research.md` | discover | market landscape mapped | strategy | define positioning and personality |
| `commands/gsp/brand-strategy.md` | strategy | brand platform defined | identity | create voice and visual identity |
| `commands/gsp/brand-verbal.md` | verbal | voice and messaging shaped | identity | create visual identity |
| `commands/gsp/brand-identity.md` | identity | visual system designed | patterns | build tokens and components |
| `commands/gsp/brand-patterns.md` | system | design system built | a project | scope what you're building with this brand |
| `commands/gsp/project-brief.md` | brief | project scoped | research | research UX patterns and approaches |
| `commands/gsp/project-research.md` | research | patterns and approaches researched | design | design screens and flows |
| `commands/gsp/project-design.md` | design | screens designed | critique | critique designs + accessibility audit |
| `commands/gsp/project-critique.md` | critique | designs critiqued | build | translate designs to code |
| `commands/gsp/project-build.md` | build | designs translated to code | review | review deliverables against designs |
| `commands/gsp/project-review.md` | review | deliverables validated | launch | create launch and marketing assets |
| `commands/gsp/launch.md` | launch | campaign assets created | _(special)_ | _(see below)_ |

### Template to append

Add the following block before the closing `</process>` tag of each command file. Replace `{phase}`, `{completion_message}`, `{next_phase}`, and `{next_description}` with the values from the table above.

```markdown
## Phase Completion Output

After all phase work is complete and all files are written, render the phase transition screen as plain text.

### Check for partial output (C2 fix)

Before starting phase work, check if the phase directory already contains `.md` files (excluding INDEX.md). If partial output exists, show:

```
  ◈ {phase} — partial output found ({N} chunks). re-running will overwrite.
```

Then use `AskUserQuestion`:
- **Continue (overwrite)** — "re-run this phase from scratch"
- **View existing output** — "show what's already been written"
- **Cancel** — "keep existing output and stop"

### Render completion

1. Output 1 blank line, then the completion line:
```
  ◆ {phase} complete — {completion_message}
```

2. Output 1 blank line, then list all files written to the phase directory as a tree:
```
    {phase_dir}/
    ├── {file1}.md
    ├── {file2}.md
    └── INDEX.md
```
   Sort: directories first, then files alphabetically, INDEX.md always last.

3. Output 1 blank line, then a plain divider:
```
  ──────────────────────────────
```

4. Use `AskUserQuestion` with 3 options:
   - **Continue to {next_phase}** — "{next_description}"
   - **View progress** — "see the full dashboard"
   - **Done for now** — "pick up later with /gsp:start"
```

### Special cases

**`brand-patterns.md`:** Option 1 becomes "Start a project" with description "scope what you're building with this brand".

**`project-review.md`:** Option 1 becomes "Launch campaign" with description "create launch and marketing assets".

**`launch.md`:** Uses different options:
- **View progress** — "see the full dashboard"
- **Start new project** — "scope another project"
- **Done** — "that's a wrap"

**`project-critique.md`:** When critique finds critical issues, render this instead of the completion:

```
  ◈ critique — critical issues found, revising designs

  ──────────────────────────────
```

Then `AskUserQuestion`:
- **Revise designs** — "address critical issues and re-run critique"
- **Override and continue** — "accept current designs and move to build"
- **View issues** — "see the full critique report"

---

## Color Variable Migration Table

Complete mapping for `bin/install.js`:

| Old Variable | New Variable | Semantic Role |
|-------------|-------------|---------------|
| `cyan` | `c.accent` | Commands, option flags, brand highlights |
| `green` | `c.success` | Success indicators |
| `yellow` | `c.warning` | Warnings, prompts |
| `magenta` | `c.accent` | Brand elements |
| `bold` | `c.bold` | Bold text |
| `dim` | `c.dim` | Dimmed text |
| `reset` | `c.reset` | Reset |

**Status marker migration:**

| Old Pattern | New Pattern |
|------------|------------|
| `${green}+${reset}` | `${c.success}\u2713${c.reset}` |
| `${yellow}!${reset}` | `${c.warning}!${c.reset}` |
| `${green}Done!${reset}` | `${c.success}Done!${c.reset}` |

---

## Critique Fixes Applied

| Fix | Where Applied | Description |
|-----|--------------|-------------|
| C1: Color tier for Type B | Screens 2-5 | Resolved — dropped ANSI entirely, plain Unicode text for all agent output |
| C2: Phase interrupted state | Screen 5 | Added partial output check before phase work |
| C3: Empty phase validation | Screen 3, Screen 5 | Added `◆!` warning for complete phases with 0 chunks |
| I1: Re-run note | Screen 2 | Added "run any command directly -- routing is optional" to Flow section |
| I2: Collapse completed items | Screen 3 | Complete items show single-line compact format |
| I3: Artifact hints | Screen 2 | Not added (kept descriptions clean; chunk counts available via /gsp:progress) |
| I4: Power-user note | Screen 2 | Added "run any command directly -- routing is optional" to Flow section |
| A4: text-tertiary contrast | Screen 1 | Bumped from #666666 to #737373 (`\x1b[38;2;115;115;115m`), 256-color to `\x1b[38;5;243m` (Screens 2-5 use plain text, no ANSI) |
| A5: --quiet banner | Screen 1 | Banner wrapped in `if (!hasQuiet)` |
| P2: 16-color accent | Screen 1 | 16-color accent changed to `\x1b[33;1m` (bright yellow) |

---

## Testing Checklist

### Screen 1 (install.js)

- [ ] Run `npx get-shit-pretty --claude --local` -- verify new banner with sparkle field and density ramp
- [ ] Run with `--quiet` flag -- verify banner is suppressed, only status lines shown
- [ ] Run with `NO_COLOR=1` -- verify no ANSI codes in output
- [ ] Run `npx get-shit-pretty --help` -- verify help text uses new color variables
- [ ] Pipe output to file (`npx get-shit-pretty 2>&1 | cat`) -- verify clean text, no ANSI codes
- [ ] Verify `commandCount` and `agentCount` are captured and displayed correctly
- [ ] Verify file tree shows correct structure with box-drawing characters
- [ ] Verify skipped runtimes show dim `✗` (not red)
- [ ] Run with `FORCE_COLOR=0` -- verify no colors
- [ ] Run with `FORCE_COLOR=1` -- verify 16-color fallback
- [ ] Run uninstall (`--uninstall`) -- verify messages use new color variables

### Screen 2 (help.md)

- [ ] Run `/gsp:help` -- verify Brand Mark header with diamonds
- [ ] Verify labeled dividers render as plain Unicode (`───`)
- [ ] Verify command list is readable with indentation structure
- [ ] Verify Flow section includes "run any command directly" note
- [ ] Verify directory tree renders with box-drawing characters
- [ ] Verify footer shows version and URL

### Screen 3 (progress.md)

- [ ] Run `/gsp:progress` with no `.design/` -- verify empty state
- [ ] Run with brands only -- verify pipeline flow and progress bar
- [ ] Run with brands + projects -- verify both sections
- [ ] Verify complete items show collapsed single-line format
- [ ] Verify in-progress items show full pipeline flow + table
- [ ] Verify next command routing is correct
- [ ] Verify diamond states in Brand Mark match actual state

### Screen 4 (start.md)

- [ ] Run `/gsp:start` with no `.design/` -- verify fresh start greeting
- [ ] Run with existing brands -- verify pipeline flow display
- [ ] Run with codebase -- verify Summary Box alignment (all lines same width)
- [ ] Verify AskUserQuestion options match each state

### Screen 5 (phase transitions)

- [ ] Complete any phase -- verify completion line with diamond + message
- [ ] Verify file tree lists actual written files with box-drawing chars
- [ ] Verify plain divider renders
- [ ] Verify AskUserQuestion offers correct 3 options for that phase
- [ ] Re-run a completed phase -- verify "partial output found" prompt
- [ ] Verify critique shows critical issues state when applicable
