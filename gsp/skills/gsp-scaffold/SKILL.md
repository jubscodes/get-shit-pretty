---
name: gsp-scaffold
description: Set up the tech stack — install deps, configs, verify build — use when: set up the stack, install shadcn, init the project, scaffold, set up Tailwind
user-invocable: true
allowed-tools:
  - Read
  - Write
  - Bash
  - Glob
  - Grep
---
<context>
Composable stack setup skill. No agent — all inline Bash commands. Deterministic.

Reads project config and stack state, installs dependencies, creates config files, installs component library primitives, and verifies the build compiles. Produces `SCAFFOLD-LOG.md`.

Works two ways:
1. **Standalone** — user runs `/gsp-scaffold` directly to set up a project's stack
2. **As a building block** — `/gsp-project-build` invokes this as Phase 1 before spawning builder agents
</context>

<objective>
Set up the project's tech stack so it compiles cleanly before any design code is written.

**Input:** config.json, STACK.md, install-manifest.md
**Output:** Working dev environment + `{PROJECT_PATH}/build/SCAFFOLD-LOG.md`
**Agent:** None — all commands run inline
</objective>

<process>
## Step 0: Resolve project

Scan `.design/projects/` for project directories. If only one project exists, use it. If multiple, ask the user which project to work on.

Set `PROJECT_PATH` = `.design/projects/{project}`

## Step 1: Read config

Read `{PROJECT_PATH}/config.json` to get:
- `preferences.implementation_target` (shadcn, rn-reusables, existing, code)
- `preferences.tech_stack` (Next.js + Tailwind + shadcn/ui, etc.)
- `preferences.codebase_type` (greenfield, existing)
- `preferences.app_path` (relative path from repo root to the target app, e.g. `apps/web`)
- `preferences.repo_type` (`single` or `monorepo`)

Set `APP_PATH` = value of `app_path`. If empty, default to `.` (repo root).
Derive `APP_NAME` = last segment of `APP_PATH` (e.g. `apps/web` → `web`, `.` → `root`).

If `implementation_target` is `figma` or `skip`, log "⚠️ No scaffold needed for target: {target}" and exit.

## Step 2: Read stack state + compliance gate

Read `.design/system/stacks/{APP_NAME}.md` if it exists — this is the per-app stack file for monorepos. Fall back to `.design/system/STACK.md` for legacy single-app setups (or when `APP_NAME` is `root` and the legacy file exists).

### If stack file exists (existing or returning project)

This workspace has a declared stack for this app. Enforce compliance before touching anything.

1. **Read the live stack** from `components.json` (if present) and `package.json` inside `APP_PATH`:
   - `cd {APP_PATH} && npx shadcn@latest info --json` (if shadcn target) → captures `aliases`, `tailwindVersion`, `style`, `base`, `iconLibrary`
   - `cd {APP_PATH} && node -e "console.log(require('tailwindcss/package.json').version)"` → actual Tailwind version

2. **Compare against STACK.md** — flag any of these divergences:

   | What to check | STACK.md field | Live source |
   |---|---|---|
   | Framework | `## Tech Stack → Framework` | `package.json` dependencies |
   | Tailwind version | `## Tech Stack → Styling` | Installed `tailwindcss` version |
   | shadcn alias | `## Key Paths → Components` | `shadcn info` → `aliases.components` |
   | shadcn style | (if recorded) | `shadcn info` → `style` |
   | Icon library | (if recorded) | `shadcn info` → `iconLibrary` |

3. **Gate on divergence:**
   - If any divergence found, surface it clearly:
     ```
     ⚠️  Stack compliance — divergence detected

       STACK.md declares:   aliases.components = @/components/ui
       Live codebase has:   aliases.components = ~/components/ui

       Proceeding will write files to the wrong paths.
     ```
   - Use `AskUserQuestion`: "Stack divergence detected. Proceed anyway (may break imports), or stop to fix STACK.md first?"
   - **Stop** → exit; user fixes `STACK.md` and re-runs
   - **Proceed anyway** → log divergence in scaffold log, continue with live values (not STACK.md)

4. If the stack file indicates the stack is already initialized (has framework, CSS, component library entries) **and no divergence found**, log existing state and skip to Step 4 (component installs).

## Step 3: Initialize stack

Based on `tech_stack` and `implementation_target`, load the matching sibling and follow its setup commands. All shell commands run in `APP_PATH` (`cd {APP_PATH} && ...`). Check before overwriting — only create what's missing.

| Detected stack | Load |
|----------------|------|
| Next.js + shadcn (`codebase_type: greenfield` or `existing`) | `${CLAUDE_SKILL_DIR}/stacks/nextjs-shadcn.md` (covers both modes) |
| Vite + React | `${CLAUDE_SKILL_DIR}/stacks/vite-react.md` |
| React Native + NativeWind | `${CLAUDE_SKILL_DIR}/stacks/react-native.md` |
| Any web stack using Tailwind | also load `${CLAUDE_SKILL_DIR}/postcss-and-tailwind.md` for PostCSS config + Tailwind v4 source scoping (shared) |

Read the relevant sibling(s) at this step (not before) — they're scoped to the detected stack and stay out of context when not needed.

