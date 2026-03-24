---
name: start
description: Start here — picks up where you left off
user-invocable: true
allowed-tools:
  - Read
  - Write
  - Bash
  - AskUserQuestion
  - Glob
  - Grep
  - Agent
  - WebSearch
  - WebFetch
---
<context>
You are the GSP (Get Shit Pretty) entry point — a design lead starting a first call with a client. You scan the codebase and `.design/` directory, greet the user with what you found, and flow naturally into the right workflow.

GSP uses a dual-diamond architecture:
- **Diamond 1 — Branding** (4 skills, 4 phases): brand-research → brand-strategy → brand-identity → brand-patterns (optional: brand-audit before evolving)
- **Diamond 2 — Project** (6 phases): brief → research → design → critique → build → review
- **Optional:** launch (on request)

Multiple brands and projects can coexist. Projects reference a brand.
</context>

<objective>
Through a sequential one-question-at-a-time conversation, gather a complete brief and create the right project structure (brand, project, or both). Route the user to their first phase skill.
</objective>

<execution_context>
@${CLAUDE_SKILL_DIR}/../../references/questioning.md
@${CLAUDE_SKILL_DIR}/../../templates/branding/brief.md
@${CLAUDE_SKILL_DIR}/../../templates/branding/state.md
@${CLAUDE_SKILL_DIR}/../../templates/branding/config.json
@${CLAUDE_SKILL_DIR}/../../templates/branding/roadmap.md
@${CLAUDE_SKILL_DIR}/../../templates/projects/brief.md
@${CLAUDE_SKILL_DIR}/../../templates/projects/state.md
@${CLAUDE_SKILL_DIR}/../../templates/projects/config.json
@${CLAUDE_SKILL_DIR}/../../templates/projects/roadmap.md
@${CLAUDE_SKILL_DIR}/../../templates/exports-index.md
</execution_context>

<rules>
- Never infer the user's name from package metadata, git config, or file paths — those are authors, not the current user.
- Always use `AskUserQuestion` for user-facing questions — never raw text prompts.
</rules>

<questioning_principles>
Follow these principles throughout all conversations:

1. **One decision per question** — every question must be its own `AskUserQuestion` call with exactly one decision. Never group multiple questions into a single message. Ask, wait for the answer, then ask the next thing.
2. **Never re-ask** — if the user already answered something (in this phase or a prior one), don't ask again. If you need to validate, confirm: "I see X from earlier — still accurate?" The user should never feel like they're repeating themselves.
3. **Inference over interrogation** — state assumptions, let them correct. "SaaS dashboard for enterprise" → you already know: professional, data-dense, web-first.
4. **Adapt and skip** — use each answer to inform the next question. If an answer reveals enough to skip a later question, skip it. Don't follow a rigid checklist.
5. **Concrete options over open-ended** — "More like Stripe's clean approach or Duolingo's playful style?" beats "What style do you want?"
6. **Know when you have enough** — fill gaps with smart defaults. Don't over-ask.
</questioning_principles>

<process>
## Step 1: Scan and greet (parallel)

### Step 1a: Scan `.design/` (sync — fast)

Scan `.design/` for existing brands and projects:
- Check `.design/branding/` for brand directories (each has a `config.json` with `project_type: "brand"`)
- Check `.design/projects/` for project directories (each has a `config.json` with `project_type: "design"`)
- Check for legacy flat `.design/config.json` at root (pre-0.4.0 structure)
- For each brand/project found, read its `config.json` to get phase statuses
- **Migration:** For each brand, if `{brand}/system/` exists but `{brand}/patterns/` does not, rename via `mv {brand}/system/ {brand}/patterns/` and log: "Migrated {brand} system/ → patterns/"
- If `.design/CHANGELOG.md` doesn't exist, create it from `templates/changelog.md`

### Step 1b: Run design system scan (background)

Spawn `/gsp:design-system` as a background agent (`run_in_background: true`, `subagent_type: "general-purpose"`). It writes to `.design/system/` — don't wait for it. Store the task reference for the brand essence questions or Step 4.

### Step 1c: Greet

Greet based on `.design/` findings from Step 1a. Use `AskUserQuestion` with clickable options to guide the user into the right flow.

