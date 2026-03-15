---
name: brand-audit
description: Audit an existing brand before evolving it
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
Phase 0 of the GSP branding diamond. Optional — only runs when evolving an existing brand. Produces a structured audit consumed by all downstream phases.
</context>

<objective>
Audit an existing brand. Produce evolution map that guides research, strategy, and identity phases.

**Input:** Existing brand assets + `.design/branding/{brand}/BRIEF.md`
**Output:** `.design/branding/{brand}/audit/` (5 chunks + INDEX.md)
**Agent:** `gsp-brand-auditor`
</objective>

<execution_context>
@${CLAUDE_SKILL_DIR}/../../references/chunk-format.md
</execution_context>

<rules>
- Always use `AskUserQuestion` for user-facing questions — never raw text prompts
- Keep interactions concise — gather assets, confirm scope, spawn agent
- Artifacts must balance human readability with agent consumption for downstream phases
</rules>

<process>
## Step 1: Resolve brand

Scan `.design/branding/` for brand directories. One brand → use it. Multiple → use `AskUserQuestion`.

Set `BRAND_PATH` = `.design/branding/{brand}`

Read `{BRAND_PATH}/BRIEF.md` for aspirational direction.
Read `{BRAND_PATH}/config.json` to confirm `brand_mode` is `evolve`.

If missing, tell user to run `/gsp:start` first.

## Step 2: Gather brand assets

Use `AskUserQuestion` to prompt for assets:
- **Share assets now** — "I have guidelines, colors, fonts, voice samples, or URLs to share"
- **Describe the brand** — "I'll describe it in my own words"

Accept whatever format. Infer from partial info. If URLs provided, use WebFetch. Don't over-ask — work with what's given.

## Step 3: Spawn auditor

```bash
mkdir -p {BRAND_PATH}/audit
```

Spawn the `gsp-brand-auditor` agent with:
- All gathered assets/descriptions
- BRIEF.md content (personas, competitive landscape, brand essence)
- config.json evolution_scope
- **Output path:** `{BRAND_PATH}/audit/`

The agent writes 5 chunks + INDEX.md:
1. `brand-inventory.md`
2. `coherence-assessment.md`
3. `market-fit.md`
4. `equity-analysis.md`
5. `evolution-map.md`
6. `INDEX.md`

## Step 4: Present findings

Read audit outputs. Present compact summary, then use `AskUserQuestion`:
- **Looks right** — "These preserve/evolve/replace calls are accurate"
- **Adjust** — "I want to change some decisions"

Update `evolution_scope` in `{BRAND_PATH}/config.json` with confirmed decisions.

## Step 5: Update state and route

Update `{BRAND_PATH}/STATE.md`: set Phase 0 (Audit) to `complete`.

Use `AskUserQuestion`:
- **Continue to research** — "validate brand position against the market"
- **Done for now** — "pick up later with /gsp:start"
</process>
