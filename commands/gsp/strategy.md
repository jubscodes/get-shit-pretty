---
name: gsp:strategy
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

**Input:** `.design/branding/{brand}/BRIEF.md` + `.design/branding/{brand}/discover/DISCOVER.md`
**Output:** `.design/branding/{brand}/strategy/STRATEGY.md`
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

Read:
- `.design/branding/{brand}/BRIEF.md` — company, audience, personality, goals
- `.design/branding/{brand}/discover/DISCOVER.md` — competitive audit, personas, trends (proceed without if not yet complete)

If BRIEF.md doesn't exist, tell the user to run `/gsp:new` first.

## Step 2: Spawn brand strategist

Spawn the `gsp-brand-strategist` agent with:
- The full BRIEF.md and DISCOVER.md content
- The strategy output template
- The brand-prism reference
- The brand-archetypes reference
- The positioning-frameworks reference

The agent should deliver:
1. **Kapferer Brand Prism** — 6 facets (Physique, Personality, Culture, Relationship, Reflection, Self-Image) with specific, ownable descriptions
2. **Brand Archetype** — Primary + secondary from 12 Jungian archetypes, rationale, shadow traits to avoid
3. **Golden Circle** — Why / How / What
4. **Positioning Map** — 2-axis map plotting brand vs 4-6 competitors, with white space analysis
5. **Brand Platform** — Purpose, Vision, Mission, Values, Promise
6. **Messaging Hierarchy** — Core message → 3 supporting messages with proof points → elevator pitch

## Step 3: Write output

Write the completed strategy to `.design/branding/{brand}/strategy/STRATEGY.md`.

## Step 4: Update state

Update `.design/branding/{brand}/STATE.md`:
- Set Phase 2 (Strategy) status to `complete`
- Record completion date

## Step 5: Route next

Display strategy summary (archetype, positioning, core message) and end with:
"Run `/gsp:verbal` to develop the brand's verbal identity."
</process>
