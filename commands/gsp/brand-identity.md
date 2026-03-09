---
name: gsp:brand-identity
description: Create your voice and visual identity
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
Phases 3-4 of the GSP branding diamond. Runs verbal identity (voice, tone, messaging) and visual identity (logo, color, typography) as a single command. Handles skip logic — if one phase is already complete, runs only the remaining one.
</context>

<objective>
Build the brand's verbal and visual identity.

**Input:** Strategy chunks + BRIEF.md
**Output:** `.design/branding/{brand}/verbal/` + `.design/branding/{brand}/identity/` + `palettes.json`
**Agents:** `gsp-verbal-strategist` (phase 3), `gsp-identity-designer` (phase 4)
</objective>

<execution_context>
@/Users/jubs/.claude/get-shit-pretty/templates/phases/verbal.md
@/Users/jubs/.claude/get-shit-pretty/references/voice-tone.md
@/Users/jubs/.claude/get-shit-pretty/prompts/02-brand-identity-creator.md
@/Users/jubs/.claude/get-shit-pretty/templates/phases/identity.md
</execution_context>

<process>
## Step 0: Resolve brand

Scan `.design/branding/` for brand directories. If only one brand exists, use it. If multiple, ask the user which brand to work on.

Set `BRAND_PATH` = `.design/branding/{brand}`

If BRAND_PATH doesn't exist, tell the user to run `/gsp:start` first.

## Step 1: Validate prerequisites

Read `{BRAND_PATH}/STATE.md`. Strategy (phase 2) must be complete. If not, tell the user: "Strategy isn't complete yet. Run `/gsp:brand-strategy` first."

Load:
- `{BRAND_PATH}/BRIEF.md` — company, audience, goals
- `{BRAND_PATH}/strategy/INDEX.md` → load all strategy chunks
- Fallback: `{BRAND_PATH}/strategy/STRATEGY.md` (legacy monolith). Log: "⚠️ Legacy strategy format detected."

## Step 2: Check progress

Read `{BRAND_PATH}/STATE.md` for phases 3 and 4 status.

- Phase 3 `complete` → skip verbal, go to phase 4
- Phase 4 `complete` → skip visual, go to summary
- Both `complete` → show summary and route to next command
- `pending` or `needs-revision` → run that phase

## Step 2.5: Voice direction (interactive, before verbal agent)

Load `{BRAND_PATH}/strategy/archetype.md` communication style + `{BRAND_PATH}/strategy/brand-prism.md` personality.
If `{BRAND_PATH}/audit/` exists, load `audit/brand-inventory.md` voice samples.

Present context: "Your archetype ({archetype}) communicates with {style}."
{If evolve: "Your current voice sounds like: {samples from audit}. We're {preserving/evolving} it."}

Then use `AskUserQuestion` with 2 voice direction options:
- **Direction A label** — description: what this direction emphasizes / preview: '{example sentence in this voice}'
- **Direction B label** — description: what this direction emphasizes / preview: '{example sentence in this voice}'

Confirm voice direction. This direction is passed to the verbal strategist agent.

## Step 3: Verbal identity (if needed)

Spawn the `gsp-verbal-strategist` agent with:
- All strategy chunks (or STRATEGY.md fallback content)
- The BRIEF.md content (for audience context)
- The verbal identity template
- The voice-tone reference
- User-confirmed voice direction from Step 2.5
- `{BRAND_PATH}/audit/brand-inventory.md` voice samples (if exist)
- **Output path:** `{BRAND_PATH}/verbal/`

The agent writes chunks directly to the verbal directory:
1. `brand-voice.md`
2. `tone-spectrum.md`
3. `voice-chart.md`
4. `messaging-matrix.md`
5. `brand-narrative.md`
6. `tagline-directions.md`
7. `nomenclature.md`
8. `INDEX.md`

Update `{BRAND_PATH}/STATE.md`:
- Set Phase 3 (Verbal) status to `complete`
- Record completion date

Display progress: "Verbal identity complete. Moving to visual identity..."

## Step 3.5: Visual direction (interactive, before identity agent)

