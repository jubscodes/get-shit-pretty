---
name: gsp:research
description: Analyze design trends and competitive landscape for the project
allowed-tools:
  - Read
  - Write
  - Bash
  - Task
  - WebSearch
  - WebFetch
---
<context>
Phase 1 of the GSP design pipeline. Uses the Design Trend Synthesizer prompt to analyze industry trends, competitor positioning, and user expectation shifts.
</context>

<objective>
Research design trends for the project's industry and produce a comprehensive trends report.

**Input:** `.design/BRIEF.md`
**Output:** `.design/research/TRENDS.md`
**Agent:** `gsp-researcher`
</objective>

<execution_context>
@/Users/jubs/.claude/get-shit-pretty/prompts/07-design-trend-synthesizer.md
@/Users/jubs/.claude/get-shit-pretty/templates/phases/research.md
</execution_context>

<process>
## Step 1: Load context

Read `.design/BRIEF.md` to understand:
- Industry / sector
- Target audience
- Brand personality and positioning
- Competitive landscape (if mentioned)

If BRIEF.md doesn't exist, tell the user to run `/gsp:new-project` first.

## Step 2: Spawn researcher

Spawn the `gsp-researcher` agent with:
- The full BRIEF.md content
- The Design Trend Synthesizer prompt (07)
- The research output template
- Instruction to focus on the project's specific industry

The agent should:
1. Research current design trends for the industry
2. Identify 5 macro trends with real brand examples
3. Map competitor positioning (2x2)
4. Analyze user expectation shifts
5. Assess platform evolution (iOS, Material, Web)
6. Provide strategic recommendations
7. Define mood board direction

## Step 3: Write output

Write the completed research to `.design/research/TRENDS.md`.

## Step 4: Update state

Update `.design/STATE.md`:
- Set Phase 1 (Research) status to `complete`
- Record completion date

## Step 5: Route next

Display a summary of key findings and end with:
"Run `/gsp:brand` to create brand identity based on these insights."
</process>
