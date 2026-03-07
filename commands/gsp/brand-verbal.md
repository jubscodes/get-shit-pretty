---
name: gsp:brand-verbal
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

**Input:** Strategy chunks (or STRATEGY.md fallback)
**Output:** `.design/branding/{brand}/verbal/` (7 chunks + INDEX.md)
**Agent:** `gsp-verbal-strategist`
</objective>

<execution_context>
@/Users/jubs/.claude/get-shit-pretty/templates/phases/verbal.md
@/Users/jubs/.claude/get-shit-pretty/references/voice-tone.md
</execution_context>

<process>
## Step 1: Find brand

Scan `.design/branding/` for brand directories. If only one brand exists, use it. If multiple, ask the user which brand to work on.

Also read BRIEF.md for audience context.

## Step 1.5: Load strategy output

**Chunk-first:** Read `.design/branding/{brand}/strategy/INDEX.md`. If it exists, load all 6 strategy chunks.

**Fallback:** If INDEX.md doesn't exist, read `.design/branding/{brand}/strategy/STRATEGY.md` (legacy monolith). Log: "⚠️ Legacy strategy format detected — consider re-running /gsp:brand-strategy for chunk output."

If neither exists, tell the user to run `/gsp:brand-strategy` first.

## Step 1.75: Voice direction (interactive)

Load strategy/archetype.md communication style + strategy/brand-prism.md personality.
If `.design/branding/{brand}/audit/` exists, load `audit/brand-inventory.md` voice samples.

Present voice direction:

"Your archetype ({archetype}) communicates with {style}.
 {If evolve: "Your current voice sounds like: {samples from audit}.
  We're {preserving/evolving} it."}

 Here are two directions:
 A: {direction} — '{example sentence}'
 B: {direction} — '{example sentence}'

 Which resonates? Or describe what you hear."

Confirm voice direction. This direction is passed to the verbal strategist agent.

## Step 2: Spawn verbal strategist

Spawn the `gsp-verbal-strategist` agent with:
- All strategy chunks (or STRATEGY.md fallback content)
- The BRIEF.md content (for audience context)
- The verbal identity template
- The voice-tone reference
- User-confirmed voice direction from Step 1.75
- `.design/branding/{brand}/audit/brand-inventory.md` voice samples (if exist)
- **Output path:** `.design/branding/{brand}/verbal/`

The agent writes chunks directly to the verbal directory:
1. `brand-voice.md`
2. `tone-spectrum.md`
3. `voice-chart.md`
4. `messaging-matrix.md`
5. `brand-narrative.md`
6. `tagline-directions.md`
7. `nomenclature.md`
8. `INDEX.md`

## Step 3: Update state

Update `.design/branding/{brand}/STATE.md`:
- Set Phase 3 (Verbal) status to `complete`
- Record completion date

## Step 4: Route next

Display verbal identity summary (voice attributes, tone position, tagline directions) and end with:
"Verbal identity updated. Run `/gsp:brand-identity` to continue — it will skip verbal and run visual identity."
</process>
