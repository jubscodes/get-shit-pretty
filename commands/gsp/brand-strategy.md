---
name: gsp:brand-strategy
description: Define positioning, voice, and messaging
allowed-tools:
  - Read
  - Write
  - Bash
  - Task
  - AskUserQuestion
  - WebSearch
  - WebFetch
---
<context>
Phase 2 of the GSP branding diamond. Interactive creative session — present research insights, collaborate on archetype and positioning, then produce full strategy including voice and messaging. This phase replaces the previous separate strategy + verbal phases.
</context>

<objective>
Define brand strategy and voice through interactive creative direction, then produce strategy chunks.

**Input:** `.design/branding/{brand}/BRIEF.md` + discover chunks
**Output:** `.design/branding/{brand}/strategy/` (5 chunks + INDEX.md)
**Agent:** `gsp-brand-strategist`
</objective>

<execution_context>
@/Users/jubs/.claude/get-shit-pretty/templates/phases/strategy.md
@/Users/jubs/.claude/get-shit-pretty/references/brand-archetypes.md
@/Users/jubs/.claude/get-shit-pretty/references/positioning-frameworks.md
@/Users/jubs/.claude/get-shit-pretty/references/voice-tone.md
</execution_context>

<rules>
- Always use `AskUserQuestion` for user-facing questions — never raw text prompts
- Push opinionated recommendations but let the user decide
- Quality gate: if you could swap in a competitor's name and it still works, it's too generic
- Artifacts must balance human readability with agent consumption for downstream phases
</rules>

<process>
## Step 0: Resolve brand

Scan `.design/branding/` for brand directories. One brand → use it. Multiple → use `AskUserQuestion`.

Set `BRAND_PATH` = `.design/branding/{brand}`
If missing, tell user to run `/gsp:start` first.

## Step 1: Load context

Read `{BRAND_PATH}/BRIEF.md` — business, personas, brand essence, competitive landscape.

**Chunk-first:** Read `{BRAND_PATH}/discover/INDEX.md`. If it exists, load all 4 discover chunks.
**Fallback:** If INDEX.md doesn't exist, proceed without — strategy can run on BRIEF.md alone.

## Step 2: Present strategic opportunity

Synthesize research + brief into a focused insight:
- **Competitive gaps** — where the market underserves
- **White space** — unoccupied positions
- **Persona tension** — unmet needs from BRIEF.md personas

Frame as: "Here's where this brand can win." Keep it to 4-6 lines.

## Step 3: Archetype selection

Use `AskUserQuestion` with 2-3 archetype candidates. Each option:
- **Label:** archetype name
- **Description:** strategic reasoning — why it fits the personas and gaps
- **Preview:** example sentence in that archetype's voice

Push a recommendation. Let user choose, adjust, or blend.

## Step 4: Positioning challenge

Show competitive landscape on 2 axes. Use `AskUserQuestion` with 2 options:
- **Safe play** — description: where it sits, nearby competitors, lower risk / preview: positioning statement
- **Bold play** — description: white space, differentiation, what the risk is / preview: positioning statement

Push for bold. Let user decide.

## Step 5: Voice direction

Reference brand essence from BRIEF.md. Use `AskUserQuestion` with 2-3 voice directions:
- **Label:** 3-word voice set (e.g. "Precise, Inventive, Grounded")
- **Description:** how these words differentiate and what they signal
- **Preview:** example sentence in that voice

## Step 6: Spawn strategist

With confirmed archetype, positioning, and voice direction, spawn the `gsp-brand-strategist` agent with:
- BRIEF.md content
- All discover chunks
- Confirmed archetype, positioning, voice direction
- Strategy output template
- Brand archetypes reference
- Positioning frameworks reference
- Voice-tone reference
- Audit chunks if they exist: `evolution-map.md`, `equity-analysis.md`
- `brand_mode` from config.json
- **Output path:** `{BRAND_PATH}/strategy/`

The agent writes 5 chunks + INDEX.md:
1. `positioning.md`
2. `archetype.md`
3. `brand-platform.md`
4. `voice-and-tone.md`
5. `messaging.md`
6. `INDEX.md`

## Step 7: Perspective check

Load BRIEF.md personas. Present brief stress-test:

"Stress-testing from three angles:

 {Primary persona name}: {1-line reaction — would they trust this?}
 Skeptic: {1-line challenge to the boldest decision}
 {Top competitor}: {1-line — is the brand differentiated enough?}

 Concerns?"

Use `AskUserQuestion`:
- **Lock it in** — "Strategy looks solid"
- **Adjust** — "I want to change something"

If adjust → loop back. If confirmed → proceed.

## Step 8: Update state and route

Update `{BRAND_PATH}/STATE.md`: set Phase 2 (Strategy) to `complete`.

Render phase transition, then use `AskUserQuestion`:
- **Continue to identity** — "create visual identity"
- **View progress** — "see the full dashboard"
- **Done for now** — "pick up later with /gsp:start"
</process>
