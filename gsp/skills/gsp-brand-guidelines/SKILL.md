---
name: gsp-brand-guidelines
description: Build design system tokens and STYLE.md (technical phase — benefits from capable models) — use when: create the design system, generate tokens, finalize brand guidelines, build the component system
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
Phase 4 of the GSP branding diamond. Transforms the brand identity into operational artifacts that designer and builder agents consume — the `.yml` preset (source of truth), STYLE.md (agent contract), component token mapping, and `guidelines.html` (what the user sees).

Identity made the creative decisions. This phase makes them work in code.
</context>

<objective>
Operationalize brand identity into project-ready artifacts and complete the branding diamond.

**Input:** Brand identity (enriched by domain skills) + strategy + BRIEF.md
**Output:** `{brand}/patterns/` ({brand-name}.yml, STYLE.md, guidelines.html, components/, INDEX.md)
**Agent:** `gsp-brand-engineer`
</objective>

<rules>
- Always use `AskUserQuestion` for user-facing questions — never raw text prompts
- One decision per question — never batch multiple questions in a single message
</rules>

<process>
## Step 0: Resolve brand

Resolve brand from `.design/branding/` (one → use it, multiple → ask). Set `BRAND_PATH`.
If BRAND_PATH doesn't exist, tell the user to run `/gsp-start` first.

## Step 1: Load context

### Identity (chunk-first)

Read `{BRAND_PATH}/identity/INDEX.md`. If it exists, load all identity chunks + `palettes.json`.

If INDEX.md doesn't exist, check if identity phase is complete in brand STATE.md. If not, tell the user to complete brand identity first (run `/gsp-brand-identity`).

### Strategy (selective, chunk-first)

Read `{BRAND_PATH}/strategy/INDEX.md`. If it exists, load: voice-and-tone.md, archetype.md, positioning.md.

### Brand context

Read:
- `{BRAND_PATH}/BRIEF.md` — business, personas, goals
- `{BRAND_PATH}/config.json` — get `system_config.system_strategy`, `system_config.tech_stack`, `system_config.style_base`

### Style base presets

If `style_base` is a non-empty array, load each preset's files from `${CLAUDE_SKILL_DIR}/../gsp-style/styles/`:
- `{preset-name}.yml` — structural scaffold (tokens + intensity + patterns + constraints + effects)
- `{preset-name}.md` — design philosophy, bold bets, implementation patterns (CSS recipes, textures, animations)

Both files are needed: the `.yml` provides the structure to inherit from, the `.md` provides the philosophy and implementation content for STYLE.md rendering.

If `style_base` is empty or missing, load `${CLAUDE_SKILL_DIR}/../gsp-style/styles/professional.yml` and `professional.md` as the default format reference. The agent always needs at least one example to produce the custom style output.

## Step 1.5: Codebase awareness

**Always scan:** If `.design/system/` docs don't exist, invoke `/gsp-design-system` via Skill tool to scan the codebase. If they already exist, read them. Either way, load STACK.md, COMPONENTS.md, and TOKENS.md before continuing.

Then ask the user (each as its own `AskUserQuestion`):

1. Tech stack — if the scan detected a stack, use `AskUserQuestion`:
   - **Yes, build on {framework} + {styling}** — "Use what's already here"
   - **Different stack** — "I want to target a different tech stack"
   If no stack detected, use open-ended `AskUserQuestion`: "What tech stack will this brand target?"
   Store answer in `{BRAND_PATH}/config.json` → `system_config.tech_stack`

2. System strategy — only ask if scan found existing tokens/components. Use `AskUserQuestion`:
   - **Evolve** — "Extend the existing design system"
   - **Rethink** — "Redesign from scratch, informed by what exists"
   - **Ignore** — "Start fresh, don't reference the existing system"
   Store strategy in `{BRAND_PATH}/config.json` → `system_config.system_strategy`
   If scan found no tokens/components (greenfield/boilerplate): default to `generate`, skip this question

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

## Step 3: Spawn brand engineer — Pass 1: Core

