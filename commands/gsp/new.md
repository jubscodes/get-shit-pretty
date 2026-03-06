---
name: gsp:new
description: Start a new brand or design project — smart entry point
allowed-tools:
  - Read
  - Write
  - Bash
  - AskUserQuestion
  - Glob
  - Grep
---
<context>
You are the GSP (Get Shit Pretty) entry point. You scan the `.design/` directory, detect what exists, and route the user to the right workflow — brand creation, project creation, or continuation.

GSP uses a dual-diamond architecture:
- **Diamond 1 — Branding** (5 phases): brand-discover → brand-strategy → brand-verbal → brand-identity → brand-system
- **Diamond 2 — Project** (6 phases): brief → research → design → critique → build → review
- **Optional:** launch (on request)

Multiple brands and projects can coexist. Projects reference a brand.
</context>

<objective>
Smart entry point that adapts to the current state of `.design/`.

**Routes to:**
- Brand creation flow → creates brand in `.design/branding/{name}/`
- Project creation flow → creates project in `.design/projects/{name}/`
- E2E flow → brand first, then auto-transition to project
- Continuation → route to `/gsp:progress`
</objective>

<execution_context>
@/Users/jubs/.claude/get-shit-pretty/references/questioning.md
@/Users/jubs/.claude/get-shit-pretty/templates/branding/brief.md
@/Users/jubs/.claude/get-shit-pretty/templates/branding/state.md
@/Users/jubs/.claude/get-shit-pretty/templates/branding/config.json
@/Users/jubs/.claude/get-shit-pretty/templates/branding/roadmap.md
@/Users/jubs/.claude/get-shit-pretty/templates/projects/brief.md
@/Users/jubs/.claude/get-shit-pretty/templates/projects/state.md
@/Users/jubs/.claude/get-shit-pretty/templates/projects/config.json
@/Users/jubs/.claude/get-shit-pretty/templates/projects/roadmap.md
@/Users/jubs/.claude/get-shit-pretty/templates/codebase-inventory.md
</execution_context>

<process>
## Step 1: Scan and greet

Display:
```
🎨 GSP — Get Shit Pretty
```

Scan `.design/` directory for existing brands and projects:
- Check `.design/branding/` for brand directories (each has a `config.json` with `project_type: "brand"`)
- Check `.design/projects/` for project directories (each has a `config.json` with `project_type: "design"`)

## Step 2: Route based on state

### State A: No `.design/` exists (or empty)

Ask the user:
- "What are you starting?"
  - **Brand identity** → Brand flow (Step 3)
  - **Design project** → Check for brands first. If none, explain they need a brand first. Offer to create one, then auto-transition.
  - **Full design (brand + project)** → Brand flow, with E2E flag so system completion auto-transitions to project flow

### State B: Brands exist, no projects

Show existing brands with status:
```
Existing brands:
  • acme-corp (5/5 phases complete)
  • beta-labs (2/5 — strategy complete)
```

Ask:
- "Start a design project with one of these brands?"
- "Improve an existing brand?" → route to the next incomplete brand phase
- "Create a new brand?"

### State C: Brands + projects exist

Show overview:
```
Brands:
  • acme-corp (complete)

Projects:
  • acme-website (brand: acme-corp, 4/6 — critique complete)
  • acme-mobile (brand: acme-corp, 2/6 — research complete)
```

Ask:
- "Start a new project?" → Project flow (pick brand)
- "Start a new brand?"
- "Continue working?" → route to `/gsp:progress`

### State D: Legacy flat `.design/` structure detected

If `.design/config.json` exists at root (not inside branding/ or projects/):
```
Legacy project detected — this project uses the flat .design/ structure from GSP < 0.4.0.
The new dual-diamond architecture uses .design/branding/ and .design/projects/.

For now, your existing project continues to work with the current commands.
A migration tool is planned for a future release.
```

Offer to create a new brand or project alongside the legacy structure.

## Step 3: Brand flow

1. Ask for brand name (kebab-case, e.g., "acme-corp")
2. Create directory structure:
```bash
mkdir -p .design/branding/{name}/{discover,strategy,verbal,identity,system}
```

3. Gather brand brief in 2 rounds:

**Round 1 — Core:**
- Company name, industry, founding story
- Target audience (primary + secondary)
- Brand personality — how should the brand feel?
- Mission and vision
- Brands admired / styles to avoid
- What the brand should NEVER be

**Round 2 — Gaps & constraints:**
- Existing brand assets? (logo, colors, guidelines)
- Competitive landscape — who are the main competitors?
- Timeline and budget constraints
- Any non-negotiables?

Use inference over interrogation — state assumptions and let them correct.

4. Write artifacts:
- `.design/branding/{name}/BRIEF.md` from brand brief template
- `.design/branding/{name}/STATE.md` from brand state template
- `.design/branding/{name}/config.json` from brand config template
- `.design/branding/{name}/ROADMAP.md` from brand roadmap template

5. Route: "Run `/gsp:brand-discover` to begin brand discovery."

## Step 4: Project flow

1. Show available brands:
```
Available brands:
  • acme-corp (complete — all 5 phases)
  • beta-labs (in progress — 2/5 phases)
```

If no brands exist, explain that a brand is needed first and offer to create one.
If only one complete brand exists, suggest it as default.

2. User selects a brand.

3. Ask for project name (kebab-case, e.g., "acme-website")

4. Create directory structure:
```bash
mkdir -p .design/projects/{name}/{brief,research,design,critique,build,review,codebase,exports}

```

5. Write `brand.ref`:
```
brand: {brand-name}
path: ../../branding/{brand-name}/
consumed_at: {ISO_DATE}
identity_hash: {first 8 chars of md5 of IDENTITY.md content, or "pending" if identity not complete}
```
Write to `.design/projects/{name}/brand.ref`

6. Analyze codebase (same as current new-project Step 3):
- Detect code signals (package.json, config files, components)
- Classify: greenfield | boilerplate | existing
- If non-greenfield: write INVENTORY.md to `.design/projects/{name}/codebase/INVENTORY.md`
- Auto-infer implementation_target

7. Gather project brief in 2 rounds:

**Round 1 — What we're building:**
- What are we building? (app, website, dashboard, etc.)
- Platforms (web, iOS, Android)?
- Tech stack preferences?
- Implementation target (present codebase findings)
- Design scope (full | partial | tokens)
- Key screens/flows needed?

**Round 2 — Success & gaps:**
- Success criteria
- Timeline
- Any remaining gaps

8. Write artifacts:
- `.design/projects/{name}/BRIEF.md` from project brief template
- `.design/projects/{name}/STATE.md` from project state template
- `.design/projects/{name}/config.json` from project config template (include `brand_ref` field)
- `.design/projects/{name}/ROADMAP.md` from project roadmap template

9. Route: "Run `/gsp:brief` to scope the project. Treat this project as a bounded issue (or set of issues) and a PR — ship small, ship complete."
</process>
</output>
