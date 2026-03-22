---
name: brand-patterns
description: Build your design system — tokens, components, preview
user-invocable: true
allowed-tools:
  - Read
  - Write
  - Bash
  - Agent
  - Grep
  - Glob
---
<context>
Phase 4 of the GSP branding diamond. Builds the design system (foundations, components, tokens), generates a self-contained brand preview HTML, and transitions the user from the branding diamond to the project diamond.

Adapts strategy based on codebase context — generates from scratch, extends an existing system, or redesigns with migration mapping.
</context>

<objective>
Build the design system, generate brand preview, and complete the branding diamond.

**Input:** Brand identity + strategy + BRIEF.md
**Output:** `{brand}/system/` (foundations/, components/, principles.md, tokens.json, {brand-name}.yml, {brand-name}.md, INDEX.md) + `{brand}/preview.html`
**Agent:** `gsp-system-architect`
</objective>

<execution_context>
@${CLAUDE_SKILL_DIR}/../../prompts/01-design-system-architect.md
@${CLAUDE_SKILL_DIR}/../../templates/phases/system.md
@${CLAUDE_SKILL_DIR}/../../references/design-tokens.md
</execution_context>

<process>
## Step 0: Resolve brand

Scan `.design/branding/` for brand directories. If only one brand exists, use it. If multiple, ask the user which brand to work on.

Set `BRAND_PATH` = `.design/branding/{brand}`

If BRAND_PATH doesn't exist, tell the user to run `/gsp:start` first.

## Step 1: Load context

### Identity (chunk-first)

Read `{BRAND_PATH}/identity/INDEX.md`. If it exists, load all identity chunks + `palettes.json`.

Fallback: read `{BRAND_PATH}/identity/IDENTITY.md` (legacy monolith) + `palettes.json`. Log: "⚠️ Legacy identity format detected — consider re-running /gsp:brand-identity for chunk output."

If neither exists, check if identity phase is complete in brand STATE.md. If not, tell the user to complete brand identity first (run `/gsp:brand-identity`).

### Strategy (selective, chunk-first)

Read `{BRAND_PATH}/strategy/INDEX.md`. If it exists, load selective chunks (voice-and-tone.md, brand-platform.md).
Fallback: read `{BRAND_PATH}/strategy/STRATEGY.md`.

### Brand context

Read:
- `{BRAND_PATH}/BRIEF.md` — business, personas, goals
- `{BRAND_PATH}/config.json` — get `system_config.system_strategy`, `system_config.tech_stack`, `system_config.style_base`

### Style base presets (format reference)

If `style_base` is a non-empty array, load each preset's files from `${CLAUDE_SKILL_DIR}/../gsp-style/styles/`:
- `{preset-name}.yml` — format reference for custom style output
- `{preset-name}.md` — format reference for custom style prompt

If `style_base` is empty or missing, load `${CLAUDE_SKILL_DIR}/../gsp-style/styles/professional.yml` and `${CLAUDE_SKILL_DIR}/../gsp-style/styles/professional.md` as the default format reference. The agent always needs at least one example to produce the custom style output.

## Step 1.5: Codebase awareness

**Always scan:** If `.design/system/` docs don't exist, invoke `/gsp:design-system` via Skill tool to scan the codebase. If they already exist, read them. Either way, load STACK.md, COMPONENTS.md, and TOKENS.md before continuing.

Then ask the user:
1. "Will this brand target a specific tech stack?" (React + Tailwind, React Native + NativeWind, vanilla CSS, etc.)
   - If the scan detected a stack, present it as the default: "I see you're using {framework} with {styling} — build on that?"
   - Store answer in `{BRAND_PATH}/config.json` → `system_config.tech_stack`
2. Based on scan results, determine system strategy:
   - If scan found existing tokens/components: "You have an existing design system. Want to evolve it, rethink it from scratch, or ignore it?"
   - Store strategy in `{BRAND_PATH}/config.json` → `system_config.system_strategy`
   - If scan found no tokens/components (greenfield/boilerplate): default to `generate`, skip the question

## Step 2: Determine system strategy

Read `system_config.system_strategy` from config.json (defaults to `generate` if missing).

Three strategies:

**GENERATE** (when `system_strategy` is `generate` or missing):
Full system from scratch. For `boilerplate` codebases, respect existing config structure (extend tailwind.config, not replace) and output tokens in the format the existing config uses (Tailwind extend, CSS custom properties, etc).

**EXTEND** (when `system_strategy` is `extend`):
Evolve the existing system rather than replacing it.
1. Audit existing tokens against the brand identity — keep what works, adjust what doesn't, fill gaps
2. Classify each existing component: KEEP / RESTYLE / REFACTOR / REPLACE
3. Design only net-new components not covered by existing ones
4. Output delta tokens — only new and changed values
5. Preserve existing naming conventions from `.design/system/CONVENTIONS.md`

