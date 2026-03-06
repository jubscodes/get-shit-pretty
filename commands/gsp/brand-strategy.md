---
name: gsp:brand-strategy
description: Brand strategy — Kapferer Prism, archetypes, Golden Circle, positioning
allowed-tools:
  - Read
  - Write
  - Bash
  - Task
  - WebSearch
  - WebFetch
---
<context>
Phase 2 of the GSP branding diamond. Defines brand strategy using established branding frameworks — Kapferer Brand Prism, Jungian archetypes, Golden Circle, positioning maps, and messaging hierarchy.
</context>

<objective>
Define brand strategy using established frameworks.

**Input:** `.design/branding/{brand}/BRIEF.md` + discover chunks
**Output:** `.design/branding/{brand}/strategy/` (6 chunks + INDEX.md)
**Agent:** `gsp-brand-strategist`
</objective>

<execution_context>
@/Users/jubs/.claude/get-shit-pretty/templates/phases/strategy.md
@/Users/jubs/.claude/get-shit-pretty/references/brand-prism.md
@/Users/jubs/.claude/get-shit-pretty/references/brand-archetypes.md
@/Users/jubs/.claude/get-shit-pretty/references/positioning-frameworks.md
</execution_context>

<process>
## Step 1: Find brand

Scan `.design/branding/` for brand directories. If only one brand exists, use it. If multiple, ask the user which brand to work on.

Read `.design/branding/{brand}/BRIEF.md` — company, audience, personality, goals.

If BRIEF.md doesn't exist, tell the user to run `/gsp:new` first.

## Step 1.5: Load discover output

**Chunk-first:** Read `.design/branding/{brand}/discover/INDEX.md`. If it exists, load all 7 discover chunks.

**Fallback:** If INDEX.md doesn't exist, read `.design/branding/{brand}/discover/DISCOVER.md` (legacy monolith). Log: "⚠️ Legacy discover format detected — consider re-running /gsp:brand-discover for chunk output."

Proceed without discover output if neither exists (strategy can run independently).

## Step 2: Spawn brand strategist

Spawn the `gsp-brand-strategist` agent with:
- The full BRIEF.md content
- All discover chunks (or DISCOVER.md fallback content)
- The strategy output template
- The brand-prism reference
- The brand-archetypes reference
- The positioning-frameworks reference
- **Output path:** `.design/branding/{brand}/strategy/`

The agent writes chunks directly to the strategy directory:
1. `brand-prism.md`
2. `archetype.md`
3. `golden-circle.md`
4. `positioning.md`
5. `brand-platform.md`
6. `messaging-hierarchy.md`
7. `INDEX.md`

## Step 3: Update state

Update `.design/branding/{brand}/STATE.md`:
- Set Phase 2 (Strategy) status to `complete`
- Record completion date

## Step 4: Route next

Display strategy summary (archetype, positioning, core message) and end with:
"Run `/gsp:brand-verbal` to develop the brand's verbal identity."
</process>
