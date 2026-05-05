---
name: gsp-brand-identity
description: Create visual identity — logo, color, typography (creative phase — benefits from capable models) — use when: design the logo, pick colors, choose fonts, create the visual identity
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
**Agent:** `gsp-brand-creative-director`
</objective>

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
If missing, tell user to run `/gsp-start` first.

## Step 1: Validate prerequisites

Read `{BRAND_PATH}/STATE.md`. Strategy (Phase 2) must be complete.
If not: "Strategy isn't done yet. Run `/gsp-brand-strategy` first."

Load:
- `{BRAND_PATH}/BRIEF.md`
- `{BRAND_PATH}/strategy/INDEX.md` → load all 5 strategy chunks
- `{BRAND_PATH}/discover/mood-board-direction.md`
- `{BRAND_PATH}/config.json` → read `system_config.style_base`

### Style base presets

If `style_base` is a non-empty array, load each preset's files from `${CLAUDE_SKILL_DIR}/../gsp-style/styles/`:
- `{preset-name}.yml` — tokens + intensity + patterns + constraints + effects (structural scaffold)
- `{preset-name}.md` — design philosophy, signature techniques, implementation patterns (creative context)

Both files matter: the `.yml` gives the creative-director the aesthetic rules to respect, the `.md` gives the emotional DNA and visual signatures to channel. The creative-director adapts the brand within the preset's structure — respecting intensity dials, patterns, and constraints while bringing the brand's unique personality.

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

## Step 3: Spawn creative director

### Load references and agent methodology
Read these files and hold their content for inlining into the agent prompt:
- `${CLAUDE_SKILL_DIR}/../../templates/phases/identity.md` — identity output template
- `${CLAUDE_SKILL_DIR}/../gsp-color/references/color-composition.md` — color composition reference
- `${CLAUDE_SKILL_DIR}/methodology/gsp-brand-creative-director.md` — agent methodology

Spawn the `gsp-brand-creative-director` agent. **Inline all content** — the agent should not need to read any input files.

Pass in the agent prompt:
- **Content of** BRIEF.md (loaded in Step 1)
- **Content of** strategy chunks: archetype.md, positioning.md, brand-platform.md, voice-and-tone.md, messaging.md (all 5 loaded in Step 1; older brands without messaging.md proceed without it). Tagline directions and core message in `messaging.md` materially shape logo concept rationale and typography voice — do not skip it.
- **Content of** discover/mood-board-direction.md (loaded in Step 1)
- **Content of** style base preset `.yml` + `.md` (when loaded in Step 1) — `.yml` as structural scaffold, `.md` as design philosophy and signature techniques
- **Content of** audit/brand-inventory.md (when loaded in Step 2)
- **Agent methodology** (loaded above)
- **Content of** identity output template (loaded above)
- **Content of** color composition reference (loaded above)
- User-confirmed visual direction + constraints
- **Output path:** `{BRAND_PATH}/identity/`

The agent writes 5 chunks + INDEX.md (creative decisions only — no technical execution):
1. `logo-directions.md`
2. `color-system.md` (chosen colors + rationale, no OKLCH/contrast math)
3. `typography.md` (chosen typefaces + rationale, no scale math)
4. `imagery-style.md` (creative direction, no icon library specifics)
5. `brand-applications.md`
6. `INDEX.md`

## Step 3.5: Enrich with domain skills (parallel)

After the creative-director finishes, invoke all 5 domain skills in parallel — they operate on separate chunks with zero dependencies:

- **`/gsp-logo --enrich`** — reads `logo-directions.md`, enriches with construction geometry, variation specs, clear space rules, minimum size calculations.
- **`/gsp-color --enrich`** — reads `color-system.md`, generates OKLCH palettes via tints.dev, calculates WCAG contrast, writes `palettes.json`, enriches with contrast ratios and semantic mapping.
- **`/gsp-typography --enrich`** — reads `typography.md`, generates mathematical type scale, adds fluid type formulas, enriches with font loading instructions.
- **`/gsp-visuals --imagery --enrich`** — reads `imagery-style.md`, enriches with photography/illustration direction, CSS texture/treatment recipes, image processing implementation. Icons are NOT covered here — `gsp-icons` owns them.
- **`/gsp-icons --enrich`** — defines the icon system: library selection, stroke standardization, size system, container treatments, custom SVG direction.

Invoke all 5 using the Skill tool simultaneously. Each skill loads its own domain references on-demand — no upfront context cost.

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

Invoke `/gsp-phase-transition` with phase `identity` and output directory `{BRAND_PATH}/identity/`.
</process>
