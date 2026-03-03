---
name: gsp:spec
description: Generate implementation specifications — map design to your UI framework
allowed-tools:
  - Read
  - Write
  - Bash
  - Task
  - Grep
  - Glob
---
<context>
Phase 5 of the GSP design pipeline. Converts screen designs into implementation specifications tailored to the project's UI framework (shadcn, RN Reusables, existing DS, Figma, or raw code specs).
</context>

<objective>
Generate implementation specifications from screen designs.

**Input:** `.design/screens/SCREENS.md` + `.design/system/SYSTEM.md` + `.design/config.json`
**Output:** `.design/specs/SPECS.md`
**Agent:** `gsp-spec-engineer`
</objective>

<execution_context>
@/Users/jubs/.claude/get-shit-pretty/prompts/05-implementation-spec-expert.md
@/Users/jubs/.claude/get-shit-pretty/templates/phases/spec.md
</execution_context>

<process>
## Step 1: Load context

Read:
- `.design/config.json` — get `implementation_target` (default: `code`)
- `.design/screens/SCREENS.md` — screen designs to convert
- `.design/system/SYSTEM.md` — design system (tokens, components)
- `.design/system/tokens.json` — token values

If SCREENS.md doesn't exist, tell the user to run `/gsp:design` first.

## Step 2: Check for skip

If `implementation_target` is `skip`:
1. Update `.design/STATE.md` — set Phase 5 (Spec) status to `skipped`
2. Display: "Spec phase skipped — implementation target is set to `skip`. Designs will feed directly into build."
3. Route: "Run `/gsp:review` for design critique and accessibility audit."
4. Stop here.

## Step 3: Gather target context

**When `existing`:** Scan the codebase for existing design system files:
- Look for `components/`, `src/components/`, `components/ui/`, `lib/components/`
- Look for token/theme files: `tailwind.config.*`, `theme.*`, `tokens.*`, `globals.css`
- Look for shadcn config: `components.json`
- Summarize what's found for the agent

**When `shadcn`:** Check for existing shadcn setup:
- Look for `components.json`, `components/ui/`
- Note which shadcn components are already installed

**When `rn-reusables`:** Check for existing RN Reusables setup:
- Look for `components/ui/`, NativeWind config, `tailwind.config.*`
- Check Expo app structure (`app/`, navigation config)
- Note which reusables are already installed

## Step 4: Spawn spec engineer

Spawn the `gsp-spec-engineer` agent with:
- SCREENS.md, SYSTEM.md, and tokens.json
- The Implementation Spec Expert prompt (05)
- The spec output template
- The `implementation_target` value
- Any target-specific context gathered in Step 3

## Step 5: Write output

Write specs to `.design/specs/SPECS.md`.

## Step 6: Update state

Update `.design/STATE.md`:
- Set Phase 5 (Spec) status to `complete`
- Record completion date

## Step 7: Route next

Display spec summary and end with:
"Run `/gsp:review` for design critique and accessibility audit."
</process>
