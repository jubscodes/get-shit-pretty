---
name: gsp:brand-discover
description: Brand discovery — competitive audit, audience personas, SWOT, trend analysis
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

Read `.design/branding/{brand}/BRIEF.md` to understand:
- Company, industry, audience
- Competitive landscape
- Brand personality and goals

If BRIEF.md doesn't exist, tell the user to run `/gsp:new` first.

Read `.design/branding/{brand}/config.json` to confirm `project_type` is `brand`.

## Step 2: Spawn researcher

Spawn the `gsp-researcher` agent with:
- The full BRIEF.md content
- The Design Trend Synthesizer prompt (07)
- The discover output template
- Instruction to focus on the brand's specific industry
- **Output path:** `.design/branding/{brand}/discover/`

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
"Run `/gsp:brand-strategy` to develop brand strategy based on these insights."
</process>
