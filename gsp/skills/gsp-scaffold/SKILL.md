---
name: scaffold
description: Deterministic stack setup — install deps, create configs, verify build compiles
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
1. **Standalone** — user runs `/gsp:scaffold` directly to set up a project's stack
2. **As a building block** — `/gsp:project-build` invokes this as Phase 1 before spawning builder agents
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

If `implementation_target` is `figma` or `skip`, log "⚠️ No scaffold needed for target: {target}" and exit.

## Step 2: Read stack state

Read `.design/system/STACK.md` if it exists — check what's already set up.

If STACK.md indicates the stack is already initialized (has framework, CSS, component library entries), log existing state and skip to Step 4 (component installs).

## Step 3: Initialize stack

Based on `tech_stack` and `implementation_target`, run the appropriate setup:

### Next.js + shadcn (greenfield)

```bash
# Only if no next.config exists yet
npx create-next-app@latest . --typescript --tailwind --eslint --app --src-dir --import-alias "@/*" --yes

# Initialize shadcn
npx shadcn@latest init -d
```

### Next.js + shadcn (existing)

```bash
# Only init shadcn if components.json doesn't exist
npx shadcn@latest init -d
```

### Vite + React

```bash
# Only if no vite.config exists
npm create vite@latest . -- --template react-ts
npm install
npm install -D tailwindcss @tailwindcss/vite
```

### React Native + NativeWind

```bash
# Install NativeWind deps
npm install nativewind tailwindcss
npx @react-native-reusables/cli init
```

**Important:** Always check if config files already exist before overwriting. Only create what's missing.

### PostCSS config

If using Tailwind and no `postcss.config.mjs` exists, create it:

```javascript
/** @type {import('postcss-load-config').Config} */
const config = {
  plugins: {
    "@tailwindcss/postcss": {},
  },
};
export default config;
```

**Note:** Check what version of Tailwind was installed. Tailwind v4 uses `@tailwindcss/postcss` plugin. Tailwind v3 uses `tailwindcss` and `autoprefixer`. Read the installed `tailwindcss/package.json` to determine the version and configure accordingly.

## Step 4: Install components from manifest

Read `{PROJECT_PATH}/brief/install-manifest.md` if it exists.

Parse the manifest for:
1. **Component install commands** — `npx shadcn@latest add ...` or `npx @react-native-reusables/cli add ...`
2. **Additional dependencies** — `npm install ...` commands

Run each command. If a command fails, log the failure but continue with remaining installs.

**Use the all-in-one command** if the manifest provides one (e.g., `npx shadcn@latest add comp1 comp2 comp3`).

## Step 5: Verify build

Determine the build command from the stack:

| Stack | Build command |
|-------|--------------|
| Next.js | `npx next build` |
| Vite | `npx vite build` |
| TypeScript only | `npx tsc --noEmit` |
| Generic | `npm run build` |

Run the build command. Capture output.

- **Success:** Log "Build compiles cleanly"
- **Failure:** Log the error output. Attempt to fix common issues:
  - Missing PostCSS config → create it
  - Missing tsconfig paths → fix them
  - Import errors from shadcn init → resolve
  - After fix attempt, re-run build once
- **Second failure:** Log the error and stop. Do not loop.

## Step 6: Write scaffold log

Write `{PROJECT_PATH}/build/SCAFFOLD-LOG.md`:

```markdown
# Scaffold Log

> Phase: build (scaffold) | Project: {name} | Generated: {DATE}

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
