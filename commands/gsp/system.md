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
Phase 3 of the GSP design pipeline. Uses the Design System Architect prompt to build a complete design system with foundations, components, and tokens.
</context>

<objective>
Build a complete design system from the brand identity.

**Input:** `.design/brand/IDENTITY.md`
**Output:** `.design/system/SYSTEM.md` + `.design/system/tokens.json`
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
- `.design/BRIEF.md` — platforms, tech stack, constraints

If IDENTITY.md doesn't exist, tell the user to run `/gsp:brand` first.

## Step 2: Spawn system architect

Spawn the `gsp-system-architect` agent with:
- The IDENTITY.md and BRIEF.md content
- The Design System Architect prompt (01)
- The system output template
- The design tokens reference

The agent should deliver:
1. Color system (primary, semantic, dark mode, contrast ratios, usage)
2. Typography scale (9 levels, responsive, accessible)
3. Grid system (12-column)
4. Spacing system (8px base)
5. Elevation / shadow scale
6. Border radius tokens
7. 30+ components with states, anatomy, usage, accessibility, code specs
8. Design patterns
9. Design tokens as JSON (`tokens.json`)
10. Design principles and do's/don'ts

## Step 3: Write output

1. Write system to `.design/system/SYSTEM.md`
2. Write tokens to `.design/system/tokens.json`

## Step 4: Update state

Update `.design/STATE.md`:
- Set Phase 3 (System) status to `complete`
- Record completion date

## Step 5: Route next

Display system summary (foundation values, component count, token count) and end with:
"Run `/gsp:design` to create UI/UX screens using this system."
</process>
