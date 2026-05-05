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
**Output:** `{brand}/patterns/` ({brand-name}.yml, {brand-name}.theme.json, STYLE.md, guidelines.html, components/, INDEX.md)
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

Spawn the `gsp-brand-coherence` agent with a fresh context. Load the methodology and inline all inputs — the agent should not need to read files.

### Load
Read these and hold for inlining:
- `${CLAUDE_SKILL_DIR}/methodology/gsp-brand-coherence.md` — agent methodology
- `{BRAND_PATH}/patterns/{brand-name}.yml` — generated preset
- `{BRAND_PATH}/patterns/guidelines.html` — generated visual guide

Extract from Step 1 context:
- `archetype` — from archetype.md
- `brand_heartbeat` — from BRIEF.md

### Spawn `gsp-brand-coherence`

Pass inline:
- **Agent methodology** (loaded above)
- **Content of** `{brand-name}.yml`
- **Content of** `guidelines.html`
- `archetype` and `brand_heartbeat`

The agent returns a structured coherence report. No back-and-forth — one response.

### Present the report

Display the agent's report, then add:

```
  → open guidelines.html in your browser
  ─────────────────────────────────────
```

Use `AskUserQuestion`:
- **Looks right** — "Coherent — build components"
- **Push [tension 1]** — pre-fill with the specific gap from the report
- **Push [tension 2]** — same
- **Adjust something else** — "I want to change colors / type / patterns"

If refinement needed → invoke `/gsp-brand-refine` with the specific tension. After it completes, re-spawn `gsp-brand-coherence` with the updated `.yml` and `guidelines.html`. Only proceed to Step 3.75 when the archetype tension is present and dials are coherent.

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

## Step 4.75: Emit shadcn theme registry artifact

Generate `{brand-name}.theme.json` (registry:theme) alongside the existing patterns. This is the artifact `/gsp-brand-apply` installs into shadcn codebases.

```bash
node ${CLAUDE_SKILL_DIR}/bin/theme-css.js \
  {BRAND_PATH}/patterns/{brand-name}.yml \
  --registry \
  --output {BRAND_PATH}/patterns/{brand-name}.theme.json
```

Verify the file was written and contains valid JSON:

```bash
node -e "JSON.parse(require('fs').readFileSync('{BRAND_PATH}/patterns/{brand-name}.theme.json', 'utf8'))" \
  && echo "✓ theme.json emitted"
```

If either command fails, surface the error and stop — the brand pipeline is incomplete without this artifact.

## Step 4.8: Offer to apply theme to codebase

Detect installable target. Read project config (`.design/projects/*/config.json`) and look for `preferences.app_path`:

- If no project config exists, or `app_path` is empty/missing → skip this step. Output a one-line note: `Apply later with /gsp-brand-apply {brand-name}`. Continue to Step 4.5.
- If `app_path` exists, check `{app_path}/components.json`:
  - If missing → skip (no shadcn project to install into). Same one-line note.
  - If present → continue.

Detect currently-installed brand (informational):
- Resolve the CSS path from `{app_path}/components.json` → `.tailwind.css` (a relative path).
- Read `{app_path}/{cssPath}` if it exists.
- Look for OKLCH `:root` declarations.
- Compare `--background` light value against other `.design/branding/*/patterns/*.theme.json` files in the workspace.
- Set `CURRENT={matched-brand-name}` or `CURRENT="shadcn defaults"` or `CURRENT="(none)"`.

Use `AskUserQuestion`:
- Question: "Apply **{brand-name}** to `{app_path}`? Currently installed: **{CURRENT}**. This replaces cssVars in the CSS file; components stay as-is."
- Options:
  - A: "Apply now"
  - B: "Skip — I'll apply later"
  - C: "Apply to a different project"

On A: output `Run /gsp-brand-apply {brand-name}` as the next step the user should take.

On B: output `Skipped. Apply later with /gsp-brand-apply {brand-name}.`

On C: use `AskUserQuestion` to ask for the target path. Then output `Run /gsp-brand-apply {brand-name} --target {chosen-path}` as the next step.

Continue to Step 4.5 regardless of choice.

## Step 4.5: Update state

Update `{BRAND_PATH}/STATE.md`:
- Set Phase 4 (Patterns) status to `complete`
- Record completion date
- Set Prettiness Level to 100%

Update `.design/CLAUDE.md` — replace the existing `### {brand-name}` entry (written by gsp-brand-brief when started) with the completed entry:

```markdown
### {brand-name} · complete · {DATE}
"{brand_heartbeat}"
.design/branding/{brand-name}/patterns/ — guidelines.html · STYLE.md · {brand-name}.yml · {brand-name}.theme.json
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
</process>
