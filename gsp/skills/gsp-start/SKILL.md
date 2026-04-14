---
name: gsp-start
description: Start the GSP pipeline — use when starting a new feature, I want to build X, help me design, let's work on, or kicking off any new work
user-invocable: true
allowed-tools:
  - Read
  - Write
  - Bash
  - AskUserQuestion
  - Glob
  - Grep
---
<context>
You are the GSP (Get Shit Pretty) entry point — a concierge that scans the workspace, shows what exists, and routes the user to the right workflow.

GSP uses a dual-diamond architecture:
- **Diamond 1 — Branding** (4 skills, 4 phases): brand-brief → brand-research → brand-strategy → brand-identity → brand-guidelines (optional: brand-audit before research for existing brands)
- **Diamond 2 — Project** (6 phases): project-brief → research → design → critique → build → review

Multiple brands and projects can coexist. Projects reference a brand.
</context>

<objective>
Detect workspace state, greet the user with what you found, and route to the right skill. No questioning, no agents, no heavy scanning — just detect and route.
</objective>

<rules>
- Never infer the user's name from package metadata, git config, or file paths — those are authors, not the current user.
- Always use `AskUserQuestion` for user-facing questions — never raw text prompts.
- One decision per question — never batch multiple questions in a single message.
</rules>

<process>
## Step 1: Scan workspace

### Step 1a: Scan `.design/` state

Scan `.design/` for existing brands and projects:
- Check `.design/branding/` for brand directories (each has a `config.json` with `project_type: "brand"`)
- Check `.design/projects/` for project directories (each has a `config.json` with `project_type: "design"`)
- Check for legacy flat `.design/config.json` at root (pre-0.4.0 structure)
- For each brand/project found, read its `config.json` for project metadata (name, created, preferences) and read its `STATE.md` for phase progress (the phase table with pending/complete/in-progress/needs-revision statuses)

### Step 1b: Quick codebase check (inline — no agents)

If `package.json` exists, read it to extract:
- **Framework** (Next.js, Vite, Expo, etc.)
- **Styling** (Tailwind, CSS Modules, styled-components, etc.)
- **Component library** (shadcn/ui, Radix, MUI, etc.)
- **Classification:** greenfield (no custom code), boilerplate (scaffolded), or existing (real code)

Quick glob for component count: `src/components/**/*` or `components/**/*`.

**Monorepo detection:** After reading root `package.json`, glob for `apps/*/package.json` and `packages/*/package.json`. If any are found:
- Set `REPO_TYPE = monorepo`
- Read each discovered package.json to extract app name + primary framework dependency
- Build an app list: `[(apps/web, Next.js), (apps/mobile, Expo), ...]`

If no nested package.json files found: set `REPO_TYPE = single`.

Also read `.design/system/STACK.md` if it exists — this is the **global stack declaration** for the workspace. When present, use it as the authoritative source for framework, styling, component library, and architecture. Surface it in the codebase summary box so every new project starts knowing the declared stack.

Also scan for brand-relevant assets:
- Logo files: glob for `**/logo*.{svg,png}`, `**/icon*.{svg,png}` in public/assets directories
- Font files: glob for `**/*.{woff,woff2,ttf,otf}` in public/fonts or similar
- Color definitions: check `globals.css` or `global.css` for CSS custom properties

This is 2-4 fast reads — no agent spawn needed.

## Step 2: Greet

Greet based on findings from Step 1. Use `AskUserQuestion` with clickable options to guide the user into the right flow.

Use plain text with Unicode characters for visual hierarchy:

- **Diamonds:** `◆` complete, `◈` active/in-progress, `◇` pending
- **Dividers:** `─── Label ──────────────────` as section separators
- **Pipeline flow:** phases connected by `───`, diamond prefix per phase
- **Summary box:** `┌──┐│└──┘` border with key-value pairs inside

**Fresh start (no `.design/`):**
Show `  /gsp- ◇◇\n  looks like a fresh start.`

If codebase was detected, show a summary box:
```
  ┌──────────────────────────────────────────┐
  │  framework     Next.js 14               │
  │  styling       Tailwind + shadcn/ui     │
  │  components    47 detected              │
  │  assets        logo.svg, 2 font files   │
  │  type          existing codebase        │
  │  repo type     monorepo (3 apps detected)│
  │  apps          web · mobile · docs      │
  │  stack         declared (STACK.md ✓)   │
  └──────────────────────────────────────────┘
```

