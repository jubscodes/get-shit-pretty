---
name: gsp:system
description: Build design system foundations — color, type, spacing, components, tokens
allowed-tools:
  - Read
  - Write
  - Bash
  - Task
---
<context>
Phase 1 of the GSP project diamond. Uses the Design System Architect prompt to build a complete design system with foundations, components, and tokens. Adapts strategy based on codebase context — generates from scratch, extends an existing system, or redesigns with migration mapping.

Works with the dual-diamond architecture: reads brand identity from `.design/branding/{brand}/` via `brand.ref`, writes output to `.design/projects/{project}/system/`.
</context>

<objective>
Build a complete design system from the brand identity.

**Input:** Brand identity (via brand.ref) + project BRIEF.md
**Output:** `{project}/system/SYSTEM.md` + `{project}/system/tokens.json` + exports
**Agent:** `gsp-system-architect`
</objective>

<execution_context>
@/Users/jubs/.claude/get-shit-pretty/prompts/01-design-system-architect.md
@/Users/jubs/.claude/get-shit-pretty/templates/phases/system.md
@/Users/jubs/.claude/get-shit-pretty/references/design-tokens.md
</execution_context>

<process>
## Step 0: Resolve project and brand

Scan `.design/projects/` for project directories. If only one project exists, use it. If multiple, ask the user which project to work on.

Set `PROJECT_PATH` = `.design/projects/{project}`

Read `{PROJECT_PATH}/brand.ref` to resolve brand path:
- Extract `brand` name and `path` from brand.ref
- Set `BRAND_PATH` = `.design/branding/{brand}`

If brand.ref doesn't exist, tell the user to run `/gsp:new` to set up the project with a brand reference.

## Step 1: Load context

Read:
- `{BRAND_PATH}/identity/IDENTITY.md` — brand colors, type, personality
- `{BRAND_PATH}/identity/palettes.json` — tints.dev generated color palettes (11-stop OKLCH scales)
- `{PROJECT_PATH}/BRIEF.md` — platforms, tech stack, constraints
- `{PROJECT_PATH}/config.json` — get `system_strategy`, `design_scope`, `implementation_target`, `codebase_type`
- `{PROJECT_PATH}/codebase/INVENTORY.md` — existing tokens, components, architecture (if exists)

If IDENTITY.md doesn't exist, check if identity phase is complete in brand STATE.md. If not, tell the user to complete the brand identity first (run `/gsp:identity`).

If palettes.json exists, use its OKLCH values as the foundation for the color system tokens.

Also read brand strategy if available:
- `{BRAND_PATH}/strategy/STRATEGY.md` — for archetype, positioning context
- `{BRAND_PATH}/verbal/VERBAL.md` — for voice/tone context

## Step 1.5: Determine system strategy

Read `system_strategy` from config.json (defaults to `generate` if missing).

Three strategies:

**GENERATE** (when `system_strategy` is `generate` or missing):
Full system from scratch. For `boilerplate` codebases, respect existing config structure (extend tailwind.config, not replace) and output tokens in the format the existing config uses (Tailwind extend, CSS custom properties, etc).

**EXTEND** (when `system_strategy` is `extend`):
Evolve the existing system rather than replacing it.
1. Audit existing tokens against the brand identity — keep what works, adjust what doesn't, fill gaps
2. Classify each existing component: KEEP / RESTYLE / REFACTOR / REPLACE
3. Design only net-new components not covered by existing ones
4. Output delta tokens — only new and changed values
5. Preserve existing naming conventions from INVENTORY.md

**REFACTOR** (when `system_strategy` is `refactor`):
Redesign the system from the ground up, informed by what exists.
1. Read and understand existing tokens, components, patterns from INVENTORY.md
2. Design a complete new system — same scope as GENERATE
3. Produce a migration mapping for every change
4. Preserve conventions unless the brand requires changes
5. Flag breaking changes explicitly

**When `design_scope` is `tokens` (any strategy):**
- Skip component design entirely
- Produce foundations + tokens.json only
- Add component-token mapping

## Step 2: Spawn system architect

Spawn the `gsp-system-architect` agent with:
- The IDENTITY.md and BRIEF.md content
- The Design System Architect prompt (01)
- The system output template
- The design tokens reference
- The `system_strategy` and `design_scope` values
- The INVENTORY.md content (when exists)

The agent should deliver:
1. Color system (primary, semantic, dark mode, contrast ratios, usage)
2. Typography scale (9 levels, responsive, accessible)
3. Grid system (12-column)
4. Spacing system (8px base)
5. Elevation / shadow scale
6. Border radius tokens
7. Motion system
8. Components (30+ for generate/refactor, audit for extend, mapping for tokens)
9. Design patterns
10. Design tokens as JSON (`tokens.json`)
11. Design principles and do's/don'ts

## Step 3: Write output

1. Write system to `{PROJECT_PATH}/system/SYSTEM.md`
2. Write tokens to `{PROJECT_PATH}/system/tokens.json`

## Step 3.5: Generate chunked exports

1. Create `{PROJECT_PATH}/system/exports/foundations/` with one file per foundation
2. Create `{PROJECT_PATH}/system/exports/components/` with one file per component
3. Create `{PROJECT_PATH}/system/exports/principles.md`
4. Copy `templates/exports-index.md` to `{PROJECT_PATH}/exports/INDEX.md` (if doesn't exist)
5. Update `{PROJECT_PATH}/exports/INDEX.md` — populate `<!-- BEGIN:system -->` … `<!-- END:system -->`

## Step 4: Update state

Update `{PROJECT_PATH}/STATE.md`:
- Set Phase 1 (System) status to `complete`
- Record completion date

## Step 5: Route next

Display system summary and end with:
"Run `/gsp:design` to create UI/UX screens using this system."
</process>
