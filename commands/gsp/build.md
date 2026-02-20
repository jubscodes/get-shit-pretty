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
Phase 7 of the GSP design pipeline. Uses the Design-to-Code Translator prompt to convert Figma specs and design system into production-ready frontend components.
</context>

<objective>
Translate designs into production-ready frontend code.

**Input:** `.design/specs/FIGMA-SPECS.md` + `.design/system/SYSTEM.md`
**Output:** `.design/build/CODE.md` + `.design/build/components/`
**Agent:** `gsp-design-engineer`
</objective>

<execution_context>
@/Users/jubs/.claude/get-shit-pretty/prompts/09-design-to-code-translator.md
@/Users/jubs/.claude/get-shit-pretty/templates/phases/build.md
</execution_context>

<process>
## Step 1: Load context

Read:
- `.design/specs/FIGMA-SPECS.md` — component specs
- `.design/system/SYSTEM.md` — design system
- `.design/system/tokens.json` — design tokens
- `.design/BRIEF.md` — tech stack preference
- `.design/review/CRITIQUE.md` — any fixes to incorporate

If FIGMA-SPECS.md doesn't exist, tell the user to run `/gsp:spec` first.

Determine tech stack from BRIEF.md config (default: React + Tailwind).

## Step 2: Spawn design engineer

Spawn the `gsp-design-engineer` agent with:
- All specs, system, and token files
- The Design-to-Code Translator prompt (09)
- The build output template
- The target tech stack

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
