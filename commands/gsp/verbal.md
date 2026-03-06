---
name: gsp:verbal
description: Verbal identity — voice, tone spectrum, messaging matrix, naming
allowed-tools:
  - Read
  - Write
  - Bash
  - Task
  - WebSearch
  - WebFetch
---
<context>
Phase 3 of the GSP branding diamond. Creates the brand's verbal identity — how it speaks, what it says, and how tone adapts across contexts. Built on the brand strategy (archetype, prism, positioning).
</context>

<objective>
Create the brand's verbal identity system.

**Input:** `.design/branding/{brand}/strategy/STRATEGY.md`
**Output:** `.design/branding/{brand}/verbal/VERBAL.md`
**Agent:** `gsp-verbal-strategist`
</objective>

<execution_context>
@/Users/jubs/.claude/get-shit-pretty/templates/phases/verbal.md
@/Users/jubs/.claude/get-shit-pretty/references/voice-tone.md
</execution_context>

<process>
## Step 1: Find brand

Scan `.design/branding/` for brand directories. If only one brand exists, use it. If multiple, ask the user which brand to work on.

Read:
- `.design/branding/{brand}/strategy/STRATEGY.md` — archetype, prism, positioning, messaging

If STRATEGY.md doesn't exist, tell the user to run `/gsp:strategy` first.

Also read BRIEF.md for audience context.

## Step 2: Spawn verbal strategist

Spawn the `gsp-verbal-strategist` agent with:
- The full STRATEGY.md content
- The BRIEF.md content (for audience context)
- The verbal identity template
- The voice-tone reference

The agent should deliver:
1. **Brand Voice** — 3-5 voice attributes with means/doesn't mean/examples
2. **Tone Spectrum** — 5 scales with default position + tone shifts by context (8-10 contexts)
3. **Voice Chart** — Do/Don't per attribute with real writing examples + grammar/style rules
4. **Messaging Matrix** — Key messages by audience segment with tone, proof points, channels
5. **Brand Narrative** — Origin story + 4-part story arc (Setup, Tension, Resolution, Transformation)
6. **Tagline Directions** — 3 distinct directions with rationale and best-use context
7. **Nomenclature** — Naming conventions for products/features/plans, naming principles, terminology guide

## Step 3: Write output

Write the completed verbal identity to `.design/branding/{brand}/verbal/VERBAL.md`.

## Step 4: Update state

Update `.design/branding/{brand}/STATE.md`:
- Set Phase 3 (Verbal) status to `complete`
- Record completion date

## Step 5: Route next

Display verbal identity summary (voice attributes, tone position, tagline directions) and end with:
"Run `/gsp:identity` to create the visual identity."
</process>
