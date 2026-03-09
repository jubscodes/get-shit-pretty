---
name: gsp:brand-audit
description: Audit an existing brand before evolving it
allowed-tools:
  - Read
  - Write
  - Bash
  - Task
  - WebSearch
  - WebFetch
  - AskUserQuestion
---
<context>
Phase 0 of the GSP branding diamond. Optional — only runs when evolving an existing brand. Produces a structured audit document consumed by all downstream phases.

When a user has an established brand and wants to refresh, modernize, or evolve it, this command gathers existing assets, spawns an auditor agent, and produces an evolution map that guides every subsequent phase.
</context>

<objective>
Audit an existing brand identity. Produce a structured audit document that downstream phases consume as baseline context — research knows what to validate, strategy knows what to evaluate, identity knows what to preserve/evolve.

**Input:** Existing brand assets + `.design/branding/{brand}/BRIEF.md`
**Output:** `.design/branding/{brand}/audit/` (5 chunks + INDEX.md)
**Agent:** `gsp-brand-auditor`
</objective>

<execution_context>
@/Users/jubs/.claude/get-shit-pretty/templates/phases/discover.md
@/Users/jubs/.claude/get-shit-pretty/references/chunk-format.md
</execution_context>

<process>
## Step 1: Resolve brand

Scan `.design/branding/` for brand directories. If only one brand exists, use it. If multiple, ask the user which brand to work on.

Set `BRAND_PATH` = `.design/branding/{brand}`

Read `{BRAND_PATH}/BRIEF.md` to understand the brand's aspirational direction.
Read `{BRAND_PATH}/config.json` to confirm `brand_mode` is `evolve` and get `evolution_scope`.

If BRAND_PATH doesn't exist, tell the user to run `/gsp:start` first.

## Step 2: Gather existing brand assets (interactive)

Present what you can work with:

"Show me what you've got. I can work with:
 - Brand guidelines (PDF, Figma, URL)
 - Colors (hex codes, palette screenshots)
 - Typography (font names, type scale)
 - Logo (description, files)
 - Voice/tone (guidelines, writing samples)
 - Taglines, messaging, positioning statements

 Share whatever you have — I'll audit it all."

Accept whatever format the user provides. Infer from partial info. If they share URLs, use WebFetch to pull content. If they describe assets in prose, extract structured data from their descriptions.

Gather until you have enough to audit. Don't over-ask — work with what's given.

## Step 3: Spawn brand auditor

Create the audit output directory:
```bash
mkdir -p {BRAND_PATH}/audit
```

Spawn the `gsp-brand-auditor` agent with:
- All gathered assets/descriptions
- BRIEF.md content (for aspirational direction)
- config.json evolution_scope (preserve/evolve/replace)
- **Output path:** `{BRAND_PATH}/audit/`

The agent writes chunks directly to the audit directory:
1. `brand-inventory.md`
2. `coherence-assessment.md`
3. `market-fit.md`
4. `equity-analysis.md`
5. `evolution-map.md`
6. `INDEX.md`

## Step 4: Present audit findings (interactive)

Read the audit outputs and present key findings:

"Here's where your brand stands: {summary}

 Strongest elements: {list} — I'd preserve these
 Weakest elements: {list} — these need work
 Evolution recommendation: {direction}"

Let the user confirm or adjust what to preserve vs evolve vs replace.

Update `evolution_scope` in `{BRAND_PATH}/config.json` with confirmed decisions:
```json
{
  "evolution_scope": {
    "preserve": ["confirmed elements"],
    "evolve": ["confirmed elements"],
    "replace": ["confirmed elements"]
  }
}
```

## Step 5: Update state + route

Update `{BRAND_PATH}/STATE.md`:
- Set Phase 0 (Audit) status to `complete`
- Record completion date

Update `{BRAND_PATH}/config.json`:
- Set audit phase status to `complete`

"Audit complete. Run `/gsp:brand-research` — it'll use this audit to focus research on validating your brand position and finding evolution opportunities."
</process>
