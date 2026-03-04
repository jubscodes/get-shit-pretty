---
name: gsp:design
description: Design UI/UX screens, flows, and interaction patterns
allowed-tools:
  - Read
  - Write
  - Bash
  - Task
  - Grep
  - Glob
---
<context>
Phase 4 of the GSP design pipeline. Uses the UI/UX Pattern Master prompt to design core screens following Apple HIG and the project's design system. Adapts screen count and scope based on project configuration.
</context>

<objective>
Design core UI/UX screens and interaction flows.

**Input:** `.design/system/SYSTEM.md` + `.design/BRIEF.md`
**Output:** `.design/screens/SCREENS.md` + `.design/screens/exports/` + `.design/exports/INDEX.md` (updated)
**Agent:** `gsp-ui-designer`
</objective>

<execution_context>
@/Users/jubs/.claude/get-shit-pretty/prompts/03-ui-ux-pattern-master.md
@/Users/jubs/.claude/get-shit-pretty/templates/phases/design.md
@/Users/jubs/.claude/get-shit-pretty/references/apple-hig-patterns.md
</execution_context>

<process>
## Step 1: Load context

Read:
- `.design/BRIEF.md` — app type, audience, goals
- `.design/system/SYSTEM.md` — design system to use
- `.design/brand/IDENTITY.md` — brand personality
- `.design/config.json` — get `implementation_target`, `design_scope`

If SYSTEM.md doesn't exist, tell the user to run `/gsp:system` first.

## Step 1.5: Scope check

**If `design_scope` is `tokens`:**
1. Update `.design/STATE.md` — set Phase 4 (Design) status to `skipped`
2. Display: "Design phase skipped — design scope is `tokens` (system/token refresh only). No screens to design."
3. Route: "Run `/gsp:review` for design critique and accessibility audit."
4. Stop here.

**If `design_scope` is `partial`:**
Read BRIEF.md "Target screens" to get the specific screen list. Pass this to the agent instead of "8 core screens".

## Step 2: Load existing components inventory

When `implementation_target` is `shadcn`, `rn-reusables`, `existing`, or `code` (anything except `figma`):

**If `.design/codebase/INVENTORY.md` exists**, read it and use as the Existing Components inventory. Pass to the agent.

**If INVENTORY.md doesn't exist** (legacy projects without codebase analysis), fall back to scanning the codebase:
- Look for `components/`, `src/components/`, `components/ui/`, `lib/components/`
- Look for shadcn `components/ui/` or RN Reusables `components/ui/`
- Look for layout files, page/screen files
- Build an Existing Components inventory from what's found

Pass this inventory to the agent so screen designs can reference existing components.

## Step 3: Spawn UI designer

Spawn the `gsp-ui-designer` agent with:
- All prior artifacts
- The UI/UX Pattern Master prompt (03)
- The design output template
- The Apple HIG patterns reference
- The `implementation_target` value
- The `design_scope` value
- The target screens list (when `partial` scope)
- The existing components inventory (if gathered in Step 2)
- The INVENTORY.md content (when exists — for referencing existing components and patterns)

The agent should deliver:
1. User personas with goals and pain points
2. Information architecture
3. Navigation pattern and gesture definitions
4. Core screens with wireframes, components, interactions:
   - `full` scope: 8 core screens (default)
   - `partial` scope: only the target screens specified in the brief
5. All states: empty, error, loading
6. Accessibility specs (WCAG, VoiceOver, Dynamic Type)
7. Micro-interactions and animations
8. Responsive behavior across breakpoints
9. **Component Plan** (when target is not `figma`)
10. Designer's notes

## Step 4: Write output

Write screens to `.design/screens/SCREENS.md`.

## Step 4.5: Generate chunked exports

After writing SCREENS.md, the agent generates agent-consumable chunks:

1. Create `.design/screens/exports/` with one file per screen:
   - `screen-01-{name}.md`, `screen-02-{name}.md`, etc. (~150-200 lines each)
2. Create `.design/screens/exports/shared/` with global sections:
   - `personas.md`, `information-architecture.md`, `navigation.md`, `micro-interactions.md`, `responsive.md`
   - `component-plan.md` (omit when `implementation_target` is `figma`)
3. Update `.design/exports/INDEX.md` — replace the `<!-- BEGIN:screens -->` … `<!-- END:screens -->` section with populated screen and shared tables

Each chunk follows the standard format: header with phase/source/date, exact content from monolith (no summarization), and `## Related` footer with links to related chunks.

Screen chunks' `## Related` section links to component chunks in `../../system/exports/components/{name}.md`.

## Step 5: Update state

Update `.design/STATE.md`:
- Set Phase 4 (Design) status to `complete`
- Record completion date

## Step 6: Route next

Display screen summary (screen count, key flows) and end with:

**When `implementation_target` is `skip`:**
"Run `/gsp:review` for design critique and accessibility audit."

**Otherwise:**
"Run `/gsp:spec` to generate implementation specifications."
</process>
