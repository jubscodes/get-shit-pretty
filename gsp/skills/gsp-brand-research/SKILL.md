---
name: gsp-brand-research
description: Research market and competitors — use when: research competitors, who else is doing this, market analysis, what do competitors look like
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
Phase 1 of the GSP branding diamond. Researches market landscape, competitive positioning, and design trends to inform brand strategy. Personas are already defined in BRIEF.md — this phase validates and enriches the market context around them.
</context>

<objective>
Research market context that will inform brand strategy.

**Input:** `.design/branding/{brand}/BRIEF.md`
**Output:** `.design/branding/{brand}/discover/` (4 chunks + INDEX.md)
**Agent:** `gsp-brand-researcher`
</objective>

<rules>
- Always use `AskUserQuestion` for user-facing questions — never raw text prompts
- One decision per question — never batch multiple questions in a single message
- Keep interactions concise — 1-2 exchanges max before spawning the agent
- Artifacts must balance human readability with agent consumption for downstream phases
</rules>

<process>
## Step 1: Resolve brand

Resolve brand from `.design/branding/` (one → use it, multiple → ask). Set `BRAND_PATH`.

Read `{BRAND_PATH}/BRIEF.md`. If missing, tell user to run `/gsp-start` first.
Read `{BRAND_PATH}/config.json` for `brand_mode`.

## Step 2: Confirm research scope

Load BRIEF.md personas and competitive landscape. If `{BRAND_PATH}/audit/` exists, also load `audit/evolution-map.md` and `audit/market-fit.md`.

Present a compact research plan, then use `AskUserQuestion`:
- **Looks good** — "Start research with this scope"
- **Adjust** — "I want to add competitors or shift emphasis"

## Step 2.5: Pre-fetch competitor sites (background)

While preparing the agent context, use `WebFetch` with `run_in_background: true` for each competitor URL or website found in BRIEF.md's competitive landscape. This warms the cache so the researcher agent has content ready instead of fetching sequentially during research.

## Step 3: Spawn researcher

### Load references and agent methodology
Read these files and hold their content for inlining into the agent prompt:
- `${CLAUDE_SKILL_DIR}/../../templates/phases/discover.md` — discover output template
- `${CLAUDE_SKILL_DIR}/design-trends.md` — design trends index (agent loads specific trend files only after open research validates relevance)
- `${CLAUDE_SKILL_DIR}/../gsp-style/styles/INDEX.yml` — style presets index
- `${CLAUDE_SKILL_DIR}/methodology/gsp-brand-researcher.md` — agent methodology

Include any pre-fetched competitor content in the agent context.

Spawn the `gsp-brand-researcher` agent with:
- BRIEF.md content
- **Content of** discover output template (loaded above)
- **Content of** design trends index (loaded above — reference only, agent loads specific trend files only after open research validates them)
- **Content of** style presets index (loaded above) — agent matches research findings to existing aesthetics
- User-confirmed scope adjustments
- `brand_mode` from config.json
- **Agent methodology** (loaded above)
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

Invoke `/gsp-phase-transition` with phase `discover` and output directory `{BRAND_PATH}/discover/`.
</process>
