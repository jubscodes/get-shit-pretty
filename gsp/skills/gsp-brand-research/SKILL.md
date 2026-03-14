---
name: brand-research
description: Research your market and competitors
disable-model-invocation: true
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
Phase 1 of the GSP branding diamond. Researches market landscape, competitive positioning, and design trends to inform brand strategy. Personas are already defined in BRIEF.md — this phase validates and enriches the market context around them.
</context>

<objective>
Research market context that will inform brand strategy.

**Input:** `.design/branding/{brand}/BRIEF.md`
**Output:** `.design/branding/{brand}/discover/` (4 chunks + INDEX.md)
**Agent:** `gsp-researcher`
</objective>

<execution_context>
@${CLAUDE_SKILL_DIR}/../../templates/phases/discover.md
@${CLAUDE_SKILL_DIR}/../../references/design-trends.md (index only — agent loads specific trend files only after open research validates relevance)
</execution_context>

<rules>
- Always use `AskUserQuestion` for user-facing questions — never raw text prompts
- Keep interactions concise — 1-2 exchanges max before spawning the agent
- Artifacts must balance human readability with agent consumption for downstream phases
</rules>

<process>
## Step 1: Resolve brand

Scan `.design/branding/` for brand directories. One brand → use it. Multiple → use `AskUserQuestion` with one option per brand.

Set `BRAND_PATH` = `.design/branding/{brand}`

Read `{BRAND_PATH}/BRIEF.md`. If missing, tell user to run `/gsp:start` first.
Read `{BRAND_PATH}/config.json` for `brand_mode`.

## Step 2: Confirm research scope

Load BRIEF.md personas and competitive landscape. If `{BRAND_PATH}/audit/` exists, also load `audit/evolution-map.md` and `audit/market-fit.md`.

Present a compact research plan, then use `AskUserQuestion`:
- **Looks good** — "Start research with this scope"
- **Adjust** — "I want to add competitors or shift emphasis"

## Step 3: Spawn researcher

Spawn the `gsp-researcher` agent with:
- BRIEF.md content
- Discover output template
- Design trends index (reference only — agent loads specific trend files only after open research validates them)
- User-confirmed scope adjustments
- `brand_mode` from config.json
- Audit chunks if they exist
- **Output path:** `{BRAND_PATH}/discover/`

The agent writes 4 chunks + INDEX.md:
1. `market-landscape.md`
2. `competitive-audit.md`
3. `trend-analysis.md`
4. `mood-board-direction.md`
5. `INDEX.md`

## Step 4: Update state

Update `{BRAND_PATH}/STATE.md`: set Phase 1 (Discover) to `complete`.

## Step 5: Phase transition

Render phase transition screen, then use `AskUserQuestion`:
- **Continue to strategy** — "define positioning, voice, and messaging"
- **View progress** — "see the full dashboard"
- **Done for now** — "pick up later with /gsp:start"
</process>
