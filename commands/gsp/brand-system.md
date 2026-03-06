---
name: gsp:brand-system
description: Build design system — foundations, components, tokens (brand-level)
allowed-tools:
  - Read
  - Write
  - Bash
  - Task
  - Grep
  - Glob
---
<context>
Phase 5 of the GSP branding diamond. Uses the Design System Architect prompt to build a complete design system with foundations, components, and tokens. The system is created once per brand and reused across all projects.

Adapts strategy based on codebase context — generates from scratch, extends an existing system, or redesigns with migration mapping.

Works with the dual-diamond architecture: reads brand identity from `.design/branding/{brand}/`, writes output to `.design/branding/{brand}/system/`.
</context>

<objective>
Build a complete design system for the brand.

**Input:** Brand identity + strategy + verbal + BRIEF.md
**Output:** `{brand}/system/` (foundations/, components/, principles.md, tokens.json, INDEX.md)
**Agent:** `gsp-system-architect`
</objective>

<execution_context>
@/Users/jubs/.claude/get-shit-pretty/prompts/01-design-system-architect.md
@/Users/jubs/.claude/get-shit-pretty/templates/phases/system.md
@/Users/jubs/.claude/get-shit-pretty/references/design-tokens.md
</execution_context>

<process>
## Step 0: Resolve brand

Scan `.design/branding/` for brand directories. If only one brand exists, use it. If multiple, ask the user which brand to work on.

Set `BRAND_PATH` = `.design/branding/{brand}`

If BRAND_PATH doesn't exist, tell the user to run `/gsp:new` first.

## Step 1: Load context

### Identity (chunk-first)

Read `{BRAND_PATH}/identity/INDEX.md`. If it exists, load all identity chunks + `palettes.json`.

Fallback: read `{BRAND_PATH}/identity/IDENTITY.md` (legacy monolith) + `palettes.json`. Log: "⚠️ Legacy identity format detected — consider re-running /gsp:brand-identity for chunk output."

If neither exists, check if identity phase is complete in brand STATE.md. If not, tell the user to complete the brand identity first (run `/gsp:brand-identity`).

### Strategy + Verbal (selective, chunk-first)

Read `{BRAND_PATH}/strategy/INDEX.md`. If it exists, load selective chunks.
Fallback: read `{BRAND_PATH}/strategy/STRATEGY.md`.

Read `{BRAND_PATH}/verbal/INDEX.md`. If it exists, load selective chunks.
Fallback: read `{BRAND_PATH}/verbal/VERBAL.md`.

### Brand context

Read:
- `{BRAND_PATH}/BRIEF.md` — company, audience, goals
- `{BRAND_PATH}/config.json` — get `system_config.system_strategy`, `system_config.tech_stack`

## Step 1.5: Codebase awareness

Ask the user:
1. "Will this brand target a specific tech stack?" (React + Tailwind, React Native + NativeWind, vanilla CSS, etc.)
   - Store answer in `{BRAND_PATH}/config.json` → `system_config.tech_stack`
2. "Is there an existing design system to incorporate?"
   - If yes: scan codebase for INVENTORY (existing tokens, components, architecture)
   - Store strategy in `{BRAND_PATH}/config.json` → `system_config.system_strategy`

## Step 2: Determine system strategy

Read `system_config.system_strategy` from config.json (defaults to `generate` if missing).

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

## Step 3: Spawn system architect

Spawn the `gsp-system-architect` agent with:
- All identity chunks (or IDENTITY.md fallback) + palettes.json
- The BRIEF.md content
- The Design System Architect prompt (01)
- The system output template
- The design tokens reference
- The `system_strategy` and `tech_stack` values
- The INVENTORY.md content (when exists)
- **Output path:** `{BRAND_PATH}/system/`

The agent writes chunks directly:
- `system/foundations/` (6 foundation chunks)
- `system/components/` (one per component)
- `system/principles.md`
- `system/tokens.json`
- `system/INDEX.md`

## Step 4: Update state

Update `{BRAND_PATH}/STATE.md`:
- Set Phase 5 (System) status to `complete`
- Record completion date
- Set Prettiness Level to 100%

## Step 5: Route next

Display system summary and end with:
"Brand complete! All 5 branding phases done. Run `/gsp:new` to create a design project using this brand."
</process>
</output>
