---
name: brand-identity
description: Create your visual identity — logo, color, typography
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
Phase 3 of the GSP branding diamond. Creates the visual identity — logo system, color, typography, imagery — grounded in the strategy and voice defined in Phase 2.
</context>

<objective>
Build the brand's visual identity.

**Input:** Strategy chunks + BRIEF.md + discover/mood-board-direction.md
**Output:** `.design/branding/{brand}/identity/` (6 chunks + palettes.json + INDEX.md)
**Agent:** `gsp-identity-designer`
</objective>

<execution_context>
@${CLAUDE_SKILL_DIR}/../../prompts/02-brand-identity-creator.md
@${CLAUDE_SKILL_DIR}/../../templates/phases/identity.md
</execution_context>

<rules>
- Always use `AskUserQuestion` for user-facing questions — never raw text prompts
- Every visual decision must trace to strategy — archetype, positioning, or voice
- Artifacts must balance human readability with agent consumption for downstream phases
</rules>

<process>
## Step 0: Resolve brand

Scan `.design/branding/` for brand directories. One brand → use it. Multiple → use `AskUserQuestion`.

Set `BRAND_PATH` = `.design/branding/{brand}`
If missing, tell user to run `/gsp:start` first.

## Step 1: Validate prerequisites

Read `{BRAND_PATH}/STATE.md`. Strategy (Phase 2) must be complete.
If not: "Strategy isn't done yet. Run `/gsp:brand-strategy` first."

Load:
- `{BRAND_PATH}/BRIEF.md`
- `{BRAND_PATH}/strategy/INDEX.md` → load all 5 strategy chunks
- `{BRAND_PATH}/discover/mood-board-direction.md`

## Step 2: Visual direction

Load mood-board-direction.md + archetype visual tendencies.
If audit exists, load `audit/brand-inventory.md` for current visuals.

Present research context (compact — colors, typefaces, imagery from mood board + archetype tendencies).

Use `AskUserQuestion` with 2-3 visual directions:
- **Label:** direction name (e.g. "Minimal & Sharp")
- **Description:** color palette direction, typography feel, overall aesthetic
- **Preview:** "Palette: {key colors}. Type: {typeface style}. Feel: {1-line vibe}."

After selection, ask for hard constraints or visual references via `AskUserQuestion`:
- **No constraints** — "Go ahead with this direction"
- **Add constraints** — "I have specific requirements"

## Step 3: Spawn identity designer

Spawn the `gsp-identity-designer` agent with:
- BRIEF.md content
- Strategy chunks: archetype.md, positioning.md, brand-platform.md, voice-and-tone.md
- discover/mood-board-direction.md
- Brand Identity Creator prompt (02)
- Identity output template
- User-confirmed visual direction + constraints
- Audit chunks if they exist
- **Output path:** `{BRAND_PATH}/identity/`

The agent writes 6 chunks + palettes.json + INDEX.md:
1. `logo-directions.md`
2. `color-system.md`
3. `typography.md`
4. `imagery-style.md`
5. `brand-applications.md`
6. `brand-book.md`
7. `palettes.json`
8. `INDEX.md`

## Step 4: Perspective check

Load BRIEF.md personas. Present brief stress-test:

"Stress-testing the visual identity:

 {Primary persona name}: {1-line — would they trust this visual language?}
 Skeptic: {1-line — challenges the boldest visual decision}
 {Top competitor}: {1-line — is the brand visually differentiated?}

 Concerns?"

Use `AskUserQuestion`:
- **Lock it in** — "Identity looks solid"
- **Adjust** — "I want to change something"

## Step 5: Update state and route

Update `{BRAND_PATH}/STATE.md`: set Phase 3 (Identity) to `complete`, Prettiness Level to 80%.

Render phase transition, then use `AskUserQuestion`:
- **Continue to patterns** — "build tokens and components"
- **View progress** — "see the full dashboard"
- **Done for now** — "pick up later with /gsp:start"
</process>
