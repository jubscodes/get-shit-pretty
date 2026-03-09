# Scope

> Phase: brief | Project: gsp-cli | Generated: 2026-03-08

---

## Target Screens

5 core screens, ordered by user journey frequency.

### Screen 1: Onboarding Splash

**Trigger:** `npx get-shit-pretty` (first install)
**File:** `bin/install.js`
**Components:** Banner (install splash), Brand Mark (◇◇), Status Message (progress), Tree (installed files)

Current state: Has a paint-splatter ASCII art splash with raw ANSI codes. Functional but not using brand tokens or components.

**Design goal:** Replace inline art with Banner component spec. Use token-sourced colors. Show installation progress as Status Messages. End with Tree of installed files.

### Screen 2: Help Reference

**Trigger:** `/gsp:help`
**File:** `commands/gsp/help.md` (outputs a preformatted block)
**Components:** Brand Mark, Divider (labeled), Key-Value, Tree (directory structure)

Current state: Plain monospace text block with emoji section headers and manual formatting. Not using brand tokens.

**Design goal:** Apply heading hierarchy (H1 bold+accent, H2 bold), use Dividers between sections, Key-Value for command listings, Tree for directory structure. Brand Mark at top.

### Screen 3: Progress Dashboard

**Trigger:** `/gsp:progress`
**File:** `commands/gsp/progress.md` (instructions for the agent to render)
**Components:** Brand Mark, Pipeline Flow (dual), Progress Bar, Table (status-annotated), Divider (labeled), Key-Value

Current state: Emoji-based progress display (✅/⬜) with progress bars. Structured but not using brand components.

**Design goal:** Replace emoji with diamond state symbols (◆/◈/◇). Use Pipeline Flow for at-a-glance view. Progress Bar with brand tokens. Status-annotated Tables for phase details. Labeled Dividers between brands and projects.

### Screen 4: Start Greeting

**Trigger:** `/gsp:start`
**File:** `commands/gsp/start.md` (instructions for the agent to render)
**Components:** Brand Mark, Pipeline Flow, Status Message, Summary Box

Current state: Heading with emoji, then AskUserQuestion for routing. Functional but not branded.

**Design goal:** Brand Mark as hero. Show existing brands/projects with Pipeline Flow (compact). Use Summary Box for detected codebase info. Keep AskUserQuestion for interactive routing.

### Screen 5: Phase Transitions

**Trigger:** End of any phase command (brand-research, brand-strategy, project-brief, etc.)
**Files:** All 12 phase commands in `commands/gsp/`
**Components:** Phase Block (completed), Status Message (success), Tree (written files), Divider

Current state: Phase commands include text routing ("Run /gsp:next-command") but no structured transition output.

**Design goal:** Each phase completion renders a Phase Block with file tree. Clear routing message with next command in bold+accent.

---

## Component Usage Matrix

| Component | Screen 1 | Screen 2 | Screen 3 | Screen 4 | Screen 5 |
|-----------|----------|----------|----------|----------|----------|
| Banner | ✓ | | | | |
| Brand Mark | ✓ | ✓ | ✓ | ✓ | |
| Pipeline Flow | | | ✓ | ✓ | |
| Phase Block | | | | | ✓ |
| Progress Bar | | | ✓ | | |
| Status Message | ✓ | | | ✓ | ✓ |
| Tree | ✓ | ✓ | | | ✓ |
| Summary Box | | | | ✓ | |
| Divider | | ✓ | ✓ | | ✓ |
| Key-Value | | ✓ | ✓ | | |
| Table | | | ✓ | | |

**11 of 15 brand components** used across 5 screens.

Unused: Error Block, Prompt, Spinner, Statusline (these are already implemented or used in non-core flows).

---

## Out of Scope

- Error states and error block rendering (future project)
- Doctor output formatting (future project)
- Interactive prompt styling (handled by AskUserQuestion tool)
- Statusline hook (already implemented in `scripts/gsp-statusline.js`)
- Spinner implementation (runtime behavior, not static screen design)