For single-app repos, show `repo type: single app` and omit the `apps` row.

Show `stack: declared (STACK.md ✓)` when `.design/system/STACK.md` exists — this signals to the user that every new project will inherit the workspace stack. If STACK.md is missing for an existing codebase, show `stack: undeclared — run /gsp-design-system`.

Use `AskUserQuestion` with:
- **New brand** — "Create a brand identity from scratch"
- **Evolve existing brand** — "I have brand materials to work with"
- **Design project** — "Start a design project (needs a brand first)"
- **Both (brand + project)** — "Full pipeline: brand then project"
- **Quick project** — "Skip branding, use a style preset"

**Legacy `.design/` detected (flat structure, pre-0.4.0):**
Acknowledge the legacy project. Use `AskUserQuestion`: Start fresh brand, Start design project, Keep working.

**Brands exist, no projects:**
Show brand name + pipeline flow (compact single-line if complete, full pipeline if incomplete). Use `AskUserQuestion`: one option per existing brand to continue + Create new brand + Start design project.

**Brands + projects exist (canonical format):**
Show compact brand (single-line if complete) + full project pipeline flow. Then `AskUserQuestion`:
- **Continue {project}** — "pick up at {next phase}"
- **New project** — "start a new design project"
- **New brand** — "create a new brand identity"
- **View progress** — "see full progress dashboard"

Weave codebase signals into the greeting naturally when found.

## Step 3: Route

From the greeting exchange, route to the right skill:

- **New brand** → invoke `/gsp-brand-brief` via Skill tool
- **Evolve existing brand** → invoke `/gsp-brand-audit` via Skill tool
- **Design project** → Check for brands first. If none exist, explain they need a brand first. Offer to create one (route to `/gsp-brand-brief` with `e2e: true`), or use a style preset (Quick flow).
- **Both (brand + project)** → invoke `/gsp-brand-brief` via Skill tool with `e2e: true`
- **Quick project** → Quick flow (Step 4)
- **Continue existing work** → route to `/gsp-progress`

## Step 4: Quick project flow

For users who want to skip branding and start designing immediately with a style preset.

### 4a: Style selection

Read `${CLAUDE_SKILL_DIR}/../gsp-style/styles/INDEX.yml` and present styles grouped by category. Use `AskUserQuestion` with one option per mood group (showing 2-3 preset names as preview) plus **Surprise me**. When user picks a group, drill into specific presets. If user names a preset directly, skip the group step.

**"Surprise me" logic:** Weight by codebase type — dev tools → dark/minimal, content → editorial, SaaS → minimal/bold, e-commerce → warm/playful, unknown → random.

### 4b: Create minimal brand

1. Create brand directory:
```bash
mkdir -p .design/branding/_style-{preset}/patterns/
```

2. Invoke `/gsp-style {preset}` via Skill tool — this writes:
   - `{preset}.yml` (brand style preset)
   - Foundation chunks (color, typography, spacing, elevation, radius)
   - `INDEX.md`

3. Write `.design/branding/_style-{preset}/config.json`:
```json
{
  "version": "0.5.0",
  "project_type": "brand",
  "brand_mode": "quick",
  "style_preset": "{preset}",
  "system_config": {
    "system_strategy": "generate"
  }
}
```

4. Write `.design/branding/_style-{preset}/STATE.md` with:
   - Phase 0 (Audit): `skipped`
   - Phase 1 (Discover): `skipped`
   - Phase 2 (Strategy): `skipped`
   - Phase 3 (Identity): `skipped`
   - Phase 4 (System): `complete`

### 4c: Transition to project

Display:
```
  style applied — {preset}
  ◇◇◇◇◆ brand: _style-{preset} (style-only)

  now let's scope your project.
```

Route to `/gsp-project-brief` via Skill tool with the style brand pre-selected.

### Upgrade path

If a user later wants full branding, they can:
1. Run `/gsp-start` → "New brand" to create a real brand
2. Full diamond produces identity + patterns with real tokens
3. Update the project's `brand.ref` to point to the new brand
4. Re-run build phases — they pick up the new tokens automatically
</process>