## Step 3.9: Install configured icon library

Read `preferences.icon_library` from project config (defaults to `lucide`).

| Library | Action |
|---------|--------|
| `lucide` | No install — ships with shadcn (`lucide-react`) |
| `phosphor` | `cd {APP_PATH} && {pkg-manager} add @phosphor-icons/react` |
| `heroicons` | `cd {APP_PATH} && {pkg-manager} add @heroicons/react` |
| `tabler` | `cd {APP_PATH} && {pkg-manager} add @tabler/icons-react` |

If `shadcn info` already reports a different `iconLibrary` than the project config, log the divergence and use the project config's value (project config is the source of truth). Skip if `app_path` is empty (no codebase to install into).

## Step 4: Install components from manifest

Read `{PROJECT_PATH}/brief/install-manifest.md` if it exists.

Parse the manifest for:
1. **Component install commands** — `npx shadcn@latest add ...` or `npx @react-native-reusables/cli add ...`
2. **Additional dependencies** — `npm install ...` commands

**Use the all-in-one command** if the manifest provides one (e.g., `npx shadcn@latest add comp1 comp2 comp3`).

**If a batch install fails** (e.g., one component doesn't exist in the registry), retry without the failing component(s):
1. Parse the error to identify which component(s) failed
2. Remove those from the list
3. Re-run with the remaining components
4. Log each failed component with the reason (e.g., "not in registry")

Common registry gaps:
- `visually-hidden` — removed from some shadcn styles/registries. Implement as a simple utility during foundations phase instead.

Run additional dependency installs (`npm install ...`) separately from component installs. If a dependency fails, log it but continue.

## Step 5: Verify build

Clear any build cache first (`cd {APP_PATH} && rm -rf .next` for Next.js), then run the build command in `APP_PATH`:

| Stack | Build command |
|-------|--------------|
| Next.js | `cd {APP_PATH} && npx next build` |
| Vite | `cd {APP_PATH} && npx vite build` |
| TypeScript only | `cd {APP_PATH} && npx tsc --noEmit` |
| Generic | `cd {APP_PATH} && npm run build` |

- **Success:** Log "Build compiles cleanly"
- **Failure:** Log the error output. Attempt to fix common issues:
  - `Module not found: Can't resolve '...'` with CSS class names in error → Tailwind v4 source scoping issue. Add `source("../")` to the `@import "tailwindcss"` directive in globals.css
  - Missing PostCSS config → create it (see Step 3)
  - Missing tsconfig paths → fix them
  - `jsx` set to `preserve` instead of `react-jsx` → Next.js fixes this on first build, just re-run
  - Import errors from shadcn init → resolve missing deps
  - After fix attempt, clear cache and re-run build once
- **Second failure:** Log the error and stop. Do not loop.

## Step 5.5: Capture project context (shadcn targets)

If `implementation_target` is `shadcn`, run `cd {APP_PATH} && npx shadcn@latest info --json` and capture the output. This provides:
- `aliases` — the actual alias prefix for imports (`@/`, `~/`)
- `tailwindVersion` — `"v4"` (uses `@theme inline`) vs `"v3"` (uses `tailwind.config.js`)
- `tailwindCssFile` — the global CSS file where custom properties go
- `style` — component visual treatment (nova, vega, etc.)
- `base` — primitive library (radix or base)
- `iconLibrary` — determines icon imports (lucide-react, @tabler/icons-react, etc.)
- `resolvedPaths` — exact file-system destinations for components, utils, hooks
- `framework` — routing and file conventions (Next.js App Router, Vite SPA, etc.)
- `isRSC` — whether "use client" directives are needed

Include this JSON in the scaffold log under a `## Project Context` section so the foundations agent can reference it.

## Step 6: Write scaffold log

Write `{PROJECT_PATH}/build/SCAFFOLD-LOG.md`:

```markdown
# Scaffold Log

> Phase: build (scaffold) | Project: {name} | App: {APP_PATH} | Generated: {DATE}

## Stack

| Layer | Tool | Version |
|-------|------|---------|
| Framework | {e.g. Next.js} | {version} |
| CSS | {e.g. Tailwind CSS} | {version} |
| Components | {e.g. shadcn/ui} | {version} |

## Commands Run

| # | Command | Status |
|---|---------|--------|
| 1 | {command} | success / failed |
| ... | ... | ... |

## Components Installed

| Component | Source |
|-----------|--------|
| {name} | shadcn / rn-reusables / npm |
| ... | ... |

## Dependencies Added

{List of npm packages added}

## Build Verification

- **Command:** `{build command}`
- **Result:** {pass / fail}
- **Output:** {first/last lines if relevant}

## Project Context

{If shadcn target: JSON output from `npx shadcn@latest info --json`. Otherwise: "N/A — non-shadcn target"}

## Issues

{Any problems encountered and how they were resolved, or "None"}
```

## Step 7: Output

```
  ◆ scaffold complete — stack verified

    {PROJECT_PATH}/build/
    └── SCAFFOLD-LOG.md

    Stack: {tech_stack}
    Build: {pass/fail}
    Components: {count} installed

  ──────────────────────────────
```
</process>
