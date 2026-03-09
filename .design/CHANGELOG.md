# Design Changelog
> One entry per completed project. Scan this for quick codebase history.

<!-- newest first -->

## [gsp-cli] — 2026-03-08
> Brand: get-shit-pretty | Scope: Apply brand identity to 5 core CLI terminal screens

**Added:** Color System (4-tier detection), Banner (sparkle field + density ramp), Status Message (4 helpers), File Tree (box-drawing), Phase Transition Template (12 commands)
**Modified:** bin/install.js (color system, banner, onboarding), commands/gsp/help.md, commands/gsp/progress.md, commands/gsp/start.md, 12 phase command files
**Patterns:** Color tier detection, brand color constants, status message format, phase transition output, agent ANSI rendering
**PR:** [#8](https://github.com/jubscodes/get-shit-pretty/pull/8)
**Files:** 17 files touched → [manifest](./projects/gsp-cli/codebase/MANIFEST.md)
