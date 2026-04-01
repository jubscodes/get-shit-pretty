---
name: gsp-brand-audit
description: Audit an existing brand before evolving it
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
Phase 0 of the GSP branding diamond. Optional — only runs when evolving an existing brand. Produces a structured audit consumed by all downstream phases.
</context>

<objective>
Audit an existing brand. Produce evolution map that guides research, strategy, and identity phases.

**Input:** Existing brand assets + `.design/branding/{brand}/BRIEF.md`
**Output:** `.design/branding/{brand}/audit/` (5 chunks + INDEX.md)
**Agent:** `gsp-brand-auditor`
</objective>

<execution_context>
@${CLAUDE_SKILL_DIR}/chunk-format.md
</execution_context>

<rules>
- Always use `AskUserQuestion` for user-facing questions — never raw text prompts
- One decision per question — never batch multiple questions in a single message
- Keep interactions concise — gather assets, confirm scope, spawn agent
- Artifacts must balance human readability with agent consumption for downstream phases
</rules>

<process>
## Step 1: Resolve brand

Resolve brand from `.design/branding/` (one → use it, multiple → ask). Set `BRAND_PATH`.

Read `{BRAND_PATH}/BRIEF.md` for aspirational direction.
Read `{BRAND_PATH}/config.json` to confirm `brand_mode` is `evolve`.

If missing, tell user to run `/gsp-start` first.

## Step 2: Load brand assets from brief

Read `{BRAND_PATH}/BRIEF.md` — brand assets were already gathered during `/gsp-start`. Extract any logos, colors, guidelines, URLs, or descriptions the user provided.

If the brief has no asset information (legacy or incomplete brief), use `AskUserQuestion`:
- **Share assets now** — "I have guidelines, colors, fonts, voice samples, or URLs to share"
- **Describe the brand** — "I'll describe it in my own words"

If URLs were provided (in brief or just now), use WebFetch. Don't re-ask for information already in the brief.

## Step 3: Spawn auditor

```bash
mkdir -p {BRAND_PATH}/audit
```

### Load agent methodology
Read `${CLAUDE_SKILL_DIR}/methodology/gsp-brand-auditor.md`. Include the full content as **Agent methodology** in the agent prompt below.

Spawn the `gsp-brand-auditor` agent with:
- All gathered assets/descriptions
- BRIEF.md content (personas, competitive landscape, brand essence)
- config.json evolution_scope
- **Agent methodology** (loaded above)
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

Invoke `/gsp-phase-transition` with phase `audit` and output directory `{BRAND_PATH}/audit/`.
</process>