**REFACTOR** (when `system_strategy` is `refactor`):
Redesign the system from the ground up, informed by what exists.
1. Read and understand existing tokens, components, patterns from `.design/system/` docs
2. Design a complete new system — same scope as GENERATE
3. Produce a migration mapping for every change
4. Preserve conventions unless the brand requires changes
5. Flag breaking changes explicitly

## Step 3: Spawn system architect — Pass 1: Foundations

Spawn the `gsp-system-architect` agent with:
- All identity chunks (or IDENTITY.md fallback) + palettes.json
- The BRIEF.md content
- The Design System Architect prompt (01)
- The system output template
- The design tokens reference
- The `system_strategy` and `tech_stack` values
- The `style_base` value + preset `.yml`/`.md` files (if loaded)
- The `.design/system/STACK.md`, `COMPONENTS.md`, `TOKENS.md` content (when exist)
- **Execution mode:** `"foundations"`
- **Output path:** `{BRAND_PATH}/system/`

The agent writes foundations only:
- `system/foundations/` (6 foundation chunks)
- `system/principles.md`
- `system/tokens.json` (foundations-only)

## Step 3.5: Foundation review (interactive)

Read the foundation outputs and present:

"Here are the design system foundations:
 Color: {semantic mapping summary from foundations/color-system.md}
 Typography: {type scale summary from foundations/typography.md}
 Spacing: 8px base → {scale from foundations/spacing.md}
 Design principles: {list from principles.md}

 Everything right? Adjustments before building components?"

Wait for user input. If adjustments needed, update the relevant foundation chunks.

## Step 3.75: Perspective check

Before building components, load persona profiles from `{BRAND_PATH}/BRIEF.md` and present stakeholder reactions:

"Before we build the component library on these foundations:

 The Customer ({primary persona name from BRIEF.md}):
 "{would a user recognize this as {brand}? Does the system feel like the brand?}"

 The Skeptic (internal stakeholder):
 "{challenges system decisions — are the tokens flexible enough? Are the principles actionable?}"

 The Competitor ({top competitor name}):
 "{how does this system compare to industry standards? Any gaps?}"

 Any of these concerns resonate? Want to adjust foundations before building components?"

If user wants changes → update foundations.
If confirmed → proceed to components pass.

## Step 4: Spawn system architect — Pass 2: Components

Spawn the `gsp-system-architect` agent with:
- The existing foundations from Pass 1
- All identity chunks + palettes.json
- Strategy chunks: voice-and-tone.md, archetype.md, positioning.md (needed for custom style output)
- `.design/system/STACK.md`, `COMPONENTS.md`, `TOKENS.md` (if exist — component library detection for token mapping)
- The `style_base` value + preset `.yml`/`.md` files (if loaded)
- **Execution mode:** `"components"`
- Confirmed component scope from Step 1.5
- **Output path:** `{BRAND_PATH}/system/`

The agent writes components + custom style:
- `system/components/` (one per component)
- Updates `system/tokens.json` (adds component tokens)
- `system/{brand-name}.yml` (custom style preset — portable, reusable)
- `system/{brand-name}.md` (custom style prompt — AI-ready)
- `system/INDEX.md`

## Step 4.5: Update state

Update `{BRAND_PATH}/STATE.md`:
- Set Phase 4 (System) status to `complete`
- Record completion date
- Set Prettiness Level to 100%

## Step 4.75: Generate brand preview

Create a self-contained HTML file at `{BRAND_PATH}/preview.html`.

Read all available brand outputs:
- `{BRAND_PATH}/identity/palettes.json` — color palette data
- `{BRAND_PATH}/identity/color-system.md` — color roles and usage
- `{BRAND_PATH}/identity/typography.md` — type scale and families
- `{BRAND_PATH}/strategy/voice-and-tone.md` — voice attributes (means / doesn't mean)
- `{BRAND_PATH}/strategy/messaging.md` — tagline directions
- `{BRAND_PATH}/identity/logo-directions.md` — logo direction descriptions
- `{BRAND_PATH}/strategy/archetype.md` — brand archetype

Generate a single self-contained HTML file with:
- **Embedded Google Fonts** `<link>` for the chosen typefaces
- **Page styled with brand colors** — background, text, and accent colors from palettes.json
- **Color palette swatches** — full ramp from 50→900 stops for each palette
- **Typography samples** — headings and body text at the defined type scale, using the chosen font families
- **Voice attributes** — each attribute with "means / doesn't mean" columns
- **Tagline directions** — listed with descriptions
- **Logo direction descriptions** — each direction with rationale
- **Archetype summary** — the selected archetype and its expression

Tell the user: "Brand kit saved to `preview.html` — open it in your browser to see your colors, typography, voice, and messaging in one page. You can also print or export to PDF as a shareable brand guide."

## Step 5: Phase transition output

Render phase transition (see `references/phase-transitions.md`).

Also display a brand summary after the standard transition — this is the final branding phase:

```
  brand complete — {brand-name}

    discover       {key finding}
    strategy       {archetype}, {positioning}, {top voice attributes}
    identity       {colors}, {typefaces}
    system         {N} foundations, {N} components

    preview: {BRAND_PATH}/preview.html
```
</process>
