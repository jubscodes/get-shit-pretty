---
name: gsp:brand-research
description: Brand research — competitive audit, personas, SWOT, trend analysis
allowed-tools:
  - Read
  - Write
  - Bash
  - Task
  - WebSearch
  - WebFetch
---
<context>
Phase 1 of the GSP branding diamond. Researches the market landscape, builds audience personas, runs competitive audit, and performs SWOT analysis to inform brand strategy.
</context>

<objective>
Research and discover insights that will inform brand strategy.

**Input:** `.design/branding/{brand}/BRIEF.md`
**Output:** `.design/branding/{brand}/discover/` (7 chunks + INDEX.md)
**Agent:** `gsp-researcher`
</objective>

<execution_context>
@/Users/jubs/.claude/get-shit-pretty/prompts/07-design-trend-synthesizer.md
@/Users/jubs/.claude/get-shit-pretty/templates/phases/discover.md
@/Users/jubs/.claude/get-shit-pretty/references/design-trends.md (index — load specific trend files from references/trends/ as needed)
</execution_context>

<process>
## Step 1: Find brand

Scan `.design/branding/` for brand directories. If only one brand exists, use it. If multiple, ask the user which brand to work on.

Set `BRAND_PATH` = `.design/branding/{brand}`

Read `{BRAND_PATH}/BRIEF.md` to understand:
- Company, industry, audience
- Competitive landscape
- Brand personality and goals

If BRIEF.md doesn't exist, tell the user to run `/gsp:new` first.

Read `{BRAND_PATH}/config.json` to confirm `project_type` is `brand`. Note `brand_mode` value.

## Step 1.5: Research direction (interactive)

Load BRIEF.md context. If `{BRAND_PATH}/audit/` exists, also load `audit/evolution-map.md` and `audit/market-fit.md`.

Present the research plan:

"Here's my research plan:
 Market focus: {industry from BRIEF.md}
 Competitors to analyze: {3-5 from brief + audit}
 Audience segments: {from brief}
 Research emphasis: {competitive gaps / audience pain / trends}
 {If evolve mode: "I'll benchmark your current brand against these competitors to validate what's working."}

 Any competitors I'm missing? Emphasis you'd shift?"

Wait for user input. Incorporate their additions/adjustments.

## Step 2: Spawn researcher

Spawn the `gsp-researcher` agent with:
- The full BRIEF.md content
- The Design Trend Synthesizer prompt (07)
- The discover output template
- Instruction to focus on the brand's specific industry
- User-confirmed research scope from Step 1.5
- `brand_mode` from config.json
- Audit chunks if they exist: `{BRAND_PATH}/audit/brand-inventory.md`, `{BRAND_PATH}/audit/market-fit.md`, `{BRAND_PATH}/audit/evolution-map.md`
- **Output path:** `{BRAND_PATH}/discover/`

## Step 2.5: Confirm scope

After confirming the research scope with the user, proceed to spawn the researcher agent with the confirmed parameters.

The agent writes chunks directly to the discover directory:
1. `market-landscape.md`
2. `competitive-audit.md`
3. `swot-analysis.md`
4. `audience-personas.md`
5. `trend-analysis.md`
6. `strategic-recommendations.md`
7. `mood-board-direction.md`
8. `INDEX.md`

## Step 3: Update state

Update `.design/branding/{brand}/STATE.md`:
- Set Phase 1 (Discover) status to `complete`
- Record completion date

## Step 4: Route next

Display a summary of key findings and end with:
"Run `/gsp:brand-strategy` to define your brand's strategic direction."
</process>