Load `{BRAND_PATH}/discover/mood-board-direction.md` + `{BRAND_PATH}/strategy/archetype.md` visual tendencies.
If `{BRAND_PATH}/audit/` exists, load `audit/brand-inventory.md` (current colors, typography).

Present research context:

"Here's where research and strategy point visually:

 From research mood board:
   Colors: {hex values from mood-board-direction.md}
   Typography: {typefaces from mood-board-direction.md}
   Imagery: {style from mood-board-direction.md}

 From archetype ({name}):
   Visual tendencies: {from archetype.md}

 {If evolve: "Current brand uses {colors, fonts from audit}.
  Evolution map says: preserve {X}, evolve {Y}, replace {Z}."}"

Then use `AskUserQuestion` with 2-3 visual direction options:
- **Direction label** — description: color palette direction, typography feel, overall aesthetic / preview: "Logo concept: {concept description}. Palette: {key colors}. Type: {typeface style}."

Each direction should represent a meaningfully different visual path (e.g., minimal vs. expressive vs. heritage).

After selection, ask for any hard constraints or visual references. Confirm visual direction — this and the mood-board-direction.md content are passed to the identity designer agent.

## Step 4: Visual identity (if needed)

Load verbal chunks (just created or pre-existing):
- `{BRAND_PATH}/verbal/INDEX.md` → load `brand-voice.md`, `tone-spectrum.md`
- Fallback: `{BRAND_PATH}/verbal/VERBAL.md` (legacy monolith). Log: "⚠️ Legacy verbal format detected."

Spawn the `gsp-identity-designer` agent with:
- The BRIEF.md content
- Selected strategy chunks (brand-prism, archetype, positioning, brand-platform)
- Selected verbal chunks (brand-voice, tone-spectrum)
- The Brand Identity Creator prompt (02)
- The identity output template
- `{BRAND_PATH}/discover/mood-board-direction.md` content
- User-confirmed visual direction from Step 3.5
- `{BRAND_PATH}/audit/brand-inventory.md` (if exists)
- `{BRAND_PATH}/audit/evolution-map.md` (if exists)
- **Output path:** `{BRAND_PATH}/identity/`

The agent writes chunks directly to the identity directory:
1. `logo-directions.md`
2. `color-system.md`
3. `typography.md`
4. `imagery-style.md`
5. `brand-applications.md`
6. `brand-book.md`
7. `palettes.json`
8. `INDEX.md`

Update `{BRAND_PATH}/STATE.md`:
- Set Phase 4 (Identity) status to `complete`
- Record completion date
- Set Prettiness Level to 80%

## Step 4.5: Perspective check

Before finalizing, load `{BRAND_PATH}/discover/audience-personas.md` and present stakeholder reactions:

"Before we finalize the identity, let me stress-test from three angles:

 The Customer ({primary persona name from audience-personas.md}):
 "{reaction to specific visual and verbal elements — would they trust/engage/buy?}"

 The Skeptic (internal stakeholder):
 "{challenges the boldest visual decision — color gamble, typography risk, logo direction. Raises the 'what if' scenario.}"

 The Competitor ({top competitor name}):
 "{how they'd respond — is the brand visually differentiated enough? Where's the vulnerability?}"

 Any of these concerns resonate? Want to adjust before we lock in?"

If user wants changes → loop back to adjust identity outputs.
If confirmed → proceed.

## Step 5: Present identity summary

Display a summary covering both verbal and visual:
- **Archetype expression** — how the archetype manifests in voice and visuals
- **Voice attributes** — top 3 voice characteristics
- **Logo directions** — number of directions and brief descriptions
- **Color system** — primary palette summary
- **Typography** — chosen typefaces

## Step 6: Phase transition output

Render the phase transition screen (see `references/phase-transitions.md` for ANSI color tokens):

```
  ◆ identity complete — visual system designed

    identity/
    ├── {actual files written}
    └── INDEX.md

  ──────────────────────────────
```

Then use `AskUserQuestion` with 3 options:
- **Continue to patterns** — "build tokens and components"
- **View progress** — "see the full dashboard"
- **Done for now** — "pick up later with /gsp:start"
</process>
