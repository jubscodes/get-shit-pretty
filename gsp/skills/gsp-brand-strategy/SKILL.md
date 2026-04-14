---
name: gsp-brand-strategy
description: Define positioning, voice, and messaging (creative phase — benefits from capable models) — use when: define our positioning, brand strategy, what's our voice, how do we talk to customers
user-invocable: true
allowed-tools:
  - Read
  - Write
  - Bash
  - Agent
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

<rules>
- Always use `AskUserQuestion` for user-facing questions — never raw text prompts
- One decision per question — never batch multiple questions in a single message
- Never re-ask what the user already answered in a prior phase — read BRIEF.md and build on it
- Push opinionated recommendations but let the user decide
- Quality gate: if you could swap in a competitor's name and it still works, it's too generic
- Artifacts must balance human readability with agent consumption for downstream phases
</rules>

<process>
## Step 0: Resolve brand

Resolve brand from `.design/branding/` (one → use it, multiple → ask). Set `BRAND_PATH`.
If missing, tell user to run `/gsp-start` first.

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

Read the personality direction from BRIEF.md (gathered during `/gsp-start`). Use it as the starting point — don't re-ask for personality. Deepen it into a structural archetype.

Use `AskUserQuestion` with 2-3 archetype candidates that align with the chosen personality direction. Each option:
- **Label:** archetype name
- **Description:** strategic reasoning — why it fits the personas and gaps, and how it builds on the personality direction from the brief
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

## Step 5.5: Style direction

Read `{BRAND_PATH}/discover/mood-board-direction.md` and look for the **Style Affinity** section. If it exists and recommends presets:

Present the style direction to the user. Use `AskUserQuestion` with options:
- One option per recommended preset — **Label:** preset name, **Description:** why the researcher recommended it (tag matches + rationale)
- **No preset** — "Build the visual identity from scratch without a style base"

Store the user's choice in `{BRAND_PATH}/config.json` → `system_config.style_base` as an array of preset slugs (e.g. `["swiss-minimalist"]`). If "No preset" → leave as `[]`.

If the Style Affinity section doesn't exist or discover was skipped, skip this step silently.

## Step 6: Spawn strategist

### Load references and agent methodology
Read these files and hold their content for inlining into the agent prompt:
- `${CLAUDE_SKILL_DIR}/../../templates/phases/strategy.md` — strategy output template
- `${CLAUDE_SKILL_DIR}/brand-archetypes.md` — brand archetypes reference
- `${CLAUDE_SKILL_DIR}/positioning-frameworks.md` — positioning frameworks reference
- `${CLAUDE_SKILL_DIR}/voice-tone.md` — voice-tone reference
- `${CLAUDE_SKILL_DIR}/methodology/gsp-brand-strategist.md` — agent methodology

With confirmed archetype, positioning, and voice direction, spawn the `gsp-brand-strategist` agent with:
- BRIEF.md content
- All discover chunks
- Confirmed archetype, positioning, voice direction
- **Content of** strategy output template (loaded above)
- **Content of** brand archetypes reference (loaded above)
- **Content of** positioning frameworks reference (loaded above)
- **Content of** voice-tone reference (loaded above)
- **Agent methodology** (loaded above)
- Audit chunks if they exist: `evolution-map.md`, `equity-analysis.md`
- `brand_mode` from config.json
- `style_base` from config.json (may be empty)
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

Invoke `/gsp-phase-transition` with phase `strategy` and output directory `{BRAND_PATH}/strategy/`.
</process>
