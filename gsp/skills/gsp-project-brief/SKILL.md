---
name: gsp-project-brief
description: Scope a feature or flow — use when: scope this, define what we're building, plan the project, what should we build, write a brief
user-invocable: true
allowed-tools:
  - Read
  - Write
  - Bash
  - Grep
  - Glob
---
<context>
Phase 1 of the GSP project diamond. Scopes the project by determining what screens and components are needed, what adaptations the brand system requires for this specific project, and performs gap analysis against the codebase.

Encourages treating the project as a bounded issue (or set of issues) and a PR — ship small, ship complete.

Works with the dual-diamond architecture: reads brand system from `.design/branding/{brand}/patterns/` via `brand.ref`, reads/writes project assets in `.design/projects/{project}/`.
</context>

<objective>
Scope the project and plan adaptations from the brand system.

**Input:** Brand system (via brand.ref) + project BRIEF.md + config.json
**Output:** `{project}/brief/` (scope.md, target-adaptations.md, conditionals, INDEX.md)
</objective>

<execution_context>
@${CLAUDE_SKILL_DIR}/../../templates/phases/brief.md
</execution_context>

<process>
## Step 0: Resolve project and brand

If `.design/projects/` does not exist: output "No GSP project found. Run `/gsp-start` to begin." and stop.

Resolve project from `.design/projects/` (one → use it, multiple → ask). Set `PROJECT_PATH`.

Read `{PROJECT_PATH}/brand.ref` → set `BRAND_PATH`. If brand.ref doesn't exist, tell the user to run `/gsp-start`.

## Step 1: Load context

### Brand patterns (chunk-first)

Read `{BRAND_PATH}/patterns/INDEX.md`. If it exists, load all foundation chunks + selective component chunks.

If it doesn't exist, tell the user to run `/gsp-brand-guidelines` first to create the brand's design patterns.

Also read the brand `.yml` preset from `{BRAND_PATH}/patterns/`.

### Project context

Read:
- `{PROJECT_PATH}/BRIEF.md` — what we're building, platforms, tech stack
- `{PROJECT_PATH}/config.json` — get `implementation_target`, `design_scope`, `codebase_type`, `app_path`, `repo_type`, `accessibility_level`, `style_preset`

After reading config, check if `app_path` is empty. If empty AND (`repo_type` is `monorepo` OR multiple `package.json` files are found at `apps/*/package.json` or `packages/*/package.json`), set flag `NEEDS_APP_SELECTION = true`.

**Expertise pointers:**
- `accessibility_level` (AA vs AAA) carries scope implications for contrast-sensitive components — see `${CLAUDE_SKILL_DIR}/../gsp-accessibility/SKILL.md` for level interpretation when reasoning about adaptations
- `style_preset` (when set) drives style-preset-specific component conventions — see `${CLAUDE_SKILL_DIR}/../gsp-style/styles/{preset}.md` for the preset's patterns + constraints + effects vocabulary that adaptation reasoning should respect
- When writing token overrides in `target-adaptations.md`, consult `${CLAUDE_SKILL_DIR}/../gsp-color/domains/palette.md` for OKLCH/contrast considerations and `${CLAUDE_SKILL_DIR}/../gsp-typography/domains/scale.md` for type-scale ratios

### Codebase context

Read `.design/system/STACK.md` and `.design/system/COMPONENTS.md` (if exist) — existing tech stack, components, architecture.

**Stack inheritance (existing codebases):** If `STACK.md` exists and the project `config.json` has empty or generic values for `tech_stack`, `implementation_target`, or `codebase_type`, inherit them from `STACK.md` directly — do not ask the user questions the stack already answers. Update `config.json` with the inherited values before proceeding.

The global stack is the compliance baseline. Every project in this workspace must target it. If the user's brief describes a different stack than what `STACK.md` declares (e.g., "I want to use Radix directly" when `STACK.md` says `shadcn/ui`), surface the conflict: "⚠️ Your brief mentions {X}, but the workspace stack is {Y} per STACK.md. Proceed with the workspace stack, or update STACK.md first?"

Read `.design/CHANGELOG.md` — quick history of what prior projects built.
For projects with overlapping scope, read their `codebase/MANIFEST.md` for detail.
Glob `.design/projects/*/STATE.md` — detect active sibling projects.

## Step 1.3: App targeting

Run when `NEEDS_APP_SELECTION = true`.

1. Glob for `apps/*/package.json` and `packages/*/package.json` to find all app packages.
2. Read each package.json to extract `name` and the primary framework dependency (Next.js, Vite, React Native, etc.).
3. Build an app list, e.g.:
   ```
   apps/web        → my-app-web     (Next.js)
   apps/mobile     → my-app-mobile  (Expo / React Native)
   packages/ui     → my-app-ui      (Vite)
   ```
4. Use `AskUserQuestion`: "Which app does this project target?" with one option per detected app (showing path + framework) plus **Whole repo (no specific app)**.
5. Based on the user's choice:
   - If an app was selected: set `app_path` to the chosen path (e.g. `apps/web`) and `repo_type` to `monorepo`
   - If "Whole repo" was selected: set `app_path` to `""` and `repo_type` to `monorepo`
