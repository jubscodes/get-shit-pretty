---
name: gsp:spec
description: Generate Figma-ready specifications with auto-layout and tokens
allowed-tools:
  - Read
  - Write
  - Bash
  - Task
---
<context>
Phase 5 of the GSP design pipeline. Uses the Figma Auto-Layout Expert prompt to convert screen designs into Figma-ready specifications.
</context>

<objective>
Generate Figma-ready specifications from screen designs.

**Input:** `.design/screens/SCREENS.md` + `.design/system/SYSTEM.md`
**Output:** `.design/specs/FIGMA-SPECS.md`
**Agent:** `gsp-spec-engineer`
</objective>

<execution_context>
@/Users/jubs/.claude/get-shit-pretty/prompts/05-figma-auto-layout-expert.md
@/Users/jubs/.claude/get-shit-pretty/templates/phases/spec.md
</execution_context>

<process>
## Step 1: Load context

Read:
- `.design/screens/SCREENS.md` — screen designs to convert
- `.design/system/SYSTEM.md` — design system (tokens, components)
- `.design/system/tokens.json` — token values

If SCREENS.md doesn't exist, tell the user to run `/gsp:design` first.

## Step 2: Spawn spec engineer

Spawn the `gsp-spec-engineer` agent with:
- SCREENS.md, SYSTEM.md, and tokens.json
- The Figma Auto-Layout Expert prompt (05)
- The spec output template

The agent should deliver:
1. Frame structure with grids and constraints
2. Responsive rules
3. Auto-layout specs per component (direction, padding, spacing, alignment, resizing)
4. Component architecture with variants and properties
5. Design tokens mapped to Figma tokens
6. Prototype flows (triggers, animations)
7. Dev handoff setup (CSS, exports, naming)
8. Accessibility notes

## Step 3: Write output

Write specs to `.design/specs/FIGMA-SPECS.md`.

## Step 4: Update state

Update `.design/STATE.md`:
- Set Phase 5 (Spec) status to `complete`
- Record completion date

## Step 5: Route next

Display spec summary and end with:
"Run `/gsp:review` for design critique and accessibility audit."
</process>