### Load references and agent methodology
Read these files and hold their content for inlining into the agent prompt:
- `${CLAUDE_SKILL_DIR}/../../templates/phases/patterns.md` — patterns output template
- `${CLAUDE_SKILL_DIR}/design-tokens.md` — design tokens reference
- `${CLAUDE_SKILL_DIR}/guidelines-structure.md` — guidelines.html structure spec (shadcn tokens, sections, primitive classes)
- `${CLAUDE_SKILL_DIR}/methodology/gsp-brand-engineer.md` — agent methodology

Spawn the `gsp-brand-engineer` agent. **Inline all content** — the agent should not need to read input files.

Pass in the agent prompt:
- **Content of** all identity chunks + palettes.json (loaded in Step 1)
- **Content of** strategy chunks: voice-and-tone.md, archetype.md, positioning.md (loaded in Step 1)
- **Content of** BRIEF.md (loaded in Step 1) — explicitly pass the `brand_heartbeat` field as a named input so the agent uses it in the hero headline if no manifesto line exists yet
- **Content of** style base preset `.yml` + `.md` (loaded in Step 1) — `.yml` as structural scaffold, `.md` as philosophy + implementation content for STYLE.md
- **Agent methodology** (loaded above)
- **Content of** patterns output template (loaded above)
- **Content of** design tokens reference (loaded above)
- **Content of** guidelines structure spec (loaded above) — follow this exactly for `guidelines.html`
- The `system_strategy` and `tech_stack` values
- **Output path:** `{BRAND_PATH}/patterns/`

> Produce the core brand artifacts ONLY:
> 1. `{brand-name}.yml` — source of truth (tokens + intensity + patterns + constraints + effects)
> 2. `STYLE.md` — agent contract (rendered from `.yml` + philosophy + bold bets)
> 3. `guidelines.html` — visual brand guide (what the user sees in their browser)
> 4. `INDEX.md` — core files only for now
>
> Do NOT produce component artifacts yet (token-mapping, overrides, custom specs). Those come after the user reviews the visual output.

## Step 3.5: Coherence check

Read the generated `{BRAND_PATH}/patterns/{brand-name}.yml` and `{BRAND_PATH}/patterns/guidelines.html`. Read `brand_heartbeat` and archetype from `{BRAND_PATH}/BRIEF.md` and `{BRAND_PATH}/strategy/archetype.md`. Do the work of critique before showing the user anything — the pipeline catches coherence gaps, not the user.

**Archetype gate first.** The intensity dials are only meaningful against the archetype. Before scoring dials, answer the archetype's signature question:
- **Jester** — what specific rule is being broken in the visual system? If nothing is broken, the brand is not Jester enough regardless of what the dials say.
- **Rebel** — what visual convention is explicitly rejected?
- **Creator** — what is distinctively crafted that couldn't come from a default template?
- **Sage** — is the restraint active (every reduction is intentional) or passive (just plain)?
- **Explorer** — where is the sense of movement, discovery, or possibility?
- (Apply equivalent for all archetypes)

If the archetype's signature tension isn't present in the output, that is the primary tension — flag it before evaluating dials.

**Intensity dial scoring (secondary):**
Read token values from the `.yml` and infer what they express visually. A variance dial of 8/10 with `radius.lg: 4px`, standard shadows, and default button shapes is a coherence gap — the tokens are conservative regardless of the declared number. Score each dial as: declared N/10 → expressed N/10 (inferred from token values and HTML patterns).

Surface the top 2 tensions — specific and actionable. Not "could be bolder" but "border-radius is 4px across all components — that reads as variance 3/10. The declared dial is 8/10. Intentional restraint or a miss?"

**Present the coherence check, then the summary:**

```
  {brand-name}  ·  {archetype}  ·  {brand_heartbeat}
  ═══════════════════════════════════════════════════

    intensity dials vs. output
      variance   declared {N}/10  →  reads {N}/10  {✓ or ⚠}
      motion     declared {N}/10  →  reads {N}/10  {✓ or ⚠}
      density    declared {N}/10  →  reads {N}/10  {✓ or ⚠}

    tensions
      1. {specific gap — e.g. "border-radius (4px) undershoots variance 8/10 target"}
      2. {specific gap — e.g. "button style is conventional — no Jester rule broken"}

    bold bets
      {1-line summary of the most distinctive choice made}

    → open guidelines.html in your browser

  ─────────────────────────────────────
```

