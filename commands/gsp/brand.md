---
name: gsp:brand
description: Create brand identity — strategy, logo directions, color, typography
allowed-tools:
  - Read
  - Write
  - Bash
  - Task
  - WebSearch
  - WebFetch
---
<context>
Phase 2 of the GSP design pipeline. Uses the Brand Identity Creator prompt to develop a complete brand identity from strategy to visual applications.
</context>

<objective>
Create a complete brand identity for the project.

**Input:** `.design/BRIEF.md` + `.design/research/TRENDS.md`
**Output:** `.design/brand/IDENTITY.md`
**Agent:** `gsp-brand-strategist`
</objective>

<execution_context>
@/Users/jubs/.claude/get-shit-pretty/prompts/02-brand-identity-creator.md
@/Users/jubs/.claude/get-shit-pretty/templates/phases/brand.md
</execution_context>

<process>
## Step 1: Load context

Read:
- `.design/BRIEF.md` — project context, audience, personality
- `.design/research/TRENDS.md` — trend insights (if available; proceed without if not)

If BRIEF.md doesn't exist, tell the user to run `/gsp:new-project` first.

## Step 2: Spawn brand strategist

Spawn the `gsp-brand-strategist` agent with:
- The full BRIEF.md and TRENDS.md content
- The Brand Identity Creator prompt (02)
- The brand output template

The agent should deliver:
1. Brand strategy (story, archetype, voice matrix, messaging hierarchy)
2. 3 logo directions with variations and usage rules
3. Complete color system (Hex, RGB, Pantone, CMYK + rationale)
4. Typography system
5. Imagery and photography style guide
6. Brand applications
7. Brand book structure

## Step 3: Write output

Write the completed identity to `.design/brand/IDENTITY.md`.

## Step 4: Update state

Update `.design/STATE.md`:
- Set Phase 2 (Brand) status to `complete`
- Record completion date

## Step 5: Route next

Display brand identity summary and end with:
"Run `/gsp:system` to build the design system from this identity."
</process>
