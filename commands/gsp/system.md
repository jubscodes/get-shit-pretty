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
Phase 3 of the GSP design pipeline. Uses the Design System Architect prompt to build a complete design system with foundations, components, and tokens. Adapts strategy based on codebase context — generates from scratch, extends an existing system, or redesigns with migration mapping.
</context>

<objective>
Build a complete design system from the brand identity.

**Input:** `.design/brand/IDENTITY.md`
**Output:** `.design/system/SYSTEM.md` + `.design/system/tokens.json` + `.design/system/exports/` + `.design/exports/INDEX.md`
**Agent:** `gsp-system-architect`
</objective>

<execution_context>
@/Users/jubs/.claude/get-shit-pretty/prompts/01-design-system-architect.md
@/Users/jubs/.claude/get-shit-pretty/templates/phases/system.md
@/Users/jubs/.claude/get-shit-pretty/references/design-tokens.md
</execution_context>

<process>
## Step 1: Load context

Read:
- `.design/brand/IDENTITY.md` — brand colors, type, personality
- `.design/brand/palettes.json` — tints.dev generated color palettes (11-stop OKLCH scales)
- `.design/BRIEF.md` — platforms, tech stack, constraints
- `.design/config.json` — get `system_strategy`, `design_scope`, `implementation_target`, `codebase_type`
- `.design/codebase/INVENTORY.md` — existing tokens, components, architecture (if exists)

If IDENTITY.md doesn't exist, tell the user to run `/gsp:brand` first.
If palettes.json exists, use its OKLCH values as the foundation for the color system tokens.

## Step 1.5: Determine system strategy

Read `system_strategy` from config.json (defaults to `generate` if missing).

Three strategies:

**GENERATE** (when `system_strategy` is `generate` or missing):
Full system from scratch. For `boilerplate` codebases, respect existing config structure (extend tailwind.config, not replace) and output tokens in the format the existing config uses (Tailwind extend, CSS custom properties, etc).

**EXTEND** (when `system_strategy` is `extend`):
Evolve the existing system rather than replacing it. The codebase already has tokens and components (from INVENTORY.md).
1. Audit existing tokens against the brand identity — keep what works, adjust what doesn't, fill gaps
2. Classify each existing component: KEEP (unchanged), RESTYLE (apply new tokens), REFACTOR (structural changes), REPLACE (redesign needed)
3. Design only net-new components not covered by existing ones
4. Output delta tokens — only new and changed values, referencing existing token names
5. Preserve existing naming conventions, file patterns, and architecture from INVENTORY.md

**REFACTOR** (when `system_strategy` is `refactor`):
Redesign the system from the ground up, informed by what exists. The codebase has an existing system (from INVENTORY.md) that needs a complete rethink.
1. Read and understand existing tokens, components, patterns from INVENTORY.md
2. Design a complete new system (foundations, 30+ components, tokens) — same scope as GENERATE
3. Produce a migration mapping for every change:
   - Old token → new token (or "removed — use X instead")
   - Old component → new component (or "replaced by X")
   - Files that need updating and what changes
4. Preserve conventions (naming, file org, import aliases) unless the brand requires changes
5. Flag breaking changes explicitly

**When `design_scope` is `tokens` (any strategy):**
- Skip component design entirely
- Produce foundations + tokens.json only
- Add component-token mapping: which existing components are affected by token changes and how

## Step 2: Spawn system architect

Spawn the `gsp-system-architect` agent with:
- The IDENTITY.md and BRIEF.md content
- The Design System Architect prompt (01)
- The system output template
- The design tokens reference
- The `system_strategy` value
- The `design_scope` value
- The INVENTORY.md content (when exists)

The agent should deliver:
1. Color system (primary, semantic, dark mode, contrast ratios, usage)
2. Typography scale (9 levels, responsive, accessible)
3. Grid system (12-column)
4. Spacing system (8px base)
5. Elevation / shadow scale
6. Border radius tokens
7. Components:
   - GENERATE: 30+ components (current behavior)
   - EXTEND: Component audit table (KEEP/RESTYLE/REFACTOR/REPLACE) + specs for refactored and new only
   - REFACTOR: 30+ components (redesigned) + migration mapping from old → new
   - tokens scope: Component-token mapping table only
8. Design patterns
9. Design tokens as JSON (`tokens.json`)
10. Design principles and do's/don'ts

## Step 3: Write output

1. Write system to `.design/system/SYSTEM.md`
2. Write tokens to `.design/system/tokens.json`

## Step 3.5: Generate chunked exports

After writing SYSTEM.md and tokens.json, the agent generates agent-consumable chunks:

1. Create `.design/system/exports/foundations/` with one file per foundation:
   - `color-system.md`, `typography.md`, `spacing.md`, `grid.md`, `elevation.md`, `border-radius.md`
2. Create `.design/system/exports/components/` with one file per component:
   - Singular kebab-case naming: "Buttons" → `button.md`, "Date Picker" → `date-picker.md`
3. Create `.design/system/exports/principles.md`
4. Copy `templates/exports-index.md` to `.design/exports/INDEX.md` (if it doesn't already exist)
5. Update `.design/exports/INDEX.md` — replace the `<!-- BEGIN:system -->` … `<!-- END:system -->` section with populated foundations and components tables

Each chunk follows the standard format: header with phase/source/date, exact content from monolith (no summarization), and `## Related` footer with links to related chunks.

## Step 4: Update state

Update `.design/STATE.md`:
- Set Phase 3 (System) status to `complete`
- Record completion date

## Step 5: Route next

Display system summary (foundation values, component count, token count) and end with:
"Run `/gsp:design` to create UI/UX screens using this system."
</process>