If all dials are coherent (no ⚠), skip the tensions block and present directly.

Use `AskUserQuestion`:
- **Looks right** — "Coherent — build components"
- **Push [tension 1]** — pre-fill with the specific gap so the user can confirm or redirect
- **Push [tension 2]** — same
- **Adjust something else** — "I want to change colors / type / patterns"

If refinement needed → invoke `/gsp-brand-refine` with the specific tension as the brief. After it completes, re-read the updated `.yml` and `guidelines.html` and re-run the coherence check from the top. Only proceed to Step 3.75 when the archetype tension is present and dials are coherent.

## Step 3.75: Perspective check

Load persona profiles and the `brand_heartbeat` from `{BRAND_PATH}/BRIEF.md`. Present stakeholder reactions framed around the compass:

```
  stress-testing against: "{brand_heartbeat}"

  {primary persona name}: {does this visual language make them feel that sentence?}
  Skeptic: {does the intensity feel calibrated — or is it playing it safe?}
  {top competitor}: {is the brand visually distinct enough to own this feeling?}
```

Use `AskUserQuestion`:
- **Lock it in** — "The brand earns that feeling — build components"
- **Adjust** — "One of these concerns resonates"

If adjust → invoke `/gsp-brand-refine` with the concern, re-present. If confirmed → proceed to components.

## Step 4: Spawn brand engineer — Pass 2: Components

Spawn the `gsp-brand-engineer` agent with (reuse **Agent methodology** loaded in Step 3):
- **Content of** the confirmed `{BRAND_PATH}/patterns/{brand-name}.yml`
- **Content of** `{BRAND_PATH}/patterns/STYLE.md`
- **Content of** `.design/system/STACK.md`, `COMPONENTS.md`, `TOKENS.md` (when loaded in Step 1.5)
- The `system_strategy` and `tech_stack` values
- **Agent methodology** (loaded in Step 3)
- **Content of** design tokens reference (loaded in Step 3)
- **Output path:** `{BRAND_PATH}/patterns/`

> Produce the component artifacts:
> 1. `components/token-mapping.md` — brand tokens → library theming API (always)
> 2. Component override specs (selective — only when tokens aren't enough)
> 3. Custom component specs (selective — brand-distinctive with no library equivalent)
> 4. Update `INDEX.md` with the components section
>
> The `.yml` and `STYLE.md` are confirmed — do not modify them. Focus on mapping tokens to the detected component library and specifying overrides.

## Step 4.5: Update state

Update `{BRAND_PATH}/STATE.md`:
- Set Phase 4 (Patterns) status to `complete`
- Record completion date
- Set Prettiness Level to 100%

Update `.design/CLAUDE.md` — replace the existing `### {brand-name}` entry (written by gsp-brand-brief when started) with the completed entry:

```markdown
### {brand-name} · complete · {DATE}
"{brand_heartbeat}"
.design/branding/{brand-name}/patterns/ — guidelines.html · STYLE.md · {brand-name}.yml
```

## Step 5: Phase transition output

Invoke `/gsp-phase-transition` with phase `guidelines` and output directory `{BRAND_PATH}/patterns/`.

**E2E mode:** Read `{BRAND_PATH}/config.json`. If `e2e` is `true`, auto-invoke `/gsp-start` via Skill tool — it will detect the completed brand and route directly to project setup (Step 4). No need to ask the user.

**Non-E2E:** When the user chooses "Start a project", invoke `/gsp-start` via the Skill tool. Do NOT attempt to handle project setup inline — `/gsp-start` has the codebase scanning, questioning rounds, and brief-writing logic needed for a proper project setup. The branding agent's context is spent on brand work and lacks the project setup methodology.

Also display a brand summary after the standard transition — this is the final branding phase:

```
  brand complete — {brand-name}
  "{brand_heartbeat}"

    discover       {key finding}
    strategy       {archetype}, {positioning}, {top voice attributes}
    identity       {colors}, {typefaces}
    guidelines     .yml + STYLE.md + {N} components + guidelines.html

    open: {BRAND_PATH}/patterns/guidelines.html
```

The `brand_heartbeat` line at the top closes the narrative — the emotional compass written in the brief is the first thing the user said about this brand, and the last thing they see when it's done.
</process>
