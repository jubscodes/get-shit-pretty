---
name: brand-identity
description: Create your visual identity — logo, color, typography
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
@${CLAUDE_SKILL_DIR}/../../references/color-composition.md
</execution_context>

<rules>
- Always use `AskUserQuestion` for user-facing questions — never raw text prompts
- One decision per question — never batch multiple questions in a single message
- Never re-ask what the user already answered in a prior phase — read BRIEF.md and strategy chunks, build on them
- Every visual decision must trace to strategy — archetype, positioning, or voice
- Artifacts must balance human readability with agent consumption for downstream phases
</rules>

<process>
## Step 0: Resolve brand

Resolve brand from `.design/branding/` (one → use it, multiple → ask). Set `BRAND_PATH`.
If missing, tell user to run `/gsp:start` first.

## Step 1: Validate prerequisites

Read `{BRAND_PATH}/STATE.md`. Strategy (Phase 2) must be complete.
If not: "Strategy isn't done yet. Run `/gsp:brand-strategy` first."

Load:
- `{BRAND_PATH}/BRIEF.md`
- `{BRAND_PATH}/strategy/INDEX.md` → load all 5 strategy chunks
- `{BRAND_PATH}/discover/mood-board-direction.md`
- `{BRAND_PATH}/config.json` → read `system_config.style_base`

### Style base presets

If `style_base` is a non-empty array, load each preset's files from `${CLAUDE_SKILL_DIR}/../gsp-style/styles/`:
- `{preset-name}.yml` — structured tokens (palette, typography, spacing)
- `{preset-name}.md` — design philosophy and AI prompt

These will be passed to the identity-designer agent as the aesthetic seed.

## Step 2: Visual direction

Load mood-board-direction.md + archetype visual tendencies.
If audit exists, load `audit/brand-inventory.md` for current visuals.

Present research context (compact — colors, typefaces, imagery from mood board + archetype tendencies). If style base presets are loaded, frame the visual directions around them:
- **Faithful** — follows the preset's aesthetic closely, adapting for this brand
- **Selective** — cherry-picks elements (e.g. typography approach but different palette)
- **Departure** — uses the preset as a point of contrast, defining what the brand is *not*

Use `AskUserQuestion` with 2-3 visual directions:
- **Label:** direction name (e.g. "Minimal & Sharp")
- **Description:** color palette direction, typography feel, overall aesthetic
- **Preview:** "Palette: {key colors}. Type: {typeface style}. Feel: {1-line vibe}."

## Step 2b: Constraints

After visual direction is confirmed, ask as a separate `AskUserQuestion`:
- **No constraints** — "Go ahead with this direction"
- **Add constraints** — "I have specific requirements (colors to avoid, accessibility needs, existing assets to match)"

## Step 3: Spawn identity designer

Spawn the `gsp-identity-designer` agent. **Inline all content** — the agent should not need to read any input files.

Pass in the agent prompt:
- **Content of** BRIEF.md (loaded in Step 1)
- **Content of** strategy chunks: archetype.md, positioning.md, brand-platform.md, voice-and-tone.md (loaded in Step 1)
- **Content of** discover/mood-board-direction.md (loaded in Step 1)
- **Content of** style base preset files `.yml` + `.md` (when loaded in Step 1)
- **Content of** audit/brand-inventory.md (when loaded in Step 2)
- Brand Identity Creator prompt (02), identity output template, color composition reference (from execution_context)
- User-confirmed visual direction + constraints
- **Output path:** `{BRAND_PATH}/identity/`

The agent writes 5 chunks + palettes.json + INDEX.md:
1. `logo-directions.md`
2. `color-system.md`
3. `typography.md`
4. `imagery-style.md`
5. `brand-applications.md`
6. `palettes.json`
7. `INDEX.md`

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

Render phase transition (see `references/phase-transitions.md`).
</process>