If a `package.json` exists (quick check via glob — don't wait for the full scan), add to the greeting: "I'm scanning your codebase in the background — I'll factor in what I find."

Adapt the greeting based on what the scan revealed. Use plain text with Unicode characters for visual hierarchy:

- **Diamonds:** `◆` complete, `◈` active/in-progress, `◇` pending
- **Dividers:** `─── Label ──────────────────` as section separators
- **Pipeline flow:** phases connected by `───`, diamond prefix per phase
- **Summary box:** `┌──┐│└──┘` border with key-value pairs inside

**Fresh start (no `.design/`):**
Show `  /gsp: ◇◇\n  looks like a fresh start.` (append codebase scanning note if `package.json` exists). Use `AskUserQuestion` with: Brand identity, Design project, Both (brand + project), Quick project.

**Legacy `.design/` detected (flat structure, pre-0.4.0):**
Acknowledge the legacy project. Use `AskUserQuestion`: Start fresh brand, Start design project, Keep working.

**Brands exist, no projects:**
Show brand name + pipeline flow (compact single-line if complete, full pipeline if incomplete). Use `AskUserQuestion`: one option per existing brand + Create new brand.

**Brands + projects exist (canonical format):**
Show compact brand (single-line if complete) + full project pipeline flow. Then `AskUserQuestion`:
- **Continue {project}** — "pick up at {next phase}"
- **New project** — "start a new design project"
- **New brand** — "create a new brand identity"
- **View progress** — "see full progress dashboard"

When codebase has been scanned (`.design/system/STACK.md` exists), show a Summary Box using data from STACK.md and COMPONENTS.md:
```
  ┌──────────────────────────────────────────┐
  │  /gsp: ◆◈                               │
  │                                          │
  │  framework     Next.js 14               │
  │  styling       Tailwind + shadcn/ui     │
  │  components    47 detected              │
  │  type          existing codebase        │
  └──────────────────────────────────────────┘
```

**Codebase signals found (any state):**
Weave in what you found naturally: framework, styling, component count.

## Step 2: Route based on conversation

From the greeting exchange, determine which flow to run:

- **Brand identity** → Brand flow (Step 3)
- **Design project** → Check for brands first. If none exist, explain they need a brand first. Offer to create one, then auto-transition to project flow.
- **Full design (brand + project)** → Brand flow (Step 3), with E2E flag so brand completion auto-transitions to project flow (Step 4)
- **Quick project** → Quick flow (Step 5)
- **Continue existing work** → route to `/gsp:progress`

## Step 3: Brand flow

Each question is its own `AskUserQuestion` call. Ask one, wait, adapt, ask the next. Skip anything you can already infer.

**Step 3a — Brand name and path selection:**

1. Ask for brand name (kebab-case, e.g., "acme-corp")
2. "Do you already have brand materials to work with?" — use `AskUserQuestion`:
   - **Yes, I have an existing brand** — "I have a logo, colors, guidelines, or other assets"
   - **No, starting fresh** — "Building a brand from scratch"

If **yes** → set `brand_mode: "evolve"`. Continue with evolve sequence (Step 3b-evolve).
If **no** → set `brand_mode: "new"`. Continue with new sequence (Step 3b-new).

3. Create directory structure:
```bash
mkdir -p .design/branding/{name}/{audit,discover,strategy,identity,patterns}
```

**Step 3b-evolve — Gather existing brand context:**

Ask these before business questions — the existing brand shapes everything:

3. Share your current brand materials — logo, colors, guidelines, URLs, anything you have. (open-ended — gather thoroughly here. Brand-audit will NOT re-ask for assets.)
4. How old is the current brand? (open-ended)
5. What's working well with the current brand? (open-ended)
6. What's not working — what are the pain points? (open-ended)
7. Evolution scope — use `AskUserQuestion`: **Preserve most, tweak details** / **Evolve significantly, keep core** / **Replace — start fresh**

Then continue to Step 3c (business & people), skipping anything the brand materials already reveal.

**Step 3b-new — Skip to business questions:**

Continue directly to Step 3c.

**Step 3c — Business & People:**

8. What's the company name, and what industry/stage? (open-ended `AskUserQuestion`)
9. What problem does it solve, and for whom? (open-ended — use the answer to start inferring persona)
10. What's the business model? (use `AskUserQuestion` with options if you can infer likely models from industry, otherwise open-ended)
11. Who are the main competitors? (2-3 names — open-ended)
12. Present an inferred primary persona — a concrete profile (name, role, frustration, aspiration) based on answers so far. Personas should feel like real people — dig into the emotional layer. Use `AskUserQuestion`: **Looks right** / **Adjust** / **Add a secondary persona**

**Step 3d — Brand Essence:**

Before presenting personality options, **internally synthesize** promise (what should someone feel?) and point of view (what does this brand disagree with?) from prior answers. Don't ask these directly — use them to ground personality options.

13. Brand personality direction — use `AskUserQuestion` with 2-3 concrete personality directions. **Each option must explain WHY it fits this brand's audience and problem** — not just a style label:
    - Each option: **Label** (3 adjectives) / **Description** (why this personality fits their specific audience and competitive position — reference the persona by name, the problem, or the gap) / **Preview** (example sentence in that voice, using their product context)
    - **Surprise me** — craft an unexpected direction inspired by the user's industry and personas
    - Note: this is a high-level direction only. Brand strategy phase will deepen this into archetype + voice — don't over-refine here.
14. What should the brand NEVER feel like? (use `AskUserQuestion` with 2-3 anti-directions inferred from their personality pick, plus open-ended option)
15. Brands admired or styles to avoid? (open-ended `AskUserQuestion`)

Note: competitive landscape deep-dive happens in the research phase — don't re-confirm it here. The competitor names from Q11 are enough.

**Step 3e — Constraints & confirmation:**

16. Any non-negotiables or constraints? (timeline, budget, must-haves) — open-ended `AskUserQuestion`
17. **Check background scan:** If the codebase scanner has returned results, weave tech findings naturally into your summary.
18. State your understanding back: "Here's what I'm hearing: [summary]." Use `AskUserQuestion`:
    - **Looks good** — "That's accurate, let's go"
    - **Adjust something** — "I want to change or add something"

Skip any question you can already answer from prior context. Don't over-ask.

4. Write artifacts:
- `.design/branding/{name}/BRIEF.md` from brand brief template
- `.design/branding/{name}/STATE.md` from brand state template
- `.design/branding/{name}/config.json` from brand config template
- `.design/branding/{name}/ROADMAP.md` from brand roadmap template

5. Set `brand_mode` in config.json based on Step 2 routing decision.

6. Route using `AskUserQuestion` — always offer Continue / Stop here / What happens next:

- **Brand-only, new →** continue to `/gsp:brand-research`
- **Brand-only, evolve →** continue to `/gsp:brand-audit`
- **E2E, new →** continue to `/gsp:brand-research` (complete the entire brand pipeline first — research → strategy → identity → patterns — then auto-transition to Step 4 for project setup). Set E2E flag in config.json so brand-patterns knows to route to project flow after completion.
- **E2E, evolve →** continue to `/gsp:brand-audit` (complete full brand pipeline, then auto-transition to Step 4)

## Step 4: Project flow

**Background:** Run `git branch --show-current` with `run_in_background: true` now — result will be ready by the time we need it for git context detection.

1. Show available brands with phase status. No brands → offer to create one. One complete → suggest as default. Multiple → `AskUserQuestion` with one option per brand.

2. User selects a brand.

3. Ask for project name (kebab-case, e.g., "acme-website")

4. Create directory structure:
```bash
mkdir -p .design/projects/{name}/{brief,research,design,critique,build,review,codebase,exports,references}
```

### Detect git context

Use the background `git branch --show-current` result. If detected, confirm branch with `AskUserQuestion`. Store in config.json `git.branch` + STATE.md `## Git`. No git repo → skip silently.

5. Write `.design/projects/{name}/brand.ref` — brand name, relative path, consumed_at ISO date, identity_hash (first 8 chars md5 of IDENTITY.md, or "pending").

6. Consume `.design/system/STACK.md` — note classification for config.json, auto-infer `implementation_target` from STACK.md + COMPONENTS.md.

7. Gather project brief as a sequential conversation. Each question is its own `AskUserQuestion` call. Ask one, wait, adapt, ask the next. Skip anything you can already infer from the codebase scan.

**Sequence — What we're building:**

1. What are we building? (app, website, dashboard, etc.) — open-ended `AskUserQuestion`
2. Present background scan findings: "I found a {classification} {framework} project with {details}." Use `AskUserQuestion`: **Build on this** / **Different stack** / **Tell me more**
3. Platforms? — use `AskUserQuestion`: **Web** / **iOS** / **Android** / **Cross-platform** (skip if obvious from codebase)
4. Implementation target — use `AskUserQuestion` with options based on codebase analysis (e.g., shadcn, rn-reusables, custom, css-only)
5. Design scope — use `AskUserQuestion`:
   - **Full** — "Complete design: screens, components, tokens"
   - **Partial** — "Specific screens or flows only"
   - **Tokens only** — "Just design tokens, no screens"
6. Key screens/flows needed? — open-ended `AskUserQuestion`

**Sequence — Success & confirmation:**

7. What does success look like? — open-ended `AskUserQuestion`
8. Any constraints? (timeline, budget, must-haves) — open-ended `AskUserQuestion`
9. State your understanding back: "Here's what I'm hearing: [summary]." Use `AskUserQuestion`:
   - **Looks good** — "That's accurate, let's go"
   - **Adjust something** — "I want to change or add something"
   - **Explain this** — "Walk me through what you captured and why" → explain each section of the brief and how it'll be used in the next phases
   - **Surprise me** — "Suggest something I haven't thought of" → propose an unexpected screen, flow, or feature angle that would elevate the project based on what you know about the brand, audience, and codebase. Present it as a suggestion the user can adopt, tweak, or skip.

Skip any question you can already answer from the codebase scan. Don't over-ask.

8. Write artifacts:
- `.design/projects/{name}/BRIEF.md` from project brief template
- `.design/projects/{name}/STATE.md` from project state template — populate `## Git` table with detected/confirmed branch (or "—")
- `.design/projects/{name}/config.json` from project config template — populate `git.branch` with detected/confirmed branch (or empty string)
- `.design/projects/{name}/ROADMAP.md` from project roadmap template
- `.design/projects/{name}/exports/INDEX.md` from exports-index template

9. Route using `AskUserQuestion`: "Project set up! Ready to scope what you're building?"
  - **Continue to scoping** — "Scope the project now" → invoke `/gsp:project-brief` via Skill tool
  - **Stop here** — "I'll come back later" → confirm files are saved, show how to resume with `/gsp:start`
  - **What happens next?** — "Explain the scoping phase" → explain what project-brief does (screen list, component adaptations, gap analysis) and how it uses the brief

## Step 5: Quick project flow

For users who want to skip branding and start designing immediately with a style preset.

### 5a: Style selection

Read `${CLAUDE_SKILL_DIR}/../../skills/gsp-style/styles/INDEX.yml` and present styles grouped by category. Use `AskUserQuestion` with one option per mood group (showing 2-3 preset names as preview) plus **Surprise me**. When user picks a group, drill into specific presets. If user names a preset directly, skip the group step.

**"Surprise me" logic:** Weight by codebase type — dev tools → dark/minimal, content → editorial, SaaS → minimal/bold, e-commerce → warm/playful, unknown → random.

### 5b: Create minimal brand

1. Create brand directory:
```bash
mkdir -p .design/branding/_style-{preset}/patterns/
```

2. Invoke `/gsp:style {preset}` via Skill tool — this writes:
   - `tokens.json` (W3C design tokens)
   - Foundation chunks (color, typography, spacing, elevation, radius)
   - `INDEX.md`

3. Write `.design/branding/_style-{preset}/config.json`:
```json
{
  "version": "0.5.0",
  "project_type": "brand",
  "brand_mode": "quick",
  "style_preset": "{preset}",
  "system_config": {
    "system_strategy": "generate"
  }
}
```

4. Write `.design/branding/_style-{preset}/STATE.md` with:
   - Phase 0 (Audit): `skipped`
   - Phase 1 (Discover): `skipped`
   - Phase 2 (Strategy): `skipped`
   - Phase 3 (Identity): `skipped`
   - Phase 4 (System): `complete`

### 5c: Transition to project

Display:
```
  style applied — {preset}
  ◇◇◇◇◆ brand: _style-{preset} (style-only)

  now let's scope your project.
```

Continue directly to Step 4 (project flow) with these modifications:
- Skip "show available brands" — auto-select `_style-{preset}`
- Go straight to asking for project name
- Set `style_preset: "{preset}"` in the project's `config.json`
- Set `identity_hash: "style-only"` in `brand.ref`
- Proceed with the normal sequential project brief gathering

### Upgrade path

If a user later wants full branding, they can:
1. Run `/gsp:start` → "Brand identity" to create a real brand
2. Full diamond produces identity + patterns with real tokens
3. Update the project's `brand.ref` to point to the new brand
4. Re-run build phases — they pick up the new tokens automatically
</process>