6. Write the updated `app_path` and `repo_type` back to `{PROJECT_PATH}/config.json`.
7. Derive `APP_NAME` = last segment of `app_path` (e.g. `apps/web` → `web`, empty → `root`). Note that the per-app stack file will live at `.design/system/stacks/{APP_NAME}.md`.

## Step 1.5: Scope check

**If `design_scope` is `tokens`:**
1. Update `{PROJECT_PATH}/STATE.md` — set Phase 1 (Brief) status to `skipped`
2. Display: "Brief phase skipped — design scope is `tokens`."
3. Route: "Run `/gsp-project-build`."
4. Stop here.

## Step 1.7: Issue framing

Ask the user (via `AskUserQuestion`): "Is this project linked to a GitHub issue?"
- **Yes — paste the issue URL** → read the issue number from the URL, write `git.issue` to `{PROJECT_PATH}/config.json` and populate the `| Issue |` row in STATE.md. Also read the issue title/body via `gh issue view {number} --json title,body,labels` and use that content to pre-populate scope context (saves the user from re-describing what the issue already states).
- **No — describe it** → continue with manual brief as before
- **Skip** → continue without issue link

## Step 2: Scope the project

Using all context loaded in Step 1, scope the project directly. Act as a Senior Design Project Lead bridging the brand system and the project's specific needs.

If any sibling project is active and its scope overlaps with this project, flag it: "⚠️ {name} is actively working on {scope}. Coordinate to avoid conflicts."
If this project modifies components from a sibling's manifest, note provenance.

### Scoping process

1. **Analyze brief** — what's being built, for whom, on what platforms
2. **Define screen list** — prioritized screens from brief, user flows, success criteria
3. **Map component scope** — which brand system components this project needs
4. **Identify adaptations** — project-specific variants, overrides, or extensions to brand components
5. **Map to implementation target** — connect design components to target primitives (shadcn, rn-reusables, existing, code)
6. **Gap analysis** (existing codebases) — what's in the brand system but missing from the codebase
7. **Generate install manifest** (shadcn/rn-reusables) — install commands for needed components
8. **Issue framing** — suggest how to break the project into bounded, shippable issues

### Quality standards

- Every screen has a clear purpose and priority level
- Component adaptations reference specific brand system components
- Gap analysis is concrete (component names, token names)
- Install manifests are copy-paste ready
- Scope boundaries are explicit (what's in, what's out)

### Write chunks to `{PROJECT_PATH}/brief/`

Use the brief output template from execution_context for chunk formatting.

1. **`scope.md`** (~80-120 lines) — prioritized screen list, component scope, project boundaries, success criteria, dependencies, issue framing
2. **`target-adaptations.md`** (~60-100 lines) — token overrides, component adaptations, platform considerations, implementation target mapping
3. **`install-manifest.md`** (shadcn/rn-reusables only) — install commands for all needed components
4. **`gap-analysis.md`** (existing target only) — components/tokens in brand system but not in codebase
5. **`file-references.md`** (existing target only) — paths to existing components/tokens being used

Cross-references: `target-adaptations.md` links to `{BRAND_PATH}/patterns/components/{name}.md`; `gap-analysis.md` links to brand system components and tokens; `scope.md` references the project BRIEF.md.

### Write `INDEX.md`

```markdown
# Brief
> Phase: brief | Project: {name} | Generated: {DATE}

## Scoping

| Chunk | File | ~Lines |
|-------|------|--------|
| Scope | [scope.md](./scope.md) | ~{N} |
| Target Adaptations | [target-adaptations.md](./target-adaptations.md) | ~{N} |
| Install Manifest | [install-manifest.md](./install-manifest.md) | ~{N} |
| Gap Analysis | [gap-analysis.md](./gap-analysis.md) | ~{N} |
| File References | [file-references.md](./file-references.md) | ~{N} |
```

Only include rows for chunks that were actually produced.

## Step 3: Write exports

Update `{PROJECT_PATH}/exports/INDEX.md`:
- If INDEX.md doesn't exist, copy it from `templates/exports-index.md`
- Replace everything between `<!-- BEGIN:brief -->` and `<!-- END:brief -->` with populated table:

```markdown
<!-- BEGIN:brief -->
| Section | File |
|---------|------|
| Scope | [scope.md](../brief/scope.md) |
| Target Adaptations | [target-adaptations.md](../brief/target-adaptations.md) |
| Install Manifest | [install-manifest.md](../brief/install-manifest.md) |
| Gap Analysis | [gap-analysis.md](../brief/gap-analysis.md) |
| File References | [file-references.md](../brief/file-references.md) |
<!-- END:brief -->
```

Only include rows for chunks that were actually produced.

## Step 4: Update state

Update `{PROJECT_PATH}/STATE.md`:
- Set Phase 1 (Brief) status to `complete`
- Record completion date

Write/update `.design/CLAUDE.md` — register the project as started. If the file doesn't exist, read the template from `${CLAUDE_SKILL_DIR}/../../templates/design-claude.md` first. Append under `## Projects`:

```markdown
### {project-name} · in progress · {DATE}
brand: {brand-name} · next: gsp-project-research · .design/projects/{project-name}/
```

## Step 5: Phase transition output

Invoke `/gsp-phase-transition` with phase `brief` and output directory `{PROJECT_PATH}/brief/`.
</process>
</output>
