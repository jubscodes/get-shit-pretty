# Components
> Design System Analysis | Generated: 2026-03-18

## UI Kit Detection

**UI Kit:** None (terminal-native)
**Source:** No frontend framework in `package.json` — this is a Node.js CLI tool that outputs to the terminal via ANSI escape codes and Unicode characters.

## Existing Components

This codebase has no UI components in the traditional sense (no React, Vue, or HTML). Instead, it has **terminal output components** defined as ANSI-formatted patterns in scripts and as specification documents in the brand system.

### Runtime Scripts (executable)

| Component | Path | Purpose | Reusable? | Notes |
|-----------|------|---------|-----------|-------|
| Statusline | `scripts/gsp-statusline.js` | Status bar showing model, phase, prettiness, context usage, update availability | Yes | Reads `.design/STATE.md`, session todos, npm registry |
| Statusline Dispatcher | `scripts/statusline-dispatcher.js` | Routes to GSP or GSD statusline based on project type | Yes | Checks for `.design/STATE.md` presence |
| Lint Check | `scripts/lint-check.sh` | Post-tool-use hook — runs ESLint on modified frontend files | Yes | Non-blocking, graceful fallback |
| Installer Banner | `bin/install.js` (lines 150-180) | Sparkle-field density ramp banner with random taglines | No | Inline in installer |
| Color Tier System | `bin/install.js` (lines 10-74) | Truecolor/256/16/none detection and palette objects | Partially | Duplicated in `scripts/gsp-statusline.js` |

### Brand System Components (specification docs)

Located at `.design/branding/get-shit-pretty/system/components/`:

| Component | Path | Purpose |
|-----------|------|---------|
| Banner | `system/components/banner.md` | Branded header with sparkle field |
| Brand Mark | `system/components/brand-mark.md` | `/gsp:` accent mark |
| Divider | `system/components/divider.md` | Section separators |
| Error Block | `system/components/error-block.md` | Error display pattern |
| Key-Value | `system/components/key-value.md` | Label-value pairs |
| Phase Block | `system/components/phase-block.md` | Pipeline phase display |
| Pipeline Flow | `system/components/pipeline-flow.md` | Multi-phase progress visualization |
| Progress Bar | `system/components/progress-bar.md` | Block-element progress meter |
| Prompt | `system/components/prompt.md` | User interaction prompts |
| Spinner | `system/components/spinner.md` | Activity indicator |
| Status Message | `system/components/status-message.md` | Success/warning/error messages |
| Statusline | `system/components/statusline.md` | Statusline specification |
| Summary Box | `system/components/summary-box.md` | Box-drawn result summaries |
| Table | `system/components/table.md` | Tabular output |
| Tree | `system/components/tree.md` | Directory tree display |

## Where to Add

| Type | Location | Pattern |
|------|----------|---------|
| Runtime script | `scripts/` | `kebab-case.js` or `kebab-case.sh`, CommonJS, `#!/usr/bin/env node` shebang |
| Skill | `gsp/skills/gsp-{name}/SKILL.md` | Markdown with YAML frontmatter, single file per skill |
| Agent | `gsp/agents/gsp-{name}.md` | Markdown agent definition |
| Prompt | `gsp/prompts/{NN}-{name}.md` | Zero-padded numbered prefix |
| Template | `gsp/templates/{category}/` | Category directories (projects, branding, system) |
| Reference | `gsp/references/{name}.md` | Kebab-case markdown |
| Dev tool | `dev/skills/gsp-{name}/SKILL.md` or `dev/scripts/` | Never installed to runtimes |
| Test | `dev/tests/` | `{name}.test.js` (Node.js) or bash in `dev/scripts/` |
