---
name: gsp:build
description: Translate designs to production-ready frontend code
allowed-tools:
  - Read
  - Write
  - Bash
  - Task
---
<context>
Phase 7 of the GSP design pipeline. Uses the Design-to-Code Translator prompt to convert implementation specs and design system into production-ready frontend components. Adapts output based on design scope and codebase context.
</context>

<objective>
Translate designs into production-ready frontend code.

**Input:** `.design/specs/SPECS.md` (or SCREENS.md + SYSTEM.md if spec was skipped) + `.design/system/SYSTEM.md`
**Output:** `.design/build/CODE.md` + `.design/build/components/`
**Agent:** `gsp-design-engineer`
</objective>

<execution_context>
@/Users/jubs/.claude/get-shit-pretty/prompts/09-design-to-code-translator.md
@/Users/jubs/.claude/get-shit-pretty/templates/phases/build.md
</execution_context>

<process>
## Step 1: Load context

Read `.design/config.json` to get `implementation_target`, `design_scope`, `codebase_type`.

**Check for chunked exports:**
If `.design/exports/INDEX.md` exists, chunked exports are available.

**When building a specific screen** (user specifies which) and chunks are available:
1. Read `.design/exports/INDEX.md` — find chunk file paths
2. Load screen chunk: `.design/screens/exports/screen-{NN}-{name}.md`
3. Load screen spec: `.design/specs/exports/screens/screen-{NN}-spec.md`
4. Load referenced component chunks from `.design/system/exports/components/`
5. Load `.design/specs/exports/token-mapping.md`
6. Load `.design/specs/exports/install-manifest.md` (shadcn/rn-reusables targets)
6b. Load `.design/specs/exports/gap-analysis.md` + `.design/specs/exports/file-references.md` (existing target)
6c. Load `.design/codebase/INVENTORY.md` (when `codebase_type` is `boilerplate` or `existing` — provides architecture patterns and conventions)
7. Load `.design/system/tokens.json`
8. Read `.design/BRIEF.md` — tech stack preference
9. Load `.design/review/exports/review-fixes.md` (if available) or `.design/review/CRITIQUE.md` — fixes to incorporate

**When building all screens** (or no chunks available):
Read:
- `.design/specs/SPECS.md` — implementation specs (primary input)
- `.design/system/SYSTEM.md` — design system
- `.design/system/tokens.json` — design tokens
- `.design/BRIEF.md` — tech stack preference
- `.design/review/CRITIQUE.md` — any fixes to incorporate
- `.design/codebase/INVENTORY.md` — codebase patterns and conventions (if exists)

If SPECS.md doesn't exist, check if `implementation_target` is `skip`:
- **If `skip`:** Read `.design/screens/SCREENS.md` + `.design/system/SYSTEM.md` as primary input instead
- **If not `skip`:** Tell the user to run `/gsp:spec` first

Determine tech stack from BRIEF.md config (default: React + Tailwind).

## Step 2: Spawn design engineer

Spawn the `gsp-design-engineer` agent with:
- All specs/screens, system, and token files
- The Design-to-Code Translator prompt (09)
- The build output template
- The target tech stack
- The `implementation_target` value
- The `design_scope` value
- The codebase inventory (INVENTORY.md content, when exists) — for naming conventions, file placement

**When `shadcn`:** Agent should use `npx shadcn@latest add` for components, extend with custom variants as defined in SPECS.md.

**When `rn-reusables`:** Agent should use `npx @react-native-reusables/cli add` for components, configure NativeWind theming.

**When `design_scope` is `tokens`:**
- Primary input: SYSTEM.md + tokens.json
- Output: token files only (updated tailwind.config, CSS variables, theme file)
- Skip component code generation
- When `codebase_type` is `existing`: output as patches to token files from INVENTORY.md

The agent should deliver:
1. Component hierarchy with props, state, data flow
2. Production-ready code for each component
3. Responsive layout implementation
4. ARIA and accessibility implementation
5. Error, loading, and empty states
6. Animations and transitions
7. Styling with design tokens (dark mode, breakpoints)
8. Performance optimization notes
9. Testing strategy

## Step 3: Write output

1. Write implementation guide to `.design/build/CODE.md`
2. Write individual components to `.design/build/components/`

## Step 4: Update state

Update `.design/STATE.md`:
- Set Phase 7 (Build) status to `complete`
- Record completion date

## Step 5: Route next

Display component summary and end with:
"Run `/gsp:launch` to create marketing campaign assets."
</process>
