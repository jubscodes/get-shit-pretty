---
name: gsp:brand-strategy
description: Define who you are — archetype, positioning, personality
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
Phase 2 of the GSP branding diamond. An interactive creative challenge — you present research insights, push opinionated strategic recommendations, and collaborate with the user to lock brand positioning before spawning the strategist agent.
</context>

<objective>
Define brand strategy through interactive creative direction, then produce full strategy chunks.

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
## Step 0: Resolve brand

Scan `.design/branding/` for brand directories. If only one brand exists, use it. If multiple, ask the user which brand to work on.

Set `BRAND_PATH` = `.design/branding/{brand}`

If BRAND_PATH doesn't exist, tell the user to run `/gsp:start` first.

## Step 1: Load research findings

Read `{BRAND_PATH}/BRIEF.md` — company, audience, personality, goals.

**Chunk-first:** Read `{BRAND_PATH}/discover/INDEX.md`. If it exists, load all 7 discover chunks.

**Fallback:** If INDEX.md doesn't exist, read `{BRAND_PATH}/discover/DISCOVER.md` (legacy monolith). Log: "⚠️ Legacy discover format detected — consider re-running /gsp:brand-research for chunk output."

Proceed without discover output if neither exists (strategy can run independently).

## Step 2: Present research highlights

Synthesize and present the most strategically relevant findings:
- **Competitive gaps** — where the market is underserving or homogeneous
- **White space** — unoccupied positions in the competitive landscape
- **Audience tension points** — unmet needs, frustrations, aspirations
- **Key trends** — relevant shifts that create strategic opportunity

Frame the strategic opportunity: "Here's what the research tells us about where this brand can win."

## Step 3: Archetype selection

Present 2-3 archetype candidates using `AskUserQuestion`. Push a recommendation but let them choose:

Each option should have:
- **Label:** The archetype name (e.g., "The Creator")
- **Description:** Strategic reasoning — why this archetype fits and what territory it claims
- **Preview:** Example communication style — "Here's how this archetype would introduce your product: '{sample sentence}'"

Frame with context before the question: "The Sage space is crowded — [competitor A] and [competitor B] already own it. Here's where I see opportunity:"

Let the user choose, adjust, or blend. Confirm the selected archetype.

## Step 4: Positioning challenge

Show the competitive landscape as a positioning map (two key axes relevant to the industry).

Identify where competitors cluster and where the white space is. Then use `AskUserQuestion` with 2 options:

- **Safe play** — description: where it sits on the map, which competitors are nearby, why it's lower-risk / preview: the positioning statement
- **Bold play** — description: the white space opportunity, why it's differentiated, what the risk is / preview: the positioning statement

Push for the bold play in your framing, but let the user decide. Confirm the positioning statement.

## Step 5: Brand personality

Reference the personality words from BRIEF.md. Challenge generic choices and present refined options using `AskUserQuestion` with 2-3 personality word sets:

Each option should have:
- **Label:** The 3-word set (e.g., "Precise · Inventive · Grounded")
- **Description:** How these words differentiate from competitors and what they signal
- **Preview:** A sample sentence written in that personality — "Here's how the brand sounds: '{example}'"

Frame with context: "'Professional' doesn't differentiate — every B2B brand claims it. Here are sharper alternatives:"

Confirm the final personality words with the user.

## Step 6: Spawn brand strategist

With confirmed strategic choices (archetype, positioning, personality), spawn the `gsp-brand-strategist` agent with:
- The full BRIEF.md content
- All discover chunks (or DISCOVER.md fallback content)
- The confirmed archetype, positioning, and personality decisions
- The strategy output template
- The brand-prism reference
- The brand-archetypes reference
- The positioning-frameworks reference
- `{BRAND_PATH}/audit/evolution-map.md` (if exists)
- `{BRAND_PATH}/audit/equity-analysis.md` (if exists)
- `brand_mode` from config.json
- **Output path:** `{BRAND_PATH}/strategy/`

The agent writes chunks directly to the strategy directory:
1. `brand-prism.md`
2. `archetype.md`
3. `golden-circle.md`
4. `positioning.md`
5. `brand-platform.md`
6. `messaging-hierarchy.md`
7. `INDEX.md`

## Step 6.5: Perspective check

Before finalizing strategy, load `{BRAND_PATH}/discover/audience-personas.md` and present stakeholder reactions:

"Before we lock this in, let me stress-test from three angles:

 The Customer ({primary persona name from audience-personas.md}):
 "{reaction to the positioning, archetype, and messaging — would they trust/engage/buy?}"

 The Skeptic (internal stakeholder):
 "{challenges the boldest decision — archetype choice, positioning gamble, messaging risk. Raises the 'what if' scenario.}"

 The Competitor ({top competitor name from discover/competitive-audit.md}):
 "{how they'd respond — is the brand differentiated enough to threaten them? Where's the vulnerability?}"

 Any of these concerns resonate? Want to adjust before we lock in?"

If user wants changes → loop back to adjust strategy outputs.
If confirmed → proceed to state update.

## Step 7: Update state and route

Update `{BRAND_PATH}/STATE.md`:
- Set Phase 2 (Strategy) status to `complete`
- Record completion date

Display strategy summary (archetype, positioning, core message) and end with:
"Strategy locked. Run `/gsp:brand-identity` to bring this to life."
</process>
